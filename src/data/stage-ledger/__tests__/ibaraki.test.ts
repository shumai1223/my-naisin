import { sumStageLedger } from '@/lib/stage-ledger';
import { IBARAKI_STAGE_LEDGER } from '../ibaraki';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（茨城県・段階台帳4県目・「全日制県立」区分149レコードで完結）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/ibaraki.ts）の
 * quota・applicantsConfirmedと段階台帳が全件完全一致すること（本資料には志願者数列が
 * 存在しないため両方とも既存パイプラインを再利用する設計）③testTakersConfirmedは
 * applicantsConfirmedを超えないこと（既知の例外を除く）④finalPassersがquotaを超える
 * 既知の3件を明示的に許容する⑤3頁目末尾の資料自体の「全日制計」行との3系列完全一致。
 */
describe('茨城県 段階台帳（T-Y11F §5順序#7・4県目・「全日制県立」区分で完結）', () => {
  const { records, officialSubtotals } = IBARAKI_STAGE_LEDGER;

  it('取り込み件数は全3頁149レコード', () => {
    expect(records).toHaveLength(149);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
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

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/ibaraki.ts）と全件完全一致する（本資料に志願者数列が無いため両方とも再利用）', () => {
    const ibarakiCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.ibaraki;
    if (!ibarakiCompetitionFile) throw new Error('competition-rates/ibaraki.ts が見つかりません');
    const r8Records = ibarakiCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(matched).toBe(149);
  });

  it('finalPassersがquotaを超えるのは既知の3件のみ（合格ボーダー同点者の全員合格と推測）', () => {
    const KNOWN_OVERFLOW = new Map<string, number>([
      ['水戸第一|普通', 164],
      ['水戸農業|生活科学', 41],
      ['藤代|普通', 242],
    ]);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_OVERFLOW.has(key)) {
        expect(r.finalPassers).toBe(KNOWN_OVERFLOW.get(key));
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.quota);
    }
  });

  it('finalPassers>applicantsConfirmedとなるのは既知の6件のみ（特別入学者選抜等の別枠合算と推測・chiba R7で確認済みの同型パターン）', () => {
    const KNOWN_DRIFT = new Set([
      '日立商業|情報処理',
      '水戸農業|農業経済',
      '水戸工業|電気',
      '波崎|機械',
      '波崎|電気',
      '下館工業|電気・電子',
    ]);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_DRIFT.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.applicantsConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('149レコード全数の機械集計が3頁目末尾の「全日制計」行とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === '全日制計');
    if (!subtotal) throw new Error('officialSubtotals に "全日制計" が見つかりません');
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(149);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
    // applicantsConfirmedはこの資料に印字が無い参考値のため、officialSubtotals側の値と
    // 一致することのみ確認する。
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
  });
});
