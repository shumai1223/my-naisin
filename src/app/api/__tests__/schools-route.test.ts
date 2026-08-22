/**
 * @jest-environment node
 *
 * 公開REST（/api/schools/{pref}）の契約テスト（Y-7）。
 * ルートハンドラを実際に呼び、Y-2/Y-6で構築した学校別入試競争率データの配信APIの形を固定する。
 */
import { GET as schoolsGet } from '@/app/api/schools/[pref]/route';
import { resetApiRateLimiterForTests } from '@/lib/api-auth';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

function req(url: string) {
  return new Request(url);
}

beforeEach(() => {
  resetApiRateLimiterForTests();
});

describe('/api/schools/{pref}（Y-7：学校別入試競争率の公開API）', () => {
  test('存在する県コードで学校別レコードを返す', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo'), {
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
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo'), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    const json = await res.json();
    expect(json.records.every((r: { commercialSourceOnly?: boolean }) => r.commercialSourceOnly !== true)).toBe(true);
  });

  test('存在しない県コードは404', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/nowhere'), {
      params: Promise.resolve({ pref: 'nowhere' }),
    });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('not_found');
  });

  test('?fiscalYearで特定年度のみに絞り込める', async () => {
    const file = COMPETITION_RATE_BY_PREFECTURE.tokyo!;
    const targetYear = file.sources[0].fiscalYear;
    const res = await schoolsGet(req(`https://my-naishin.com/api/schools/tokyo?fiscalYear=${encodeURIComponent(targetYear)}`), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    for (const r of json.records) {
      expect(r.fiscalYear ?? targetYear).toBe(targetYear);
    }
  });

  test('キー無しは匿名ティアのレートヘッダ付き＝後方互換でそのまま使える', async () => {
    const res = await schoolsGet(req('https://my-naishin.com/api/schools/tokyo'), {
      params: Promise.resolve({ pref: 'tokyo' }),
    });
    expect(res.headers.get('x-api-tier')).toBe('anonymous');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});
