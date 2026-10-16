import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { adPersonalizationFor, COOKIE_CONSENT_KEY, COOKIE_CONSENT_RESET_EVENT, setAdPersonalization } from '../adsense-consent';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
type Flagged = unknown[] & { requestNonPersonalizedAds?: number };

describe('adPersonalizationFor（Cookie同意→広告のパーソナライズ可否）', () => {
  it("'all' のときだけパーソナライズ", () => {
    expect(adPersonalizationFor('all')).toBe('personalized');
  });

  it.each([['essential'], [null], [undefined], [''], ['accepted'], ['ALL']])('%p は非パーソナライズ', (v) => {
    expect(adPersonalizationFor(v as string | null | undefined)).toBe('non-personalized');
  });
});

describe('setAdPersonalization（adsbygoogle の指定を立てる）', () => {
  it('配列が無ければ作って、非パーソナライズ=1 を立てる', () => {
    const w: { adsbygoogle?: unknown } = {};
    setAdPersonalization(w, 'non-personalized');
    expect(Array.isArray(w.adsbygoogle)).toBe(true);
    expect((w.adsbygoogle as Flagged).requestNonPersonalizedAds).toBe(1);
  });

  it('パーソナライズ=0 に戻せる（途中で「すべて許可」を選んだ場合）', () => {
    const w: { adsbygoogle?: unknown } = {};
    setAdPersonalization(w, 'non-personalized');
    setAdPersonalization(w, 'personalized');
    expect((w.adsbygoogle as Flagged).requestNonPersonalizedAds).toBe(0);
  });

  it('personalized → non-personalized の往復で、また 1 になる', () => {
    const w: { adsbygoogle?: unknown } = {};
    setAdPersonalization(w, 'personalized');
    setAdPersonalization(w, 'non-personalized');
    expect((w.adsbygoogle as Flagged).requestNonPersonalizedAds).toBe(1);
  });

  it('すでに積まれている広告の要求（push済み）を壊さず、同じ配列に指定を立てる', () => {
    const queue: unknown[] = [{}, {}];
    const w: { adsbygoogle?: unknown } = { adsbygoogle: queue };
    setAdPersonalization(w, 'non-personalized');
    expect(w.adsbygoogle).toBe(queue);
    expect(queue.length).toBe(2);
    expect((queue as Flagged).requestNonPersonalizedAds).toBe(1);
  });

  it('広告スクリプトが差し替えた非配列のオブジェクト（{push, loaded}）にも、同じオブジェクトのまま指定を立てる', () => {
    const replaced = { push: () => 0, loaded: true } as { push: () => number; loaded: boolean; requestNonPersonalizedAds?: number };
    const w: { adsbygoogle?: unknown } = { adsbygoogle: replaced };
    setAdPersonalization(w, 'non-personalized');
    expect(w.adsbygoogle).toBe(replaced);
    expect(replaced.requestNonPersonalizedAds).toBe(1);
  });

  it('同じ値を2回呼んでも壊れない（React StrictMode の二重実行）', () => {
    const w: { adsbygoogle?: unknown } = {};
    setAdPersonalization(w, 'non-personalized');
    setAdPersonalization(w, 'non-personalized');
    expect((w.adsbygoogle as Flagged).requestNonPersonalizedAds).toBe(1);
  });
});

// 配線の契約（描画テストの代わりに、ソースの文字列で「壊れたら気づく」ようにする。@testing-library は未導入）
describe('同意連動の配線（ソースの契約）', () => {
  it('AdSenseScript: 指定を立ててから ready にして、ready になるまで広告スクリプトを描画しない', () => {
    const s = read('src/components/AdSenseScript.tsx');
    const setAt = s.indexOf('setAdPersonalization(window');
    const readyAt = s.indexOf('setReady(true)');
    expect(setAt).toBeGreaterThan(-1);
    expect(readyAt).toBeGreaterThan(setAt);
    expect(s).toMatch(/if \(!ready \|\|/);
    expect(s).toContain('adPersonalizationFor(consent)');
  });

  it('CookieConsent: 「すべて許可」はパーソナライズ、「必須のみ」は非パーソナライズ、閉じるだけでは何も変えない', () => {
    const s = read('src/components/CookieConsent.tsx');
    const body = (name: string) => {
      const m = s.match(new RegExp(`const ${name} = \\(\\) => \\{([\\s\\S]*?)\\n  \\};`));
      return m ? m[1] : '';
    };
    expect(body('handleAcceptAll')).toContain("setAdPersonalization(window, 'personalized')");
    expect(body('handleAcceptEssential')).toContain("setAdPersonalization(window, 'non-personalized')");
    expect(body('handleDecline')).not.toContain('setAdPersonalization');
    // 同意の保存キーは定数を使う（直書きでズレない）
    expect(s).not.toContain("'cookie-consent-accepted'");
    expect(s).toContain('COOKIE_CONSENT_RESET_EVENT');
  });

  it('CookieSettingsButton: 保存済みの選択を消し、非パーソナライズに戻し、同意画面をもう一度出す', () => {
    const s = read('src/components/CookieSettingsButton.tsx');
    expect(s).toContain('removeItem(COOKIE_CONSENT_KEY)');
    expect(s).toContain("setAdPersonalization(window, 'non-personalized')");
    expect(s).toContain('COOKIE_CONSENT_RESET_EVENT');
    expect(read('src/components/Footer.tsx')).toContain('<CookieSettingsButton');
  });

  it('GA4 も同じ保存キーを見ている（GoogleAnalytics と定数が一致）', () => {
    expect(read('src/components/GoogleAnalytics.tsx')).toContain(`'${COOKIE_CONSENT_KEY}'`);
    expect(COOKIE_CONSENT_KEY).toBe('cookie-consent-accepted');
    expect(COOKIE_CONSENT_RESET_EVENT).toBe('mn:cookie-consent-reset');
  });

  it('古い断定（同意に連動していない・選択にかかわらず行われる）が戻っていない', () => {
    for (const p of ['src/app/layout.tsx', 'src/app/privacy/page.tsx', 'src/components/CookieConsent.tsx', 'src/components/AdSenseScript.tsx']) {
      const s = read(p);
      expect(s).not.toMatch(/連動(して|させて)いない/);
      expect(s).not.toMatch(/選択にかかわらず行われます/);
    }
  });
});
