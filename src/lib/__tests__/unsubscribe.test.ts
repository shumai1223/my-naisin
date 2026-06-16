/**
 * 配信停止トークンの署名・検証（改ざん不可）のユニットテスト。
 * 第三者が他人を勝手に停止できない＝名簿運用の信頼に直結するので不変条件を固定する。
 */
import { unsubToken, verifyUnsub, unsubscribeUrl } from '../unsubscribe';

describe('unsubscribe 署名（UNSUB_SECRET あり）', () => {
  const OLD = process.env.UNSUB_SECRET;
  beforeAll(() => {
    process.env.UNSUB_SECRET = 'test-secret-123';
  });
  afterAll(() => {
    if (OLD === undefined) delete process.env.UNSUB_SECRET;
    else process.env.UNSUB_SECRET = OLD;
  });

  test('round-trip で検証成功', () => {
    const t = unsubToken('a@b.com');
    expect(t).toBeTruthy();
    expect(verifyUnsub('a@b.com', t as string)).toBe(true);
  });

  test('大小・前後空白を正規化して同一視', () => {
    const t = unsubToken('a@b.com') as string;
    expect(verifyUnsub('  A@B.COM ', t)).toBe(true);
  });

  test('改ざんトークン・別メールは拒否', () => {
    const t = unsubToken('a@b.com') as string;
    expect(verifyUnsub('a@b.com', 'deadbeefdeadbeefdeadbeefdeadbeef')).toBe(false);
    expect(verifyUnsub('x@y.com', t)).toBe(false);
    expect(verifyUnsub('a@b.com', '')).toBe(false);
  });

  test('URL にメールとトークンが含まれる', () => {
    const url = unsubscribeUrl('a@b.com');
    expect(url).toContain('/api/unsubscribe?e=');
    expect(url).toContain('&t=');
  });
});

describe('unsubscribe 署名（UNSUB_SECRET なし）', () => {
  const OLD = process.env.UNSUB_SECRET;
  beforeAll(() => {
    delete process.env.UNSUB_SECRET;
  });
  afterAll(() => {
    if (OLD !== undefined) process.env.UNSUB_SECRET = OLD;
  });

  test('シークレット未設定ならトークン・URLは生成しない（リンクを載せない）', () => {
    expect(unsubToken('a@b.com')).toBeNull();
    expect(unsubscribeUrl('a@b.com')).toBeNull();
    expect(verifyUnsub('a@b.com', 'anything')).toBe(false);
  });
});
