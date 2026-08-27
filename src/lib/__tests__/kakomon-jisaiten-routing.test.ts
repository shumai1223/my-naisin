import { PREFECTURES } from '../prefectures';
import { getKakomonJisaitenRoute, getAllKakomonJisaitenRoutes } from '../kakomon-jisaiten-routing';
import { VERIFIED_TOTAL_SCORE_CODES } from '../total-score/registry';

describe('getKakomonJisaitenRoute（T-C6・47都道府県すべてがどこかに着地する）', () => {
  it('47都道府県すべてでルートが定義される（欠落なし）', () => {
    const routes = getAllKakomonJisaitenRoutes();
    expect(routes).toHaveLength(PREFECTURES.length);
    for (const r of routes) {
      expect(r.type === 'calculator' || r.type === 'link').toBe(true);
    }
  });

  it('link型のurlはすべて/から始まる有効な相対パスである', () => {
    for (const r of getAllKakomonJisaitenRoutes()) {
      if (r.type === 'link') {
        expect(r.url.startsWith('/')).toBe(true);
        expect(r.url).not.toContain('undefined');
      }
    }
  });

  it('統一エンジン5県(hyogo/kyoto/tochigi/niigata/tottori)はcalculator型', () => {
    for (const code of VERIFIED_TOTAL_SCORE_CODES) {
      expect(getKakomonJisaitenRoute(code).type).toBe('calculator');
    }
  });

  it('個別実装県(tokyo等)は専用ページへのlink型', () => {
    const r = getKakomonJisaitenRoute('tokyo');
    expect(r).toEqual({ type: 'link', code: 'tokyo', url: '/tokyo/total-score', label: expect.any(String) });
    expect(getKakomonJisaitenRoute('kanagawa').type === 'link' && getKakomonJisaitenRoute('kanagawa').url).toBe('/kanagawa/s-value');
  });

  it('hokkaido(専用ページ・解説いずれも未対応)は都道府県トップページへフォールバックする', () => {
    const r = getKakomonJisaitenRoute('hokkaido');
    expect(r).toEqual({ type: 'link', code: 'hokkaido', url: '/hokkaido', label: expect.any(String) });
  });

  it('解説34県の1つ(ibaraki)は/{code}/total-scoreへのlink型', () => {
    const r = getKakomonJisaitenRoute('ibaraki');
    expect(r).toEqual({ type: 'link', code: 'ibaraki', url: '/ibaraki/total-score', label: expect.any(String) });
  });
});
