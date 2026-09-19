import { ROWS as R8 } from '../miyazaki-transcription/data.mjs';
import { ROWS as R9 } from './data-ippan-r9.mjs';
const nk=s=>s.normalize('NFKC').replace(/[\s()（）]/g,'');
const t=r=>JSON.stringify([r.teiin,r.subj,r.itv,r.tek,r.cho,r.kei,r.itvType]);
const m8=new Map(R8.map(r=>[r.course+'|'+nk(r.school)+'|'+nk(r.dept),r]));
let same=0;const chg=[],add=[];
for(const r of R9){const k=r.course+'|'+nk(r.school)+'|'+nk(r.dept);const o=m8.get(k);m8.delete(k);
  if(!o){add.push(`${r.course}/${r.school}/${r.dept} ${t(r)}`);continue;}
  if(t(o)!==t(r))chg.push(`${r.course}/${r.school}/${r.dept}: R8 ${t(o)} → R9 ${t(r)}`);else same++;}
console.log('同一',same,'数値変更',chg.length,'R9のみ',add.length,'R8のみ',m8.size);
console.log('--数値変更');chg.forEach(x=>console.log(x));
console.log('--R9のみ');add.forEach(x=>console.log(x));
console.log('--R8のみ');[...m8.values()].forEach(r=>console.log(r.course,r.school,r.dept,t(r)));
