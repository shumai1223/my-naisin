// T-Y14 toyama: data.mjs(目視転記)から src/data/school-selection-methods/toyama.ts を生成する。使い方: node ops/baselines/toyama-transcription/gen.mjs
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
let recs = 0;
for (const e of D) {
  const cs = e.course ? `コース:${e.course}。` : '';
  const gn = [`【全日制の課程 学校別入学者選抜実施概要一覧・一般選抜】募集定員:${e.teiin}。${cs}傾斜配点:${e.tilt || 'なし'}。面接:${e.gInt ? e.gInt + '面接' : 'なし'}。実技検査:${e.gPrac || 'なし'}。`];
  if (e.gNote) gn.push(`備考:${e.gNote}`);
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '一般選抜',\n      interviewRequired: ${Boolean(e.gInt)},\n      note: ${q(gn.join(''))},\n    },\n`;
  recs++;
  if (e.sQuota) {
    const sn = `【全日制の課程 学校別入学者選抜実施概要一覧・推薦選抜】推薦募集人員:${e.sQuota}。${cs}面接:${e.sInt ? e.sInt + '面接' : 'なし'}。作文:${e.sEssay ? '有' : 'なし'}。実技検査:${e.sPrac || 'なし'}。${e.sNote ? '備考:' + e.sNote : ''}推薦志願資格(a〜d別の人員等・条件の文言)は資料本文にあり本DBには未収録。`;
    out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '推薦選抜',\n      interviewRequired: ${Boolean(e.sInt)},\n      note: ${q(sn)},\n    },\n`;
    recs++;
  }
}
const names = new Set(D.map((e) => e.name));
const ts = `// 富山県: 令和8年度富山県立高等学校入学者選抜実施概要一覧(全日制の課程 学校別)。
//
// 一次ソース: 富山県教育委員会「令和8年度富山県立高等学校入学者選抜実施概要一覧」
// (\`https://www.pref.toyama.jp/documents/47208/r08gaiyou.pdf\`・全6頁・画像PDF・
// 県ページ \`https://www.pref.toyama.jp/300201/kyouiku/kenritsukoukou/08senbatsu.html\`・2026-09-19 pdftoppmで目視転記)。
// 転記データと生成スクリプトは ops/baselines/toyama-transcription/ に保存。
//
// 富山県は「一般選抜」(傾斜配点・面接・実技検査・備考)と「推薦選抜」(募集人員[程度]・面接[個人]・作文・実技検査の内容)を
// 学校・学科・コース別に一覧表で公表する。資料5頁目の集計行(全日制34校82学科・一般選抜 傾斜配点2校2学科/面接1校3学科/実技検査2校2学科・
// 推薦選抜 面接27校62学科/作文26校61学科/実技検査4校6学科)と転記した学科数を突合して一致を確認した(魚津工業・中央農業のように学科をまたいで
// 1つの募集定員・推薦人員が印字されている学校は、学科ごとにレコードを作りnoteに合計値を記載)。
// 富山県は学力検査の調査書との比率が学校別に公表されていないため本DBには比率は無い。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const TOYAMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'toyama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`全日制の課程 学校別入学者選抜実施概要一覧(全${names.size}校${D.length}学科・一般選抜と推薦選抜で${recs}レコード)を完全収録。推薦志願資格(a〜dの条件文言)・全国募集・定時制・通信制・専攻科は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.toyama.jp/documents/47208/r08gaiyou.pdf',
    docTitle: '令和8年度富山県立高等学校入学者選抜実施概要一覧（全日制の課程）（富山県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '一般選抜のinterviewRequiredは「一般選抜」欄の面接に記載がある学科(中央農業の3学科の集団面接のみ)。推薦選抜のinterviewRequiredは推薦の面接欄(個人面接)に記載がある学科。学力検査の傾斜配点は富山北部体育コース(保体2.0倍)と呉羽音楽コース(音楽2.0倍)のみ。推薦募集人員の「程度」は資料の表記。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/toyama.ts'), ts);
console.log('schools', names.size, 'depts', D.length, 'records', recs);
