/**
 * 2026-08-01 Cowork実地UXテスト是正: ボーダーライン表の出典が「非公式・参考情報」バッジで
 * 正しく区別されるかを固定する（[[fable5-fullaccel-backlog-2026-07]]のΛ+2）。
 */
import { classifyHighSchoolSourceTier, PREFECTURE_HIGH_SCHOOL_DATA } from '../prefecture-high-school-data';

describe('classifyHighSchoolSourceTier', () => {
  it('教育委員会を直接名指しする出典はprimary', () => {
    expect(classifyHighSchoolSourceTier('東京都教育委員会 令和8年度公表資料')).toBe('primary');
    expect(classifyHighSchoolSourceTier('北海道教育委員会')).toBe('primary');
    expect(classifyHighSchoolSourceTier('大阪府教育委員会')).toBe('primary');
  });

  it('進学塾・受験情報サイトの二次情報はsecondary', () => {
    expect(classifyHighSchoolSourceTier('進研ゼミ合格者アンケート 2026年度')).toBe('secondary');
    expect(classifyHighSchoolSourceTier('都立合格ナビ 2026年度')).toBe('secondary');
    expect(classifyHighSchoolSourceTier('塾選/都立合格ナビ 2026年度')).toBe('secondary');
  });

  it('当サイト独自の推計もsecondary（教委一次資料ではないため）', () => {
    expect(classifyHighSchoolSourceTier('推計 2026年度')).toBe('secondary');
  });

  it('実データ: PREFECTURE_HIGH_SCHOOL_DATAの現行行に教委名を直接含むものは1件も無い', () => {
    // 2026-08-01時点の事実確認（398行を機械集計）: 教育委員会を直接名指しする行は0件だった。
    // 将来教委一次ソースが追加されれば自動的にprimary判定されるようになるが、現状は全行secondary。
    const allSources = Object.values(PREFECTURE_HIGH_SCHOOL_DATA).flatMap((pref) =>
      pref.topHighSchools.map((school) => school.source)
    );
    expect(allSources.length).toBeGreaterThan(0);
    const tiers = allSources.map(classifyHighSchoolSourceTier);
    expect(tiers.every((tier) => tier === 'secondary')).toBe(true);
  });
});
