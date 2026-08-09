/**
 * Λ-5 私立高校マスター 第二段: 各私立校の公式募集要項PDFから取得した募集定員データ。
 *
 * school-master.ts（Y-1/Λ-5第一段）が生成する schools-private/{県}.ts は文科省CSV由来の
 * 学校コード・名称・住所のみ（機械生成・全校網羅）。本ファイルはそれとは別に、各校の
 * 公式サイトが公開する募集要項PDF/ページから人手で確認した募集定員等を1校ずつ収録する
 * （手動収集・揃う分だけ）。
 *
 * Y-0憲法を継承: ①公表値のみ ②1データ点1出典（学校単位でsourceを持つ） ③確認できない
 * 学校は独自推定をせず skipped 配列に理由付きで正直に記録する。
 */

/** 学科・コース別の募集定員（コース分けが無い学校は単一エントリでよい）。 */
export interface CourseCapacity {
  courseName: string;
  capacity: number;
}

export interface PrivateSchoolDetailSource {
  url: string;
  docTitle: string;
  /** この学校のデータを確認した日（'YYYY-MM-DD'）。 */
  fetchedAt: string;
  /**
   * 出典の階層。'primary'=各校公式サイトの募集要項。'secondary'=(株)育伸社等の第三者編集PDF由来。
   * secondaryはindex対象外(noindex維持・内部データとしては保持)とする(2026-07-31方向修正指示・修正2)。
   */
  sourceTier: 'primary' | 'secondary';
}

/** school-master.ts の SchoolRecord.code と一致させ、参照台帳（第一段）と紐付ける。 */
export interface PrivateSchoolDetail {
  schoolCode: string;
  schoolName: string;
  /** 例: '令和8年度' '2026年度'（学校の公表表記をそのまま使う）。 */
  fiscalYearLabel: string;
  courses: CourseCapacity[];
  /** courses の合計、またはコース分けが無い場合の単一定員。 */
  totalCapacity: number;
  source: PrivateSchoolDetailSource;
}

/** 確認できなかった学校を理由付きで記録する（捏造ゼロ・正直にスキップ台帳）。 */
export interface PrivateSchoolSkipEntry {
  schoolCode: string;
  schoolName: string;
  reason: string;
}

export interface PrivateSchoolDetailFile {
  prefectureCode: string;
  schools: PrivateSchoolDetail[];
  skipped: PrivateSchoolSkipEntry[];
}

/** courses の合計が totalCapacity と一致するか（手動転記ミスの検出用）。courses空なら常にtrue。 */
export function checkCourseCapacitySum(detail: PrivateSchoolDetail): boolean {
  if (detail.courses.length === 0) return true;
  const sum = detail.courses.reduce((acc, c) => acc + c.capacity, 0);
  return sum === detail.totalCapacity;
}

/**
 * 同一県内でschoolCodeが schools と skipped の両方に重複していないか（収録漏れ・二重登録の検出）。
 * 掛-2（私立×多年度）では同じ学校が複数の年度で別レコードとして schools 内に複数回出現しうるため、
 * schools内での同一コード多重出現自体は許容する（private-school-tuition.tsの
 * findDuplicateOrMissingTuitionCodesと同じ設計）。duplicatesは「schoolsとskippedの両方に
 * 同じコードが存在する」矛盾のみを検出する。
 */
export function findDuplicateOrMissingCodes(
  file: PrivateSchoolDetailFile,
  allCodesInPrefecture: string[]
): { duplicates: string[]; missing: string[] } {
  const schoolCodes = new Set(file.schools.map((s) => s.schoolCode));
  const skippedCodes = new Set(file.skipped.map((s) => s.schoolCode));
  const duplicates = [...schoolCodes].filter((code) => skippedCodes.has(code));
  const coveredSet = new Set([...schoolCodes, ...skippedCodes]);
  const missing = allCodesInPrefecture.filter((code) => !coveredSet.has(code));
  return { duplicates, missing };
}
