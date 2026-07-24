import { sumRecords, checkAgainstSubtotal, type CompetitionRateRecord, type OfficialSubtotal } from '../competition-rate';

const RECORDS: CompetitionRateRecord[] = [
  { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 520, finalRate: 2.06 },
  { schoolName: '三田', area: '港', department: '普通科', quota: 236, finalApplicants: 343, finalRate: 1.45 },
  { schoolName: '片倉', area: '八王子', department: '普通科', quota: 189, finalApplicants: 232, finalRate: 1.23 },
];

describe('sumRecords', () => {
  it('quota/finalApplicants/schoolCountを合計する', () => {
    expect(sumRecords(RECORDS)).toEqual({ quota: 253 + 236 + 189, finalApplicants: 520 + 343 + 232, schoolCount: 3 });
  });

  it('空配列は全て0', () => {
    expect(sumRecords([])).toEqual({ quota: 0, finalApplicants: 0, schoolCount: 0 });
  });
});

describe('checkAgainstSubtotal', () => {
  it('predicateで絞り込んだ合計が公式値と一致すればmatches=true', () => {
    const subtotal: OfficialSubtotal = { label: '区部計(2校のみ)', quota: 253 + 236, finalApplicants: 520 + 343 };
    const result = checkAgainstSubtotal(RECORDS, subtotal, (r) => r.area === '千代田' || r.area === '港');
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(489);
  });

  it('一致しなければmatches=false（データ欠落や転記ミスの検知）', () => {
    const subtotal: OfficialSubtotal = { label: '区部計(公式値)', quota: 99999, finalApplicants: 99999 };
    const result = checkAgainstSubtotal(RECORDS, subtotal, () => true);
    expect(result.matches).toBe(false);
  });
});
