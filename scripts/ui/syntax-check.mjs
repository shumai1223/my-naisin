#!/usr/bin/env node
/**
 * 編集したファイルの簡易チェック（型検査ではない・数秒で終わる）。
 *   node scripts/ui/syntax-check.mjs <files...>
 *   - 構文エラー（タグの閉じ忘れ・括弧）
 *   - 使っていない import（アイコンの消し忘れ）
 *   - import していない大文字の JSX タグ（アイコンの import 漏れ）
 * 問題があれば exit 1。型の整合は親が tsc で確認するので、ここでは見ない。
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { ROOT, rel, gitShow } from './_shared.mjs';

const files = process.argv.slice(2).filter((a) => !a.startsWith('--')).map((f) => path.resolve(ROOT, f));
function analyze(f, text) {
  const kind = f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, kind);
  const out = [];
  for (const d of sf.parseDiagnostics || []) {
    const { line, character } = sf.getLineAndCharacterOfPosition(d.start || 0);
    out.push(`構文エラー L${line + 1}:${character + 1} ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
  }
  // import された名前・宣言された名前
  const imported = new Map(); // name -> line
  const declared = new Set();
  sf.statements.forEach((st) => {
    if (ts.isImportDeclaration(st) && st.importClause) {
      const ic = st.importClause;
      if (ic.name) imported.set(ic.name.text, st.getStart(sf));
      if (ic.namedBindings) {
        if (ts.isNamespaceImport(ic.namedBindings)) imported.set(ic.namedBindings.name.text, st.getStart(sf));
        else ic.namedBindings.elements.forEach((e) => imported.set(e.name.text, st.getStart(sf)));
      }
    }
  });
  const used = new Map();
  const jsxTags = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const p = node.parent;
      const isDeclName = (ts.isImportSpecifier(p) || ts.isImportClause(p) || ts.isNamespaceImport(p)) ;
      if (!isDeclName) used.set(node.text, (used.get(node.text) || 0) + 1);
    }
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node)) && node.name) declared.add(node.name.text);
    if (ts.isVariableDeclaration(node)) {
      const collect = (n) => { if (ts.isIdentifier(n)) declared.add(n.text); else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) n.elements.forEach((e) => { if (!ts.isOmittedExpression(e)) collect(e.name); }); };
      collect(node.name);
    }
    if (ts.isParameter(node)) { const collect = (n) => { if (ts.isIdentifier(n)) declared.add(n.text); else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) n.elements.forEach((e) => { if (!ts.isOmittedExpression(e)) collect(e.name); }); }; collect(node.name); }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const t = node.tagName.getText(sf).split('.')[0];
      if (/^[A-Z]/.test(t)) jsxTags.add(t);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  const unused = [];
  for (const [name, pos] of imported) {
    if (!used.get(name)) unused.push({ name, line: sf.getLineAndCharacterOfPosition(pos).line + 1 });
  }
  for (const t of jsxTags) {
    if (!imported.has(t) && !declared.has(t)) out.push(`宣言も import も無い JSX タグ: <${t}>`);
  }
  return { out, unused };
}

let problems = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const cur = analyze(f, text);
  const baseText = gitShow('HEAD', rel(f));
  const baseUnused = new Set(baseText ? analyze(f, baseText).unused.map((u) => u.name) : []);
  // 直前のコミット時点で既に未使用だった import（React など）は今回の対象外。新しく未使用になったものだけ報告する。
  const out = [...cur.out, ...cur.unused.filter((u) => !baseUnused.has(u.name) && u.name !== 'React').map((u) => `使っていない import: ${u.name} (L${u.line}) ← 今回の編集で未使用になりました。削除してください`)];
  if (out.length) { problems += out.length; console.log(rel(f)); out.forEach((o) => console.log('  ' + o)); }
}
console.log(problems ? `problems: ${problems}` : `ok (${files.length} files)`);
process.exit(problems ? 1 : 0);
