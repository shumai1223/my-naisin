/**
 * @jest-environment node
 *
 * ニュースレターHTMLレンダラの契約テスト。/api/newsletter/preview は `?pref=` を
 * そのまま NewsletterContext.prefectureName に渡す(src/app/api/newsletter/preview/route.ts)ため、
 * renderNewsletterHtml の esc() エスケープが崩れると攻撃者が任意HTML/scriptを注入できる
 * (ユーザー制御パラメータが直接HTMLに埋め込まれるXSS経路)。ここではその不変条件を固定する。
 */
import {
  renderNewsletterSubject,
  renderNewsletterText,
  renderNewsletterHtml,
  renderNewsletter,
  renderMonthlyNewsletter,
} from '../newsletter';

const TEMPLATE = {
  subject: '【今月の内申アップ チェックリスト】',
  body: '内申点は日々の積み重ねで決まります。',
  cta: { label: '内申点を計算する', path: '/' },
};

describe('renderNewsletterSubject', () => {
  it('monthLabelがあれば件名の先頭に付く', () => {
    expect(renderNewsletterSubject(TEMPLATE, { monthLabel: '2026年7月' })).toBe(
      '[2026年7月] 【今月の内申アップ チェックリスト】'
    );
  });

  it('monthLabelが無ければ元の件名のまま', () => {
    expect(renderNewsletterSubject(TEMPLATE)).toBe(TEMPLATE.subject);
  });
});

describe('renderNewsletterHtml (XSS防止)', () => {
  const XSS_PAYLOAD = '<script>alert(1)</script>';

  it('prefectureNameに悪意あるHTMLを渡してもエスケープされ生の<script>タグは残らない', () => {
    const html = renderNewsletterHtml(TEMPLATE, { prefectureName: XSS_PAYLOAD });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('monthLabelに悪意あるHTMLを渡してもエスケープされる', () => {
    const html = renderNewsletterHtml(TEMPLATE, { monthLabel: XSS_PAYLOAD });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('テンプレのsubject/bodyに特殊文字が含まれてもエスケープされる', () => {
    const evilTemplate = { ...TEMPLATE, subject: 'A&B <b>bold</b>', body: 'C&D' };
    const html = renderNewsletterHtml(evilTemplate);
    expect(html).toContain('A&amp;B &lt;b&gt;bold&lt;/b&gt;');
    expect(html).toContain('C&amp;D');
  });

  it('prefectureName未指定なら地域向けの一文は出力されない', () => {
    const html = renderNewsletterHtml(TEMPLATE);
    expect(html).not.toContain('にお住まいの方へ');
  });

  it('prefectureNameを指定すると地域向けの一文が(エスケープ済みで)出力される', () => {
    const html = renderNewsletterHtml(TEMPLATE, { prefectureName: '東京都' });
    expect(html).toContain('東京都にお住まいの方へ');
  });

  it('email未指定(unsubscribeUrl未生成)なら返信での配信停止案内が出る', () => {
    const html = renderNewsletterHtml(TEMPLATE);
    expect(html).toContain('このメールにそのまま返信してください');
  });

  it('UNSUB_SECRET未設定だとemailを渡しても署名URLは生成されずリンクは出ない(fail-closed)', () => {
    const original = process.env.UNSUB_SECRET;
    delete process.env.UNSUB_SECRET;
    const html = renderNewsletterHtml(TEMPLATE, { email: 'parent@example.com' });
    expect(html).toContain('このメールにそのまま返信してください');
    if (original !== undefined) process.env.UNSUB_SECRET = original;
  });

  it('UNSUB_SECRET設定済みでemailがあれば署名付き配信停止リンクが出る', () => {
    const original = process.env.UNSUB_SECRET;
    process.env.UNSUB_SECRET = 'test-secret';
    const html = renderNewsletterHtml(TEMPLATE, { email: 'parent@example.com' });
    expect(html).toContain('/api/unsubscribe?e=');
    expect(html).toContain('t=');
    if (original === undefined) delete process.env.UNSUB_SECRET;
    else process.env.UNSUB_SECRET = original;
  });

  it('CTAのリンク(href)はSITE_URLからの絶対パスになる', () => {
    const html = renderNewsletterHtml(TEMPLATE);
    expect(html).toContain('href="https://my-naishin.com/"');
  });
});

describe('renderNewsletterText', () => {
  it('プレーンテキストにもCTAとURLが含まれる', () => {
    const text = renderNewsletterText(TEMPLATE);
    expect(text).toContain(TEMPLATE.cta.label);
    expect(text).toContain('https://my-naishin.com/');
  });

  it('prefectureName指定時は地域向けの一文が先頭に入る', () => {
    const text = renderNewsletterText(TEMPLATE, { prefectureName: '大阪府' });
    expect(text).toContain('大阪府にお住まいの方へ');
  });
});

describe('renderNewsletter (トリガー解決)', () => {
  it('存在するトリガーなら subject/html/text 3点セットを返す', () => {
    const result = renderNewsletter('monthly-checklist');
    expect(result).not.toBeNull();
    expect(result?.subject).toContain('内申アップ');
    expect(result?.html).toContain('内申アップ');
    // renderNewsletterTextは件名でなく本文(body)を載せる設計のため、本文の文言で確認する
    expect(result?.text).toContain('内申点は定期テストだけでなく');
  });

  it('未実装のトリガー(welcome)はnullを返す(型はあるがBROADCAST_TEMPLATESに未登録)', () => {
    expect(renderNewsletter('welcome')).toBeNull();
  });
});

describe('renderMonthlyNewsletter (月×対象の解決)', () => {
  it('存在しない月(0や13)はnullを返す', () => {
    expect(renderMonthlyNewsletter(0, 'parent')).toBeNull();
    expect(renderMonthlyNewsletter(13, 'parent')).toBeNull();
  });
});
