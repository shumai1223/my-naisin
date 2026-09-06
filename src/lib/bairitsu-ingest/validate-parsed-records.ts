/**
 * T-Y11E E-4: 「検算をパイプラインに繋ぐ」ための単一の関門。
 *
 * これまでバラバラに存在していた検算（グランドトータル照合＝`competition-rate.ts`の
 * `checkAgainstSubtotal`・倍率の丸め方式判定＝`finalrate-convention.ts`の`classifyStoredRate`・
 * レコード件数の妥当性）を1つの純関数`validateParsedRecords`にまとめ、**落ちたら`ok: false`を
 * 返す（fail-closed）**。呼び出し側（冬の収穫パイプライン）はこの結果を見て、`ok`でなければ
 * 通り抜けさせずに人間の確認へ回す。
 */

import type { ParsedCompetitionRow } from './parse-table-pdf';
import type { OfficialSubtotal } from '../competition-rate';
import { classifyStoredRate, parseDecimalToHundredths } from '../finalrate-convention';

export interface ValidationIssue {
  check: 'grand-total' | 'finalrate-convention' | 'record-count';
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
}

/**
 * 全レコードの合計（quota/finalApplicants）が、公式の集計行(`officialSubtotals`)の
 * いずれか1件と一致するかを見る。`officialSubtotals`が空（gunma/hokkaido等・公式の
 * 集計行が資料に無い県）の場合は検証対象が無いため合格扱いにする（E-4本文が明記する
 * 「45県・gunma/hokkaidoは空」の扱い）。
 *
 * 単独一致で通らない場合、県によっては「県立」「市立」等パート別の合計行しか公表されず、
 * 全体の合計行そのものが資料に存在しないことがある（fukuoka: 県立全日制合計＋市組合立
 * 全日制合計＝実際の機械集計、という構造）。その場合はラベルに「合計」を含む行（＝学校別
 * 内訳の「〇〇 計」行とは表記上区別できる）だけを合算して再照合する。chiba のように
 * 「県立全日制合計」「市立全日制合計」「公立全日制合計（＝前2件の和）」の3行を持つ県は
 * 単独一致（3件目）で先に通るため、このフォールバックには到達しない＝二重加算にならない。
 */
function checkGrandTotal(records: ParsedCompetitionRow[], officialSubtotals: OfficialSubtotal[]): ValidationIssue | null {
  if (officialSubtotals.length === 0) return null;
  const actualQuota = records.reduce((acc, r) => acc + r.quota, 0);
  const actualApplicants = records.reduce((acc, r) => acc + r.finalApplicants, 0);
  const matched = officialSubtotals.some((s) => s.quota === actualQuota && s.finalApplicants === actualApplicants);
  if (matched) return null;

  const totalLabeled = officialSubtotals.filter((s) => s.label.includes('合計'));
  if (totalLabeled.length > 0) {
    const sumQuota = totalLabeled.reduce((acc, s) => acc + s.quota, 0);
    const sumApplicants = totalLabeled.reduce((acc, s) => acc + s.finalApplicants, 0);
    if (sumQuota === actualQuota && sumApplicants === actualApplicants) return null;
  }

  const candidates = officialSubtotals.map((s) => `${s.label}(quota${s.quota}/applicants${s.finalApplicants})`).join(', ');
  return {
    check: 'grand-total',
    message: `機械集計(quota${actualQuota}/applicants${actualApplicants})が公式集計行のいずれとも一致しない。候補: ${candidates}`,
  };
}

/**
 * 各レコードのfinalRateが、T-Y11Cで確立した3方式（round2/round1/trunc2）のいずれかで
 * 説明できるかを見る。どれにも一致しないレコードが1件でもあれば`finalrate-convention`の
 * issueとして報告する（quota<=0のレコードはパーサ側で既に除外されている前提のため対象外）。
 *
 * `toleranceOverride`は、yamanashi（帰国生徒等特別措置の適用者を最終志願者数の内数として
 * 含めつつ倍率算定からは除外する・`yamanashi.ts`ヘッダコメント参照）のように、3方式のどれとも
 * 厳密一致しないことが**公表資料の算定方式そのものに起因すると既に個別検証済み**の県だけに
 * 適用する例外。ここで無条件に緩めると3方式チェックの意味が失われるため、呼び出し側
 * （`validate-all-registered.ts`）が県コードごとに明示指定した場合のみ効く。
 */
function checkFinalRateConvention(records: ParsedCompetitionRow[], toleranceOverride?: number): ValidationIssue | null {
  const unexplained: string[] = [];
  for (const r of records) {
    if (r.quota <= 0) continue;
    const storedHundredths = parseDecimalToHundredths(String(r.finalRate)).hundredths;
    const classification = classifyStoredRate(r.quota, r.finalApplicants, storedHundredths);
    if (classification.matches.length > 0) continue;
    if (toleranceOverride !== undefined && Math.abs(r.finalApplicants / r.quota - r.finalRate) < toleranceOverride) continue;
    unexplained.push(`${r.schoolName}/${r.department}(quota${r.quota}・applicants${r.finalApplicants}・finalRate${r.finalRate})`);
  }
  if (unexplained.length === 0) return null;
  return {
    check: 'finalrate-convention',
    message: `${unexplained.length}件のfinalRateが既知の3方式(round2/round1/trunc2)のいずれとも一致しない: ${unexplained.slice(0, 5).join('; ')}${unexplained.length > 5 ? ' ...' : ''}`,
  };
}

/** レコード件数が0件、または`expectedCount`が与えられていて一致しない場合に報告する。 */
function checkRecordCount(records: ParsedCompetitionRow[], expectedCount: number | undefined): ValidationIssue | null {
  if (records.length === 0) {
    return { check: 'record-count', message: 'パース結果が0件（PDF構造の変化・列境界のズレ等を疑う）' };
  }
  if (expectedCount !== undefined && records.length !== expectedCount) {
    return { check: 'record-count', message: `レコード件数が期待値と不一致（実際${records.length}件・期待${expectedCount}件）` };
  }
  return null;
}

export interface ValidateOptions {
  /** 既知のレコード件数（前年度実績・既存データ等）と突合したい場合に指定する。省略時はこの検算をスキップする。 */
  expectedRecordCount?: number;
  /**
   * finalrate-conventionチェックで3方式のいずれとも一致しないレコードを、単純計算値
   * （finalApplicants/quota）との差がこの値未満なら合格とする県別の例外許容誤差。
   * 個別検証済みの県（yamanashi等）にだけ渡すこと。省略時は3方式の厳密一致のみを合格とする。
   */
  finalRateToleranceOverride?: number;
}

/**
 * パース結果を検算する単一の入口。**1つでも issue があれば `ok: false`**（fail-closed・
 * 部分的に通す設計にしない）。
 */
export function validateParsedRecords(records: ParsedCompetitionRow[], officialSubtotals: OfficialSubtotal[], options: ValidateOptions = {}): ValidationResult {
  const issues: ValidationIssue[] = [];
  const recordCountIssue = checkRecordCount(records, options.expectedRecordCount);
  if (recordCountIssue) issues.push(recordCountIssue);
  const grandTotalIssue = checkGrandTotal(records, officialSubtotals);
  if (grandTotalIssue) issues.push(grandTotalIssue);
  const rateIssue = checkFinalRateConvention(records, options.finalRateToleranceOverride);
  if (rateIssue) issues.push(rateIssue);
  return { ok: issues.length === 0, issues };
}
