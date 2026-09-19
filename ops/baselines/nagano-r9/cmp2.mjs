import fs from 'fs';
const dir='ops/baselines/nagano-r9/';
const r8=fs.readFileSync(dir+'r8-dump.txt','utf8').split('\n').map(l=>l.split('|'));
const bounds=[[0,38],[38,60],[60,97],[97,121],[121,138]];
const fmt=(r)=>{ // '調査書70%:面接20%:学力検査10%' -> 70/20/10 (作文/実技は別)
  return r.replace(/[^\d:%・併せて\p{sc=Han}\p{sc=Hiragana}]/gu,'').replace(/%/g,'');
};
const groups=(recs)=>{const g=[];for(const r of recs){const k=r[1]+'#'+r[3]+'#'+r[4];if(g.length&&g[g.length-1].k===k)g[g.length-1].d.push(r[2]);else g.push({k,school:r[1],cat:r[3],ratio:r[4],d:[r[2]]});}return g;};
const r9files=[['r9-2-01',0],['r9-2-02',1],['r9-2-03',2],['r9-2-04',3]];
for(const [f,bi] of r9files){
  const lines=fs.readFileSync(dir+f+'.txt','utf8').split('\n');
  const rows=[];
  lines.forEach((ln,i)=>{ if(!/比重/.test(ln)||/^\s*番号/.test(ln))return;
    let toks=ln.slice(ln.indexOf('比重')+2).trim().split(/\s+/).filter(t=>/^(\d+|-)$/.test(t));
    if(toks.length<5){const pt=(lines[i-1]??'').trim().split(/\s+/).filter(t=>/^(\d+|-)$/.test(t));if(pt.length&&pt.length+toks.length<=5)toks=[...pt,...toks];}
    rows.push({line:i+1,toks});});
  const g=groups(r8.slice(...bounds[bi]));
  console.log('==',f,'R8groups',g.length,'R9rows',rows.length);
  const n=Math.max(g.length,rows.length);
  for(let i=0;i<n;i++){const a=g[i],b=rows[i];console.log(String(i).padStart(2),(a?a.school+'/'+a.d.join('・')+' '+a.ratio:'-').padEnd(60),'|',b?`L${b.line} ${b.toks.join('/')}`:'-');}
}
