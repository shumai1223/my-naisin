// T-Y14 saitama R9: 概要一覧3本(共通選抜のみ/特色選抜のみ/両方)の抽出結果(rows-*.json)から src/data/school-selection-methods/saitama.ts を生成する。
// 令和9年度は制度が変わり(全校で面接・共通選抜/特色選抜・第1次/第2次の選抜資料配点)、令和8年度の『選抜基準』(第1〜3次選抜の割合・調査書の基本方針)とは表の構成が別物のため、R8レコードは引き継がず全面置換する。
// 使い方: リポジトリ直下から node ops/baselines/saitama-r9/gen-r9.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const kyo = load('rows-kyoutsuu.json');
const tok = load('rows-tokusyoku.json');
const ryo = load('rows-ryouhou.json');
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const clean = (s) => (s || '').normalize('NFKC').replace(/\s+/g, '').replace(/[’']/g, '');
const school = (r) => clean(r.schoolDP || r.school);
const dept = (r) => clean(r.dept) + (r.course === '定' ? '(定時制)' : '');
const S = (s, withToku) => {
  const g = s.gaku ?? 500;
  return `学力${g}:調査書${s.cho}:面接${s.itv}` + (withToku && s.toku ? `:特色検査${s.toku}` : '') + `=${s.total}`;
};
const ratioTxt = (r, n) => {
  const rt = n === 1 ? r.ratio1 : r.ratio2;
  const ch = n === 1 ? r.ch1 : r.ch2;
  return `${clean(rt)}(${ch}点)`;
};
const secondOf = (r) => clean(r.second).replace(/^なし$/, 'なし');
// 個票(kohyo/*.pdf・154本187頁・確定版)の本文: parse-kohyo.py が表の行帯ごとに抽出→kohyo-pages.json。概要一覧の行(学校・学科・課程)と表題行(課程・学校名・学科)で1対1に対応づける
const KH = load('kohyo-pages.json');
const khNorm = (s) => clean(s).replace(/^埼玉県立/, '').replace(/^(さいたま|川越)市立/, '市立').replace(/高等学校$/, '');
const KHM = new Map();
for (const p of KH) {
  const k = p.kind + '|' + khNorm(p.school) + '|' + clean(p.dept) + (p.course === '定時制' ? '(定時制)' : '');
  if (KHM.has(k)) throw new Error('個票の重複 ' + k);
  KHM.set(k, p);
}
const khUsed = new Set();
const j = (a) => (a || []).join('/');
const kh = (r, kind, forToku) => {
  const k = kind + '|' + school(r) + '|' + dept(r);
  const p = KHM.get(k);
  if (!p) throw new Error('個票なし ' + k);
  khUsed.add(k);
  let t = `【個票(確定版)】目指す学校像: ${clean(j(p.gakkozo))}。入学者の受入れに関する方針(アドミッション・ポリシー): ${p.ap.map(clean).join(' / ')}。面接の実施方法: ${clean(j(p.itv_method))}。自己評価資料の学校独自項目: ${clean(j(p.itv_self))}。面接の評価の観点: ${clean(j(p.itv_kanten))}。面接の評価規準: ${clean(j(p.itv_kijun))}。`;
  const tc = clean(j(p.toku_content));
  if (forToku && tc && tc !== '実施しない') t += `特色検査の実施内容: ${tc}。特色検査の評価の観点: ${clean(j(p.toku_kanten)) || '設定なし'}。`;
  return t;
};
const recs = [];
const push = (r, category, sub, ratioType, note) => recs.push({ school: school(r), dept: dept(r), category, ratioType, note });
const common = (r, kind) => {
  const stage = (n) => `第${n}次(${n === 1 ? r.pct1 : r.pct2})[${S(n === 1 ? r.s1 : r.s2, false)}]`;
  const ratioType = `${stage(1)}/${stage(2)}`;
  const own = r.itvOwn ? '(自己評価資料に学校独自項目あり)' : '';
  const note =
    `【令和9年度 各高等学校の選抜実施内容(概要一覧・${kind})・${r.course === '定' ? '定時制' : '全日制'}】募集人員の割合は第1次${r.pct1}・第2次${r.pct2}。` +
    `調査書の各学年の比率は第1次${ratioTxt(r, 1)}・第2次${ratioTxt(r, 2)}。面接は${clean(r.itvType)}面接${own}。` +
    (r.gakkoSentaku ? '学校選択問題(数学・英語)を実施。' : '') +
    (r.keisha ? `傾斜配点: ${clean(r.keisha)}。` : '') +
    `選抜資料の配点(学力+調査書+面接=合計): 第1次${S(r.s1, false)}、第2次${S(r.s2, false)}。第2志望: ${secondOf(r)}。その他: ${clean(r.other) || 'なし'}。` +
    kh(r, '共通', false);
  push(r, '共通選抜', null, ratioType, note);
};
for (const r of kyo) common(r, '共通選抜のみ');
for (const r of tok) {
  const stage = (n) => `第${n}次(${n === 1 ? r.pct1 : r.pct2})[${S(n === 1 ? r.s1 : r.s2, true)}]`;
  const own = r.itvOwn ? '(自己評価資料に学校独自項目あり)' : '';
  const note =
    `【令和9年度 各高等学校の選抜実施内容(概要一覧・特色選抜のみ)・${r.course === '定' ? '定時制' : '全日制'}】募集人員の割合は第1次${r.pct1}・第2次${r.pct2}。` +
    `調査書の各学年の比率は第1次${ratioTxt(r, 1)}・第2次${ratioTxt(r, 2)}。面接は${clean(r.itvType)}面接${own}。` +
    (r.tokusyokuKensa ? `特色検査: ${clean(r.tokusyokuKensa)}。` : '') +
    (r.gakkoSentaku ? '学校選択問題(数学・英語)を実施。' : '') +
    (r.keisha ? `傾斜配点: ${clean(r.keisha)}。` : '') +
    `選抜資料の配点(学力+調査書+面接${tok.some(() => true) ? '(+特色検査)' : ''}=合計): 第1次${S(r.s1, true)}、第2次${S(r.s2, true)}。第2志望: ${secondOf(r)}。その他: ${clean(r.other) || 'なし'}。` +
    kh(r, '特色', true);
  push(r, '特色選抜', null, `${stage(1)}/${stage(2)}`, note);
}
for (const r of ryo) {
  const base =
    `募集人員の割合は特色選抜${r.pct1}・共通選抜${r.pct2}。面接は${clean(r.itvType)}面接${r.itvOwn ? '(自己評価資料に学校独自項目あり)' : ''}。` +
    (r.gakkoSentaku ? '学校選択問題(数学・英語)を実施。' : '') +
    (r.keisha ? `傾斜配点: ${clean(r.keisha)}。` : '') +
    `第2志望: ${secondOf(r)}。その他: ${clean(r.other) || 'なし'}。`;
  push(r, '特色選抜', null, `特色選抜(${r.pct1})[${S(r.s1, true)}]`, `【令和9年度 各高等学校の選抜実施内容(概要一覧・特色選抜及び共通選抜の両方を実施・特色選抜)・全日制】${base}調査書の各学年の比率は特色選抜${ratioTxt(r, 1)}。選抜資料の配点(学力+調査書+面接=合計): ${S(r.s1, true)}。${kh(r, '特色・共通', true)}`);
  push(r, '共通選抜', null, `共通選抜(${r.pct2})[${S(r.s2, false)}]`, `【令和9年度 各高等学校の選抜実施内容(概要一覧・特色選抜及び共通選抜の両方を実施・共通選抜)・全日制】${base}調査書の各学年の比率は共通選抜${ratioTxt(r, 2)}。選抜資料の配点(学力+調査書+面接=合計): ${S(r.s2, false)}。${kh(r, '特色・共通', false)}`);
}
if (khUsed.size !== KH.length) throw new Error('個票の未使用ページ ' + (KH.length - khUsed.size));
const names = new Set(recs.map((r) => r.school));
const body = recs
  .map((r) => `    {\n      schoolName: ${q(r.school)},\n      department: ${q(r.dept)},\n      selectionCategory: ${q(r.category)},\n      interviewRequired: true,\n      ratioType: ${q(r.ratioType)},\n      note: ${q(r.note)},\n    },`)
  .join('\n');
const ts = `// 埼玉県: 令和9年度埼玉県公立高等学校入学者選抜における各高等学校の選抜実施内容(概要一覧)。
//
// 一次ソース: 埼玉県教育委員会「令和9年度埼玉県公立高等学校入学者選抜における各高等学校の選抜実施内容(確定版・令和8年5月29日掲載)」
// (県ページ \`https://www.pref.saitama.lg.jp/f2208/r9nyuushi-senbatsuzisshinaiyou.html\`)の概要一覧3本
// (\`/documents/277139/1_r9_kyoutsuu.pdf\`=共通選抜のみ・8頁 / \`2_r9_tokusyoku.pdf\`=特色選抜のみ・5頁 / \`3_r9_tokusyoku_kyoutsuu.pdf\`=両方・1頁)。
// 2026-09-20にcurlで取得しpdftotext -bboxの座標から機械抽出(ops/baselines/saitama-r9/・全行で 学力+調査書+面接(+特色検査)=合計 を検算済み)。
//
// ★令和9年度は入試制度が変わった: 全ての受検生に面接(集団面接または個人面接)を実施し、選抜は共通選抜(第1次・第2次の2段階)と特色選抜(第1次・第2次)に分かれ、
// 学校ごとに募集人員の割合・調査書の各学年の比率(1:1:1=135点/1:1:2=180点/1:1:3=225点ほか)・第1次と第2次それぞれの選抜資料の配点(学力検査・調査書・面接[・特色検査])が定められている。
// 令和8年度の『選抜基準』(第1〜3次選抜の割合・調査書の基本方針)とは表の構成が異なるため、令和8年度のレコードは引き継がず全面的に置換した(令和8年度版はgit履歴)。
// 学校別の個票(各校の選抜実施内容・確定版・154本187頁=概要一覧の全行と1対1)の本文は2026-09-22に収録した: 目指す学校像・入学者の受入れに関する方針(アドミッション・ポリシー)・面接の実施方法/自己評価資料の学校独自項目/評価の観点/評価規準・特色検査の実施内容(ops/baselines/saitama-r9/parse-kohyo.py)。
// 未収録: 各校の学校選択問題の内容など個票に載らない事項。
// 概要一覧の対象: 共通選抜のみ${kyo.length}行・特色選抜のみ${tok.length}行・特色選抜及び共通選抜の両方${ryo.length}行(→${ryo.length * 2}レコード)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const SAITAMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'saitama',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`概要一覧3本(共通選抜のみ・特色選抜のみ・両方)の${names.size}校・${recs.length}レコードを完全収録(募集人員の割合・調査書の各学年の比率・面接方法・第1次/第2次の選抜資料配点・第2志望)。学校別の個票(目指す学校像・アドミッション・ポリシー・面接の実施方法と自己評価資料の項目・評価の観点と規準・特色検査の実施内容)も全レコードに収録`)},
  schools: [
${body}
  ],
  source: {
    url: 'https://www.pref.saitama.lg.jp/f2208/r9nyuushi-senbatsuzisshinaiyou.html',
    docTitle: '令和9年度埼玉県公立高等学校入学者選抜における各高等学校の選抜実施内容（確定版）（埼玉県教育委員会）',
    lastChecked: '2026-09-20',
  },
  note: 'ratioTypeは「第1次(割合)[学力:調査書:面接(:特色検査)=合計]/第2次(割合)[...]」。学力検査の点数は概要一覧で空欄(=標準の500点)の行を500として記載し、合計との整合で検算した。interviewRequiredは令和9年度は全校で面接を実施するためtrue。定時制は学科名に(定時制)を付した。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/saitama.ts'), ts);
console.log('schools', names.size, 'records', recs.length, '共通', kyo.length, '特色', tok.length, '両方', ryo.length);
