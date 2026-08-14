/**
 * @jest-environment node
 *
 * school-page-clicks-db.ts: 学校別倍率ページCTAクリックの一次記録(D1)。
 * clicks-db.ts/leads-db.ts等の同系D1ラッパー群と同じく無テストだったが、
 * 「LEADS_DBバインディングが無ければ完全no-op（テスト/未点火環境で例外を投げない）」という
 * 設計そのものが、jest環境では@opennextjs/cloudflareのgetCloudflareContext()が
 * Workers外のため必ず失敗する=常にこのno-opパスを通ることを意味する。
 * つまりこの安全設計は追加のD1モック無しで直接検証できる（低コストな契約テスト）。
 */

import {
  persistSchoolPageClick,
  getSchoolPageClickSummary,
  getSchoolPageClickTotalsByCta,
} from '../school-page-clicks-db';

describe('school-page-clicks-db (LEADS_DBバインディング未設定/テスト環境でのno-op契約)', () => {
  it('persistSchoolPageClickは例外を投げずfalseを返す(記録できなかったことを示す)', async () => {
    await expect(
      persistSchoolPageClick({ prefectureCode: 'tokyo', schoolCode: '13101', cta: 'reverse' })
    ).resolves.toBe(false);
  });

  it('getSchoolPageClickSummaryは例外を投げず空配列を返す', async () => {
    await expect(getSchoolPageClickSummary()).resolves.toEqual([]);
    await expect(getSchoolPageClickSummary(7)).resolves.toEqual([]);
  });

  it('getSchoolPageClickTotalsByCtaは例外を投げずreverse/juku-shindan/lineが0の集計を返す', async () => {
    const totals = await getSchoolPageClickTotalsByCta();
    expect(totals).toEqual({ reverse: 0, 'juku-shindan': 0, line: 0 });
  });

  it('daysに極端な値(0や1000)を渡しても例外を投げない(クランプ前にno-opで返るためクランプ自体は素通り)', async () => {
    await expect(getSchoolPageClickSummary(0)).resolves.toEqual([]);
    await expect(getSchoolPageClickSummary(100000)).resolves.toEqual([]);
    await expect(getSchoolPageClickTotalsByCta(-5)).resolves.toEqual({
      reverse: 0,
      'juku-shindan': 0,
      line: 0,
    });
  });
});
