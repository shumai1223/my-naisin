import fs from 'fs';
const h=fs.readFileSync('ops/baselines/mie-r9/betsu4.bbox.html','utf8');
const pages=h.split('<page ').slice(1);
console.log(pages.length, pages[0].match(/width="([\d.]+)" height="([\d.]+)"/).slice(1));
const ws=[...pages[0].matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x:+m[1],y:+m[2],t:m[5]}));
const rows=[];for(const w of ws.sort((a,b)=>a.y-b.y||a.x-b.x)){const r=rows.find(r=>Math.abs(r.y-w.y)<3);if(r)r.w.push(w);else rows.push({y:w.y,w:[w]});}
for(const r of rows.slice(0,55))console.log(Math.round(r.y),r.w.sort((a,b)=>a.x-b.x).map(w=>Math.round(w.x)+':'+w.t).join(' ').slice(0,200));
