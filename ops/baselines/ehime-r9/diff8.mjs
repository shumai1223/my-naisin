import { EH as R8 } from '../ehime-transcription/data.mjs';
import { EH as R9 } from './data-r9.mjs';
const w=v=>Object.entries(v).filter(([,b])=>b).map(([a,b])=>({cho:'調',saku:'作',sho:'小',men:'面',shu:'集',jit:'実',pre:'プ'})[a]+b).join('');
const key=r=>r.school+'|'+r.dept.slice(0,3);
const m8=new Map(R8.map(r=>[key(r),r]));
let same=0;const chg=[],add=[];
for(const r of R9){const o=m8.get(key(r));m8.delete(key(r));
  if(!o){add.push(r.school+' '+r.dept.slice(0,20));continue;}
  const d=[];
  if(o.teiin!==r.teiin)d.push(`定員${o.teiin}→${r.teiin}`);
  if(o.wari!==r.wari)d.push(`割合${o.wari}→${r.wari}`);
  if(o.n!==r.n)d.push(`人数${o.n}→${r.n}`);
  if(w(o.w)!==w(r.w))d.push(`比重${w(o.w)}→${w(r.w)}`);
  const os=o.subs[0],rs=r.subs[0];
  if(!!os!==!!rs)d.push(`文スポ ${os?'有':'無'}→${rs?'有':'無'}`);
  else if(os){ if(os[1].replace(/\(.*\)/,'')!==rs[1])d.push(`文スポ人数${os[1].slice(0,12)}→${rs[1]}`); if(w(os[2])!==w(rs[2]))d.push(`文スポ比重${w(os[2])}→${w(rs[2])}`);}
  if(o.dept!==r.dept)d.push(`学科表記差`);
  if(d.length)chg.push(`${r.school} ${r.dept.slice(0,12)}: ${d.join(' / ')}`);else same++;
}
console.log('同一',same,'変更',chg.length,'新規',add.length,'R8のみ',m8.size);
console.log('--変更');chg.forEach(x=>console.log(x));
console.log('--新規');add.forEach(x=>console.log(x));
console.log('--R8のみ');[...m8.values()].forEach(r=>console.log(r.school,r.dept.slice(0,20)));

