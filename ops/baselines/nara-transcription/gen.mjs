// T-Y14 nara: data.mjs(目視転記)から src/data/school-selection-methods/nara.ts を生成する。使い方: node ops/baselines/nara-transcription/gen.mjs
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
const PAT = { '①': '標準(第1学年27点+第2学年27点+第3学年90点=144点満点)', '②': '第3学年をさらに2倍(27+27+180=234点満点)', '③': '第1・第2学年を2倍(54+54+90=198点満点)', '④': '第1・第2学年は加えず第3学年をさらに2倍(180点満点)' };
let out = '';
for (const e of D) {
  const parts = [`学力検査${e.kind === '5' ? '(国語・社会・数学・理科・英語の5教科)' : '(国語・数学・英語の3教科)'}${e.gaku}点`];
  if (e.dokuji) parts.push(`独自問題${e.dokuji}点`);
  if (e.essay) parts.push(`作文${e.essay}点`);
  if (e.itv) parts.push(`面接${e.itv}点`);
  if (e.prac) parts.push(`実技検査${e.prac}点`);
  const ratioType = e.kind === '5' ? `学力検査${e.gaku}:調査書${e.chosho}` : `検査成績${e.kensa}:調査書${e.chosho}`;
  const sp = e.tokuN != null ? `調査書の特別な取扱い:合格人数枠${e.tokuN}名・満点${e.tokuP}点(令和8年10月頃に発表される正式な募集人員により変更されることがある)` : '調査書の特別な取扱い:なし';
  const note = `【一次選抜一覧(第1希望校として出願する場合)・${e.course}】検査成績の満点${e.kensa}点=${parts.join('+')}。調査書:学習成績の取扱いパターン${e.pattern}=${PAT[e.pattern]}、加重配点:${e.kajuu || 'なし'}、調査書成績の満点${e.chosho}点。${sp}。${e.note ? e.note : ''}`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept + (e.course === '定時制' || e.course === '市立定時制' ? '(定時制)' : ''))},\n      selectionCategory: '一次選抜(第1希望校)',\n      interviewRequired: ${e.itv > 0},\n      ratioType: ${q(ratioType)},\n      note: ${q(note)},\n    },\n`;
}
const names = new Set(D.map((e) => e.name));
const ts = `// 奈良県: 令和8年度奈良県立高等学校入学者選抜概要「5 一次選抜一覧【第1希望校として出願する場合】」。
//
// 一次ソース: 奈良県教育委員会「令和8年度奈良県立高等学校入学者選抜概要」
// (\`https://www.pref.nara.lg.jp/documents/18780/5_1_1ji_1kiboukou_itiran_0910.pdf\`・5頁・県ページ
// \`https://www.pref.nara.lg.jp/n167/69538.html\`・2026-09-19 pdftoppm 100dpiで目視転記。調査書の取扱いパターン①〜④は
// 同概要「4 調査書の取扱い」(\`4_2_tyosasyo.pdf\`)で確認)。転記データと生成スクリプトは ops/baselines/nara-transcription/ に保存。
//
// 奈良県は全日制・定時制すべての学校で一次選抜を実施し、学力検査(全日制普通科等は5教科各50点[国際250点・奈良400点等は学校別の満点]、
// 専門学科・コースは国語・数学・英語の3教科+学校独自検査[独自問題・作文・面接・実技検査])と調査書成績(パターン①〜④・加重配点・特別な取扱い)を
// 学校・学科別に一覧表で公表する。ratioTypeは普通科等が「学力検査:調査書」、3教科+独自検査の学科が「検査成績(学力+独自検査):調査書」。
// 検査成績の満点=学力検査+独自問題+作文+面接+実技検査となることを全レコードで検算済み(テスト)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const NARA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'nara',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`一次選抜一覧【第1希望校として出願する場合】(県立全${names.size - 3}校+参考の市立3校・${D.length}学科)を完全収録。第2希望校として出願する場合の一覧・二次選抜一覧・各校の学科別概要(25頁〜)は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.nara.lg.jp/n167/69538.html',
    docTitle: '令和8年度奈良県立高等学校入学者選抜概要（一次選抜一覧・調査書の取扱い）（奈良県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '調査書の取扱いパターン: ①第1学年観点3段階評価×9教科=27+第2学年27+第3学年5段階評定×9教科×2倍=90で144点満点。②第3学年をさらに2倍(234点)。③第1・第2学年を2倍(198点)。④第1・第2学年は加えず第3学年をさらに2倍(180点)。加重配点は教科ごとに2倍等を加える場合の記載。特別な取扱いの合格人数枠は10月頃の正式な募集人員により変更されることがある。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/nara.ts'), ts);
console.log('schools', names.size, 'depts', D.length);
