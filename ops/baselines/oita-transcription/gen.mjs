// T-Y14 oita: data.mjs(目視転記)から src/data/school-selection-methods/oita.ts を生成する。使い方: node ops/baselines/oita-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROWS } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const ratioOf = (h) => h.map((x) => x[0] + fmt(x[1])).join(':') + '(比重%)';
let out = '';
for (const r of ROWS) {
  const isTei = r.school.includes('(定時制)');
  const school = r.school.replace('(定時制)', '');
  const dept = isTei ? r.dept + '(定時制)' : r.dept;
  const course = isTei ? '定時制' : '全日制';
  let note = '【令和8年度 推薦入学者選抜について・' + course + '】募集人員: ' + r.nin + '。調査書点に係る基準(1年次・2年次の評定合計に3年次の評定合計を2倍し足した180点満点): ' + r.kijun + '。選抜の資料・比重(%): ' + r.hijuu.map((x) => x[0] + fmt(x[1]) + (x[2] != null ? '(' + x[2] + '点)' : '')).join('・');
  if (r.alt) note += '。' + r.alt.label + 'は比重が異なり ' + r.alt.hijuu.map((x) => x[0] + fmt(x[1])).join('・');
  if (r.memo) note += '。' + r.memo;
  note += '。';
  const lines = [
    '    {',
    '      schoolName: ' + q(school) + ',',
    '      department: ' + q(dept) + ',',
    "      selectionCategory: '推薦入学者選抜',",
    '      interviewRequired: true,',
    '      ratioType: ' + q(ratioOf(r.hijuu)) + ',',
    '      note: ' + q(note) + ',',
    '    },',
  ];
  out += lines.join(NL) + NL;
}
const names = new Set(ROWS.map((r) => r.school.replace('(定時制)', '')));
const ts = `// 大分県: 令和8年度大分県立高等学校入学者選抜 推薦入学者選抜について(学校・学科別の推薦要件・調査書点基準・募集人員・選抜の資料と比重)。
//
// 一次ソース: 大分県教育委員会「令和8年度大分県立高等学校入学者選抜 推薦入学者選抜について」
// (\`https://www.pref.oita.jp/site/gakkokyoiku/r08suisen-001.html\`・学校・学科別のPDF88本・各1頁(大分上野丘のみ2頁)・2026-09-19 pdftoppm 100dpiで実画像を目視転記)。
// 転記データと検算スクリプトは ops/baselines/oita-transcription/ に保存(pdf-list.tsv=通番→PDF)。
//
// 大分県は推薦入学者選抜で、学校・学科ごとに「推薦要件」「調査書点に係る基準」「評価の観点」「比重(割合)」を公開している。
// 調査書点は「1年次・2年次の評定合計に3年次の評定合計を2倍し足した180点満点」。選抜の資料は 調査書・調査書と推薦書・面接・小論文(学校により適性検査)で、
// 比重は学校・学科・活動指定の有無で異なる。全88レコードで比重の合計が100%に一致することを検算した(ops/.../check.mjs)。
// 未収録: 一般入学者選抜(第一次・第二次)の学校別内容(別資料)・推薦要件の本文(アドミッション・ポリシー等)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const OITA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'oita',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q('推薦入学者選抜について公開された学校・学科別資料を完全収録(' + names.size + '校・' + ROWS.length + 'レコード・全日制と定時制)。一般入学者選抜(第一次・第二次)の学校別内容と推薦要件の本文は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.oita.jp/site/gakkokyoiku/r08suisen-001.html',
    docTitle: '令和8年度大分県立高等学校入学者選抜 推薦入学者選抜について（大分県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは選抜の資料ごとの比重(%)。活動指定あり/なし・志望学科で比重が異なる学科はnoteに別掲。interviewRequiredは全学科で面接を実施するためtrue(中津東定時制・大分工業定時制は1人2回の個人面接)。募集人員は活動指定あり・活動指定なし・志望学科の別に資料のまま記載。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/oita.ts'), ts);
console.log('schools', names.size, 'records', ROWS.length);
