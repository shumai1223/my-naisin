#!/usr/bin/env node
/**
 * UI改修の「中身が変わっていないか」の検査。
 * 変更前（既定: main との merge-base）と現在のファイルを比べ、次の差を出す。
 *   - 日本語の文言（絵文字・記号・空白を除いて比較）
 *   - リンク・id・name などの属性値
 *   - 使っているコンポーネント（大文字の JSX タグ。アイコンは除く）
 *   - import（アイコンのモジュールは除く）
 *   - use* / track* / gtag の呼び出し回数
 *   - export 名
 *
 *   node scripts/ui/ui-guard.mjs [--base <ref>] [--json] [files...]
 *   ファイル未指定なら、base から変更された src/ のファイルすべて。
 *   差が出ること自体はエラーではない。差は「意図した変更か」を人が確かめるための一覧。
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { ROOT, rel, parse, stringSegments, gitBase, gitShow, changedFiles, EMOJI_RX, JA_RX } from './_shared.mjs';

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : gitBase();
const fileArgs = args.filter((a, i) => !a.startsWith('--') && i !== baseIdx + 1);
const JSON_OUT = args.includes('--json');

const ICON_MODULES = new Set(['lucide-react', '@/components/icons']);
const ATTRS = new Set(['href', 'src', 'id', 'htmlFor', 'name', 'role', 'type', 'action', 'to', 'target', 'rel']);

const norm = (s) => s.replace(EMOJI_RX, '').replace(/[　\s]+/g, ' ').trim();
const bag = () => new Map();
const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);

function signature(file, text) {
  const sf = parse(file, text);
  const sig = { texts: bag(), attrs: bag(), components: bag(), imports: bag(), calls: bag(), exports: bag() };
  const iconNames = new Set();
  sf.statements.forEach((st) => {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
      const mod = st.moduleSpecifier.text;
      if (ICON_MODULES.has(mod)) {
        const nb = st.importClause?.namedBindings;
        if (nb && ts.isNamedImports(nb)) nb.elements.forEach((e) => iconNames.add(e.name.text));
        return;
      }
      inc(sig.imports, mod);
    }
  });
  for (const s of stringSegments(sf, text)) {
    const t = norm(s.text);
    if (t && JA_RX.test(t)) inc(sig.texts, t);
  }
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      if (/^[A-Z]/.test(tag) && !iconNames.has(tag.split('.')[0])) inc(sig.components, tag);
      node.attributes.properties.forEach((p) => {
        if (ts.isJsxAttribute(p) && p.initializer && ts.isStringLiteral(p.initializer)) {
          const n = p.name.getText(sf);
          if (ATTRS.has(n) || n.startsWith('data-') || n.startsWith('aria-')) inc(sig.attrs, `${n}=${norm(p.initializer.text)}`);
        }
      });
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const n = node.expression.text;
      if (/^(use[A-Z]|track|gtag|fetch$)/.test(n)) inc(sig.calls, n);
    }
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isVariableStatement(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (ts.isVariableStatement(node)) node.declarationList.declarations.forEach((d) => inc(sig.exports, d.name.getText(sf)));
      else if (node.name) inc(sig.exports, node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return sig;
}

function diffBags(a, b) {
  const removed = []; const added = [];
  for (const [k, n] of a) { const m = b.get(k) || 0; if (m < n) removed.push(m === 0 ? k : `${k} (x${n}→x${m})`); }
  for (const [k, n] of b) { const m = a.get(k) || 0; if (m < n) added.push(m === 0 ? k : `${k} (x${m}→x${n})`); }
  return { removed, added };
}

const files = fileArgs.length ? fileArgs.map((f) => rel(path.resolve(ROOT, f))) : changedFiles(BASE);
const report = [];
let withDiff = 0;
for (const r of files) {
  const abs = path.join(ROOT, r);
  const cur = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  const base = gitShow(BASE, r);
  if (cur === null) { report.push({ file: r, status: 'deleted' }); withDiff++; continue; }
  if (base === null) { report.push({ file: r, status: 'new' }); withDiff++; continue; }
  const a = signature(r, base); const b = signature(r, cur);
  const d = {};
  for (const k of Object.keys(a)) {
    const x = diffBags(a[k], b[k]);
    if (x.removed.length || x.added.length) d[k] = x;
  }
  if (Object.keys(d).length) { report.push({ file: r, status: 'changed', diff: d }); withDiff++; }
}

if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, filesChecked: files.length, filesWithDiff: withDiff, report }, null, 1));
} else {
  console.log(`base=${BASE.slice(0, 8)} checked=${files.length} withContentDiff=${withDiff}`);
  for (const r of report) {
    if (r.status !== 'changed') { console.log(`[${r.status}] ${r.file}`); continue; }
    console.log(`[changed] ${r.file}`);
    for (const [k, x] of Object.entries(r.diff)) {
      for (const t of x.removed.slice(0, 12)) console.log(`   - ${k}: ${t.slice(0, 120)}`);
      for (const t of x.added.slice(0, 12)) console.log(`   + ${k}: ${t.slice(0, 120)}`);
      if (x.removed.length > 12 || x.added.length > 12) console.log(`   ... (${x.removed.length} removed / ${x.added.length} added in ${k})`);
    }
  }
}
