// T-Y14 nagasaki: data.mjs(目視転記)から src/data/school-selection-methods/nagasaki.ts を生成する。使い方: node ops/baselines/nagasaki-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NG, TEI, TSUSHIN, RITO } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const fmt = (n) => (Number.isInteger(n) ? String(n) : String(n));
const SUBJ = ['国', '社', '数', '理', '英'];
let out = '';
let recs = 0;
const rec = (school, dept, cat, itv, ratio, note) => {
  const lines = ['    {', '      schoolName: ' + q(school) + ',', '      department: ' + q(dept) + ',', '      selectionCategory: ' + q(cat) + ','];
  if (itv) lines.push('      interviewRequired: true,');
  if (ratio) lines.push('      ratioType: ' + q(ratio) + ',');
  lines.push('      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
  recs++;
};
const H = '【令和9年度 学校・学科・コース別募集定員、実施内容等一覧';
for (const r of NG) {
  if (r.skip) continue; // 離島留学特別選抜は頁34-36の別レコードで収録
  const course = r.course || '全日制課程';
  const dept = r.course ? r.dept : r.dept;
  const base = H + '・' + course + '】';
  const teiinText = '募集定員' + r.teiin + '人' + (r.koko != null ? '(併設中学以外からの募集定員' + r.koko + '人)' : '');
  // 特別選抜(自己推薦①②)
  for (const t of r.tk || []) {
    if (t[2] == null && t[3] == null && t[4] == null) continue; // 実施なし
    const parts = [];
    if (t[2] != null) parts.push('調査書等' + fmt(t[2]));
    if (t[3] != null) parts.push('面接' + fmt(t[3]));
    if (t[4] != null) parts.push('プレゼンテーション' + fmt(t[4]));
    const ratio = parts.join(':') + '(比重・合計10)';
    const cnt = /^[0-9]+$/.test(t[1]) ? t[1] + '人' : /^[0-9]+(以内|以上)$/.test(t[1]) ? t[1].replace(/(以内|以上)$/, '人$1') : t[1];
    let note = base + teiinText + '。特別選抜(' + t[0] + '): 各募集定員' + cnt;
    if (r.tkN != null && r.tkN > 0 && !r.grp) note += '(特別選抜の募集定員合計' + r.tkN + '人)';
    if (r.grp && r.tkN) note += '(結合セル: 同グループの特別選抜の募集定員合計' + r.tkN + '人)';
    if (t[7]) note += '。適用分野・部活動名等: ' + t[7];
    // 凡例(頁1 ※4): 面接に英語を含む場合は「英」、プレゼンテーションに質疑応答を含む場合は「質」、質疑応答及び英語を含む場合は「質英」と記載
    const MARK = { 英: '面接に英語を含む', 質: 'プレゼンテーションに質疑応答を含む', 質英: 'プレゼンテーションに質疑応答及び英語を含む' };
    if (t[6]) note += '。' + (MARK[t[6]] || (t[6].startsWith('質英(') ? MARK['質英'] + t[6].slice(2) : t[6]));
    note += '。出願要件(評定基準等)は各高校の募集要項で確認すること。';
    rec(r.school, dept, '特別選抜(' + t[0] + ')', t[3] != null, ratio, note);
  }
  // 一般選抜
  if (r.gen) {
    const g = r.gen;
    const ratio = '調査書等' + fmt(g.cho) + ':学力検査' + fmt(g.gaku) + ':面接' + fmt(g.itv) + '(比重・合計10)';
    const pts = SUBJ.map((s, i) => s + g.pts[i]).join('・');
    let note = base + teiinText + '。一般選抜' + (g.n ? ': 募集定員' + g.n + '人' : '(結合セル: 同グループの一般選抜の募集定員に含む)') + '。各教科の配点(点): ' + pts + '(合計' + g.pts.reduce((a, b) => a + b, 0) + '点)';
    if (g.hard) note += '。' + g.hard + 'は難度の高い問題(選択問題)を実施する教科';
    note += '。面接は' + g.mode + '。県外受入定員: ' + (r.gai || '-') + '。区域外(普通科からの入学)枠: ' + (r.ku || '-');
    if (r.extra) note += '。募集定員には離島留学特別選抜の募集定員' + r.extra + '名程度を含む';
    if (r.memo) note += '。' + r.memo;
    note += '。';
    rec(r.school, dept, '一般選抜', true, ratio, note);
  }
  // チャレンジ選抜
  if (r.chal) {
    const ratio = '調査書等' + fmt(r.chal[0]) + ':面接' + fmt(r.chal[1]) + '(比重・合計10)';
    rec(r.school, dept, 'チャレンジ選抜', true, ratio, base + teiinText + '。チャレンジ選抜: 調査書等' + r.chal[0] + '・面接' + r.chal[1] + '(比重・合計10)。');
  }
}
// 頁32 定時制課程(昼間部を除く)
for (const t of TEI) {
  const isYakan = t.school.includes('夜間部');
  const school = t.school.replace(/\((夜間部)\)/, '');
  const dept = t.dept + (isYakan ? '(夜間部)' : '(定時制)');
  const note = H + '・定時制課程(昼間部を除く)】募集定員' + t.teiin + '人。Ⅰ期選抜: 募集定員' + t.n1 + '人・検査の方法=' + t.k1 + '。Ⅱ期選抜: 募集定員は欠員数(全募集定員からⅠ期選抜の合格者数を除いた数)・検査の方法=' + t.k2 + '。面接はすべて対面で行う。';
  rec(school, dept, 'Ⅰ期選抜(定時制)', true, '', note);
  rec(school, dept, 'Ⅱ期選抜(定時制)', true, '', note);
}
// 頁33 通信制課程
for (const s of TSUSHIN) rec(s[0], s[1] + '(通信制)', '通信制課程募集定員', false, '', H + '・通信制課程】募集定員' + s[2] + '人。');
// 頁34-36 離島留学特別選抜/美術・工芸科特別選抜
for (const r of RITO) {
  const w = r.w;
  const parts = [];
  if (w.cho != null) parts.push('調査書等' + w.cho);
  if (w.itv != null) parts.push('面接' + w.itv);
  if (w.pre != null) parts.push('プレゼンテーション' + w.pre);
  if (w.jitsu != null) parts.push('実技' + w.jitsu);
  if (w.saku != null) parts.push('作文' + w.saku);
  rec(r.school, r.dept, r.kind, w.itv != null, parts.join(':') + '(比重・合計10)', H + '・' + r.kind + '(頁34-36)】募集定員' + r.n + '。検査の方法等: ' + r.method + '。');
}
const names = new Set([...NG.map((r) => r.school), ...TEI.map((t) => t.school.replace(/\((夜間部)\)/, '')), ...TSUSHIN.map((s) => s[0]), ...RITO.map((r) => r.school)]);
const ts = `// 長崎県: 令和9年度長崎県公立高等学校入学者選抜「学校・学科・コース別募集定員、実施内容等一覧」(全日制・定時制・通信制・離島留学特別選抜・美術工芸科特別選抜)。
//
// 一次ソース: 長崎県教育委員会「令和9年度公立高等学校入学者選抜に係る各高等学校の実施内容」(令和8年6月19日時点・2026-06-19公表)
// (県ページ \`https://www.pref.nagasaki.lg.jp/press-contents/48655.html\`・\`https://www.pref.nagasaki.jp/fs/2/4/2/5/7/_/__9____________________.pdf\`・全37頁)。令和8年度版を150dpi画像で目視転記したデータ(data.mjs)に対し、2026-09-21に**R8/R9のPDFをPyMuPDF find_tablesで表抽出して行ごとに差分検出**(ops/baselines/nagasaki-r9/diff6.py)し、実差分40ブロックだけを反映した(該当行は画像で目視確認)。
// 転記データと検算スクリプトは ops/baselines/nagasaki-transcription/ に保存。
//
// 長崎県は学科・コースごとに 特別選抜(自己推薦①②)・一般選抜・チャレンジ選抜の「各検査項目等の比重(合計10)」と、一般選抜の各教科の配点(国社数理英・数学/英語を150〜200点とする傾斜配点学科あり)を公表している。
// 特別選抜は調査書等:面接(またはプレゼンテーション)、一般選抜は調査書等:学力検査:面接、チャレンジ選抜は調査書等:面接。出願要件(評定基準等)は各高校の募集要項で確認する運用。
// 検算(ops/.../check.mjs): ①特別選抜の各行の比重の和=10 ②一般選抜の比重の和=10 ③特別選抜+一般選抜の募集定員=募集定員(併設中学以外の数があればそれ・結合セルはグループ合算)
// ④離島留学特別選抜・美術工芸科特別選抜の比重の和=10 ⑤課程別の募集定員(全日制県立8,520・公立8,760・定時制夜間部480[Ⅰ期336]・昼間部80・通信制600)と転記合計が全て一致。
// 未収録: 各高校の「育成したい生徒・求める生徒像」の本文・特別選抜の出願要件の本文・県外受入定員と区域外枠の細則。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const NAGASAKI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'nagasaki',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q('全日制・定時制・通信制の学校・学科・コース別の選抜方法(特別選抜・一般選抜・チャレンジ選抜の比重と一般選抜の教科別配点)と離島留学特別選抜・美術工芸科特別選抜を完全収録(' + names.size + '校・' + recs + 'レコード)。育成したい生徒像の本文と出願要件の本文は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.nagasaki.lg.jp/press-contents/48655.html',
    docTitle: '令和９年度長崎県公立高等学校入学者選抜実施内容（令和8年6月19日時点・長崎県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: 'ratioTypeは各検査項目等の比重(合計10)。特別選抜=調査書等:面接(自己推薦②で面接に代えてプレゼンテーションを課す学校あり)、一般選抜=調査書等:学力検査:面接、チャレンジ選抜=調査書等:面接。一般選抜の教科別配点と数学・英語の難度の高い問題の有無はnoteに記載。特別選抜の募集定員が学科をまたいで結合されている学校(大村・猶興館・松浦・対馬・小浜・口加・川棚・各農業・工業・商業高校等)は結合セルとしてグループ合算で検算した。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/nagasaki.ts'), ts);
console.log('schools', names.size, 'records', recs);
