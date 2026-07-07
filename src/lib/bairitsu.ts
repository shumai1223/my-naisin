/**
 * 高校入試の「倍率」まわりの決定論ライブラリ（B-6）。
 *
 * 学校別の実際の倍率（志願者数・合格者数）は年度・学校ごとに変動し、県教委が発表する一次情報
 * でしか正確な値が分からない（捏造ゼロ方針）。このファイルは「倍率とは何か」を計算する
 * 純粋な比率計算のみを持ち、特定の学校・年度の倍率データそのものは持たない。
 */

/** 志願倍率 ＝ 志願者数 ÷ 募集人員。無効入力（募集人員<=0等）は null。 */
export function calcApplicationRatio(applicants: number, capacity: number): number | null {
  if (!Number.isFinite(applicants) || !Number.isFinite(capacity) || capacity <= 0 || applicants < 0) {
    return null;
  }
  return applicants / capacity;
}

/** 実質倍率 ＝ 受験者数 ÷ 合格者数。無効入力（合格者数<=0等）は null。 */
export function calcActualRatio(testTakers: number, passers: number): number | null {
  if (!Number.isFinite(testTakers) || !Number.isFinite(passers) || passers <= 0 || testTakers < 0) {
    return null;
  }
  return testTakers / passers;
}

/** 倍率を小数第2位で丸める（表示用）。 */
export function roundRatio(ratio: number): number {
  return Math.round(ratio * 100) / 100;
}
