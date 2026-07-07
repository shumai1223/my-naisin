/**
 * 保護者リード出し分けエンジンのユニットテスト。
 * 最重要の不変条件：勝者を設定するまで「既定＝現行 ParentLeadCTA の表示」と一致し続ける（挙動非変更）。
 */

import {
  selectLeadOffer,
  auditPlacementOffers,
  ALL_LEAD_PLACEMENTS,
  DEFAULT_LEAD_OFFER,
  PLACEMENT_LEAD_OVERRIDES,
  type LeadPlacement,
} from '../lead-config';
import { isLiveAffiliate } from '../affiliates';

describe('selectLeadOffer', () => {
  test('指定なしは全体既定を返す', () => {
    expect(selectLeadOffer()).toEqual(DEFAULT_LEAD_OFFER);
  });

  test('既定の送客先は現行と同じ Z会資料請求（挙動非変更の保証）', () => {
    expect(DEFAULT_LEAD_OFFER.affiliateId).toBe('zkai-text-request');
    expect(DEFAULT_LEAD_OFFER.ctaText).toBe('無料で資料をもらう');
  });

  test('result面は初期勝者（liveな無料体験案件）に出し分け、コピーも文脈化される', () => {
    // 季節講習スワップを切って通年の基底挙動を検証（季節挙動は seasonal-lead.test.ts）。
    const offer = selectLeadOffer({ placement: 'result', season: null });
    // Z会一本足を解消：result は別のlive案件に出し分ける
    expect(offer.affiliateId).not.toBe(DEFAULT_LEAD_OFFER.affiliateId);
    expect(isLiveAffiliate(offer.affiliateId)).toBe(true);
    expect(offer.heading).toBe(PLACEMENT_LEAD_OVERRIDES.result?.heading);
    expect(offer.heading).not.toBe(DEFAULT_LEAD_OFFER.heading);
    // note/ctaText が affiliateId と整合（プログラムプリセットでミスラベル防止）
    expect(offer.note).toContain('PR');
    expect(offer.ctaText).toBeTruthy();
  });

  test('未設定の県（面指定なし）は既定にフォールバックする', () => {
    const offer = selectLeadOffer({ prefectureCode: 'okinawa' });
    expect(offer.affiliateId).toBe(DEFAULT_LEAD_OFFER.affiliateId);
  });

  test('県オーバーライド（関東/関西）は live な地盤塾に解決する', () => {
    for (const pref of ['tokyo', 'osaka', 'hyogo', 'kanagawa']) {
      const offer = selectLeadOffer({ prefectureCode: pref, placement: 'prefecture' });
      expect(isLiveAffiliate(offer.affiliateId)).toBe(true);
      expect(offer.note).toContain('PR');
    }
  });

  test('全ての解決オファーは live な案件のみ（pendingの先回し枠を出さない）', () => {
    const placements: LeadPlacement[] = ['result', 'hensachi', 'hyotei-heikin', 'prefecture', 'parent-lp', 'blog', 'home', 'dashboard', 'hiyou', 'mendan', 'suisen', 'naishin-up', 'jitsugika', 'futoukou'];
    for (const placement of placements) {
      const offer = selectLeadOffer({ placement, prefectureCode: 'tokyo' });
      expect(isLiveAffiliate(offer.affiliateId)).toBe(true);
    }
  });

  test('返り値は完全な LeadOffer（必須5フィールドが揃う）', () => {
    const offer = selectLeadOffer({ placement: 'hensachi', prefectureCode: 'osaka' });
    expect(offer.affiliateId).toBeTruthy();
    expect(offer.heading).toBeTruthy();
    expect(offer.body).toBeTruthy();
    expect(offer.note).toBeTruthy();
    expect(offer.ctaText).toBeTruthy();
  });
});

describe('auditPlacementOffers（北極星：保護者面に有料を置かない）', () => {
  // 県・季節の代表的な組み合わせ。通年（null）と夏冬＋直前(D-7)を、関東/関西/未設定県で総当たり監査する。
  const prefs: (string | undefined)[] = [undefined, 'tokyo', 'osaka', 'okinawa'];
  const seasons = [null, 'summer', 'winter', 'last-minute'] as const;

  test('全面の監査が全 placement を網羅する', () => {
    const audit = auditPlacementOffers();
    expect(audit).toHaveLength(ALL_LEAD_PLACEMENTS.length);
    expect(new Set(audit.map((a) => a.placement)).size).toBe(ALL_LEAD_PLACEMENTS.length);
  });

  test('どの県・季節でも、解決される送客先に有料成約（paid）は無い＝戦略ドリフト検出', () => {
    for (const prefectureCode of prefs) {
      for (const season of seasons) {
        for (const row of auditPlacementOffers({ prefectureCode, season })) {
          // 有料が紛れ込んだら、どの面・県・季節かを明示して落とす
          expect({
            placement: row.placement,
            prefectureCode: prefectureCode ?? '(none)',
            season: season ?? 'allyear',
            kind: row.kind,
            parentSafe: row.parentSafe,
          }).toMatchObject({ parentSafe: true });
          expect(row.kind).not.toBe('paid');
        }
      }
    }
  });

  test('監査行は live な送客先のみ（pending を出さない）', () => {
    for (const row of auditPlacementOffers({ prefectureCode: 'tokyo', season: null })) {
      expect(isLiveAffiliate(row.affiliateId)).toBe(true);
      expect(row.kindLabel).toBeTruthy();
      expect(row.programName).toBeTruthy();
    }
  });
});
