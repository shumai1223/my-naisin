// T-Y14 tottori: data.mjs(目視転記)から src/data/school-selection-methods/tottori.ts を生成する。使い方: node ops/baselines/tottori-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Z, T } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
let out = '';
let recs = 0;
const push = (name, dept, cat, itv, ratio, note) => {
  out += `    {\n      schoolName: ${q(name)},\n      department: ${q(dept)},\n      selectionCategory: ${q(cat)},\n      interviewRequired: ${itv},\n${ratio ? `      ratioType: ${q(ratio)},\n` : ''}      note: ${q(note)},\n    },\n`;
  recs++;
};
const base = (e) => `【令和9年度 募集生徒数及び入学者選抜検査内容等一覧表・${e.course}】募集生徒数${e.teiin}名${e.kengai != null ? (e.kengai === '*' ? '(うち県外生徒数の上限は定めない)' : '(うち県外生徒数' + e.kengai + '人以内)') : ''}`;
const seenGen = new Set();
for (const e of Z) {
  const k = e.school + '|' + e.dept;
  if (!seenGen.has(k)) {
    seenGen.add(k);
    push(e.school, e.dept, '一般入学者選抜', true, `調査書の合計評定${e.ratio}:学力検査の合計得点250`, `${base(e)}。一般入学者選抜: 学力検査は5教科(国語・社会・数学・理科・英語、聞き取り検査を含む)250点満点、調査書の合計評定:学力検査の合計得点=${e.ratio}:250(およその比率${e.ratio === 130 ? '3.4:6.6' : e.ratio === 195 ? '4.4:5.6' : '5.1:4.9'})、その他の検査内容は面接(全校で実施)。`);
  }
  if (e.tokuN != null) {
    push(e.school, e.dept, e.tokuName ? `特色入学者選抜(${e.tokuName})` : '特色入学者選抜', /面接/.test(e.tokuTest), '', `${base(e)}。特色入学者選抜: 募集人員${e.tokuN}人以内${e.tokuOut != null ? (e.tokuOut === '*' ? '(うち県外生徒数の上限は定めない)' : '(うち県外生徒' + e.tokuOut + '人程度)') : ''}、実施検査内容:${e.tokuTest}。出願要件・選抜方法・出願する際の評定の目安は資料本文にあり本DBには未収録。`);
  }
}
for (const e of T) {
  const c = `${e.school} 定時制`;
  push(e.school, `${e.dept}(定時制)`, '一般入学者選抜', true, '調査書の合計評定150:学力検査の合計得点150', `${base(e)}。一般入学者選抜(定時制): 学力検査は3教科(${e.subj})150点満点、調査書の合計評定:学力検査の合計得点=150:150、その他の検査内容は面接。`);
  if (e.tokuN != null) push(e.school, `${e.dept}(定時制)`, '特色入学者選抜', true, '', `${base(e)}。特色入学者選抜: 募集人員${e.tokuN}人以内、実施検査内容:${e.tokuTest}。`);
}
const names = new Set([...Z.map((e) => e.school), ...T.map((e) => e.school)]);
const ts = `// 鳥取県: 令和9年度鳥取県立高等学校募集生徒数及び入学者選抜検査内容等一覧表(全日制・定時制)。
//
// 一次ソース: 鳥取県教育委員会「令和9年度鳥取県立高等学校募集生徒数及び入学者選抜検査内容等一覧表」
// (\`https://www.pref.tottori.lg.jp/secure/1429535/R08_bosyuuseitosuu_kensanaiyoutou.pdf\`・全10頁・
// 県ページ \`https://www.pref.tottori.lg.jp/328170.htm\`・2026-06公表・令和8年度版の転記を令和9年度の画像(全11頁)を目視して更新=2026-09-21。『*』は資料の注『県外生徒数の上限を定めないことを示している』)。転記データと生成スクリプトは ops/baselines/tottori-transcription/ に保存。
//
// 鳥取県の一般入学者選抜は全日制の全校で学力検査5教科(250点満点)+面接を実施し、調査書の合計評定:学力検査の合計得点の比を学校ごとに
// 130:250(およそ3.4:6.6)/195:250(4.4:5.6)/260:250(5.1:4.9)のいずれかに定める(8:2〜2:8の範囲)。特色入学者選抜は学科ごとの募集人員(人以内)・
// うち県外生徒・実施検査内容(面接・作文・小論文・プレゼンテーション・実技・学力検査)を公表している。
// 検算: 全日制の募集生徒数(3,614)・特色募集人員(969)と、定時制の募集生徒数(220)・特色募集人員(18)が資料の小計行と一致。
// 未収録: 特色入学者選抜の出願要件・選抜方法・出願する際の評定の目安(資料本文)・通信制課程。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const TOTTORI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'tottori',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`全日制22校(募集生徒数3,614名)・定時制4校(220名)の一般入学者選抜(比率)と特色入学者選抜(募集人員・検査内容)を完全収録(${names.size}校・${recs}レコード)。特色入学者選抜の出願要件と通信制課程は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.tottori.lg.jp/328170.htm',
    docTitle: '令和9年度鳥取県立高等学校募集生徒数及び入学者選抜検査内容等一覧表（鳥取県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '一般入学者選抜のratioTypeは調査書の合計評定:学力検査の合計得点(例:195:250)。interviewRequiredは一般入学者選抜で全校が面接を実施するためtrue。特色入学者選抜のinterviewRequiredは実施検査内容に面接を含むか。八頭・鳥取中央育英は特別活動特色選抜とスポーツ活動特色選抜の2枠を別レコードにした。学科をまとめて募集する学科(くくり募集)は学科名に併記した。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/tottori.ts'), ts);
console.log('schools', names.size, 'records', recs);
