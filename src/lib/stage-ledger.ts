/**
 * T-Y11F §5順序#7: 段階台帳（学校×学科ごとの選抜プロセス各段階の数値）。
 *
 * `src/lib/competition-rate.ts`（既存・Y-2/Y-6）は「募集人員(quota)・最終応募者数
 * (finalApplicants)・倍率(finalRate)」のみを持つ。段階台帳はそれに加えて選抜プロセスの
 * 途中経過（志願者確定数・受検者確定数）と、既存モジュールに一切存在しない**入学許可候補者数
 * （実際に合格した人数）**を追加する。「志願者数」と「合格者数」は別概念であり、後者は
 * my-naishinのどのデータセットにも今まで収録されていなかった（Y-0憲法①公表値のみ・
 * ②1データ点=1出典を継承）。
 *
 * 設計方針（ops/baselines/stage-ledger-unit-count-2026-09.mdのF-0実地調査を踏まえた判断）:
 * 「推薦」「二次募集」区分は都道府県ごとに制度が大きく異なり（例: 千葉は推薦選抜を廃止し
 * 「特別入学者選抜」〈海外帰国/外国人/中国等帰国/成人/連携型〉という別体系を持つ）、
 * カテゴリ別内訳まで無理に一律スキーマ化すると誤解釈のリスクが高い。そのため本v0は
 * **全都道府県で意味が一致する4フィールド（募集人員・志願者確定数・受検者確定数・
 * 入学許可候補者数合計）のみ**を対象とし、県固有のカテゴリ内訳は将来必要になった時点で
 * 追加フィールドとして拡張する（Y-0憲法③「機械可読不能・複雑すぎるものは正直にスキップ」）。
 */

export interface StageLedgerRecord {
  schoolName: string;
  department: string;
  /** 募集人員。 */
  quota: number;
  /** 志願者確定数（志願変更後の最終確定値。既存`competition-rate.ts`のfinalApplicantsと
   *  同一の意味を持つ県が多いが、独立に転記し既存データとの突合はテスト側で行う）。 */
  applicantsConfirmed: number;
  /** 受検者確定数（実際に学力検査を受けた人数。志願者確定数から欠席者等を差し引いた値）。 */
  testTakersConfirmed: number;
  /** 入学許可候補者数（合格者数）合計。既存のどのデータセットにも無い新規フィールド。 */
  finalPassers: number;
  /** 掛-1（多年度）用。省略時は`sources[0].fiscalYear`を指す。 */
  fiscalYear?: string;
}

export interface StageLedgerSource {
  url: string;
  docTitle: string;
  fiscalYear: string;
  fetchedAt: string;
}

export interface PrefectureStageLedgerFile {
  prefectureCode: string;
  sources: StageLedgerSource[];
  coverage: {
    status: 'partial' | 'complete';
    includedDepartments: string[];
    pendingDepartments: string[];
    note: string;
  };
  records: StageLedgerRecord[];
}

/** records群の合計（都道府県非依存の純粋集計）。 */
export function sumStageLedger(
  records: StageLedgerRecord[]
): { quota: number; applicantsConfirmed: number; testTakersConfirmed: number; finalPassers: number; schoolCount: number } {
  return records.reduce(
    (acc, r) => ({
      quota: acc.quota + r.quota,
      applicantsConfirmed: acc.applicantsConfirmed + r.applicantsConfirmed,
      testTakersConfirmed: acc.testTakersConfirmed + r.testTakersConfirmed,
      finalPassers: acc.finalPassers + r.finalPassers,
      schoolCount: acc.schoolCount + 1,
    }),
    { quota: 0, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0, schoolCount: 0 }
  );
}
