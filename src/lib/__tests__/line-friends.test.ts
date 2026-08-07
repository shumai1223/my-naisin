import fs from 'node:fs';
import path from 'node:path';
import {
  isStale,
  latestEntry,
  sortedEntries,
  velocityOverDays,
  weeklyPace,
  type LineFriendsFile,
} from '../line-friends';

const FIXTURE: LineFriendsFile = {
  entries: [
    { date: '2026-07-31', friends: 47, active: 47, blocked: 0 },
    { date: '2026-08-07', friends: 55, active: 55, blocked: 0 },
    { date: '2026-08-03', friends: 52, active: 52, blocked: 0 }, // 意図的に順不同
  ],
};

describe('sortedEntries / latestEntry', () => {
  it('入力順に依存せず日付昇順に整列する', () => {
    expect(sortedEntries(FIXTURE).map((e) => e.date)).toEqual(['2026-07-31', '2026-08-03', '2026-08-07']);
  });
  it('最新は日付順の末尾（配列の末尾ではない）', () => {
    expect(latestEntry(FIXTURE)?.friends).toBe(55);
  });
  it('記録が空ならnull', () => {
    expect(latestEntry({ entries: [] })).toBeNull();
  });
});

describe('velocityOverDays', () => {
  it('7日窓は cutoff以前の最新記録を起点にする', () => {
    const v = velocityOverDays(FIXTURE, 7);
    expect(v).not.toBeNull();
    expect(v!.fromDate).toBe('2026-07-31');
    expect(v!.toDate).toBe('2026-08-07');
    expect(v!.gained).toBe(8);
    expect(v!.actualDays).toBe(7);
  });

  it('★欠落日を0増加と誤認しない（実在する2点の差だけを返す）', () => {
    // 8/1〜8/6の記録が無いケース。7日窓でも 7/31→8/7 の実差 +8 を返す。
    const sparse: LineFriendsFile = {
      entries: [
        { date: '2026-07-31', friends: 47, active: 47, blocked: 0 },
        { date: '2026-08-07', friends: 55, active: 55, blocked: 0 },
      ],
    };
    const v = velocityOverDays(sparse, 3);
    expect(v!.gained).toBe(8);
    expect(v!.actualDays).toBe(7); // 3日窓を指定しても実在点は7日離れている＝正直に7を返す
  });

  it('記録が1件以下ならnull（推定で埋めない）', () => {
    expect(velocityOverDays({ entries: [{ date: '2026-08-07', friends: 55, active: 55, blocked: 0 }] }, 7)).toBeNull();
  });
});

describe('weeklyPace', () => {
  it('週あたりに正規化する', () => {
    expect(weeklyPace(FIXTURE, 7)).toBe(8); // +8/7日 → 8.0/週
  });
  it('実日数が窓とずれても週換算する', () => {
    const f: LineFriendsFile = {
      entries: [
        { date: '2026-07-24', friends: 38, active: 38, blocked: 0 },
        { date: '2026-08-07', friends: 55, active: 55, blocked: 0 },
      ],
    };
    expect(weeklyPace(f, 14)).toBe(8.5); // +17/14日 = 1.214/日 → 8.5/週
  });
});

describe('isStale（👤の手動転記が止まっていないか）', () => {
  it('7日以上更新が無ければstale', () => {
    expect(isStale(FIXTURE, '2026-08-14')).toBe(true);
  });
  it('直近に更新があればstaleでない', () => {
    expect(isStale(FIXTURE, '2026-08-09')).toBe(false);
  });
  it('記録が空ならstale扱い', () => {
    expect(isStale({ entries: [] }, '2026-08-07')).toBe(true);
  });
});

describe('data/line-friends.json（実データの整合性）', () => {
  const raw = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'data', 'line-friends.json'), 'utf8')
  ) as LineFriendsFile & { entries: { date: string; friends: number; active: number; blocked: number }[] };

  it('日付が重複していない', () => {
    const dates = raw.entries.map((e) => e.date);
    expect(new Set(dates).size).toBe(dates.length);
  });
  it('友だち数は単調非減少（LINEの累計友だち数は減らない）', () => {
    const sorted = sortedEntries(raw);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].friends).toBeGreaterThanOrEqual(sorted[i - 1].friends);
    }
  });
  it('active + blocked = friends', () => {
    for (const e of raw.entries) {
      expect(e.active + e.blocked).toBe(e.friends);
    }
  });
  it('日付形式がYYYY-MM-DD', () => {
    for (const e of raw.entries) {
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
