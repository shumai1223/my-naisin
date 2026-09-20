// node ext.mjs r8|r9 : 頁ごとに 学校名・選抜の順ごとの(選抜比率%, 学力検査%:面接等%:調査書%)・募集人員行を抽出しJSONで出す
import { execFileSync } from 'child_process';
const pdf = process.argv[2] + '.pdf';
const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))[1];
const out = [];
for (let p = 1; p <= n; p++) {
  const t = execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 });
  const lines = t.split('\n');
  const nm = lines.map((l) => /(群馬県立|前橋市立|高崎市立|桐生市立|太田市立|伊勢崎市立|館林市立|渋川市立|藤岡市立|富岡市立|安中市立|みどり市立|利根沼田|市立)?\s*([^\s]+?)(高等学校|中等教育学校|高校)/.exec(l.trim())).find(Boolean);
  const school = nm ? (nm[1] || '') + nm[2] : null;
  // 割合行: 「割 合」の後ろに3つの%
  const ratios = [];
  for (const l of lines) {
    const m = /割\s*合[^0-9]*?(\d+)%[^0-9]+(\d+)%[^0-9]+(\d+)%/.exec(l.replace(/　/g, ' '));
    if (m) ratios.push(`学力検査${m[1]}%:面接等${m[2]}%:調査書${m[3]}%`);
  }
  // 選抜比率(総合型80% 等)
  const shares = [];
  for (const l of lines) { const m = /^\s*(総合型|特色型)\s+(\d+)%/.exec(l) || /(総合型|特色型)\s{2,}(\d+)%/.exec(l); if (m) shares.push(m[1] + m[2] + '%'); }
  const cap = lines.find((l) => /募集学科・人員等/.test(l))?.replace(/\s+/g, ' ').trim() ?? '';
  out.push({ p, school, ratios, shares, cap });
}
console.log(JSON.stringify(out));
