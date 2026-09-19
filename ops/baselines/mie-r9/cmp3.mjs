import fs from 'fs';
import { B4 } from '../mie-transcription/data-b4.mjs';
const r9=JSON.parse(fs.readFileSync('r9-records.json','utf8'));
const nn=s=>s.normalize('NFKC').replace(/くくり|募集|[\s()（）・「」]/g,'');
const k8=B4.map(r=>({k:r.course+'|'+nn(r.dept+(r.kukuri?'':''))+'|'+r.marks.replace(/[^◎○-]/g,''),src:r.school+'/'+r.dept.slice(0,12)}));
const k9=r9.map(r=>({k:r.course+'|'+nn(r.dept.join(''))+'|'+r.marks,src:r.school+'/'+r.dept.join('').slice(0,12)}));
// R8のkukuri行は dept に複数学科を含む場合と kukuri 欄に持つ場合があるので、R9の連結との部分一致で照合
const used=new Set();const only8=[];
for(const a of k8){
  const [c,d,m]=a.k.split('|');
  let idx=k9.findIndex((b,i)=>{if(used.has(i))return false;const [c2,d2,m2]=b.k.split('|');return c===c2&&m===m2&&(d2===d||d2.includes(d)||d.includes(d2));});
  if(idx<0){// 印だけ違う候補
    const alt=k9.findIndex((b,i)=>{if(used.has(i))return false;const [c2,d2]=b.k.split('|');return c===c2&&(d2===d||d2.includes(d)||d.includes(d2));});
    only8.push(`R8 ${a.src} ${m} → R9同学科の印: ${alt>=0?k9[alt].k.split('|')[2]+' ('+k9[alt].src+')':'(R9に該当学科なし)'}`);if(alt>=0)used.add(alt);
  } else used.add(idx);
}
const only9=k9.filter((b,i)=>!used.has(i));
console.log('R8のみ/印差',only8.length);only8.forEach(x=>console.log(' ',x));
console.log('R9のみ',only9.length);only9.forEach(x=>console.log(' ',x.k,x.src));
