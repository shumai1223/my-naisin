// T-Y14 saga: data.mjs(付表4-4)・data2.mjs(付表4-5)・data3.mjs(付表4-6)から src/data/school-selection-methods/saga.ts を生成する。使い方: node ops/baselines/saga-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { K1 } from './data.mjs';
import { K2 } from './data2.mjs';
import { T3 } from './data3.mjs';
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
const dj = ['国語', '社会', '数学', '理科', '英語'];
K1.forEach((e, i) => {
  const s = K2[i];
  const pts = e.pts.map((v, j) => `${dj[j]}${v}`).join('・');
  const tilt = e.pts.some((v) => v !== 50) ? `(傾斜配点あり:${dj.filter((_, j) => e.pts[j] !== 50).join('・')}が75点)` : '';
  const base = `【令和8年度 付表4-4/4-5・番号${e.no}】募集定員${e.A}${e.note ? '(' + e.note + ')' : ''}${e.kukuri ? '・くくり募集(◎)' : ''}`;
  push(e.name, e.dept, '一般選抜 選考I', e.c5 > 0, `学力検査${e.gtotal}:調査書${e.c3 + e.c4}:面接${e.c5}${e.jitsugi ? ':実技' + e.jitsugi : ''}`, `${base}。選考I: 募集人員${e.B}人(募集定員に対する${e.pct}%)、選抜順${e.order}、学力検査${e.gtotal}点(${pts})${tilt}${e.jitsugi ? '、実技検査' + e.jitsugi + '点' : ''}、調査書 ③学習の記録${e.c3}点・④学習の記録以外${e.c4}点、⑤面接${e.c5}点、②+③+④+⑤=${e.total}点。`);
  const tot2 = s.jitsugi + s.c3 + s.c4 + s.c5;
  push(e.name, e.dept, '一般選抜 選考II', s.c5 > 0, `学力検査250:調査書${s.c3 + s.c4}:面接${s.c5}${s.jitsugi ? ':実技' + s.jitsugi : ''}`, `${base}。選考II: 募集人員は募集定員から特別選抜の合格者数及び併設型中学校からの入学内定者数、並びに一般選抜選考Iの合格者数又は募集人員を差し引いた数。選抜順${s.order}、学力検査250点(国語・社会・数学・理科・英語各50)${s.jitsugi ? '、実技検査' + s.jitsugi + '点' : ''}、調査書 ③学習の記録${s.c3}点・④学習の記録以外${s.c4}点、⑤面接${s.c5}点、②+③+④+⑤=${tot2}点。`);
});
push('三養基', '普通科(帰国・外国人生徒等募集枠)', '一般選抜 特別枠', true, '', '【付表4-6】全日制課程 三養基高等学校帰国・外国人生徒等募集枠。募集人員は若干名。学力検査150点(国語※・数学・英語各50、国語は日本語による作文問題)。調査書、⑤面接は点数を記載せず(*)、学力検査、調査書及び個人面接の結果を総合的に評価し合否を決定する。');
for (const [n, no] of [['厳木', 11], ['太良', 16]]) push(n, '普通科(重点評価枠)', '一般選抜 重点評価枠', true, '', `【付表4-6】全日制課程 ${n}高等学校 重点評価枠(番号${no})。募集定員40・募集人員40。学力検査200点(5教科中上位3教科の得点を2倍にし、他の2教科の得点との合計[400点満点]を200点満点に換算)。⑤面接180点、②+③+④+⑤=180点。調査書は点数化しない。`);
for (const e of T3) push(e.name, e.dept, '一般選抜 定時制', true, `学力検査250:調査書${e.c3 + e.c4}:面接${e.c5}`, `【付表4-6】定時制課程(${e.no})。募集定員${e.teiin}・募集人員${e.bosyu}。学力検査250点(国語・社会・数学・理科・英語各50)、調査書 ③学習の記録${e.c3}点・④学習の記録以外${e.c4}点、⑤面接${e.c5}点、②+③+④+⑤=${e.total}点。調査書の学習の記録以外で特に重視する項目・内容:${e.note}。`);
const names = new Set([...K1.map((e) => e.name), ...T3.map((e) => e.name)]);
const ts = `// 佐賀県: 令和8年度佐賀県立高等学校入学者選抜概要(実施教科・配点等)(付表4-4〜4-6)。
//
// 一次ソース: 佐賀県教育委員会「令和8年度佐賀県立高等学校入学者選抜実施要項(第1部 入学者募集要項及び付表)」
// (\`https://www.pref.saga.lg.jp/kyouiku/kiji003115881/3_115881_367555_up_pqkdtzi7.pdf\`・108頁のうち付表4-4〜4-6=PDF104〜106頁・
// 県ページ \`https://www.pref.saga.lg.jp/kyouiku/kiji003115881/index.html\`・2026-09-19 pdftoppm 250dpiストリップで目視転記)。
// 転記データと生成スクリプトは ops/baselines/saga-transcription/ に保存。
//
// 佐賀県の一般選抜は「選考I(調査書配点高め・成績上位から)」と「選考II(学力検査配点高め)」の2段階で、学力検査5教科(各50点=250点・佐賀西/致遠館理数等は傾斜で325/300点)と
// 調査書(③学習の記録・④学習の記録以外)・⑤面接・実技検査を配点し、選考IIは②+③+④+⑤=100点(実技を課す学科は加算)に統一される。全日制32校69学科の選考I/IIと、帰国・外国人生徒等募集枠、
// 厳木・太良の重点評価枠、定時制課程6校(7行)を収録。検算: 全69行で②+③+④+⑤の合計が資料の値と一致し、選考IのB募集人員の合計は資料の合計行(1369人)と一致する。
// 未収録: 付表4-1〜4-3・4-7以降(特別選抜[スポーツ・文化・特色ある取組等]の学校別表[PDF101〜103頁]・各校の学習の記録以外の重視項目の全文)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const SAGA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'saga',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`付表4-4(選考I)・4-5(選考II)・4-6(帰国等枠・重点評価枠・定時制)を完全収録(${names.size}校・${recs}レコード)。特別選抜の学校別表(PDF101〜103頁)は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.saga.lg.jp/kyouiku/kiji003115881/index.html',
    docTitle: '令和8年度佐賀県立高等学校入学者選抜実施要項 付表4-4〜4-6 選抜概要(実施教科・配点等)（佐賀県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは学力検査:調査書(③+④):面接[:実技]の配点。選考Iは調査書配点高め、選考IIは調査書+面接=100点に統一。募集定員の括弧内は中高一貫教育校の外部募集分(注※1)。くくり募集(◎)は複数学科を1つの募集枠でまとめて募集する。厳木・太良の総合評価枠(重点評価枠)並びに定時制は選考I/IIの区別なく実施(注※2)。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/saga.ts'), ts);
console.log('schools', names.size, 'records', recs);
