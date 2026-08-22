/**
 * Y-11フェーズ2 DoD「速報取込のドライラン（過去年度データで模擬）成功」。
 *
 * 実際のライブ速報データはまだ存在しない（冬にならないと取得できない）ため、既存の確定データ
 * （`src/data/competition-rates/`）の実レコードを「速報データに見立てて」流し込み、
 * `ingestInterimBulletin`が捏造ゼロ原則を機械的に守れているかを検証する。
 */
import { buildPriorYearFinalMap, ingestInterimBulletin, InterimRateSubmission } from '../interim-rate-ingest';
import { INTERIM_BULLETIN_REGISTRY } from '@/data/interim-rate-bulletin-registry';
import { KUMAMOTO_COMPETITION_RATES } from '@/data/competition-rates/kumamoto';
import { CHIBA_COMPETITION_RATES } from '@/data/competition-rates/chiba';

const R7 = '令和7年度（2025年度）';
const R8 = '令和8年度（2026年度）';

function toSubmissions(
  records: typeof KUMAMOTO_COMPETITION_RATES.records,
  fiscalYear: string,
  includeRate: boolean
): InterimRateSubmission[] {
  // 既存データは後方互換のため「fiscalYear省略=sources[0]の年度（=R8）」という設計
  // （src/lib/competition-rate.tsのCompetitionRateRecord.fiscalYearコメント参照）。
  return records
    .filter((r) => (r.fiscalYear ?? R8) === fiscalYear)
    .map((r) => ({
      schoolName: r.schoolName,
      department: r.department,
      quota: r.quota,
      interimApplicants: r.finalApplicants,
      ...(includeRate ? { interimRate: r.finalRate } : {}),
      observedAt: '2027-02-05',
    }));
}

describe('ingestInterimBulletin（ドライラン: 過去年度の確定データを速報データに見立てる）', () => {
  it('台帳に存在しない県はnullを返す（未検証県で機能させない安全側の実装）', () => {
    const result = ingestInterimBulletin(
      'tochigi',
      [{ schoolName: 'テスト高校', department: '普通', quota: 200, interimApplicants: 180, observedAt: '2027-02-05' }],
      INTERIM_BULLETIN_REGISTRY
    );
    expect(result).toBeNull();
  });

  it("台帳status='unconfirmed'の県はnullを返す（先行速報の実在自体が未確認のため）", () => {
    // 2026-08-23時点で実データのINTERIM_BULLETIN_REGISTRYにunconfirmedの県が0件になったため、
    // この不変条件自体は合成レジストリで検証する（実データの状態に依存しないテストにする）。
    const syntheticRegistry = [
      ...INTERIM_BULLETIN_REGISTRY,
      {
        prefectureCode: 'test-unconfirmed-pref',
        status: 'unconfirmed' as const,
        note: 'テスト用の合成エントリ',
        investigatedAt: '2026-08-23',
      },
    ];
    const result = ingestInterimBulletin(
      'test-unconfirmed-pref',
      [{ schoolName: 'テスト高校', department: '普通', quota: 200, interimApplicants: 180, observedAt: '2027-02-05' }],
      syntheticRegistry
    );
    expect(result).toBeNull();
  });

  it("台帳status='presumed-multistage'の県（佐賀）は先行速報の実在が推定のみでもnullにしない（unconfirmed/not-investigatedのみ拒否する設計）", () => {
    const sagaEntry = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'saga');
    expect(sagaEntry?.status).toBe('presumed-multistage');
    const result = ingestInterimBulletin(
      'saga',
      [{ schoolName: 'テスト高校', department: '普通', quota: 200, interimApplicants: 180, observedAt: '2027-02-05' }],
      INTERIM_BULLETIN_REGISTRY
    );
    expect(result).not.toBeNull();
  });

  it("interimIncludesRate:falseの熊本県では、速報入力にrateを渡してもinterimRateは常にnull（教委非公表値の独自表示を機械的に禁止）", () => {
    const kumamotoEntry = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'kumamoto');
    expect(kumamotoEntry?.interimIncludesRate).toBe(false);

    // R8確定データを「速報」に見立てて流し込む（rateも意図的に含めて渡す=誤用のシミュレーション）
    const submissions = toSubmissions(KUMAMOTO_COMPETITION_RATES.records, R8, true);
    expect(submissions.length).toBeGreaterThan(0);
    expect(submissions.some((s) => s.interimRate !== undefined)).toBe(true);

    const result = ingestInterimBulletin('kumamoto', submissions, INTERIM_BULLETIN_REGISTRY);
    expect(result).not.toBeNull();
    expect(result!.length).toBe(submissions.length);
    for (const rec of result!) {
      expect(rec.interimRate).toBeNull();
      expect(rec.status).toBe('preliminary');
    }
  });

  it('interimIncludesRate:trueの千葉県では、速報入力のrateがそのまま転記される（独自計算しない）', () => {
    const chibaEntry = INTERIM_BULLETIN_REGISTRY.find((e) => e.prefectureCode === 'chiba');
    expect(chibaEntry?.interimIncludesRate).toBe(true);

    const submissions = toSubmissions(CHIBA_COMPETITION_RATES.records, R8, true);
    expect(submissions.length).toBeGreaterThan(0);

    const result = ingestInterimBulletin('chiba', submissions, INTERIM_BULLETIN_REGISTRY);
    expect(result).not.toBeNull();
    for (let i = 0; i < result!.length; i++) {
      expect(result![i].interimRate).toBe(submissions[i].interimRate);
    }
  });

  it('interimIncludesRate:trueの県でも、速報入力自体にrateが無ければinterimRateはnull（無から倍率を作らない）', () => {
    const submissions = toSubmissions(CHIBA_COMPETITION_RATES.records, R8, false);
    expect(submissions.every((s) => s.interimRate === undefined)).toBe(true);

    const result = ingestInterimBulletin('chiba', submissions, INTERIM_BULLETIN_REGISTRY);
    expect(result).not.toBeNull();
    for (const rec of result!) {
      expect(rec.interimRate).toBeNull();
    }
  });

  it('前年同時期比は確定数どうしの単純な差分・比率であり、実データで機械的に正しいことを検証する', () => {
    const priorYearMap = buildPriorYearFinalMap(
      KUMAMOTO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === R7)
    );
    expect(priorYearMap.size).toBeGreaterThan(0);

    const submissions = toSubmissions(KUMAMOTO_COMPETITION_RATES.records, R8, false);
    const result = ingestInterimBulletin('kumamoto', submissions, INTERIM_BULLETIN_REGISTRY, priorYearMap);
    expect(result).not.toBeNull();

    // R7にも存在する学校名+学科名の組を1件抽出し、算数(差分・比率)が正しいか直接検算する
    const matched = result!.find((r) => r.yearOverYearApplicants !== undefined);
    expect(matched).toBeDefined();
    const prior = priorYearMap.get(`${matched!.schoolName}|${matched!.department}`)!;
    expect(matched!.yearOverYearApplicants!.priorYearFinalApplicants).toBe(prior);
    expect(matched!.yearOverYearApplicants!.diff).toBe(matched!.interimApplicants - prior);
    expect(matched!.yearOverYearApplicants!.ratio).toBeCloseTo(matched!.interimApplicants / prior, 10);

    // R7に存在しない学校名+学科名の組(該当なし)ではyearOverYearApplicantsがundefinedのままであること
    const unmatched = result!.filter((r) => r.yearOverYearApplicants === undefined);
    for (const rec of unmatched) {
      expect(priorYearMap.has(`${rec.schoolName}|${rec.department}`)).toBe(false);
    }
  });

  it('前年の確定applicantsが0の組では、ratioをnullにする(0除算を推測値で埋めない)', () => {
    const priorYearMap = new Map<string, number>([['ゼロ高校|普通', 0]]);
    const submissions: InterimRateSubmission[] = [
      { schoolName: 'ゼロ高校', department: '普通', quota: 40, interimApplicants: 3, observedAt: '2027-02-05' },
    ];
    const result = ingestInterimBulletin('kumamoto', submissions, INTERIM_BULLETIN_REGISTRY, priorYearMap);
    expect(result).not.toBeNull();
    expect(result![0].yearOverYearApplicants).toEqual({
      priorYearFinalApplicants: 0,
      diff: 3,
      ratio: null,
    });
  });
});
