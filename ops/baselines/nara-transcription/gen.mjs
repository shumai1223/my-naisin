// T-Y14 nara: data.mjs(目視転記)から src/data/school-selection-methods/nara.ts を生成する。使い方: node ops/baselines/nara-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D } from './data.mjs';
import { S2, N2 } from './data2.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const PAT = { '①': '標準(第1学年27点+第2学年27点+第3学年90点=144点満点)', '②': '第3学年をさらに2倍(27+27+180=234点満点)', '③': '第1・第2学年を2倍(54+54+90=198点満点)', '④': '第1・第2学年は加えず第3学年をさらに2倍(180点満点)' };
let out = '';
let recs2 = 0;
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
const sfx = (c) => (c === '定時制' || c === '市立定時制' ? '(定時制)' : '');
for (const e of S2) {
  const ratioType = `学力検査(3教科)${e.gaku}:調査書${e.chosho}`;
  const note = `【一次選抜一覧(第2希望校として出願する場合)・${e.course}】第2希望校では第1希望校で実施した国語・数学・英語の3教科の学力検査の得点を使用(満点${e.gaku}点)。募集人員の未充足分について、国語・数学・英語の検査成績、調査書成績及び特技に関する記録の得点の合計の多い者から順に合格者とし、調査書のその他の記載事項を資料として総合的に合否を判定する。調査書:学習成績の取扱いパターン${e.pattern}=${PAT[e.pattern]}、加重配点:${e.kajuu || 'なし'}、調査書成績の満点${e.chosho}点。`;
  out += `    {
      schoolName: ${q(e.name)},
      department: ${q(e.dept + sfx(e.course))},
      selectionCategory: '一次選抜(第2希望校)',
      interviewRequired: false,
      ratioType: ${q(ratioType)},
      note: ${q(note)},
    },
`;
  recs2++;
}
for (const e of N2) {
  const ratioType = `一次選抜学力検査(3教科)${e.gaku}+面接${e.itv}:調査書${e.chosho}`;
  const note = `【二次選抜一覧・${e.course}】一次選抜で合格者数が募集人員に満たなかった学科(コース)で実施。一次選抜の国語・数学・英語の3教科の学力検査の得点を用いる(満点${e.gaku}点・学科によって加重配点)。面接${e.itv}点(面接の内容は資料の別表[22〜23頁]、未収録)。調査書:学習成績の取扱いパターン${e.pattern}=${PAT[e.pattern]}、加重配点:${e.kajuu || 'なし'}、調査書成績の満点${e.chosho}点。第2(第3)志望の取扱いは資料の別表(22〜23頁)を参照(未収録)。`;
  out += `    {
      schoolName: ${q(e.name)},
      department: ${q(e.dept + sfx(e.course))},
      selectionCategory: '二次選抜',
      interviewRequired: true,
      ratioType: ${q(ratioType)},
      note: ${q(note)},
    },
`;
  recs2++;
}
const names = new Set(D.map((e) => e.name));
const ts = `// 奈良県: 令和8年度奈良県立高等学校入学者選抜概要「一次選抜一覧【第1希望校・第2希望校として出願する場合】」「二次選抜一覧」。
//
// 一次ソース: 奈良県教育委員会「令和8年度奈良県立高等学校入学者選抜概要」
// (\`https://www.pref.nara.lg.jp/documents/18780/5_1_1ji_1kiboukou_itiran_0910.pdf\`・5頁・県ページ
// \`https://www.pref.nara.lg.jp/n167/69538.html\`・2026-09-19 pdftoppm 100dpiで目視転記。調査書の取扱いパターン①〜④は
// 同概要「4 調査書の取扱い」(\`4_2_tyosasyo.pdf\`)で確認)。転記データと生成スクリプトは ops/baselines/nara-transcription/ に保存。
//
// 奈良県は全日制・定時制すべての学校で一次選抜を実施し、学力検査(全日制普通科等は5教科各50点[国際250点・奈良400点等は学校別の満点]、
// 専門学科・コースは国語・数学・英語の3教科+学校独自検査[独自問題・作文・面接・実技検査])と調査書成績(パターン①〜④・加重配点・特別な取扱い)を
// 学校・学科別に一覧表で公表する。ratioTypeは普通科等が「学力検査:調査書」、3教科+独自検査の学科が「検査成績(学力+独自検査):調査書」。
// 検査成績の満点=学力検査+独自問題+作文+面接+実技検査となることを全レコードで検算済み(テスト)。第2希望校は第1希望校の3教科学力検査の得点を使い、二次選抜は3教科の得点+面接で選考する(各別PDF: 5_2_1ji_2kiboukouitiran_0910.pdf/6_1_2ji_itiran_0910.pdf)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const NARA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'nara',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`一次選抜一覧【第1希望校・第2希望校として出願する場合】と二次選抜一覧(県立全${names.size - 3}校+参考の市立3校・${D.length}学科・3種の選抜区分)を完全収録。各校の学科別概要(25頁〜)・二次選抜の面接内容と第2(第3)志望の別表は未収録`)},
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
console.log('schools', names.size, 'depts', D.length, 'S2', S2.length, 'N2', N2.length, 'total', D.length + recs2);
