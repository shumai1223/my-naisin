// node difftext.mjs <校名+学科> : R8/R9の該当頁を改行無視で連結→句読点等で分割→多重集合差
import { execFileSync } from 'child_process';
const AREAS = ['tosei','seihokugo','chuunan','kamitosan','shimokita','sanpachi'];
const name = process.argv[2];
const get = (ver) => {
  const out = [];
  for (const a of AREAS) {
    const pdf = `${ver}-${a}.pdf`;
    const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }))[1];
    for (let p = 1; p <= n; p++) {
      const t = execFileSync('pdftotext', ['-enc','UTF-8','-raw','-f',String(p),'-l',String(p),pdf,'-'], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).split('\n').map(l=>l.replace(/\s+/g,'')).filter(Boolean);
      if ((t[0]||'').includes(name)) out.push(t.join(''));
    }
  }
  return out.join('||').replace(/≲/g,'〈').replace(/≳/g,'〉').replace(/･/g,'・').replace(/[／]/g,'/').replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0));
};
const sp = (s) => s.split(/(?<=。)|(?=[⑴⑵⑶⑷⑸])|(?=・[ⅠⅡⅢ])|(?=[ア-オ][^ア-ン])/).map(x=>x.trim()).filter(Boolean);
const a = sp(get('r8')), b = sp(get('r9'));
const c = new Map(); for (const t of a) c.set(t,(c.get(t)||0)+1);
const o9 = []; for (const t of b) { const n = c.get(t)||0; if (n>0) c.set(t,n-1); else o9.push(t); }
const o8 = []; for (const [t,n] of c) for (let i=0;i<n;i++) o8.push(t);
console.log('R8のみ:'); o8.forEach(t=>console.log('  <', t.slice(0,260)));
console.log('R9のみ:'); o9.forEach(t=>console.log('  >', t.slice(0,260)));
