import { CHIBA_COMPETITION_RATES } from '@/data/competition-rates/chiba';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { COMPETITION_RATE_NEXT_BY_PREFECTURE } from '@/data/competition-rates-next';
import type { PrefectureCompetitionRateFile } from '../competition-rate';
import { applyNextYearOverlay, mergeNextYearOverlays, validateNextYearFile } from '../competition-rate-overlay';

const R8 = '令和8年度（2026年度）';
const R9 = '令和9年度（2027年度）';

const base: PrefectureCompetitionRateFile = {
  prefectureCode: 'testpref',
  sources: [
    { url: 'https://www.pref.test.lg.jp/r8.pdf', docTitle: 'R8', fiscalYear: R8, fetchedAt: '2026-07-01' },
    { url: 'https://www.pref.test.lg.jp/r7.pdf', docTitle: 'R7', fiscalYear: '令和7年度（2025年度）', fetchedAt: '2026-08-01' },
  ],
  coverage: { status: 'complete', includedDepartments: ['全日制'], pendingDepartments: [], note: 'base' },
  officialSubtotals: [{ label: '合計', quota: 300, finalApplicants: 330, finalRate: 1.1 }],
  records: [
    { schoolName: 'A', department: '普通科', quota: 200, finalApplicants: 220, finalRate: 1.1 },
    { schoolName: 'B', department: '普通科', quota: 100, finalApplicants: 110, finalRate: 1.1 },
    { schoolName: 'A', department: '普通科', quota: 190, finalApplicants: 200, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）', sourceIndex: 1 },
  ],
};

const next: PrefectureCompetitionRateFile = {
  prefectureCode: 'testpref',
  sources: [{ url: 'https://www.pref.test.lg.jp/r9.pdf', docTitle: 'R9', fiscalYear: R9, fetchedAt: '2027-02-13', pdfSha256: 'abc' }],
  coverage: { status: 'complete', includedDepartments: ['全日制'], pendingDepartments: [], note: 'next' },
  officialSubtotals: [{ label: '合計', quota: 310, finalApplicants: 400 }],
  records: [
    { schoolName: 'A', department: '普通科', quota: 210, finalApplicants: 300, finalRate: 1.43 },
    { schoolName: 'B', department: '普通科', quota: 100, finalApplicants: 100, finalRate: 1 },
  ],
};

describe('applyNextYearOverlay', () => {
  const merged = applyNextYearOverlay(base, next);

  it('新年度が今季（無印・sources[0]）になり、旧今季は前年度ラベルが付く', () => {
    expect(merged.sources[0].fiscalYear).toBe(R9);
    expect(merged.records.filter((r) => !r.fiscalYear)).toEqual(next.records);
    const r8 = merged.records.filter((r) => r.fiscalYear === R8);
    expect(r8).toHaveLength(2);
    expect(r8[0]).toMatchObject({ schoolName: 'A', quota: 200 });
  });

  it('旧レコードの sourceIndex は新年度のsources数だけずれる（出典が取り違えられない）', () => {
    const r7 = merged.records.find((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7?.sourceIndex).toBe(2);
    expect(merged.sources[2].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('今季の小計・coverageは新年度のもの', () => {
    expect(merged.officialSubtotals).toEqual(next.officialSubtotals);
    expect(merged.coverage.note).toBe('next');
  });

  it('入力（base / next）を書き換えない', () => {
    expect(base.records[0].fiscalYear).toBeUndefined();
    expect(base.sources).toHaveLength(2);
    expect(next.records[0].fiscalYear).toBeUndefined();
  });

  it('県コード違い・同じ年度ラベル・旧ファイルに既にある年度は例外', () => {
    expect(() => applyNextYearOverlay(base, { ...next, prefectureCode: 'other' })).toThrow();
    expect(() => applyNextYearOverlay(base, { ...next, sources: [{ ...next.sources[0], fiscalYear: R8 }] })).toThrow();
    expect(() => applyNextYearOverlay(base, { ...next, sources: [{ ...next.sources[0], fiscalYear: '令和7年度（2025年度）' }] })).toThrow();
  });
});

describe('mergeNextYearOverlays', () => {
  it('新年度ファイルが無い県は同一オブジェクトのまま（挙動不変）', () => {
    const out = mergeNextYearOverlays({ testpref: base, x: base }, {});
    expect(out.testpref).toBe(base);
  });
  it('旧ファイルが無い県に重ねようとしたら例外', () => {
    expect(() => mergeNextYearOverlays({}, { testpref: next })).toThrow();
  });
  it('新年度ファイルがある県だけ合成される', () => {
    const out = mergeNextYearOverlays({ testpref: base, other: base }, { testpref: next });
    expect(out.testpref?.sources[0].fiscalYear).toBe(R9);
    expect(out.other).toBe(base);
  });
});

describe('validateNextYearFile', () => {
  it('正しい新年度ファイルは問題なし', () => {
    expect(validateNextYearFile(next)).toEqual([]);
  });
  it('年度ラベル・URL・sha・無印・小計一致・掲載拒否を検査する', () => {
    expect(validateNextYearFile({ ...next, sources: [{ ...next.sources[0], fiscalYear: R8 }] }).length).toBeGreaterThan(0);
    expect(validateNextYearFile({ ...next, sources: [{ ...next.sources[0], url: 'https://example.com/a.pdf' }] }).length).toBeGreaterThan(0);
    expect(validateNextYearFile({ ...next, sources: [{ ...next.sources[0], pdfSha256: undefined }] }).length).toBeGreaterThan(0);
    expect(validateNextYearFile({ ...next, records: [{ ...next.records[0], fiscalYear: R9 }, next.records[1]] }).length).toBeGreaterThan(0);
    expect(validateNextYearFile({ ...next, officialSubtotals: [{ label: '合計', quota: 1, finalApplicants: 1 }] }).length).toBeGreaterThan(0);
    expect(validateNextYearFile({ ...next, officialSubtotals: [] }).length).toBeGreaterThan(0);
    expect(validateNextYearFile({ ...next, prefectureCode: 'wakayama' }).length).toBeGreaterThan(0);
  });
});

describe('本番の登録簿', () => {
  it('登録済みの新年度ファイルは全て形式チェックを通る（空なら自明）', () => {
    for (const [code, file] of Object.entries(COMPETITION_RATE_NEXT_BY_PREFECTURE)) {
      expect({ code, problems: validateNextYearFile(file!) }).toEqual({ code, problems: [] });
    }
  });

  it('登録の無い県は、公開用マップの中身が旧ファイルそのもの（オーバーレイ導入で挙動が変わらない）', () => {
    // 千葉が新年度登録された後は、この県は合成される側になるので対象外にする。
    if (COMPETITION_RATE_NEXT_BY_PREFECTURE.chiba === undefined) {
      expect(COMPETITION_RATE_BY_PREFECTURE.chiba).toBe(CHIBA_COMPETITION_RATES);
    } else {
      expect(COMPETITION_RATE_BY_PREFECTURE.chiba?.sources[0].fiscalYear).toBe(COMPETITION_RATE_NEXT_BY_PREFECTURE.chiba.sources[0].fiscalYear);
    }
  });

  it('掲載拒否県は、新年度ファイルがあっても公開用マップに出ない', () => {
    expect(COMPETITION_RATE_BY_PREFECTURE.wakayama).toBeUndefined();
  });
});
