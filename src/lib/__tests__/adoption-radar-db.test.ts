/**
 * @jest-environment node
 *
 * 採用レーダー（ZZ-6e）のドメイン抽出純関数＋D1未バインド時のno-op契約テスト。
 */
import { extractExternalDomain, persistAdoptionHit, getAdoptionDomainSummary } from '../adoption-radar-db';

describe('extractExternalDomain', () => {
  test('外部URLのhostnameを返す', () => {
    expect(extractExternalDomain('https://juku-example.jp/blog/post1')).toBe('juku-example.jp');
    expect(extractExternalDomain('https://www.school-abc.ed.jp/')).toBe('www.school-abc.ed.jp');
  });

  test('自ドメイン(my-naishin.com系)はnull', () => {
    expect(extractExternalDomain('https://my-naishin.com/hensachi')).toBeNull();
    expect(extractExternalDomain('https://www.my-naishin.com/')).toBeNull();
  });

  test('localhost系はnull(開発ノイズ除外)', () => {
    expect(extractExternalDomain('http://localhost:3000/')).toBeNull();
    expect(extractExternalDomain('http://127.0.0.1:3000/')).toBeNull();
  });

  test('null・undefined・空文字はnull', () => {
    expect(extractExternalDomain(null)).toBeNull();
    expect(extractExternalDomain(undefined)).toBeNull();
    expect(extractExternalDomain('')).toBeNull();
  });

  test('不正なURL文字列はnull(例外を投げない)', () => {
    expect(extractExternalDomain('not-a-url')).toBeNull();
    expect(extractExternalDomain('   ')).toBeNull();
  });

  test('大文字ホスト名は小文字化して比較(自ドメイン判定の抜け防止)', () => {
    expect(extractExternalDomain('https://MY-NAISHIN.COM/')).toBeNull();
  });
});

describe('persistAdoptionHit（D1未バインド環境=jest）', () => {
  test('domainがnullならD1に触れず即false', async () => {
    await expect(persistAdoptionHit({ domain: null, source: 'embed_naishin' })).resolves.toBe(false);
  });

  test('domainがあってもD1未バインドならfalse(例外を投げない)', async () => {
    await expect(
      persistAdoptionHit({ domain: 'juku-example.jp', source: 'api_anonymous', path: '/api/naishin/tokyo' })
    ).resolves.toBe(false);
  });
});

describe('getAdoptionDomainSummary（D1未バインド環境=jest）', () => {
  test('D1未バインドなら空配列(例外を投げない)', async () => {
    await expect(getAdoptionDomainSummary(7)).resolves.toEqual([]);
  });
});
