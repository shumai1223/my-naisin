import { daysBetween, computeFollowupCandidates, summarizeByLane, type OutreachEntry } from '../outreach-ledger';

describe('daysBetween', () => {
  it('計算する（同日は0）', () => {
    expect(daysBetween('2026-07-17', '2026-07-17')).toBe(0);
  });

  it('経過日数を正しく数える', () => {
    expect(daysBetween('2026-07-17', '2026-07-24')).toBe(7);
  });

  it('不正な日付は NaN', () => {
    expect(Number.isNaN(daysBetween('not-a-date', '2026-07-24'))).toBe(true);
  });
});

function makeEntry(overrides: Partial<OutreachEntry>): OutreachEntry {
  return {
    id: 'e1',
    org: 'テスト株式会社',
    lane: 'b2b-saas',
    sentDate: '2026-07-17',
    status: 'awaiting',
    followupCount: 0,
    ...overrides,
  };
}

describe('computeFollowupCandidates', () => {
  it('7日未満は候補にならない', () => {
    const entries = [makeEntry({ sentDate: '2026-07-20' })]; // 4日
    expect(computeFollowupCandidates(entries, '2026-07-24')).toHaveLength(0);
  });

  it('7日以上経過したawaitingは候補になる', () => {
    const entries = [makeEntry({ sentDate: '2026-07-17' })]; // 7日
    const result = computeFollowupCandidates(entries, '2026-07-24');
    expect(result).toHaveLength(1);
    expect(result[0].daysSinceLastContact).toBe(7);
  });

  it('meeting/replied/declined/closedは対象外', () => {
    const entries: OutreachEntry[] = [
      makeEntry({ id: 'a', status: 'meeting', sentDate: '2026-07-01' }),
      makeEntry({ id: 'b', status: 'replied', sentDate: '2026-07-01' }),
      makeEntry({ id: 'c', status: 'declined', sentDate: '2026-07-01' }),
      makeEntry({ id: 'd', status: 'closed', sentDate: '2026-07-01' }),
    ];
    expect(computeFollowupCandidates(entries, '2026-07-24')).toHaveLength(0);
  });

  it('追撃回数がmaxFollowups以上なら候補から外れる（しつこくしない）', () => {
    const entries = [makeEntry({ sentDate: '2026-07-01', followupCount: 1 })];
    expect(computeFollowupCandidates(entries, '2026-07-24', { maxFollowups: 1 })).toHaveLength(0);
  });

  it('lastContactDateがある場合はそちらを起点に数える（追撃済みは追撃日から再カウント）', () => {
    const entries = [
      makeEntry({ sentDate: '2026-07-01', lastContactDate: '2026-07-20', followupCount: 1 }),
    ];
    // maxFollowups=2にすれば2回目の追撃が起点日から7日後に候補化する
    expect(computeFollowupCandidates(entries, '2026-07-24', { maxFollowups: 2 })).toHaveLength(0);
    expect(computeFollowupCandidates(entries, '2026-07-27', { maxFollowups: 2 })).toHaveLength(1);
  });

  it('経過日数が長い順(最も待たせている相手が先頭)に並ぶ', () => {
    const entries = [
      makeEntry({ id: 'short', sentDate: '2026-07-17' }), // 7日
      makeEntry({ id: 'long', sentDate: '2026-07-10' }), // 14日
    ];
    const result = computeFollowupCandidates(entries, '2026-07-24');
    expect(result.map((c) => c.entry.id)).toEqual(['long', 'short']);
  });

  it('minDaysオプションでしきい値を変更できる', () => {
    const entries = [makeEntry({ sentDate: '2026-07-20' })]; // 4日
    expect(computeFollowupCandidates(entries, '2026-07-24', { minDays: 3 })).toHaveLength(1);
  });
});

describe('summarizeByLane', () => {
  it('レーン別に件数を集計する（未使用レーンは0で埋める）', () => {
    const entries: OutreachEntry[] = [
      makeEntry({ id: 'a', lane: 'b2b-saas' }),
      makeEntry({ id: 'b', lane: 'b2b-saas' }),
      makeEntry({ id: 'c', lane: 'chihoshi' }),
    ];
    expect(summarizeByLane(entries)).toEqual({
      'b2b-saas': 2,
      chihoshi: 1,
      npo: 0,
      'mutual-link': 0,
      'kyoiku-i': 0,
    });
  });
});
