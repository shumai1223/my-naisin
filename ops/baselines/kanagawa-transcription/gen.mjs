// T-Y14 kanagawa: data.mjs(選考基準PDF共通選抜[全日制]の目視転記)から src/data/school-selection-methods/kanagawa.ts を生成する。
// 使い方: node ops/baselines/kanagawa-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D, S } from './data.mjs';
import { T, X, C, B } from './teiji.mjs';

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
// 定時制・通信制(teiji.mjs・2026-09-22追加)
for (const [name, dept, tk, r1, r2, sec] of T) {
  const ratioType = `第1次選考[学習の記録:学力検査:特色検査=${r1}]/第2次選考[学力検査:主体的に学習に取り組む態度:特色検査=${r2}]`;
  const note = `【選考基準・共通選抜(定時制)・${sec}】学力検査:英国数。特色検査:${tk === '-' ? '実施しない' : tk}。第1次選考の重点化:なし。第2次選考の重点化:なし。`;
  out += `    {\n      schoolName: ${q(name)},\n      department: ${q(dept)},\n      selectionCategory: '共通選抜(定時制)',\n      interviewRequired: ${tk.includes('面接')},\n      ratioType: ${q(ratioType)},\n      note: ${q(note)},\n    },\n`;
}
for (const [name, dept, tk, txt] of X) {
  out += `    {\n      schoolName: ${q(name)},\n      department: ${q(dept)},\n      selectionCategory: '共通選抜(定時制)',\n      interviewRequired: true,\n      note: ${q(`【選考基準・共通選抜(定時制)・単位制による定時制 普通科(県立横浜明朋高等学校及び県立相模向陽館高等学校)】学力検査:英国数。特色検査:${tk}。${txt}`)},\n    },\n`;
}
for (const [name, dept, tk, txt] of C) {
  out += `    {\n      schoolName: ${q(name)},\n      department: ${q(dept)},\n      selectionCategory: '共通選抜(通信制)',\n      interviewRequired: false,\n      note: ${q(`【選考基準・共通選抜(通信制)・単位制による通信制 普通科】実施する検査:${tk}。${txt}`)},\n    },\n`;
}
for (const [name, dept, tk, r, sec] of B) {
  const ratioType = `定通分割選抜[学習の記録:学力検査:特色検査=${r}]`;
  const note = `【選考基準・定通分割選抜(定時制)・${sec}】学力検査:英国数。特色検査:${tk === '-' ? '実施しない' : tk}。比重は1段階のみ(第1次・第2次選考の区別なし)。重点化:なし。`;
  out += `    {
      schoolName: ${q(name)},
      department: ${q(dept)},
      selectionCategory: '定通分割選抜(定時制)',
      interviewRequired: ${tk.includes('面接')},
      ratioType: ${q(ratioType)},
      note: ${q(note)},
    },
`;
}
for (const [name, dept, tk, txt] of C) {
  out += `    {
      schoolName: ${q(name)},
      department: ${q(dept)},
      selectionCategory: '定通分割選抜(通信制)',
      interviewRequired: false,
      note: ${q(`【選考基準・定通分割選抜(通信制)・単位制による通信制 普通科】共通選抜(通信制)と同一の内容。実施する検査:${tk}。${txt}`)},
    },
`;
}
// 特別募集(04_tokubetsuboshuu.pdf・5頁・テキスト層あり): ops/baselines/kanagawa-r9/ext04b.py(罫線+座標の行帯抽出)→ext04c.py→fin04.py→tokubetsu04-final.json。評価の観点(面接・作文・課題レポート等の観点別の箇条書き)は転記していない。
const TK = JSON.parse(fs.readFileSync(path.join(dir, '../kanagawa-r9/tokubetsu04-final.json'), 'utf8'));
for (const r of TK) {
  const note = `【選考基準・${r.cat}・04_tokubetsuboshuu.pdf 頁${r.page}】実施する検査:${r.kensa}。選考方法: ${r.method} 提出書類:${r.docs}。`;
  out += `    {
      schoolName: ${q(r.school)},
      department: ${q(r.dept)},
      selectionCategory: ${q(r.cat)},
      interviewRequired: ${r.kensa.includes('面接')},
      note: ${q(note)},
    },
`;
}
const names = new Set([...D, ...S].map((e) => e.name));
const total = D.length + S.length + T.length + X.length + C.length + B.length + C.length + TK.length;
const allNames = new Set([...D, ...S].map((e) => e.name).concat(T.map((e) => e[0]), X.map((e) => e[0]), C.map((e) => e[0]), B.map((e) => e[0]), TK.map((e) => e.school)));
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
// 令和9年度の資料(2027年度入学者選抜)。定時制(02_kyoutsu_teiji.pdf・1頁・25学科の比率表+横浜明朋・相模向陽館の数式4行)と通信制(03_kyoutsu_tsuushin.pdf・横浜修悠館・厚木清南の作文)は2026-09-22にテキスト層の座標抽出と頁画像で突合して追加した(転記=ops/baselines/kanagawa-transcription/teiji.mjs)。
// 定通分割選抜(05_bunkatsu.pdf・定時制19行+通信制2行)も同日追加した。
// 特別募集(04_tokubetsuboshuu.pdf・53レコード)も追加した。
// 未収録: 特色検査の概要(別PDF)・特別募集の評価の観点の箇条書き。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const KANAGAWA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'kanagawa',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`共通選抜(全日制)PDF全5頁を完全収録(全日制${names.size}校${D.length + S.length}レコード)。共通選抜の定時制(${T.length + X.length}レコード=比率表${T.length}+横浜明朋・相模向陽館の数式${X.length})と通信制(${C.length}レコード)、定通分割選抜(定時制${B.length}+通信制${C.length}レコード)、特別募集(連携募集・海外帰国生徒・在県外国人等・インクルーシブ教育実践推進校・中途退学者・別科の${TK.length}レコード)も収録(計${allNames.size}校${total}レコード)。特色検査の概要(別PDF)と特別募集の評価の観点の箇条書きは未収録`)},
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
console.log('schools', allNames.size, 'records', total);
