/**
 * @jest-environment node
 */
import {
  API_EXCLUDED_PENDING_SOURCE_REVIEW,
  apiDistributablePrefectures,
  buildCompetitionRatesIndex,
  competitionRatesForPrefecture,
} from '../competition-rate-public-api';
import { redistributableOkPrefectures } from '../data-license-ledger';

// 許諾が ok でも、出典の確認が済むまで配布APIに載せない県（fukuoka: R8 の一部が英進館記事を主典拠とする記述あり）。
describe('配布API: 出典確認待ちの県は許諾okでも配布しない（fail-closed）', () => {
  test('fukuoka は許諾 ok だが、配布APIの対象からは外れている', () => {
    expect(redistributableOkPrefectures()).toContain('fukuoka');
    expect(API_EXCLUDED_PENDING_SOURCE_REVIEW.has('fukuoka')).toBe(true);
    expect(apiDistributablePrefectures()).not.toContain('fukuoka');
  });

  test('県別の配布（/api/competition-rates/fukuoka）は null（呼び出し側で404）', () => {
    expect(competitionRatesForPrefecture('fukuoka')).toBeNull();
  });

  test('インデックスにも fukuoka は出ない', () => {
    const index = buildCompetitionRatesIndex() as { prefectures: { prefectureCode: string }[] };
    expect(index.prefectures.map((p) => p.prefectureCode)).not.toContain('fukuoka');
  });
});
