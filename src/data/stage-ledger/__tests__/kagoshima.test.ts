import { sumStageLedger } from '@/lib/stage-ledger';
import { KAGOSHIMA_STAGE_LEDGER } from '../kagoshima';
import { KAGOSHIMA_COMPETITION_RATES } from '@/data/competition-rates/kagoshima';

/**
 * T-Y11F §5順序#7 DoD検証（鹿児島県・段階台帳12県目・全日制156レコードで完結）:
 * ①レコードの不変条件（quota>0等・既知の3件の0値を除く）②既存の倍率パイプライン
 * （competition-rates/kagoshima.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③quota・testTakersConfirmedの機械集計が「受検者数」資料の全日制合計行と完全一致すること
 * ④finalPassersがtestTakersConfirmedを上回る既知の18件を許容すること（三重県と同型の合格者数
 * 資料が推薦等入学者選抜と学力検査による選抜の合算値を表しているためと推定される特徴）。
 */
describe('鹿児島県 段階台帳（T-Y11F §5順序#7・12県目・全日制156レコードで完結）', () => {
  const { records, officialSubtotals } = KAGOSHIMA_STAGE_LEDGER;

  const KNOWN_ZERO = new Set(['野田女子|衛生看護', '与論|普通']);
  // 鹿児島女子|スポーツビジネスはapplicantsConfirmed=1（志願確定者1名）だがtestTakersConfirmed/finalPassersは0
  // （受検辞退と推定）。既存パイプライン側もfinalApplicants=1と記録済みで裏付けあり（applicantsConfirmedのみ非0）。
  const KNOWN_PARTIAL_ZERO = new Set(['鹿児島女子|スポーツビジネス']);

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '武岡台|情報科学',
    '鹿児島工業|工業Ⅰ類',
    '鹿児島南|情報処理',
    '指宿|普通',
    '山川|園芸工学・農業経済',
    '頴娃|普通',
    '鹿児島水産|食品工学',
    '野田女子|生活文化',
    '出水商業|情報処理',
    '蒲生|普通',
    '隼人工業|インテリア',
    '国分|普通',
    '国分中央|ビジネス情報',
    '曽於|商業',
    '鹿屋|普通',
    '鹿屋工業|機械',
    '垂水|生活デザイン',
    '古仁屋|普通',
  ]);

  it('取り込み件数は全日制156レコードで完結', () => {
    expect(records).toHaveLength(156);
  });

  it('coverage.statusはcomplete', () => {
    expect(KAGOSHIMA_STAGE_LEDGER.coverage.status).toBe('complete');
  });

  it('quotaはすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
    }
  });

  it('applicantsConfirmed/testTakersConfirmed/finalPassersは既知の3件を除き0より大きい', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_ZERO.has(key)) {
        expect(r.applicantsConfirmed).toBe(0);
        expect(r.testTakersConfirmed).toBe(0);
        expect(r.finalPassers).toBe(0);
        continue;
      }
      if (KNOWN_PARTIAL_ZERO.has(key)) {
        expect(r.applicantsConfirmed).toBeGreaterThan(0);
        expect(r.testTakersConfirmed).toBe(0);
        expect(r.finalPassers).toBe(0);
        continue;
      }
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('testTakersConfirmedはapplicantsConfirmedを超えない（受検者数は志願確定者数が上限）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('finalPassersがtestTakersConfirmedを上回るのは既知の18件のみ（推薦等入学者選抜との合算値と推定）', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/kagoshima.ts）と全件完全一致する', () => {
    const r8Records = KAGOSHIMA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(156);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      expect(counterpart).toBeDefined();
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(matched).toBe(156);
  });

  it('officialSubtotalsの「全日制合計」が定義通りである', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === '全日制合計');
    expect(subtotal).toEqual({
      label: '全日制合計',
      quota: 10349,
      applicantsConfirmed: 7948,
      testTakersConfirmed: 7664,
      finalPassers: 6998,
    });
  });

  it('156レコード全数の機械集計がquota・testTakersConfirmedで資料本文の総計行と、finalPassersで独立算出した差分と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(156);
    expect(sums.quota).toBe(10_349);
    expect(sums.testTakersConfirmed).toBe(7_664);
    expect(sums.finalPassers).toBe(6_998);
  });
});
