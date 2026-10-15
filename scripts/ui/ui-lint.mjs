#!/usr/bin/env node
/**
 * UI改修の禁止パターン検査（docs/design/DESIGN-SYSTEM.md）。
 *
 *   node scripts/ui/ui-lint.mjs [--summary] [--details] [--json] [--warnings] [files...]
 *   ファイル未指定なら src/ のUI対象すべて。errorが1件でもあれば exit 1（内部ページは gating から除外）。
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { ROOT, walk, rel, parse, stringSegments, inUiScope, isInternalPage, EMOJI_RX, JA_RX } from './_shared.mjs';

const args = process.argv.slice(2);
const fileArgs = args.filter((a) => !a.startsWith('--'));
const FLAG = (n) => args.includes(n);

const BANNED_HUES = 'purple|violet|fuchsia|pink|orange|yellow|rose|sky|cyan|teal|blue|indigo|emerald|green|lime|gray|zinc|neutral|stone';
const HUE_RX = new RegExp(`^(bg|text|border|border-[trblxyse]|ring|ring-offset|divide|fill|stroke|outline|decoration|accent|caret|placeholder|from|via|to|shadow)-(${BANNED_HUES})-(50|100|200|300|400|500|600|700|800|900|950)(\\/[0-9.]+)?$`);

function splitPrefix(tok) {
  let depth = 0; let last = -1;
  for (let i = 0; i < tok.length; i++) {
    const c = tok[i];
    if (c === '[') depth++; else if (c === ']') depth--; else if (c === ':' && depth === 0) last = i;
  }
  let prefix = last < 0 ? '' : tok.slice(0, last + 1);
  let util = last < 0 ? tok : tok.slice(last + 1);
  if (util.startsWith('!')) { prefix += '!'; util = util.slice(1); }
  return [prefix, util];
}

const CLASS_RULES = [
  { id: 'gradient', sev: 'error', test: (u) => /^bg-gradient-to-/.test(u) || /^(from|via|to)-(\[|[a-z]+-\d|white|black|transparent)/.test(u) },
  { id: 'shadow', sev: 'error', test: (u) => /^shadow(-(sm|md|lg|xl|2xl|inner|glow|glow-lg|[a-z]+-\d{2,3}(\/\d+)?|\[[^\]]*\]))?$/.test(u) && u !== 'shadow-overlay' && u !== 'shadow-none' },
  { id: 'radius', sev: 'error', test: (u) => /^rounded(-(t|b|l|r|tl|tr|bl|br|s|e|ss|se|es|ee))?-(xl|2xl|3xl)$/.test(u) },
  { id: 'hue', sev: 'error', test: (u) => HUE_RX.test(u) },
  { id: 'anim', sev: 'error', test: (u) => /^animate-(pulse|bounce|ping|float|shimmer|pulse-subtle)$/.test(u) || /^(glow-pulse|float|shimmer|score-pop|btn-glow|card-hover|rank-[sab]-glow)$/.test(u) },
  { id: 'glass', sev: 'error', test: (u) => /^backdrop-/.test(u) || /^(glass-card|mesh-gradient|gradient-text|premium-input)$/.test(u) },
  { id: 'weight', sev: 'error', test: (u) => /^font-(black|extrabold|semibold|medium)$/.test(u) },
  { id: 'micro', sev: 'error', test: (u) => /^text-\[(?:[0-9]|1[01])(?:\.\d+)?px\]$/.test(u) },
  { id: 'uppercase', sev: 'error', test: (u) => u === 'uppercase' || /^tracking-(wide|wider|widest)$/.test(u) },
  { id: 'dropshadow', sev: 'error', test: (u) => /^drop-shadow/.test(u) },
];

const results = [];
const files = fileArgs.length
  ? fileArgs.map((f) => path.resolve(ROOT, f))
  : walk(path.join(ROOT, 'src')).filter((f) => inUiScope(rel(f)));

function lineOf(sf, pos) { return sf.getLineAndCharacterOfPosition(pos).line + 1; }

for (const f of files) {
  const r = rel(f);
  const text = fs.readFileSync(f, 'utf8');
  const sf = parse(f, text);
  const found = {}; // rule -> {sev, count, lines:[{line, sample}]}
  const add = (id, sev, line, sample) => {
    const e = (found[id] ||= { sev, count: 0, lines: [] });
    e.count++;
    if (e.lines.length < 8) e.lines.push({ line, sample: String(sample).slice(0, 90) });
  };

  // import 検査
  sf.statements.forEach((st) => {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
      if (st.moduleSpecifier.text === 'lucide-react') add('lucide', 'error', lineOf(sf, st.getStart(sf)), "from 'lucide-react'");
      if (st.moduleSpecifier.text === 'framer-motion') add('framer-motion', 'info', lineOf(sf, st.getStart(sf)), "from 'framer-motion'");
    }
  });

  for (const s of stringSegments(sf, text)) {
    const line = lineOf(sf, s.start);
    // 絵文字・記号
    if (s.kind !== 'str' || true) {
      const ms = s.text.match(EMOJI_RX);
      if (ms && ms.some((m) => m !== '️' && m !== '‍')) add('emoji', 'error', line, s.text.trim());
    }
    if (/linear-gradient\(|radial-gradient\(|conic-gradient\(/.test(s.text)) add('inline-gradient', 'error', line, s.text.trim());
    if (s.kind === 'jsxtext' || JA_RX.test(s.text)) continue; // クラス検査は日本語を含まない文字列だけ
    const toks = s.text.trim().split(/\s+/).filter(Boolean);
    if (!toks.length) continue;
    const utils = toks.map((t) => splitPrefix(t));
    for (const [prefix, u] of utils) {
      for (const rule of CLASS_RULES) {
        if (toks.length < 2 && !/[-:]/.test(u)) continue;
        if (rule.test(u)) add(rule.id, rule.sev, line, prefix + u);
      }
    }
    // 警告系（文字列全体の組み合わせで判定）
    if (toks.length >= 2) {
      const us = utils.map(([, u]) => u);
      if (us.includes('rounded-full') && us.some((u) => /^px-(2|3|4|5)$/.test(u)) && !us.some((u) => /^(w|h|size)-/.test(u))) add('pill', 'warn', line, s.text.trim());
      if (us.some((u) => /^border-l-(2|4|8)$/.test(u)) && us.some((u) => /^border-(l-)?(brand|slate|amber|red)-\d+/.test(u) || /^border-(brand|amber|red)-\d+/.test(u))) add('accent-bar', 'warn', line, s.text.trim());
      const sq = us.find((u) => /^h-(\d+)$/.test(u)); const sw = us.find((u) => /^w-(\d+)$/.test(u));
      if (sq && sw && sq.slice(2) === sw.slice(2) && us.some((u) => /^rounded/.test(u)) && us.some((u) => /^bg-/.test(u)) && (us.includes('place-items-center') || (us.includes('items-center') && us.includes('justify-center')))) add('icon-tile', 'warn', line, s.text.trim());
    }
  }
  if (Object.keys(found).length) results.push({ file: r, internal: isInternalPage(r), found });
}

const totals = {};
let gatingErrors = 0;
for (const r of results) {
  for (const [id, e] of Object.entries(r.found)) {
    const t = (totals[id] ||= { sev: e.sev, count: 0, files: 0 });
    t.count += e.count; t.files++;
    if (e.sev === 'error' && !r.internal) gatingErrors += e.count;
  }
}

if (FLAG('--json')) {
  console.log(JSON.stringify({ scanned: files.length, gatingErrors, totals, results }, null, 1));
} else {
  console.log(`scanned ${files.length} files — gating errors: ${gatingErrors}`);
  console.log('rule totals (count / files):');
  for (const [id, t] of Object.entries(totals).sort((a, b) => b[1].count - a[1].count)) console.log(`  ${t.sev.padEnd(5)} ${id.padEnd(15)} ${String(t.count).padStart(6)} / ${t.files}`);
  const showWarn = FLAG('--warnings');
  const rows = results
    .map((r) => ({ ...r, errs: Object.values(r.found).filter((e) => e.sev === 'error').reduce((a, e) => a + e.count, 0), warns: Object.values(r.found).filter((e) => e.sev === 'warn').reduce((a, e) => a + e.count, 0) }))
    .filter((r) => r.errs > 0 || (showWarn && r.warns > 0))
    .sort((a, b) => (b.errs + b.warns) - (a.errs + a.warns));
  if (!FLAG('--summary')) {
    for (const r of rows.slice(0, FLAG('--details') ? 400 : 60)) {
      console.log(`${r.internal ? '[internal] ' : ''}${r.file}  errors=${r.errs} warns=${r.warns}`);
      if (FLAG('--details')) {
        for (const [id, e] of Object.entries(r.found)) {
          if (e.sev === 'info') continue;
          if (e.sev === 'warn' && !showWarn) continue;
          for (const l of e.lines) console.log(`    L${l.line} ${id}: ${l.sample}`);
        }
      } else {
        console.log('    ' + Object.entries(r.found).filter(([, e]) => e.sev !== 'info' && (e.sev === 'error' || showWarn)).map(([id, e]) => `${id}:${e.count}`).join(' '));
      }
    }
    if (rows.length > 60 && !FLAG('--details')) console.log(`  ... and ${rows.length - 60} more files (use --json)`);
  }
}
process.exit(gatingErrors > 0 ? 1 : 0);
