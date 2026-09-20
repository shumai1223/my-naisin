// 学校ごと(全頁連結)に、部活動・競技名の語の集合をR8とR9で比較し、差のある校を出す(数値差が出ない指定部活動の変更検出用)
import { execFileSync } from 'child_process';
const KEYRE = /(\d\d)_?([^\d\/／（(【]+(?:[（(【][^）)】]*[）)】])?)\d[\/／]\d$/;
const WORDS = ['野球', 'ソフトボール', 'サッカー', 'バスケットボール', 'バレーボール', 'バドミントン', '卓球', '陸上競技', '剣道', '柔道', 'ソフトテニス', '硬式テニス', '吹奏楽', '合唱', '水泳', 'ハンドボール', 'ラグビー', 'スキー', 'ボート', 'ホッケー', '自転車', 'ダンス', '弓道', '空手', 'レスリング', 'ウエイトリフティング', '体操', '相撲', 'ボクシング', 'なぎなた', 'アーチェリー', 'カヌー', '美術', '書道', '放送', '演劇', '軽音楽', '写真', '吹奏', 'サイクリング', '新体操', 'フェンシング', '山岳', 'スケート', 'アイスホッケー'];
const load = (pdf) => {
  const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))[1];
  const out = new Map();
  for (let p = 1; p <= n; p++) {
    const t = execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 });
    const lines = t.split('\n'); let key = null;
    for (const l of lines) { const m = KEYRE.exec(l.replace(/\s+/g, '')); if (m) { key = m[2].replace(/（[^）]*）|【[^】]*】|\([^)]*\)/g, '').replace(/^郡山北工$/, '郡山北工業'); if (!key) continue; break; } }
    if (!key) continue;
    out.set(key, (out.get(key) ?? '') + t.replace(/\s+/g, ''));
  }
  return out;
};
const a = load('r8.pdf'), b = load('r9.pdf');
for (const [k, v] of b) {
  const u = a.get(k); if (!u) continue;
  const w8 = WORDS.filter((w) => u.includes(w)), w9 = WORDS.filter((w) => v.includes(w));
  const only8 = w8.filter((w) => !w9.includes(w)), only9 = w9.filter((w) => !w8.includes(w));
  // 括弧内の性別表記(男子/女子)の変化も検出: 競技名+性別
  const g = (t) => new Set([...t.matchAll(/(野球|サッカー|バスケットボール|バレーボール|陸上競技|剣道|柔道|ソフトテニス|硬式テニス|卓球|バドミントン|ハンドボール|水泳)[（(](男子?・?女子?|男|女)[）)]/g)].map((m) => m[1] + m[2]));
  const g8 = g(u), g9 = g(v); const d8 = [...g8].filter((x) => !g9.has(x)), d9 = [...g9].filter((x) => !g8.has(x));
  if (only8.length || only9.length || d8.length || d9.length) console.log(`${k}: R8のみ[${only8}] R9のみ[${only9}] 性別表記 R8のみ[${d8}] R9のみ[${d9}]`);
}
