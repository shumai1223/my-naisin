/**
 * Next.js instrumentation フック（H-3：Workers例外→運用通知）。
 *
 * register() はサーバー起動時に一度だけ呼ばれる（ここでは何もしない＝将来のトレーシング拡張用の空口）。
 * onRequestError() はレンダー/ルートハンドラ/アクションで捕捉されなかった例外が起きるたびに呼ばれる
 * （Next.js 15の標準フック）。既存のCONTACT_WEBHOOK_URLへ通知するだけで、レスポンス自体には介入しない。
 *
 * ⚠️既知の不確実性は src/lib/ops-notify.ts のコメントを参照（OpenNext/Cloudflareでの
 * 発火は2026-07-08時点で未確認）。発火しなくても既存機能への悪影響はゼロ。
 */
import { notifyOps, formatRequestErrorMessage } from '@/lib/ops-notify';
import type { Instrumentation } from 'next';

export function register() {
  // 現状は register 側で行うことは無い（将来のトレーシング初期化用の空口）。
}

export const onRequestError: Instrumentation.onRequestError = async (error, errorRequest, errorContext) => {
  try {
    await notifyOps(formatRequestErrorMessage(error, errorRequest, errorContext));
  } catch {
    // 通知失敗でリクエスト処理そのものを壊さない。
  }
};
