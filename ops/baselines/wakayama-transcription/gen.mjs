// T-Y14 wakayama: data-b1.mjs(別表1)と別表4(面接・実技検査等・下記MEN)から src/data/school-selection-methods/wakayama.ts を生成する。
// 使い方: node ops/baselines/wakayama-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { B1 } from './data-b1.mjs';
import { B2 } from './data-b2.mjs';
import { B3, B3_NOTE } from './data-b3.mjs';
let b3hit = 0;
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
// 別表4 一般選抜における面接・実技検査等の内容(目視転記・100dpi)。キー=学校|学科
const SPORTS15 = '陸上競技・水泳(競技)・自転車競技・ボート・体操・バスケットボール・サッカー・ラグビーフットボール・バレーボール・ソフトテニス・レスリング・フェンシング・柔道・剣道・ソフトボール';
const MEN = new Map([
  ['和歌山北|スポーツ健康科学科', '個人面接を5分程度実施。共通実技=50m走(雨天時は10m走)・ハンドボール投げ(雨天時はバスケットボール投げ)・握力測定。選択実技=次の15競技(' + SPORTS15 + ')から得意な競技を一つ選択し、各競技ともすべての種目を実施'],
  ['和歌山東|普通科', '個人面接を10分程度実施'],
  ['有田中央|総合学科(総合)', '個人面接を5分〜7分程度実施'],
  ['有田中央|総合学科(福祉)', '個人面接を5分〜7分程度実施'],
]);
for (const d of ['普通科(昼間)', '普通科(夜間)']) MEN.set('伊都中央|' + d, '個人面接を10分程度実施');
MEN.set('耐久|普通科(夜間)', '個人面接を10分程度実施');
MEN.set('日高|普通科(夜間)', '個人面接を10分程度実施');
for (const d of ['普通科(昼間)', '普通科(夜間)']) MEN.set('南紀|' + d, '個人面接を10分程度実施');
MEN.set('新宮|普通科(昼間)(新翔校舎)', '個人面接を10分程度実施');
MEN.set('新宮|普通科(夜間)(新宮校舎)', '個人面接を10分程度実施');
let out = '';
let hit = 0;
for (const r of B1) {
  const parts = ['調査書' + r.cho, '学力検査' + r.gaku];
  if (r.itv) parts.push('面接・実技検査' + r.itv);
  const ratio = parts.join(':');
  const dept = r.course === '定時制' ? r.dept + '(定時制)' : r.dept;
  let note = '【令和8年度 入学者選抜選考基準・' + r.course + '】一般選抜の割合(%): 調査書' + r.cho + '・学力検査' + r.gaku + (r.itv ? '・面接・実技検査' + r.itv + '(' + r.itvC + ')' : '');
  if (r.gakuK) note += '。学力検査の傾斜配点: ' + r.gakuK + '(数字は倍率・「国」は国語・「英」は外国語(英語))';
  if (r.choK) note += '。調査書の傾斜評価: ' + r.choK;
  const men = MEN.get(r.school + '|' + r.dept);
  if (men) {
    note += '。面接・実技検査等(別表4): ' + men;
    hit++;
  } else if (r.itv) throw new Error('別表4の内容が無い: ' + r.school + r.dept);
  if (r.memo) note += '。' + r.memo;
  note += '。';
  const lines = ['    {', '      schoolName: ' + q(r.school) + ',', '      department: ' + q(dept) + ',', "      selectionCategory: '一般選抜',"];
  if (r.itv && r.itvC === '面') lines.push('      interviewRequired: true,');
  if (r.itv && r.itvC === '面・実') lines.push('      interviewRequired: true,');
  lines.push('      ratioType: ' + q(ratio) + ',', '      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
}

// 別表2 特色化選抜の実施方法等
for (const t of B2) {
  const jouken = B3.get(t.cat + '|' + t.school + '|' + t.sub);
  if (!jouken && t.cat !== '連携型中高一貫') throw new Error('別表3の出願条件が無い: ' + t.cat + t.school + t.sub);
  if (jouken) b3hit++;
  const note = '【令和8年度 特色化選抜における実施方法等(別表2)・' + t.cat + '】実施方法: ' + t.method + '。面接: ' + t.itv + '。' + t.test + '。' + (jouken ? '出願条件(別表3): ' + jouken + (t.cat === 'スポーツ' ? '。' + B3_NOTE : '') + '。' : '出願条件(別表3)に該当の記載なし。') + '選考の割合は本レコードには未収録。';
  const lines = ['    {', '      schoolName: ' + q(t.school) + ',', '      department: ' + q(t.sub || t.cat) + ',', '      selectionCategory: ' + q('特色化選抜(' + t.cat + ')') + ',', '      interviewRequired: true,', '      note: ' + q(note) + ',', '    },'];
  out += lines.join(NL) + NL;
}
const names = new Set([...B1.map((r) => r.school), ...B2.map((t) => t.school.replace('(龍神分校)', '').replace('南部', '南部'))]);
const zen = B1.filter((r) => r.course === '全日制').length;
const tei = B1.filter((r) => r.course === '定時制').length;
const ts = `// 和歌山県: 令和8年度和歌山県立高等学校入学者選抜選考基準(別表1)・特色化選抜における実施方法等(別表2)・面接・実技検査等(別表4)。
//
// 一次ソース: 和歌山県教育委員会「令和8年度和歌山県立高等学校入学者選抜実施要項」別表1「入学者選抜選考基準」(全7頁)・別表4「面接・実技検査等」(全2頁)・別表2「特色化選抜における実施方法等」(全9頁)
// (県ページ \`https://www.pref.wakayama.lg.jp/prefg/500200/d00220765.html\`・
// \`.../d00220765_d/fil/senkoukijun_beppyou1.pdf\`・\`.../mensetujitugi_beppyou4.pdf\`・2026-09-19 pdftoppm 100dpiで実画像を目視転記)。
// 転記データと検算スクリプトは ops/baselines/wakayama-transcription/ に保存。
//
// 和歌山県の一般選抜は学科ごとに 調査書・学力検査・(面接・実技検査)の割合(%)を公表している。調査書と学力検査は 30:70 / 40:60 / 50:50 が中心で、
// 学力検査に傾斜配点(国語・英語を1.5倍)を置く学科(那賀国際科・星林の各学科)と、面接・実技検査を課す学科(和歌山北スポーツ健康科学科・和歌山東・有田中央総合学科・定時制の一部)がある。
// 検算: 全レコードで 調査書+学力検査+面接・実技検査=100%。資料の◇印(県立中学校からの進学者のみ・県立高校入試では募集しない)の学科は収録していない。
// 特色化選抜(別表2)は区分(連携型中高一貫・農業・宇宙・地域・学際・芸術・スポーツ健康科学・スポーツ)ごとの実施方法(面接時間・作文/小論文の字数と時間・実技の内容)を21レコードで収録した。
// 特色化選抜の出願条件(別表3・全4頁)は該当20レコードのnoteに要旨を付記した(スポーツはア〜ウの大会成績基準を数値で記録)。
// 未収録: 特色化選抜の選考の割合・スポーツ推薦(別表5〜7)・追募集(別表8)・通信制課程・「求める生徒像」の本文。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const WAKAYAMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'wakayama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q('一般選抜の学科別の割合(調査書・学力検査・面接実技)を全日制' + zen + 'レコード・定時制' + tei + 'レコードで完全収録し、特色化選抜の実施方法(別表2)' + B2.length + 'レコードを加えた(' + names.size + '校・' + (B1.length + B2.length) + 'レコード)。特色化選抜の選考の割合・スポーツ推薦・追募集・通信制と求める生徒像の本文は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00220765.html',
    docTitle: '令和8年度和歌山県立高等学校入学者選抜実施要項 別表1・2・4（和歌山県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは一般選抜の 調査書:学力検査(:面接・実技検査) の割合(%)。学力検査の傾斜配点はnoteに記載(国語・英語1.5倍の学科あり)。定時制の昼夜で行が結合されている学科は昼間と夜間の両方に同じ割合を記録した。interviewRequiredは面接を課す学科(和歌山北スポーツ健康科学科・和歌山東・有田中央総合学科・定時制の一部)のみtrue。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/wakayama.ts'), ts);
console.log('schools', names.size, 'records', B1.length + B2.length, '全日制', zen, '定時制', tei, '別表4連結', hit, '別表3連結', b3hit);
