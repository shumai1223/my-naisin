// R8(令和8年度)別表16の転記(../tokyo-transcription/p16a〜m.mjs)を副作用なしで読み込み、行配列を返す。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../tokyo-transcription');
export function loadR8() {
  const files = fs.readdirSync(dir).filter((f) => /^p16[a-z]\.mjs$/.test(f)).sort();
  const all = [];
  for (const f of files) {
    let src = fs.readFileSync(path.join(dir, f), 'utf8');
    src = src.replace(/^import .*$/m, '').replace(/^append\([\s\S]*$/m, '');
    const fn = new Function('build16', 'append', src + '\nreturn R;');
    const R = fn(() => '', () => {});
    R.forEach((r) => all.push({ ...r, file: f }));
  }
  return all;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = loadR8();
  console.log(a.length);
  console.log(JSON.stringify(a.slice(0, 2)));
}
