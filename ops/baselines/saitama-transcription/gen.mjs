// T-Y14 saitama: data.mjs(手作業転記した学校別タプル)から src/data/school-selection-methods/saitama.ts を生成する。
// 使い方: node ops/baselines/saitama-transcription/gen.mjs
// 元PDFは pdf-list.json の file を https://www.pref.saitama.lg.jp/documents/268454/<file> から取得し、
// pdftoppm -r 100 でPNG化して目視転記する(PDFはCJKフォントのCMap欠落でテキスト抽出不可)。
import fs from 'fs';
import { D } from './data.mjs';

const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char in: ' + s.slice(0, 30));
  return QC + s + QC;
};
const stage = (n, s, oth, g = 500) => {
  const [pct, ch, op, tot] = s;
  const parts = [`学力${g}`, `調査書${ch}`];
  if (op != null) parts.push(`${oth ? oth[0] : 'その他'}${op}`);
  return `第${n}次${pct}%[${parts.join(':')}=${tot}]`;
};
let out = '';
for (const e of D) {
  const g = e.g || 500;
  const rp = [stage(1, e.s1, e.oth, g), stage(2, e.s2, e.oth, g)];
  if (e.s3) rp.push('第3次' + e.s3);
  const ratioType = rp.join('/');
  let ch = '';
  if (e.ch) ch = `調査書:学習の記録${e.ch[0]}点(1〜3年の比${e.ch[1]})・特別活動等の記録${e.ch[2]}点・その他の項目${e.ch[3]}点=計${e.ch[4]}点。`;
  const note = `【選抜基準PDF】基本方針:${e.pol}学力検査${g}点。${ch}その他の資料:${e.oth ? e.oth[0] + e.oth[1] + '点' : 'なし'}。第2志望:${e.d2}。その他:${e.so}。${e.extra ? e.extra : ''}`.replace(/。。/g, '。');
  out += '    {\n';
  out += `      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '一般募集',\n      interviewRequired: ${e.oth && e.oth[0] === '面接' ? 'true' : 'false'},\n      ratioType: ${q(ratioType)},\n      note: ${q(note)},\n    },\n`;
}
const names = [...new Set(D.map((e) => e.name))];
const cov = names.length >= 131 ? `令和8年度全日制の選抜基準PDF131本(市立高校5校を含む)を全て収録(${names.length}校${D.length}レコード)。定時制課程のPDF23本は未着手` : `令和8年度全日制の選抜基準PDF(1校または1学科群につき1PDF・全日制131PDF)のうち${names.length}校${D.length}レコードを収録(収録順: ${names.join('/')})。定時制・市立高校の一部は未着手`;
const header = `// 埼玉県: 令和8年度埼玉県公立高等学校入学者選抜における各高等学校の選抜基準(全日制)。
//
// 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校入学者選抜における各高等学校の選抜基準」
// (\`https://www.pref.saitama.lg.jp/f2208/r8senbatsu-kijun.html\`)からリンクされる学校別PDF
// (\`/documents/268454/NNN_xxx.pdf\`・1校または学科群につき1PDF)。PDFはCJKフォントのCMap欠落で
// テキスト抽出できないためpdftoppm(100dpi)で画像化して目視転記した(転記データと生成スクリプトは
// ops/baselines/saitama-transcription/ に保存)。
//
// 埼玉県の選抜は「一般募集」を第1次(成績上位から所定%を入学許可候補者)・第2次・第3次の段階で行う。
// 各校の学力検査は500点満点で、調査書の配点(学習の記録の学年比・特別活動等の記録・その他の項目)、
// 各段階で用いる調査書の換算点、面接・実技検査など「その他の資料」の有無が学校ごとに異なる。
// ratioTypeには各段階の「%[学力:調査書:その他=合計]」を転記した。数値は資料に印字された点数の
// 転記のみで、独自推定は含まない。「その他」欄が「実施しない」の学校は面接等を行わない。
`;
const ts = `${header}
import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const SAITAMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'saitama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    ${q(cov)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.saitama.lg.jp/f2208/r8senbatsu-kijun.html',
    docTitle: '令和8年度埼玉県公立高等学校入学者選抜における各高等学校の選抜基準（埼玉県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '第1次〜第3次選抜の人員は資料の注記どおり同点の扱い等で若干増減することがある。調査書の得点は各校が定めた係数を乗じて換算した値(資料の各段階の表に印字されたもの)を転記した。学校ごとの調査書の詳細(部活動・資格等の評価区分)はPDF本文にあり本DBではnoteに要点のみ記載する。',
};
`;
fs.writeFileSync('src/data/school-selection-methods/saitama.ts', ts);
console.log('schools', names.length, 'records', D.length);
