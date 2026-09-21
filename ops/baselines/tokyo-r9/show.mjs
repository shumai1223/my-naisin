import { loadR8 } from './loadr8.mjs';
const [a, b] = process.argv.slice(2).map(Number);
loadR8().forEach((r, i) => { if (i >= a && i < b) console.log(i, `${r.s}|${r.k}|${r.n}|c${r.c}|${r.mt}${r.m}|j${r.j}${r.sk != null ? '|sk' + r.sk : ''}|${(r.g || []).join('/')}`); });
