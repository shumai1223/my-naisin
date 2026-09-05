import { getPrefectureAlternativeTracks, ALTERNATIVE_TRACK_PREFECTURE_CODES } from '../teiji-tsushin-options';
import { TEIJI_COMPETITION_RATE_BY_PREFECTURE } from '@/data/teiji-competition-rates';

describe('T-P1 P1-4 getPrefectureAlternativeTracks（定時制・通信制の選択肢データ層）', () => {
  it('データが無い都道府県コードにはnullを返す（推測でページを作らないため）', () => {
    expect(getPrefectureAlternativeTracks('hyogo')).toBeNull();
    expect(getPrefectureAlternativeTracks('yamaguchi')).toBeNull();
    expect(getPrefectureAlternativeTracks('nonexistent-code')).toBeNull();
  });

  it('ALTERNATIVE_TRACK_PREFECTURE_CODESはTEIJI_COMPETITION_RATE_BY_PREFECTUREのキーと完全一致する', () => {
    expect(new Set(ALTERNATIVE_TRACK_PREFECTURE_CODES)).toEqual(new Set(Object.keys(TEIJI_COMPETITION_RATE_BY_PREFECTURE)));
    expect(ALTERNATIVE_TRACK_PREFECTURE_CODES.length).toBeGreaterThanOrEqual(21);
  });

  it('tokyo（通信制レコードを含まない県）はtsushinCount=0・全レコードが定時制に分類される', () => {
    const result = getPrefectureAlternativeTracks('tokyo');
    expect(result).not.toBeNull();
    expect(result!.tsushinCount).toBe(0);
    expect(result!.teijiCount).toBe(result!.schools.length);
    expect(result!.schools.every((s) => s.trackType === '定時制')).toBe(true);
  });

  it('gifu（通信制レコードを含む県）はtrackTypeが department の「通信制」表記で正しく分類される', () => {
    const result = getPrefectureAlternativeTracks('gifu');
    expect(result).not.toBeNull();
    expect(result!.tsushinCount).toBe(2);
    expect(result!.teijiCount).toBe(16);
    const tsushinSchools = result!.schools.filter((s) => s.trackType === '通信制');
    expect(tsushinSchools.every((s) => s.department.includes('通信制'))).toBe(true);
  });

  it('hokkaido（coverage.status=complete・複数トラック混在）は学校数・件数が実データと一致する', () => {
    const result = getPrefectureAlternativeTracks('hokkaido');
    expect(result).not.toBeNull();
    expect(result!.coverageStatus).toBe('complete');
    expect(result!.schools).toHaveLength(46);
    expect(result!.teijiCount + result!.tsushinCount).toBe(46);
  });

  it('返す件数はquota・finalApplicants・finalRateを含め元データと1対1で対応する（捏造ゼロ）', () => {
    for (const code of ALTERNATIVE_TRACK_PREFECTURE_CODES) {
      const file = TEIJI_COMPETITION_RATE_BY_PREFECTURE[code]!;
      const result = getPrefectureAlternativeTracks(code)!;
      expect(result.schools).toHaveLength(file.records.length);
      result.schools.forEach((s, i) => {
        expect(s.schoolName).toBe(file.records[i].schoolName);
        expect(s.department).toBe(file.records[i].department);
        expect(s.quota).toBe(file.records[i].quota);
        expect(s.finalApplicants).toBe(file.records[i].finalApplicants);
        expect(s.finalRate).toBe(file.records[i].finalRate);
      });
    }
  });
});
