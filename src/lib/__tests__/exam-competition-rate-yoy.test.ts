import {
  computeSchoolRateYoy,
  computeAllSchoolRateYoy,
  topMovers,
  extractWesternYear,
} from '../exam-competition-rate-yoy';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import type { PrefectureCompetitionRateFile } from '../competition-rate';

const ALL_FILES = Object.values(COMPETITION_RATE_BY_PREFECTURE).filter(
  (f): f is PrefectureCompetitionRateFile => !!f
);

describe('extractWesternYear', () => {
  test('令和表記から西暦4桁を取り出す', () => {
    expect(extractWesternYear('令和8年度（2026年度）')).toBe(2026);
    expect(extractWesternYear('令和5年度（2023年度）')).toBe(2023);
  });

  test('4桁が見つからなければnull', () => {
    expect(extractWesternYear('不明')).toBeNull();
  });
});

describe('computeSchoolRateYoy（T-N1-4 学校別倍率の前年比較・不変条件）', () => {
  test('愛知県: 最新2年度が揃っている校・学科のみを比較対象にする(1年度分しかない校は除外)', () => {
    const aichi = COMPETITION_RATE_BY_PREFECTURE['aichi'];
    expect(aichi).toBeDefined();
    const entries = computeSchoolRateYoy(aichi!);
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      expect(e.currentFiscalYear).not.toBe(e.previousFiscalYear);
      expect(extractWesternYear(e.currentFiscalYear)!).toBeGreaterThan(extractWesternYear(e.previousFiscalYear)!);
    }
  });

  test('directionはrateDeltaの符号と矛盾しない(不変条件)', () => {
    for (const file of ALL_FILES) {
      const entries = computeSchoolRateYoy(file);
      for (const e of entries) {
        if (e.rateDelta > 0) expect(e.direction).toBe('up');
        else if (e.rateDelta < 0) expect(e.direction).toBe('down');
        else expect(e.direction).toBe('unchanged');
      }
    }
  });

  test('rateDeltaはcurrentRate-previousRateと一致する(丸め誤差0.01以内)', () => {
    for (const file of ALL_FILES) {
      for (const e of computeSchoolRateYoy(file)) {
        expect(Math.abs(e.rateDelta - (e.currentRate - e.previousRate))).toBeLessThan(0.011);
      }
    }
  });

  test('1年度分しか収録が無い県(saga/oita)は比較対象0件を許容する(2値化しない・推測で埋めない)', () => {
    const saga = COMPETITION_RATE_BY_PREFECTURE['saga'];
    if (saga) {
      // 2年度あれば比較できる可能性はあるが、収録が1件しかない校・学科は混ざっていても除外されるだけで例外は起きない
      expect(() => computeSchoolRateYoy(saga)).not.toThrow();
    }
  });

  test('47県すべてでエラーなく計算できる(型不整合の早期検知)', () => {
    for (const file of ALL_FILES) {
      expect(() => computeSchoolRateYoy(file)).not.toThrow();
    }
  });
});

describe('computeAllSchoolRateYoy / topMovers', () => {
  const allEntries = computeAllSchoolRateYoy(ALL_FILES);

  test('全県集計は各県の集計を単純に連結したものと件数が一致する', () => {
    const sum = ALL_FILES.reduce((acc, f) => acc + computeSchoolRateYoy(f).length, 0);
    expect(allEntries.length).toBe(sum);
  });

  test('topMoversはup/downそれぞれ指定件数以内で、rateDeltaの符号がdirectionと一致する', () => {
    const upTop = topMovers(allEntries, 'aichi', 'up', 5);
    const downTop = topMovers(allEntries, 'aichi', 'down', 5);
    expect(upTop.length).toBeLessThanOrEqual(5);
    expect(downTop.length).toBeLessThanOrEqual(5);
    for (const e of upTop) expect(e.rateDelta).toBeGreaterThan(0);
    for (const e of downTop) expect(e.rateDelta).toBeLessThan(0);
  });

  test('topMovers(up)はrateDelta降順、topMovers(down)はrateDelta昇順(最も下がった順)', () => {
    const upTop = topMovers(allEntries, 'aichi', 'up', 10);
    for (let i = 1; i < upTop.length; i++) {
      expect(upTop[i - 1].rateDelta).toBeGreaterThanOrEqual(upTop[i].rateDelta);
    }
    const downTop = topMovers(allEntries, 'aichi', 'down', 10);
    for (let i = 1; i < downTop.length; i++) {
      expect(downTop[i - 1].rateDelta).toBeLessThanOrEqual(downTop[i].rateDelta);
    }
  });

  test('存在しない県コードを渡しても空配列を返す(例外にしない)', () => {
    expect(topMovers(allEntries, 'not-a-real-prefecture', 'up', 5)).toEqual([]);
  });
});
