/**
 * ファーストパーティ・リダイレクタ（/go/{affiliateId}）のURLを組む純関数。
 *
 * なぜ（[[fable5-master-plan-2026-06]] / P1-1）：GA4 の affiliate_click は ITP/広告ブロッカーで
 * 最大3割が欠測する。クリックを自前ドメインの 302（/go）に通し D1 に記録すれば、
 * 「どの面・どの県で・どのオファーが押されたか」を一次データで持てる＝勝者判定の精度が変わる。
 *
 * 設計：href は affiliates.ts の固定値だけに 302 する（オープンリダイレクトにしない）。
 * このヘルパーは window 非依存の純関数（サーバー/クライアント共通・テスト可能）。
 */
import type { AffiliateId } from '@/lib/affiliates';

export interface GoContext {
  /** 都道府県コード（例: tokyo）。県別の効きを D1 で分解するため。 */
  pref?: string;
  /** 設置面（result / hensachi / hiyou など）。面別の効きを分解するため。 */
  placement?: string;
}

/** 値を URL クエリに安全に載せる（短く・英数記号のみ想定。日本語は encodeURIComponent 任せ）。 */
function clean(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const t = v.trim().slice(0, 40);
  return t || undefined;
}

/**
 * /go/{id}?pref=&placement= を返す。
 * pending/不明IDでも文字列は組める（実際の 302 は /go ルートが allowlist で弾く）。
 */
export function goHref(id: AffiliateId, ctx: GoContext = {}): string {
  const q = new URLSearchParams();
  const pref = clean(ctx.pref);
  const placement = clean(ctx.placement);
  if (pref) q.set('pref', pref);
  if (placement) q.set('placement', placement);
  const qs = q.toString();
  return `/go/${id}${qs ? `?${qs}` : ''}`;
}
