// hiroshima.ts(頁3)を令和9年度版へ更新する。R8/R9のbbox帯比較(banddiff.mjs)で確認した差分のみを反映:
//  ①定員枠の人数は『-』(未定)になった ②広島市立広島工業が6学科→3(探究科)に再編 ③安西の二次選抜の独自検査が面接のみ100点→面接+作文200点・比重600/200/200→400/200/400
const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/hiroshima.ts';
let s = fs.readFileSync(f, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');
const rep = (from, to, expect = 1) => {
  const n = s.split(from).length - 1;
  if (n !== expect) throw new Error(`一致数 ${n} != ${expect}: ${from.slice(0, 70)}`);
  s = s.split(from).join(to);
};
// ① 定員枠の人数
const before = (s.match(/定員枠(\d+)%\((\d+)人\)/g) || []).length;
s = s.replace(/定員枠(\d+)%\((\d+)人\)/g, '定員枠$1%(人数は令和9年度資料では未定「-」)');
console.log('定員枠の置換', before);
if ((s.match(/定員枠\d+%\(\d+人\)/g) || []).length) throw new Error('人数が残っている');
// ③ 安西 二次選抜
const anRe = /(schoolName: '安西',\n\s+department: '普通',\n\s+selectionCategory: '二次選抜',\n\s+interviewRequired: true,\n\s+)note: '[^']*',/;
if (!anRe.test(s)) throw new Error('安西の二次選抜レコードが特定できない');
s = s.replace(anRe, (m, head) => head + "note: '自己表現30点。学校独自検査:面接と作文を組み合わせて実施(合計200点・内訳の記載なし)。比重:調査書400点・自己表現200点・独自検査(面接+作文)400点の1,000点満点換算(令和8年度は面接のみ100点・比重600/200/200だった)',");
// ② 広島市立広島工業の再編
const start = s.indexOf("    {\n      schoolName: '広島市立広島工業',");
const lastIdx = s.lastIndexOf("      schoolName: '広島市立広島工業',");
const endMark = "    },\n";
const end = s.indexOf(endMark, s.indexOf("selectionCategory: '二次選抜'", lastIdx)) + endMark.length;
if (start < 0 || end < start) throw new Error('広島市立広島工業の範囲が特定できない');
const depts = [
  ['情報工学・デザイン工学(情報デザイン探究科)', '※1', '情報工学科・デザイン工学科は「情報デザイン探究科」'],
  ['自動車(自動車探究科)', '※2', '自動車科は「自動車探究科」'],
  ['機械・電気・建築(ものづくり探究科)', '※3', '機械科・電気科・建築科は「ものづくり探究科」'],
];
const rec = (dept, cat, ratio, note) => {
  const lines = ["    {", "      schoolName: '広島市立広島工業',", `      department: '${dept}',`, `      selectionCategory: '${cat}',`, '      interviewRequired: false,'];
  if (ratio) lines.push(`      ratioType: '${ratio}',`);
  lines.push(`      note: '${note}',`, '    },');
  return lines.join('\n') + '\n';
};
let gen = '';
for (const [d, mark, txt] of depts) {
  const ann = `令和9年度資料の注記${mark}: 広島市立広島工業高等学校の${txt}として募集を行う`;
  gen += rec(d, '特色枠による選抜', '学力300:調査500:表現200(独自検査なし)', `定員枠50%(人数は令和9年度資料では未定「-」)。学力検査:標準=合計250点。調査書:標準225点。自己表現30点。学校独自検査の実施なし。比重は学力300:調査500:表現200(広島市立広島商業と同じ調査書重視の重み付け)。${ann}`);
  gen += rec(d, '一般枠による選抜', '学力:調査書:自己表現=6:2:2(独自検査なし・換算後点数は資料に明記なし)', `定員枠50%(人数は令和9年度資料では未定「-」)。学力検査:標準=合計250点。調査書:標準225点。自己表現30点。学校独自検査の実施なし。${ann}`);
  gen += rec(d, '二次選抜', '', `自己表現30点。学校独自検査:面接を実施(30点)。比重:調査書600点・自己表現200点・独自検査(面接)200点の1,000点満点換算。「その他」欄に●。${ann}`);
}
s = s.slice(0, start) + gen + s.slice(end);
// ヘッダ・出典・注記
rep("  fiscalYear: '令和8年度（2026年度）',", "  fiscalYear: '令和9年度（2027年度）',");
rep("    url: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/646901.pdf',\n    docTitle: '令和8年度広島県公立高等学校入学者選抜の実施内容(実施内容一覧表)',\n    lastChecked: '2026-09-18',", "    url: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/678267.pdf',\n    docTitle: '令和9年度広島県公立高等学校入学者選抜の実施内容(実施内容一覧表)',\n    lastChecked: '2026-09-20',");
rep("// 広島県: 「令和8年度広島県公立高等学校入学者選抜の実施内容」（広島県教育委員会公式ページ", "// ✅2026-09-20 令和9年度版(`https://www.pref.hiroshima.lg.jp/uploaded/attachment/678267.pdf`・更新2026-08-17・全8頁)へ更新した。\n// 頁3のR8/R9を座標(bbox)で学科帯ごとに突合し、差分(定員枠の人数が未定『-』になった・広島市立広島工業が探究科3つに再編・安西の二次選抜の独自検査が面接+作文200点に変更)のみ反映。\n// 記号(●/2倍)の個数と数値は他の学科で全て一致(ops/baselines/hiroshima-r9/banddiff.mjs)。以下は令和8年度版収録時の記録:\n//\n// 広島県: 「令和8年度広島県公立高等学校入学者選抜の実施内容」（広島県教育委員会公式ページ");
rep("    '全8頁のうち頁3(全日制課程[本校]一覧・16校27学科)を完全収録(中区/東区: 広島国泰寺/広島市立基町/広島市立舟入/広島商業/広島市立広島商業/広島皆実、南区: 広島工業/広島市立広島工業、", "    '【令和9年度版】全8頁のうち頁3(全日制課程[本校]一覧・14校27学科)を収録(中区/東区: 広島国泰寺/広島市立基町/広島市立舟入/広島商業/広島市立広島商業/広島皆実、南区: 広島工業/広島市立広島工業[探究科3つに再編]、");
rep("  note: '学力検査の「2倍」は", "  note: '【令和9年度版】入学定員・定員枠の人数は資料上『-』(未定)のため定員枠は割合(%)のみ記載。広島市立広島工業は6学科から「情報デザイン探究科(情報工学・デザイン工学)/自動車探究科/ものづくり探究科(機械・電気・建築)」の3募集に再編。安西の二次選抜は独自検査が面接のみ(100点)から面接+作文(200点)に変更。学力検査の「2倍」は");
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(f, s);
console.log('patched hiroshima.ts');
