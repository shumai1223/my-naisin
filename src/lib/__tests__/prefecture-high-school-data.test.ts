/**
 * prefecture-high-school-data.ts（都道府県別 高校別ボーダーライン一覧）の不変条件ゲート。
 *
 * 2026-08-08 Cowork実地監査で、宮崎(135点満点)にavgNaishin 425等、県の満点を大きく超える
 * 数値が3,826件のテストが全greenのまま混入していたことが発覚した。ロジックのテストはあっても
 * 「その値が取りうる範囲」を検証するデータの不変条件テストが無かったことが原因。
 * このファイルはその再発防止として、topHighSchools の avgNaishin が
 * ①当該県のprefectures.ts側maxScore（simplifiedCalc県はactualMaxScore・variants併存県は
 *   全variantの最大値）を超えない
 * ②オール3相当値の85%（simplifiedCalc県は同じ比率でスケール）を下回らない
 * ③null の場合は理由（avgNaishinUnavailableReason）が必ず添えられている
 * ことを機械的に保証する。
 */

import { PREFECTURE_HIGH_SCHOOL_DATA } from '../prefecture-high-school-data';
import { getPrefectureByCode } from '../prefectures';
import { calculateMaxScore, calculateTotalScore } from '../utils';
import { DEFAULT_SCORES } from '../constants';

describe('PREFECTURE_HIGH_SCHOOL_DATA（高校別ボーダーライン一覧）', () => {
  test('全キーがprefectures.tsに対応する県設定を持つ', () => {
    const missing = Object.keys(PREFECTURE_HIGH_SCHOOL_DATA).filter((code) => !getPrefectureByCode(code));
    expect(missing).toEqual([]);
  });

  test('avgNaishinがnull/未設定の行には理由(avgNaishinUnavailableReason)が必ず添えられている', () => {
    const violations: string[] = [];
    for (const [prefCode, data] of Object.entries(PREFECTURE_HIGH_SCHOOL_DATA)) {
      for (const school of data.topHighSchools) {
        if ((school.avgNaishin === null || school.avgNaishin === undefined) && !school.avgNaishinUnavailableReason) {
          violations.push(`${prefCode}(${data.name}) ${school.name}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // simplifiedCalc県（岩手・岡山・香川・大分）は、このツールの内部計算満点(maxScore)と
  // 実際の選抜で使われる満点(actualMaxScore)が異なる。ランキング表の数値は実選抜側の
  // スケールで書かれている可能性が高いため、actualMaxScoreがあればそちらを優先して判定する。
  function effectiveRange(prefCode: string) {
    const prefecture = getPrefectureByCode(prefCode);
    if (!prefecture) return null;
    const variantCodes = prefecture.variants && prefecture.variants.length > 0
      ? prefecture.variants.map((v) => v.code)
      : [undefined];
    const internalCeilings = variantCodes.map((vc) => calculateMaxScore(prefCode, false, vc));
    const internalFloors = variantCodes.map((vc) => calculateTotalScore(DEFAULT_SCORES, prefCode, false, vc));
    const internalCeiling = Math.max(...internalCeilings);
    const internalFloor = Math.min(...internalFloors);

    if (prefecture.simplifiedCalc && typeof prefecture.actualMaxScore === 'number') {
      const ratio = prefecture.actualMaxScore / prefecture.maxScore;
      return { ceiling: prefecture.actualMaxScore, floor: internalFloor * ratio };
    }
    return { ceiling: internalCeiling, floor: internalFloor };
  }

  test('avgNaishinは満点を超えない（他県データの混入・単位ミスの検出）', () => {
    const violations: string[] = [];
    for (const [prefCode, data] of Object.entries(PREFECTURE_HIGH_SCHOOL_DATA)) {
      const range = effectiveRange(prefCode);
      if (!range) continue;

      for (const school of data.topHighSchools) {
        if (typeof school.avgNaishin === 'number' && school.avgNaishin > range.ceiling) {
          violations.push(
            `${prefCode}(${data.name}) ${school.name}: avgNaishin=${school.avgNaishin} > 満点${range.ceiling}`,
          );
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // 下限は「オール3」の理論値そのものではなく、その85%を採用する（15%の許容幅）。
  // 理論値ちょうどを下限にすると、下位ランクの実在校（オール3をわずかに下回る現実的な
  // ボーダー）まで誤検知してしまう一方、2026-08-08監査で見つかった実際の事故（愛知42
  // ＝理論値の77.8%・香川129＝理論値の55.1%）は85%ラインを大きく下回るため引き続き検出できる。
  const FLOOR_TOLERANCE = 0.85;

  test('avgNaishinはオール3相当値の85%を下回らない（逆方向の尺度不一致の検出）', () => {
    const violations: string[] = [];
    for (const [prefCode, data] of Object.entries(PREFECTURE_HIGH_SCHOOL_DATA)) {
      const range = effectiveRange(prefCode);
      if (!range) continue;
      const floorWithTolerance = range.floor * FLOOR_TOLERANCE;

      for (const school of data.topHighSchools) {
        if (typeof school.avgNaishin === 'number' && school.avgNaishin < floorWithTolerance) {
          violations.push(
            `${prefCode}(${data.name}) ${school.name}: avgNaishin=${school.avgNaishin} < オール3相当×85%=${floorWithTolerance.toFixed(1)}`,
          );
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
