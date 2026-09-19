import fs from 'fs';
const dir='ops/baselines/nagano-r9/';
const r8=fs.readFileSync(dir+'r8-dump.txt','utf8').split('\n').map(l=>l.split('|'));
const bounds=[[0,38,'r9-2-01'],[38,60,'r9-2-02'],[60,97,'r9-2-03'],[97,121,'r9-2-04'],[121,138,'r9-2-05,r9-2-06']];
const norm=s=>s.replace(/\s+/g,'').replace(/[（(].*?[）)]/g,'');
for(const [a,b,fs_] of bounds){
  const txt=fs_.split(',').map(f=>fs.readFileSync(dir+f+'.txt','utf8')).join('\n');
  const nt=txt.replace(/[ \u3000]+/g,'');
  const miss=[];
  for(const r of r8.slice(a,b)){
    const sch=r[1].replace(/校$/,'');
    const dep=r[2];
    const okS=nt.includes(sch), okD=nt.includes(dep.replace(/[・]/g,''))||dep.split('・').every(d=>nt.includes(d));
    if(!okS||!okD) miss.push(`${r[1]}/${r[2]} school:${okS} dept:${okD}`);
  }
  console.log(fs_,'missing:',miss.length); miss.forEach(m=>console.log('  ',m));
}
