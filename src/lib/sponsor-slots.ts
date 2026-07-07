/**
 * 掲載枠スポンサー（D-3）：県×面を指定した月額固定の直販枠。
 *
 * AFFILIATES（CPA型ASPアフィリ）や lead-config（保護者向け無料リードのEV順位づけ）とは
 * 意図的に別レジストリにする。理由：lead-config.test.ts の不変条件（保護者面へのpaid混入検知）や
 * rankLiveOffersByEV() のEVランキングはCPA無料リード前提の設計であり、月額固定のスポンサー枠を
 * 混ぜるとその判定ロジックの意味が壊れる。スポンサー枠は常に「広告」表記付きの独立した枠として扱う。
 *
 * 契約が無い間は全スロット未設定＝SponsorSlot は何も描画しない（AdSlotの「承認まで描画0」と同じ設計）。
 * 商談が成立したら SPONSOR_SLOTS にエントリを1行足すだけで点火する。
 */

export interface SponsorSlotEntry {
  id: string;
  name: string;
  href: string;
  /** 表示文言（例:「〇〇塾 夏期講習の無料相談はこちら」）。 */
  text: string;
}

/** 面（例 'naishin' 'total-score'）、または `${prefectureCode}:${placement}` で県指定。 */
export type SponsorSlotKey = string;

/** 契約済みスポンサー。埋まるまでは空＝全スロット未点火。 */
const SPONSOR_SLOTS: Partial<Record<SponsorSlotKey, SponsorSlotEntry>> = {
  // 例（商談成立後にここへ追加するだけで該当の県×面に点火）:
  // 'saitama:naishin': { id: 'example-juku', name: '〇〇塾', href: 'https://example.com', text: '〇〇塾の無料相談はこちら' },
};

/** 県指定枠があれば優先、無ければ面共通枠、どちらも無ければnull（未契約=描画0）。 */
export function getSponsorForSlot(placement: string, prefectureCode?: string): SponsorSlotEntry | null {
  if (prefectureCode) {
    const scoped = SPONSOR_SLOTS[`${prefectureCode}:${placement}`];
    if (scoped) return scoped;
  }
  return SPONSOR_SLOTS[placement] ?? null;
}
