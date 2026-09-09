import { IBARAKI_STAGE_LEDGER } from '../ibaraki';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（茨城県・段階台帳4県目パイロット・1頁目63レコード）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/ibaraki.ts）の
 * quota・applicantsConfirmedと段階台帳が全件完全一致すること（本資料には志願者数列が
 * 存在しないため両方とも既存パイプラインを再利用する設計）③testTakersConfirmedは
 * applicantsConfirmedを超えないこと（既知の2件を除く）④finalPassersがquotaを超える
 * 既知の2件（水戸第一・水戸農業生活科学）を明示的に許容する。
 */
describe('茨城県 段階台帳（T-Y11F §5順序#7・4県目・1頁目のみ）', () => {
  const { records } = IBARAKI_STAGE_LEDGER;

  it('取り込み件数は1頁目63レコード', () => {
    expect(records).toHaveLength(63);
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
    expect(matched).toBe(63);
  });

  it('finalPassersがquotaを超えるのは既知の2件のみ（合格ボーダー同点者の全員合格と推測）', () => {
    const KNOWN_OVERFLOW = new Map<string, number>([
      ['水戸第一|普通', 164],
      ['水戸農業|生活科学', 41],
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

  it('finalPassers>applicantsConfirmedとなるのは既知の3件のみ（特別入学者選抜等の別枠合算と推測・chiba R7で確認済みの同型パターン）', () => {
    const KNOWN_DRIFT = new Set(['日立商業|情報処理', '水戸農業|農業経済', '水戸工業|電気']);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_DRIFT.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.applicantsConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });
});
