// node showpage.mjs <r9|r8> <校名の一部> : 全地区PDFから校名を含む頁の -raw テキスト(空白除去・空行除去)を出す
import { execFileSync } from 'child_process';
const AREAS = ['tosei','seihokugo','chuunan','kamitosan','shimokita','sanpachi'];
const [ver, name] = process.argv.slice(2);
for (const a of AREAS) {
  const pdf = `${ver}-${a}.pdf`;
  const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }))[1];
  for (let p = 1; p <= n; p++) {
    const t = execFileSync('pdftotext', ['-enc','UTF-8','-raw','-f',String(p),'-l',String(p),pdf,'-'], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).split('\n').map(l=>l.replace(/\s+/g,'')).filter(Boolean);
    if ((t[0]||'').includes(name)) { console.log(`#### ${pdf} p${p}`); console.log(t.join('\n')); }
  }
}
