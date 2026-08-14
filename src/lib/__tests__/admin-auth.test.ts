/**
 * @jest-environment node
 *
 * /admin/* 共通トークン認証の契約テスト。「未設定/不一致はfalse＝可用性よりセキュリティ優先」
 * という設計コメントの不変条件を固定する(esp.test.tsと同型のprocess.env退避/復元パターン)。
 */
import { getAdminToken, isAuthorizedAdminToken } from '../admin-auth';

describe('admin-auth', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.ADMIN_REPORT_TOKEN;
  });

  afterAll(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('getAdminToken', () => {
    it('ADMIN_REPORT_TOKEN未設定はundefined', async () => {
      expect(await getAdminToken()).toBeUndefined();
    });

    it('process.env.ADMIN_REPORT_TOKENを返す', async () => {
      process.env.ADMIN_REPORT_TOKEN = 'secret-token-abc';
      expect(await getAdminToken()).toBe('secret-token-abc');
    });
  });

  describe('isAuthorizedAdminToken', () => {
    it('トークンが一致すればtrue', async () => {
      process.env.ADMIN_REPORT_TOKEN = 'secret-token-abc';
      expect(await isAuthorizedAdminToken('secret-token-abc')).toBe(true);
    });

    it('トークンが不一致ならfalse', async () => {
      process.env.ADMIN_REPORT_TOKEN = 'secret-token-abc';
      expect(await isAuthorizedAdminToken('wrong-token')).toBe(false);
    });

    it('ADMIN_REPORT_TOKEN未設定なら、どんな入力でもfalse(可用性よりセキュリティ優先)', async () => {
      expect(await isAuthorizedAdminToken('anything')).toBe(false);
      expect(await isAuthorizedAdminToken('')).toBe(false);
      expect(await isAuthorizedAdminToken(undefined)).toBe(false);
    });

    it('入力トークンが未指定ならfalse', async () => {
      process.env.ADMIN_REPORT_TOKEN = 'secret-token-abc';
      expect(await isAuthorizedAdminToken(undefined)).toBe(false);
    });

    it('入力トークンが空文字ならfalse(空文字同士の誤マッチを防ぐ)', async () => {
      process.env.ADMIN_REPORT_TOKEN = 'secret-token-abc';
      expect(await isAuthorizedAdminToken('')).toBe(false);
    });

    it('両方とも未設定/空でも一致とみなさない(Boolean(expected)チェックが空文字を弾く)', async () => {
      process.env.ADMIN_REPORT_TOKEN = '';
      expect(await isAuthorizedAdminToken('')).toBe(false);
    });
  });
});
