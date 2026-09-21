import { buildR9 } from './r9patch.mjs';
import fs from 'fs';
const rows = buildR9();
fs.writeFileSync(new URL('./r9rows.json', import.meta.url), JSON.stringify(rows));
console.log(rows.length);
