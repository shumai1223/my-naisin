// T-Y14 yamagata: data.mjs(目視転記)から src/data/school-selection-methods/yamagata.ts を生成する。使い方: node ops/baselines/yamagata-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D } from '../yamagata-transcription/data.mjs';
import { R9 } from './r9info.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
for (const e of D) { const r = R9(e); if (r) Object.assign(e, r.patch, { r9ratio: r.ratio }); }
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const methods = (e) => {
  const m = [];
  if (e.ind) m.push('個人面接');
  if (e.grp) m.push('集団面接');
  if (e.essay) m.push('作文');
  if (e.pres) m.push('発表');
  if (e.other) m.push(e.other);
  return m.join('・') || 'なし';
};
let out = '';
for (const e of D) {
  const dept = e.course === '定時制' ? `${e.dept}(定時制)` : e.dept;
  const day = e.day === 'A' ? 'A日程(令和9年1月19日)' : 'B日程(令和9年2月2日)';
  const zk = `【前期(特色)選抜】検査日程:${day}。募集人員(定員の比率):${e.quota}。検査方法:${methods(e)}。${e.detail}前期選抜の検査ごとの配点割合(令和9年度・学校別概要PDF):${e.r9ratio}。※検査時間・字数・人数等の詳細は令和8年度の検査方法詳細PDFの値(令和9年度版の詳細は未公表)。県外志願者受入れ:${e.outF ? 'あり(○)' : 'なし'}。`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(dept)},\n      selectionCategory: '前期(特色)選抜',\n      interviewRequired: ${Boolean(e.ind || e.grp)},\n      note: ${q(zk)},\n    },\n`;
  const [c, g] = e.ratio.split(':');
  const kk = `【後期(一般)選抜】調査書の評定と学力検査の成績の比:${c}対${g}。適性検査:${e.apt ? 'あり(○)' : 'なし'}。学力検査の傾斜配点:${e.tilt ? 'あり(○・数学と外国語[英語]を1.5倍)' : 'なし'}。県外志願者受入れ:${e.outG ? 'あり(○)' : 'なし'}。`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(dept)},\n      selectionCategory: '後期(一般)選抜',\n      interviewRequired: false,\n      ratioType: ${q(`調査書${c}:学力検査${g}`)},\n      note: ${q(kk)},\n    },\n`;
}
const names = new Set(D.map((e) => e.name));
const ts = `// 山形県: 令和9年度山形県公立高等学校入学者選抜における前期(特色)選抜及び後期(一般)選抜の概要(2026-09-20に令和8年度版から差し替え。差分は ops/baselines/yamagata-r9/・検査日程は令和9年1/19(A)・2/2(B))。
//
// 一次ソース: 山形県教育委員会
//  ・「前期(特色)選抜及び後期(一般)選抜の概要」(\`https://www.pref.yamagata.jp/documents/42443/r8senbatsugaikyo.pdf\`・2頁・令和7年7月30日更新)
//  ・「前期(特色)選抜における検査方法の詳細」(\`https://www.pref.yamagata.jp/documents/42443/r8zennkitokusyokusennbatusyousai.pdf\`・3頁・令和7年6月30日)
//  (県ページ \`https://www.pref.yamagata.jp/700013/koko/2024r8nyuugakusyajouhou.html\`・2026-09-19 pdftoppmで目視転記)。
// 転記データと生成スクリプトは ops/baselines/yamagata-transcription/ に保存。
//
// 山形県は「前期(特色)選抜」(A日程1/20・B日程2/3・募集人員は定員の比率・個人面接/集団面接/作文/発表/その他の検査)と
// 「後期(一般)選抜」(調査書の評定:学力検査の成績の比・適性検査・学力検査の傾斜配点[数学・英語1.5倍])の2段階。
// 概要表の合計行(全日制 A34校/B8校・個人面接29校43学科・集団面接13校20学科・作文23校35学科・発表3校5学科・その他9校15学科・
// 県外志願者受入れ 前期12校14学科/後期11校13学科・適性検査2校2学科・傾斜配点2校3学科)と、転記した学科数を突合して一致を確認した
// (理数探究科と国際探究科をあわせた「探究」は概要表の合計では2学科と数えられる)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const YAMAGATA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'yamagata',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`全日制・定時制の概要表(全${names.size}校${D.length}学科・前期と後期で${D.length * 2}レコード)を完全収録。前期(特色)選抜の学校別の検査内容は検査方法の詳細PDF(3頁)で補完。実施要項・学校別の各校の概要PDF(各校2〜4頁)は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.yamagata.jp/documents/49031/r9gaiyou2.pdf',
    docTitle: '令和9年度山形県公立高等学校入学者選抜における前期（特色）選抜及び後期（一般）選抜の概要（令和8年8月18日更新・山形県教育局高校教育課）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '前期(特色)選抜のinterviewRequiredは個人面接または集団面接がある学科(集団討論・口頭試問・発表のみの学科は含めない)。後期(一般)選抜のratioTypeは「調査書の評定:学力検査の成績」の比。検査日程のAは令和9年1月19日・Bは令和9年2月2日。前期選抜の検査時間・字数等の詳細は令和8年度の検査方法詳細PDFの値を残している(令和9年度版の詳細PDFは未公表・学校別PDFには検査ごとの配点割合のみ記載)。山形市立商業高校の前期募集人員は総合ビジネス科25%程度・情報科10%程度・経済科10%程度(概要表の注※5)。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/yamagata.ts'), ts);
console.log('schools', names.size, 'depts', D.length, 'records', D.length * 2);
