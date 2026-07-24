import { SHIZUOKA_COMPETITION_RATES } from '../shizuoka';

/**
 * Y-6 DoD検証（静岡県・2県目）。
 *
 * 静岡県は学科ごとに選抜枠（Ⅰ/Ⅱ/Ⅲ）の割合内訳が付随する独自の表構造を持つため、
 * 学科の総定員行のみを1レコードとして採用している（詳細はshizuoka.tsのファイル冒頭
 * コメント参照）。今回はPDF1〜3ページ目の38校59レコードのみを対象とした正直な部分収録。
 * 学校単位の「計」行がPDF上に存在しないため、officialSubtotalsによる突合は行わず、
 * レコード単体の整合性と学校名+学科名の重複が無いことのみを検証する。
 */
describe('静岡県 倍率パイプラインα（Y-6・PDF1〜3ページ目38校59レコードの部分収録テスト）', () => {
  const { records } = SHIZUOKA_COMPETITION_RATES;

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageが正直に部分収録を示している', () => {
    expect(SHIZUOKA_COMPETITION_RATES.coverage.status).toBe('partial');
    expect(SHIZUOKA_COMPETITION_RATES.coverage.pendingDepartments.length).toBeGreaterThan(0);
  });

  it('59レコード・38校が収録されている（PDF1〜3ページ目・下田〜静岡城北）', () => {
    expect(records.length).toBe(59);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(38);
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      下田: 2,
      伊豆伊東: 2,
      伊豆総合: 2,
      韮山: 2,
      田方農業: 3,
      御殿場: 3,
      沼津東: 2,
      沼津西: 2,
      沼津商業: 2,
      吉原: 2,
      富士: 2,
      富士宮東: 2,
      富士宮北: 2,
      富士市立: 3,
      清水東: 2,
      清水南: 2,
      静岡市立清水桜が丘: 2,
      静岡城北: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIZUOKA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.shizuoka\.jp\//);
    }
  });
});
