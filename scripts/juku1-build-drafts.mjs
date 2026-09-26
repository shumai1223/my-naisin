// T-JUKU1 Step4/6: TARGETS.csv から1社ごとの営業メール本文を生成する(送信はしない)。
// 使い方: node scripts/juku1-build-drafts.mjs [--status 未着手] [--kind mail|form] [--limit 25] [--from 1]
// 出力: ops/deliverables/juku1/drafts/generated/<id>.txt (件名: 行 + 空行 + 本文)
import fs from 'node:fs';
const D = 'ops/deliverables/juku1';
const a = {};
for (let i = 2; i < process.argv.length; i += 2) a[process.argv[i].slice(2)] = process.argv[i + 1];
const status = a.status ?? '未着手';
const kind = a.kind ?? 'mail';
const limit = Number(a.limit ?? 25);

function parseCsv(t) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const rows = parseCsv(fs.readFileSync(`${D}/TARGETS.csv`, 'utf8').replace(/^\uFEFF/, ''));
const head = rows[0];
const targets = rows.slice(1).filter((r) => r.length >= head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
const inv = JSON.parse(fs.readFileSync('ops/raw/juku1-gsc-by-pref-agg.json', 'utf8'));
const clicks = Object.fromEntries(inv.prefs.map((p) => [p.pref, p.total]));
const NAMES = { tokyo: '東京都', kanagawa: '神奈川県', osaka: '大阪府', hokkaido: '北海道', chiba: '千葉県', fukuoka: '福岡県', hiroshima: '広島県', shiga: '滋賀県', hyogo: '兵庫県', kyoto: '京都府', aichi: '愛知県', ishikawa: '石川県', nagasaki: '長崎県', gifu: '岐阜県', nara: '奈良県', ibaraki: '茨城県', saitama: '埼玉県', tochigi: '栃木県', niigata: '新潟県', yamaguchi: '山口県', mie: '三重県', miyagi: '宮城県', nagano: '長野県', gunma: '群馬県', kumamoto: '熊本県', shizuoka: '静岡県', kochi: '高知県', okinawa: '沖縄県', toyama: '富山県', fukushima: '福島県', oita: '大分県' };
// 県別枠の価格は在庫ランク別(👤確定 2026-09-26): A(月300クリック以上)30,000 / B(100〜299)20,000 / C(30〜99)10,000
const priceOf = (c) => (c >= 300 ? '30,000' : c >= 100 ? '20,000' : '10,000');
const footer = fs.readFileSync(`${D}/drafts/${kind === 'form' ? 'FORM' : 'LEGAL'}-FOOTER.txt`, 'utf8').trim();
// 送る順: 全国枠 → A → B → C(同ランク内は id 順)
const rankOf = (t) => (t['県'] === 'national' ? 0 : clicks[t['県']] >= 300 ? 1 : clicks[t['県']] >= 100 ? 2 : 3);
const tplPref = fs.readFileSync(`${D}/drafts/TEMPLATE-pref.md`, 'utf8').replace(/^<!--.*-->\n/, '');
const tplNat = fs.readFileSync(`${D}/drafts/TEMPLATE-national.md`, 'utf8').replace(/^<!--.*-->\n/, '');
fs.mkdirSync(`${D}/drafts/generated`, { recursive: true });
if (a.out) fs.mkdirSync(a.out, { recursive: true });
const picked0 = targets.filter((t) => t['状態'] === status && t['窓口種別'] === kind && (t['県'] === 'national' || clicks[t['県']] >= 30)).sort((x, y) => rankOf(x) - rankOf(y) || x['id'].localeCompare(y['id']));
// 同ランクの県(東京・神奈川など)が交互に並ぶよう、県内の通し番号で並べ替える
const ord = {}; const cnt = {};
for (const t of picked0) { cnt[t['県']] = (cnt[t['県']] ?? 0) + 1; ord[t['id']] = cnt[t['県']]; }
const picked = picked0.slice().sort((x, y) => rankOf(x) - rankOf(y) || ord[x['id']] - ord[y['id']] || x['id'].localeCompare(y['id'])).slice(Number(a.from ?? 1) - 1, Number(a.from ?? 1) - 1 + limit);
// 一言メモは調査員のメモ書きで文章にならないため、送信文に使う語句は drafts/phrases.json に人が書いたものだけを使う(無い行は生成しない)
const phrases = JSON.parse(fs.readFileSync(`${D}/drafts/phrases.json`, 'utf8'));
let skipped = 0; const skippedIds = [];
for (const t of picked) {
  if (!phrases[t['id']]) { skipped++; skippedIds.push(t['id']); continue; }
  const tpl = t['県'] === 'national' ? tplNat : tplPref;
  const body = tpl
    .replaceAll('{塾名}', t['塾名']).replaceAll('{県名}', NAMES[t['県']] ?? t['県'])
    .replaceAll('{一言メモ}', phrases[t['id']]).replaceAll('{価格}', priceOf(clicks[t['県']])).replaceAll('{クリック数}', String(clicks[t['県']] ?? ''))
    .replaceAll('{法定表示}', footer);
  fs.writeFileSync(`${D}/drafts/generated/${t['id']}.txt`, body, 'utf8');
}
console.log(`phrases無しでスキップ ${skipped}件: ${skippedIds.join(' ')}`);
console.log(`generated ${picked.length - skipped} drafts (status=${status}, kind=${kind})`);
