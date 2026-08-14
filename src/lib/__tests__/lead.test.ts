// lead.ts: 名簿化(堀A)の送信ロジック。isValidEmail/submitLead/openLeadMailtoFallbackは
// contact.tsと同型パターン(サーバー転送→失敗時mailtoフォールバック)だが無テストだった。
// 収益直結の見込み客取りこぼし防止ロジック(delivered:falseでも例外を投げず呼び出し元がフォールバックできる)を固定する。

import { isValidEmail, submitLead, openLeadMailtoFallback, type LeadPayload } from '../lead';

function basePayload(overrides: Partial<LeadPayload> = {}): LeadPayload {
  return {
    email: 'parent@example.com',
    consent: true,
    source: 'result',
    ...overrides,
  };
}

describe('isValidEmail', () => {
  it('有効な形式はtrue', () => {
    expect(isValidEmail('parent@example.com')).toBe(true);
    expect(isValidEmail('a.b+c@sub.example.co.jp')).toBe(true);
  });

  it('前後の空白は許容する(trimしてから判定)', () => {
    expect(isValidEmail('  parent@example.com  ')).toBe(true);
  });

  it('@が無い・ドメインにドットが無い・空文字は false', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('parent@example')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('@の前後が空の場合は false', () => {
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('parent@')).toBe(false);
  });
});

describe('submitLead', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('/api/leadへPOSTしdelivered:trueを返す(正常系)', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ delivered: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const payload = basePayload({ score: 32, target: 40, gap: 8, prefectureCode: 'tokyo' });
    const result = await submitLead(payload);

    expect(result).toEqual({ ok: true, delivered: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/lead');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(payload);
  });

  it('レスポンスがok:falseの場合、ok:false・delivered:falseとサーバーのerrorを返す', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'webhook not configured' }),
    }) as unknown as typeof fetch;

    const result = await submitLead(basePayload());
    expect(result).toEqual({ ok: false, delivered: false, error: 'webhook not configured' });
  });

  it('fetch自体が例外を投げても見込み客を取りこぼさず(呼び出し元へ)ok:false・delivered:falseを返す', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const result = await submitLead(basePayload());
    expect(result).toEqual({ ok: false, delivered: false });
  });

  it('consent:falseでもsubmitLead自体はガードしない(呼び出し元が送信前に判定する契約)', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ delivered: true }) });
    global.fetch = fetchMock as unknown as typeof fetch;

    await submitLead(basePayload({ consent: false }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('openLeadMailtoFallback', () => {
  it('window定義下で呼んでも例外を投げない(jsdomのLocation.hrefはconfigurable:falseのため実際のhref値検証は困難・[[feedback-tsc-pipe-exit-code]]系の環境制約と同種)', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      openLeadMailtoFallback(basePayload({ prefectureName: '東京都', score: 32, target: 40, gap: 8, note: 'テスト' }))
    ).not.toThrow();
    spy.mockRestore();
  });
});
