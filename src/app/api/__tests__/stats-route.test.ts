/**
 * @jest-environment node
 *
 * 匿名統計API（/api/stats/submit・/api/stats/distribution）の契約テスト（TIER N-3）。
 * D1バインディング未設定（テスト環境）を前提に、no-opフォールバック契約を固定する。
 */
import { POST as submitPOST } from '@/app/api/stats/submit/route';
import { GET as distributionGET } from '@/app/api/stats/distribution/route';
import { GET as percentileGET } from '@/app/api/stats/percentile/route';
import { GET as csvGET } from '@/app/api/stats/csv/route';
import type { NextRequest } from 'next/server';

function submitReq(body: unknown, opts: { ip?: string; contentLength?: string } = {}) {
  const raw = JSON.stringify(body);
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'cf-connecting-ip': opts.ip ?? 'test-default',
  };
  if (opts.contentLength) headers['content-length'] = opts.contentLength;
  return new Request('https://my-naishin.com/api/stats/submit', { method: 'POST', headers, body: raw }) as unknown as NextRequest;
}

function distributionReq(query: string, opts: { ip?: string } = {}) {
  return new Request(`https://my-naishin.com/api/stats/distribution${query}`, {
    headers: { 'cf-connecting-ip': opts.ip ?? 'test-default' },
  });
}

describe('/api/stats/submit 契約', () => {
  test('妥当な投稿はsuccess:true・D1未設定なのでsaved:false（no-op契約）', async () => {
    const res = await submitPOST(submitReq({ metric: 'naishin', value: 40, maxValue: 45, prefectureCode: 'tokyo' }, { ip: '2.1.1.1' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.saved).toBe(false);
  });

  test('不正なmetricは400', async () => {
    const res = await submitPOST(submitReq({ metric: 'unknown-metric', value: 40 }, { ip: '2.1.1.2' }));
    expect(res.status).toBe(400);
  });

  test('valueが数値でないと400', async () => {
    const res = await submitPOST(submitReq({ metric: 'naishin', value: 'forty' }, { ip: '2.1.1.3' }));
    expect(res.status).toBe(400);
  });

  test('content-lengthが上限超過なら413', async () => {
    const res = await submitPOST(submitReq({ metric: 'naishin', value: 40 }, { ip: '2.1.1.4', contentLength: '99999' }));
    expect(res.status).toBe(413);
  });

  test('同一IPの連打は11回目で429（ベストエフォート流量制限）', async () => {
    const ip = '9.9.9.10';
    let last: Response | undefined;
    for (let i = 0; i < 11; i++) {
      last = await submitPOST(submitReq({ metric: 'naishin', value: 40 }, { ip }));
    }
    expect(last!.status).toBe(429);
  });
});

describe('/api/stats/distribution 契約', () => {
  test('metric未指定は400', async () => {
    const res = await distributionGET(distributionReq('', { ip: '3.1.1.1' }));
    expect(res.status).toBe(400);
  });

  test('不正なmetricは400', async () => {
    const res = await distributionGET(distributionReq('?metric=unknown', { ip: '3.1.1.2' }));
    expect(res.status).toBe(400);
  });

  test('妥当なmetricはD1未設定なのでinsufficientData:true・aggregate:null（捏造しない契約）', async () => {
    const res = await distributionGET(distributionReq('?metric=naishin', { ip: '3.1.1.3' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.insufficientData).toBe(true);
    expect(json.aggregate).toBeNull();
    expect(json.meta.metric).toBe('naishin');
  });

  test('prefectureを指定してもmetaに反映される', async () => {
    const res = await distributionGET(distributionReq('?metric=hensachi&prefecture=osaka', { ip: '3.1.1.4' }));
    const json = await res.json();
    expect(json.meta.prefecture).toBe('osaka');
  });
});

describe('/api/stats/percentile 契約（T-1：紹介・解放機構の中身）', () => {
  test('metric未指定は400', async () => {
    const res = await percentileGET(distributionReq('?value=40', { ip: '4.1.1.1' }));
    expect(res.status).toBe(400);
  });

  test('不正なmetricは400', async () => {
    const res = await percentileGET(distributionReq('?metric=unknown&value=40', { ip: '4.1.1.2' }));
    expect(res.status).toBe(400);
  });

  test('valueが数値でない・未指定は400', async () => {
    const res1 = await percentileGET(distributionReq('?metric=naishin', { ip: '4.1.1.3' }));
    expect(res1.status).toBe(400);
    const res2 = await percentileGET(distributionReq('?metric=naishin&value=abc', { ip: '4.1.1.4' }));
    expect(res2.status).toBe(400);
  });

  test('妥当なパラメータはD1未設定なのでinsufficientData:true・result:null（捏造しない契約）', async () => {
    const res = await percentileGET(distributionReq('?metric=hensachi&value=58', { ip: '4.1.1.5' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.insufficientData).toBe(true);
    expect(json.result).toBeNull();
    expect(json.meta.metric).toBe('hensachi');
    expect(json.meta.value).toBe(58);
  });

  test('prefectureを指定してもmetaに反映される', async () => {
    const res = await percentileGET(distributionReq('?metric=naishin&value=40&prefecture=osaka', { ip: '4.1.1.6' }));
    const json = await res.json();
    expect(json.meta.prefecture).toBe('osaka');
  });

  test('prefecture未指定時はprefectureResult/prefectureInsufficientDataが両方null（Ω-1：全国と県内を独立判定する契約）', async () => {
    const res = await percentileGET(distributionReq('?metric=naishin&value=40', { ip: '4.1.1.7' }));
    const json = await res.json();
    expect(json.prefectureResult).toBeNull();
    expect(json.prefectureInsufficientData).toBeNull();
  });

  test('prefecture指定時はD1未設定でprefectureInsufficientData:true・prefectureResult:null（Ω-1：県内パーセンタイルも捏造しない契約）', async () => {
    const res = await percentileGET(distributionReq('?metric=naishin&value=40&prefecture=osaka', { ip: '4.1.1.8' }));
    const json = await res.json();
    expect(json.prefectureInsufficientData).toBe(true);
    expect(json.prefectureResult).toBeNull();
    // 全国側(result)はprefecture指定の有無に関わらず常に全国集計であるべき契約
    expect(json.insufficientData).toBe(true);
    expect(json.result).toBeNull();
  });
});

describe('/api/stats/csv 契約（TIER N-7）', () => {
  test('CSVを返す（Content-Type text/csv・3指標ぶんの行）', async () => {
    const req = new Request('https://my-naishin.com/api/stats/csv', { headers: { 'cf-connecting-ip': '3.2.1.1' } });
    const res = await csvGET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    const text = await res.text();
    const lines = text.trim().split('\n');
    expect(lines).toHaveLength(4); // header + naishin/hensachi/total-score
    expect(lines[0]).toContain('metric,metric_label,sample_count,insufficient_data');
  });

  test('D1未設定のテスト環境ではinsufficient_data=trueで捏造しない契約', async () => {
    const req = new Request('https://my-naishin.com/api/stats/csv', { headers: { 'cf-connecting-ip': '3.2.1.2' } });
    const res = await csvGET(req);
    const text = await res.text();
    expect(text).toContain(',true,,,,'); // mean/min/max空欄
  });
});
