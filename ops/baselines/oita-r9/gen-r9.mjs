// T-Y14 oita R9: rows-r9.json(build4.mjs)から src/data/school-selection-methods/oita.ts を生成する。使い方: リポジトリ直下から node ops/baselines/oita-r9/gen-r9.mjs
// 学校名・学科名はPDF一覧のラベル(NN_◯◯高等学校[校舎]_学科)から取る(頁内抽出より確実)。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(fs.readFileSync(path.join(dir, 'rows-r9.json'), 'utf8'));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const cl = (s) => (s || '').normalize('NFKC').replace(/\s+/g, ' ').replace(/'/g, '').trim();
const labelName = (l) => l.replace(/^(資料|選抜の資料|の結果)/, '').replace(/^調査書調査書$/, '調査書');
const parts = (r) => {
  const [, sch, dep] = r.label.split('_');
  let school = sch.replace(/高等学校/, '').replace(/\s+/g, '');
  let course = '全日制';
  if (/（定時制）|\(定時制\)/.test(school)) { school = school.replace(/（定時制）|\(定時制\)/, ''); course = '定時制'; }
  const m = school.match(/^(.+?)(耶馬溪校|[^\s]{2,4}校舎|[^\s]{2,3}校)$/);
  // 『中津南高等学校耶馬溪校』→『中津南(耶馬溪校)』(高等学校の後ろに校名が付く場合)
  const raw = sch.replace(/（定時制）|\(定時制\)/, '');
  const mm = raw.match(/^(.+?)高等学校(.+)$/);
  if (mm && mm[2]) school = `${mm[1]}(${mm[2]})`;
  return { school, dept: (dep || '').trim(), course };
};
const tableText = (tb) => tb.map(([lab, vs]) => labelName(lab) + vs.map(([p, v]) => (p ? p + fmt(v) : fmt(v))).join('/')).join('・');
const ratioOf = (tb) => tb.map(([lab, vs]) => labelName(lab).replace(/\d+$/, '') + (vs.length === 1 && !vs[0][0] ? fmt(vs[0][1]) : '(' + vs.map(([p, v]) => (p ? p.replace(/[【】]/g, '') + ':' : '') + fmt(v)).join('/') + ')')).join(':') + '(比重%)';
let out = '';
let incomplete = 0;
const names = new Set();
for (const r of rows) {
  const { school, dept, course } = parts(r);
  names.add(school);
  const dname = course === '定時制' ? dept + '(定時制)' : dept;
  const okNin = !!r.nin, okKijun = !!r.kijun;
  if (!okNin || !okKijun) incomplete++;
  let note = `【令和9年度 推薦入学者選抜について(第2期公表分)・${course}】募集人員: ${okNin ? cl(r.nin) : '(抽出できず・原資料参照)'}。調査書点に係る基準(1年次・2年次の評定合計に3年次の評定合計を2倍し足した180点満点): ${okKijun ? cl(r.kijun) : '(抽出できず・原資料参照)'}。選抜の資料・比重(%): ${tableText(r.hijuu)}`;
  if (r.hijuu2 && r.hijuu2.length) note += `。自己推薦型(募集人員: ${cl(r.nin2) || '原資料参照'}・調査書点基準: ${cl(r.kijun2) || '原資料参照'})の比重(%): ${tableText(r.hijuu2)}`;
  note += '。';
  out += [
    '    {',
    '      schoolName: ' + q(school) + ',',
    '      department: ' + q(dname) + ',',
    "      selectionCategory: '推薦入学者選抜',",
    '      interviewRequired: true,',
    '      ratioType: ' + q(ratioOf(r.hijuu)) + ',',
    '      note: ' + q(note) + ',',
    '    },',
  ].join(NL) + NL;
}
const ts = `// 大分県: 令和9年度大分県立高等学校入学者選抜 推薦入学者選抜について(学校・学科別の推薦要件・調査書点基準・募集人員・選抜の資料と比重)。
//
// 一次ソース: 大分県教育委員会「令和9年度大分県立高等学校入学者選抜 推薦入学者選抜について【第2期公表分】」
// (\`https://www.pref.oita.jp/site/gakkokyoiku/r09suisen2.html\`・2026-08-31更新・学校・学科別のPDF88本・各2頁)。
// 2026-09-20にcurlで取得しpdftotext -bboxの座標から機械抽出した(ops/baselines/oita-r9/・比重の合計が100%になることを検算)。
// 令和9年度は推薦入試の内容が一部変更されており(募集人員・調査書点基準・比重・自己推薦型の別表・志望学科の合算)、令和8年度のレコードは引き継がず全面的に置換した。
//
// 調査書点は「1年次・2年次の評定合計に3年次の評定合計を2倍し足した180点満点」。選抜の資料は 調査書・調査書と推薦書・面接・小論文(学校により適性検査等)で、
// 比重は学校・学科・活動指定の有無で異なる。募集人員・調査書点基準は原資料の文言を保持した(令和8年度は要約)。
// 未収録: 一般入学者選抜の学校別内容(別資料)・推薦要件の本文(アドミッション・ポリシー等)。第1期公表分は取得時404のため未確認。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const OITA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'oita',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q('推薦入学者選抜について公開された学校・学科別資料(第2期公表分)を完全収録(' + names.size + '校・' + rows.length + 'レコード・全日制と定時制)。原資料の文言を保持。' + (incomplete ? incomplete + '件は募集人員または調査書点基準の欄を機械抽出できず原資料参照。' : '') + '一般入学者選抜(第一次・第二次)の学校別内容と推薦要件の本文は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.oita.jp/site/gakkokyoiku/r09suisen2.html',
    docTitle: '令和9年度大分県立高等学校入学者選抜 推薦入学者選抜について【第2期公表分】（大分県教育委員会）',
    lastChecked: '2026-09-20',
  },
  note: 'ratioTypeは選抜の資料ごとの比重(%)。活動指定あり/なし・志望学科で比重が異なる資料は括弧内に併記した。interviewRequiredは全学科で面接を実施するためtrue。募集人員・調査書点基準は活動指定あり・活動指定なし・志望学科の別に資料のまま記載。自己推薦型の別表を持つ学校はnoteに別掲。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/oita.ts'), ts);
console.log('schools', names.size, 'records', rows.length, '募集人員/基準の欄が空', incomplete);
