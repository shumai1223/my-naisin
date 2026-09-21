// R9の別表16(288行)を tokyo.ts の既存ブロック(R8=285レコード)と置換する。1回だけ実行(check-r8-roundtrip.mjsで既存ブロック=build16(R8)を確認済み)。
import fs from 'fs';
import { buildR9 } from './r9patch.mjs';
import { build16 } from '../tokyo-transcription/lib16.mjs';
const file = new URL('../../../src/data/school-selection-methods/tokyo.ts', import.meta.url);
const lines = fs.readFileSync(file, 'utf8').split('\n');
const first = lines.findIndex((l) => l.includes("selectionCategory: '文化・スポーツ等特別推薦'")) - 3;
let last = 0;
lines.forEach((l, i) => { if (l.includes("selectionCategory: '文化・スポーツ等特別推薦'")) last = i; });
let end = last; while (!lines[end].startsWith('    },')) end++;
const rows = buildR9();
const gen = build16(rows).replace(/\n$/, '').split('\n');
lines.splice(first, end - first + 1, ...gen);
fs.writeFileSync(file, lines.join('\n'));
console.log('replaced', end - first + 1, 'lines ->', gen.length, 'rows', rows.length);
