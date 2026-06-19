import { getActiveSeason, SEASON_COPY } from '@/lib/seasonal';
import { selectLeadOffer } from '@/lib/lead-config';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('getActiveSeason（日付→季節）', () => {
  it('冬期講習〜受験直前 11/1〜2/15 は winter', () => {
    expect(getActiveSeason(D('2026-11-01'))).toBe('winter');
    expect(getActiveSeason(D('2026-12-15'))).toBe('winter');
    expect(getActiveSeason(D('2027-01-20'))).toBe('winter');
    expect(getActiveSeason(D('2027-02-15'))).toBe('winter');
  });

  it('夏期講習 6/15〜8/10 は summer', () => {
    expect(getActiveSeason(D('2026-06-15'))).toBe('summer');
    expect(getActiveSeason(D('2026-07-20'))).toBe('summer');
    expect(getActiveSeason(D('2026-08-10'))).toBe('summer');
  });

  it('窓の外は null（季節なし）', () => {
    expect(getActiveSeason(D('2026-02-20'))).toBeNull();
    expect(getActiveSeason(D('2026-06-10'))).toBeNull();
    expect(getActiveSeason(D('2026-09-15'))).toBeNull();
    expect(getActiveSeason(D('2026-10-31'))).toBeNull();
  });
});

describe('selectLeadOffer × 季節講習スワップ', () => {
  it('冬・高インテント面（result）は冬期講習コピー＋全国オンライン塾に寄る', () => {
    const o = selectLeadOffer({ placement: 'result', season: 'winter' });
    expect(o.affiliateId).toBe('sora-juku-text');
    expect(o.heading).toBe(SEASON_COPY.winter.heading);
    expect(o.ctaText).toContain('冬期講習');
    expect(o.note).toContain('冬期講習');
  });

  it('県の地盤塾を尊重（関西=キャンパス／関東=森塾）', () => {
    expect(selectLeadOffer({ placement: 'result', prefectureCode: 'osaka', season: 'winter' }).affiliateId).toBe('campus-text');
    expect(selectLeadOffer({ placement: 'prefecture', prefectureCode: 'tokyo', season: 'winter' }).affiliateId).toBe('morijuku-text');
  });

  it('夏は夏期講習コピーになる', () => {
    const o = selectLeadOffer({ placement: 'naishin-up', season: 'summer' });
    expect(o.ctaText).toContain('夏期講習');
    expect(o.affiliateId).toBe('sora-juku-text');
  });

  it('専用枠が pending の今は live 塾にフォールバック（デッドリンクを出さない）', () => {
    const o = selectLeadOffer({ placement: 'result', season: 'winter' });
    expect(['sora-juku-text', 'morijuku-text', 'campus-text', 'atama-text']).toContain(o.affiliateId);
  });

  it('季節対象外の面（hiyou=FP）は季節中でも不変', () => {
    const o = selectLeadOffer({ placement: 'hiyou', season: 'winter' });
    expect(o.affiliateId).toBe('fp-soudan');
  });

  it('季節なし（off）は通年の出し分けに戻る', () => {
    const o = selectLeadOffer({ placement: 'result', season: null });
    expect(o.affiliateId).toBe('sora-juku-text');
    expect(o.ctaText).not.toContain('冬期講習');
    expect(o.ctaText).not.toContain('夏期講習');
  });
});
