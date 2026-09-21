// R8転記(loadR8)をbuild16で再生成した文字列が tokyo.ts の既存ブロックと一致するか確認(一致すれば置換は安全)。
import fs from 'fs';
import { loadR8 } from './loadr8.mjs';
import { build16 } from '../tokyo-transcription/lib16.mjs';
const ts = fs.readFileSync(new URL('../../../src/data/school-selection-methods/tokyo.ts', import.meta.url), 'utf8');
const lines = ts.split('\n');
const first = lines.findIndex((l) => l.includes("selectionCategory: '文化・スポーツ等特別推薦'")) - 3;
let last = lines.length - 1;
for (let i = lines.length - 1; i >= 0; i--) if (lines[i].includes("selectionCategory: '文化・スポーツ等特別推薦'")) { last = i; break; }
let end = last; while (!lines[end].startsWith('    },')) end++;
const block = lines.slice(first, end + 1).join('\n') + '\n';
const gen = build16(loadR8());
console.log('first', first + 1, 'end', end + 1, 'len', block.length, gen.length, 'same', block === gen);
if (block !== gen) {
  const a = block.split('\n'), b = gen.split('\n');
  let n = 0;
  for (let i = 0; i < Math.max(a.length, b.length) && n < 5; i++) if (a[i] !== b[i]) { console.log(i, '\nDB :', a[i]?.slice(0, 300), '\nGEN:', b[i]?.slice(0, 300)); n++; }
}
