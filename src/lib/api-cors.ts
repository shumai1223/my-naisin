import { NextResponse } from 'next/server';

/**
 * 公開データAPI（堀B）共通のCORS/キャッシュヘッダ。
 * AIエージェント・第三者がブラウザ/サーバーどちらからでも呼べるよう全オリジン許可。
 */
export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Max-Age': '86400',
};

/** GETの公開JSON（CDNキャッシュ1時間）。 */
export function corsJson(data: unknown, init?: { status?: number; cacheSeconds?: number }) {
  const cache = init?.cacheSeconds ?? 3600;
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': `public, max-age=${cache}, s-maxage=${cache}, stale-while-revalidate=86400`,
    },
  });
}

/** プリフライト用の共通OPTIONSレスポンス。 */
export function corsPreflight() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
