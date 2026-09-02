/**
 * T-Y11C: `finalRate`（公表倍率）が「その学校の`finalApplicants÷quota`をどの丸め方式で
 * 表現したものか」を、浮動小数点を一切使わずに機械判定する。
 *
 * 【なぜ`toFixed`/`Math.round(x*100)/100`を使わないか】
 * 2026-09-02、miyagiのPDF検証で既存データの計算バグを発見した: 204÷160=1.275のように
 * ちょうど四捨五入の境界値（x.xx5）になるレコードで、`Number((204/160).toFixed(2))`は
 * 2進数浮動小数点表現の誤差（1.275は正確に表現できず1.27499...として格納される）により
 * **1.28ではなく1.27を返す**（[[fable5-loop-protocol]]参照）。この検算自体で同じ
 * `toFixed`を使うと、バグが自分自身を正当化してしまい何も検出できない。本モジュールは
 * `BigInt`による整数演算のみで四捨五入・切り捨てを実装し、この罠を回避する。
 */

/** applicants／quota を10^decimals倍したスケールで四捨五入（0.5以上切り上げ）した整数値。 */
export function roundHalfUpScaled(applicants: number, quota: number, decimals: number): bigint {
  const scale = 10n ** BigInt(decimals);
  const num = BigInt(applicants) * scale;
  const denom = BigInt(quota);
  const q = num / denom;
  const r = num % denom;
  return r * 2n >= denom ? q + 1n : q;
}

/** applicants／quota を10^decimals倍したスケールで切り捨てた整数値。 */
export function truncScaled(applicants: number, quota: number, decimals: number): bigint {
  const scale = 10n ** BigInt(decimals);
  return (BigInt(applicants) * scale) / BigInt(quota);
}

/**
 * applicants／quota が、指定桁数での四捨五入の境界値（ちょうど x...5）かどうか。
 * 境界値は四捨五入と切り捨てで結果が割れる（miyagiの1.275はdecimals=2の境界値）。
 */
export function isRoundingBoundary(applicants: number, quota: number, decimals: number): boolean {
  const scale = 10n ** BigInt(decimals + 1);
  const num = BigInt(applicants) * scale;
  const denom = BigInt(quota);
  if (num % denom !== 0n) return false;
  return (num / denom) % 10n === 5n;
}

export interface ParsedDecimal {
  /** 小数点以下2桁分に正規化した整数値（例: "1.28"→128・"1.2"→120・"1"→100）。 */
  hundredths: bigint;
  /** 元のテキストの小数点以下の桁数（0なら整数表記）。 */
  decimalDigits: number;
}

/**
 * 小数リテラルの**テキスト**をそのまま整数へ変換する（`parseFloat`を経由しない）。
 * ソースコード上のリテラル（例: `finalRate: 0.815`）は`.815`の3桁のように、本来
 * 想定していない桁数で書かれていること自体が異常データの兆候であり、`decimalDigits`で
 * 検出できるようにする。
 */
export function parseDecimalToHundredths(text: string): ParsedDecimal {
  if (!text.includes('.')) {
    return { hundredths: BigInt(text) * 100n, decimalDigits: 0 };
  }
  const [intPart, fracPart] = text.split('.');
  const paddedOrTruncated = (fracPart + '00').slice(0, 2);
  const sign = intPart.startsWith('-') ? -1n : 1n;
  const absInt = BigInt(intPart.replace('-', ''));
  const hundredths = sign * (absInt * 100n + BigInt(paddedOrTruncated));
  return { hundredths, decimalDigits: fracPart.length };
}

export type RateConvention = 'round2' | 'round1' | 'trunc2';

export interface FinalRateClassification {
  round2Hundredths: bigint;
  round1Hundredths: bigint;
  trunc2Hundredths: bigint;
  /** storedHundredthsが一致した丸め方式（複数一致もあり得る・空なら既知の3方式のいずれにも一致しない）。 */
  matches: RateConvention[];
  isBoundary: boolean;
}

/** quota/applicantsから期待される3方式の値を計算し、storedHundredthsがどれと一致するか判定する。 */
export function classifyStoredRate(quota: number, applicants: number, storedHundredths: bigint): FinalRateClassification {
  const round2Hundredths = roundHalfUpScaled(applicants, quota, 2);
  const trunc2Hundredths = truncScaled(applicants, quota, 2);
  const round1Hundredths = roundHalfUpScaled(applicants, quota, 1) * 10n;

  const matches: RateConvention[] = [];
  if (storedHundredths === round2Hundredths) matches.push('round2');
  if (storedHundredths === round1Hundredths) matches.push('round1');
  if (storedHundredths === trunc2Hundredths) matches.push('trunc2');

  return {
    round2Hundredths,
    round1Hundredths,
    trunc2Hundredths,
    matches,
    isBoundary: isRoundingBoundary(applicants, quota, 2),
  };
}

export interface ExtractedRateRecord {
  schoolName: string;
  quota: number;
  applicants: number;
  storedRateText: string;
}

/**
 * `src/data/competition-rates/<pref>.ts`のソーステキストから`{schoolName, quota,
 * finalApplicants, finalRate}`を含むレコードオブジェクトを機械抽出する（単純な正規表現・
 * ASTパーサではない）。`officialSubtotals`（`label`/`schoolCount`を持つ集計行）は
 * `schoolName:`を持たないため自然に除外される。列の並び順・`area`/`fiscalYear`/
 * `sourceIndex`等の追加フィールドの有無に依存しない（`[^{}]*`で任意個の他フィールドを許容）。
 */
export function extractRateRecordsFromSource(sourceText: string): ExtractedRateRecord[] {
  const recordRe = /\{[^{}]*schoolName:\s*'([^']*)'[^{}]*quota:\s*(-?\d+)[^{}]*finalApplicants:\s*(-?\d+)[^{}]*finalRate:\s*(-?\d+(?:\.\d+)?)[^{}]*\}/g;
  const records: ExtractedRateRecord[] = [];
  let m: RegExpExecArray | null;
  while ((m = recordRe.exec(sourceText)) !== null) {
    records.push({
      schoolName: m[1],
      quota: parseInt(m[2], 10),
      applicants: parseInt(m[3], 10),
      storedRateText: m[4],
    });
  }
  return records;
}
