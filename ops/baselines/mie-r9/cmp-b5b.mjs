import fs from 'fs';
import { B5 } from '../mie-transcription/data-b5.mjs';
const z=s=>s.normalize('NFKC');
const t=z(fs.readFileSync('betsu5.txt','utf8'));
const tok9=[...t.matchAll(/([^\s、(（・)]{2,}(?:・[^\s、(（)]+)?)\s*\((\d+)人以内\)/g)].map(m=>m[1]+':'+m[2]);
const tok8=B5.flatMap(r=>r.depts.map(d=>z(d[0])+':'+d[1]));
const cnt=a=>{const m=new Map();for(const k of a)m.set(k,(m.get(k)||0)+1);return m;};
const c9=cnt(tok9),c8=cnt(tok8);
console.log('トークン数 R9',tok9.length,'R8',tok8.length);
for(const k of new Set([...c8.keys(),...c9.keys()])){const a=c8.get(k)||0,b=c9.get(k)||0;if(a!==b)console.log(k,'R8',a,'R9',b);}
// 競技×性別の集合
const sp9=[...t.matchAll(/(\S*競技(?:\([^)]*\))?)\s+(男子|女子)/g)].map(m=>m[1]+'|'+m[2]);
const sp8=B5.map(r=>z(r.sport)+'|'+r.sex);
const s9=cnt(sp9),s8=cnt(sp8);console.log('競技×性別 R9',sp9.length,'R8',sp8.length);
for(const k of new Set([...s8.keys(),...s9.keys()])){const a=s8.get(k)||0,b=s9.get(k)||0;if(a!==b)console.log(' ',k,'R8',a,'R9',b);}
