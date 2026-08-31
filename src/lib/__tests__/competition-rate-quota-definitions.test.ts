import { QUOTA_DEFINITIONS } from '@/lib/competition-rate-quota-definitions';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

describe('QUOTA_DEFINITIONS', () => {
  it('every key is a real prefecture present in COMPETITION_RATE_BY_PREFECTURE (catches typos)', () => {
    for (const key of Object.keys(QUOTA_DEFINITIONS)) {
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
});
