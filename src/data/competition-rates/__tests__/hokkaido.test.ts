import { HOKKAIDO_COMPETITION_RATES } from '../hokkaido';

/**
 * Y-6 DoD検証（北海道・coverage='partial'・空知地区のみ）。
 *
 * 北海道は2026-08-06までΛ-4・Y-6いずれも恒久ブロック扱いだったが、教委公式ページの
 * 別シリーズ資料を発見し空知地区分のみ着手した（詳細はhokkaido.tsのコメント参照）。
 * 各行「finalApplicants ÷ quota ≒ finalRate」の内部整合性のみを検証する
 * （公式グランドトータル行は原資料に印字されておらず突合対象が無いため）。
 */
describe('北海道 倍率パイプラインα（Y-6・空知地区29レコード・coverage=partial）', () => {
  const { records } = HOKKAIDO_COMPETITION_RATES;

  it('coverageがpartialを示している', () => {
    expect(HOKKAIDO_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('29レコードが収録されている', () => {
    expect(records.length).toBe(29);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値(applicants/quota)と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
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

  it('空知地区の学校が含まれる(岩見沢東・滝川・岩見沢農業等)', () => {
    const schools = new Set(records.map((r) => r.schoolName));
    expect(schools.has('岩見沢東')).toBe(true);
    expect(schools.has('滝川')).toBe(true);
    expect(schools.has('岩見沢農業')).toBe(true);
  });
});
