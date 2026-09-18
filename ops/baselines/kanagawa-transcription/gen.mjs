// T-Y14 kanagawa: data.mjs(選考基準PDF共通選抜[全日制]の目視転記)から src/data/school-selection-methods/kanagawa.ts を生成する。
// 使い方: node ops/baselines/kanagawa-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D, S } from './data.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
let out = '';
for (const e of D) {
  const ratioType = `第1次選考[学習の記録:学力検査:特色検査=${e.r1}]/第2次選考[学力検査:主体的に学習に取り組む態度:特色検査=${e.r2}]`;
  const parts = [`【選考基準・共通選抜(全日制)頁${e.page}・${e.sec}】学力検査:${e.exam}`, `特色検査:${e.tk === '-' ? '実施しない' : e.tk}`];
  parts.push(`第1次選考の重点化:${e.j1 === '-' ? 'なし' : e.j1}`);
  parts.push(`第2次選考の重点化:${e.j2 === '-' ? 'なし' : e.j2}`);
  let note = parts.join('。') + '。';
  if (e.note) note += e.note;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '共通選抜',\n      interviewRequired: ${e.tk.includes('面接')},\n      ratioType: ${q(ratioType)},\n      note: ${q(note)},\n    },\n`;
}
for (const e of S) {
  const note = `【選考基準・共通選抜(全日制)頁${e.page}・${e.sec}】学力検査:${e.exam}。特色検査:${e.tk}。${e.formula}`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '共通選抜',\n      interviewRequired: ${e.interview},\n      note: ${q(note)},\n    },\n`;
}
const names = new Set([...D, ...S].map((e) => e.name));
const total = D.length + S.length;
const ts = `// 神奈川県: 令和9年度神奈川県公立高等学校入学者選抜「選考基準」共通選抜(全日制)。
//
// 一次ソース: 神奈川県教育委員会「令和9年度神奈川県公立高等学校入学者選抜選考基準及び特色検査の概要」
// (\`https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/senko_kijun.html\`)の「共通選抜(全日制)」PDF
// (\`https://www.pref.kanagawa.jp/documents/63368/01_kyoutsu_zennichi.pdf\`・全5頁・画像PDFでテキスト抽出不可・
// 2026-09-19 pdftoppm 200dpi→目視転記)。凡例PDF(\`00_mikata.pdf\`)で表の見方を確認した。
// 転記データと生成スクリプトは ops/baselines/kanagawa-transcription/ に保存。
//
// 神奈川県の選考は「第1次選考(募集人員の90%まで)」と「第2次選考」の2段階で、資料の比率は
// 第1次=学習の記録(評定):学力検査:特色検査、第2次=学力検査:主体的に学習に取り組む態度(評価):特色検査。
// ratioTypeにその比(例: 5:5:-は特色検査なし)を転記し、重点化(教科の×2/×1.5等)・特色検査の種別(自己表現/面接/実技)・
// 学力検査の教科構成はnoteに転記した。頁5の横浜国際(国際科/国際バカロレア)とクリエイティブスクール5校は
// 比率でなく数式(S値)で選考されるためratioTypeを持たずnoteに数式を転記した。
// 令和9年度の資料(2027年度入学者選抜)。未収録: 定時制・通信制・特別募集等・定通分割選抜・特色検査の概要(別PDF)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const KANAGAWA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'kanagawa',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`共通選抜(全日制)PDF全5頁を完全収録(${names.size}校${total}レコード)。定時制・通信制・特別募集等・定通分割選抜・特色検査の概要(各別PDF)は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/senko_kijun.html',
    docTitle: '令和9年度神奈川県公立高等学校入学者選抜選考基準及び特色検査の概要（共通選抜・全日制）（神奈川県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '第1次選考・第2次選考の比率は資料の表の数字をそのまま転記(合計が10になる比でない場合は特色検査を加えた比)。重点化の[調]は調査書、[学]は学力検査。学力検査は原則5教科(英国数理社)だが、特色検査を実施する学校の一部は3教科(英国数)等。学校名の表記は資料のとおり(旭・横浜旭陵、横浜桜陽・永谷、藤沢清流・深沢は再編・統合校)。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/kanagawa.ts'), ts);
console.log('schools', names.size, 'records', total);
