// T-Y14 miyazaki: data.mjs(目視転記)から src/data/school-selection-methods/miyazaki.ts を生成する。使い方: node ops/baselines/miyazaki-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROWS } from './data-ippan-r9.mjs';
import { JIKO, SPORTS, RENKEI } from './data-suisen-final-r9.mjs';
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
  const note = `【令和9年度 一般入学者選抜 募集定員及び検査内容・${e.course}】定員${e.teiin}名。${subjText}、面接${e.itv}点(${e.itvType}面接)${tekText}、調査書${e.cho}点、合計${e.kei}点${memo}。推薦・連携型入学者選抜は別レコードとして収録。`;
  out += `    {\n      schoolName: ${q(e.school)},\n      department: ${q(e.course === '定時制' ? `${e.dept}(定時制)` : e.dept)},\n      selectionCategory: '一般入学者選抜',\n      interviewRequired: true,\n      ratioType: ${q(ratio)},\n      note: ${q(note)},\n    },\n`;
}

const GNAMES = ['国語', '数学', '英語'];
const ratioOf = (e) => {
  const p = [];
  if (e.g && e.g.some((x) => x != null)) p.push('学力検査' + e.g.reduce((a, b) => a + (b || 0), 0));
  if (e.itv != null) p.push('面接' + e.itv);
  if (e.sho != null) p.push('小論文' + e.sho);
  if (e.saku != null) p.push('作文' + e.saku);
  if (e.jitsu != null) p.push('実技' + e.jitsu);
  if (e.gaku != null) p.push('学校独自検査' + e.gaku);
  if (e.jiko != null) p.push('自己推薦書' + e.jiko);
  if (e.cho != null) p.push('調査書' + e.cho);
  return p.join(':') + '(計' + e.kei + ')';
};
const detailOf = (e) => {
  const p = [];
  if (e.g && e.g.some((x) => x != null)) p.push('学力検査は' + GNAMES.map((n, i) => (e.g[i] != null ? n + e.g[i] : null)).filter(Boolean).join('・') + 'の計' + e.g.reduce((a, b) => a + (b || 0), 0) + '点');
  else p.push('学力検査は実施しない');
  if (e.itv != null) p.push('面接' + e.itv + '点' + (e.itvType ? '(' + e.itvType + '面接)' : ''));
  if (e.sho != null) p.push('小論文' + e.sho + '点');
  if (e.saku != null) p.push('作文' + e.saku + '点');
  if (e.jitsu != null) p.push('実技' + e.jitsu + '点');
  if (e.gaku != null) p.push('学校独自検査' + e.gaku + '点');
  if (e.jiko != null) p.push('自己推薦書' + e.jiko + '点');
  if (e.cho != null) p.push('調査書' + e.cho + '点');
  return p.join('、') + '、合計' + e.kei + '点';
};
const NL = String.fromCharCode(10);
const rec = (school, dept, cat, itvTrue, ratio, note) => {
  const lines = ['    {', '      schoolName: ' + q(school) + ',', '      department: ' + q(dept) + ',', '      selectionCategory: ' + q(cat) + ','];
  if (itvTrue) lines.push('      interviewRequired: true,');
  if (ratio) lines.push('      ratioType: ' + q(ratio) + ',');
  lines.push('      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
};
const pushSuisen = (school, dept, cat, e, head, memo) => {
  rec(school, dept, cat, e.itv != null, ratioOf(e), head + '。' + detailOf(e) + (memo ? '。' + memo : '') + '。');
};
for (const e of JIKO) {
  pushSuisen(e.school, e.course === '定時制' ? e.dept + '(定時制)' : e.dept, '推薦入学者選抜(自己推薦方式)', e, '【令和9年度 推薦・連携型入学者選抜 募集人員割合及び検査内容・' + e.course + '】定員' + e.teiin + '名、募集人員は定員の' + e.pct + '%(' + e.nin + '名)', e.memo);
}
for (const e of SPORTS) {
  const head = '【令和9年度 推薦・連携型入学者選抜 募集人員割合及び検査内容・全日制】指定部活動「' + e.act + '」の募集人員は' + e.nin + '人(自己推薦方式の募集人員には含まれない)';
  if (e.kei == null) rec(e.school, e.act, '推薦入学者選抜(スポーツ推薦方式)', false, '', head + '。' + e.memo + '。');
  else pushSuisen(e.school, e.act, '推薦入学者選抜(スポーツ推薦方式)', e, head, e.memo);
}
for (const e of RENKEI) pushSuisen(e.school, e.dept, '連携型入学者選抜', e, '【令和9年度 推薦・連携型入学者選抜 募集人員割合及び検査内容・全日制】定員' + e.teiin + '名', e.memo);
const recCount = ROWS.length + JIKO.length + SPORTS.length + RENKEI.length;
const names = new Set([...ROWS, ...JIKO, ...SPORTS, ...RENKEI].map((e) => e.school));
const zen = ROWS.filter((e) => e.course === '全日制').reduce((a, e) => a + e.teiin, 0);
const tei = ROWS.filter((e) => e.course === '定時制').reduce((a, e) => a + e.teiin, 0);
const ts = `// 宮崎県: 令和9年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容(全日制・定時制)。
//
// 一次ソース①: 宮崎県教育委員会「令和9年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容」
// (令和8年8月6日発表資料【一般入学者選抜の検査内容等】・\`https://www.pref.miyazaki.lg.jp/documents/109134/109134_20260718165834-1.pdf\`・全4頁・
// 県ページ \`https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20260519170532.html\`・令和9年度版は2026-09-20取得しpdftotext -bboxの座標から機械抽出・検算済み)。
// 一次ソース②: 同「令和9年度宮崎県立高等学校 推薦・連携型入学者選抜 募集人員割合及び検査内容」(令和8年8月6日発表資料・\`https://www.pref.miyazaki.lg.jp/documents/109134/109134_20260718165750-1.pdf\`・全6頁・同じく座標抽出)。自己推薦方式・スポーツ推薦方式・連携型(福島)を収録。
// 転記データと検算スクリプトは ops/baselines/miyazaki-r9/ に保存(令和8年度版の目視転記は ops/baselines/miyazaki-transcription/)。
//
// 宮崎県の一般入学者選抜は学科ごとに 学力検査(国語・社会・数学・理科・英語)・面接・調査書(・適性検査等)の各配点を公表している。
// 学力検査は原則各教科100点だが、数学と英語を150点(または125点)とする学科(傾斜配点)がある。面接・調査書の配点は学校・学科ごとに異なる。
// 検算: 全レコードで 学力検査+面接+適性検査等+調査書 が資料の「計」列に一致(ops/.../check.mjs)。全日制の定員合計${zen}名・定時制${tei}名。
// 推薦の検算: 自己推薦方式114行は全行で 学力検査+適性検査+自己推薦書+調査書=計、定員が一般選抜表(別PDF)と全件一致、募集人員=定員×募集割合(附属中設置の理数科2件は注記の算出式)。
// 未収録: 通信制課程・各種の出願要件等の資料本文。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const MIYAZAKI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'miyazaki',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`一般入学者選抜の全日制(定員${zen}名)・定時制(${tei}名)の学科別配点(学力検査・面接・調査書・適性検査等)を完全収録(${names.size}校・${recCount}レコード)。推薦入学者選抜(自己推薦方式114・スポーツ推薦方式47)と連携型(福島)も収録。通信制課程と出願要件等の本文は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20260519170532.html',
    docTitle: '令和9年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容（宮崎県教育委員会）',
    lastChecked: '2026-09-20',
  },
  note: 'ratioTypeは 学力検査点:面接点:(適性検査等点):調査書点(計) の配点表記。学力検査は数学・英語のみ100点でなく150点/125点とする傾斜配点学科があり、各レコードのnoteに教科別配点を記載。interviewRequiredは全学科で面接を実施するためtrue(定時制普通科も個人面接あり)。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/miyazaki.ts'), ts);
console.log('schools', names.size, 'records', recCount, '全日制', zen, '定時制', tei);
