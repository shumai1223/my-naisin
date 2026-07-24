/**
 * @jest-environment node
 *
 * ZZ-10b改善: link-monitor.ts(毎日実行)の判定ロジックがscripts/check-source-links.mjs
 * (週次実行)より厳しく、403/429/5xx・タイムアウトも即errorにしていたため、教育委員会等の
 * 公的サイトのbot弾き/一時障害で偽陽性のGitHub issueが乱発するリスクがあった。
 * 404/410/DNS不能のみを真のエラーとする設計に是正し、その分類ロジックを固定する回帰テスト。
 */
import { EventEmitter } from 'events';
import { isUnreachableError, checkUrl } from '../link-monitor';

interface MockRequestOptions {
  statusCode?: number;
  errorMessage?: string;
  timeout?: boolean;
}

/** https.request相当の振る舞いをモックする。呼び出しごとに1回分の応答を返す。 */
function mockHttpsRequest(responses: MockRequestOptions[]) {
  let call = 0;
  return jest.fn((_url: string, _options: unknown, callback?: (res: { statusCode: number }) => void) => {
    const req = new EventEmitter() as EventEmitter & { end: () => void; destroy: () => void };
    const response = responses[Math.min(call, responses.length - 1)];
    call += 1;
    req.end = () => {
      if (response.timeout) {
        // タイムアウトはend()直後でなくtimeoutイベントで表現する
        setImmediate(() => req.emit('timeout'));
        return;
      }
      if (response.errorMessage) {
        setImmediate(() => req.emit('error', new Error(response.errorMessage)));
        return;
      }
      setImmediate(() => callback?.({ statusCode: response.statusCode ?? 200 }));
    };
    req.destroy = () => {};
    return req;
  });
}

jest.mock('https', () => ({ request: jest.fn() }));
jest.mock('http', () => ({ request: jest.fn() }));

describe('isUnreachableError（DNS不能・接続拒否のみを真のエラーと判定）', () => {
  test('ENOTFOUND/getaddrinfo/ECONNREFUSEDは到達不能と判定する', () => {
    expect(isUnreachableError('getaddrinfo ENOTFOUND example.invalid')).toBe(true);
    expect(isUnreachableError('connect ECONNREFUSED 127.0.0.1:443')).toBe(true);
  });

  test('タイムアウト等の一時的なメッセージは到達不能と判定しない', () => {
    expect(isUnreachableError('Request timeout')).toBe(false);
    expect(isUnreachableError('socket hang up')).toBe(false);
  });
});

describe('checkUrl（403/429/5xx・タイムアウトは警告止まり・404/410のみerror）', () => {
  const https = require('https');

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('200はok(警告なし)', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ statusCode: 200 }]));
    const result = await checkUrl('https://example.jp/ok');
    expect(result.status).toBe('ok');
    expect(result.warn).toBeUndefined();
  });

  test('404はerror', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ statusCode: 404 }]));
    const result = await checkUrl('https://example.jp/gone');
    expect(result.status).toBe('error');
    expect(result.statusCode).toBe(404);
  });

  test('410はerror', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ statusCode: 410 }]));
    const result = await checkUrl('https://example.jp/gone-forever');
    expect(result.status).toBe('error');
  });

  test('403はHEADで返ってきてもGET再試行後に警告扱い(errorにしない)', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ statusCode: 403 }, { statusCode: 403 }]));
    const result = await checkUrl('https://example.jp/bot-blocked');
    expect(result.status).toBe('ok');
    expect(result.warn).toContain('HTTP 403');
  });

  test('503(一時障害)は警告扱い(errorにしない)', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ statusCode: 503 }, { statusCode: 503 }]));
    const result = await checkUrl('https://example.jp/temporarily-down');
    expect(result.status).toBe('ok');
    expect(result.warn).toContain('HTTP 503');
  });

  test('タイムアウトは警告扱い(errorにしない)', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ timeout: true }, { timeout: true }]));
    const result = await checkUrl('https://example.jp/slow');
    expect(result.status).toBe('ok');
    expect(result.warn).toContain('到達確認できず');
  });

  test('ENOTFOUND(DNS不能)はerror', async () => {
    https.request.mockImplementation(mockHttpsRequest([{ errorMessage: 'getaddrinfo ENOTFOUND example.invalid' }]));
    const result = await checkUrl('https://example.invalid/');
    expect(result.status).toBe('error');
  });
});
