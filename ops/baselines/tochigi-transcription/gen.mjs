// T-Y14 tochigi: data.mjs(目視転記)から src/data/school-selection-methods/tochigi.ts を生成する。使い方: node ops/baselines/tochigi-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
let out = '';
for (const e of D) {
  const tkParts = [`特色選抜の定員の割合${e.tk}`, `面接(${e.tkInt})`];
  if (e.essay) tkParts.push(`${e.essay}(${e.min}・${e.chars})`);
  if (e.own) tkParts.push(`学校独自検査:${e.own}`);
  const tkNote = `【全日制課程の入学者選抜の方法等 No.${e.no}】男女:${e.sex}。特色選抜: ${tkParts.join('、')}。`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '特色選抜',\n      interviewRequired: true,\n      note: ${q(tkNote)},\n    },\n`;
  const gNote = `【全日制課程の入学者選抜の方法等 No.${e.no}】男女:${e.sex}。一般選抜: 学力検査と調査書の評定との比重の置き方${e.g}:${e.c}。面接:${e.genInt ? e.genInt + '面接' : 'なし'}。`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '一般選抜',\n      interviewRequired: ${Boolean(e.genInt)},\n      ratioType: ${q(`学力検査${e.g}:調査書の評定${e.c}`)},\n      note: ${q(gNote)},\n    },\n`;
}
const names = new Set(D.map((e) => e.name));
const ts = `// 栃木県: 令和8(2026)年度県立高等学校全日制課程の入学者選抜の方法等。
//
// 一次ソース: 栃木県教育委員会「令和8(2026)年度県立高等学校全日制課程の入学者選抜の方法等について」
// (\`https://www.pref.tochigi.lg.jp/m04/r08/documents/20250520202321.pdf\`・全3頁・画像PDFでテキスト抽出不可・
// 2026-09-19 pdftoppm 130dpi→目視転記。県ページ: \`.../m04/r08/r08_kennritukoutougakkounyuugakushasennbatunikannsuruosirase.html\`)。
// 転記データと生成スクリプトは ops/baselines/tochigi-transcription/ に保存。
//
// 栃木県は「特色選抜」(面接+作文または小論文、宇都宮東/栃木は学校作成問題)と「一般選抜」(学力検査と調査書の
// 評定の比重[例:9:1〜5:5]・面接の有無)を学校・学科別に表で公表する。特色選抜は定員の割合(10%程度〜100%)・
// 面接の種別・作文/小論文の時間と字数・学校独自検査をnoteに、一般選抜はratioTypeに比重・面接の有無を転記した。
// 表の注記: 中高一貫に係る併設型高等学校のうち宇都宮東高校については一般選抜を行わないことがある(特色選抜100%)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const TOCHIGI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'tochigi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`全日制課程全3頁を完全収録(${names.size}校・${D.length}学科・特色選抜と一般選抜の各1レコードで${D.length * 2}レコード)。定時制・通信制は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/20250520202321.pdf',
    docTitle: '令和8(2026)年度県立高等学校全日制課程の入学者選抜の方法等（栃木県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '一般選抜のratioTypeは「学力検査:調査書の評定」の比重。特色選抜のinterviewRequiredは表の面接欄(個人面接または集団面接)に○がある学科で、全学科で面接を課す。特色選抜の定員割合は「程度」の表記のまま転記。学力検査の教科数・配点は本表に無く未収録。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/tochigi.ts'), ts);
console.log('schools', names.size, 'depts', D.length, 'records', D.length * 2);
