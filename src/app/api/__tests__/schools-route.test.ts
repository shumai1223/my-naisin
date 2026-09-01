/**
 * @jest-environment node
 *
 * 公開REST（/api/schools/{pref}）の契約テスト（Y-7）。
 * ルートハンドラを実際に呼び、Y-2/Y-6で構築した学校別入試競争率データの配信APIの形を固定する。
 *
 * 2026-09-01(API1-1): 提案書が「無償公開APIではキー登録が必要（Business以上）」を前提にしているため、
 * このルートはBusiness以上のキーを必須にした。api-keysをモックしてビジネスティアのキーを模擬する。
 */
jest.mock('@/lib/api-keys', () => ({
  hashApiKey: jest.fn(async (s: string) => s),
  lookupApiKey: jest.fn(async (hash: string) => {
    if (hash === 'business-test-key') {
      return { id: 1, tier: 'business', status: 'active' as const, prefix: 'mnsk_live_test' };
    }
    if (hash === 'pro-test-key') {
      return { id: 2, tier: 'pro', status: 'active' as const, prefix: 'mnsk_live_pro' };
    }
    return null;
  }),
  recordApiUsage: jest.fn(async () => null),
}));

import { GET as schoolsGet } from '@/app/api/schools/[pref]/route';
import { resetApiRateLimiterForTests } from '@/lib/api-auth';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

function req(url: string, headers?: Record<string, string>) {
  return new Request(url, { headers });
}

const BIZ_HEADERS = { 'x-api-key': 'business-test-key' };

beforeEach(() => {
  resetApiRateLimiterForTests();
});

describe('/api/schools/{pref}（Y-7：学校別入試競争率の公開API・Business以上限定）', () => {
  test('Business以上のキーで学校別レコードを返す', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo', BIZ_HEADERS), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.prefectureCode).toBe('tokyo');
    expect(Array.isArray(json.records)).toBe(true);
    expect(json.records.length).toBeGreaterThan(0);
    expect(json.recordCount).toBe(json.records.length);
    expect(Array.isArray(json.sources)).toBe(true);
    expect(json.coverage).toBeDefined();
  });

  test('commercialSourceOnlyのレコードはlicensableRecords()により配布から除外される', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo', BIZ_HEADERS), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    const json = await res.json();
    expect(json.records.every((r: { commercialSourceOnly?: boolean }) => r.commercialSourceOnly !== true)).toBe(true);
  });

  test('Business以上のキーでも存在しない県コードは404', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/nowhere', BIZ_HEADERS), {
      params: Promise.resolve({ pref: 'nowhere' }),
    });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('not_found');
  });

  test('?fiscalYearで特定年度のみに絞り込める', async () => {
    const file = COMPETITION_RATE_BY_PREFECTURE.tokyo!;
    const targetYear = file.sources[0].fiscalYear;
    const res = await schoolsGet(
      req(`https://my-naishin.com/api/schools/tokyo?fiscalYear=${encodeURIComponent(targetYear)}`, BIZ_HEADERS),
      { params: Promise.resolve({ pref: 'tokyo' }) }
    );
    const json = await res.json();
    expect(res.status).toBe(200);
    for (const r of json.records) {
      expect(r.fiscalYear ?? targetYear).toBe(targetYear);
    }
  });

  test('Business以上のキーはX-Api-Tier: businessヘッダ付きで許可される', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo', BIZ_HEADERS), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    expect(res.headers.get('x-api-tier')).toBe('business');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  test('キー無し(匿名)は402で拒否され、理由と申込先(/developers)が本文に含まれる（無言の403にしない）', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo'), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    expect(res.status).toBe(402);
    const json = await res.json();
    expect(json.error).toBe('tier_required');
    expect(json.currentTier).toBe('anonymous');
    expect(json.requiredTier).toBe('business');
    expect(json.message).toContain('/developers');
    expect(json.docs).toBe('https://my-naishin.com/developers');
  });

  test('free/pro相当のキー（Business未満）も402で拒否される', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo', { 'x-api-key': 'pro-test-key' }), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    expect(res.status).toBe(402);
    const json = await res.json();
    expect(json.currentTier).toBe('pro');
    expect(json.requiredTier).toBe('business');
  });
});
