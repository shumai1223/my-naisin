import fs from 'fs';
const pages=fs.readFileSync('r9_10.bbox.html','utf8').split('<page ').slice(1);
const pn=+process.argv[2]||1;
const ws=[...pages[pn-1].matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x:+m[1],y:+m[2],t:m[5]}));
const rows=[];for(const w of ws.sort((a,b)=>a.y-b.y||a.x-b.x)){const r=rows.find(r=>Math.abs(r.y-w.y)<2.5);if(r)r.w.push(w);else rows.push({y:w.y,w:[w]});}
for(const r of rows.filter(r=>r.y>(+process.argv[3]||0)&&r.y<(+process.argv[4]||900)))console.log(Math.round(r.y),r.w.sort((a,b)=>a.x-b.x).map(w=>Math.round(w.x)+':'+w.t).join(' ').slice(0,300));
