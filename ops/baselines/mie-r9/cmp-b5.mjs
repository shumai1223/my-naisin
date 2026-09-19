import fs from 'fs';
import { B5 } from '../mie-transcription/data-b5.mjs';
const z=s=>s.normalize('NFKC');
const lines=fs.readFileSync('betsu5.txt','utf8').split(/\r?\n/).map(z);
const recs=[];let cur=null;
for(const l of lines){
  const m=l.match(/(\S*競技(?:\([^)]*\))?)\s+(男子|女子)\s*(.*)$/);
  if(m){cur={sport:m[1],sex:m[2],d:m[3].trim()};recs.push(cur);continue;}
  if(cur&&/人以内\)/.test(l)&&/^\s+\S/.test(l)&&!/競技/.test(l)){cur.d+=l.trim();}
}
const norm=s=>s.replace(/[\s、・]/g,'');
const k9=recs.map(r=>r.sport+'|'+r.sex+'|'+norm(r.d));
const k8=B5.map(r=>r.sport+'|'+r.sex+'|'+norm(r.depts.map(d=>d[0]+'('+d[1]+'人以内)').join('')));
console.log('R9',k9.length,'R8',k8.length);
const s9=new Map(),s8=new Map();for(const k of k9)s9.set(k,(s9.get(k)||0)+1);for(const k of k8)s8.set(k,(s8.get(k)||0)+1);
const d8=[],d9=[];
for(const [k,c] of s8){const c2=s9.get(k)||0;if(c2<c)d8.push(k+' x'+(c-c2));}
for(const [k,c] of s9){const c2=s8.get(k)||0;if(c2<c)d9.push(k+' x'+(c-c2));}
console.log('R8のみ',d8.length);d8.forEach(x=>console.log(' ',x));console.log('R9のみ',d9.length);d9.forEach(x=>console.log(' ',x));
