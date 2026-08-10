/**
 * @jest-environment node
 *
 * DW-1（2026-08-10）: `/api/stats/submit` の送信元判定の契約テスト。
 *
 * 事故: このエンドポイントにはボットUA検査もオリジン検査も無く、自動投稿が混入した。
 *   結果、本番が「偏差値の全国平均 = 63.16」を配信していた（偏差値は定義上、母集団平均が50）。
 *   実測: hensachi 263件中243件(92%)が 07-16/07-22/07-27/08-01/08-07 の5日に集中。
 *         同期間のGA4 `stats_optin_grant` は28日で10件。実トラフィックは148〜172クリック/日。
 *
 * ここで固定する契約:
 *   - ブラウザUA かつ 内部オリジン        → 'human'（trusted=1・集計対象）
 *   - ブラウザUAだが 内部オリジン無し     → 'suspect'（保存はするが集計に入らない）
 *   - ボットUA / 空UA                     → 'bot'
 *   - Origin が無くても Referer で判定できる（fetchは同一オリジンPOSTにOriginを付けるが、
 *     ブラウザ差でRefererしか来ない経路も許容する）
 *
 * ⚠️ この判定を緩めると DW-1 が再発する。
 */
import { classifySubmission } from '@/app/api/stats/submit/route';

/** Headers 風の最小オブジェクト（NextRequest.headers と同じ get 契約）。 */
function headers(map: Record<string, string | undefined>) {
  const lower = Object.fromEntries(Object.entries(map).map(([k, v]) => [k.toLowerCase(), v]));
  return { get: (name: string) => lower[name.toLowerCase()] ?? null };
}

const BROWSER_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

describe('classifySubmission（DW-1・匿名統計の送信元判定）', () => {
  it('ブラウザUA かつ 内部Origin なら human（＝集計対象）', () => {
    expect(classifySubmission(headers({ 'user-agent': BROWSER_UA, origin: 'https://my-naishin.com' }))).toBe('human');
  });

  it('Origin が無くても内部 Referer があれば human', () => {
    expect(
      classifySubmission(headers({ 'user-agent': BROWSER_UA, referer: 'https://my-naishin.com/hensachi' }))
    ).toBe('human');
  });

  it('★ブラウザUAでも内部オリジンが無ければ suspect（＝集計に入らない）', () => {
    // これが事故の本体。curl や外部スクリプトからの直POSTはここに落ちる。
    expect(classifySubmission(headers({ 'user-agent': BROWSER_UA }))).toBe('suspect');
  });

  it('★他サイトを騙る Origin は human にしない', () => {
    expect(
      classifySubmission(headers({ 'user-agent': BROWSER_UA, origin: 'https://my-naishin.com.evil.example' }))
    ).toBe('suspect');
    expect(classifySubmission(headers({ 'user-agent': BROWSER_UA, origin: 'https://evil.example' }))).toBe('suspect');
  });

  it('サブドメインは内部として扱う', () => {
    expect(
      classifySubmission(headers({ 'user-agent': BROWSER_UA, origin: 'https://staging.my-naishin.com' }))
    ).toBe('human');
  });

  it('ボットUAは内部オリジンを付けても bot', () => {
    expect(classifySubmission(headers({ 'user-agent': 'curl/8.4.0', origin: 'https://my-naishin.com' }))).toBe('bot');
    expect(
      classifySubmission(headers({ 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)', origin: 'https://my-naishin.com' }))
    ).toBe('bot');
  });

  it('UAが無い場合は human にしない', () => {
    expect(classifySubmission(headers({ origin: 'https://my-naishin.com' }))).not.toBe('human');
  });

  it('壊れたOrigin文字列でも例外を投げず human にしない', () => {
    expect(classifySubmission(headers({ 'user-agent': BROWSER_UA, origin: 'not-a-url' }))).toBe('suspect');
  });
});
