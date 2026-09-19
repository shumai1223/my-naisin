import fs from 'fs';
import { S2, N2 } from '../nara-transcription/data2.mjs';
const nk=s=>s.normalize('NFKC').replace(/[\s()（）「」―]/g,'');
function extract(file){
  const pages=fs.readFileSync(file,'utf8').split('<page ').slice(1);
  const out=new Map();const add=(k,t)=>{if(!out.has(k))out.set(k,new Set());out.get(k).add(t);};
  pages.forEach((pg)=>{
    const ws=[...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x:+m[1],y:+m[2],t:m[5]})).sort((a,b)=>a.y-b.y||a.x-b.x);
    const lineOf=(y)=>ws.filter(w=>Math.abs(w.y-y)<3).sort((a,b)=>a.x-b.x).map(w=>w.t).join('');
    const titles=ws.filter(w=>/^(全日制課程|定時制課程)/.test(w.t)&&w.x<80).map(w=>({y:w.y,line:lineOf(w.y)}));
    const segs=titles.length?titles.map((t,i)=>({y0:t.y,y1:i+1<titles.length?titles[i+1].y:9999,line:t.line})):[{y0:0,y1:9999,line:''}];
    for(const sg of segs){
      const kind=/定時制/.test(sg.line)?'T':'Z';
      const seg=ws.filter(w=>w.y>=sg.y0&&w.y<sg.y1);
      if(seg.some(w=>w.t==='○○'))continue;
      const hy=Math.max(0,...seg.filter(w=>/^(人数枠|\(加重配点\)|パターン|満点)$/.test(w.t)&&w.y<sg.y0+150).map(w=>w.y));
      const body=seg.filter(w=>w.y>hy+6&&!/^※/.test(w.t));
      const names=body.filter(w=>w.x<75&&w.t.length>=2&&w.t.length<=8&&!/^(学校名|全日制課程|定時制課程)$/.test(w.t)).map(w=>({y:w.y,t:w.t}));
      const merged=[];for(const n of names){const l=merged[merged.length-1];if(l&&n.y-l.y<=14)l.t+=n.t,l.y=(l.y+n.y)/2;else merged.push({...n});}
      if(!merged.length)continue;
      for(const w of body){
        const T0=w.t.normalize('NFKC').replace(/(名|点)$/,'');
        let t=null;
        if(w.x>=150&&/^\d+$/.test(T0))t=T0; else if(w.x>=150&&/^[①②③④]$/.test(w.t))t=String('①②③④'.indexOf(w.t)+1);
        if(!t)continue;
        const nm=merged.reduce((b,n)=>Math.abs(n.y-w.y)<Math.abs(b.y-w.y)?n:b);
        add(kind+'|'+nm.t,t);
      }
    }
  });
  return out;
}
function cmp(label,file,recs,fields){
  const r9=extract(file);const r8=new Map();
  for(const r of recs){const k=(r.course==='定時制'||r.course==='市立定時制'?'T':'Z')+'|'+r.name;if(!r8.has(k))r8.set(k,new Set());for(const f of fields){const v=r[f];if(v)r8.get(k).add(f==='pattern'?String('①②③④'.indexOf(v)+1):String(v));}}
  const lines=[];let same=0;
  for(const k of new Set([...r8.keys(),...r9.keys()])){const a=r8.get(k),b=r9.get(k);
    if(!a){lines.push('R9のみ '+k+' ['+[...b]+']');continue;} if(!b){lines.push('R8のみ '+k);continue;}
    const oa=[...a].filter(t=>!b.has(t)),ob=[...b].filter(t=>!a.has(t));
    if(oa.length||ob.length)lines.push(`${k}: R8のみ[${oa}] R9のみ[${ob}]`);else same++;}
  console.log('==',label,'一致',same,'差分',lines.length);console.log(lines.join('\n'));
}
cmp('第2希望校','32_r9gaiyou_ichiji_ichiran_dai2.bbox.html',S2,['gaku','pattern','chosho']);
cmp('二次選抜','33_r9gaiyou_niji_ichiran.bbox.html',N2,['gaku','pattern','chosho']);

