import {
  canEditRoute,
  findRoutesDueForMeasurement,
  evaluateCtrChangeEffect,
  latestChangeForRoute,
  type CtrChangeLogEntry,
} from '@/lib/ctr-improvement-log';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('latestChangeForRoute', () => {
  it('複数エントリがあれば最新日のものを返す', () => {
    const log: CtrChangeLogEntry[] = [
      { route: '/hensachi', changedAt: '2026-06-01' },
      { route: '/hensachi', changedAt: '2026-07-01' },
    ];
    expect(latestChangeForRoute('/hensachi', log)?.changedAt).toBe('2026-07-01');
  });

  it('該当ルートが無ければundefined', () => {
    expect(latestChangeForRoute('/none', [])).toBeUndefined();
  });
});

describe('canEditRoute（3週間隔ガード）', () => {
  it('変更履歴が無いルートは常に編集可能', () => {
    expect(canEditRoute('/new-page', [], D('2026-07-08'))).toBe(true);
  });

  it('3週間未満はfalse', () => {
    const log: CtrChangeLogEntry[] = [{ route: '/hensachi', changedAt: '2026-07-01' }];
    expect(canEditRoute('/hensachi', log, D('2026-07-08'))).toBe(false);
  });

  it('3週間以上経過していればtrue', () => {
    const log: CtrChangeLogEntry[] = [{ route: '/hensachi', changedAt: '2026-06-01' }];
    expect(canEditRoute('/hensachi', log, D('2026-07-08'))).toBe(true);
  });

  it('他ルートの変更履歴には影響されない', () => {
    const log: CtrChangeLogEntry[] = [{ route: '/other', changedAt: '2026-07-07' }];
    expect(canEditRoute('/hensachi', log, D('2026-07-08'))).toBe(true);
  });
});

describe('findRoutesDueForMeasurement', () => {
  it('3週間経過し未測定のエントリを返す', () => {
    const log: CtrChangeLogEntry[] = [
      { route: '/a', changedAt: '2026-06-01' }, // 経過済み・未測定
      { route: '/b', changedAt: '2026-07-05' }, // 未経過
      { route: '/c', changedAt: '2026-06-01', measuredAt: '2026-06-25' }, // 経過済みだが測定済み
    ];
    const due = findRoutesDueForMeasurement(log, D('2026-07-08'));
    expect(due.map((e) => e.route)).toEqual(['/a']);
  });
});

describe('evaluateCtrChangeEffect', () => {
  it('相対10%以上の改善はimproved', () => {
    const v = evaluateCtrChangeEffect(0.02, 0.03);
    expect(v.verdict).toBe('improved');
    expect(v.recommendation).toContain('維持');
  });

  it('相対10%以上の悪化はworseでリバート提案', () => {
    const v = evaluateCtrChangeEffect(0.03, 0.02);
    expect(v.verdict).toBe('worse');
    expect(v.recommendation).toContain('リバート');
  });

  it('誤差範囲(10%未満)はflat', () => {
    const v = evaluateCtrChangeEffect(0.02, 0.021);
    expect(v.verdict).toBe('flat');
  });

  it('変更前CTRが0でも例外を出さない', () => {
    expect(() => evaluateCtrChangeEffect(0, 0.01)).not.toThrow();
    expect(evaluateCtrChangeEffect(0, 0).verdict).toBe('flat');
  });
});
