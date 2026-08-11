#!/usr/bin/env node
/**
 * Λ-21 第3層: Discord 双方向ブリッジ（ユタ滞在中の遠隔操作・9/7必達）
 *
 * 起動: node --use-system-ca scripts/discord-bridge.mjs
 *       （`npm run discord:bridge`）
 *
 * ── 安全設計（👤が2026-08-11に「書き込みコマンド全許可」と裁定。ただし下記の枠は外さない）──
 *  1. 二重ロック   : DISCORD_CONTROL_CHANNEL_ID 固定 ＋ DISCORD_CONTROL_ALLOWED_USER_IDS の allowlist
 *                    どちらか一方でも合わなければ**黙って無視**する（攻撃側に存在を知らせない）
 *  2. 既定は読み取り専用 : 書き込み系は `!w ` 接頭辞が必要
 *  3. タイムアウト  : 1コマンド 10分で強制終了
 *  4. 同時実行1本   : 実行中は新しいコマンドを受け付けない
 *  5. 全ログ記録    : 実行者・コマンド・結果を logs/discord-bridge.log へ追記
 *  6. 二段確認      : 対外送信に該当するコマンドは `!confirm <6桁>` を要求（10分で失効）
 *
 * ⚠️ env が1つでも欠けていたら起動しない（fail-closed）。秘密はコードに書かない。
 */
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = 'C:\\Users\\E24054\\my-naisin';
const LOG_DIR = path.join(REPO, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'discord-bridge.log');
const TIMEOUT_MS = 10 * 60 * 1000;
const CONFIRM_TTL_MS = 10 * 60 * 1000;
const MAX_REPLY = 1800; // Discord の 2000 字上限に対する安全余裕

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CONTROL_CHANNEL_ID;
const ALLOWED = (process.env.DISCORD_CONTROL_ALLOWED_USER_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

for (const [name, v] of [
  ['DISCORD_BOT_TOKEN', TOKEN],
  ['DISCORD_CONTROL_CHANNEL_ID', CHANNEL_ID],
  ['DISCORD_CONTROL_ALLOWED_USER_IDS', ALLOWED.length ? 'set' : ''],
]) {
  if (!v) {
    console.error(`[bridge] ${name} が未設定のため起動しません（fail-closed）。`);
    process.exit(2);
  }
}

fs.mkdirSync(LOG_DIR, { recursive: true });
function log(line) {
  const stamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `${stamp} ${line}\n`, 'utf8');
}

/**
 * 二重起動ガード。
 * 自動起動（ログオン時タスク）と手動のダブルクリックが重なると2本走り、
 * `!w` 系のコマンドが**2回実行される**。それを防ぐ。
 * ただしクラッシュ後の残骸ロックで永久に起動できなくならないよう、
 * 記録されたPIDが**生きている場合だけ**拒否する。
 */
const LOCK_FILE = path.join(LOG_DIR, 'discord-bridge.pid');
function isAlive(pid) {
  try {
    process.kill(pid, 0); // シグナルを送らずに存在確認
    return true;
  } catch (e) {
    return e.code === 'EPERM'; // 存在するが権限が無い＝生きている
  }
}
if (fs.existsSync(LOCK_FILE)) {
  const prev = Number.parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
  if (Number.isInteger(prev) && prev !== process.pid && isAlive(prev)) {
    console.error(`[bridge] 既に pid=${prev} で起動しています。二重起動しません。`);
    log(`DUPLICATE_START_REFUSED existing_pid=${prev}`);
    process.exit(3);
  }
  log(`STALE_LOCK_TAKEOVER previous_pid=${prev}`); // 前回の異常終了の痕跡
}
fs.writeFileSync(LOCK_FILE, String(process.pid), 'utf8');
function releaseLock() {
  try {
    if (fs.readFileSync(LOCK_FILE, 'utf8').trim() === String(process.pid)) fs.unlinkSync(LOCK_FILE);
  } catch {
    /* 既に消えている場合は何もしない */
  }
}
process.on('exit', releaseLock);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => {
    releaseLock();
    process.exit(0);
  });
}

/** 実行中フラグ（同時実行1本）。 */
let running = false;
/** 二段確認の保留（1件のみ保持）。 */
let pending = null; // { code, label, run, expiresAt }

/** PowerShell を1本走らせ、stdout+stderr を文字列で返す。10分でkill。 */
function run(command, { cwd = REPO } = {}) {
  return new Promise((resolve) => {
    const child = spawn(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', command],
      { cwd, env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' } }
    );
    let out = '';
    const push = (b) => {
      out += b.toString();
      if (out.length > 200_000) out = out.slice(-200_000);
    };
    child.stdout.on('data', push);
    child.stderr.on('data', push);
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      out += '\n[bridge] 10分でタイムアウトしたため強制終了しました。';
    }, TIMEOUT_MS);
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, out: out.trim() || '(出力なし)' });
    });
    child.on('error', (e) => {
      clearTimeout(timer);
      resolve({ code: -1, out: `[bridge] 起動に失敗: ${e.message}` });
    });
  });
}

function chunk(text) {
  const t = text.length > MAX_REPLY ? `${text.slice(0, MAX_REPLY)}\n…(以下省略)` : text;
  return '```\n' + t.replace(/```/g, "'''") + '\n```';
}

/**
 * 長文を Discord の2000字上限で分割して順に送る（`chunk()` と違い切り捨てない）。
 * `!ask` の回答は数千字になりうるため、こちらを使う。
 */
async function sendLong(msg, text) {
  const body = text.trim() || '(出力なし)';
  const parts = [];
  for (let i = 0; i < body.length; i += MAX_REPLY) parts.push(body.slice(i, i + MAX_REPLY));
  for (const [i, p] of parts.entries()) {
    const suffix = parts.length > 1 ? `\n\n— ${i + 1}/${parts.length}` : '';
    if (i === 0) await msg.reply(p + suffix);
    else await msg.channel.send(p + suffix);
  }
}

// ── 第4層: Claude Code をヘッドレスで1本起動して答えさせる ──────────────
const CLAUDE_EXE = process.env.CLAUDE_EXE || 'C:/Users/E24054/.local/bin/claude.exe';
const ASK_MODEL = process.env.DISCORD_ASK_MODEL || 'sonnet';

/**
 * ヘッドレス側に必ず被せる枠。
 * ここで縛るのは **C7ゲート（👤の承認が要る領域）** と、
 * Discord という細い画面に返すための出力形式の2点だけ。
 */
const ASK_GUARD = [
  'あなたは my-naishin.com（中学生向け内申点・偏差値計算サイト）の運用を手伝うエージェントです。',
  'Discord から呼び出されており、回答はスマホの画面で読まれます。',
  '',
  '【出力】日本語。結論を最初の1〜2行に書く。全体で2000字以内。表は使わず箇条書きにする。',
  '【根拠】憶測で答えない。実ファイル・実コマンドの結果・MCPの実データだけを根拠にする。',
  '  分からない場合は「分からない」と書く。数値を出すときは出典（ファイル名や取得元）を添える。',
  '',
  '【絶対に行わないこと（👤の明示承認が必要な領域）】',
  '  - 対外メールの送信（下書きの作成までは可）',
  '  - 本番D1の破壊的操作（DROP・列削除・データ書き換え）',
  '  - 環境変数・機能フラグの変更',
  '  - Stripe の操作、価格の決定',
  '  - PII（生徒の氏名・住所・学校名・個人のメールアドレス）をファイルに記録すること',
  '  - 学校別の偏差値・合格ボーダーの独自推定（Y-0憲法。教委等の公表値のみ扱う）',
].join('\n');

/**
 * claude CLI を1本だけ起動して、その回答テキストを返す。
 * write=false のときは編集系ツールを渡さない（読み取り＋調査のみ）。
 */
function runClaude(prompt, { write }) {
  const args = [
    '-p',
    prompt,
    '--output-format',
    'text',
    '--model',
    ASK_MODEL,
    '--append-system-prompt',
    ASK_GUARD,
  ];
  if (write) {
    args.push('--permission-mode', 'bypassPermissions');
  } else {
    // 許可リストに無いツールは自動的に拒否される（fail-closed）
    args.push('--allowedTools', 'Read,Grep,Glob,Bash,WebFetch');
  }
  return new Promise((resolve) => {
    const child = spawn(CLAUDE_EXE, args, {
      cwd: REPO,
      env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' },
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (b) => {
      out += b.toString();
      if (out.length > 200_000) out = out.slice(-200_000);
    });
    child.stderr.on('data', (b) => {
      err += b.toString();
      if (err.length > 20_000) err = err.slice(-20_000);
    });
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      out += '\n\n[bridge] 10分でタイムアウトしたため強制終了しました。';
    }, TIMEOUT_MS);
    child.on('close', (code) => {
      clearTimeout(timer);
      const body = out.trim() || `(出力なし)\n${err.trim().slice(0, 1000)}`;
      resolve({ code, out: body });
    });
    child.on('error', (e) => {
      clearTimeout(timer);
      resolve({ code: -1, out: `[bridge] claude の起動に失敗: ${e.message}` });
    });
  });
}

/** 読み取り専用コマンド。ここに無いものは `!w` が必要。 */
const READ_COMMANDS = {
  help: {
    desc: 'コマンド一覧',
    run: async () => ({
      code: 0,
      out: [
        '【読み取り（そのまま打つ）】',
        '  !status   loop稼働・直近コミット・未pushの有無',
        '  !brief    日次ブリーフを今すぐ実行して #naishin-ops へ送る',
        '  !gsc      GSC総計（次元なし・直近7日）',
        '  !d1       D1の主要テーブル件数と、人間のアフィリクリック数',
        '  !log      直近のworklog 30行',
        '  !tasks    A群（期限つきタスク）の進捗',
        '',
        '【AIに調べさせる】',
        '  !ask <質問>      Claude Codeを1本起動し、ファイルやコマンドを実際に見て答えさせる',
        '                   （読み取り専用。編集・commitはしない。数分かかることがある）',
        '',
        '【書き込み（!w を付ける）】',
        '  !w ask <指示>    上記の書き込み版。ファイル修正・commit・pushまでやらせる',
        '  !w note <本文>   質問ノートの冒頭に追記（loopへの指示経路）',
        '  !w stop          loopを停止',
        '  !w start         loopを起動',
        '  !w <PowerShell>  任意のコマンドを実行',
        '',
        '【対外送信に該当するもの】',
        '  実行前に6桁コードを提示します。`!confirm <コード>` で実行（10分で失効）',
      ].join('\n'),
    }),
  },
  status: {
    desc: 'loop稼働状況',
    run: () =>
      run(
        [
          '$p = Get-CimInstance Win32_Process -Filter "Name=\'claude.exe\'" | Where-Object { $_.CommandLine -like \'*my-naisin*\' };',
          'Write-Output ("loop稼働: " + $(if ($p) { "YES (" + ($p | Measure-Object).Count + "本)" } else { "NO" }));',
          'Write-Output ("直近24hのコミット: " + (git log --since=\'24 hours ago\' --oneline | Measure-Object).Count);',
          'Write-Output ("未push: " + (git rev-list --count origin/main..HEAD));',
          'Write-Output "--- 直近5件 ---"; git log --format=\'%h %ad %s\' --date=format:\'%m-%d %H:%M\' -5',
        ].join(' ')
      ),
  },
  brief: { desc: '日次ブリーフを即実行', run: () => run('npx tsx src/scripts/daily-brief-health.ts') },
  gsc: {
    desc: 'GSC総計',
    run: () =>
      run(
        'node --use-system-ca scripts/gsc-pull.mjs --siteUrl "sc-domain:my-naishin.com" --start (Get-Date).AddDays(-10).ToString(\'yyyy-MM-dd\') --end (Get-Date).AddDays(-3).ToString(\'yyyy-MM-dd\') --dimensions date --limit 50'
      ),
  },
  d1: {
    desc: 'D1の件数',
    run: () =>
      run(
        'node scripts/d1q.mjs "SELECT (SELECT COUNT(*) FROM clicks) c_all, (SELECT COUNT(*) FROM clicks WHERE referer LIKE \'https://my-naishin.com/_%\') c_human, (SELECT COUNT(*) FROM leads) leads, (SELECT COUNT(*) FROM parent_funnel_events) parent, (SELECT COUNT(*) FROM stats_submissions WHERE trusted=1) stats_trusted, (SELECT COUNT(*) FROM stats_submissions) stats_all"'
      ),
  },
  log: {
    desc: '直近のworklog',
    run: () =>
      run(
        "$f = Get-ChildItem docs/worklog -Filter *.md | Sort-Object LastWriteTime -Descending | Select-Object -First 1; Write-Output $f.Name; Get-Content $f.FullName -Encoding UTF8 -Tail 30"
      ),
  },
  tasks: {
    desc: 'A群の進捗',
    run: () =>
      run(
        "Get-ChildItem ops/tasks -File | Sort-Object Name | ForEach-Object { '{0,-38} {1}' -f $_.Name, $_.LastWriteTime.ToString('MM-dd HH:mm') }"
      ),
  },
};

/** 対外送信に該当し、二段確認を要するか。 */
function needsConfirm(cmd) {
  return /\b(gmail|send|mail|smtp|sendmail|outreach.*send)\b/i.test(cmd);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});

client.once('clientReady', (c) => {
  log(`bridge started as ${c.user.tag} channel=${CHANNEL_ID} allowlist=${ALLOWED.length}名`);
  console.log(`[bridge] 起動しました: ${c.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  // ── 二重ロック。合わなければ黙って無視（存在を知らせない） ──
  if (msg.author.bot) return;
  if (msg.channelId !== CHANNEL_ID) return;
  if (!ALLOWED.includes(msg.author.id)) {
    log(`DENY user=${msg.author.id} content=${msg.content.slice(0, 200)}`);
    return;
  }
  const raw = msg.content.trim();
  if (!raw.startsWith('!')) return;

  if (running) {
    await msg.reply('⏳ 実行中のコマンドがあります（同時実行は1本まで）。終わるまでお待ちください。');
    return;
  }

  // ── 二段確認の応答 ──
  if (raw.startsWith('!confirm')) {
    const code = raw.slice('!confirm'.length).trim();
    if (!pending) return void (await msg.reply('確認待ちのコマンドはありません。'));
    if (Date.now() > pending.expiresAt) {
      pending = null;
      return void (await msg.reply('⌛ 確認コードが失効しました（10分）。もう一度やり直してください。'));
    }
    if (code !== pending.code) {
      log(`CONFIRM_MISMATCH user=${msg.author.id} given=${code}`);
      return void (await msg.reply('❌ コードが一致しません。'));
    }
    const job = pending;
    pending = null;
    running = true;
    log(`CONFIRMED user=${msg.author.id} label=${job.label}`);
    await msg.reply(`▶️ 実行します: ${job.label}`);
    const r = await job.run();
    running = false;
    log(`DONE(confirmed) exit=${r.code} label=${job.label}`);
    return void (await msg.reply(`exit=${r.code}\n${chunk(r.out)}`));
  }

  // ── 第4層: Claude Code を1本起動して調べさせる（読み取り専用） ──
  if (raw === '!ask' || raw.startsWith('!ask ')) {
    const q = raw.slice(4).trim();
    if (!q) return void (await msg.reply('`!ask` の後に質問を書いてください。例: `!ask 昨日のD1のリード件数と、増えた分の流入元は？`'));
    running = true;
    log(`ASK user=${msg.author.id} len=${q.length} q=${q.slice(0, 200)}`);
    await msg.reply(`🤖 Claude Code を起動しました（${ASK_MODEL}・読み取り専用）。調べて返すまで数分かかることがあります。`);
    await msg.channel.sendTyping().catch(() => {});
    const r = await runClaude(q, { write: false });
    running = false;
    log(`ASK_DONE exit=${r.code} len=${r.out.length}`);
    return void (await sendLong(msg, r.out));
  }

  // ── 読み取り専用 ──
  const readKey = raw.slice(1).split(/\s+/)[0];
  if (READ_COMMANDS[readKey]) {
    running = true;
    log(`READ user=${msg.author.id} cmd=${readKey}`);
    await msg.channel.sendTyping().catch(() => {});
    const r = await READ_COMMANDS[readKey].run();
    running = false;
    return void (await msg.reply(chunk(r.out)));
  }

  // ── 書き込み ──
  if (!raw.startsWith('!w ')) {
    return void (await msg.reply('❓ 未知のコマンドです。`!help` を見てください。書き込みは `!w ` を付けます。'));
  }
  const body = raw.slice(3).trim();
  if (!body) return void (await msg.reply('`!w` の後にコマンドを書いてください。'));

  // !w note <本文> … 質問ノートの冒頭に追記（loopへの指示経路）
  if (body.startsWith('note ')) {
    const text = body.slice(5).trim();
    if (!text) return void (await msg.reply('本文が空です。'));
    running = true;
    log(`WRITE_NOTE user=${msg.author.id} len=${text.length}`);
    const notePath =
      'C:\\Users\\E24054\\.claude\\projects\\c--Users-E24054-my-naisin\\memory\\loop-question-note.md';
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const block = `\n## 🔵 ${stamp} 👤からDiscord経由の指示\n\n${text}\n`;
    let r;
    try {
      const cur = fs.readFileSync(notePath, 'utf8');
      const at = cur.indexOf('\n## ');
      const next = at < 0 ? cur + block : cur.slice(0, at) + block + cur.slice(at);
      fs.writeFileSync(notePath, next, 'utf8');
      r = { code: 0, out: `質問ノートの冒頭に追記しました（${text.length}文字）。\n次のloop周回で読まれます。` };
    } catch (e) {
      r = { code: 1, out: `失敗: ${e.message}` };
    }
    running = false;
    return void (await msg.reply(chunk(r.out)));
  }

  // !w ask <指示> … 第4層の書き込み版。ファイル修正・commit・push までやらせる
  if (body === 'ask' || body.startsWith('ask ')) {
    const q = body.slice(3).trim();
    if (!q) return void (await msg.reply('`!w ask` の後に指示を書いてください。'));
    running = true;
    log(`WRITE_ASK user=${msg.author.id} len=${q.length} q=${q.slice(0, 200)}`);
    await msg.reply(`🤖 Claude Code を起動しました（${ASK_MODEL}・**書き込み可**）。数分かかることがあります。`);
    await msg.channel.sendTyping().catch(() => {});
    const r = await runClaude(q, { write: true });
    running = false;
    log(`WRITE_ASK_DONE exit=${r.code} len=${r.out.length}`);
    return void (await sendLong(msg, r.out));
  }

  const SHORTCUTS = {
    stop: { label: 'loop停止', cmd: 'cmd /c C:\\Users\\E24054\\loop-stop.bat' },
    start: { label: 'loop起動', cmd: 'Start-Process -FilePath C:\\Users\\E24054\\loop-start.bat' },
  };
  const sc = SHORTCUTS[body];
  const label = sc ? sc.label : `PowerShell: ${body.slice(0, 120)}`;
  const command = sc ? sc.cmd : body;

  // ── 対外送信は二段確認 ──
  if (needsConfirm(command)) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    pending = { code, label, run: () => run(command), expiresAt: Date.now() + CONFIRM_TTL_MS };
    log(`CONFIRM_REQUIRED user=${msg.author.id} label=${label} code=${code}`);
    return void (await msg.reply(
      `⚠️ 対外送信に該当する可能性があります。実行するなら10分以内に:\n\`!confirm ${code}\`\n対象: ${label}`
    ));
  }

  running = true;
  log(`WRITE user=${msg.author.id} cmd=${command.slice(0, 300)}`);
  await msg.channel.sendTyping().catch(() => {});
  const r = await run(command);
  running = false;
  log(`DONE exit=${r.code}`);
  await msg.reply(`exit=${r.code}\n${chunk(r.out)}`);
});

client.on('error', (e) => log(`CLIENT_ERROR ${e.message}`));
process.on('unhandledRejection', (e) => log(`UNHANDLED ${e}`));

client.login(TOKEN);
