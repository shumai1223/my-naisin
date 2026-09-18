// T-Y14 miyazaki: data.mjs(目視転記)から src/data/school-selection-methods/miyazaki.ts を生成する。使い方: node ops/baselines/miyazaki-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROWS } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const NAMES = ['国語', '社会', '数学', '理科', '英語'];
let out = '';
for (const e of ROWS) {
  const gaku = e.subj ? e.subj.reduce((a, b) => a + b, 0) : 0;
  const parts = [];
  if (e.subj) parts.push(`学力検査${gaku}`);
  parts.push(`面接${e.itv}`);
  if (e.tek) parts.push(`適性検査等${e.tek}`);
  parts.push(`調査書${e.cho}`);
  const ratio = `${parts.join(':')}(計${e.kei})`;
  const subjText = e.subj
    ? `学力検査は${NAMES.map((n, i) => `${n}${e.subj[i]}`).join('・')}の計${gaku}点`
    : '学力検査は実施しない';
  const tekText = e.tek ? `、適性検査等${e.tek}点` : '';
  const memo = e.memo ? `。${e.memo}` : '';
  const note = `【令和8年度 一般入学者選抜 募集定員及び検査内容・${e.course}】定員${e.teiin}名。${subjText}、面接${e.itv}点(${e.itvType}面接)${tekText}、調査書${e.cho}点、合計${e.kei}点${memo}。推薦・連携型入学者選抜は別資料のため本レコードには未収録。`;
  out += `    {\n      schoolName: ${q(e.school)},\n      department: ${q(e.course === '定時制' ? `${e.dept}(定時制)` : e.dept)},\n      selectionCategory: '一般入学者選抜',\n      interviewRequired: true,\n      ratioType: ${q(ratio)},\n      note: ${q(note)},\n    },\n`;
}
const names = new Set(ROWS.map((e) => e.school));
const zen = ROWS.filter((e) => e.course === '全日制').reduce((a, e) => a + e.teiin, 0);
const tei = ROWS.filter((e) => e.course === '定時制').reduce((a, e) => a + e.teiin, 0);
const ts = `// 宮崎県: 令和8年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容(全日制・定時制)。
//
// 一次ソース: 宮崎県教育委員会「令和8年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容」
// (令和7年8月4日発表資料【一般入学者選抜の検査内容等】・\`https://www.pref.miyazaki.lg.jp/documents/99874/99874_20250731195130-1.pdf\`・全4頁・
// 県ページ \`https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20250618193442.html\`・2026-09-19 pdftoppm 110dpiで目視転記)。
// 転記データと検算スクリプトは ops/baselines/miyazaki-transcription/ に保存。
//
// 宮崎県の一般入学者選抜は学科ごとに 学力検査(国語・社会・数学・理科・英語)・面接・調査書(・適性検査等)の各配点を公表している。
// 学力検査は原則各教科100点だが、数学と英語を150点(または125点)とする学科(傾斜配点)がある。面接・調査書の配点は学校・学科ごとに異なる。
// 検算: 全レコードで 学力検査+面接+適性検査等+調査書 が資料の「計」列に一致(ops/.../check.mjs)。全日制の定員合計${zen}名・定時制${tei}名。
// 未収録: 推薦・連携型入学者選抜(自己推薦方式・スポーツ推薦方式等)の募集人員割合・検査内容、通信制課程。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const MIYAZAKI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'miyazaki',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`一般入学者選抜の全日制(定員${zen}名)・定時制(${tei}名)の学科別配点(学力検査・面接・調査書・適性検査等)を完全収録(${names.size}校・${ROWS.length}レコード)。推薦・連携型入学者選抜と通信制課程は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20250618193442.html',
    docTitle: '令和8年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容（宮崎県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは 学力検査点:面接点:(適性検査等点):調査書点(計) の配点表記。学力検査は数学・英語のみ100点でなく150点/125点とする傾斜配点学科があり、各レコードのnoteに教科別配点を記載。interviewRequiredは全学科で面接を実施するためtrue(定時制普通科も個人面接あり)。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/miyazaki.ts'), ts);
console.log('schools', names.size, 'records', ROWS.length, '全日制', zen, '定時制', tei);
