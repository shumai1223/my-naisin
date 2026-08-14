/**
 * @jest-environment node
 *
 * leads-db.ts: 名簿の永続化(堀A/配信母数)＝Cloudflare D1保存。school-page-clicks-db.ts/
 * juku-reviews-db.tsと同じく「LEADS_DBバインディング未設定なら完全no-op(例外を投げず受付フローに
 * 影響させない)」という安全設計だが、名簿velocityは北極星KPIかつ本番の受付経路(/api/lead)に
 * 直結するにもかかわらず無テストだった。jest環境ではgetCloudflareContext()がWorkers外のため
 * 必ず失敗しno-opパスを通ることを利用し、D1モック無しでこの安全設計を直接検証する。
 * ⚠️persistLead/markUnsubscribedはgetLeadsDb()ヘルパーを経由せず自前でdynamic importするため、
 * jest環境ではモジュール解決自体のSyntaxErrorがconsole.errorに出る(捕捉されfalseは正しく返る・
 * ログが騒がしいだけ)。テスト内でconsole.errorをスパイして抑制する。
 */

import { persistLead, markUnsubscribed, getLeadDailyCounts, getLeadSummary } from '../leads-db';

describe('persistLead (no-op契約)', () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('例外を投げずfalseを返す(保存できなかったことを示す・受付フローは止めない)', async () => {
    await expect(persistLead({ email: 'parent@example.com', source: 'result' })).resolves.toBe(false);
  });

  it('任意フィールド(prefectureCode/score/target/gap/note)を渡しても例外を投げない', async () => {
    await expect(
      persistLead({
        email: 'parent@example.com',
        source: 'result',
        prefectureCode: 'tokyo',
        prefectureName: '東京都',
        score: 32,
        target: 40,
        gap: 8,
        note: 'テスト',
      })
    ).resolves.toBe(false);
  });
});

describe('markUnsubscribed (no-op契約)', () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('例外を投げずfalseを返す', async () => {
    await expect(markUnsubscribed('parent@example.com')).resolves.toBe(false);
  });
});

describe('getLeadDailyCounts (no-op契約)', () => {
  it('例外を投げず空配列を返す(既定・引数指定とも)', async () => {
    await expect(getLeadDailyCounts()).resolves.toEqual([]);
    await expect(getLeadDailyCounts(7)).resolves.toEqual([]);
  });

  it('daysに極端な値(0や100000)を渡しても例外を投げない', async () => {
    await expect(getLeadDailyCounts(0)).resolves.toEqual([]);
    await expect(getLeadDailyCounts(100000)).resolves.toEqual([]);
  });
});

describe('getLeadSummary (no-op契約)', () => {
  it('全フィールドが空/ゼロのLeadSummaryを返す(管理ダッシュボードが壊れない形の既定値)', async () => {
    const summary = await getLeadSummary();
    expect(summary).toEqual({ total: 0, unsubscribed: 0, bySource: [], byPref: [], recent: [] });
  });

  it('recentLimitに極端な値を渡しても例外を投げない', async () => {
    await expect(getLeadSummary(0)).resolves.toEqual({
      total: 0,
      unsubscribed: 0,
      bySource: [],
      byPref: [],
      recent: [],
    });
    await expect(getLeadSummary(100000)).resolves.toEqual({
      total: 0,
      unsubscribed: 0,
      bySource: [],
      byPref: [],
      recent: [],
    });
  });
});
