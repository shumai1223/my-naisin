// T-Y14 niigata: data.mjs(目視転記)から src/data/school-selection-methods/niigata.ts を生成する。使い方: node ops/baselines/niigata-transcription/gen.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D } from './data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const QC = String.fromCharCode(39);
const q = (s) => {
  if (s.includes(QC) || s.includes(String.fromCharCode(92))) throw new Error('bad char: ' + s.slice(0, 30));
  return QC + s + QC;
};
const outMean = { '◎': '県外中学からの一般枠出願:学校設定枠に出願しなくても可(◎)', '○': '県外中学からの一般枠出願:学校設定枠に出願することを条件に可(○)' };
let out = '';
let recs = 0;
for (const e of D) {
  const base = `【令和9年度 学校・学科ごとの募集人数と選抜方法等・${e.sec}】募集学級${e.cls}・全体募集人数${e.total}(募集学級と全体募集人数は令和8年10月末までに決定)`;
  const extra = [];
  if (e.out) extra.push(outMean[e.out]);
  // 一般枠
  const gnote = [`${base}。一般枠: 募集人数${e.gen}、調査書と学力検査の比重${e.ratio.replace(':', '対')}`];
  gnote.push(e.tilt ? `傾斜配点する教科:${e.tilt}` : '傾斜配点する教科:なし');
  gnote.push(e.second ? `第2志望の実施:${e.second}` : '第2志望の実施:記載なし');
  if (e.own) gnote.push(`学校独自検査:${e.own}`);
  gnote.push(...extra);
  const [c, g] = e.ratio.split(':');
  out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: '一般枠',\n      interviewRequired: ${e.own.includes('面接')},\n      ratioType: ${q(`調査書${c}:学力検査${g}`)},\n      note: ${q(gnote.join('。') + '。')},\n    },\n`;
  recs++;
  for (const w of e.waku) {
    const flags = [];
    if (w.star) flags.push('調査書の5段階評定の数値を2倍とする教科あり(★)');
    if (w.dbl) flags.push('学力検査の配点を2倍とする教科あり(※)');
    if (w.diamond) flags.push('その他の検査等の得点は150点で、このほか実用英語技能検定等の資格による加点150点(◇)');
    const wnote = `${base}。学校設定枠${w.label ? '(' + w.label + ')' : ''}: 募集人数${w.n}人以内、調査書配点${w.c}点・学力検査配点${w.g}点・その他の検査等の配点${w.o}点、詳細は資料の${w.p}${flags.length ? '。' + flags.join('。') : ''}。学校設定枠の詳細ページ(選抜の観点・検査内容)は本DBに未収録。`;
    out += `    {\n      schoolName: ${q(e.name)},\n      department: ${q(e.dept)},\n      selectionCategory: ${q(w.label ? '学校設定枠' + w.label : '学校設定枠')},\n      interviewRequired: false,\n      ratioType: ${q(`調査書${w.c}:学力検査${w.g}:その他${w.o}`)},\n      note: ${q(wnote)},\n    },\n`;
    recs++;
  }
}
// 定時制・通信制(頁4・頁5・2026-09-22に50dpi→200dpi画像で目視転記): 学校設定枠は新潟市立明鏡のみ。一般枠は募集人数・満20歳以上の作文検査・第2志望・面接の形式と配点(100点)。
const TEI = [
  ['荒川', '普通・午前部', 1, 35, 35, '', '集団面接', '県立定時制(単位制)'],
  ['西新発田', '普通・午前部', 2, 70, 70, '', '集団面接', '県立定時制(単位制)'],
  ['新潟翠江', '普通・午前部', 1, 35, 35, '', '集団面接', '県立定時制(単位制)'],
  ['長岡明徳', '普通・午前部', 3, 105, 105, '志望順位を付して出願することができる', '集団面接', '県立定時制(単位制)'],
  ['長岡明徳', '普通・夜間部', 1, 35, 35, '志望順位を付して出願することができる', '集団面接', '県立定時制(単位制)'],
  ['出雲崎', '普通・午前部', 1, 35, 35, '', '集団面接', '県立定時制(単位制)'],
  ['堀之内', '普通・午前部', 2, 70, 70, '', '集団面接', '県立定時制(単位制)'],
  ['高田南城', '普通・午前部', 2, 70, 70, '', '集団面接', '県立定時制(単位制)'],
  ['佐渡(相川分校)', '普通・午前部', 1, 35, 35, '', '個人面接', '県立定時制(単位制)'],
  ['十日町', '普通', 1, 40, 40, '', '個人面接', '県立定時制(単位制を除く)'],
  ['市立明鏡', '普通・午前部', 3, 105, 90, '', '個人面接', '新潟市立定時制(単位制)'],
];
for (const [name, dept, cls, total, gen, second, men, sec] of TEI) {
  const base = `【令和9年度 学校・学科ごとの募集人数と選抜方法等・${sec}】募集学級${cls}・全体募集人数${total}(募集学級と全体募集人数は令和8年10月末までに決定)`;
  const isMeikyo = name === '市立明鏡';
  out += `    {
      schoolName: ${q(name)},
      department: ${q(dept)},
      selectionCategory: '定時制 一般枠',
      interviewRequired: true,
      note: ${q(`${base}。一般枠: 募集人数${gen}、満20歳以上になる志願者に対する作文による検査:実施、面接の形式:${men}(配点100点)、第2志望の実施:${second || '記載なし'}。調査書と学力検査の比重の記載なし。`)},
    },
`;
  recs++;
  if (isMeikyo) {
    out += `    {
      schoolName: ${q(name)},
      department: ${q(dept)},
      selectionCategory: '定時制 学校設定枠',
      interviewRequired: false,
      ratioType: '調査書0:学力検査1000:その他500',
      note: ${q(`${base}。学校設定枠: 募集人数15人以内、調査書配点0点・学力検査配点1000点・その他の検査等の配点500点、詳細は資料のp.51。学校設定枠と一般枠の募集人数の合計=105人(15+90)。`)},
    },
`;
    recs++;
  }
}
for (const [name, dept, sec] of [['新潟翠江', '普通', '県立通信制'], ['高田南城', '普通', '県立通信制']]) {
  out += `    {
      schoolName: ${q(name)},
      department: ${q(dept + '(通信制)')},
      selectionCategory: '通信制課程',
      note: ${q(`【令和9年度 学校・学科ごとの募集人数と選抜方法等・${sec}】募集人数は若干人(選抜方法の記載なし)。`)},
    },
`;
  recs++;
}
const names = new Set([...D.map((e) => e.name), ...TEI.map((t) => t[0]), '新潟翠江', '高田南城']);
const ts = `// 新潟県: 令和9年度新潟県公立高等学校 学校・学科ごとの募集人数と選抜方法等(令和8年3月時点・4月9日訂正版)の全日制課程・定時制課程・通信制課程。
//
// 一次ソース: 新潟県教育委員会「令和9年度新潟県公立高等学校 学校・学科ごとの募集人数と選抜方法等」
// (\`https://www.pref.niigata.lg.jp/uploaded/attachment/501251.pdf\`・全56頁・県ページ
// \`https://www.pref.niigata.lg.jp/sec/kotogakko/nyugakushasenbatsu.html\`・2026-09-19 pdftoppm 300dpiで目視転記)。
// 転記データと生成スクリプトは ops/baselines/niigata-transcription/ に保存。
//
// 令和9年度から始まる新しい選抜制度(学校設定枠+一般枠)の学校・学科別の概要表を収録した。
// 「学校設定枠」は募集人数(以内)・調査書配点・学力検査配点・その他の検査等の配点と詳細頁番号(p.01〜)を、
// 「一般枠」は募集人数・調査書と学力検査の比重(例:3対7)・傾斜配点する教科・第2志望・学校独自検査をnote/ratioTypeに転記した。
// 全体募集人数=学校設定枠+一般枠となることを全レコードで検算済み(テスト)。募集学級・全体募集人数は令和8年10月末までに決定するため暫定値。
// 定時制課程(県立単位制9行+十日町・新潟市立明鏡)と通信制(新潟翠江・高田南城・若干人)は2026-09-22に頁4・頁5から追加した。
// 未収録: 頁6以降の学校設定枠ごとの詳細頁(選抜の観点・検査内容)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const NIIGATA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'niigata',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    ${q(`県立・新潟市立の全日制課程の概要表(頁1〜3・頁5)を完全収録(${D.length}学科)。定時制課程・通信制課程(頁4・頁5)も収録(全${names.size}校・${recs}レコード)。学校設定枠ごとの詳細頁(頁6以降)は未収録`)},
  schools: [
${out.replace(/\n$/, '')}
  ],
  source: {
    url: 'https://www.pref.niigata.lg.jp/uploaded/attachment/501251.pdf',
    docTitle: '令和9年度新潟県公立高等学校 学校・学科ごとの募集人数と選抜方法等（令和8年3月時点・4月9日訂正）（新潟県教育委員会）',
    lastChecked: '${new Date().toISOString().slice(0, 10)}',
  },
  note: '「調査書と学力検査の比重」は3対7のように調査書:学力検査の比。学校設定枠のratioTypeは調査書配点:学力検査配点:その他の検査等の配点(調査書+学力検査=1000点)。学校設定枠が複数ある学科はA・Bを別レコードにした。表の注記: 調査書の5段階評定の数値を2倍とする教科あり(★)、学力検査の配点を2倍とする教科あり(※)。令和8年3月時点の資料で一部の学校・学科は変更になる場合がある。',
};
`;
fs.writeFileSync(path.join(dir, '../../../src/data/school-selection-methods/niigata.ts'), ts);
console.log('schools', names.size, 'depts', D.length, 'records', recs);
