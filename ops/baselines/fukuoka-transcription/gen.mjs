// T-Y14 fukuoka: data.mjs(目視転記)から src/data/school-selection-methods/fukuoka.ts を生成する。使い方: node ops/baselines/fukuoka-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FK, FK_LEGEND } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const METHOD = { '面': '面接', '面(自己表現)': '面接(自己表現)', '面・作': '面接・作文', '面・実': '面接・実技試験', '面又は面・作': '面接又は面接・作文' };
let out = '';
let recs = 0;
const rec = (school, dept, cat, note) => {
  out += ['    {', '      schoolName: ' + q(school) + ',', '      department: ' + q(dept) + ',', '      selectionCategory: ' + q(cat) + ',', '      interviewRequired: true,', '      note: ' + q(note) + ',', '    },'].join(NL) + NL;
  recs++;
};
let noSel = 0;
const H = '【令和8年度福岡県立高等学校入学定員等一覧表・';
for (const r of FK) {
  const teiin = '入学定員' + r.teiin + '人' + (r.mark ? '(定員の印' + r.mark + ')' : '');
  const tail = r.memo ? '。' + r.memo : '';
  if (r.sN != null) rec(r.school, r.dept, '推薦入学', H + r.sec + '】' + teiin + '。推薦入学: 募集人員' + r.sN + '人程度・実施方法=' + METHOD[r.sM] + tail + '。');
  if (r.tN != null) rec(r.school, r.dept, '特色化選抜', H + r.sec + '】' + teiin + '。特色化選抜: 内定者上限人数(目安)' + r.tN + '人・実施方法=' + METHOD[r.tM] + tail + '。');
  if (r.sN == null && r.tN == null) {
    noSel++;
    out += ['    {', '      schoolName: ' + q(r.school) + ',', '      department: ' + q(r.dept) + ',', "      selectionCategory: '推薦入学・特色化選抜なし',", '      note: ' + q(H + r.sec + '】' + teiin + '。推薦入学・特色化選抜の記載なし' + tail + '。') + ',', '    },'].join(NL) + NL;
    recs++;
  }
}
const names = new Set(FK.map((r) => r.school));
const ts = `// 福岡県: 令和8年度福岡県立高等学校入学定員等一覧表(全日制課程・推薦入学の募集人員と実施方法・特色化選抜の内定者上限人数と実施方法)。
//
// 一次ソース: 福岡県教育委員会「令和8年度福岡県立高等学校入学者選抜要項」の「令和8年度福岡県立高等学校入学定員等一覧表」(要項p69〜74・PDF75〜80頁)
// (県ページ \`https://www.pref.fukuoka.lg.jp/site/kyouiku/08youkou.html\`・\`https://www.pref.fukuoka.lg.jp/uploaded/attachment/268332.pdf\`・2026-09-19 pdftoppm 115dpiで実画像を目視転記)。
// 転記データと検算スクリプトは ops/baselines/fukuoka-transcription/ に保存。
//
// 福岡県は学校・学科(コース)ごとに、推薦入学の募集人員(程度)と実施方法(面接・作文・実技)、特色化選抜の内定者上限人数(目安)と実施方法を公表している。
// 推薦入学と特色化選抜はどちらか一方だけ実施する学校が多く、両方を実施しない学校(小倉・北九州・修猷館等は推薦のみ、玄洋・武蔵台等は特色化のみ)がある。
// くくり募集・入学定員をまとめて設定する学科は資料どおり1行にまとめた(入学定員は各学科の合計)。
// 検算(ops/.../check.mjs): 全行で 推薦の募集人員+特色化の内定者上限人数 ≦ 入学定員、実施方法の略が面/作/実のみ、学校×学科の重複なし。
// 限界: 資料の下線(推薦入学又は特色化選抜を今年度から実施しない印)は画像で判別できていない。学校別の調査書と学力検査の比率・配点は要項の別資料にあり未収録。定時制・通信制は収録範囲外。
// ${FK_LEGEND}

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const FUKUOKA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'fukuoka',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q('全日制課程の入学定員等一覧表(推薦入学と特色化選抜)を完全収録(' + names.size + '校・' + recs + 'レコード)。調査書と学力検査の比率・配点、定時制・通信制、下線(今年度から実施しない選抜の印)は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.fukuoka.lg.jp/site/kyouiku/08youkou.html',
    docTitle: '令和8年度福岡県立高等学校入学者選抜要項 入学定員等一覧表（福岡県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '推薦入学の募集人員は「程度」、特色化選抜の内定者上限人数は「目安」で、いずれも人数のみ(比率ではない)。ratioTypeは持たない。interviewRequiredは実施方法に面接を含むためtrue。学科名の★印は入学定員をまとめて設定、※印はくくり募集、定員の☆印は併設中学校からの入学予定者数を含む、◇印はみらい創造コースを除く普通科の定員。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/fukuoka.ts'), ts);
console.log('schools', names.size, 'records', recs, '記載なし', noSel);
