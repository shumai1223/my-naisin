/**
 * @jest-environment node
 *
 * 公開データAPIの課金ゲート（堀B）の不変条件テスト。
 * D1非依存の純粋ロジック（ティア表・レート器・キー抽出・匿名ゲート）を固定する。
 * api-auth → api-cors → next/server が global Request を要するため node 環境で実行する。
 */

import {
  TIER_POLICIES,
  normalizeTier,
  getTierPolicy,
  isWithinMonthlyQuota,
  remainingInWindow,
  formatTierPrice,
  periodKey,
} from '../api-tiers';
import { createRateLimiter, extractApiKey, gateApiRequest, SAME_ORIGIN_RATE_PER_MINUTE } from '../api-auth';
import { computeFreemiumFunnel } from '../api-keys';

describe('api-tiers（ティア表の正準データ）', () => {
  test('4ティアが揃い、レートは anonymous < free < pro < scale で単調増加', () => {
    const order = ['anonymous', 'free', 'pro', 'scale'] as const;
    const rates = order.map((t) => TIER_POLICIES[t].ratePerMinute);
    for (let i = 1; i < rates.length; i += 1) {
      expect(rates[i]).toBeGreaterThan(rates[i - 1]);
    }
  });

  test('normalizeTier は不正値を free に丸め、pro/scale は保持', () => {
    expect(normalizeTier('pro')).toBe('pro');
    expect(normalizeTier('scale')).toBe('scale');
    expect(normalizeTier('free')).toBe('free');
    expect(normalizeTier('nonsense')).toBe('free');
    expect(normalizeTier(null)).toBe('free');
    expect(normalizeTier(undefined)).toBe('free');
  });

  test('月次クォータ判定：quota=0 は無制限、有限クォータは境界で false', () => {
    // free は 10,000
    expect(isWithinMonthlyQuota(9_999, 'free')).toBe(true);
    expect(isWithinMonthlyQuota(10_000, 'free')).toBe(false);
    // scale は quota 0（無制限）
    expect(isWithinMonthlyQuota(10_000_000, 'scale')).toBe(true);
    // anonymous も月次は数えない（0=無制限扱い）
    expect(isWithinMonthlyQuota(10_000_000, 'anonymous')).toBe(true);
  });

  test('remainingInWindow は 0 未満にならない', () => {
    expect(remainingInWindow(0, 'free')).toBe(getTierPolicy('free').ratePerMinute);
    expect(remainingInWindow(999_999, 'free')).toBe(0);
  });

  test('formatTierPrice：無料/有料/個別の表記', () => {
    expect(formatTierPrice('anonymous')).toBe('無料');
    expect(formatTierPrice('free')).toBe('無料');
    expect(formatTierPrice('pro')).toContain('¥');
    expect(formatTierPrice('scale')).toBe('個別見積り');
  });

  test('periodKey は YYYY-MM 形式（UTC基準）', () => {
    expect(periodKey(new Date('2026-06-27T00:00:00Z'))).toBe('2026-06');
    expect(periodKey(new Date('2026-12-31T23:59:59Z'))).toBe('2026-12');
    expect(periodKey(new Date('2027-01-01T00:00:00Z'))).toBe('2027-01');
  });
});

describe('createRateLimiter（スライディング窓）', () => {
  test('同一idの窓内ヒットは累積、窓を越えるとリセット', () => {
    const rl = createRateLimiter(60_000);
    const t0 = 1_000_000;
    expect(rl.hit('a', t0)).toBe(1);
    expect(rl.hit('a', t0 + 1000)).toBe(2);
    expect(rl.hit('a', t0 + 2000)).toBe(3);
    // 全ヒット（最後は t0+2000）が窓（60s）外になる時点でリセット＝1 に戻る
    expect(rl.hit('a', t0 + 62_001)).toBe(1);
  });

  test('idごとに独立してカウント', () => {
    const rl = createRateLimiter();
    const t = 5_000_000;
    expect(rl.hit('x', t)).toBe(1);
    expect(rl.hit('y', t)).toBe(1);
    expect(rl.hit('x', t)).toBe(2);
  });
});

describe('extractApiKey（ヘッダ抽出）', () => {
  const req = (headers: Record<string, string>) => new Request('https://my-naishin.com/api/naishin', { headers });

  test('Authorization: Bearer から取り出す（大小無視）', () => {
    expect(extractApiKey(req({ Authorization: 'Bearer mnsk_live_abc' }))).toBe('mnsk_live_abc');
    expect(extractApiKey(req({ authorization: 'bearer mnsk_live_xyz' }))).toBe('mnsk_live_xyz');
  });

  test('x-api-key から取り出す', () => {
    expect(extractApiKey(req({ 'x-api-key': 'mnsk_live_123' }))).toBe('mnsk_live_123');
  });

  test('キー無しは null', () => {
    expect(extractApiKey(req({}))).toBeNull();
  });
});

describe('gateApiRequest（匿名経路：D1未接続でも壊れない）', () => {
  test('キー無しは匿名ティアで許可＝CDNキャッシュ維持（後方互換）', async () => {
    const res = await gateApiRequest(
      new Request('https://my-naishin.com/api/naishin', { headers: { 'cf-connecting-ip': '203.0.113.10' } })
    );
    expect(res.allowed).toBe(true);
    if (res.allowed) {
      expect(res.tier).toBe('anonymous');
      expect(res.cachePrivate).toBe(false);
      expect(res.headers['X-Api-Tier']).toBe('anonymous');
      expect(res.headers['X-RateLimit-Limit']).toBe(String(TIER_POLICIES.anonymous.ratePerMinute));
    }
  });

  test('同一IPが匿名レートを超えると 429', async () => {
    const ip = '203.0.113.99';
    const limit = TIER_POLICIES.anonymous.ratePerMinute;
    let last: Awaited<ReturnType<typeof gateApiRequest>> | null = null;
    for (let i = 0; i < limit + 2; i += 1) {
      last = await gateApiRequest(
        new Request('https://my-naishin.com/api/naishin', { headers: { 'cf-connecting-ip': ip } })
      );
    }
    expect(last!.allowed).toBe(false);
    if (last && !last.allowed) {
      expect(last.response.status).toBe(429);
    }
  });

  // 2026-07-16: 匿名を5/分へ厳格化した際の実ユーザー保護。自サイトUI(StudyPlanCalculator等)は
  // ブラウザが偽装不能な Sec-Fetch-Site: same-origin を送るため、別枠(30/分)で守られる。
  test('same-origin(自サイトUI)は匿名の厳格上限を超えても別枠(30/分)で許可される', async () => {
    const ip = '203.0.113.150';
    const strictLimit = TIER_POLICIES.anonymous.ratePerMinute;
    let last: Awaited<ReturnType<typeof gateApiRequest>> | null = null;
    for (let i = 0; i < strictLimit + 3; i += 1) {
      last = await gateApiRequest(
        new Request('https://my-naishin.com/api/naishin', {
          headers: { 'cf-connecting-ip': ip, 'sec-fetch-site': 'same-origin' },
        })
      );
    }
    expect(last!.allowed).toBe(true);
    if (last && last.allowed) {
      expect(last.headers['X-RateLimit-Limit']).toBe(String(SAME_ORIGIN_RATE_PER_MINUTE));
    }
  });

  test('same-originでも緩和上限(30/分)を超えると 429', async () => {
    const ip = '203.0.113.151';
    let last: Awaited<ReturnType<typeof gateApiRequest>> | null = null;
    for (let i = 0; i < SAME_ORIGIN_RATE_PER_MINUTE + 2; i += 1) {
      last = await gateApiRequest(
        new Request('https://my-naishin.com/api/naishin', {
          headers: { 'cf-connecting-ip': ip, 'sec-fetch-site': 'same-origin' },
        })
      );
    }
    expect(last!.allowed).toBe(false);
    if (last && !last.allowed) {
      expect(last.response.status).toBe(429);
    }
  });

  test('cross-site(第三者サイトのCORS)はsame-origin別枠の対象外＝厳格上限が適用される', async () => {
    const ip = '203.0.113.152';
    const strictLimit = TIER_POLICIES.anonymous.ratePerMinute;
    let last: Awaited<ReturnType<typeof gateApiRequest>> | null = null;
    for (let i = 0; i < strictLimit + 2; i += 1) {
      last = await gateApiRequest(
        new Request('https://my-naishin.com/api/naishin', {
          headers: { 'cf-connecting-ip': ip, 'sec-fetch-site': 'cross-site' },
        })
      );
    }
    expect(last!.allowed).toBe(false);
  });
});

describe('computeFreemiumFunnel（D1非依存の転換率計算）', () => {
  test('メール登録0件は転換率0（ゼロ除算を起こさない）', () => {
    const f = computeFreemiumFunnel({
      issuedFree: 5,
      activatedFree: 2,
      activeThisMonthFree: 1,
      issuedPaid: 0,
      distinctFreeEmails: 0,
      convertedEmails: 0,
    });
    expect(f.conversionRate).toBe(0);
  });

  test('転換率 = convertedEmails / distinctFreeEmails', () => {
    const f = computeFreemiumFunnel({
      issuedFree: 100,
      activatedFree: 40,
      activeThisMonthFree: 20,
      issuedPaid: 5,
      distinctFreeEmails: 25,
      convertedEmails: 5,
    });
    expect(f.conversionRate).toBe(0.2);
  });

  test('入力カウントをそのまま透過する', () => {
    const f = computeFreemiumFunnel({
      issuedFree: 10,
      activatedFree: 8,
      activeThisMonthFree: 6,
      issuedPaid: 2,
      distinctFreeEmails: 4,
      convertedEmails: 1,
    });
    expect(f.issuedFree).toBe(10);
    expect(f.activatedFree).toBe(8);
    expect(f.activeThisMonthFree).toBe(6);
    expect(f.issuedPaid).toBe(2);
  });
});
