/**
 * @jest-environment node
 *
 * stats-db.ts: 匿名統計(S-1)のD1永続化。leads-db.ts/clicks-db.tsと同型のno-op安全設計に加え、
 * insertStatsSubmissionはisValidStatsSubmission(input)をDBアクセスより前に短絡判定する
 * (juku-reviews-db.tsのinsertJukuReviewと同型)。この短絡ロジックと3関数のno-op契約を固定する。
 */

import { insertStatsSubmission, getStatsValues, getStatsValuesByPrefecture } from '../stats-db';

describe('insertStatsSubmission', () => {
  it('バリデーション不合格の入力はDBに触れる前にfalseを返す', async () => {
    await expect(
      insertStatsSubmission({ metric: 'not-a-real-metric' as never, value: 30 }, { trustClass: 'human' })
    ).resolves.toBe(false);
  });

  it('valueが有限数でない場合はfalseを返す', async () => {
    await expect(
      insertStatsSubmission({ metric: 'naishin', value: NaN }, { trustClass: 'human' })
    ).resolves.toBe(false);
  });

  it('バリデーション合格の入力でも、テスト環境ではDBバインディング未設定でfalseを返す(no-op)', async () => {
    await expect(
      insertStatsSubmission({ metric: 'naishin', value: 30 }, { trustClass: 'human' })
    ).resolves.toBe(false);
  });

  it('trustClassがhuman以外でも、DB未設定なら同様にfalseを返す(バーストバックストップ処理に到達する前にno-op)', async () => {
    await expect(
      insertStatsSubmission({ metric: 'hensachi', value: 55 }, { trustClass: 'suspect' })
    ).resolves.toBe(false);
  });
});

describe('getStatsValues (no-op契約)', () => {
  it('例外を投げず空配列を返す(prefectureCodeあり・なしとも)', async () => {
    await expect(getStatsValues('naishin')).resolves.toEqual([]);
    await expect(getStatsValues('hensachi', 'tokyo')).resolves.toEqual([]);
  });
});

describe('getStatsValuesByPrefecture (no-op契約)', () => {
  it('例外を投げず空オブジェクトを返す', async () => {
    await expect(getStatsValuesByPrefecture('total-score')).resolves.toEqual({});
  });
});
