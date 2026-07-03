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
  confirmedPer1000,
  rankLiveOffersByEV,
  topLiveOfferByEV,
} from '@/lib/affiliate-economics';
import { isLiveAffiliate } from '@/lib/affiliates';

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

  describe('rankLiveOffersByEV（既存アフィリの最適解ランキング）', () => {
    const ranked = rankLiveOffersByEV();

    it('confirmedPer1000 は confirmedRevenueYen(id,1000) と一致', () => {
      expect(confirmedPer1000('fp-soudan')).toBeCloseTo(confirmedRevenueYen('fp-soudan', 1000), 5);
    });

    it('live な案件のみを返す（pendingの先回し枠は除外＝デッドリンクは0円）', () => {
      expect(ranked.length).toBeGreaterThan(0);
      for (const o of ranked) expect(isLiveAffiliate(o.id)).toBe(true);
      // 代表的な pending が混ざっていない
      expect(ranked.find((o) => o.id === 'gakushi-hoken')).toBeUndefined();
      expect(ranked.find((o) => o.id === 'hoken-compass')).toBeUndefined();
    });

    it('EVの降順に並ぶ', () => {
      for (let i = 1; i < ranked.length; i++) {
        expect(ranked[i - 1].confirmedPer1000).toBeGreaterThanOrEqual(ranked[i].confirmedPer1000);
      }
    });

    it('最上位は有料成約(paid)ではない＝北極星（保護者×無料リードが最も稼ぐ）に整合', () => {
      expect(ranked[0].kind).not.toBe('paid');
    });

    it('高単価な無料リード > Z会資料請求 > EPCバナー のEV序列', () => {
      expect(confirmedPer1000('fp-soudan')).toBeGreaterThan(confirmedPer1000('zkai-text-request'));
      expect(confirmedPer1000('zkai-text-request')).toBeGreaterThan(confirmedPer1000('zkai-banner'));
      expect(confirmedPer1000('atama-text')).toBeGreaterThan(confirmedPer1000('sapuri-banner-300'));
    });

    it('topLiveOfferByEV は述語に合う最高EVのliveなIDを返す', () => {
      const best = topLiveOfferByEV();
      expect(best).toBeDefined();
      expect(best).toBe(ranked[0].id);
      const bestFreeLead = topLiveOfferByEV((o) => o.kind === 'free-lead');
      expect(bestFreeLead).toBeDefined();
      expect(economicsFor(bestFreeLead!).kind).toBe('free-lead');
      // 一致しない述語は undefined
      expect(topLiveOfferByEV(() => false)).toBeUndefined();
    });
  });
});
