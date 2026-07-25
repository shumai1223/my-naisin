import { OKAYAMA_COMPETITION_RATES } from '../okayama';

/**
 * Y-6 DoD検証（岡山県・7県目・部分収録）。
 *
 * PDF3ページ目（岡山朝日〜岡山南の14校36レコード）のみを収録した段階のテスト。coverage.status
 * が'partial'であることと、レコードの基本整合性（quota>0・重複無し・くくり募集の合算値が
 * 画像照合済みの値と一致）のみを検証する。全50校のグランドトータル突合は完全収録後に追加する。
 */
describe('岡山県 倍率パイプラインα（Y-6・部分収録=PDF3ページ目14校36レコード）', () => {
  const { records } = OKAYAMA_COMPETITION_RATES;

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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

  it('coverageがpartialを示している（PDF3ページ目のみ・残り約35校＋市立2校は次回以降）', () => {
    expect(OKAYAMA_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('36レコード・14校が収録されている', () => {
    expect(records.length).toBe(36);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(14);
  });

  it('くくり募集（複数学科が一般入学募集人員を共有）が画像照合済みの合算値で正しく収録されている', () => {
    const ikkyu = records.find((r) => r.schoolName === '岡山一宮');
    expect(ikkyu).toEqual({
      schoolName: '岡山一宮',
      department: '普通・理数（くくり募集）',
      quota: 280,
      finalApplicants: 320,
      finalRate: 1.14,
    });
    const higashiOkayama = records.find((r) => r.schoolName === '東岡山工業' && r.department.includes('くくり募集'));
    expect(higashiOkayama).toEqual({
      schoolName: '東岡山工業',
      department: '機械・電子機械・電気（くくり募集）',
      quota: 40,
      finalApplicants: 51,
      finalRate: 1.28,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of OKAYAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.okayama\.jp\//);
    }
  });
});
