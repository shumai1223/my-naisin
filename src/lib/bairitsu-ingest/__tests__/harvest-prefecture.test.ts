import { harvestPrefecture } from '../harvest-prefecture';
import type { ParsedCompetitionRow, PdfPageGeometry } from '../parse-table-pdf';
import ibarakiR8Geometry from '../__fixtures__/ibaraki-r8-geometry.json';
import { IBARAKI_COMPETITION_RATES } from '@/data/competition-rates/ibaraki';

describe('harvestPrefecture', () => {
  it('returns status "no-parser" for a prefecture code without a registered parser (does not throw)', () => {
    const result = harvestPrefecture({
      prefectureCode: 'not-a-real-prefecture',
      geometries: [],
      officialSubtotals: [],
    });
    expect(result).toEqual({ status: 'no-parser', prefectureCode: 'not-a-real-prefecture' });
  });

  it('wires registry -> parser -> validation end-to-end for a real registered prefecture (ibaraki) and reports "ok" when it matches the official subtotal', () => {
    const expectedR8Records = IBARAKI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

    const result = harvestPrefecture({
      prefectureCode: 'ibaraki',
      geometries: ibarakiR8Geometry as PdfPageGeometry[],
      officialSubtotals: IBARAKI_COMPETITION_RATES.officialSubtotals,
      expectedRecordCount: expectedR8Records.length,
    });

    expect(result.status).toBe('ok');
    if (result.status === 'ok' || result.status === 'validation-failed') {
      expect(result.parsed).toHaveLength(expectedR8Records.length);
      expect(result.validation.ok).toBe(true);
      expect(result.diff).toBeUndefined(); // previousRecordsを渡していないので差分は計算されない
    }
  });

  it('reports "validation-failed" (not an exception) when the record count does not match the expectation (fail-closed)', () => {
    const result = harvestPrefecture({
      prefectureCode: 'ibaraki',
      geometries: ibarakiR8Geometry as PdfPageGeometry[],
      officialSubtotals: IBARAKI_COMPETITION_RATES.officialSubtotals,
      expectedRecordCount: 999999, // 明らかに間違った期待件数
    });

    expect(result.status).toBe('validation-failed');
    if (result.status === 'validation-failed') {
      expect(result.validation.ok).toBe(false);
      expect(result.validation.issues.length).toBeGreaterThan(0);
    }
  });

  it('computes a diff against previousRecords when provided', () => {
    const expectedR8Records = IBARAKI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
    const parsedShape = (r: (typeof expectedR8Records)[number]): ParsedCompetitionRow => ({
      schoolName: r.schoolName,
      department: r.department,
      quota: r.quota,
      finalApplicants: r.finalApplicants,
      finalRate: r.finalRate,
    });
    // 前年度として「1件だけ定員を変えたもの」を人工的に用意し、diffが検出できることを確認する
    const previousRecords: ParsedCompetitionRow[] = expectedR8Records.map((r, i) =>
      i === 0 ? { ...parsedShape(r), quota: parsedShape(r).quota + 1 } : parsedShape(r)
    );

    const result = harvestPrefecture({
      prefectureCode: 'ibaraki',
      geometries: ibarakiR8Geometry as PdfPageGeometry[],
      officialSubtotals: IBARAKI_COMPETITION_RATES.officialSubtotals,
      expectedRecordCount: expectedR8Records.length,
      previousRecords,
    });

    expect(result.status).toBe('ok');
    if (result.status === 'ok' || result.status === 'validation-failed') {
      expect(result.diff).toBeDefined();
      expect(result.diff!.changed.length).toBe(1);
      expect(result.diff!.unchangedCount).toBe(expectedR8Records.length - 1);
    }
  });
});
