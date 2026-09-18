// T-Y14 shimane: data.mjs(別表2)・data1.mjs(別表1)から src/data/school-selection-methods/shimane.ts を生成する。使い方: node ops/baselines/shimane-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { G } from './data.mjs';
import { A } from './data1.mjs';
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
for (const e of G) {
  const base = `【令和9年度 別表2・番号${e.no}】入学定員${e.teiin}${e.star ? '(*印:身元引受人による県外受検生の合格者数を入学定員内において4名を超えて決定することができる高等学校)' : ''}`;
  push(e.name, e.dept, '一般選抜', false, `個人調査報告書${e.r1}:学力検査${e.r2}`, `${base}。一般選抜: 個人調査報告書と学力検査の比率${e.r1}対${e.r2}。傾斜配点:なし。学力検査後の面接等:${e.itv ? e.itv + '(評点化' + e.itvPt + '点)' : 'なし'}。`);
  const s = e.s2;
  const parts = [`書類(個人調査報告書等)${s.doc}`, `一般選抜の学力検査の結果${s.gaku}`];
  if (s.itv) parts.push(`面接${s.itv}`);
  if (s.essay) parts.push(`作文${s.essay}`);
  if (s.prac) parts.push(`実技${s.prac}`);
  push(e.name, e.dept, '第2次募集', s.itv > 0, `書類${s.doc}:学力検査${s.gaku}:面接${s.itv}:作文${s.essay}:実技${s.prac}`, `${base}。第2次募集の選抜方法及び配点: ${parts.join('+')}=合計${s.total}点。基礎学力をみるための検査は実施しない。第2次募集は令和9年3月12日の合格発表時点で欠員が生じた全日制課程及び定時制課程の学校・学科で行う。`);
}
const seenNo = new Set();
for (const e of G) {
  if (seenNo.has(e.no)) continue;
  seenNo.add(e.no);
  const x = A[e.no];
  if (!x) continue;
  for (const [kind, pct, method] of x.so) push(e.name, kind, '総合選抜(特色)', method.includes('面接'), '', `【令和9年度 別表1・番号${e.no}】特色入学者選抜のうち総合選抜。実施学科:${kind}、募集人員(入学定員に対する%):${pct}、選抜方法:${method}。`);
  if (x.sp) push(e.name, '(スポーツ特別選抜)', 'スポーツ特別選抜', x.sp.method.includes('面接'), '', `【令和9年度 別表1・番号${e.no}】スポーツ特別選抜。指定競技:${x.sp.sport}、募集人員${x.sp.n}人、選抜方法:${x.sp.method}。`);
}
const names = new Set(G.map((e) => e.name));
const ts = `// 島根県: 令和9年度(2027年度入学者選抜)島根県公立高等学校入学者選抜の別表1・別表2。
//
// 一次ソース: 島根県教育委員会「令和9年度島根県公立高等学校入学者選抜における総合選抜・スポーツ特別選抜での募集人員・選抜方法等について(別表1)」
// (\`.../senbatsu_info/index.data/R9_beppyou1.pdf\`)と「一般選抜での個人調査報告書と学力検査の比率等及び第2次募集について(別表2)」
// (\`.../senbatsu_info/index.data/R9_beppyou2.pdf\`)。県ページ \`https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/\`
// (2026-09-19 pdftoppmで目視転記。別表2は数値を pdftotext の抽出数値と行ごとに突合し不一致なし)。転記データと生成スクリプトは
// ops/baselines/shimane-transcription/ に保存。
//
// 島根県は「特色入学者選抜(総合選抜・スポーツ特別選抜)」「一般選抜」「第2次募集」の3段階。一般選抜は学校・学科ごとに
// 個人調査報告書と学力検査の比率(3対7〜7対3)を定め、面接等を評点化(5点または10点)する学校・学科がある。第2次募集は書類・一般選抜の学力検査の結果・面接・作文・実技の配点(合計100〜150点)。
// 全39校(定時制3校を含む)の別表2、及び別表1のうち総合選抜36校・スポーツ特別選抜の実施校を収録。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const SHIMANE_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'shimane',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`別表2(一般選抜の比率等・第2次募集)の全${G.length}校・別表1(総合選抜・スポーツ特別選抜)を完全収録(${names.size}校・${recs}レコード)。各校の「求める生徒像」・総合選抜/中高一貫特別選抜/スポーツ特別選抜の概要PDF・実施要綱は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/',
    docTitle: '令和9年度島根県公立高等学校入学者選抜(別表1・別表2)（島根県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '一般選抜のratioTypeは個人調査報告書:学力検査の比率。松江商業等の学力検査後の面接は評点化(10点)される。第2次募集のratioTypeは書類:学力検査:面接:作文:実技の配点。くくり募集の学科は学科名にくくり募集と記載。表中の*印(22校)は身元引受人による県外受検生の合格者数を入学定員内で4名を超えて決定できる高等学校。令和9年度入学者選抜が対象で、令和8年度の実施要綱(R8_youkou0113.pdf)とは別年度。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/shimane.ts'), ts);
console.log('schools', names.size, 'rows', G.length, 'records', recs);
