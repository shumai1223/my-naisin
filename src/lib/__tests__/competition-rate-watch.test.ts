import {
  buildFingerprint,
  buildWatchSection,
  emptyWatchState,
  evaluateFetch,
  injectWatchSection,
  shouldFetch,
  summarizeWatchState,
  type WatchEntry,
  type WatchState,
} from '@/lib/competition-rate-watch';

describe('shouldFetch', () => {
  it('returns true when there is no prior entry', () => {
    expect(shouldFetch(undefined, new Date('2026-09-02T00:00:00Z'))).toBe(true);
  });

  it('returns false within 24h of the last check', () => {
    const entry = { lastCheckedAt: '2026-09-01T00:00:00Z' } as WatchEntry;
    expect(shouldFetch(entry, new Date('2026-09-01T12:00:00Z'))).toBe(false);
  });

  it('returns true at exactly 24h and beyond', () => {
    const entry = { lastCheckedAt: '2026-09-01T00:00:00Z' } as WatchEntry;
    expect(shouldFetch(entry, new Date('2026-09-02T00:00:00Z'))).toBe(true);
    expect(shouldFetch(entry, new Date('2026-09-03T00:00:00Z'))).toBe(true);
  });

  it('treats an unparsable lastCheckedAt as never-checked (fetch again) rather than crashing', () => {
    const entry = { lastCheckedAt: 'not-a-date' } as WatchEntry;
    expect(shouldFetch(entry, new Date())).toBe(true);
  });
});

describe('buildFingerprint', () => {
  it('joins etag/lastModified/contentLength with a separator', () => {
    expect(buildFingerprint({ etag: '"abc"', lastModified: 'Mon, 01 Sep 2026', contentLength: '1234' })).toBe(
      '"abc"|Mon, 01 Sep 2026|1234'
    );
  });

  it('produces an empty string when all headers are missing (never a false "changed")', () => {
    expect(buildFingerprint({})).toBe('||');
  });
});

describe('evaluateFetch', () => {
  const now = '2026-09-02T00:00:00Z';

  it('marks robots-blocked when fingerprint is undefined, keeping the previous fingerprint', () => {
    const prev: WatchEntry = {
      prefecture: 'x',
      url: 'https://example.lg.jp/a.pdf',
      lastCheckedAt: '2026-09-01T00:00:00Z',
      lastStatus: 'ok',
      fingerprint: 'etag1||',
      changedAt: null,
      note: null,
    };
    const result = evaluateFetch('x', prev.url, prev, { fingerprint: undefined }, now);
    expect(result.lastStatus).toBe('robots-blocked');
    expect(result.fingerprint).toBe('etag1||');
  });

  it('marks unreachable when fingerprint is null', () => {
    const result = evaluateFetch('x', 'https://example.lg.jp/a.pdf', undefined, { fingerprint: null }, now);
    expect(result.lastStatus).toBe('unreachable');
    expect(result.fingerprint).toBeNull();
  });

  it('does not flag "changed" on the very first observation', () => {
    const result = evaluateFetch('x', 'https://example.lg.jp/a.pdf', undefined, { fingerprint: 'etag1||' }, now);
    expect(result.lastStatus).toBe('ok');
    expect(result.changedAt).toBeNull();
  });

  it('flags "changed" when the fingerprint differs from the previous one', () => {
    const prev: WatchEntry = {
      prefecture: 'x',
      url: 'https://example.lg.jp/a.pdf',
      lastCheckedAt: '2026-09-01T00:00:00Z',
      lastStatus: 'ok',
      fingerprint: 'etag1||100',
      changedAt: null,
      note: null,
    };
    const result = evaluateFetch('x', prev.url, prev, { fingerprint: 'etag2||105' }, now);
    expect(result.lastStatus).toBe('changed');
    expect(result.changedAt).toBe(now);
  });

  it('stays "ok" and keeps the previous changedAt when the fingerprint is unchanged', () => {
    const prev: WatchEntry = {
      prefecture: 'x',
      url: 'https://example.lg.jp/a.pdf',
      lastCheckedAt: '2026-09-01T00:00:00Z',
      lastStatus: 'changed',
      fingerprint: 'etag1||100',
      changedAt: '2026-08-30T00:00:00Z',
      note: null,
    };
    const result = evaluateFetch('x', prev.url, prev, { fingerprint: 'etag1||100' }, now);
    expect(result.lastStatus).toBe('ok');
    expect(result.changedAt).toBe('2026-08-30T00:00:00Z');
  });

  it('treats an empty-string fingerprint (all headers missing) as inconclusive, not "changed"', () => {
    const prev: WatchEntry = {
      prefecture: 'x',
      url: 'https://example.lg.jp/a.pdf',
      lastCheckedAt: '2026-09-01T00:00:00Z',
      lastStatus: 'ok',
      fingerprint: 'etag1||100',
      changedAt: null,
      note: null,
    };
    const result = evaluateFetch('x', prev.url, prev, { fingerprint: '' }, now);
    expect(result.lastStatus).toBe('ok');
    // 判定不能なので前回のfingerprintを消さない（次回また比較できるようにする）
    expect(result.fingerprint).toBe('etag1||100');
  });
});

describe('summarizeWatchState', () => {
  it('buckets entries by status', () => {
    const state: WatchState = {
      entries: {
        a: { prefecture: 'a', url: 'u', lastCheckedAt: null, lastStatus: 'changed', fingerprint: null, changedAt: null, note: null },
        b: { prefecture: 'b', url: 'u', lastCheckedAt: null, lastStatus: 'unreachable', fingerprint: null, changedAt: null, note: null },
        c: { prefecture: 'c', url: 'u', lastCheckedAt: null, lastStatus: 'robots-blocked', fingerprint: null, changedAt: null, note: null },
        d: { prefecture: 'd', url: 'u', lastCheckedAt: null, lastStatus: 'ok', fingerprint: null, changedAt: null, note: null },
        e: { prefecture: 'e', url: 'u', lastCheckedAt: null, lastStatus: 'never-checked', fingerprint: null, changedAt: null, note: null },
      },
    };
    const summary = summarizeWatchState(state);
    expect(summary.total).toBe(5);
    expect(summary.changed).toEqual(['a']);
    expect(summary.unreachable).toEqual(['b']);
    expect(summary.robotsBlocked).toEqual(['c']);
    expect(summary.neverChecked).toEqual(['e']);
    expect(summary.okCount).toBe(1);
  });
});

describe('buildWatchSection / injectWatchSection', () => {
  it('renders "更新なし" when nothing changed', () => {
    const section = buildWatchSection(emptyWatchState(), '2026-09-02');
    expect(section).toContain('更新なし');
  });

  it('lists changed prefectures when present', () => {
    const state: WatchState = {
      entries: {
        chiba: { prefecture: 'chiba', url: 'u', lastCheckedAt: null, lastStatus: 'changed', fingerprint: null, changedAt: null, note: null },
      },
    };
    const section = buildWatchSection(state, '2026-09-02');
    expect(section).toContain('chiba');
    expect(section).toContain('更新を検知した県');
  });

  it('inserts the section right after the first heading when absent', () => {
    const result = injectWatchSection('# 朝ブリーフィング\n\nother content', 'BODY');
    expect(result).toContain('# 朝ブリーフィング');
    expect(result.indexOf('BODY')).toBeGreaterThan(result.indexOf('# 朝ブリーフィング'));
  });

  it('replaces an existing section idempotently rather than duplicating it', () => {
    const first = injectWatchSection('# 朝ブリーフィング\n', 'BODY1');
    const second = injectWatchSection(first, 'BODY2');
    expect(second.match(/Y11_COMPETITION_WATCH_START/g)?.length).toBe(1);
    expect(second).toContain('BODY2');
    expect(second).not.toContain('BODY1');
  });
});
