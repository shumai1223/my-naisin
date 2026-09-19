import fs from 'fs';
import { D } from '../nara-transcription/data.mjs';
const norm=s=>s.normalize('NFKC').replace(/[\s()（）「」―]/g,'');
function extract(file){
  const pages=fs.readFileSync(file,'utf8').split('<page ').slice(1);
  const out=new Map(); // key 'kind|school' -> Set
  const add=(k,t)=>{if(!out.has(k))out.set(k,new Set());out.get(k).add(t);};
  pages.forEach((pg,pi)=>{
    const ws=[...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x:+m[1],y:+m[2],t:m[5]})).sort((a,b)=>a.y-b.y||a.x-b.x);
    // 見出し行(全日制課程【…】/定時制課程【…】)を行として復元
    const lineOf=(y)=>ws.filter(w=>Math.abs(w.y-y)<3).sort((a,b)=>a.x-b.x).map(w=>w.t).join('');
    const titles=ws.filter(w=>/^(全日制課程|定時制課程)/.test(w.t)&&w.x<80).map(w=>({y:w.y,line:lineOf(w.y)}));
    // 記載例(○○)を含む表は除外。titleごとに区間
    const segs=titles.map((t,i)=>({y0:t.y,y1:i+1<titles.length?titles[i+1].y:9999,line:t.line}));
    for(const sg of segs){
      const kind=/定時制/.test(sg.line)?'T':/独自/.test(sg.line)?'Z3':/社会/.test(sg.line)?'Z5':'?';
      const seg=ws.filter(w=>w.y>=sg.y0&&w.y<sg.y1);
      if(seg.some(w=>w.t==='○○'))continue;
      // 見出しの終端: 「人数枠」or「パターン」の最下行
      const hy=Math.max(0,...seg.filter(w=>/^(人数枠|\(加重配点\)|パターン)$/.test(w.t)&&w.y<sg.y0+140).map(w=>w.y));
      const body=seg.filter(w=>w.y>hy+6&&!/^※/.test(w.t));
      let names=body.filter(w=>w.x<75&&w.t.length>=2&&w.t.length<=8&&!/^(学校名|全日制課程|定時制課程)$/.test(w.t)).map(w=>({y:w.y,t:w.t}));
      // 近接(<=14px)の名前トークンを連結
      const merged=[];for(const n of names){const l=merged[merged.length-1];if(l&&n.y-l.y<=14)l.t+=n.t,l.y=(l.y+n.y)/2;else merged.push({...n});}
      if(!merged.length)continue;
      for(const w of body){
        let t=null;
        const T0=w.t.normalize('NFKC').replace(/(名|点)$/,''); if(w.x>=150&&/^\d+$/.test(T0))t=T0;
        else if(false)t=null;
        else if(w.x>=88&&w.x<150&&w.t.length>=2)t='D:'+norm(w.t);
        if(!t||t==='点')continue;
        const nm=merged.reduce((b,n)=>Math.abs(n.y-w.y)<Math.abs(b.y-w.y)?n:b);
        add(kind+'|'+nm.t,t);
      }
    }
  });
  return out;
}
const r9=extract('31_r9gaiyou_ichiji_ichiran_dai1.bbox.html');
console.log('R9 keys',r9.size);
const r8=new Map();
const add8=(k,t)=>{if(!r8.has(k))r8.set(k,new Set());r8.get(k).add(t);};
for(const r of D){
  const kind=r.course==='定時制'?'T':(r.kind==='5'?'Z5':'Z3');
  const k=kind+'|'+r.name;
  for(const v of [r.gaku,r.dokuji,r.essay,r.itv,r.prac,r.kensa,r.chosho,'①②③④'.indexOf(r.pattern)+1])if(v)add8(k,String(v));
  if(r.tokuN!=null)add8(k,String(r.tokuN));
  if(r.tokuP!=null)add8(k,String(r.tokuP));
  add8(k,'D:'+norm(r.dept));
}
const keys=new Set([...r8.keys(),...r9.keys()]);
let same=0;const lines=[];
for(const k of keys){
  const a=r8.get(k),b=r9.get(k);
  if(!a){lines.push(`R9のみ ${k}`);continue;}
  if(!b){lines.push(`R8のみ ${k}`);continue;}
  // 数値のみ比較(点=tokuPは数字だけ・deptは別枠)
  const num=s=>new Set([...s].filter(t=>!t.startsWith('D:')&&t!=='点'));
  const A=num(a),B=num(b);
  const onlyA=[...A].filter(t=>!B.has(t)),onlyB=[...B].filter(t=>!A.has(t));
  if(onlyA.length||onlyB.length)lines.push(`${k}: R8のみ[${onlyA.join(',')}] R9のみ[${onlyB.join(',')}]`);else same++;
}
console.log('数値集合一致',same,'差分',lines.length);console.log(lines.join('\n'));



// 学科名の突合: R8の学科名がR9のD:トークン連結に含まれるか
const nn=s=>s.normalize('NFKC').replace(/[\s()（）「」―・]/g,'');
const dl=[];
for(const [k,a] of r8){ const b=r9.get(k)||r9.get(k.replace(/^Z3\|/,'T|')); if(!b)continue;
  const cat=[...b].filter(t=>t.startsWith('D:')).map(t=>t.slice(2)).join('');
  const miss=[...a].filter(t=>t.startsWith('D:')).map(t=>t.slice(2)).filter(d=>!cat.includes(nn(d)));
  if(miss.length)dl.push(k+' R8学科がR9に見当たらない: '+miss.join(' / '));
}
console.log('学科差(要目視)',dl.length);console.log(dl.join('\n'));
