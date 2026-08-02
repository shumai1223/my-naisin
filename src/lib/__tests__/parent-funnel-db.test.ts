import { computeParentFunnelReach, bucketHoursSinceSent } from '@/lib/parent-funnel-db';

describe('computeParentFunnelReach（TIER Σ-3・純粋関数）', () => {
  it('3値からshare→landing・landing→clickの到達率(%・小数1桁)を計算する', () => {
    const reach = computeParentFunnelReach(8, 5, 3);
    expect(reach.shareToParent).toBe(8);
    expect(reach.parentLandingView).toBe(5);
    expect(reach.affiliateClick).toBe(3);
    expect(reach.shareToLandingRate).toBe(62.5);
    expect(reach.landingToClickRate).toBe(60);
  });

  it('分母が0のときは到達率をnullにする（ゼロ除算を起こさない）', () => {
    const reach = computeParentFunnelReach(0, 0, 0);
    expect(reach.shareToLandingRate).toBeNull();
    expect(reach.landingToClickRate).toBeNull();
  });

  it('分子が分母を上回る（実装上あり得る取りこぼれ）場合でも100%超をそのまま返す', () => {
    const reach = computeParentFunnelReach(5, 10, 2);
    expect(reach.shareToLandingRate).toBe(200);
  });

  it('小数1桁に丸める', () => {
    const reach = computeParentFunnelReach(3, 1, 0);
    expect(reach.shareToLandingRate).toBe(33.3);
  });
});

describe('bucketHoursSinceSent（TIER Σ-5・純粋関数）', () => {
  it('1時間未満は「1h未満」', () => {
    expect(bucketHoursSinceSent(0)).toBe('1h未満');
    expect(bucketHoursSinceSent(0.9)).toBe('1h未満');
  });

  it('1〜24時間は「1-24時間」（境界は含む/含まないを厳密に）', () => {
    expect(bucketHoursSinceSent(1)).toBe('1-24時間');
    expect(bucketHoursSinceSent(23.9)).toBe('1-24時間');
  });

  it('24〜72時間（DoDが名指しする再訪ウィンドウ）は「24-72時間」', () => {
    expect(bucketHoursSinceSent(24)).toBe('24-72時間');
    expect(bucketHoursSinceSent(71.9)).toBe('24-72時間');
  });

  it('72時間以上は「72時間以上」', () => {
    expect(bucketHoursSinceSent(72)).toBe('72時間以上');
    expect(bucketHoursSinceSent(1000)).toBe('72時間以上');
  });

  it('負値は0扱いで「1h未満」に丸める（不正値の保険）', () => {
    expect(bucketHoursSinceSent(-5)).toBe('1h未満');
  });
});
