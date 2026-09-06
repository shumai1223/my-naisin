import { pickArchiveCandidates, buildArchiveEntry, emptyArchiveState, type ArchiveState } from '@/lib/bairitsu-pdf-archive';
import type { WatchState, WatchEntry } from '@/lib/competition-rate-watch';

function makeWatchEntry(overrides: Partial<WatchEntry>): WatchEntry {
  return {
    prefecture: 'chiba',
    url: 'https://example.pref.chiba.lg.jp/r9.pdf',
    lastCheckedAt: '2026-09-06T00:00:00Z',
    lastStatus: 'ok',
    fingerprint: 'etag1|lm1|100',
    changedAt: null,
    note: null,
    ...overrides,
  };
}

describe('pickArchiveCandidates', () => {
  it('returns prefectures with lastStatus changed and a fingerprint', () => {
    const watchState: WatchState = {
      entries: {
        chiba: makeWatchEntry({ lastStatus: 'changed', fingerprint: 'f2' }),
        akita: makeWatchEntry({ lastStatus: 'ok' }),
      },
    };
    expect(pickArchiveCandidates(watchState, emptyArchiveState())).toEqual(['chiba']);
  });

  it('excludes robots-blocked, unreachable, and ok statuses', () => {
    const watchState: WatchState = {
      entries: {
        a: makeWatchEntry({ lastStatus: 'robots-blocked' }),
        b: makeWatchEntry({ lastStatus: 'unreachable' }),
        c: makeWatchEntry({ lastStatus: 'ok' }),
      },
    };
    expect(pickArchiveCandidates(watchState, emptyArchiveState())).toEqual([]);
  });

  it('excludes a changed entry with a null fingerprint (defensive against inconsistent state)', () => {
    const watchState: WatchState = { entries: { chiba: makeWatchEntry({ lastStatus: 'changed', fingerprint: null }) } };
    expect(pickArchiveCandidates(watchState, emptyArchiveState())).toEqual([]);
  });

  it('does not re-pick a prefecture already archived at the same fingerprint', () => {
    const watchState: WatchState = { entries: { chiba: makeWatchEntry({ lastStatus: 'changed', fingerprint: 'f2' }) } };
    const archiveState: ArchiveState = {
      entries: { chiba: { prefecture: 'chiba', url: 'x', sha256: 'abc', byteLength: 10, fingerprintAtArchive: 'f2', archivedAt: '2026-09-05T00:00:00Z' } },
    };
    expect(pickArchiveCandidates(watchState, archiveState)).toEqual([]);
  });

  it('re-picks a prefecture when the fingerprint has moved on since the last archive', () => {
    const watchState: WatchState = { entries: { chiba: makeWatchEntry({ lastStatus: 'changed', fingerprint: 'f3' }) } };
    const archiveState: ArchiveState = {
      entries: { chiba: { prefecture: 'chiba', url: 'x', sha256: 'abc', byteLength: 10, fingerprintAtArchive: 'f2', archivedAt: '2026-09-05T00:00:00Z' } },
    };
    expect(pickArchiveCandidates(watchState, archiveState)).toEqual(['chiba']);
  });
});

describe('buildArchiveEntry', () => {
  it('assembles an entry from the watch entry and download outcome', () => {
    const entry = makeWatchEntry({ lastStatus: 'changed', fingerprint: 'f2' });
    const result = buildArchiveEntry('chiba', entry, { sha256: 'deadbeef', byteLength: 12345 }, '2026-09-06T01:00:00Z');
    expect(result).toEqual({
      prefecture: 'chiba',
      url: entry.url,
      sha256: 'deadbeef',
      byteLength: 12345,
      fingerprintAtArchive: 'f2',
      archivedAt: '2026-09-06T01:00:00Z',
    });
  });

  it('falls back to an empty string fingerprint when the watch entry has none', () => {
    const entry = makeWatchEntry({ lastStatus: 'changed', fingerprint: null });
    const result = buildArchiveEntry('chiba', entry, { sha256: 'x', byteLength: 1 }, '2026-09-06T01:00:00Z');
    expect(result.fingerprintAtArchive).toBe('');
  });
});
