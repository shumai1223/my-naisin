/**
 * a11y監査（TIER L-10）: 計算機フォームのラベル関連付け＋クリック要素のキーボード到達性を
 * 静的なJSXソース走査で機械検知する回帰テスト。
 *
 * 2026-07-08時点の初回監査で src/components 配下の <input>/<select> 87件中、
 * 実際にアクセシブルな名前（aria-label / aria-labelledby / htmlFor連携 / ラップ型label）を
 * 持たないものが75件見つかり（うち32件は「計算機フォーム」= 実際の入力→計算UIで
 * このタスクのスコープとして是正済み）、残り11件は計算機以外のフォーム
 * （お問い合わせ・用語検索・エラー報告・目標メモ編集）で次周以降の継続タスクとする。
 */
import path from 'path';
import {
  walkComponentFiles,
  findTagOccurrences,
  hasAccessibleName,
  findClickableWithoutKeyboardAccess,
} from '@/lib/a11y-audit';

/**
 * アクセシブルな名前が無くても正当と判断済みの例外（ファイル相対パス:行番号）。
 * 追加する場合は「なぜ不要か・いつ是正するか」をコメントで残すこと（審査なしの抜け道にしない）。
 * 2026-07-08時点に検出されていた11件（お問い合わせ・用語検索・エラー報告・目標メモ・保存メモ）は
 * 2026-07-23にhtmlFor/id関連付けまたはaria-labelを追加して是正済み（現在は空リスト）。
 */
const NO_ACCESSIBLE_NAME_EXEMPT: Record<string, string> = {
};

/**
 * role+tabIndex無しでも正当と判断済みの例外。
 * モーダルの背景（backdrop）クリックで閉じる標準パターン＝装飾的なマウス限定の補助操作であり、
 * 実際のインタラクティブ操作（閉じる・LINE登録等）は別途キーボード到達可能な<button>で提供済み。
 * バックドロップにrole="button"を付けるとスクリーンリーダーに偽の操作対象として誤って露出するため
 * 付けないほうが正しい（意図的な設計・審査なしの抜け道ではない）。
 */
const CLICKABLE_WITHOUT_KEYBOARD_EXEMPT: Record<string, string> = {
  'src/components/CookieConsent.tsx:82': 'モーダル背景クリックで閉じる標準パターン（実操作は別途<button>で提供済み）',
  'src/components/ExitIntentLineModal.tsx:134': 'モーダル内コンテンツのstopPropagationガード（クリック可能な操作対象ではない）',
};

describe('a11y監査（L-10）: 入力要素のラベル関連付け', () => {
  const srcDir = path.join(__dirname, '..', '..');
  const files = walkComponentFiles(srcDir);

  test('走査対象ファイルが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test('全<input>/<select>がアクセシブルな名前を持つ、または理由付きの例外リストに登録されている', () => {
    const violations: string[] = [];
    for (const file of files) {
      const content = require('fs').readFileSync(file, 'utf8');
      const occurrences = findTagOccurrences(content, ['input', 'select']);
      for (const { tag, index, line } of occurrences) {
        if (hasAccessibleName(tag, index, content)) continue;
        const rel = path.relative(path.join(srcDir, '..'), file).replace(/\\/g, '/');
        const key = `${rel}:${line}`;
        if (NO_ACCESSIBLE_NAME_EXEMPT[key]) continue;
        violations.push(key);
      }
    }
    expect(violations).toEqual([]);
  });

  test('例外リストの全エントリが実在するファイル:行を指している（死んだ例外の放置防止・大まかな検証）', () => {
    // ファイルパスの実在のみ検証（行番号の完全一致は編集のたびにずれるため対象外）。
    const existingFiles = new Set(
      files.map((f) => path.relative(path.join(srcDir, '..'), f).replace(/\\/g, '/')),
    );
    for (const key of Object.keys(NO_ACCESSIBLE_NAME_EXEMPT)) {
      const [rel] = key.split(':');
      expect(existingFiles.has(rel)).toBe(true);
    }
  });
});

describe('a11y監査（L-10）: クリック要素のキーボード到達性', () => {
  const srcDir = path.join(__dirname, '..', '..');
  const files = walkComponentFiles(srcDir);

  test('onClickを持つdiv/spanがrole+tabIndexを伴う、または理由付きの例外リストに登録されている', () => {
    const violations: string[] = [];
    for (const file of files) {
      const content = require('fs').readFileSync(file, 'utf8');
      const occurrences = findClickableWithoutKeyboardAccess(content);
      for (const { line } of occurrences) {
        const rel = path.relative(path.join(srcDir, '..'), file).replace(/\\/g, '/');
        const key = `${rel}:${line}`;
        if (CLICKABLE_WITHOUT_KEYBOARD_EXEMPT[key]) continue;
        violations.push(key);
      }
    }
    expect(violations).toEqual([]);
  });
});
