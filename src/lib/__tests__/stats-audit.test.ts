/**
 * 統計分布監査（ZZ-1e）の純粋関数テスト。
 */
import {
  dateOnly,
  groupCountsByDate,
  detectBurstDays,
  detectExtremeValueShare,
  runDistributionAudit,
  formatDistributionAuditReport,
  type StatsSubmissionRecord,
} from '../stats-audit';

describe('dateOnly', () => {
  it('ISO日時から日付部分だけを取り出す', () => {
    expect(dateOnly('2026-07-20T12:34:56.000Z')).toBe('2026-07-20');
    expect(dateOnly('2026-07-20 12:34:56')).toBe('2026-07-20');
  });
});

describe('groupCountsByDate', () => {
  it('日付ごとの件数を昇順で集計する', () => {
    const records: StatsSubmissionRecord[] = [
      { metric: 'naishin', value: 40, created_at: '2026-07-02T00:00:00Z' },
      { metric: 'naishin', value: 41, created_at: '2026-07-01T00:00:00Z' },
      { metric: 'naishin', value: 42, created_at: '2026-07-01T05:00:00Z' },
    ];
    expect(groupCountsByDate(records)).toEqual([
      { date: '2026-07-01', count: 2 },
      { date: '2026-07-02', count: 1 },
    ]);
  });

  it('空配列は空配列', () => {
    expect(groupCountsByDate([])).toEqual([]);
  });
});

describe('detectBurstDays（仕様書§3・z>4基準）', () => {
  it('ベースライン日数が不足する先頭の日は判定不能(z=null・flagged=false)', () => {
    const daily = [
      { date: '2026-07-01', count: 5 },
      { date: '2026-07-02', count: 5 },
    ];
    const result = detectBurstDays(daily, { minBaselineDays: 7 });
    expect(result.every((f) => f.z === null && f.flagged === false)).toBe(true);
  });

  it('平常時と比べて突出した日をflaggedにする', () => {
    // ベースライン7日は全て count=5（分散0）→ 8日目に count=5（平常）は非flagged、
    // その後 count=50（大幅超過）はflaggedになる。
    const daily = Array.from({ length: 7 }, (_, i) => ({ date: `2026-07-0${i + 1}`, count: 5 }));
    daily.push({ date: '2026-07-08', count: 5 });
    daily.push({ date: '2026-07-09', count: 50 });
    const result = detectBurstDays(daily, { minBaselineDays: 7, baselineWindowDays: 7 });
    const day8 = result.find((f) => f.date === '2026-07-08')!;
    const day9 = result.find((f) => f.date === '2026-07-09')!;
    expect(day8.flagged).toBe(false);
    expect(day9.flagged).toBe(true);
  });

  it('分散0のベースラインで同数が続く場合はflaggedにしない', () => {
    const daily = Array.from({ length: 10 }, (_, i) => ({ date: `d${i}`, count: 5 }));
    const result = detectBurstDays(daily, { minBaselineDays: 7, baselineWindowDays: 7 });
    expect(result.every((f) => f.flagged === false)).toBe(true);
  });
});

describe('detectExtremeValueShare', () => {
  it('サンプル不足(minSample未満)は自動でflaggedにしない', () => {
    const finding = detectExtremeValueShare('hensachi', [90, 90, 90], { minSample: 20 });
    expect(finding.count).toBe(3);
    expect(finding.atCeilingShare).toBeCloseTo(1);
    expect(finding.flagged).toBe(false);
  });

  it('サンプル十分かつ上限一致が閾値を超えるとflagされる', () => {
    const values = Array.from({ length: 25 }, () => 90); // hensachiのmax=90
    const finding = detectExtremeValueShare('hensachi', values, { minSample: 20, shareThreshold: 0.5 });
    expect(finding.flagged).toBe(true);
    expect(finding.atCeilingShare).toBe(1);
  });

  it('通常の分布はflagされない', () => {
    const values = [50, 55, 60, 45, 65, 52, 58, 48, 62, 51, 53, 47, 59, 56, 44, 61, 49, 57, 46, 63];
    const finding = detectExtremeValueShare('hensachi', values, { minSample: 20 });
    expect(finding.flagged).toBe(false);
  });

  it('件数0はflagged=falseでcount=0', () => {
    const finding = detectExtremeValueShare('naishin', []);
    expect(finding.count).toBe(0);
    expect(finding.flagged).toBe(false);
  });
});

describe('runDistributionAudit + formatDistributionAuditReport（統合）', () => {
  it('異常なしのケースはhasFlags=falseで正常メッセージを出す', () => {
    const records: StatsSubmissionRecord[] = [
      { metric: 'naishin', value: 40, created_at: '2026-07-01T00:00:00Z' },
      { metric: 'naishin', value: 42, created_at: '2026-07-02T00:00:00Z' },
    ];
    const report = runDistributionAudit(records, ['naishin', 'hensachi', 'total-score'], '2026-07-24T00:00:00.000Z');
    expect(report.hasFlags).toBe(false);
    expect(report.totalRecords).toBe(2);
    const text = formatDistributionAuditReport(report);
    expect(text).toContain('統計分布監査');
    expect(text).toContain('異常な急増日は検知されませんでした');
    expect(text).toContain('自動処理が必要な異常は検知されませんでした');
  });

  it('極値集中が閾値を超えるケースはhasFlags=trueで🚨を含む', () => {
    const records: StatsSubmissionRecord[] = Array.from({ length: 25 }, (_, i) => ({
      metric: 'hensachi' as const,
      value: 90,
      created_at: `2026-07-0${(i % 9) + 1}T00:00:00Z`,
    }));
    const report = runDistributionAudit(records, ['naishin', 'hensachi', 'total-score']);
    expect(report.hasFlags).toBe(true);
    const text = formatDistributionAuditReport(report);
    expect(text).toContain('🚨');
    expect(text).toContain('自動除外は行っていません');
  });
});
