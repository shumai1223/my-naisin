/**
 * Web Push の VAPID 公開鍵（H-NEW）。
 *
 * VAPID公開鍵は設計上「クライアントに露出する公開値」（秘密鍵だけが秘匿対象）。
 * よってここに既定値を持たせ、ビルド時env（NEXT_PUBLIC_VAPID_PUBLIC_KEY）があればそれを優先する。
 * これにより Cloudflare のビルド環境変数を設定しなくても購読UIが動く（運用の手間を1つ減らす）。
 *
 * 鍵を作り直したい場合：`npm i web-push && npm run push-send -- --gen-keys` で新ペアを生成し、
 *  - 公開鍵をこの定数（または NEXT_PUBLIC_VAPID_PUBLIC_KEY）に
 *  - 秘密鍵は配信スクリプト実行時に VAPID_PRIVATE_KEY（ローカルのシェルenv）として渡す
 * 秘密鍵は絶対にコミットしない。
 */
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BFMQy9cToRNQc6phdfRTT7mmAe8IKHU-o0hOHH6n_JNvRFBQF5qHbF5aJACTpGTuoA6CaqrD_aewAhItdL7PXjU';
