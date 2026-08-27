/**
 * @jest-environment node
 *
 * /api/gakushu-seiseki（T-C4）のルートレベル検証。GET=メタ情報、POST=実計算。
 * 個人情報を受け取らない設計（DoD §3）・単位数を受け取らない設計の両方をAPIの形で確認する。
 */
import { GET, POST } from '@/app/api/gakushu-seiseki/route';
import { resetApiRateLimiterForTests } from '@/lib/api-auth';

// テストリクエストはヘッダ無し＝ip:unknownのバケットを全テストが共有するため、
// テストごとにクリアしないと匿名レート上限で偽429になる（mcp-route.test.tsと同じ対策）。
beforeEach(() => {
  resetApiRateLimiterForTests();
});

describe('GET /api/gakushu-seiseki', () => {
  it('パラメータ無しでメタ情報（出典・リクエスト例）を返す', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki');
    const res = await GET(req);
    const json = await (res as Response).json();
    expect(json.meta).toBeDefined();
    expect(json.meta.source.url).toContain('mext.go.jp');
    expect(json.meta.request.method).toBe('POST');
  });
});

describe('POST /api/gakushu-seiseki', () => {
  it('文科省の公式計算例(理科3.66→3.7)と一致する', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: JSON.stringify({
        kamoku: [
          { kyoka: '理科', kamoku: '物理基礎', gakunen: 1, hyotei: 3 },
          { kyoka: '理科', kamoku: '化学基礎', gakunen: 2, hyotei: 3 },
          { kyoka: '理科', kamoku: '生物基礎', gakunen: 1, hyotei: 5 },
        ],
      }),
    });
    const res = await POST(req);
    const json = await (res as Response).json();
    expect(json.kyokaStatus['理科']).toBe(3.7);
    expect(json.overall).toBe(3.7);
    expect(json.gaihyou).toBe('B');
    expect(json.source.url).toContain('mext.go.jp');
  });

  it('kamokuが未指定なら400', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect((res as Response).status).toBe(400);
  });

  it('kamokuが空配列なら400', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: JSON.stringify({ kamoku: [] }),
    });
    const res = await POST(req);
    expect((res as Response).status).toBe(400);
  });

  it('gakunenが範囲外(1-4以外)なら400', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: JSON.stringify({ kamoku: [{ kyoka: '国語', kamoku: 'x', gakunen: 9, hyotei: 3 }] }),
    });
    const res = await POST(req);
    expect((res as Response).status).toBe(400);
  });

  it('hyoteiが範囲外(1-5以外)なら400', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: JSON.stringify({ kamoku: [{ kyoka: '国語', kamoku: 'x', gakunen: 1, hyotei: 6 }] }),
    });
    const res = await POST(req);
    expect((res as Response).status).toBe(400);
  });

  it('不正なJSON本文なら400', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: '{not valid json',
    });
    const res = await POST(req);
    expect((res as Response).status).toBe(400);
  });

  it('リクエストスキーマに単位数(tanni)・個人情報(name/schoolName等)を受け取るフィールドが無い（DoD§3・型構造の検証）', async () => {
    const req = new Request('https://my-naishin.com/api/gakushu-seiseki', {
      method: 'POST',
      body: JSON.stringify({
        kamoku: [{ kyoka: '国語', kamoku: '現代の国語', gakunen: 1, hyotei: 4, tanni: 99, name: '生徒名', schoolName: '学校名' }],
      }),
    });
    const res = await POST(req);
    const json = await (res as Response).json();
    // 余分なフィールド(tanni/name/schoolName)を渡しても無視され、計算結果はkyoka/kamoku/gakunen/hyoteiのみから決まる
    expect((res as Response).status).toBe(200);
    expect(json.overall).toBe(4.0);
  });
});
