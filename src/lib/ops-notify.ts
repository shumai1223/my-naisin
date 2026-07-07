/**
 * 運用者向けの即時通知（H-3：Workers例外の検知遅れ解消）。
 *
 * 北極星：[[opennext-ssg-1102-gotcha]]のような本番障害が「トラフィックが増えて初めて気づく」
 * 状態を防ぐ。既存のCONTACT_WEBHOOK_URL（Discord/Slack互換・/api/contactと同じ転送先）を
 * 再利用するため新規secretは不要。未設定なら完全no-op（既存挙動に一切影響しない）。
 *
 * ⚠️既知の不確実性：この関数はNext.js instrumentation.ts の onRequestError フックから
 * 呼ばれる想定だが、OpenNext（Cloudflare Workers）ランタイムがこのフックを実際に呼び出すかは
 * 2026-07-08時点で未確認（公式ドキュメントに明記なし）。仮に発火しなくても既存機能への
 * 悪影響はゼロ（この関数を呼ぶ側が存在しないだけ）。
 */

async function readWebhookUrl(): Promise<string | undefined> {
  let url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) {
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      url = (env as unknown as { CONTACT_WEBHOOK_URL?: string }).CONTACT_WEBHOOK_URL;
    } catch {
      /* Workers外（テスト/ビルド）では process.env のみ */
    }
  }
  return url;
}

/** 運用者へメッセージを通知（Discord/Slack互換）。失敗は握りつぶす（本処理に影響させない）。 */
export async function notifyOps(message: string): Promise<boolean> {
  const webhookUrl = await readWebhookUrl();
  if (!webhookUrl) return false;
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message, text: message }),
    });
    return res.ok;
  } catch (err) {
    console.error('notifyOps webhook failed:', err);
    return false;
  }
}

/** リクエストエラー1件を運用通知向けメッセージに整形する。PII（クッキー等）は含めない。 */
export function formatRequestErrorMessage(
  error: unknown,
  errorRequest: { path: string; method: string },
  errorContext: { routerKind: string; routePath: string; routeType: string }
): string {
  const msg = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error && error.stack ? error.stack.split('\n').slice(0, 3).join('\n') : '';
  return [
    '🚨 Workers例外を検知（My Naishin）',
    `パス: ${errorRequest.method} ${errorRequest.path}`,
    `ルート: ${errorContext.routeType} / ${errorContext.routePath} (${errorContext.routerKind})`,
    `エラー: ${msg}`,
    stack ? `スタック:\n${stack}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
