import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { redistributableOkPrefectures } from '../data-license-ledger';
import {
  buildCompetitionRatesCsv,
  buildCompetitionRatesIndex,
  competitionRatesForPrefecture,
  redistributableExportRecords,
} from '../competition-rate-public-api';

/**
 * T-S13A A-2: 配布APIは`redistribution: 'ok'`の都道府県だけを出す（未回答・拒否・全47県版
 * の/api/schoolsとの取り違えを機械的に検知する回帰テスト）。
 */
describe('T-S13A A-2 公開配布API', () => {
  it('redistributableExportRecordsは redistributableOkPrefectures() の県のみを含む', () => {
    const ok = new Set(redistributableOkPrefectures());
    expect(ok.size).toBeGreaterThanOrEqual(10);
    const records = redistributableExportRecords();
    expect(records.length).toBeGreaterThan(0);
    for (const r of records) {
      expect(ok.has(r.prefectureCode)).toBe(true);
    }
  });

  it('redistributableExportRecordsは ok県以外(例: 東京)のレコードを1件も含まない', () => {
    const ok = new Set(redistributableOkPrefectures());
    expect(ok.has('tokyo')).toBe(false);
    const records = redistributableExportRecords();
    expect(records.some((r) => r.prefectureCode === 'tokyo')).toBe(false);
  });

  it('buildCompetitionRatesCsvはヘッダ行＋ok県レコード数分の行を返す', () => {
    const records = redistributableExportRecords();
    const csv = buildCompetitionRatesCsv();
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(records.length + 1);
    expect(lines[0]).toBe(
      'prefectureCode,prefectureName,schoolName,area,department,fiscalYear,quota,finalApplicants,finalRate,sourceUrl,docTitle,fetchedAt'
    );
  });

  it('buildCompetitionRatesIndexは ok県の数だけ prefectures を返し、totalRecordsが一致する', () => {
    const ok = redistributableOkPrefectures();
    const index = buildCompetitionRatesIndex();
    expect(index.prefectures).toHaveLength(ok.length);
    const sumRecordCount = index.prefectures.reduce((s, p) => s + p.recordCount, 0);
    expect(index.meta.totalRecords).toBe(sumRecordCount);
    expect(index.meta.count).toBe(ok.length);
  });

  it('buildCompetitionRatesIndexの各エントリはprefectureCodeがok県集合に含まれる', () => {
    const ok = new Set(redistributableOkPrefectures());
    const index = buildCompetitionRatesIndex();
    for (const p of index.prefectures) {
      expect(ok.has(p.prefectureCode)).toBe(true);
      expect(p.prefectureName.length).toBeGreaterThan(0);
      expect(p.apiUrl).toBe(`https://my-naishin.com/api/competition-rates/${p.prefectureCode}`);
    }
  });

  it('competitionRatesForPrefectureはok県ならレコードを返す', () => {
    const [firstOk] = redistributableOkPrefectures();
    const detail = competitionRatesForPrefecture(firstOk);
    expect(detail).not.toBeNull();
    expect(detail?.prefectureCode).toBe(firstOk);
    expect(detail?.recordCount).toBeGreaterThan(0);
    expect(detail?.records.length).toBe(detail?.recordCount);
  });

  it('competitionRatesForPrefectureはok県でない都道府県(東京)にnullを返す（データはCOMPETITION_RATE_BY_PREFECTUREに存在するにもかかわらず）', () => {
    expect(COMPETITION_RATE_BY_PREFECTURE.tokyo).toBeDefined();
    expect(competitionRatesForPrefecture('tokyo')).toBeNull();
  });

  it('competitionRatesForPrefectureは存在しない県コードにnullを返す', () => {
    expect(competitionRatesForPrefecture('not-a-prefecture')).toBeNull();
  });
});
