/**
 * @jest-environment node
 *
 * T-SS1 SS1-3 / T-PV2 A-4: /developers ページの「⑦d 都道府県別 学校ごと入試競争率」の掲載件数が
 * 実データと一致し続けることを機械的に固定する。
 * 過去に提案書で件数の手打ち誤りが見つかった前科（PRICING_OPTIONS.md参照）があった。
 * 現在はページ側が実データから計算して表示する（新年度[令和9年度]を載せるたびに文言を手で直さないため）。
 * このテストは (1) ページが手書きの件数を持たず計算値を使っていること (2) 計算値が独立の再集計と一致すること
 * (3) 新年度を載せる前の状態が従来の表示（24,444件・3,250校・46都道府県・令和4〜8年度）と同じであること（平均年度数だけは旧文言が手書きで過小だったため計算値になる）、を確認する。
 */
import fs from 'fs';
import path from 'path';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { COMPETITION_RATE_NEXT_BY_PREFECTURE } from '@/data/competition-rates-next';
import { licensableRecords } from '@/lib/competition-rate';
import { computeCompetitionRateStats } from '@/lib/competition-rate-stats';

function independentCounts() {
  const prefs = Object.keys(COMPETITION_RATE_BY_PREFECTURE);
  let totalRecords = 0;
  let totalLicensable = 0;
  const schoolNames = new Set<string>();
  for (const code of prefs) {
    const file = COMPETITION_RATE_BY_PREFECTURE[code]!;
    totalRecords += file.records.length;
    totalLicensable += licensableRecords(file).length;
    for (const r of file.records) schoolNames.add(`${code}::${r.schoolName}`);
  }
  return { prefectureCount: prefs.length, totalRecords, totalLicensable, uniqueSchoolCount: schoolNames.size };
}

describe('/developers 掲載件数の実データ整合性', () => {
  const pageSrc = fs.readFileSync(path.join(__dirname, '../page.tsx'), 'utf8');

  it('ページは件数を手書きせず、実データからの計算値を使っている', () => {
    expect(pageSrc).toContain('computeCompetitionRateStats()');
    expect(pageSrc).toContain('stats.totalRecords');
    expect(pageSrc).toContain('stats.totalLicensable');
    expect(pageSrc).toContain('stats.uniqueSchoolCount');
    // 件数の手書き（例: 24,444件）が復活していない
    expect(pageSrc).not.toMatch(/[0-9]{2},[0-9]{3}件/);
  });

  it('計算値が独立の再集計と一致する', () => {
    const s = computeCompetitionRateStats();
    expect({
      prefectureCount: s.prefectureCount,
      totalRecords: s.totalRecords,
      totalLicensable: s.totalLicensable,
      uniqueSchoolCount: s.uniqueSchoolCount,
    }).toEqual(independentCounts());
  });

  it('和歌山は県が掲載を断ったため含まれない(2026-10-12)・件数は従来の下限を下回らない', () => {
    const s = computeCompetitionRateStats();
    expect(COMPETITION_RATE_BY_PREFECTURE.wakayama).toBeUndefined();
    expect(s.prefectureCount).toBe(46);
    expect(s.totalRecords).toBeGreaterThanOrEqual(24_444);
    expect(s.totalLicensable).toBeGreaterThanOrEqual(24_253);
    expect(s.uniqueSchoolCount).toBeGreaterThanOrEqual(3_250);
  });

  it('新年度を載せる前は、従来の表示（24,444件・3,250校・令和4〜8年度の5年分）と同じ（平均年度数は計算値）', () => {
    if (Object.keys(COMPETITION_RATE_NEXT_BY_PREFECTURE).length > 0) return; // 新年度登録後は増える側に動くので対象外
    const s = computeCompetitionRateStats();
    expect(s).toMatchObject({
      prefectureCount: 46,
      totalRecords: 24_444,
      totalLicensable: 24_253,
      uniqueSchoolCount: 3_250,
      firstReiwa: 4,
      lastReiwa: 8,
      distinctYearCount: 5,
      averageYearsPerPrefecture: 4, // 旧文言の「約3」は手書きで実態より低かった。計算値（切り捨て）に置き換えた
    });
  });
});
