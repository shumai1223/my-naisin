// T-Y14 okinawa: rows.txt(目視転記)から src/data/school-selection-methods/okinawa.ts を生成する。使い方: node ops/baselines/okinawa-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const rows = fs.readFileSync(path.join(dir, 'rows.txt'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('|'));
const SPECIAL = { x: '特別枠なし', o: '特別枠あり(Web出願システムでのチェック不要)', O: '特別枠あり(Web出願システムの「特別枠」欄にチェックが必要)' };
let out = '';
let cur = '';
let curNo = '';
const names = new Set();
let total = 0;
for (const r of rows) {
  if (r[2]) { cur = r[2]; curNo = r[1]; }
  names.add(cur);
  const [no, , , course, dept, cs, teiin, pct, sp, ratio] = r;
  total += Number(teiin);
  const dname = `${dept}${cs ? '(' + cs + ')' : ''}${course === '定時' ? '(定時制)' : ''}`;
  const [c, g] = ratio.split(':');
  const note = `【令和9年度 特色選抜特別枠・比重一覧・No.${no}・学校番号${curNo}・${course === '全日' ? '全日制' : '定時制'}】定員${teiin}名。特色選抜の募集人員の割合${pct}%(特別枠を含む割合・以内)。${SPECIAL[sp]}。一般選抜での調査書と学力検査等の成績との比重${c}対${g}(調査書:学力検査等)。特色選抜における特別枠や配点等は各校の募集要項で確認する必要がある。`;
  out += `    {\n      schoolName: ${q(cur)},\n      department: ${q(dname)},\n      selectionCategory: '一般選抜',\n      interviewRequired: false,\n      ratioType: ${q(`調査書${c}:学力検査等${g}`)},\n      note: ${q(note)},\n    },\n`;
}
const ts = `// 沖縄県: 令和9年度(2027年度入学者選抜)沖縄県立高等学校「特色選抜に係る募集人員の特別枠の設置」及び「(一般選抜)調査書と学力検査等の成績との比重」一覧。
//
// 一次ソース: 沖縄県教育委員会「令和9年度「特色選抜に係る募集人員の特別枠の設置」及び「(一般選抜)調査書と学力検査等の成績の比重」一覧」
// (\`https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/041/122/09hijyu4.pdf\`・4頁・
// 県ページ \`https://www.pref.okinawa.jp/kyoiku/gakko/1008883/1008887/1041122.html\`・2026-09-19 pdftoppm 110dpiで目視転記)。
// 転記データと生成スクリプトは ops/baselines/okinawa-transcription/ に保存。
//
// 全日制・定時制の全59校164行(学科・コース別)について、定員・特色選抜募集人員の割合・特別枠の有無・
// 一般選抜の調査書:学力検査等の比重(5:5が大半・4.5:5.5・4:6の学校[名護・読谷・具志川・コザ・普天間・首里東・那覇・知念・宮古=4.5:5.5、
// 球陽・那覇国際・首里・開邦・向陽=4:6])を収録した。検算: 全行の定員合計が資料の合計行14,720と一致。
// 未収録: 各校の特色選抜の配点・検査内容(募集要項)・学力検査の教科別配点。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const OKINAWA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'okinawa',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`全日制・定時制の全${names.size}校${rows.length}行(定員合計${total.toLocaleString('en-US')}名)の特別枠・比重一覧を完全収録。各校の特色選抜の配点・検査内容は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.okinawa.jp/kyoiku/gakko/1008883/1008887/1041122.html',
    docTitle: '令和9年度「特色選抜に係る募集人員の特別枠の設置」及び「(一般選抜)調査書と学力検査等の成績の比重」一覧（沖縄県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは一般選抜での調査書:学力検査等の比重。特色選抜の募集人員の割合は特別枠を含む割合(以内)。interviewRequiredは本資料に面接の記載が無いためfalse(未確認の意味ではなく、資料の対象外)。令和9年度が対象で、令和8年度の比重(5:5が主)とは学校により異なる場合がある。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/okinawa.ts'), ts);
console.log('schools', names.size, 'rows', rows.length, 'total', total);
