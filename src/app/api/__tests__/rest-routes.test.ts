/**
 * @jest-environment node
 *
 * 公開REST（/api/naishin, /api/naishin/{code}, /api/naishin/compare, /api/openapi）の契約テスト。
 * ルートハンドラを実際に呼び、AI・開発者向けの一次データAPIの形を固定する。
 */
import { GET as indexGet } from '@/app/api/naishin/route';
import { GET as codeGet } from '@/app/api/naishin/[code]/route';
import { GET as compareGet } from '@/app/api/naishin/compare/route';
import { GET as csvGet } from '@/app/api/naishin/csv/route';
import { GET as openapiGet } from '@/app/api/openapi/route';
import { GET as statusGet } from '@/app/api/status/route';
import { GET as totalScoreIndexGet } from '@/app/api/total-score/route';
import { GET as totalScoreDetailGet } from '@/app/api/total-score/[code]/route';
import { GET as hensachiGet } from '@/app/api/hensachi/route';
import { GET as bairitsuGet } from '@/app/api/bairitsu/route';
import { GET as percentileTableGet } from '@/app/api/hensachi/percentile-table/route';
import { GET as educationCostGet } from '@/app/api/education-cost/route';
import { GET as pathToUniversityGet } from '@/app/api/education-cost/path-to-university/route';
import { resetApiRateLimiterForTests } from '@/lib/api-auth';

function req(url: string) {
  return new Request(url);
}

// Jestのテストリクエストはヘッダ無し＝clientIp()が'unknown'にフォールバックし、同一ファイル内の
// 全リクエストがip:unknownバケットを共有する。テストが増えるほど無関係な他describeとanonymousの
// 1分間レート上限を食い合って429偽落ちするため、テストごとにレート制限器をクリアする。
beforeEach(() => {
  resetApiRateLimiterForTests();
});

describe('/api/naishin（インデックス）', () => {
  test('47県・新エンドポイントメタを含む', async () => {
    const json = await (await indexGet(req('https://my-naishin.com/api/naishin'))).json();
    expect(json.prefectures).toHaveLength(47);
    expect(json.meta.endpoints.openapi).toContain('/api/openapi');
  });

  test('キー無しは匿名ティアのレートヘッダ付き＝後方互換でそのまま使える', async () => {
    const res = await indexGet(req('https://my-naishin.com/api/naishin'));
    expect(res.headers.get('x-api-tier')).toBe('anonymous');
    expect(res.headers.get('x-ratelimit-limit')).toBeTruthy();
    // 匿名はCDNキャッシュ維持（public）。
    expect(res.headers.get('cache-control')).toContain('public');
  });
});

describe('/api/status', () => {
  test('status:ok・データセット件数・エンドポイント一覧を返す（認証不要）', async () => {
    const res = await statusGet();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.status).toBe('ok');
    expect(json.dataset.prefectureCount).toBe(47);
    expect(json.endpoints.naishinIndex).toBe('/api/naishin');
    expect(typeof json.timestamp).toBe('string');
  });
});

describe('/api/total-score（E-4：総合得点方式のAPI化）', () => {
  test('一覧はregistryの5県のみ・apiUrl/toolUrlを含む', async () => {
    const json = await (await totalScoreIndexGet(req('https://my-naishin.com/api/total-score'))).json();
    expect(json.systems.length).toBeGreaterThanOrEqual(5);
    const hyogo = json.systems.find((s: { code: string }) => s.code === 'hyogo');
    expect(hyogo.apiUrl).toBe('https://my-naishin.com/api/total-score/hyogo');
    expect(hyogo.toolUrl).toBe('https://my-naishin.com/hyogo/total-score');
  });

  test('詳細：計算式・出典を含む', async () => {
    const res = await totalScoreDetailGet(req('https://my-naishin.com/api/total-score/hyogo'), {
      params: Promise.resolve({ code: 'hyogo' }),
    });
    const json = await res.json();
    expect(json.code).toBe('hyogo');
    expect(json.source.url).toContain('hyogo-c.ed.jp');
  });

  test('academicRaw/reportRaw指定で総合得点を計算する', async () => {
    const res = await totalScoreDetailGet(
      req('https://my-naishin.com/api/total-score/hyogo?academicRaw=500&reportRaw=250'),
      { params: Promise.resolve({ code: 'hyogo' }) },
    );
    const json = await res.json();
    expect(json.mode).toBe('compute');
    expect(json.total).toBe(500);
  });

  test('targetTotal/reportRaw指定で必要学力点を逆算する', async () => {
    const res = await totalScoreDetailGet(
      req('https://my-naishin.com/api/total-score/hyogo?targetTotal=500&reportRaw=250'),
      { params: Promise.resolve({ code: 'hyogo' }) },
    );
    const json = await res.json();
    expect(json.mode).toBe('reverse');
    expect(json.requiredAcademicRaw).toBe(500);
  });

  test('未知の県コードは404', async () => {
    const res = await totalScoreDetailGet(req('https://my-naishin.com/api/total-score/nowhere'), {
      params: Promise.resolve({ code: 'nowhere' }),
    });
    expect(res.status).toBe(404);
  });
});

describe('/api/hensachi（S-5：偏差値の計算・逆算・順位変換）', () => {
  test('パラメータ無しはメタ情報（エンドポイント一覧）を返す', async () => {
    const json = await (await hensachiGet(req('https://my-naishin.com/api/hensachi'))).json();
    expect(json.meta.endpoints.compute).toContain('score=');
    expect(json.meta.toolUrl).toBe('https://my-naishin.com/hensachi');
  });

  test('score/average/stdDev指定で偏差値を計算する', async () => {
    const json = await (
      await hensachiGet(req('https://my-naishin.com/api/hensachi?score=70&average=60&stdDev=10'))
    ).json();
    expect(json.mode).toBe('compute');
    expect(json.hensachi).toBe(60);
  });

  test('targetHensachi指定で必要点数を逆算する', async () => {
    const json = await (
      await hensachiGet(req('https://my-naishin.com/api/hensachi?targetHensachi=60&average=60&stdDev=10'))
    ).json();
    expect(json.mode).toBe('reverse');
    expect(json.requiredScore).toBe(70);
  });

  test('rank/population指定で順位から偏差値を逆算する', async () => {
    const json = await (
      await hensachiGet(req('https://my-naishin.com/api/hensachi?rank=150&population=300'))
    ).json();
    expect(json.mode).toBe('rank_to_hensachi');
    expect(json.hensachi).toBeCloseTo(50, 1);
  });

  test('hensachi/population指定で偏差値から順位を算出する', async () => {
    const json = await (
      await hensachiGet(req('https://my-naishin.com/api/hensachi?hensachi=50&population=300'))
    ).json();
    expect(json.mode).toBe('hensachi_to_rank');
    expect(json.rank).toBe(150);
  });

  test('不正なパラメータ（stdDev=0）は400', async () => {
    const res = await hensachiGet(req('https://my-naishin.com/api/hensachi?score=70&average=60&stdDev=0'));
    expect(res.status).toBe(400);
  });

  test('不正なパラメータ（population未指定でrank指定）は400', async () => {
    const res = await hensachiGet(req('https://my-naishin.com/api/hensachi?rank=10'));
    expect(res.status).toBe(400);
  });
});

describe('/api/bairitsu（S-5：高校入試の倍率計算）', () => {
  test('パラメータ無しはメタ情報（エンドポイント一覧）を返す', async () => {
    const json = await (await bairitsuGet(req('https://my-naishin.com/api/bairitsu'))).json();
    expect(json.meta.endpoints.applicationRatio).toContain('applicants=');
    expect(json.meta.toolUrl).toBe('https://my-naishin.com/koukou-bairitsu');
  });

  test('applicants/capacity指定で志願倍率を計算する', async () => {
    const json = await (
      await bairitsuGet(req('https://my-naishin.com/api/bairitsu?applicants=120&capacity=80'))
    ).json();
    expect(json.mode).toBe('application_ratio');
    expect(json.ratio).toBe(1.5);
  });

  test('testTakers/passers指定で実質倍率を計算する', async () => {
    const json = await (
      await bairitsuGet(req('https://my-naishin.com/api/bairitsu?testTakers=160&passers=80'))
    ).json();
    expect(json.mode).toBe('actual_ratio');
    expect(json.ratio).toBe(2);
  });

  test('募集人員0（不正）は400', async () => {
    const res = await bairitsuGet(req('https://my-naishin.com/api/bairitsu?applicants=100&capacity=0'));
    expect(res.status).toBe(400);
  });
});

describe('/api/hensachi/percentile-table（E-4）', () => {
  test('既定の代表偏差値で対応表を返す', async () => {
    const json = await (
      await percentileTableGet(req('https://my-naishin.com/api/hensachi/percentile-table'))
    ).json();
    expect(json.table.length).toBeGreaterThan(0);
    expect(json.table.find((r: { h: number }) => r.h === 50).upperPercent).toBeCloseTo(50, 4);
  });

  test('?values=で任意の偏差値を指定できる', async () => {
    const json = await (
      await percentileTableGet(req('https://my-naishin.com/api/hensachi/percentile-table?values=60,70'))
    ).json();
    expect(json.table).toHaveLength(2);
    expect(json.table[0].h).toBe(60);
  });

  test('不正なvaluesは400', async () => {
    const res = await percentileTableGet(
      req('https://my-naishin.com/api/hensachi/percentile-table?values=abc'),
    );
    expect(res.status).toBe(400);
  });
});

describe('/api/education-cost（E-4）', () => {
  test('既定値（中1・公立・公立・塾なし）で計算する', async () => {
    const json = await (
      await educationCostGet(req('https://my-naishin.com/api/education-cost'))
    ).json();
    expect(json.result.total).toBeGreaterThan(0);
    expect(json.input.currentGrade).toBe(1);
  });

  test('パラメータ指定で計算する', async () => {
    const json = await (
      await educationCostGet(
        req('https://my-naishin.com/api/education-cost?currentGrade=3&juniorCourse=public&highCourse=private&jukuType=kobetsu'),
      )
    ).json();
    expect(json.input.highCourse).toBe('private');
    expect(json.result.juniorRemainingYears).toBe(1);
  });

  test('不正なcurrentGradeは400', async () => {
    const res = await educationCostGet(req('https://my-naishin.com/api/education-cost?currentGrade=9'));
    expect(res.status).toBe(400);
  });
});

describe('/api/education-cost/path-to-university（E-4）', () => {
  test('既定値（公立高・under590・国立・自宅）で計算する', async () => {
    const json = await (
      await pathToUniversityGet(req('https://my-naishin.com/api/education-cost/path-to-university'))
    ).json();
    expect(json.result.total).toBeGreaterThan(0);
  });

  test('不正なuniversityTypeは400', async () => {
    const res = await pathToUniversityGet(
      req('https://my-naishin.com/api/education-cost/path-to-university?universityType=harvard'),
    );
    expect(res.status).toBe(400);
  });
});

describe('/api/naishin/csv', () => {
  test('text/csv・BOM付き・ヘッダ＋47行で配布', async () => {
    const res = await csvGet(req('https://my-naishin.com/api/naishin/csv'));
    expect(res.headers.get('content-type')).toContain('text/csv');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    // BOMはバイト列(EF BB BF)で検証する。Response.text() は先頭BOMを剥がすため byte で確認。
    const bytes = new Uint8Array(await res.clone().arrayBuffer());
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);
    // text() はBOMを剥がして返すので、そのまま行分割すればヘッダ＋47行。
    const lines = (await res.text()).split('\r\n');
    expect(lines).toHaveLength(48);
    expect(lines[0]).toContain('code,name,region');
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

  test('S-5：hensachi/total-score系エンドポイントが記載されている（従来は未記載だった穴）', async () => {
    const json = await (await openapiGet()).json();
    expect(json.paths['/api/hensachi']).toBeDefined();
    expect(json.paths['/api/hensachi/percentile-table']).toBeDefined();
    expect(json.paths['/api/total-score']).toBeDefined();
    expect(json.paths['/api/total-score/{code}']).toBeDefined();
  });

  test('S-5：bairitsu/education-cost系エンドポイントが記載されている', async () => {
    const json = await (await openapiGet()).json();
    expect(json.paths['/api/bairitsu']).toBeDefined();
    expect(json.paths['/api/education-cost']).toBeDefined();
    expect(json.paths['/api/education-cost/path-to-university']).toBeDefined();
  });

  test('S-1⑥：匿名統計エンドポイントが記載されている', async () => {
    const json = await (await openapiGet()).json();
    expect(json.paths['/api/stats/distribution']).toBeDefined();
  });

  test('N-7：匿名統計CSV配布エンドポイントが記載されている', async () => {
    const json = await (await openapiGet()).json();
    expect(json.paths['/api/stats/csv']).toBeDefined();
  });
});
