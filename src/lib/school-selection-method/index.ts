// T-Y14: 学校・学科別「入学者選抜の評価方法」DBの型と純関数。
//
// 既存の県レベル総合得点方式（`prefecture-exam-data.ts` / `total-score/*`）とは別レイヤー。
// 県標準の計算式そのものではなく、「学力検査問題の種類（A/B/C等）」「学力検査と調査書に
// かける倍率のタイプ」「面接・実技等の実施有無」といった、学校・学科ごとに異なりうる
// 評価方法のルールを転記する（[[ops/tasks/T-Y14-nyuushi-hyoka-hoho-db.md]]参照）。
//
// Y-0憲章の適用:
//  - 公表資料に記載された評価方法（ルール）の転記のみ。難易度・ボーダーの推定は一切しない
//  - 1データ点1出典（都道府県教委が公表するページ・PDFのURL必須）
//  - 制度は年度で改定されるため fiscalYear ごとに別レコードとして持つ
//  - 47都道府県・県内全校が揃わなくてよい。資料のページ数が多い場合は収録範囲を
//    coverageNote に明記し、段階的に拡充する

/** この都道府県の学校別評価方法一覧の確認状況。 */
export type SchoolSelectionMethodStatus =
  /** 県単位で構造化された一覧資料が公表されていると確認できた。 */
  | 'structured'
  /** 県単位の一覧はなく、学校ごとに個別公表されている。 */
  | 'individual'
  /** まだ一次資料で確認できていない。 */
  | 'unknown';

export interface SchoolSelectionMethodSource {
  url: string;
  docTitle: string;
  /** 最終確認日 YYYY-MM-DD。 */
  lastChecked: string;
}

/** 1校・1選抜区分ぶんの評価方法レコード。 */
export interface SchoolSelectionMethodRecord {
  /** 資料に記載された学校名（表記ゆれはそのまま転記する）。 */
  schoolName: string;
  /** 学科名（普通科等）。資料が学科別に分かれていない場合は省略可。 */
  department?: string;
  /** 資料に記載された選抜区分名（例: '一般', '日本語指導を要する生徒に対する特別入学者選抜'）。 */
  selectionCategory: string;
  /** 教科ごとの学力検査問題の種類（例: 国語='B'）。資料に無い教科はキー自体を省略する。 */
  examSubjectTypes?: Partial<Record<'kokugo' | 'suugaku' | 'eigo' | 'rika' | 'shakai', string>>;
  /** 学力検査の成績・調査書の評定にかける倍率のタイプ（資料の表記をそのまま転記。例: 'I'〜'V'）。 */
  ratioType?: string;
  note?: string;
}

/** 1都道府県・1年度ぶんの学校別評価方法レコード群。 */
export interface PrefectureSchoolSelectionMethod {
  prefectureCode: string;
  /** 例: '令和8年度（2026年度）'。制度・資料は年度で改定されるため必須。 */
  fiscalYear: string;
  status: SchoolSelectionMethodStatus;
  /** status が 'structured' の場合のみ意味を持つ。 */
  schools?: SchoolSelectionMethodRecord[];
  /** 資料全体のうちどこまで収録したか（例: '全66頁中1頁目・普通科4校のみ収録。他校は未収録'）。 */
  coverageNote?: string;
  source: SchoolSelectionMethodSource;
  note?: string;
}

/** 都道府県コード→レコードのマップの型（実データは `@/data/school-selection-methods` 側が保持する）。 */
export type SchoolSelectionMethodByPrefecture = Partial<Record<string, PrefectureSchoolSelectionMethod>>;

/** 指定県のレコードを返す。未登録なら undefined（'unknown' 相当）。 */
export function getSchoolSelectionMethod(
  byPrefecture: SchoolSelectionMethodByPrefecture,
  prefectureCode: string
): PrefectureSchoolSelectionMethod | undefined {
  return byPrefecture[prefectureCode];
}

/**
 * 指定県・指定学校名・指定選抜区分に一致するレコードを返す。
 * status が 'structured' かつ収録済みの学校のみ見つかる（未収録校は null）。
 */
export function findSchoolSelectionRecord(
  byPrefecture: SchoolSelectionMethodByPrefecture,
  prefectureCode: string,
  schoolName: string,
  selectionCategory: string
): SchoolSelectionMethodRecord | null {
  const record = getSchoolSelectionMethod(byPrefecture, prefectureCode);
  if (!record || record.status !== 'structured' || !record.schools) return null;
  const school = record.schools.find(
    (s) => s.schoolName === schoolName && s.selectionCategory === selectionCategory
  );
  return school ?? null;
}

/** 全登録県のうち、指定ステータスに一致する都道府県コードの配列を返す（集計・テスト用）。 */
export function prefecturesByStatus(
  byPrefecture: SchoolSelectionMethodByPrefecture,
  status: SchoolSelectionMethodStatus
): string[] {
  return Object.values(byPrefecture)
    .filter((r): r is PrefectureSchoolSelectionMethod => r !== undefined && r.status === status)
    .map((r) => r.prefectureCode)
    .sort();
}
