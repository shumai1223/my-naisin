import type { ParentFunnelEvent, ParentFunnelMedium } from '@/lib/parent-funnel-db';

/**
 * 保護者ファネル(TIER Σ-3)のD1一次記録ビーコン（クライアント側）。
 * GA4のtrack()と並走させ、遷移/送信は止めずベストエフォートで送る
 * （school-page-clicks-db.tsのreportClick同型パターン）。
 */
export function beaconParentFunnelEvent(
  event: ParentFunnelEvent,
  opts: { medium?: ParentFunnelMedium; prefectureCode?: string } = {}
): void {
  try {
    fetch('/api/parent-funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...opts }),
      keepalive: true,
    }).catch(() => {
      /* no-op */
    });
  } catch {
    /* no-op */
  }
}
