import {
  buildNationalComparison,
  summarizeDistribution,
  toCsv,
} from '../naishin-national-comparison';
import { PREFECTURES } from '../prefectures';

describe('buildNationalComparison（T-N4-1 47県横断比較・不変条件）', () => {
  const rows = buildNationalComparison();

  test('47県分の行が生成される', () => {
    expect(rows.length).toBe(47);
  });

  test('practicalToCoreRatioはpracticalMultiplier/coreMultiplierと一致する', () => {
    for (const row of rows) {
      const expected = Math.round((row.practicalMultiplier / row.coreMultiplier) * 100) / 100;
      expect(row.practicalToCoreRatio).toBe(expected);
    }
  });

  test('reverseCalcを持つ県のみnaishinToExamRatioが非null', () => {
    const withRatio = rows.filter((r) => r.naishinToExamRatio !== null);
    const expectedCount = PREFECTURES.filter((p) => !!p.reverseCalc).length;
    expect(withRatio.length).toBe(expectedCount);
  });

  test('全県に出典URLが付いている', () => {
    for (const row of rows) expect(row.sourceUrl).toBeTruthy();
  });
});

describe('summarizeDistribution', () => {
  const rows = buildNationalComparison();
  const summary = summarizeDistribution(rows);

  test('totalPrefectures=47・scaleDistributionの合計が47と一致する', () => {
    expect(summary.totalPrefectures).toBe(47);
    expect(summary.scaleDistribution.fivePoint + summary.scaleDistribution.tenPoint).toBe(47);
  });

  test('targetGradesDistributionの合計件数が47と一致する', () => {
    const sum = Object.values(summary.targetGradesDistribution).reduce((a, b) => a + b, 0);
    expect(sum).toBe(47);
  });

  test('maxScoreRangeのmin<=median<=max', () => {
    expect(summary.maxScoreRange.min).toBeLessThanOrEqual(summary.maxScoreRange.median);
    expect(summary.maxScoreRange.median).toBeLessThanOrEqual(summary.maxScoreRange.max);
  });
});

describe('toCsv', () => {
  const rows = buildNationalComparison();
  const csv = toCsv(rows);

  test('ヘッダー行+47データ行=48行になる', () => {
    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(48);
  });

  test('全県のcodeがCSVに含まれる', () => {
    for (const p of PREFECTURES) {
      expect(csv).toContain(`${p.code},`);
    }
  });
});

describe('Y-0憲法/N4-1の禁止表現チェック（優劣の評価を書かない）', () => {
  const FORBIDDEN_EVALUATIVE_WORDS = ['公平', '不公平', '優れ', '劣', 'べきだ', '望ましい'];

  test('生成されたCSV(研究者向け出力)に優劣評価語が含まれない', () => {
    const csv = toCsv(buildNationalComparison());
    for (const word of FORBIDDEN_EVALUATIVE_WORDS) {
      expect(csv.includes(word)).toBe(false);
    }
  });
});
