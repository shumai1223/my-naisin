/**
 * 内申点白書2026(X-1/X-30)共通データ層の契約テスト。REPORT_2026_ROWSはprefectures.tsからの
 * 機械的な派生のみ(捏造ゼロ)だが、導出計算(practicalSkew/grade3WeightPct)とrankOf()の
 * 同値同順位ロジックは実際のコードであり、テストが1件も無かった。
 */
import { PREFECTURES } from '@/lib/prefectures';
import {
  REPORT_2026_ROWS,
  REPORT_2026_NO_SKEW_COUNT,
  REPORT_2026_GRADE3_ONLY,
  rankOf,
  getReport2026Row,
} from '../report-2026-data';

describe('REPORT_2026_ROWS', () => {
  it('47都道府県すべてを含む', () => {
    expect(REPORT_2026_ROWS).toHaveLength(47);
    expect(REPORT_2026_ROWS).toHaveLength(PREFECTURES.length);
  });

  it('都道府県コードに重複が無い', () => {
    const codes = REPORT_2026_ROWS.map((r) => r.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('practicalSkew降順・同値はname(日本語locale)昇順でソートされている', () => {
    for (let i = 1; i < REPORT_2026_ROWS.length; i++) {
      const prev = REPORT_2026_ROWS[i - 1];
      const curr = REPORT_2026_ROWS[i];
      if (prev.practicalSkew !== curr.practicalSkew) {
        expect(prev.practicalSkew).toBeGreaterThan(curr.practicalSkew);
      } else {
        expect(prev.name.localeCompare(curr.name, 'ja')).toBeLessThanOrEqual(0);
      }
    }
  });

  it('grade3WeightPctは0〜100の範囲に収まる', () => {
    for (const row of REPORT_2026_ROWS) {
      expect(row.grade3WeightPct).toBeGreaterThanOrEqual(0);
      expect(row.grade3WeightPct).toBeLessThanOrEqual(100);
    }
  });

  it('maxScore/practicalSkew/gradeCountは全て正の値', () => {
    for (const row of REPORT_2026_ROWS) {
      expect(row.maxScore).toBeGreaterThan(0);
      expect(row.practicalSkew).toBeGreaterThan(0);
      expect(row.gradeCount).toBeGreaterThan(0);
    }
  });
});

describe('REPORT_2026_NO_SKEW_COUNT / REPORT_2026_GRADE3_ONLY', () => {
  it('NO_SKEW_COUNTは実際にpracticalSkew===1の件数と一致する', () => {
    const actual = REPORT_2026_ROWS.filter((r) => r.practicalSkew === 1).length;
    expect(REPORT_2026_NO_SKEW_COUNT).toBe(actual);
  });

  it('GRADE3_ONLYは実際にgrade3WeightPct===100の行と一致する', () => {
    const actual = REPORT_2026_ROWS.filter((r) => r.grade3WeightPct === 100);
    expect(REPORT_2026_GRADE3_ONLY.map((r) => r.code).sort()).toEqual(actual.map((r) => r.code).sort());
  });
});

describe('rankOf', () => {
  it('最大値を持つ県の順位は1', () => {
    const maxRow = [...REPORT_2026_ROWS].sort((a, b) => b.maxScore - a.maxScore)[0];
    expect(rankOf(maxRow.code, 'maxScore')).toBe(1);
  });

  it('同値は同順位になる(1,1,3方式)', () => {
    // practicalSkew===1(スキューなし)の県群は全員同順位のはず
    const tied = REPORT_2026_ROWS.filter((r) => r.practicalSkew === 1);
    if (tied.length >= 2) {
      const ranks = tied.map((r) => rankOf(r.code, 'practicalSkew'));
      expect(new Set(ranks).size).toBe(1);
    }
  });

  it('未知の県コードはエラーを投げる', () => {
    expect(() => rankOf('not-a-real-prefecture', 'maxScore')).toThrow();
  });

  it('順位は1から47の範囲に収まる', () => {
    for (const row of REPORT_2026_ROWS) {
      const rank = rankOf(row.code, 'maxScore');
      expect(rank).toBeGreaterThanOrEqual(1);
      expect(rank).toBeLessThanOrEqual(47);
    }
  });
});

describe('getReport2026Row', () => {
  it('存在する県コードで行を取得できる', () => {
    const first = REPORT_2026_ROWS[0];
    expect(getReport2026Row(first.code)).toEqual(first);
  });

  it('存在しない県コードはundefined', () => {
    expect(getReport2026Row('not-a-real-prefecture')).toBeUndefined();
  });
});
