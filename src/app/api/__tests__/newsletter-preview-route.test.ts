/**
 * @jest-environment node
 *
 * /api/newsletter/preview(P4-1/H4・配信前HTML目視QA用の内部ツール)の契約テスト。
 * renderNewsletter/renderMonthlyNewsletter自体はnewsletter.test.tsで既にカバー済みだが、
 * ルート自体のクエリパラメータ分岐(trigger未指定=一覧・calMonth分岐のバリデーション・
 * 未知のtrigger拒否)とnoindexヘッダの付与は無テストだった。noindex(検索エンジンに
 * 誤って拾われてはいけない内部QAツール)であることの担保という観点でも価値がある。
 */
import { GET } from '@/app/api/newsletter/preview/route';

function req(url: string) {
  return new Request(url) as never;
}

describe('/api/newsletter/preview', () => {
  it('パラメータ無しは一覧HTMLを200・noindexヘッダ付きで返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/newsletter/preview'));
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex');
    const html = await res.text();
    expect(html).toContain('ニュースレター テンプレ プレビュー');
    expect(html).toContain('monthly-checklist');
  });

  it('既知のtriggerは件名付きHTMLを200で返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/newsletter/preview?trigger=monthly-checklist&month=2026年7月'));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('件名：');
  });

  it('未知のtriggerはunknown_trigger・400を返しvalid一覧を含む', async () => {
    const res = await GET(req('https://my-naishin.com/api/newsletter/preview?trigger=not-a-real-trigger'));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('unknown_trigger');
    expect(Array.isArray(json.valid)).toBe(true);
    expect(json.valid).toContain('monthly-checklist');
  });

  it('calMonthが範囲外(0や13)はinvalid_calendar_params・400を返す', async () => {
    for (const bad of ['0', '13', 'abc']) {
      const res = await GET(req(`https://my-naishin.com/api/newsletter/preview?calMonth=${bad}`));
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe('invalid_calendar_params');
    }
  });

  it('audienceが未知の値(student/parent以外)は400を返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/newsletter/preview?calMonth=8&audience=teacher'));
    expect(res.status).toBe(400);
  });

  it('audience未指定時はstudentとして扱われ200を返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/newsletter/preview?calMonth=8&month=2026年8月'));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('生徒(LINE)');
  });

  it('calMonth=8・audience=parentは正しく描画され200を返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/newsletter/preview?calMonth=8&audience=parent&month=2026年8月'));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('保護者(メール)');
  });
});
