import { classifyClick, isInternalReferer } from '@/lib/bot-filter';

/**
 * 匿名統計の投稿について、送信元の真正性を判定する（DW-1・2026-08-10）。
 *
 * Origin ヘッダを優先し、無ければ Referer で判定する（fetch は同一オリジンPOSTに Origin を付ける）。
 * 純粋関数として切り出し、テストから直接叩けるようにしている。
 *
 * ⚠️ なぜ route.ts ではなくここに置くのか（2026-08-11）:
 *   App Router の route.ts は HTTP メソッドと所定の設定値以外を export できない。
 *   route.ts に置いたままだと `next build` の型検査
 *   （.next/types/app/api/stats/submit/route.ts の checkFields）が
 *   「Property 'classifySubmission' is incompatible with index signature」で落ち、
 *   本番デプロイだけが失敗する。`tsc --noEmit` と jest は .next/types を見ないため
 *   両方greenのまま通過してしまい、丸一日デプロイが止まる事故になった。
 *   route.ts から純粋関数を export しないこと。
 *
 * 判定の根拠は src/app/api/stats/submit/route.ts の DW-1 コメント、
 * 契約は src/lib/__tests__/stats-submit-provenance.test.ts を参照。
 */
export function classifySubmission(headers: { get(name: string): string | null }): ReturnType<typeof classifyClick> {
  const ua = headers.get('user-agent');
  const origin = headers.get('origin');
  const referer = headers.get('referer');
  // Origin は "https://my-naishin.com" の形。isInternalReferer はURLとして解釈するのでそのまま渡せる。
  const internalOrigin = isInternalReferer(origin) || isInternalReferer(referer);
  return classifyClick({ userAgent: ua, referer: internalOrigin ? 'https://my-naishin.com/' : null });
}
