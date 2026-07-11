import {
  LAUNCH_BATCHES,
  evaluateLaunchBatchStatus,
  formatLaunchBatchMarkdown,
  evaluateBatchGoStopVerdict,
  type GscPageRow,
  type LaunchPageStatus,
} from '@/lib/new-page-launch-tracker';

describe('LAUNCH_BATCHES', () => {
  it('全ルートが/で始まる一意なパス', () => {
    for (const batch of LAUNCH_BATCHES) {
      for (const route of batch.routes) {
        expect(route.startsWith('/')).toBe(true);
      }
      expect(new Set(batch.routes).size).toBe(batch.routes.length);
    }
  });

  it('全バッチでルートに重複が無い（同一面を二重計上しない）', () => {
    const allRoutes = LAUNCH_BATCHES.flatMap((b) => b.routes);
    expect(new Set(allRoutes).size).toBe(allRoutes.length);
  });

  it('全バッチがlaunchedAtIsoを持つ（GO/STOP判定の基準日）', () => {
    for (const batch of LAUNCH_BATCHES) {
      expect(batch.launchedAtIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe('evaluateLaunchBatchStatus', () => {
  const routes = ['/koukou-bairitsu', '/heigan-yuugu', '/tarinai-taisaku'];

  it('表示回数>0の面はindexed、GSCに現れない面はundiscoveredと判定する', () => {
    const gscPages: GscPageRow[] = [
      { keys: ['https://my-naishin.com/koukou-bairitsu'], clicks: 5, impressions: 120 },
      { keys: ['https://my-naishin.com/heigan-yuugu'], clicks: 0, impressions: 3 },
      // /tarinai-taisaku はGSCデータに一切出現しない
    ];
    const result = evaluateLaunchBatchStatus(routes, gscPages);
    expect(result.find((r) => r.route === '/koukou-bairitsu')?.status).toBe('indexed');
    expect(result.find((r) => r.route === '/heigan-yuugu')?.status).toBe('indexed');
    expect(result.find((r) => r.route === '/tarinai-taisaku')?.status).toBe('undiscovered');
  });

  it('表示回数0で出現する面はundiscoveredと判定する', () => {
    const gscPages: GscPageRow[] = [{ keys: ['https://my-naishin.com/koukou-bairitsu'], clicks: 0, impressions: 0 }];
    const result = evaluateLaunchBatchStatus(['/koukou-bairitsu'], gscPages);
    expect(result[0].status).toBe('undiscovered');
  });

  it('短縮パス（origin無し）でも突合できる', () => {
    const gscPages: GscPageRow[] = [{ keys: ['/koukou-bairitsu'], clicks: 1, impressions: 10 }];
    const result = evaluateLaunchBatchStatus(['/koukou-bairitsu'], gscPages);
    expect(result[0].status).toBe('indexed');
    expect(result[0].impressions).toBe(10);
  });
});

describe('formatLaunchBatchMarkdown', () => {
  const batch = LAUNCH_BATCHES[0];

  it('未発見面が無ければその旨を明記する', () => {
    const statuses = batch.routes.map((route) => ({ route, status: 'indexed' as const, impressions: 10, clicks: 1 }));
    const md = formatLaunchBatchMarkdown(batch, statuses);
    expect(md).toContain('未発見の面なし');
  });

  it('未発見面があれば一覧で列挙する', () => {
    const statuses = [
      { route: '/koukou-bairitsu', status: 'indexed' as const, impressions: 10, clicks: 1 },
      { route: '/heigan-yuugu', status: 'undiscovered' as const, impressions: 0, clicks: 0 },
    ];
    const md = formatLaunchBatchMarkdown(batch, statuses);
    expect(md).toContain('未発見');
    expect(md).toContain('/heigan-yuugu');
  });
});

describe('evaluateBatchGoStopVerdict（O-6：バッチ公開の効果検証GO/STOP判定）', () => {
  const testBatch = { label: 'テストバッチ', launchedAround: '2026-07-01', launchedAtIso: '2026-07-01', routes: ['/a', '/b', '/c', '/d'] };
  const statusesWith = (indexedCount: number): LaunchPageStatus[] =>
    testBatch.routes.map((route, i) => ({
      route,
      status: i < indexedCount ? 'indexed' : 'undiscovered',
      impressions: i < indexedCount ? 10 : 0,
      clicks: 0,
    }));

  it('14日未満はwait（インデックスラグの範囲内・判定保留）', () => {
    const v = evaluateBatchGoStopVerdict(testBatch, statusesWith(0), new Date('2026-07-05T00:00:00Z'));
    expect(v.verdict).toBe('wait');
    expect(v.daysSinceLaunch).toBe(4);
  });

  it('14日以上経過し離陸率70%以上ならgo', () => {
    const v = evaluateBatchGoStopVerdict(testBatch, statusesWith(3), new Date('2026-07-16T00:00:00Z')); // 15日経過・75%
    expect(v.verdict).toBe('go');
    expect(v.indexRate).toBeCloseTo(0.75);
  });

  it('21日以上経過し離陸率50%未満ならstop-investigate', () => {
    const v = evaluateBatchGoStopVerdict(testBatch, statusesWith(1), new Date('2026-07-23T00:00:00Z')); // 22日経過・25%
    expect(v.verdict).toBe('stop-investigate');
  });

  it('14〜20日経過で離陸率50-70%の中間帯はwait', () => {
    const v = evaluateBatchGoStopVerdict(testBatch, statusesWith(2), new Date('2026-07-16T00:00:00Z')); // 15日経過・50%
    expect(v.verdict).toBe('wait');
  });

  it('21日以上経過でも離陸率70%以上ならgo（stop優先ではない）', () => {
    const v = evaluateBatchGoStopVerdict(testBatch, statusesWith(4), new Date('2026-07-25T00:00:00Z')); // 24日経過・100%
    expect(v.verdict).toBe('go');
  });

  it('総ルート0件でも例外を投げない（indexRate=0）', () => {
    const emptyBatch = { ...testBatch, routes: [] };
    const v = evaluateBatchGoStopVerdict(emptyBatch, [], new Date('2026-08-01T00:00:00Z'));
    expect(v.indexRate).toBe(0);
    expect(v.totalCount).toBe(0);
  });
});
