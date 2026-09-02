import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * T-Y11 A-4: 「自己検算（グランドトータルとの一致テスト）」の網羅性を確認する。
 *
 * 2026-09-01の調査で、A-4は「これから47県ぶん用意する」という未着手タスクではなく、
 * **既に45/47県が`checkAgainstSubtotal`で・残り2県(gunma/hokkaido)も別の理由で
 * グランドトータルへ機械的に合わせられないことを文書化した代替検証（学校別D列合計の
 * 内部整合性チェック等）で対応済み**と判明した（タスクファイル自体が実データを見ずに
 * 「本体」と書いていた別の事例・[[fable5-loop-protocol]]「プローズでなく実ファイルを
 * 確認する」の教訓と同型）。
 *
 * このテストは「新しい県ファイルを追加した時に対応するテストファイルへ自己検算を
 * 入れ忘れる」ことを防ぐ回帰ガードとして追加する。判定は緩め（`checkAgainstSubtotal`の
 * 使用、または「完全一致」等の照合結果を明記した記述のいずれか）にしてある。厳密な
 * 数値一致そのものは各県の`*.test.ts`本体が個別に検証する。
 */

const PREFECTURE_TESTS_DIR = join(__dirname, '..', '__tests__');
// このファイル自身や、prefecture固有ではない横断テストは対象から除外する。
const CROSS_CUTTING_FILES = new Set([
  'index-invariants.test.ts',
  'scope-exclusion-invariant.test.ts',
  'grand-total-reconciliation-invariant.test.ts',
  'finalrate-invariant.test.ts',
]);

function prefectureTestFiles(): string[] {
  return readdirSync(PREFECTURE_TESTS_DIR).filter((f) => f.endsWith('.test.ts') && !CROSS_CUTTING_FILES.has(f));
}

// hokkaido等、原資料に公式グランドトータル行が印字されていない県は突合対象が無いため、
// 代わりに「finalApplicants÷quota≒finalRate」等の内部整合性チェックで代替している。
// これも正直な代替検証として認める（Y-0憲法③「機械可読不能は正直にスキップ」の精神）。
const RECONCILIATION_EVIDENCE_RE = /checkAgainstSubtotal|完全一致|一致することを確認|内部整合性/;

describe('competition-rates grand-total reconciliation invariant (自己検算の網羅性)', () => {
  const files = prefectureTestFiles();

  it('covers 47 prefecture test files', () => {
    expect(files.length).toBe(47);
  });

  it.each(files)('%s documents some form of grand-total/subtotal reconciliation', (file) => {
    const content = readFileSync(join(PREFECTURE_TESTS_DIR, file), 'utf-8');
    expect(RECONCILIATION_EVIDENCE_RE.test(content)).toBe(true);
  });
});
