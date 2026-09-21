// T-Y14 mie: data-b4.mjs(別表4の目視転記)から src/data/school-selection-methods/mie.ts を生成する。使い方: node ops/baselines/mie-r9/(令和8年度版の目視転記は ops/baselines/mie-transcription/)gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { B4 } from './data-b4.mjs';
import { B5 } from './data-b5.mjs';
import { B7 } from './data-b7.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const NL = String.fromCharCode(10);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const COLS = ['学力検査の結果', '調査書の内容', '面接の状況', '作文の結果', '実技検査の結果'];
let out = '';
for (const r of B4) {
  const marks = [...r.marks];
  const heavy = COLS.filter((_, i) => marks[i] === '◎');
  const normal = COLS.filter((_, i) => marks[i] === '○');
  const dept = r.course === '定時制' ? r.dept + '(定時制)' : r.dept;
  const note =
    '【令和9年度 後期選抜の選抜資料及び最終段階における「特に重視する選抜資料等」(別表4)・' + r.course + '】' +
    '選抜資料: ' + [...heavy, ...normal].join('・') +
    '(うち特に重視する選抜資料は' + heavy.join('・') + ')' +
    (r.kukuri ? '。くくり募集の学科をまとめた行' : '') +
    '。最終段階の補足: ' + r.txt + '前期選抜の学校別の要件・検査・選抜方法は別表2のレコード(前期選抜(別表2))に、前期選抜の募集枠・検査と後期選抜の教科別配点は別表1のレコードに収録。';
  const lines = ['    {', '      schoolName: ' + q(r.school) + ',', '      department: ' + q(dept) + ',', "      selectionCategory: '後期選抜',"];
  if (marks[2] !== '-') lines.push('      interviewRequired: true,');
  lines.push('      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
}
// 別表5 スポーツ特別枠選抜の募集競技・募集学科(競技×性別を1レコード)
for (const s of B5) {
  const total = s.depts.reduce((a, d) => a + d[1], 0);
  const note = '【令和9年度 スポーツ特別枠選抜の募集競技・募集学科(別表5)・全日制】募集競技: ' + s.sport + '(' + s.sex + ')。募集学科・募集人数: ' + s.depts.map((d) => d[0] + d[1] + '人以内').join('、') + '(合計' + total + '人以内)。応募資格・実技検査・選抜方法は学校ごとのレコード(スポーツ特別枠選抜(別表6))に収録。';
  out += ['    {', '      schoolName: ' + q(s.school) + ',', '      department: ' + q(s.sport + '(' + s.sex + ')') + ',', "      selectionCategory: 'スポーツ特別枠選抜',", '      note: ' + q(note) + ',', '    },'].join(NL) + NL;
}
// 別表1(資料3・学校別実施要項): 前期選抜の募集枠%と検査+後期選抜の教科別配点+面接種別(全日制126行は罫線+座標の自動抽出+画像照合・定時制18行/通信制2行は高解像度画像の目視転記=b1all.py→b1-all.json)
const B1 = JSON.parse(fs.readFileSync(path.join(dir, 'b1-all.json'), 'utf8'));
const b1dept = (r) => (r.course === '全日制' ? r.dept : r.dept.endsWith(')') ? r.dept.slice(0, -1) + '・' + r.course + ')' : r.dept + '(' + r.course + ')');
const b1zenki = (z) => {
  if (!z) return '前期選抜: 実施しない(募集枠なし)';
  const parts = [];
  for (const [k, v] of Object.entries(z.marks)) parts.push(v === true ? k : k + '(' + v + ')');
  if (z.gakuryoku && z.gakuryoku.length) parts.push('学力検査(' + z.gakuryoku.join('・') + ')');
  return '前期選抜: 募集枠' + z.pct + '%' + (z.options ? '、検査=' + z.options : parts.length ? '、検査=' + parts.join('・') : '') + (z.extra ? '。' + z.extra.replace(/。$/, '') : '');
};
const b1koki = (k, course) => {
  if (!k) return '後期選抜: 実施しない(前期選抜のみ・資料は斜線)';
  const pts = ['国語', '数学', '社会', '英語', '理科', '実技検査'].filter((x) => k[x] != null).map((x) => x + k[x]);
  const men = k['面接'] ? '面接(' + k['面接'] + ')' : '面接なし';
  const sak = course === '全日制' ? '' : k['作文'] ? '・作文あり' : '・作文なし';
  return '後期選抜: 配点(' + (pts.length ? pts.join('・') : '学力検査・実技検査なし') + ')・' + men + sak;
};
for (const r of B1) {
  const grp = r.group ? '(' + r.groupName + 'をくくり募集・合計' + r.group + '人)' : '';
  const note =
    '【令和9年度 各高等学校別実施要項(別表1・資料3)・' + r.course + '】入学定員' + r.teiin + '人' + grp + (r.extra ? '(' + r.extra + ')' : '') + '。' +
    b1zenki(r.zenki) + '。' + b1koki(r.koki, r.course) + '。' + (r.saibo ? '再募集・追加募集: ' + r.saibo.replace(/^再募集=/, '再募集=') + '。' : '') +
    '前期選抜の学校別の要件・検査内容・選抜方法(調査書の点数化・面接/作文の評価段階・選抜条件)は別表2のレコード(前期選抜(別表2))に収録。';
  const hasMen = (r.zenki && r.zenki.marks && r.zenki.marks['面接']) || (r.koki && r.koki['面接']);
  const lines = ['    {', '      schoolName: ' + q(r.school) + ',', '      department: ' + q(b1dept(r)) + ',', "      selectionCategory: '前期・後期選抜の実施要項(別表1)',"];
  if (hasMen) lines.push('      interviewRequired: true,');
  lines.push('      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
}
// 別表2(資料4・前期選抜を実施する高等学校の「選抜において重視する要件」「検査内容」「選抜方法」・全69頁): b2tab.py(find_tablesの検査表・選抜方法表+要件の本文)→b2final.py→b2-recs.json。学校の特色の本文は転記していない。
const B2 = JSON.parse(fs.readFileSync(path.join(dir, 'b2-recs.json'), 'utf8'));
for (const r of B2) {
  const note =
    '【令和9年度 前期選抜を実施する高等学校の「選抜において重視する要件」「検査内容」「選抜方法」(別表2・資料4)・' + r.course + '】選抜において重視する要件: ' + r.req +
    '。検査の実施概要: ' + (r.kensa.length ? r.kensa.join(' / ') : '同じ学校の他の学科欄と共通(資料は学科欄を分けて検査表を掲載していない)') +
    '。選抜方法: ' + r.method.join(' ') + '。学校の特色の本文は未収録。';
  const hasMen = r.kensa.some((k) => k.includes('面接'));
  const lines = ['    {', '      schoolName: ' + q(r.school) + ',', '      department: ' + q(r.dept) + ',', "      selectionCategory: '前期選抜(別表2)',"];
  if (hasMen) lines.push('      interviewRequired: true,');
  lines.push('      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
}
// 別表6(資料8・全18頁): スポーツ特別枠選抜の学校別「応募資格」「実技検査」「選抜方法」(実施15校・1校1レコード)。b6ext.py(fitzのテキスト層を学校見出しと節見出しで分割)→b6-recs.json
const B6 = JSON.parse(fs.readFileSync(path.join(dir, 'b6-recs.json'), 'utf8'));
const t = (x) => x.replace(/。$/, '');
for (const r of B6) {
  const note =
    '【令和9年度 スポーツ特別枠選抜を実施する高等学校の「募集競技」「応募資格」「実技検査」「選抜方法」(別表6・資料8)】募集競技(募集学科 募集人数): ' + t(r.bosyu_txt) +
    '。応募資格: ' + t(r.shikaku_txt) +
    '。検査の実施概要: ' + t(r.kensa_txt) +
    '。選抜方法: ' + t(r.senbatsu_txt) + '。';
  const hasMen = /面\s*接/.test(r.senbatsu_txt);
  const lines = ['    {', '      schoolName: ' + q(r.school) + ',', "      department: '全募集競技(スポーツ特別枠選抜)',", "      selectionCategory: 'スポーツ特別枠選抜(別表6)',"];
  if (hasMen) lines.push('      interviewRequired: true,');
  lines.push('      note: ' + q(note) + ',', '    },');
  out += lines.join(NL) + NL;
}
// 別表7(資料9・1頁): 海外帰国生徒・外国人生徒等に係る特別枠入学者選抜(実施21校・26行)。前期選抜の検査内容は別表1・別表2を参照(全行共通)。頁画像からの目視転記(data-b7.mjs)
const KG = { '県': '県作成', '校': '実施校作成' };
for (const [school, dept, zen, kou, saku, men, ko, su, ei] of B7) {
  const zenTxt = zen == null ? '前期選抜: 募集なし(資料は斜線)' : '前期選抜: 募集人数は原則として' + zen + '人以内(検査内容は別表1・別表2を参照)';
  let kouTxt;
  if (kou == null) kouTxt = '後期選抜: 募集なし(資料は斜線)';
  else {
    const gk = [['国語', ko], ['数学', su], ['英語', ei]];
    const done = gk.filter((x) => x[1]).map((x) => x[0] + '(' + KG[x[1]] + '問題)');
    const none = gk.filter((x) => !x[1]).map((x) => x[0]);
    kouTxt = '後期選抜: 募集人数は原則として' + kou + '人以内・検査内容=作文' + (saku === '○' ? 'あり' : 'なし') + '・面接(' + men + ')・学力検査=' + (done.length ? done.join('・') : '課さない') + (none.length && done.length ? '(' + none.join('・') + 'は課さない)' : '');
  }
  const note = '【令和9年度 海外帰国生徒・外国人生徒等に係る特別枠入学者選抜(別表7・資料9)】' + zenTxt + '。' + kouTxt + '。';
  out += ['    {', '      schoolName: ' + q(school) + ',', '      department: ' + q(dept) + ',', "      selectionCategory: '海外帰国生徒・外国人生徒等の特別枠選抜(別表7)',", ...(kou != null ? ['      interviewRequired: true,'] : []), '      note: ' + q(note) + ',', '    },'].join(NL) + NL;
}
const names = new Set([...B4.map((r) => r.school.replace(/\((木本|紀南|度会)校舎\)/, '')), ...B5.map((s) => s.school), ...B1.map((r) => r.school.replace(/\((木本|紀南|度会)校舎\)/, '')), ...B2.map((r) => r.school), ...B6.map((r) => r.school), ...B7.map((r) => r[0].replace(/\((木本|紀南|度会)校舎\)/, ''))]);
const zen = B4.filter((r) => r.course === '全日制').length;
const tei = B4.filter((r) => r.course === '定時制').length;
const ts = `// 三重県: 令和9年度三重県立高等学校入学者選抜における各高等学校別後期選抜の選抜資料及び選抜方法の最終段階における「特に重視する選抜資料等」一覧(別表4)。
//
// 一次ソース: 三重県教育委員会「令和9年度三重県立高等学校入学者選抜実施要項」別表4
// (県ページ \`https://www.pref.mie.lg.jp/common/04/ci600017179.htm\`・\`https://www.pref.mie.lg.jp/common/content/001264584.pdf\`・資料6=別表4・全6頁・令和9年度版は2026-09-20取得しpdftotext -bboxの座標で令和8年度版(目視転記)と突合して更新。別表5は001264585.pdf)。
// 転記データと検算スクリプトは ops/baselines/mie-r9/(令和8年度版の目視転記は ops/baselines/mie-transcription/) に保存。
//
// 三重県の後期選抜は、学校・学科ごとに選抜資料(学力検査の結果・調査書の内容・面接の状況・作文の結果・実技検査の結果)を定め、選抜方法の最終段階(選抜方法の(5)の段階)で
// 「特に重視する選抜資料等」を◎で公表している。学力検査を重視する学校(◎学力検査・○調査書)が多い一方、面接を◎とする学校(名張・飯南・相可の一部・明野・久居農林・伊賀白鳳等)、
// 調査書を◎とする学校(桑名工業・四日市四郷・伊勢工業・白子・稲生)がある。定時制は全校が面接の状況を◎としている。
// 検算: 全レコードで印が5列の形式(◎/○/空欄)であり◎を1つ以上持つこと、補足文を持つことを確認(ops/.../check.mjs)。
// スポーツ特別枠選抜(別表5・資料7)は実施15校の募集競技×性別44レコードを募集学科・募集人数(合計196人以内)とともに収録した。
// 別表1(資料3・\`https://www.pref.mie.lg.jp/common/content/001264581.pdf\`・全8頁・学校別実施要項)は2026-09-21に収録した: 全日制126学科行(前期選抜の募集枠%・検査[面接/自己表現/作文/小論文/実技検査/学力検査/総合問題]と後期選抜の教科別配点・面接種別)・定時制18行(再募集・追加募集含む)・通信制2行(北星・松阪)。全日制は罫線と座標から抽出し全6頁を画像と照合した(ops/baselines/mie-r9/b1x.py・b1parse.py・b1all.py)。
// 別表2(資料4・\`https://www.pref.mie.lg.jp/common/content/001264582.pdf\`・全69頁)は2026-09-22に収録した: 前期選抜を実施する全日制63学科群・定時制5・通信制1の計69レコード(学校×学科群)に、選抜において重視する要件・検査の実施概要(面接の形式と時間・作文/小論文の時間と字数・学力検査教科・実技検査の内容)・選抜方法(調査書の点数化・面接/作文の評価段階・第1段階以降の選抜条件)を転記した(ops/baselines/mie-r9/b2tab.py・b2final.py)。
// 別表6(資料8・\`https://www.pref.mie.lg.jp/common/content/001264586.pdf\`・全18頁)は2026-09-22に収録した: スポーツ特別枠選抜を実施する15校(1校1レコード)の募集競技(募集学科・人数)・応募資格・検査の実施概要(実技検査の内容・津工業は個人面接15分)・選抜方法(調査書の点数化・面接/学力検査/実技検査の評価段階・第1段階以降の選抜条件)を転記した(ops/baselines/mie-r9/b6ext.py)。稲生のみ普通科と体育科で選抜方法が異なるため両方を1レコードに収めた。
// 別表7(資料9・\`https://www.pref.mie.lg.jp/common/content/001264587.pdf\`・1頁の表)は2026-09-22に収録した: 海外帰国生徒・外国人生徒等に係る特別枠入学者選抜の実施21校26行の前期/後期の募集人数(斜線=募集なし)・後期の作文/面接/学力検査(県作成○・実施校作成●・空欄=課さない)を頁画像(ops/baselines/mie-r9/b7p1.png)から目視転記した(data-b7.mjs)。
// 未収録: 学校の特色の本文。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const MIE_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'mie',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q('後期選抜の選抜資料と最終段階で特に重視する選抜資料(別表4)を全日制' + zen + 'レコード・定時制' + tei + 'レコードで完全収録し、スポーツ特別枠選抜の募集競技・募集学科(別表5)' + B5.length + 'レコード、および学校別実施要項(別表1・全日制' + B1.filter((r) => r.course === '全日制').length + '行・定時制' + B1.filter((r) => r.course === '定時制').length + '行・通信制' + B1.filter((r) => r.course === '通信制').length + '行=前期選抜の募集枠と検査・後期選抜の教科別配点と面接種別)を加えた(' + names.size + '校・' + (B4.length + B5.length + B1.length + B2.length + B6.length + B7.length) + 'レコード)。前期選抜の学校別の要件・検査・選抜方法(別表2)' + B2.length + 'レコードも収録。スポーツ特別枠選抜の学校別の応募資格・実技検査・選抜方法(別表6)' + B6.length + 'レコードも収録。海外帰国生徒・外国人生徒等の特別枠選抜(別表7)' + B7.length + 'レコードも収録。学校の特色の本文は未収録')},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.mie.lg.jp/common/04/ci600017179.htm',
    docTitle: '令和9年度三重県立高等学校入学者選抜実施要項 別表1・4・5（三重県教育委員会・令和9年度資料3・6・7）',
    lastChecked: '2026-09-21',
  },
  note: '別表4は選抜資料の配点比率ではなく、後期選抜の最終段階で「特に重視する選抜資料等」を◎、選抜資料に該当するものを○で示す一覧。各レコードのnoteに選抜資料と最終段階の補足文をそのまま記載。くくり募集の学科は資料どおり1行にまとめた。interviewRequiredは面接の状況が選抜資料(◎/○)である学科のみtrue。別表1(前期・後期選抜の実施要項)のレコードは学校×学科ごとに前期選抜の募集枠%・検査と後期選抜の教科別配点・面接種別を記載(全日制は罫線と座標から自動抽出し画像で全頁照合・定時制と通信制は画像の目視転記)。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/mie.ts'), ts);
console.log('schools', names.size, 'records', B4.length + B5.length + B1.length + B2.length + B6.length + B7.length,'全日制', zen, '定時制', tei);

