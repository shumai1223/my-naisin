// UI改修ツール共通部品（ui-codemod / ui-lint / ui-guard が使う）
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** 絵文字・記号（UIに出してはいけないもの）。→ ※ ・ ● ■ ▶ などの活字記号は許可。 */
export const EMOJI_RX = /\p{Extended_Pictographic}|[✓✔✕✖✗✘★☆️‍]/gu;
export const JA_RX = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;

export function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '__tests__', '.open-next', 'generated'].includes(e.name)) continue;
      walk(p, out);
    } else if (/\.(tsx|ts)$/.test(e.name) && !/\.test\.(tsx|ts)$/.test(e.name) && !/\.d\.ts$/.test(e.name)) out.push(p);
  }
  return out;
}

export function rel(p) { return path.relative(ROOT, p).replace(/\\/g, '/'); }

/** UI改修の対象範囲。data/・lib/blog の本文・scripts は対象外。 */
export function inUiScope(relPath) {
  if (!relPath.startsWith('src/')) return false;
  if (/^src\/(data|generated|scripts)\//.test(relPath)) return false;
  if (/^src\/lib\/(blog|data|prefectures)/.test(relPath) && !relPath.endsWith('.tsx')) return false;
  if (relPath.startsWith('src/lib/') && !relPath.endsWith('.tsx') && !/(constants|rank|ui|theme|color|badge|style)/i.test(relPath)) return false;
  return true;
}

/** gating(エラー扱い)から外すもの: 内部用ページ */
export function isInternalPage(relPath) {
  return /^src\/app\/(admin|interim-bulletin-preview|partner-demo)\//.test(relPath) || /^src\/components\/admin\//.test(relPath);
}

export function parse(file, text) {
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
}

/** ソース中の「文字列の中身」の範囲を列挙する（クラス名・文言の検査/変換用）。 */
export function stringSegments(sf, text) {
  const segs = [];
  const visit = (node) => {
    const k = node.kind;
    if (k === ts.SyntaxKind.StringLiteral) {
      segs.push({ start: node.getStart(sf) + 1, end: node.getEnd() - 1, kind: 'str', node });
    } else if (k === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      segs.push({ start: node.getStart(sf) + 1, end: node.getEnd() - 1, kind: 'tpl', node });
    } else if (k === ts.SyntaxKind.TemplateHead) {
      segs.push({ start: node.getStart(sf) + 1, end: node.getEnd() - 2, kind: 'tplhead', node });
    } else if (k === ts.SyntaxKind.TemplateMiddle) {
      segs.push({ start: node.getStart(sf) + 1, end: node.getEnd() - 2, kind: 'tplmid', node });
    } else if (k === ts.SyntaxKind.TemplateTail) {
      segs.push({ start: node.getStart(sf) + 1, end: node.getEnd() - 1, kind: 'tpltail', node });
    } else if (k === ts.SyntaxKind.JsxText) {
      segs.push({ start: node.getStart(sf), end: node.getEnd(), kind: 'jsxtext', node });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return segs.filter((s) => s.end >= s.start).map((s) => ({ ...s, text: text.slice(s.start, s.end) }));
}

export function gitBase() {
  try { return execFileSync('git', ['merge-base', 'HEAD', 'main'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return 'HEAD'; }
}

export function gitShow(ref, relPath) {
  try { return execFileSync('git', ['show', `${ref}:${relPath}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); } catch { return null; }
}

export function changedFiles(ref) {
  const out = execFileSync('git', ['diff', '--name-only', ref, '--', 'src'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', 'src'], { cwd: ROOT, encoding: 'utf8' });
  return [...new Set([...out.split('\n'), ...untracked.split('\n')].map((s) => s.trim()).filter(Boolean))].filter((f) => /\.(tsx|ts)$/.test(f) && fs.existsSync(path.join(ROOT, f)));
}
