#!/usr/bin/env node
/**
 * UI改修の機械変換（docs/design/DESIGN-SYSTEM.md §6 の変換表）。
 * 文字列リテラルの中のTailwindクラスだけを書き換える。文言・構造・ロジックは触らない。
 *
 *   node scripts/ui/ui-codemod.mjs [--dry] [--no-icons] [files...]
 *   ファイル未指定なら src/ のUI対象すべて。
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { ROOT, walk, rel, parse, stringSegments, inUiScope, JA_RX } from './_shared.mjs';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const NO_ICONS = args.includes('--no-icons');
const fileArgs = args.filter((a) => !a.startsWith('--'));

const HUE_MAP = {
  purple: 'slate', violet: 'slate', fuchsia: 'slate', pink: 'slate',
  orange: 'amber', yellow: 'amber', rose: 'red',
  sky: 'brand', cyan: 'brand', teal: 'brand', blue: 'brand', indigo: 'brand', emerald: 'brand', green: 'brand', lime: 'brand',
  gray: 'slate', zinc: 'slate', neutral: 'slate', stone: 'slate',
};
const HUES = Object.keys(HUE_MAP).join('|');
const COLOR_UTIL_RX = new RegExp(`^(bg|text|border|border-[trblxyse]|ring|ring-offset|divide|fill|stroke|outline|decoration|accent|caret|placeholder|from|via|to|shadow)-(${HUES})-(50|100|200|300|400|500|600|700|800|900|950)(\\/[0-9.]+)?$`);

const REMOVE_RX = [
  /^animate-(pulse|bounce|ping|float|shimmer|pulse-subtle)$/,
  /^(glow-pulse|float|shimmer|score-pop|btn-glow|card-hover|glass-card|mesh-gradient|gradient-text|premium-input|rank-[sab]-glow)$/,
  /^backdrop-(blur|saturate|brightness)(-[a-z0-9]+)?$/,
  /^drop-shadow(-[a-z0-9]+)?$/,
  /^shadow(-(sm|md|lg|xl|2xl|inner|glow|glow-lg|[a-z]+-\d{2,3}(\/\d+)?|\[[^\]]*\]))?$/,
];

const stats = {};
const bump = (k, n = 1) => { stats[k] = (stats[k] || 0) + n; };

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

const CLASSISH_START = /^(bg|text|border|rounded|shadow|flex|grid|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|min|max|font|gap|items|justify|animate|from|via|to|ring|space|divide|overflow|relative|absolute|fixed|sticky|inline|block|hidden|uppercase|tracking|leading|backdrop|opacity|transition|cursor|select|object|z|top|left|right|bottom|inset|order|col|row|place|self|shrink|grow|basis|underline|no-underline|truncate|sr-only|group|peer|fill|stroke|outline|decoration|accent|list|align|whitespace|break|resize|scale|rotate|translate|origin|duration|ease|delay|will|aspect|container|columns|table|float|clear|isolate|appearance|pointer|touch|snap|scroll|content|ring-offset|blur|drop|backdrop)/;

function looksLikeClasses(s) {
  if (JA_RX.test(s)) return false;
  const toks = s.trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return false;
  if (toks.length < 2 && !/[-:]/.test(toks[0])) return false;
  let hit = 0;
  for (const t of toks) {
    const [, u] = splitPrefix(t);
    if (CLASSISH_START.test(u.replace(/^-/, ''))) hit++;
  }
  return hit >= 1 && hit / toks.length >= 0.5;
}

function transformTokens(toks) {
  const T = toks.map((raw) => { const [prefix, util] = splitPrefix(raw); return { raw, prefix, util, remove: false, replace: null }; });

  // 1) グラデーション → 単色
  const gradPrefixes = new Set(T.filter((t) => /^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/.test(t.util)).map((t) => t.prefix));
  const hasClip = T.some((t) => t.util === 'bg-clip-text');
  for (const P of gradPrefixes) {
    const grads = T.filter((t) => t.prefix === P && /^bg-gradient-to-/.test(t.util));
    const stops = T.filter((t) => t.prefix === P && /^(from|via|to)-/.test(t.util));
    const colorStops = stops.filter((t) => !/^(from|via|to)-\d+%$/.test(t.util));
    const pick = colorStops.find((t) => t.util.startsWith('from-')) || colorStops.find((t) => t.util.startsWith('via-')) || colorStops.find((t) => t.util.startsWith('to-'));
    const color = pick ? pick.util.slice(pick.util.indexOf('-') + 1) : null;
    const transparentTok = T.find((t) => t.prefix === P && t.util === 'text-transparent');
    if (hasClip && transparentTok && color) {
      grads.forEach((g) => { g.remove = true; });
      transparentTok.replace = `${P}text-${color}`;
      T.filter((t) => t.util === 'bg-clip-text').forEach((t) => { t.remove = true; });
      bump('gradientText');
    } else if (color) {
      grads.forEach((g, i) => { if (i === 0) g.replace = `${P}bg-${color}`; else g.remove = true; });
      bump('gradient');
    } else {
      // 色の指定が別のリテラルにある等: 触らず lint に拾わせる（背景が消える事故を防ぐ）
      bump('gradientNoColor');
      continue;
    }
    stops.forEach((t) => { t.remove = true; });
  }

  // 2) 禁止トークンの削除
  const blurPresent = T.some((t) => /^backdrop-blur/.test(t.util));
  for (const t of T) {
    if (t.remove) continue;
    const full = t.util;
    if (full === 'shadow-overlay' || full === 'shadow-none') continue;
    if (/^-translate-y-\d+(\.\d+)?$/.test(full) && /hover:/.test(t.prefix)) { t.remove = true; bump('removed:hover-lift'); continue; }
    if (REMOVE_RX.some((rx) => rx.test(full))) { t.remove = true; bump('removed:' + full.replace(/-\d.*$/, '').replace(/\[.*$/, '')); }
  }
  if (blurPresent) {
    for (const t of T) { if (!t.remove && /^bg-white\/\d+$/.test(t.util)) { t.replace = `${t.prefix}bg-white`; bump('blurBgSolid'); } }
  }
  // uppercase + tracking の小ラベル
  const hasUpper = T.some((t) => t.util === 'uppercase');
  if (hasUpper) {
    for (const t of T) {
      if (!t.remove && (t.util === 'uppercase' || /^tracking-(wide|wider|widest)$/.test(t.util))) { t.remove = true; bump('upperTracking'); }
    }
  }

  // 3) 置換
  for (const t of T) {
    if (t.remove || t.replace) continue;
    let u = t.util;
    let m;
    if (/^font-(black|extrabold|semibold)$/.test(u)) { t.replace = `${t.prefix}font-bold`; bump('fontWeight'); continue; }
    if (u === 'font-medium') { t.remove = true; bump('fontMedium'); continue; }
    if ((m = u.match(/^text-\[(?:8|9|10|11)px\]$/))) { t.replace = `${t.prefix}text-xs`; bump('microText'); continue; }
    if ((m = u.match(/^rounded(-(?:t|b|l|r|tl|tr|bl|br|s|e|ss|se|es|ee))?-(?:xl|2xl|3xl)$/))) { t.replace = `${t.prefix}rounded${m[1] || ''}-lg`; bump('rounded'); continue; }
    if ((m = u.match(COLOR_UTIL_RX))) {
      const [, kind, hue, shade, op] = m;
      t.replace = `${t.prefix}${kind}-${HUE_MAP[hue]}-${shade}${op || ''}`;
      bump('hue:' + hue + '->' + HUE_MAP[hue]);
      continue;
    }
  }

  // 4) 色相の置き換えを最終形にも適用（グラデーション由来の bg-* も対象）
  const outToks = [];
  for (const t of T) {
    if (t.remove) continue;
    let tok = t.replace ?? t.raw;
    const [pre, util] = splitPrefix(tok);
    const m = util.match(COLOR_UTIL_RX);
    if (m) { tok = `--`; bump('hue:' + m[2] + '->' + HUE_MAP[m[2]]); }
    outToks.push(tok);
  }
  return outToks;
}

function transformSegment(text, ctx) {
  if (!looksLikeClasses(text)) return text;
  // 単独の from-/via-/to- だけの文字列（グラデーションの色だけを別の場所に置いている型）→ 単色の bg-*
  {
    const toks0 = text.trim().split(/\s+/).filter(Boolean);
    const parts0 = toks0.map(splitPrefix);
    if (toks0.length && parts0.every(([, u]) => /^(from|via|to)-/.test(u)) && parts0.every(([pre]) => pre === parts0[0][0])) {
      const cols = parts0.map(([, u]) => u).filter((u) => !/^(from|via|to)-\d+%$/.test(u));
      const pick = cols.find((u) => u.startsWith('from-')) || cols.find((u) => u.startsWith('via-')) || cols.find((u) => u.startsWith('to-'));
      if (pick) {
        ctx.standaloneStops++;
        bump('standaloneStops');
        const lead = text.match(/^\s*/)[0]; const trail = text.match(/\s*$/)[0];
        const col = pick.slice(pick.indexOf('-') + 1);
        const m0 = `bg-${col}`.match(COLOR_UTIL_RX);
        const fixed = m0 ? `bg-${HUE_MAP[m0[2]]}-${m0[3]}${m0[4] || ''}` : `bg-${col}`;
        return lead + parts0[0][0] + fixed + trail;
      }
    }
  }
  const lines = text.split('\n');
  let changed = false;
  const out = lines.map((line) => {
    const indent = line.match(/^[ \t]*/)[0];
    const trailing = line.match(/[ \t]*$/)[0];
    const body = line.slice(indent.length, line.length - trailing.length);
    if (!body) return line;
    const toks = body.split(/[ \t]+/);
    const next = transformTokens(toks);
    if (next.length === toks.length && next.every((x, i) => x === toks[i])) return line;
    changed = true;
    // 先頭/末尾の空白は保持（テンプレートの ${} との境界で必要）
    return indent + next.join(' ') + (next.length ? trailing : '');
  });
  return changed ? out.join('\n') : text;
}

function removeLoneGradientTokens(f, text) {
  const sf2 = parse(f, text);
  const edits = [];
  for (const s of stringSegments(sf2, text).filter((x) => x.kind !== 'jsxtext')) {
    if (!/bg-gradient-to-/.test(s.text) || JA_RX.test(s.text)) continue;
    if (/(^|\s)(?:[a-z0-9-]+:)*(from|via|to)-/.test(s.text)) continue;
    const next = s.text.replace(/(^|\s)(?:[a-z0-9-]+:)*bg-gradient-to-[a-z]+(?=\s|$)/g, '$1').replace(/[ \t]{2,}/g, ' ');
    if (next !== s.text) { edits.push({ start: s.start, end: s.end, text: next }); bump('loneGradientRemoved'); }
  }
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

let files;
if (fileArgs.length) files = fileArgs.map((f) => path.resolve(ROOT, f));
else files = walk(path.join(ROOT, 'src')).filter((f) => inUiScope(rel(f)));

let changedFiles = 0;
let iconSwaps = 0;
const leftoverGradient = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const sf = parse(f, text);
  const segs = stringSegments(sf, text).filter((s) => s.kind !== 'jsxtext');
  const edits = [];
  const ctx = { standaloneStops: 0 };
  for (const s of segs) {
    // lucide-react の import 先を差し替え
    if (!NO_ICONS && s.kind === 'str' && s.text === 'lucide-react' && (ts.isImportDeclaration(s.node.parent) || ts.isExportDeclaration(s.node.parent))) {
      edits.push({ start: s.start, end: s.end, text: '@/components/icons' });
      iconSwaps++;
      continue;
    }
    const next = transformSegment(s.text, ctx);
    if (next !== s.text) edits.push({ start: s.start, end: s.end, text: next });
  }
  if (!edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  // 色の指定だけ別の場所に置いていた型: 単色に直したので、残った bg-gradient-to-* だけの指定を外す
  if (ctx.standaloneStops > 0) out = removeLoneGradientTokens(f, out);
  changedFiles++;
  if (/bg-gradient-to-/.test(out)) leftoverGradient.push(rel(f));
  if (!DRY) fs.writeFileSync(f, out, 'utf8');
}

console.log(JSON.stringify({ filesScanned: files.length, changedFiles, iconSwaps, dry: DRY, stats, leftoverGradient }, null, 1));
