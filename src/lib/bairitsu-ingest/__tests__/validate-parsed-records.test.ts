import { validateParsedRecords } from '../validate-parsed-records';
import type { ParsedCompetitionRow } from '../parse-table-pdf';
import type { OfficialSubtotal } from '../../competition-rate';

function record(overrides: Partial<ParsedCompetitionRow>): ParsedCompetitionRow {
  return { schoolName: '長野', department: '普通', quota: 100, finalApplicants: 105, finalRate: 1.05, ...overrides };
}

describe('validateParsedRecords', () => {
  it('passes when there are no official subtotals to check against (gunma/hokkaido pattern)', () => {
    const result = validateParsedRecords([record({})], [], {});
    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('passes when the grand total matches an official subtotal exactly', () => {
    const records = [record({ quota: 100, finalApplicants: 105 }), record({ schoolName: '松本', quota: 50, finalApplicants: 40, finalRate: 0.8 })];
    const subtotals: OfficialSubtotal[] = [{ label: '全日制計', quota: 150, finalApplicants: 145 }];
    const result = validateParsedRecords(records, subtotals, {});
    expect(result.ok).toBe(true);
  });

  it('fails with a grand-total issue when no official subtotal matches the machine-summed total', () => {
    const records = [record({ quota: 100, finalApplicants: 105 })];
    const subtotals: OfficialSubtotal[] = [{ label: '全日制計', quota: 999, finalApplicants: 999 }];
    const result = validateParsedRecords(records, subtotals, {});
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.check)).toContain('grand-total');
  });

  it('passes when the grand total only matches the sum of two "合計"-labeled part totals (fukuoka pattern: no single row holds the true grand total, only 県立/市組合立 parts + many per-school "計" rows)', () => {
    const records = [record({ quota: 22200 + 2120, finalApplicants: 22854 + 2350, finalRate: 1.04 })];
    const subtotals: OfficialSubtotal[] = [
      { label: '県立全日制合計', quota: 22200, finalApplicants: 22854 },
      { label: '市組合立全日制合計', quota: 2120, finalApplicants: 2350 },
      { label: '博多工業 計', quota: 280, finalApplicants: 309 },
    ];
    const result = validateParsedRecords(records, subtotals, {});
    expect(result.ok).toBe(true);
  });

  it('does not double-count when a single official subtotal already matches directly (chiba pattern: 県立/市立/公立 3 rows where 公立=県立+市立; single-match must win before the "合計" sum-fallback is tried)', () => {
    const records = [record({ quota: 26960 + 1920, finalApplicants: 29594 + 2414, finalRate: 1.11 })];
    const subtotals: OfficialSubtotal[] = [
      { label: '県立全日制合計', quota: 26960, finalApplicants: 29594 },
      { label: '市立全日制合計', quota: 1920, finalApplicants: 2414 },
      { label: '公立全日制合計', quota: 28880, finalApplicants: 32008 },
    ];
    const result = validateParsedRecords(records, subtotals, {});
    expect(result.ok).toBe(true);
  });

  it('still fails when neither a single subtotal nor the sum of "合計"-labeled rows matches (a genuine mismatch, not a split-total pattern)', () => {
    const records = [record({ quota: 100, finalApplicants: 105 })];
    const subtotals: OfficialSubtotal[] = [
      { label: '県立全日制合計', quota: 50, finalApplicants: 50 },
      { label: '市立全日制合計', quota: 40, finalApplicants: 40 },
    ];
    const result = validateParsedRecords(records, subtotals, {});
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.check)).toContain('grand-total');
  });

  it('fails with a record-count issue when parsed records are empty', () => {
    const result = validateParsedRecords([], [], {});
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.check)).toContain('record-count');
  });

  it('fails with a record-count issue when the count mismatches an expected count', () => {
    const result = validateParsedRecords([record({})], [], { expectedRecordCount: 5 });
    expect(result.ok).toBe(false);
    expect(result.issues.find((i) => i.check === 'record-count')?.message).toMatch(/実際1件・期待5件/);
  });

  it('passes the record-count check when the count matches the expected count', () => {
    const result = validateParsedRecords([record({}), record({ schoolName: '松本' })], [], { expectedRecordCount: 2 });
    expect(result.ok).toBe(true);
  });

  it('passes finalrate-convention when the rate matches round-half-up to 2 decimals', () => {
    // 105/100 = 1.05 exactly, matches round2 (and trunc2, since it's exact)
    const result = validateParsedRecords([record({ quota: 100, finalApplicants: 105, finalRate: 1.05 })], [], {});
    expect(result.ok).toBe(true);
  });

  it('passes finalrate-convention for a known round-half-up boundary case (miyagi-style 204/160=1.275→1.28)', () => {
    const result = validateParsedRecords([record({ quota: 160, finalApplicants: 204, finalRate: 1.28 })], [], {});
    expect(result.ok).toBe(true);
  });

  it('fails with a finalrate-convention issue when the stored rate matches none of the 3 known methods', () => {
    // 105/100 = 1.05 under any of round2/round1/trunc2; 2.5 is nowhere close, so this must fail
    const result = validateParsedRecords([record({ quota: 100, finalApplicants: 105, finalRate: 2.5 })], [], {});
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.check)).toContain('finalrate-convention');
  });

  it('skips the finalrate-convention check for a quota<=0 record (defensive; parsers should already filter these out)', () => {
    const result = validateParsedRecords([record({ quota: 0, finalApplicants: 0, finalRate: 0 })], [], {});
    // record-count still fails? no, count is 1 record and no expectedRecordCount given, so only rate/grand-total matter
    expect(result.issues.map((i) => i.check)).not.toContain('finalrate-convention');
  });

  it('passes finalrate-convention via finalRateToleranceOverride when within tolerance of the naive quotient (yamanashi kikoku-exclusion pattern: 118/108=1.093, printed 1.08)', () => {
    const result = validateParsedRecords([record({ schoolName: '巨摩', quota: 108, finalApplicants: 118, finalRate: 1.08 })], [], { finalRateToleranceOverride: 0.07 });
    expect(result.issues.map((i) => i.check)).not.toContain('finalrate-convention');
  });

  it('still fails finalrate-convention when finalRateToleranceOverride is given but the gap exceeds it', () => {
    const result = validateParsedRecords([record({ quota: 100, finalApplicants: 105, finalRate: 2.5 })], [], { finalRateToleranceOverride: 0.07 });
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.check)).toContain('finalrate-convention');
  });

  it('accumulates multiple issues at once rather than stopping at the first (fail-closed reports everything)', () => {
    const subtotals: OfficialSubtotal[] = [{ label: '全日制計', quota: 999, finalApplicants: 999 }];
    const result = validateParsedRecords([record({ finalRate: 2.5 })], subtotals, { expectedRecordCount: 5 });
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.check).sort()).toEqual(['finalrate-convention', 'grand-total', 'record-count']);
  });
});
