/**
 * a11y監査（TIER L-10）用の共通ヘルパー。
 *
 * 静的なJSXソース走査でチェックできる範囲に限定する（このマシンではPlaywright実ブラウザ
 * 実行が不可能・[[opennext-ssg-1102-gotcha]]と同様のCWV系と違い、axe-core等の追加依存の
 * インストールも無人ループの禁止事項に該当するため使えない）:
 *   1. ラベル関連付け: <input>/<select> が aria-label・aria-labelledby・
 *      <label htmlFor=id>、またはラップ型 <label><input/></label> のいずれかを持つか。
 *   2. キーボード操作性: onClick を持つ非インタラクティブ要素（div/span）が
 *      role + tabIndex を伴わずに置かれていないか（ボタン化されず、キーボードで
 *      到達不能なクリックトラップになっていないか）。
 * コントラスト比は実レンダリング（computed style）が必要でjsdom/静的解析では
 * 検証不能なため対象外（Lighthouse CI・実ブラウザでの継続監査に委ねる）。
 */
import fs from 'fs';
import path from 'path';

export function walkComponentFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '__tests__') continue;
      walkComponentFiles(full, acc);
    } else if (/\.tsx$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

/** タグ開始位置(`<input`等)から、brace深度を追跡しつつ実際のタグ終端(`>`)までを切り出す。
 * onChange={(e) => ...} のようなアロー関数の `=>` に含まれる `>` で誤終端しないための対策。 */
export function extractTag(content: string, startIdx: number): string {
  let i = startIdx;
  let braceDepth = 0;
  while (i < content.length) {
    const ch = content[i];
    if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth--;
    else if (ch === '>' && braceDepth === 0) {
      return content.slice(startIdx, i + 1);
    }
    i++;
  }
  return content.slice(startIdx, Math.min(startIdx + 2000, content.length));
}

export interface TagOccurrence {
  tag: string;
  index: number;
  line: number;
}

export function findTagOccurrences(content: string, tagNames: string[]): TagOccurrence[] {
  const re = new RegExp(`<(${tagNames.join('|')})\\b`, 'g');
  const results: TagOccurrence[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const tag = extractTag(content, m.index);
    const line = content.slice(0, m.index).split('\n').length;
    results.push({ tag, index: m.index, line });
  }
  return results;
}

/** startIdxより前で最も近い <label あるいは </label> を探し、直近が開始タグ(未クローズ)なら
 * ラップ型ラベル（<label><input/></label>）と判定する。 */
export function isWrappedByLabel(content: string, startIdx: number): boolean {
  const before = content.slice(0, startIdx);
  const lastOpen = before.lastIndexOf('<label');
  const lastClose = before.lastIndexOf('</label>');
  if (lastOpen === -1) return false;
  return lastOpen > lastClose;
}

/** <input>/<select>タグが、何らかの形でアクセシブルな名前を持つかを判定する。 */
export function hasAccessibleName(tag: string, tagStartIdx: number, content: string): boolean {
  if (/aria-label(?:ledby)?=/.test(tag)) return true;
  const idMatch = tag.match(/\bid=["'{]([^"'}]+)["'}]/);
  if (idMatch) {
    const idVal = idMatch[1];
    const labelRe = new RegExp(`<label\\b[^>]*htmlFor=["'{]${idVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'}]`);
    if (labelRe.test(content)) return true;
  }
  if (isWrappedByLabel(content, tagStartIdx)) return true;
  return false;
}

/** onClickを持つがrole/tabIndexを伴わないdiv/span（キーボード到達不能なクリックトラップ候補）。 */
export function findClickableWithoutKeyboardAccess(content: string): TagOccurrence[] {
  return findTagOccurrences(content, ['div', 'span']).filter(
    ({ tag }) => /\bonClick=/.test(tag) && !/\brole=/.test(tag) && !/\btabIndex=/.test(tag),
  );
}
