/**
 * @jest-environment node
 *
 * T-SS1 SS1-3: /developers ページの「⑦d 都道府県別 学校ごと入試競争率」に掲載している件数
 * （21,739件・3,260校・47都道府県）が実データと一致し続けることを機械的に固定する。
 * 過去に提案書で件数の手打ち誤りが見つかった前科（PRICING_OPTIONS.md参照）があるため、
 * ページ側のコピー（文字列）と実ファイル集計値を突合する。
 */
import fs from 'fs';
import path from 'path';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { licensableRecords } from '@/lib/competition-rate';

function actualCounts() {
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
  it('都道府県別学校ごと入試競争率の件数がページ本文の記載と一致する', () => {
    const { prefectureCount, totalRecords, totalLicensable, uniqueSchoolCount } = actualCounts();

    // 現状の正典値（本テストが落ちたら、原因がデータ更新かページ記載の誤りかを切り分けてから直す）。
    expect(prefectureCount).toBe(47);
    expect(totalRecords).toBe(21_739);
    expect(totalLicensable).toBe(21_548);
    expect(uniqueSchoolCount).toBe(3_260);

    const pageSrc = fs.readFileSync(path.join(__dirname, '../page.tsx'), 'utf8');
    expect(pageSrc).toContain(`${totalRecords.toLocaleString('en-US')}件`);
    expect(pageSrc).toContain(`${uniqueSchoolCount.toLocaleString('en-US')}校`);
    expect(pageSrc).toContain(`${totalLicensable.toLocaleString('en-US')}件`);
  });
});
