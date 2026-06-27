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

/** 計測対象（APIキー付き）は都度最新を返すため private/no-store にする。 */
function cacheHeader(cacheSeconds: number, isPrivate?: boolean): string {
  if (isPrivate) return 'private, no-store';
  return `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`;
}

/** GETの公開JSON（既定はCDNキャッシュ1時間）。headers でレート/ティアを上乗せ、private で計測用に非キャッシュ化。 */
export function corsJson(
  data: unknown,
  init?: { status?: number; cacheSeconds?: number; headers?: Record<string, string>; private?: boolean }
) {
  const cache = init?.cacheSeconds ?? 3600;
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      ...CORS_HEADERS,
      ...(init?.headers ?? {}),
      'Cache-Control': cacheHeader(cache, init?.private),
    },
  });
}

/** GETの公開CSV（既定はCDNキャッシュ1時間・ダウンロード名つき）。Excelの日本語化け回避にBOMを付与。 */
export function corsCsv(
  csv: string,
  init?: { filename?: string; cacheSeconds?: number; headers?: Record<string, string>; private?: boolean }
) {
  const cache = init?.cacheSeconds ?? 3600;
  const filename = init?.filename ?? 'data.csv';
  const BOM = String.fromCharCode(0xFEFF);
  return new NextResponse(BOM + csv, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      ...(init?.headers ?? {}),
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': cacheHeader(cache, init?.private),
    },
  });
}

/** プリフライト用の共通OPTIONSレスポンス。 */
export function corsPreflight() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * 公開データAPIの利用ログ（堀B：「誰がどのエンドポイントを叩いたか＝堀の証拠」§9）。
 * Cloudflare のログに1行JSONで残す。PIIは取らず、UA・参照元・任意メタのみ。失敗してもAPIに影響させない。
 */
export function logApiHit(endpoint: string, request?: Request, extra?: Record<string, unknown>) {
  try {
    const ua = request?.headers.get('user-agent')?.slice(0, 160) ?? '';
    const referer = request?.headers.get('referer')?.slice(0, 160) ?? '';
    console.log(
      JSON.stringify({ t: new Date().toISOString(), api: endpoint, ua, ...(referer ? { referer } : {}), ...extra })
    );
  } catch {
    /* ログ失敗はAPIに影響させない */
  }
}
