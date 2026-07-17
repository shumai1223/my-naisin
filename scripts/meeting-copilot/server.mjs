// 商談副操縦士サーバー
// claude CLI を stream-json モードで常駐させ(起動~35秒は初回のみ)、
// 以降の各質問を同一プロセスに流すことで応答2〜5秒を実現する。
// MCP はロードしない(--strict-mcp-config)・cwd はこのディレクトリ(プロジェクト設定を拾わせない)。
//
// 1プロセスに全ターンを流し続けると、会話履歴が積み上がって
// 毎ターンそれを読み直すぶん応答がじわじわ遅くなる(長い商談ほど顕著)。
// これを防ぐため、一定ターン数ごとに裏で新しいプロセスをウォームアップし、
// 準備でき次第、応答を止めずに切り替える(ローテーション)。
import http from 'node:http';
import { readFileSync, readdirSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import os from 'node:os';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const CLAUDE_EXE = process.env.CLAUDE_EXE || 'C:/Users/E24054/.local/bin/claude.exe';
const PORT = Number(process.env.COPILOT_PORT || 3456);
const MODEL = process.env.COPILOT_MODEL || 'haiku';
const TURN_TIMEOUT_MS = 90_000;
// 会話履歴が伸びて応答が遅くなる前に、裏でプロセスを入れ替える間隔(ターン数)
const ROTATE_AFTER_TURNS = Number(process.env.COPILOT_ROTATE_AFTER || 8);

const SYSTEM_PROMPT = readFileSync(join(DIR, 'prompt.md'), 'utf8');

// 「どこにも保存しない」保証: claude CLIがローカルに残すセッションログ
// (~/.claude/projects/<このcwdのslug>/*.jsonl)を起動時と終了時に削除する。
// 終了時はプロセスがまだ書き込み中で消せないことがあるため、次回起動時の削除が保険になる。
function wipeSessionLogs() {
  try {
    const root = join(os.homedir(), '.claude', 'projects');
    for (const d of readdirSync(root)) {
      if (d.includes('meeting-copilot')) rmSync(join(root, d), { recursive: true, force: true });
    }
  } catch {}
}

// ---- claude プロセス1本ぶんの状態(セッション)を作る --------------------
function createSession() {
  const session = { child: null, ready: false, pending: null, queue: [], turnCount: 0 };

  session.child = spawn(
    CLAUDE_EXE,
    [
      '-p',
      '--model', MODEL,
      '--input-format', 'stream-json',
      '--output-format', 'stream-json',
      '--verbose',
      '--strict-mcp-config',
      '--mcp-config', '{"mcpServers":{}}',
      '--include-partial-messages',
    ],
    // MAX_THINKING_TOKENS=0: 思考ブロックを無効化。有効だと3行の回答に~17秒の長考が挟まり
    // 「瞬間回答」にならない(実測: thinking有=TTFB19s / 無=数秒)
    { cwd: DIR, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, MAX_THINKING_TOKENS: '0' } },
  );

  let buf = '';
  session.child.stdout.on('data', (d) => {
    buf += d.toString();
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      let ev;
      try { ev = JSON.parse(line); } catch { continue; }
      if (ev.type === 'stream_event') {
        const delta = ev.event?.delta;
        if (delta?.type === 'text_delta' && delta.text && session.pending?.onDelta) session.pending.onDelta(delta.text);
      } else if (ev.type === 'result') {
        console.log(`[copilot] turn done: ${((ev.duration_ms ?? 0) / 1000).toFixed(1)}s (api ${((ev.duration_api_ms ?? 0) / 1000).toFixed(1)}s) [turn ${session.turnCount + 1}/${ROTATE_AFTER_TURNS}]`);
        onResult(session, ev);
      }
    }
  });
  session.child.stderr.on('data', (d) => console.error('[claude:stderr]', d.toString().slice(0, 500)));
  session.child.on('exit', (code) => onSessionExit(session, code));

  return session;
}

function sendTurnOn(session, text, onDelta) {
  return new Promise((resolve, reject) => {
    session.queue.push({ text, resolve, reject, onDelta });
    drainQueue(session);
  });
}

function drainQueue(session) {
  if (session.pending || session.queue.length === 0 || !session.child) return;
  const { text, resolve, reject, onDelta } = session.queue.shift();
  const timer = setTimeout(() => {
    console.error('[copilot] ターンがタイムアウト。プロセスを再起動します');
    session.pending = null;
    reject(new Error('turn timeout'));
    try { session.child.kill(); } catch {}
  }, TURN_TIMEOUT_MS);
  session.pending = { resolve, reject, timer, onDelta };
  session.child.stdin.write(
    JSON.stringify({ type: 'user', message: { role: 'user', content: [{ type: 'text', text }] } }) + '\n',
  );
}

function onResult(session, ev) {
  if (!session.pending) return;
  const { resolve, reject, timer } = session.pending;
  clearTimeout(timer);
  session.pending = null;
  session.turnCount += 1;
  if (ev.is_error) reject(new Error(String(ev.result || 'claude error')));
  else resolve(String(ev.result ?? ''));
  drainQueue(session);
  if (session === active && !rotating && session.turnCount >= ROTATE_AFTER_TURNS) startRotation();
}

async function warmupSession(session) {
  const t0 = Date.now();
  const r = await sendTurnOn(
    session,
    `以下があなたへのシステム指示。全て記憶し、以後この指示に従うこと。返事は「OK」のみ。\n\n${SYSTEM_PROMPT}`,
  );
  // セッション上限などはエラーでなく本文として返ることがある
  if (/session limit|usage limit|rate limit/i.test(r)) throw new Error(r.slice(0, 120));
  session.ready = true;
  console.log(`[copilot] セッション準備完了 (${((Date.now() - t0) / 1000).toFixed(1)}秒)`);
}

// ---- アクティブセッションの管理・無停止ローテーション ---------------------
let active = null;
let rotating = false;
let rotatingSession = null; // ウォームアップ中の交代要員(プロセス終了時のクリーンアップ用)
let lastError = null;

function onSessionExit(session, code) {
  if (session.pending) {
    session.pending.reject(new Error('claude process exited'));
    clearTimeout(session.pending.timer);
    session.pending = null;
  }
  if (session !== active) return; // ローテーションで退役済みの旧セッションなら無視してよい
  console.error(`[copilot] claudeプロセスが終了(code=${code})。3秒後に再起動します`);
  active = null;
  rotating = false;
  setTimeout(bootstrapActive, 3000);
}

async function bootstrapActive() {
  console.log('[copilot] ウォームアップ中(初回のみ〜40秒)...');
  const session = createSession();
  try {
    await warmupSession(session);
    active = session;
    lastError = null;
    console.log(`[copilot] 準備完了 -> http://localhost:${PORT}`);
  } catch (e) {
    lastError = e.message;
    console.error('[copilot] ウォームアップ失敗:', e.message, '→ 60秒後に再試行');
    try { session.child.kill(); } catch {}
    setTimeout(bootstrapActive, 60_000);
  }
}

function startRotation() {
  rotating = true;
  console.log('[copilot] 会話が伸びてきたため裏で新しいプロセスを準備します(応答は止めない)');
  const next = createSession();
  rotatingSession = next;
  warmupSession(next)
    .then(() => {
      const old = active;
      active = next;
      rotating = false;
      rotatingSession = null;
      console.log('[copilot] プロセスを無停止で切替完了');
      // 旧プロセスは「処理中のターンが無くなってから」殺す。
      // 固定2秒だと回答中のターンごと切断される(2026-07-17の36問診断でQ15が途中切断)。
      const killWhenIdle = () => {
        if (!old.pending && old.queue.length === 0) {
          try { old.child.kill(); } catch {}
        } else {
          setTimeout(killWhenIdle, 1000);
        }
      };
      setTimeout(killWhenIdle, 2000);
    })
    .catch((e) => {
      console.error('[copilot] ローテーション用プロセスのウォームアップ失敗:', e.message, '→ 今のプロセスを継続使用');
      rotating = false;
      rotatingSession = null;
      try { next.child.kill(); } catch {}
    });
}

function sendTurn(text, onDelta) {
  if (!active?.ready) return Promise.reject(new Error('まだウォームアップ中です。数十秒待ってから再試行してください'));
  return sendTurnOn(active, text, onDelta);
}

// ---- HTTP サーバー --------------------------------------------------------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    try {
      const body = readFileSync(join(DIR, 'public', 'index.html'));
      res.writeHead(200, { 'content-type': MIME['.html'] });
      return res.end(body);
    } catch {
      res.writeHead(500); return res.end('index.html not found');
    }
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ready: !!active?.ready, model: MODEL, error: lastError }));
  }
  if (req.method === 'POST' && req.url === '/suggest') {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', async () => {
      let text;
      try {
        ({ text } = JSON.parse(raw || '{}'));
        if (!text || typeof text !== 'string') throw new Error('text required');
        if (!active?.ready) throw new Error('まだウォームアップ中です。数十秒待ってから再試行してください');
      } catch (e) {
        res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
        return res.end('❌ ' + e.message);
      }
      // 生成テキストを逐次チャンクで流す(ブラウザ側はreaderで読みながら描画)
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-cache' });
      let streamed = 0;
      try {
        const answer = await sendTurn(text.slice(0, 8000), (t) => { streamed += t.length; res.write(t); });
        if (streamed === 0 && answer) res.write(answer); // 部分イベントが来なかった場合の保険
      } catch (e) {
        res.write('\n❌ ' + e.message);
      }
      res.end();
    });
    return;
  }
  res.writeHead(404); res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[copilot] http://localhost:${PORT} で待機中(ウォームアップ完了までサジェストは不可)`);
  wipeSessionLogs();
  bootstrapActive();
});

process.on('exit', () => {
  try { active?.child?.kill(); } catch {}
  try { rotatingSession?.child?.kill(); } catch {}
  wipeSessionLogs();
});
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => process.exit(0));
