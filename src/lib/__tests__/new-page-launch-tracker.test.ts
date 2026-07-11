import {
  LAUNCH_BATCHES,
  evaluateLaunchBatchStatus,
  formatLaunchBatchMarkdown,
  type GscPageRow,
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
