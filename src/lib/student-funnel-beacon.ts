import type { StudentFunnelEvent, StudentGrade } from '@/lib/student-funnel-db';

/**
 * 生徒ファネル(S12-1)のD1一次記録ビーコン（クライアント側）。
 * GA4のtrack()と並走させ、遷移/送信は止めずベストエフォートで送る
 * （parent-funnel-beacon.tsと同型パターン）。
 */
export function beaconStudentFunnelEvent(
  event: StudentFunnelEvent,
  opts: { grade?: StudentGrade; tool?: string } = {}
): void {
  try {
    fetch('/api/student-funnel', {
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
