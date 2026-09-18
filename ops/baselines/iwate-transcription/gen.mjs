// T-Y14 iwate: 地区別 *.mjs(目視転記)から src/data/school-selection-methods/iwate.ts を生成する。使い方: node ops/baselines/iwate-transcription/gen.mjs
// 地区を追加したら REGIONS に [ファイル名, 地区名] を足す。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const REGIONS = [['./morioka.mjs', '盛岡地区']];
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
let out = '';
let recs = 0;
const names = new Set();
const push = (name, dept, cat, itv, ratio, note) => {
  out += `    {\n      schoolName: ${q(name)},\n      department: ${q(dept)},\n      selectionCategory: ${q(cat)},\n      interviewRequired: ${itv},\n${ratio ? `      ratioType: ${q(ratio)},\n` : ''}      note: ${q(note)},\n    },\n`;
  recs++;
};
for (const [file, region] of REGIONS) {
  const { I } = await import(file);
  for (const e of I) {
    names.add(e.name);
    const base = `【令和8年度 実施概要・${region}・学校番号${e.no}・${e.course}】`;
    const g = e.gen;
    const own = g.own ? `、学校独自検査:${g.own}` : '、学校独自検査:なし';
    push(e.name, e.dept, '一般入学者選抜', /面接/.test(g.own), `学力検査${g.gaku}:調査書${g.chosho}${g.own ? ':独自' + (g.total - g.gaku - g.chosho) : ''}`, `${base}募集定員:${g.quota}。学力検査:調査書の比率${g.ratio.replace(':', '対')}(学力検査${g.gaku}点+調査書${g.chosho}点${own})、合計${g.total}点。`);
    const t = e.toku;
    push(e.name, e.dept, '特色入学者選抜', /面接/.test(t.parts), '', `${base}募集人員:${t.quota}。選抜方法:${t.parts}、合計${t.total}点。一次選考の有無:${t.pre}。`);
    if (e.niji) push(e.name, e.dept, '二次募集', /面接/.test(e.niji.parts), '', `${base}選抜方法:${e.niji.parts}、合計${e.niji.total}点。${e.extra || ''}`);
  }
}
const ts = `// 岩手県: 令和8年度岩手県立高等学校入学者選抜実施概要(学校別)。
//
// 一次ソース: 岩手県教育委員会「令和8年度岩手県立高等学校入学者選抜実施概要」(地区別PDF・学校ごとに1〜2頁)
// (県ページ \`https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/1091420.html\`・
// 盛岡地区: \`https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/091/420/r8_morioka.pdf\`・
// 2026-09-19 pdftoppm 100dpiで目視転記)。転記データと生成スクリプトは ops/baselines/iwate-transcription/ に保存。
//
// 岩手県は「一般入学者選抜」(学力検査:調査書の比率[例:盛岡第一=7対3]・学校独自検査の有無)と「特色入学者選抜」(募集人員・調査書/志願理由書/面接/プレゼン/作文等の配点)と
// 「二次募集」(調査書270点+面接+作文等)を学校・学科別に公表する。一般入学者選抜は全校で学力検査と調査書の合計が1000点(学校独自検査を課す学科は+100点で1100点)。
// 収録済み地区: 盛岡地区14校(全日制)。未収録: 中部・県南・沿岸南部・宮古・県北・定時制の各地区PDF。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const IWATE_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'iwate',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(`盛岡地区(全日制)の実施概要を完全収録(${names.size}校・${recs}レコード)。中部・県南・沿岸南部・宮古・県北・定時制の各地区PDFは未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/1091420.html',
    docTitle: '令和8年度岩手県立高等学校入学者選抜実施概要（岩手県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '一般入学者選抜のratioTypeは学力検査:調査書[:学校独自検査]の配点。特色入学者選抜・二次募集は配点の内訳をnoteに転記(比率はなし)。interviewRequiredは面接(個人面接・集団面接・プレゼンテーション・面接)を課す選抜。調査書の換算方法(中学1年の評定×1+2年×2+3年×3の合計270点を圧縮など)は各校の記載のままnoteに転記した。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/iwate.ts'), ts);
console.log('schools', names.size, 'records', recs);
