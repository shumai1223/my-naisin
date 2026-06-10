/**
 * @jest-environment node
 *
 * 公開REST（/api/naishin, /api/naishin/{code}, /api/naishin/compare, /api/openapi）の契約テスト。
 * ルートハンドラを実際に呼び、AI・開発者向けの一次データAPIの形を固定する。
 */
import { GET as indexGet } from '@/app/api/naishin/route';
import { GET as codeGet } from '@/app/api/naishin/[code]/route';
import { GET as compareGet } from '@/app/api/naishin/compare/route';
import { GET as openapiGet } from '@/app/api/openapi/route';

function req(url: string) {
  return new Request(url);
}

describe('/api/naishin（インデックス）', () => {
  test('47県・新エンドポイントメタを含む', async () => {
    const json = await (await indexGet()).json();
    expect(json.prefectures).toHaveLength(47);
    expect(json.meta.endpoints.openapi).toContain('/api/openapi');
  });
});

describe('/api/naishin/{code}', () => {
  test('詳細（計算例つき）を返す', async () => {
    const res = await codeGet(req('https://my-naishin.com/api/naishin/tokyo'), {
      params: Promise.resolve({ code: 'tokyo' }),
    });
    const json = await res.json();
    expect(json.code).toBe('tokyo');
    expect(json.examples).toHaveLength(3);
  });

  test('?target= で逆算モード', async () => {
    const res = await codeGet(req('https://my-naishin.com/api/naishin/tokyo?target=52'), {
      params: Promise.resolve({ code: 'tokyo' }),
    });
    const json = await res.json();
    expect(json.mode).toBe('reverse');
    expect(json.requiredAverageGrade).toBe(4);
    expect(json.perGradeGain).toBeDefined();
  });

  test('?target=&weeks=&current= で学習計画を同梱', async () => {
    const res = await codeGet(req('https://my-naishin.com/api/naishin/tokyo?target=60&weeks=10&current=40'), {
      params: Promise.resolve({ code: 'tokyo' }),
    });
    const json = await res.json();
    expect(json.studyPlan).toBeDefined();
    expect(json.studyPlan.milestones).toHaveLength(10);
  });

  test('存在しない県は404', async () => {
    const res = await codeGet(req('https://my-naishin.com/api/naishin/atlantis'), {
      params: Promise.resolve({ code: 'atlantis' }),
    });
    expect(res.status).toBe(404);
  });
});

describe('/api/naishin/compare', () => {
  test('複数県を比較（オール5で東京=65）', async () => {
    const res = await compareGet(req('https://my-naishin.com/api/naishin/compare?codes=tokyo,osaka&grade=5'));
    const json = await res.json();
    expect(json.results).toHaveLength(2);
    const tokyo = json.results.find((r: { code: string }) => r.code === 'tokyo');
    expect(tokyo.total).toBe(65);
  });

  test('codes未指定は400', async () => {
    const res = await compareGet(req('https://my-naishin.com/api/naishin/compare'));
    expect(res.status).toBe(400);
  });
});

describe('/api/openapi', () => {
  test('OpenAPI 3.1 仕様を返す', async () => {
    const json = await (await openapiGet()).json();
    expect(json.openapi).toBe('3.1.0');
    expect(json.paths['/api/naishin']).toBeDefined();
    expect(json.paths['/api/naishin/compare']).toBeDefined();
  });
});
