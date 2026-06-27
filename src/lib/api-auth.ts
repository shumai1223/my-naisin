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
import {
  getTierPolicy,
  isWithinMonthlyQuota,
  RATE_WINDOW_MS,
  remainingInWindow,
  type ApiTier,
} from './api-tiers';

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

/**
 * REST ルートの入口で呼ぶゲート。返り値が allowed:false ならその response をそのまま返す。
 * allowed:true なら headers（レート/ティア）を corsJson/corsCsv に渡し、cachePrivate でCDNキャッシュ可否を決める。
 */
export async function gateApiRequest(request: Request): Promise<GateResult> {
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

  // --- 匿名経路（キー無し or 無効）：IP単位のベストエフォート窓＋CDNキャッシュ維持 ---
  const tier: ApiTier = 'anonymous';
  const policy = getTierPolicy(tier);
  const usedWindow = limiter.hit(`ip:${clientIp(request)}`);
  if (usedWindow > policy.ratePerMinute) {
    return {
      allowed: false,
      response: tooMany(tier, 'レート上限を超えました。継続利用は /developers で無料APIキーを発行してください。', 30),
    };
  }
  return { allowed: true, tier, headers: rateHeaders(tier, usedWindow), cachePrivate: false };
}
