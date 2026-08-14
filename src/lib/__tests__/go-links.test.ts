/**
 * ファーストパーティ・リダイレクタ(/go/{id})のURL組み立ての契約テスト。
 * 「href は affiliates.ts の固定値だけに302する(オープンリダイレクトにしない)」という設計方針の
 * 不変条件(=このヘルパー自体はURLを組むだけでどんな外部URLも埋め込めてはいけない)を固定する。
 */
import { goHref, type GoContext } from '../go-links';

describe('goHref', () => {
  it('ctx無しならクエリなしの/go/{id}を返す', () => {
    expect(goHref('zkai-banner')).toBe('/go/zkai-banner');
  });

  it('prefのみ指定するとクエリに反映される', () => {
    expect(goHref('zkai-banner', { pref: 'tokyo' })).toBe('/go/zkai-banner?pref=tokyo');
  });

  it('placementのみ指定するとクエリに反映される', () => {
    expect(goHref('zkai-banner', { placement: 'result' })).toBe('/go/zkai-banner?placement=result');
  });

  it('pref+placement両方指定すると両方クエリに載る', () => {
    const href = goHref('zkai-banner', { pref: 'osaka', placement: 'hensachi' });
    expect(href).toBe('/go/zkai-banner?pref=osaka&placement=hensachi');
  });

  it('空文字/空白のみのctx値は無視される(クエリに載らない)', () => {
    expect(goHref('zkai-banner', { pref: '', placement: '   ' })).toBe('/go/zkai-banner');
  });

  it('前後の空白はtrimされる', () => {
    expect(goHref('zkai-banner', { pref: '  tokyo  ' })).toBe('/go/zkai-banner?pref=tokyo');
  });

  it('40文字を超える値は先頭40文字に切り詰められる(クエリ肥大化・悪用防止)', () => {
    const long = 'a'.repeat(50);
    const ctx: GoContext = { pref: long };
    const href = goHref('zkai-banner', ctx);
    const params = new URLSearchParams(href.split('?')[1]);
    expect(params.get('pref')).toHaveLength(40);
    expect(params.get('pref')).toBe('a'.repeat(40));
  });

  it('日本語等の非ASCII文字はencodeURIComponentで安全にエンコードされる', () => {
    const href = goHref('zkai-banner', { placement: '結果ページ' });
    expect(href).toContain('/go/zkai-banner?placement=');
    // URLSearchParamsでデコードして元の値に戻ることを確認(往復整合性)
    const params = new URLSearchParams(href.split('?')[1]);
    expect(params.get('placement')).toBe('結果ページ');
  });

  it('生成されるパスは常に/go/で始まる(オープンリダイレクト防止=固定プレフィックス以外に302させない設計の入口)', () => {
    expect(goHref('zkai-banner')).toMatch(/^\/go\//);
    expect(goHref('zkai-banner', { pref: 'evil.com' })).toMatch(/^\/go\//);
  });
});
