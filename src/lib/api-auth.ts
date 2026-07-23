/**
 * 公開データAPI（堀B）の認証・流量制御ゲート。
 *
 * DDレポート §H の「蛇口」本体。各 REST ルートの先頭で gateApiRequest を呼ぶだけで、
 *  - キー無し＝匿名freeティア（後方互換／GEO被引用を止めない・CDNキャッシュ維持）
 *  - 有効キー＝ティア別レート＋月次クォータ（D1計測・課金への布石）
 * を一括施行する。
 *
 * セキュリティモデル：このAPIの背後に秘匿データは無い（内申点の計算方式は公知）。
 * よってキーは「アクセス制御」ではなく「レート／クォータの引き上げと利用計測」のためのもの。
 * 不正・失効・DB未接続のキーは 401 にせず匿名ティアにフォールバックする＝可用性を最優先。
 */

import { CORS_HEADERS } from './api-cors';
import { hashApiKey, lookupApiKey, recordApiUsage } from './api-keys';
import { extractExternalDomain, persistAdoptionHit } from './adoption-radar-db';
import {
  getTierPolicy,
  isWithinMonthlyQuota,
  RATE_WINDOW_MS,
  remainingInWindow,
  type ApiTier,
} from './api-tiers';

/**
 * 自サイトUI（Sec-Fetch-Site: same-origin）向けの匿名緩和上限。
 * Sec-Fetch-Site はブラウザが強制付与しJS/CORSからは偽装不能。第三者サイトのCORS呼び出しは
 * 必ず cross-site になるため、この枠は実ユーザー（StudyPlanCalculator等）だけを守る。
 * サーバーサイドからの偽装は可能だが、その場合は少数のIPに集中するので per-IP 窓が効く。
 */
// 2026-07-17: 30→60。終業式(通知表デー)の朝10-11時に実測サージ(時間71クリック=平常の2倍超)を確認。
// キャリアCGNATでは数千人が1IPを共有するため、サージ時に実ユーザーが30/分に到達し得る。
// same-originはブラウザ強制付与で偽装経路が限定的なため、緩めてもタダ乗りリスクは増えない。
export const SAME_ORIGIN_RATE_PER_MINUTE = 60;

/** Cloudflare Workers Rate Limiting binding（データセンター単位で共有される本物のカウンタ）。 */
type EdgeRateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

/**
 * エッジ側の匿名用レート制限器を取得。wrangler.jsonc の unsafe binding API_RATE_LIMIT_ANON。
 * メモリ窓はアイソレート単位でしか数えられず分散すると貫通する(2026-07-16に実証)ため、
 * 本当の壁はこちら。ローカル/jest では取得に失敗して null → メモリ窓のみにフォールバック。
 */
async function getEdgeAnonLimiter(bindingName: string): Promise<EdgeRateLimiter | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const rl = (env as Record<string, unknown>)[bindingName] as EdgeRateLimiter | undefined;
    return rl && typeof rl.limit === 'function' ? rl : null;
  } catch {
    return null;
  }
}

/** スライディング窓レート制限器（純粋・テスト可能）。Workersのウォームアイソレート内でのみ有効。 */
export function createRateLimiter(windowMs: number = RATE_WINDOW_MS) {
  const buckets = new Map<string, number[]>();
  return {
    /** id を1回ヒットさせ、窓内の累計回数（この回を含む）を返す。 */
    hit(id: string, now: number = Date.now()): number {
      const recent = (buckets.get(id) ?? []).filter((t) => now - t < windowMs);
      recent.push(now);
      buckets.set(id, recent);
      if (buckets.size > 10_000) {
        for (const [k, v] of buckets) {
          if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
        }
      }
      return recent.length;
    },
    /** テスト用：状態クリア。 */
    reset() {
      buckets.clear();
    },
    size() {
      return buckets.size;
    },
  };
}

const limiter = createRateLimiter();

/** Authorization: Bearer xxx / x-api-key ヘッダから平文キーを取り出す。 */
export function extractApiKey(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (auth && /^Bearer\s+/i.test(auth)) {
    const v = auth.replace(/^Bearer\s+/i, '').trim();
    if (v) return v;
  }
  const x = request.headers.get('x-api-key');
  if (x && x.trim()) return x.trim();
  return null;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function rateHeaders(tier: ApiTier, usedInWindow: number, extra?: Record<string, string>): Record<string, string> {
  const policy = getTierPolicy(tier);
  return {
    'X-Api-Tier': tier,
    'X-RateLimit-Limit': String(policy.ratePerMinute),
    'X-RateLimit-Remaining': String(remainingInWindow(usedInWindow, tier)),
    'X-RateLimit-Window': '60',
    ...(extra ?? {}),
  };
}

function tooMany(tier: ApiTier, message: string, retryAfter = 30): Response {
  return new Response(JSON.stringify({ error: message, tier, docs: 'https://my-naishin.com/developers' }), {
    status: 429,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Retry-After': String(retryAfter),
      'X-Api-Tier': tier,
    },
  });
}

export type GateResult =
  | { allowed: true; tier: ApiTier; headers: Record<string, string>; cachePrivate: boolean }
  | { allowed: false; response: Response };

export interface GateOptions {
  /** 匿名の分速上限の上書き（既定は TIER_POLICIES.anonymous.ratePerMinute）。MCPなどバースト特性の異なる入口用。 */
  anonymousRatePerMinute?: number;
  /**
   * 使用するエッジ側バインディング名。既定 'API_RATE_LIMIT_ANON'。
   * 上限の異なる入口は専用バインディング（例: MCP='API_RATE_LIMIT_MCP'）を指定する
   * （バインディングのlimitは固定値のため）。false でエッジ制限を使わない。
   */
  edgeBinding?: string | false;
  /** メモリ窓のバケット名前空間。既定 'ip'。別入口（MCP等）は別バケットにして食い合いを防ぐ。 */
  bucket?: string;
}

/**
 * REST ルートの入口で呼ぶゲート。返り値が allowed:false ならその response をそのまま返す。
 * allowed:true なら headers（レート/ティア）を corsJson/corsCsv に渡し、cachePrivate でCDNキャッシュ可否を決める。
 */
export async function gateApiRequest(request: Request, options: GateOptions = {}): Promise<GateResult> {
  const presented = extractApiKey(request);

  // --- 有効キーの経路（ティア昇格＋月次クォータ＋計測） ---
  if (presented) {
    try {
      const rec = await lookupApiKey(await hashApiKey(presented));
      if (rec && rec.status === 'active') {
        const tier = rec.tier;
        const policy = getTierPolicy(tier);
        const usedWindow = limiter.hit(`key:${rec.id}`);
        if (usedWindow > policy.ratePerMinute) {
          return { allowed: false, response: tooMany(tier, 'レート上限（1分あたり）を超えました。', 30) };
        }
        // 月次クォータ（D1計測）。null＝計測不能なら可用性優先でスキップ。
        const usedMonth = await recordApiUsage(rec.id);
        if (usedMonth !== null && !isWithinMonthlyQuota(usedMonth, tier)) {
          return {
            allowed: false,
            response: tooMany(tier, '当月のクォータを超えました。上位プランは /developers をご覧ください。', 3600),
          };
        }
        const headers = rateHeaders(tier, usedWindow, {
          'X-Api-Key-Prefix': rec.prefix,
          ...(policy.monthlyQuota > 0 && usedMonth !== null
            ? { 'X-Quota-Limit': String(policy.monthlyQuota), 'X-Quota-Used': String(usedMonth) }
            : {}),
        });
        // 計測対象は毎回最新を返す（CDNでキャッシュしない）。
        return { allowed: true, tier, headers, cachePrivate: true };
      }
      // rec が null（無効キー or DB未接続）→ 匿名にフォールバック（401にしない）。
    } catch (err) {
      console.error('gateApiRequest key path skipped:', err instanceof Error ? err.message : err);
      // フォールスルーで匿名扱い
    }
  }

  // --- 匿名経路（キー無し or 無効） ---
  const tier: ApiTier = 'anonymous';
  const ip = clientIp(request);
  const bucket = options.bucket ?? 'ip';

  // 自サイトUIからの呼び出しは実ユーザー保護のため別枠（キャリアCGNATでは数千人が1IPを共有するため、
  // 厳しいper-IP上限を直に当てると冬ピークの実ユーザーを429にしうる）。
  if (request.headers.get('sec-fetch-site') === 'same-origin') {
    const used = limiter.hit(`${bucket}:${ip}`);
    if (used > SAME_ORIGIN_RATE_PER_MINUTE) {
      return {
        allowed: false,
        response: tooMany(tier, 'レート上限を超えました。しばらく待ってからお試しください。', 30),
      };
    }
    return {
      allowed: true,
      tier,
      headers: {
        'X-Api-Tier': tier,
        'X-RateLimit-Limit': String(SAME_ORIGIN_RATE_PER_MINUTE),
        'X-RateLimit-Remaining': String(Math.max(0, SAME_ORIGIN_RATE_PER_MINUTE - used)),
        'X-RateLimit-Window': '60',
      },
      cachePrivate: false,
    };
  }

  // 採用レーダー（ZZ-6e）: キー無し・自サイトUI以外（＝第三者サイトからの直接呼出）を検出。
  // Origin優先（CORSリクエストでブラウザが強制付与・偽装不能）、無ければReferer。fire-and-forget。
  const adoptionDomain = extractExternalDomain(request.headers.get('origin') ?? request.headers.get('referer'));
  if (adoptionDomain) {
    void persistAdoptionHit({ domain: adoptionDomain, source: 'api_anonymous', path: new URL(request.url).pathname });
  }

  // 第三者（CORS/サーバーサイド/直叩き）：エッジで本当に効く分速＋アイソレート内メモリ窓の二段構え。
  const policy = getTierPolicy(tier);
  const anonLimit = options.anonymousRatePerMinute ?? policy.ratePerMinute;
  const edge =
    options.edgeBinding === false ? null : await getEdgeAnonLimiter(options.edgeBinding ?? 'API_RATE_LIMIT_ANON');
  if (edge) {
    try {
      const { success } = await edge.limit({ key: ip });
      if (!success) {
        return {
          allowed: false,
          response: tooMany(tier, 'レート上限を超えました。継続利用は /developers で無料APIキーを発行してください。', 30),
        };
      }
    } catch {
      /* エッジ制限の失敗は可用性優先でスキップ（メモリ窓が残る） */
    }
  }
  const usedWindow = limiter.hit(`${bucket}:${ip}`);
  if (usedWindow > anonLimit) {
    return {
      allowed: false,
      response: tooMany(tier, 'レート上限を超えました。継続利用は /developers で無料APIキーを発行してください。', 30),
    };
  }
  return {
    allowed: true,
    tier,
    headers: {
      ...rateHeaders(tier, usedWindow),
      'X-RateLimit-Limit': String(anonLimit),
      'X-RateLimit-Remaining': String(Math.max(0, anonLimit - usedWindow)),
    },
    cachePrivate: false,
  };
}

/**
 * テスト専用：モジュール内シングルトンのレート制限器をクリアする。
 * Jestのテストリクエストはヘッダ無し（clientIp()が'unknown'にフォールバック）のため、
 * 同一テストファイル内の全リクエストが `ip:unknown` バケットを共有し、REST契約テストが
 * 増えるほど無関係なテスト同士がanonymousティアの1分間レート上限を食い合って
 * 429で偽落ちする（2026-07-11判明・S-5でエンドポイントを増やした際に顕在化）。
 */
export function resetApiRateLimiterForTests(): void {
  limiter.reset();
}
