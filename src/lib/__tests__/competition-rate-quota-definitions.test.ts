import { QUOTA_DEFINITIONS } from '@/lib/competition-rate-quota-definitions';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { PUBLICATION_REFUSED_PREFECTURES } from '@/lib/publication-refused-prefectures';

describe('QUOTA_DEFINITIONS', () => {
  it('every key is a real prefecture present in COMPETITION_RATE_BY_PREFECTURE (catches typos)', () => {
    for (const key of Object.keys(QUOTA_DEFINITIONS)) {
      // 県が掲載を断った県(和歌山)は公開用マップから外れるが、定義は生データ側の根拠として残す。
      if (PUBLICATION_REFUSED_PREFECTURES.has(key)) continue;
      expect(Object.keys(COMPETITION_RATE_BY_PREFECTURE)).toContain(key);
    }
  });

  it('every entry has non-empty quotaMeans/rationale/evidence (no placeholder left blank)', () => {
    for (const entry of Object.values(QUOTA_DEFINITIONS)) {
      expect(entry?.quotaMeans.length).toBeGreaterThan(0);
      expect(entry?.rationale.length).toBeGreaterThan(0);
      expect(entry?.evidence.length).toBeGreaterThan(0);
    }
  });

  it('T-Y11B段階1(2026-09-01完了): A-3が47/47県で完了している', () => {
    const definedPrefectures = Object.keys(QUOTA_DEFINITIONS).sort();
    const allPrefectures = [...Object.keys(COMPETITION_RATE_BY_PREFECTURE), ...PUBLICATION_REFUSED_PREFECTURES].sort();
    expect(definedPrefectures).toEqual(allPrefectures);
    expect(definedPrefectures.length).toBe(47);
  });
});
