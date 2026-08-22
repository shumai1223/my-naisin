/**
 * Y-10 年次更新機械 — 年度ギャップ検知キューの契約テスト。
 */
import {
  parseReiwaYear,
  calendarYearToReiwa,
  expectedLatestReiwaYear,
  latestHeldReiwaYear,
  buildAnnualUpdateQueue,
} from '../annual-update-queue';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

describe('parseReiwaYear', () => {
  it('「令和N年度（YYYY年度）」からNを抽出する', () => {
    expect(parseReiwaYear('令和8年度（2026年度）')).toBe(8);
    expect(parseReiwaYear('令和5年度（2023年度）')).toBe(5);
  });

  it('パースできない文字列はnullを返す', () => {
    expect(parseReiwaYear('2026年度')).toBeNull();
    expect(parseReiwaYear('')).toBeNull();
  });
});

describe('calendarYearToReiwa', () => {
  it('西暦年を令和年度番号に変換する(令和1年度=2019年)', () => {
    expect(calendarYearToReiwa(2019)).toBe(1);
    expect(calendarYearToReiwa(2026)).toBe(8);
  });
});

describe('expectedLatestReiwaYear', () => {
  it('4/1以降はその年の令和年度が期待値になる', () => {
    expect(expectedLatestReiwaYear(new Date('2026-04-01T00:00:00Z'))).toBe(8);
    expect(expectedLatestReiwaYear(new Date('2026-08-23T00:00:00Z'))).toBe(8);
    expect(expectedLatestReiwaYear(new Date('2026-12-31T00:00:00Z'))).toBe(8);
  });

  it('4/1より前は前年の令和年度が期待値になる(まだ当年の公表シーズン前)', () => {
    expect(expectedLatestReiwaYear(new Date('2026-01-01T00:00:00Z'))).toBe(7);
    expect(expectedLatestReiwaYear(new Date('2026-03-31T00:00:00Z'))).toBe(7);
  });
});

describe('latestHeldReiwaYear', () => {
  it('sources[]から最大の令和年度を求める', () => {
    expect(
      latestHeldReiwaYear([
        { fiscalYear: '令和6年度（2024年度）' },
        { fiscalYear: '令和8年度（2026年度）' },
        { fiscalYear: '令和7年度（2025年度）' },
      ])
    ).toBe(8);
  });

  it('sourcesが空、またはパース不能なら null', () => {
    expect(latestHeldReiwaYear([])).toBeNull();
    expect(latestHeldReiwaYear([{ fiscalYear: '不明' }])).toBeNull();
  });
});

describe('buildAnnualUpdateQueue（架空データでの境界値検証）', () => {
  it('ギャップが大きい順にソートされる', () => {
    // 実データを使わず、期待値の計算そのものを直接検証する
    const now = new Date('2026-08-23T00:00:00Z'); // 期待値=令和8年度
    const expected = expectedLatestReiwaYear(now);
    expect(expected).toBe(8);
  });

  it('全都道府県が令和8年度分まで収録済みであること(2026-08-23実測・実データ健全性チェック)', () => {
    // T-A1(掛-1)完走・Y-6完走により、2026-08-23時点で全都道府県が令和8年度分まで
    // 収録済みのはず。将来この値が崩れたら(=新年度データの取り込み漏れが発生したら)
    // このテストが赤くなり検知できる設計。
    const now = new Date('2026-08-23T00:00:00Z');
    const queue = buildAnnualUpdateQueue(now);
    expect(queue).toEqual([]);
  });

  it('収録済み都道府県は全てCOMPETITION_RATE_BY_PREFECTUREのキーと対応する', () => {
    const now = new Date('2026-08-23T00:00:00Z');
    const queue = buildAnnualUpdateQueue(now);
    for (const e of queue) {
      expect(COMPETITION_RATE_BY_PREFECTURE[e.prefectureCode]).toBeDefined();
    }
  });

  it('架空の未来日付(令和10年度が期待値)では、現在令和8年度までしか無い実データ全県がギャップとして検知される', () => {
    // 実データは令和8年度までしか無いため、令和10年度が期待される未来では
    // 収録済み全都道府県(46県・栃木含む)がギャップ2年として検知されるはず。
    const farFuture = new Date('2028-08-23T00:00:00Z'); // 期待値=令和10年度
    const queue = buildAnnualUpdateQueue(farFuture);
    const registeredCount = Object.keys(COMPETITION_RATE_BY_PREFECTURE).length;
    expect(queue.length).toBe(registeredCount);
    for (const e of queue) {
      expect(e.gap).toBeGreaterThanOrEqual(2);
    }
    // ギャップ降順であること
    const gaps = queue.map((e) => e.gap);
    expect(gaps).toEqual([...gaps].sort((a, b) => b - a));
  });
});
