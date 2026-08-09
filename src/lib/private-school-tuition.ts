/**
 * 掛-3（高校別の学費）第一段: 私立高校の公式サイト/募集要項から取得した学費データ。
 *
 * private-school-detail.ts（Λ-5第二段・募集定員）と同じ学校単位の設計を踏襲し、
 * 学費（入学金・授業料等）を別軸として収録する。Y-0憲法を継承:
 * ①公表値のみ ②1データ点1出典（学校単位でsourceを持つ） ③確認できない学校は
 * 独自推定をせず skipped 配列に理由付きで正直に記録する。
 *
 * 【設計判断】学校により「月額納付金」（月ごとの請求額）と「年間授業料」（年額一括）の
 * 2通りの公表形式が混在するため、各費目に billingCycle を持たせて区別する。
 * 就学支援金による相殺後の実質負担額（世帯収入依存）は掲載せず、相殺前の額面（gross）を
 * 収録する（「支援金の適用可否は世帯収入依存＝断定しない」というΛ-9/掛-3設計注記を継承）。
 * 研修旅行費・教材費・検定料等の「別途徴収」項目は金額不明なことが多く、収録できる費目の
 * 合計だけでは初年度の総費用を過小に見せるリスクがあるため、hasUnspecifiedAdditionalFees
 * フラグで正直に明示する（合計値の自動計算・独自推定はしない）。
 */

export type TuitionBillingCycle = 'one_time' | 'monthly' | 'annual';

export interface TuitionFeeItem {
  /** 例: '入学金' '授業料' '教育振興費' 'PTA会費'。出典の表記をそのまま使う。 */
  label: string;
  amount: number;
  billingCycle: TuitionBillingCycle;
}

export interface PrivateSchoolTuitionSource {
  url: string;
  docTitle: string;
  /** この学校のデータを確認した日（'YYYY-MM-DD'）。 */
  fetchedAt: string;
  /** 'primary'=学校公式サイト/募集要項。'secondary'=第三者編集サイト由来（noindex維持）。 */
  sourceTier: 'primary' | 'secondary';
}

/** school-master.ts の SchoolRecord.code と一致させる（private-school-detail.tsと同じ紐付け）。 */
export interface PrivateSchoolTuition {
  schoolCode: string;
  schoolName: string;
  /** コースにより金額が異なる場合のみ指定（無指定=全コース共通）。 */
  courseName?: string;
  /** 例: '令和8年度'。出典に年度表記が無い場合は 'ページ内に年度表記なし（確認日時点）' と正直に記す。 */
  fiscalYearLabel: string;
  fees: TuitionFeeItem[];
  /** 研修旅行費・教材費・検定料等、出典に金額非公表の別途徴収項目が存在するか。 */
  hasUnspecifiedAdditionalFees: boolean;
  note?: string;
  source: PrivateSchoolTuitionSource;
}

export interface PrivateSchoolTuitionSkipEntry {
  schoolCode: string;
  schoolName: string;
  reason: string;
}

export interface PrivateSchoolTuitionFile {
  prefectureCode: string;
  schools: PrivateSchoolTuition[];
  skipped: PrivateSchoolTuitionSkipEntry[];
}

/** one_time以外の費目のうち、'monthly'区分の額面合計（annualとの単純合算はしない＝周期が異なる値を混ぜない）。 */
export function sumMonthlyFees(entry: PrivateSchoolTuition): number {
  return entry.fees.filter((f) => f.billingCycle === 'monthly').reduce((acc, f) => acc + f.amount, 0);
}

export function sumOneTimeFees(entry: PrivateSchoolTuition): number {
  return entry.fees.filter((f) => f.billingCycle === 'one_time').reduce((acc, f) => acc + f.amount, 0);
}

export function sumAnnualFees(entry: PrivateSchoolTuition): number {
  return entry.fees.filter((f) => f.billingCycle === 'annual').reduce((acc, f) => acc + f.amount, 0);
}

/** 同一県内でschoolCodeが schools と skipped の両方に重複していないか（収録漏れ・二重登録の検出）。 */
export function findDuplicateOrMissingTuitionCodes(
  file: PrivateSchoolTuitionFile,
  allCodesInPrefecture: string[]
): { duplicates: string[]; missing: string[] } {
  const covered = [...file.schools.map((s) => s.schoolCode), ...file.skipped.map((s) => s.schoolCode)];
  const seen = new Map<string, number>();
  for (const code of covered) seen.set(code, (seen.get(code) ?? 0) + 1);
  const duplicates = [...seen.entries()].filter(([, n]) => n > 1).map(([code]) => code);
  const coveredSet = new Set(covered);
  const missing = allCodesInPrefecture.filter((code) => !coveredSet.has(code));
  return { duplicates, missing };
}
