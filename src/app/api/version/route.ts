import { NextResponse } from 'next/server';

/**
 * 「いま本番に配信されているのはどのコードか」を外から1回のGETで確かめるための窓口。
 *
 * ## なぜ必要になったか（2026-08-12・DW-2）
 * 統計の投稿間引きを直したあと、👤に4回テストしてもらったが毎回直っていなかった。
 * 原因の候補は「修正が未デプロイ」「ブラウザが古いJSを掴んでいる」「コードの欠陥」の3つで、
 * **どれなのかを切り分ける手段が無かった**。開発機は社内ネットワークのTLS傍受で
 * 本番へ直接リクエストできず、`wrangler deployments list` はデプロイ時刻しか返さない
 * （どのコミットから作られたかが分からない）。
 * 結果、デプロイ完了を毎回**推測**して👤にテストを頼み、4回とも無駄にした。
 *
 * ## 使い方
 * 検証したい修正と**同じコミットで** `DEPLOY_MARKER` を上げる。
 * `https://my-naishin.com/api/version` が新しい marker を返したら、その修正は確実に配信済み。
 * 返さない間は、まだ古いコードが動いている（＝テストしても意味がない）。
 *
 * 秘密は何も含めない（コミットSHAも出さない）。単調増加する数と、何のための版かだけ。
 */
export const dynamic = 'force-dynamic';

/** 配信確認用のマーカー。**検証したい修正と同じコミットで必ず上げること。** */
const DEPLOY_MARKER = 2;

/** その marker が何のための版かを一言で。履歴として残す。 */
const MARKER_NOTE = 'dw2: 統計投稿の間引き（クライアント側スケジューラ＋サーバ側の塊隔離）';

export async function GET() {
  return NextResponse.json(
    { marker: DEPLOY_MARKER, note: MARKER_NOTE },
    { headers: { 'cache-control': 'no-store' } }
  );
}
