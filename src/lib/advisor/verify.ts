/**
 * グラウンデッドAIアドバイザー（ZZ-3b）の反ハルシネーション検証器。
 * 準拠必須仕様: docs/zz-specs/zz3-grounded-advisor-spec.md §2・§4・§5。
 *
 * 核心原則（§0）: 回答に含まれる全ての数値は、台帳（GroundingLedger）由来でなければならない。
 * この関数はテスト時とランタイムの両方で同じものを使う（§1 ④）。
 */
import { ADVISOR_STRUCTURAL_CONSTANTS, type GroundingLedger } from './ledger';

export type ViolationType = 'unbacked-number' | 'judgment-lint' | 'missing-disclaimer' | 'code-block';

export interface Violation {
  type: ViolationType;
  detail: string;
}

export interface VerifyResult {
  ok: boolean;
  violations: Violation[];
}

/** 全回答末尾に必須の判断留保定型文（§5）。 */
export const REQUIRED_DISCLAIMER = '最終的な判断は学校の先生・保護者の方と相談してください。';

/**
 * 断定進路指導の禁止フレーズ（§5）。推量形「〜の可能性があります」はエンジン由来の判定値が
 * ある場合のみ可＝このリストには含めない（推量表現そのものを禁止するものではない）。
 */
const JUDGMENT_FORBIDDEN_PHRASES = ['受かります', '合格できます', '合格です', '安全です', '大丈夫です', '確実', '絶対'];

const KANJI_DIGITS: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const KANJI_UNITS: Record<string, number> = { 十: 10, 百: 100, 千: 1000 };

/** 位取り漢数字（例:「三百五十」）を算用数字に変換する（純粋関数）。 */
function kanjiToNumber(s: string): number {
  let total = 0;
  let current = 0;
  for (const ch of s) {
    if (ch in KANJI_DIGITS) {
      current = KANJI_DIGITS[ch];
    } else if (ch in KANJI_UNITS) {
      total += (current || 1) * KANJI_UNITS[ch];
      current = 0;
    }
  }
  return total + current;
}

/** 全角数字→半角数字に正規化する（§2-2）。 */
function normalizeFullWidthDigits(text: string): string {
  return text.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

/** markdownリンクのhref部分を除去し、リンクテキストのみを検証対象に残す（§2-1）。 */
function stripMarkdownLinkHrefs(text: string): string {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

/**
 * 台帳外で使用を許可された構造定数フレーズ（§3）を本文から除去する。
 * 除去後に残った数値だけが「台帳と照合すべき数値」として抽出対象になる。
 */
function stripStructuralConstants(text: string): string {
  let result = text;
  for (const phrase of ADVISOR_STRUCTURAL_CONSTANTS) {
    result = result.split(phrase).join('');
  }
  return result;
}

/** 本文から検証対象の数値トークンを抽出する（§2-2〜4・構造定数除去後のテキストに対して実行）。 */
function extractNumberTokens(text: string): string[] {
  const normalized = normalizeFullWidthDigits(text);
  const tokens: string[] = [];

  // 半角数字（小数・カンマ含む）。range表現(300〜350)も両端が個別にマッチする。
  const arabicMatches = normalized.match(/[0-9]+([.,][0-9]+)?/g);
  if (arabicMatches) tokens.push(...arabicMatches);

  // 漢数字：一〜九＋(年生|学期|教科|段階)の直結形
  for (const m of normalized.matchAll(/([一二三四五六七八九])(年生|学期|教科|段階)/g)) {
    tokens.push(`${kanjiToNumber(m[1])}${m[2]}`);
  }

  // 漢数字：位取り(十/百/千を含む連続列)。上のsuffix形と重複しないよう十/百/千を含む列のみ対象。
  for (const m of normalized.matchAll(/[一二三四五六七八九]?[十百千][一二三四五六七八九十百千]*/g)) {
    tokens.push(String(kanjiToNumber(m[0])));
  }

  return tokens;
}

/**
 * 回答文が台帳（+構造定数）だけで数値的にグラウンディングされているかを検証する（純粋関数）。
 *
 * @param renderedText 検証対象の回答文。
 * @param ledger グラウンディング台帳。
 * @param prefContext 指定すると、この都道府県コード（またはcontext='none'）のエントリのみを
 *   グラウンディングの根拠として認める（§4 県コンテキスト混線ガード）。県間比較のように
 *   1つの台帳に複数県のエントリが混在する場合、ブロックごとにprefContextを指定して個別に
 *   検証することで「県Aのブロックに県Bの数値が紛れ込む」事故を検出できる。未指定時は
 *   台帳全体を根拠として認める（単一県・県非依存の回答向け）。
 */
export function verifyGrounding(renderedText: string, ledger: GroundingLedger, prefContext?: string): VerifyResult {
  const violations: Violation[] = [];

  if (renderedText.includes('```')) {
    violations.push({ type: 'code-block', detail: 'advisorはコードブロックを出力してはならない' });
  }

  const relevantLedger = prefContext ? ledger.filter((e) => e.context === prefContext || e.context === 'none') : ledger;
  const ledgerValues = new Set(relevantLedger.map((e) => e.value));

  const withoutLinks = stripMarkdownLinkHrefs(renderedText);
  const withoutConstants = stripStructuralConstants(withoutLinks);
  const tokens = extractNumberTokens(withoutConstants);

  for (const token of tokens) {
    if (!ledgerValues.has(token)) {
      violations.push({ type: 'unbacked-number', detail: `台帳に無い数値「${token}」が本文に出現` });
    }
  }

  for (const phrase of JUDGMENT_FORBIDDEN_PHRASES) {
    if (renderedText.includes(phrase)) {
      violations.push({ type: 'judgment-lint', detail: `断定フレーズ「${phrase}」を検出` });
    }
  }

  if (!renderedText.includes(REQUIRED_DISCLAIMER)) {
    violations.push({ type: 'missing-disclaimer', detail: '判断留保の定型文が本文に無い' });
  }

  return { ok: violations.length === 0, violations };
}

/** エンジンエラー・検証失敗時の安全な定型文（構造定数以外の数値をゼロにする）。 */
export const SAFE_FALLBACK_TEXT = `この質問には、決定論エンジンで正確にお答えできる材料が揃っていません。内申点計算ツールで直接計算するか、担当の先生にご確認ください。\n\n${REQUIRED_DISCLAIMER}`;
