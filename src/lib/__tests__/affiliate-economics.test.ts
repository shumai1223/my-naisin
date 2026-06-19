import {
  economicsFor,
  estimatedLeads,
  estimatedRevenueYen,
  confirmedRevenueYen,
  commitmentLevel,
  isParentSafeOffer,
  OFFER_KIND_LABEL,
  CONFIRM_RATE,
  yen,
} from '@/lib/affiliate-economics';

describe('affiliate-economics', () => {
  it('未掲載IDは free-lead 既定にフォールバックする', () => {
    // 実在しないIDを無理やり渡しても落ちず free-lead 既定を返す（営業集計を止めない）
    const e = economicsFor('___unknown___' as never);
    expect(e.kind).toBe('free-lead');
  });

  it('FP相談は最高単価帯・無料リード扱い', () => {
    const e = economicsFor('fp-soudan');
    expect(e.cpaYen).toBeGreaterThanOrEqual(10000);
    expect(e.kind).toBe('free-lead');
  });

  it('保守確定額 ≤ 楽観発生額（CONFIRM_RATE と低転換率で必ず保守側が小さい）', () => {
    const optimistic = estimatedRevenueYen('fp-soudan', 1000);
    const conservative = confirmedRevenueYen('fp-soudan', 1000);
    expect(conservative).toBeLessThan(optimistic);
    expect(CONFIRM_RATE).toBeLessThan(1);
  });

  it('推定リード数はクリック×転換率', () => {
    const e = economicsFor('sora-juku-text');
    expect(estimatedLeads('sora-juku-text', 100)).toBeCloseTo(100 * e.convRate, 5);
  });

  describe('commitmentLevel（A8 階段）', () => {
    it('資料請求(0) < 無料リード(1) < 有料(2)', () => {
      expect(commitmentLevel('doc-request')).toBe(0);
      expect(commitmentLevel('free-lead')).toBe(1);
      expect(commitmentLevel('paid')).toBe(2);
      expect(commitmentLevel('doc-request')).toBeLessThan(commitmentLevel('free-lead'));
      expect(commitmentLevel('free-lead')).toBeLessThan(commitmentLevel('paid'));
    });
  });

  describe('isParentSafeOffer（北極星：保護者面に有料を置かない）', () => {
    it('無料リード/資料請求は保護者面OK、有料はNG', () => {
      expect(isParentSafeOffer('fp-soudan')).toBe(true); // free-lead
      expect(isParentSafeOffer('zkai-text-request')).toBe(true); // doc-request
      expect(isParentSafeOffer('sapuri-banner-300')).toBe(false); // paid
      expect(isParentSafeOffer('zkai-banner')).toBe(false); // paid
    });
  });

  it('全種別に日本語ラベルがある', () => {
    expect(OFFER_KIND_LABEL['doc-request']).toBeTruthy();
    expect(OFFER_KIND_LABEL['free-lead']).toBeTruthy();
    expect(OFFER_KIND_LABEL.paid).toBeTruthy();
  });

  it('yen は3桁区切り＋¥', () => {
    expect(yen(13800)).toBe('¥13,800');
  });
});
