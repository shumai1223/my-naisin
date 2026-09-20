// node stage.mjs r8|r9 [頁] : 頁ごとに 学校名・募集学科人員・選抜の順ごとの{label, 学力検査計, 面接等点, 調査書点, 割合, 選抜比率}を抽出
import { execFileSync } from 'child_process';
const pdf = process.argv[2] + '.pdf';
const only = process.argv[3] ? +process.argv[3] : null;
const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))[1];
const num = (s) => s.replace(/[\s,]/g, '');
const pages = [];
for (let p = only ?? 1; p <= (only ?? n); p++) {
  const t = execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 });
  const lines = t.split('\n').map((l) => l.replace(/　/g, ' '));
  const school = (lines.find((l) => /^(群馬県立|前橋市立|高崎市立|桐生市立|太田市立|伊勢崎市立|館林市立|利根沼田学校組合立)\S+/.test(l.trim())) ?? '').trim().split(/\s+/)[0];
  const cap = lines.filter((l) => /募集学科・人員等/.test(l)).map((l) => l.replace(/\s+/g, ' ').trim());
  // 選抜行: 「総合型選抜」「特色型選抜」「特色型選抜①②」で始まる行から点数を取る
  const stages = [];
  lines.forEach((l, i) => {
    const m = /(総合型選抜|特色型選抜[①②]?)([\s\S]*)$/.exec(l);
    if (!m) return;
    const nums = (m[2].match(/[\d,]+/g) ?? []).map((x) => x.replace(/,/g, ''));
    // 総合計, (各科目)x5, 面接等, 調査書
    const total = nums[0]; const rest = nums.slice(1);
    const mensetsu = rest[rest.length - 2]; const chosa = rest[rest.length - 1];
    // 直後の「割合」行
    let ratio = null;
    for (let k = i + 1; k < Math.min(i + 6, lines.length); k++) {
      const r = /割\s*合\s+(\d+)%\s+(\d+)%\s+(\d+)%/.exec(lines[k]);
      if (r) { ratio = `${r[1]}%:${r[2]}%:${r[3]}%`; break; }
    }
    stages.push({ label: m[1], total, subj: rest.slice(0, -2).join(','), mensetsu, chosa, ratio });
  });
  pages.push({ p, school, cap, stages });
}
console.log(JSON.stringify(pages, null, 1));
