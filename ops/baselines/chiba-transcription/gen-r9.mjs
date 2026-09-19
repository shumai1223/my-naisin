// T-Y14 chiba: 千葉県公式ページ「令和9年度千葉県公立高等学校「一般入学者選抜」の検査の内容等（全日制の課程）」
// (https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r9/r9zennichi.html・2026-09-20 curl取得)の
// HTML表(学校番号1〜121+市立高校)を解析して src/data/school-selection-methods/chiba.ts を生成する。
// 使い方: node ops/baselines/chiba-transcription/gen.mjs  (r9zennichi.html は同ディレクトリに保存済み)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, 'r9zennichi.html'), 'utf8');
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s);
  return QC + s + QC;
};
const clean = (s) => s.replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const lines = (cell) => cell.split(/<br\s*\/?>/i).map(clean).filter(Boolean);

const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => m[0]);
const records = [];
const warnings = [];
tables.forEach((t, ti) => {
  const isCity = ti === tables.length - 1;
  const rows = [...t.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((m) => m[0]);
  for (const r of rows) {
    const th = r.match(/<th[^>]*scope="row"[^>]*>([\s\S]*?)<\/th>/);
    const tds = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    if (!th || tds.length < 4) continue;
    const no = clean(th[1]);
    const name = clean(tds[0]);
    const depts = lines(tds[1]);
    const exam = lines(tds[2]);
    const reason = lines(tds[3]);
    const kukuri = depts.some((d) => d.startsWith('＊'));
    const deptNames = depts.map((d) => d.replace(/^＊/, ''));
    const resolve = (ls, d, dn) => {
      // ls: e.g. ['普通科：面接','家政科：適性検査'] / ['全学科：面接'] / ['面接、自己表現'] / ['無']
      const keyed = ls.filter((x) => x.includes('：'));
      if (!keyed.length) return ls.join('、');
      const hits = [];
      for (const k of keyed) {
        const [key, ...v] = k.split('：');
        const val = v.join('：');
        const kk = key.replace(/科$/, '');
        if (key === '全学科' || dn === kk || dn.startsWith(kk) || kk.startsWith(dn) || dn.replace(/科$/, '') === kk) hits.push(val);
      }
      if (!hits.length) warnings.push(`${name}/${dn}: 未対応 ${ls.join('|')}`);
      return hits.join('、');
    };
    deptNames.forEach((dn, i) => {
      const examv = resolve(exam, depts[i], dn);
      const reasonv = resolve(reason, depts[i], dn);
      records.push({ no, name, dept: dn, kukuri: depts[i].startsWith('＊'), exam: examv, reason: reasonv, city: isCity, kukuriAll: kukuri });
    });
  }
});

let out = '';
for (const e of records) {
  const hasInterview = e.exam.includes('面接');
  const note = `【検査の内容等(全日制)】学校番号${e.no}${e.city ? '(市立高等学校)' : ''}。学校設定検査の内容:${e.exam || '記載なし'}。志願理由書:${e.reason || '記載なし'}。${e.kukuri ? 'くくり募集を実施する学科(表の「＊」)。' : ''}学力検査は5教科(国語・数学・英語・理科・社会)で実施。`;
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '一般入学者選抜',\n      interviewRequired: ${hasInterview},\n      note: ${q(note)},\n    },\n`;
}
const names = new Set(records.map((e) => e.name));
const ts = `// 千葉県: 令和9年度千葉県公立高等学校「一般入学者選抜」の検査の内容等（全日制の課程）。
//
// 一次ソース: 千葉県教育委員会「令和9年度千葉県公立高等学校「一般入学者選抜」の検査の内容等（全日制の課程）」
// (\`https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r9/r9zennichi.html\`・2026-09-20 curlでHTMLを取得)。
// 学校番号ごとの表(学校名・学科名・学校設定検査の内容・志願理由書の要否)を機械解析して転記した
// (取得したHTMLと生成スクリプトは ops/baselines/chiba-transcription/ に保存)。
// 千葉県は学力検査を5教科で実施し、学校設定検査(面接・自己表現・作文・小論文・適性検査・集団討論等)を
// 学校・学科ごとに課す。学校別の調査書/学力検査の比率・傾斜配点はこのページに無く、別資料
// (「各高等学校の選抜基準」等)にあるため本DBではまだ収録していない(coverageNote参照)。
// 表の「＊」はくくり募集を実施する学科で、noteに明記した。市立高等学校(表4)も収録。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const CHIBA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'chiba',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`全日制課程の県立・市立${names.size}校${records.length}学科の「学校設定検査の内容」「志願理由書の要否」を全て収録。学校別の学力検査・調査書の比率や傾斜配点は本ページに無く未収録(別資料)。定時制課程は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r9/r9zennichi.html',
    docTitle: '令和9年度千葉県公立高等学校「一般入学者選抜」の検査の内容等（全日制の課程）（千葉県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '「学校設定検査の内容」欄に「面接」の記載がある学科をinterviewRequired:trueとした(記載が無い学科は学校設定検査として面接を課さない)。「志願理由書」は「有」が出願時に提出を求める学科。学力検査は全校5教科で実施。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/chiba.ts'), ts);
console.log('schools', names.size, 'records', records.length, 'warnings', warnings.length);
warnings.forEach((w) => console.log('WARN', w));
