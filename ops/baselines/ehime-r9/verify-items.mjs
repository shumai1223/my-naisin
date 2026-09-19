import fs from 'fs';
import { EH } from './data-r9.mjs';
const layout=fs.readFileSync('file2829.txt','utf8').split('\f');
const build=fs.readFileSync('build-r9.mjs','utf8');
const dat=fs.readFileSync('data-r9.mjs','utf8').split('\n').filter(l=>/\/\/ p\d+$/.test(l));
const items={saku:'作文',sho:'小論文',men:'面接',shu:'集団討論',jit:'実技テスト',pre:'プレゼンテーション'};
let bad=0;
for(let i=0;i<EH.length;i++){
  const pn=+dat[i].match(/\/\/ p(\d+)$/)[1];
  const t=layout[pn-1].replace(/[ \u3000]+/g,'');
  const sec=(t.split('＜検査概要＞')[1]||'').split('＜備考＞')[0];
  const r=EH[i];
  const inW=Object.entries(items).filter(([k])=>r.w[k]).map(([,v])=>v);
  const inTxt=Object.values(items).filter(v=>sec.includes('「'+v+'」')||sec.includes(v));
  const miss=inW.filter(x=>!inTxt.includes(x));
  if(miss.length&&pn!==7){bad++;console.log(`p${pn} ${r.school} ${r.dept.slice(0,10)} 比重にあるが検査概要に無い: ${miss.join(',')} / 概要=${inTxt.join(',')}`);}
}
console.log('要目視',bad);
