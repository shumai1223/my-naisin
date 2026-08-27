import { getLicensedPrefectureSummaries } from '../reliability-license-summary';
import { DATA_LICENSE_LEDGER } from '../data-license-ledger';

describe('getLicensedPrefectureSummaries（T-C9・/reliability公開用の許諾一覧）', () => {
  it('DATA_LICENSE_LEDGERのok件数と一致する（drift検知）', () => {
    const okCount = Object.values(DATA_LICENSE_LEDGER).filter((e) => e.redistribution === 'ok').length;
    expect(getLicensedPrefectureSummaries()).toHaveLength(okCount);
  });

  it('各エントリがname・verifiedAt・text・backlinkを持つ（公開表示に必要な情報が揃っている）', () => {
    for (const s of getLicensedPrefectureSummaries()) {
      expect(s.name).toBeTruthy();
      expect(s.verifiedAt).not.toBeNull();
      expect(s.text.length).toBeGreaterThan(0);
      expect(typeof s.backlink).toBe('boolean');
    }
  });

  it('okinawa: 転載・被リンクとも許諾（backlink: true）', () => {
    const okinawa = getLicensedPrefectureSummaries().find((s) => s.code === 'okinawa');
    expect(okinawa?.backlink).toBe(true);
    expect(okinawa?.verifiedAt).toBe('2026-08-24');
  });

  it('公開用テキストに個人名・スレッドID・内部実装メモ(A-2等)が含まれない（PII/内部情報の漏洩防止）', () => {
    for (const s of getLicensedPrefectureSummaries()) {
      expect(s.text).not.toMatch(/スレッド|Gmail|A-2|draftId/);
    }
  });

  it('verifiedAtの昇順でソートされている', () => {
    const dates = getLicensedPrefectureSummaries().map((s) => s.verifiedAt ?? '');
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });
});
