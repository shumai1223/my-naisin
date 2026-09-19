// miyazaki R9: 自動抽出(data-suisen-r9.mjs)を整形して data-suisen-final-r9.mjs を作る。
//  - 学科名: 一般入学者選抜R9(data-ippan-r9.mjs)の表記に合わせる(推薦PDFは『普通科』『海洋科学科』、一般は『普通』『海洋科学』)
//  - 面接種別: 行の補足文から取れなければ一般R9の同学科の面接種別、それも無ければ空(スポーツ推薦の『自己推薦方式の受検学科に同じ』はR8同様に空)
//  - 補足: R9の補足が空ならR8の補足(同キー)を引き継ぐ。延岡工業ホッケー等の『＊』セルは数値化せずnull(R8同様)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JIKO, SPORTS, RENKEI } from './data-suisen-r9.mjs';
import { ROWS as IPPAN } from './data-ippan-r9.mjs';
import { JIKO as J8, SPORTS as S8, RENKEI as R8 } from '../miyazaki-transcription/data-suisen.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const nk = (s) => (s || '').normalize('NFKC').replace(/[\s()（）※]/g, '');
const base = (s) => nk(s).replace(/[科部]/g, '');
const ippanBy = new Map(IPPAN.map((r) => [r.course + '|' + nk(r.school) + '|' + base(r.dept), r]));
const j8 = new Map(J8.map((r) => [r.course + '|' + nk(r.school) + '|' + base(r.dept), r]));
const s8 = new Map(S8.map((r) => [nk(r.school) + '|' + nk(r.act), r]));
const jiko = JIKO.map((r) => {
  const key = r.course + '|' + nk(r.school) + '|' + base(r.dept);
  const ip = ippanBy.get(key);
  const o8 = j8.get(key);
  const dept = ip ? ip.dept : r.dept.replace(/※/g, '');
  return { ...r, dept, itvType: r.itvType || (ip ? ip.itvType : '') || '', memo: r.memo || (o8 ? o8.memo : '') };
});
const sports = SPORTS.map((r) => {
  const o8 = s8.get(nk(r.school) + '|' + nk(r.act));
  const star = [r.kei, ...r.g, r.itv, r.jiko, r.cho].some((v) => typeof v === 'string');
  const clr = star ? { g: null, itv: null, sho: null, saku: null, jitsu: null, gaku: null, jiko: null, cho: null, kei: null, itvType: '' } : {};
  return { ...r, ...clr, memo: ((star ? r.memo.replace(/\*(\d)は/g, '＊$1は').replace(/(.)＊2/, '$1。＊2') : r.memo || (o8 ? o8.memo : '')) || '') };
});
const renkei = RENKEI.map((r) => {
  const o8 = R8.find((x) => x.school === r.school);
  return { ...r, dept: r.dept || '普通', memo: o8 ? o8.memo : r.memo };
});
fs.writeFileSync(path.join(dir, 'data-suisen-final-r9.mjs'), `// 令和9年度 推薦・連携型(build-suisen.mjs→gen-data-suisen-r9.mjs→finalize.mjsで整形)\nexport const JIKO = ${JSON.stringify(jiko, null, 1)};\nexport const SPORTS = ${JSON.stringify(sports, null, 1)};\nexport const RENKEI = ${JSON.stringify(renkei, null, 1)};\n`);
console.log('JIKO', jiko.length, 'SPORTS', sports.length, 'RENKEI', renkei.length);
console.log('学科名が一般R9に無い自己推薦行:', jiko.filter((r) => !ippanBy.has(r.course + '|' + nk(r.school) + '|' + base(r.dept))).map((r) => r.school + '/' + r.dept).join(', ') || 'なし');
console.log('星セル(＊)を持つスポーツ行:', sports.filter((r) => r.kei == null).map((r) => r.school + '/' + r.act).join(', '));

