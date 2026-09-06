import { buildSnapshotPdfHashLookup, comparePdfHashToBaseline } from '../pdf-hash-diff';
import snapshot2026r8 from '@/data/snapshots/2026-r8/exam-system.json';

describe('buildSnapshotPdfHashLookup + comparePdfHashToBaseline', () => {
  const snapshot = {
    entries: [
      { code: 'tokyo', pdfHash: 'aaa111' },
      { code: 'osaka', pdfHash: null },
      // 'kyoto' はレコード自体が無い
    ],
  };
  const lookup = buildSnapshotPdfHashLookup(snapshot);

  it('returns "unchanged" when the fresh hash matches the baseline', () => {
    const result = comparePdfHashToBaseline('tokyo', 'aaa111', lookup);
    expect(result).toEqual({ status: 'unchanged', baselineHash: 'aaa111', freshHash: 'aaa111' });
  });

  it('returns "changed" when the fresh hash differs from the baseline', () => {
    const result = comparePdfHashToBaseline('tokyo', 'bbb222', lookup);
    expect(result).toEqual({ status: 'changed', baselineHash: 'aaa111', freshHash: 'bbb222' });
  });

  it('returns "unknown" when the baseline hash was never collected (null)', () => {
    const result = comparePdfHashToBaseline('osaka', 'ccc333', lookup);
    expect(result.status).toBe('unknown');
    if (result.status === 'unknown') {
      expect(result.reason).toContain('osaka');
      expect(result.reason).toContain('未収集');
    }
  });

  it('returns "unknown" when the prefecture has no snapshot record at all', () => {
    const result = comparePdfHashToBaseline('kyoto', 'ddd444', lookup);
    expect(result.status).toBe('unknown');
    if (result.status === 'unknown') {
      expect(result.reason).toContain('kyoto');
      expect(result.reason).toContain('レコードが無い');
    }
  });

  it('returns "unknown" when the fresh hash is an empty string (never treats missing input as unchanged)', () => {
    const result = comparePdfHashToBaseline('tokyo', '', lookup);
    expect(result.status).toBe('unknown');
  });

  it('does not conflate "no record" and "null hash" (2値化しない)', () => {
    const noRecord = comparePdfHashToBaseline('kyoto', 'zzz', lookup);
    const nullHash = comparePdfHashToBaseline('osaka', 'zzz', lookup);
    expect(noRecord.status).toBe('unknown');
    expect(nullHash.status).toBe('unknown');
    // 理由文言は異なる(レコード不在 vs ハッシュ未収集)ことを確認する
    if (noRecord.status === 'unknown' && nullHash.status === 'unknown') {
      expect(noRecord.reason).not.toBe(nullHash.reason);
    }
  });
});

describe('buildSnapshotPdfHashLookup against the real 2026-r8 snapshot', () => {
  it('reflects the frozen 47/47 pdfHash coverage recorded in meta.pdfHashStatus', () => {
    const lookup = buildSnapshotPdfHashLookup(snapshot2026r8);
    expect(snapshot2026r8.meta.pdfHashStatus).toBe('complete_47_of_47');

    let withHash = 0;
    let withoutHash = 0;
    for (const entry of snapshot2026r8.entries as Array<{ code: string }>) {
      const hash = lookup.findPdfHash(entry.code);
      if (typeof hash === 'string' && hash.length > 0) withHash++;
      else withoutHash++;
    }
    expect(withHash).toBe(47);
    expect(withoutHash).toBe(0);
  });
});
