// T-Y14 ehime: data.mjs(目視転記)から src/data/school-selection-methods/ehime.ts を生成する。使い方: node ops/baselines/ehime-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EH } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const NAMES = [['cho', '調査書'], ['saku', '作文'], ['sho', '小論文'], ['men', '面接'], ['shu', '集団討論'], ['jit', '実技テスト'], ['pre', 'プレゼンテーション']];
const ratioOf = (w) => NAMES.filter(([k]) => w[k] > 0).map(([k, n]) => n + w[k]).join(':') + '(比重・合計10)';
let out = '';
let recs = 0;
const rec = (school, dept, cat, itv, ratio, note) => {
  const lines = ['    {', '      schoolName: ' + q(school) + ',', '      department: ' + q(dept) + ',', '      selectionCategory: ' + q(cat) + ','];
  if (itv) lines.push('      interviewRequired: true,');
  lines.push('      ratioType: ' + q(ratio) + ',', '      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
  recs++;
};
const H = '【令和8年度 特色入学者選抜 各校の出願資格及び検査項目等】';
for (const r of EH) {
  let note = H + '募集定員' + r.teiin + '人のうち特色入学者選抜の募集割合' + r.wari + '%程度(募集人数' + r.n + '人程度)。検査項目等の比重(合計10): ' + NAMES.filter(([k]) => r.w[k] > 0).map(([k, n]) => n + r.w[k]).join('・');
  if (r.memo) note += '。' + r.memo;
  note += '。出願資格(評定・資格検定・活動実績の条件)と検査概要の本文は本DBには未収録。';
  rec(r.school, r.dept, '特色入学者選抜', r.w.men > 0 || r.w.shu > 0, ratioOf(r.w), note);
  for (const s of r.subs) {
    const n2 = H + '募集定員' + r.teiin + '人。特色入学者選抜のうち「' + s[0] + '」の募集人数は' + s[1] + '(同選抜で合格とならなかった場合は同選抜を希望していない志願者に含めて選抜する)。検査項目等の比重(合計10): ' + NAMES.filter(([k]) => s[2][k] > 0).map(([k, n]) => n + s[2][k]).join('・') + '。';
    rec(r.school, r.dept, '特色入学者選抜(' + s[0] + ')', s[2].men > 0 || s[2].shu > 0, ratioOf(s[2]), n2);
  }
}
const names = new Set(EH.map((r) => r.school.replace(/\((本校|小田分校|中島分校|砥部分校)\)/, '')));
const ts = `// 愛媛県: 令和8年度愛媛県県立高等学校入学者選抜 特色入学者選抜 各校の出願資格及び検査項目等(募集割合・募集人数・検査項目等の比重)。
//
// 一次ソース: 愛媛県教育委員会「令和８年度県立高等学校入学者選抜特色入学者選抜各校の出願資格及び検査項目等について」
// (県ページ \`https://ehime-kyoiku.esnet.ed.jp/koukou/nyuusi/r08nyuusi\`・\`https://ehime-kyoiku.esnet.ed.jp/file/952\`・全65頁・2026-09-19 pdftoppm 90dpiで実画像を目視転記)。
// 転記データと検算スクリプトは ops/baselines/ehime-transcription/ に保存。
//
// 愛媛県は学校・学科ごとに 特色入学者選抜の募集割合(%程度)と募集人数(人程度)、検査項目等の比重(調査書・作文・小論文・面接・集団討論・実技テスト・プレゼンテーション・合計10)を公表している。
// 多くの学校が「文化・スポーツ活動の取組・成果等を重視した選抜」を特色入学者選抜の内数として別の比重で実施し、その人数を上限として明示する。
// 縦書きで列挙された学科(工業・農業・水産の一部)は資料どおり1行にまとめた(各学科の募集定員・募集人数が同じため。文化・スポーツ選抜の学科別人数の和で学科数を検算した)。
// 検算(ops/.../check.mjs): 全行と全サブ選抜で比重の和=10、募集割合×募集定員≒募集人数(±1)、文スポ選抜の人数が募集人数を超えない、重複なし。
// 未収録: 出願資格(評定平均・資格検定・活動実績の条件)・検査概要(作文/小論文/面接の時間と内容)・入学時に求める生徒像の本文。一般入学者選抜の学校別配点は別資料。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const EHIME_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'ehime',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q('特色入学者選抜の募集割合・募集人数・検査項目等の比重(文化・スポーツ活動を重視した選抜を含む)を全' + names.size + '校・' + recs + 'レコードで完全収録(資料65頁中の各校表)。出願資格と検査概要の本文、一般入学者選抜の配点は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://ehime-kyoiku.esnet.ed.jp/koukou/nyuusi/r08nyuusi',
    docTitle: '令和８年度県立高等学校入学者選抜特色入学者選抜各校の出願資格及び検査項目等について（愛媛県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは検査項目等の比重(合計10)。募集割合・募集人数は「程度」の値。「文化・スポーツ活動の取組・成果等を重視した選抜」は特色入学者選抜の内数で、別の比重を持つ場合は別レコードに記録した。interviewRequiredは面接または集団討論を課す場合にtrue。松山東・松山南理数の「面接・集団討論」欄は集団討論の列の値として記録した。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/ehime.ts'), ts);
console.log('schools', names.size, 'records', recs);
