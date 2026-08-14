/**
 * @jest-environment node
 *
 * api-cors.ts: 公開データAPI(堀B)全20ルートが共有するCORS/キャッシュヘッダ生成層。
 * corsJson/corsCsv/corsPreflight/logApiHitは無テストだった。
 * private指定時のno-store化・CSVのBOM付与・OPTIONSの204等、全ルート共通の契約を固定する。
 */

import { CORS_HEADERS, corsJson, corsCsv, corsPreflight, logApiHit } from '../api-cors';

describe('corsJson', () => {
  it('既定でCORSヘッダとpublicキャッシュ(1時間)を付与する', async () => {
    const res = corsJson({ ok: true });
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  it('cacheSecondsを指定すると反映される', () => {
    const res = corsJson({ ok: true }, { cacheSeconds: 60 });
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=60, stale-while-revalidate=86400');
  });

  it('private:trueの場合、cacheSecondsを指定してもno-storeになる(計測対象APIキー付きは常に最新)', () => {
    const res = corsJson({ ok: true }, { private: true, cacheSeconds: 3600 });
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
  });

  it('statusとheadersを上書きできる', () => {
    const res = corsJson({ error: 'not found' }, { status: 404, headers: { 'X-Custom': 'abc' } });
    expect(res.status).toBe(404);
    expect(res.headers.get('X-Custom')).toBe('abc');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});

describe('corsCsv', () => {
  it('先頭にBOMを付与しtext/csvで返す(Excelの日本語化け回避)', async () => {
    // Response.text()はTextDecoderが既定でBOMを除去してしまうため、生バイト列で検証する
    // (EF BB BF = UTF-8のBOM3バイト)。
    const res = corsCsv('a,b\n1,2');
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);
    const rest = new TextDecoder('utf-8').decode(bytes.slice(3));
    expect(rest).toBe('a,b\n1,2');
    expect(res.headers.get('Content-Type')).toBe('text/csv; charset=utf-8');
  });

  it('既定のfilenameはdata.csv、指定すれば上書きされる', () => {
    expect(corsCsv('x').headers.get('Content-Disposition')).toBe('inline; filename="data.csv"');
    expect(corsCsv('x', { filename: 'naishin.csv' }).headers.get('Content-Disposition')).toBe(
      'inline; filename="naishin.csv"'
    );
  });

  it('private:trueの場合はno-storeになる', () => {
    const res = corsCsv('x', { private: true });
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
  });
});

describe('corsPreflight', () => {
  it('204とCORSヘッダのみを返しボディは空', async () => {
    const res = corsPreflight();
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
    const text = await res.text();
    expect(text).toBe('');
  });
});

describe('CORS_HEADERS', () => {
  it('全オリジンを許可しGET/POST/OPTIONSをカバーする', () => {
    expect(CORS_HEADERS['Access-Control-Allow-Origin']).toBe('*');
    expect(CORS_HEADERS['Access-Control-Allow-Methods']).toContain('GET');
    expect(CORS_HEADERS['Access-Control-Allow-Methods']).toContain('POST');
    expect(CORS_HEADERS['Access-Control-Allow-Methods']).toContain('OPTIONS');
  });
});

describe('logApiHit', () => {
  it('requestなしでも例外を投げない(ログ失敗はAPIに影響させない設計)', () => {
    expect(() => logApiHit('/api/naishin')).not.toThrow();
  });

  it('requestからuser-agent/refererを取り出してconsole.logに1行JSONで出力する', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const req = new Request('https://my-naishin.com/api/naishin', {
      headers: { 'user-agent': 'test-agent', referer: 'https://example.com/' },
    });
    logApiHit('/api/naishin', req, { extra: 1 });
    expect(spy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.api).toBe('/api/naishin');
    expect(logged.ua).toBe('test-agent');
    expect(logged.referer).toBe('https://example.com/');
    expect(logged.extra).toBe(1);
    spy.mockRestore();
  });

  it('refererが無い場合はreferer自体をログに含めない', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const req = new Request('https://my-naishin.com/api/naishin', { headers: { 'user-agent': 'ua' } });
    logApiHit('/api/naishin', req);
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect('referer' in logged).toBe(false);
    spy.mockRestore();
  });
});
