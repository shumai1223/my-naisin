import fs from 'fs';
import { spawnSync } from 'child_process';
const d='src/data/school-selection-methods/';
const UA='my-naishin-research/1.0 (contact: naishin.dev@gmail.com)';
const z=s=>s.replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0));
const sleep=ms=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);
for(const f of fs.readdirSync(d)){
  if(!f.endsWith('.ts')||f==='index.ts')continue;
  const s=fs.readFileSync(d+f,'utf8');
  if(!/令和8年度/.test((s.match(/fiscalYear: '([^']*)'/)||[])[1]||''))continue;
  const url=(s.match(/source: \{\s*url: '([^']*)'/)||[])[1];
  if(!url||/\.pdf($|\?)/i.test(url)){console.log(f.replace('.ts',''),'\tPDF直リンク(ハブ要)');continue;}
  const r=spawnSync('curl.exe',['-s','-k','-L','-A',UA,'--max-time','25','-w','\n@@%{http_code}',url],{encoding:'utf8',maxBuffer:50e6});
  const out=r.stdout||'';const code=(out.match(/@@(\d+)$/)||[])[1];const html=out.replace(/\n@@\d+$/,'');
  const txt=z(html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' '));
  const title=(html.match(/<title>([^<]*)<\/title>/)||[])[1]||'';
  const r9=[...z(html).matchAll(/<a [^>]*href="([^"]*)"[^>]*>([^<]*令和9年度[^<]{0,50})/g)].slice(0,3).map(m=>m[2].trim().slice(0,45)+' => '+m[1].slice(0,80));
  const upd=(txt.match(/(更新日|最終更新日?|掲載日)[:：]?\s*(令和\d+年\d+月\d+日|\d{4}年\d+月\d+日)/)||[])[0]||'';
  console.log(f.replace('.ts',''),'\t',code,'\t',title.slice(0,40),'\t',upd,'\tR9言及:',(txt.match(/令和9年度/g)||[]).length,'\t',r9.join(' | '));
  sleep(1000);
}
