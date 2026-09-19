// rows.json(extract.mjs)から src/data/school-selection-methods/tochigi.ts を令和9年度版で生成する。
// R8(現行tochigi.ts)との学校・学科の増減を標準出力に出す。node gen-r9.mjs [--write]
import fs from 'fs';
const rows = JSON.parse(fs.readFileSync('rows.json', 'utf8')).filter((r) => r.school !== '学校名');
const tsPath = '../../../src/data/school-selection-methods/tochigi.ts';
const old = fs.readFileSync(tsPath, 'utf8');
const oldPairs = new Set([...old.matchAll(/schoolName: '([^']*)',\s+department: '([^']*)',\s+selectionCategory: '特色選抜'/g)].map((m) => m[1] + '/' + m[2]));
const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const name = (s) => s.replace(/高校$/, '');
const CIRCLE_JA = { kojin: '個人面接', shudan: '集団面接', presen: 'プレゼンテーション', group: 'グループ討論' };
const recs = [];
const newPairs = new Set();
for (const r of rows) {
  const sn = name(r.school);
  newPairs.add(sn + '/' + r.dept);
  const doku = ['kojin', 'shudan', 'presen', 'group'].filter((k) => r.circles.includes(k)).map((k) => CIRCLE_JA[k]);
  const interview = r.circles.includes('kojin') || r.circles.includes('shudan');
  const jiko = r.circles.includes('jiko');
  const sum = r.tokuGaku + r.tokuCho + r.tokuDoku;
  const head = '【令和9年度 全日制課程入学者選抜における「入試情報」等 No.' + r.page + '】男女:' + r.gender + '。';
  recs.push({
    sn, dept: r.dept, cat: '特色選抜', interview,
    ratio: `学力検査${r.tokuGaku}:調査書${r.tokuCho}:学校独自検査${r.tokuDoku}`,
    note: `${head}特色選抜(学力検査は一般選抜の学力検査で代替): 特色選抜の定員の割合${r.ratio}%(募集定員の上限50%の範囲で学校・学科ごとに設定)。学校独自検査:${doku.length ? doku.join('・') : '表に○の記載なし(面接・プレゼンテーション・グループ討論以外の検査または実施なし)'}。自己表現シート(学校独自質問):${jiko ? 'あり' : '記載なし'}。比重(点):学力検査${r.tokuGaku}・調査書${r.tokuCho}・学校独自検査${r.tokuDoku}(合計${sum})`,
  });
  recs.push({
    sn, dept: r.dept, cat: '一般選抜', interview: false,
    ratio: `学力検査${r.ippanGaku}:調査書${r.ippanCho}`,
    note: `${head}一般選抜: 比重(点)学力検査${r.ippanGaku}・調査書${r.ippanCho}(合計${r.ippanGaku + r.ippanCho})。傾斜配点:${r.keihai ? r.keihai + '(表の傾斜配点欄の記載)' : '斜線(なし)'}。一般選抜の選抜資料は調査書・学力検査(実技検査実施校は実技検査を含む)で、面接は含まれない(令和9年度選抜要項)`,
  });
}
const added = [...newPairs].filter((p) => !oldPairs.has(p)), removed = [...oldPairs].filter((p) => !newPairs.has(p));
console.log('R9', rows.length, '学科 /', new Set(rows.map((r) => r.school)).size, '校 → レコード', recs.length, '| R8学科', oldPairs.size);
console.log('R9のみ', added.length, added.join(', '));
console.log('R8のみ', removed.length, removed.join(', '));
if (process.argv.includes('--write')) {
  const body = recs.map((r) => `    {\n      schoolName: '${q(r.sn)}',\n      department: '${q(r.dept)}',\n      selectionCategory: '${r.cat}',\n      interviewRequired: ${r.interview},\n      ratioType: '${q(r.ratio)}',\n      note: '${q(r.note)}',\n    },\n`).join('');
  const out = `// 栃木県: 令和9(2027)年度県立高等学校全日制課程入学者選抜における「入試情報」等(特色選抜・一般選抜の比重と学校独自検査)。
//
// 一次ソース: 栃木県教育委員会「令和9(2027)年度県立高等学校入学者選抜に係る『学校(学科)情報・入試情報』について（一覧）」
// (\`https://www.pref.tochigi.lg.jp/m04/r09/documents/20260608135817.pdf\`・2026-06-08版・全4頁[全日制=頁1〜3・定時制=頁4]・
// テキスト層あり。県ページ: \`https://www.pref.tochigi.lg.jp/m04/r09/r09kenritukoutougakkounyuugakushasennbatunikannsuruosirase.html\`)。
// 選抜制度は『令和9(2027)年度栃木県立高等学校入学者選抜要項』(2026-04-01掲載・\`.../documents/20260401144326.pdf\`)による。
// 抽出は ops/baselines/tochigi-r9/(extract.mjs=座標抽出・verify.mjs=layout抽出との突合[101行全て数値列・○個数が一致]・gen-r9.mjs)。
//
// ★令和9年度から制度が変わった(令和8年度版とは別物): 特色選抜は『学力検査(一般選抜と同一)+学校独自検査+調査書』の3要素を
// 点数化し(学力検査は500点固定)、特色選抜の定員の割合は上限50%(令和8年度までは10%程度〜100%と学校ごと)。学校独自検査は
// 個人面接・集団面接・プレゼンテーション・グループ討論を○で表示し、自己表現シートに学校独自質問があるかも表示される。
// 一般選抜は学力検査500点と調査書点(学校・学科ごとに異なる)の比重で、面接は含まれない。旧制度(令和8年度)の
// 『学力検査と調査書の比重9:1〜5:5・面接の有無・小論文/作文の時間と字数』は本データに引き継がない。
// 転記: 全日制101学科(54校)。定時制(フレックス特別選抜等)・通信制は未収録。
// R8→R9で学校・学科の増減がある場合はgen-r9.mjsの出力を参照(2026-09-20時点: R9のみ${added.length}・R8のみ${removed.length})。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const TOCHIGI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'tochigi',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    '全日制課程全3頁を完全収録(${new Set(rows.map((r) => r.school)).size}校・${rows.length}学科・特色選抜と一般選抜の各1レコードで${recs.length}レコード)。定時制・通信制は未収録',
  schools: [
${body}  ],
  source: {
    url: 'https://www.pref.tochigi.lg.jp/m04/r09/documents/20260608135817.pdf',
    docTitle: '令和9(2027)年度県立高等学校全日制課程入学者選抜における「入試情報」等（栃木県教育委員会）',
    lastChecked: '2026-09-20',
  },
  note: '令和9年度から特色選抜が学力検査・学校独自検査・調査書の3要素の点数比重(学力検査500点固定)になり、特色選抜の定員の割合は上限50%。令和8年度までの比重(9:1〜5:5)・面接の有無とは制度が異なるため過年度と直接比較しないこと。',
};
`;
  fs.writeFileSync(tsPath, out);
  console.log('wrote', tsPath);
}
