// T-Y15: 都道府県立高校の学区（通学区域）＋学区外就学条件DBの型と純関数。
//
// 既存 `exam-system-change-history.ts` にはSagaの学区廃止に関する記事的な記述が断片的に
// あるのみで、47都道府県横断の構造化DBは存在しない（[[ops/tasks/T-Y15-gakku-tsugaku-kuiki-db.md]]
// 参照）。本モジュールはその欠けているピースを扱う。既存記事の記述は書き換えない。
//
// Y-0憲章の適用:
//  - 公表されている制度（学区の有無・区割り・学区外就学条件）の転記のみ
//  - 1データ点1出典（都道府県教委が公表するページ・PDFのURL必須。ただし歴史的経緯の一次資料が
//    見つけにくい場合はWikipedia等の二次資料を使い、その旨をnoteに明記する）
//  - 制度は年度で改定されるため fiscalYear ごとに別レコードとして持つ
//  - 確認できない県は 'unknown' として明示

/** この都道府県の学区制度の確認状況。 */
export type SchoolDistrictStatus =
  /** 学区制度（区割り等）が構造化された一次資料で確認できた。 */
  | 'structured'
  /** 学区ごとの個別事情の確認が必要（見送り含む）。 */
  | 'individual'
  /** まだ一次資料で確認できていない。 */
  | 'unknown';

/** この県の学区制度の類型。 */
export type SchoolDistrictSystemType =
  /** 学区制度そのものが廃止され、県内どこからでも出願できる（全県一学区）。 */
  | 'abolished'
  /** 学区が区割りされている（districtsを持つ）。 */
  | 'districted'
  /** 制度上もともと学区の定めがない（廃止の経緯を持たない）。 */
  | 'none-by-design';

/** 1学区の区割り情報。districted の場合のみ意味を持つ。 */
export interface SchoolDistrictArea {
  /** 学区名（例: '尾張学区'）。 */
  name: string;
  /** 区域に含まれる市区町村名（公表資料に記載がある範囲でよい）。 */
  municipalities?: string[];
  note?: string;
}

export interface SchoolDistrictSource {
  url: string;
  docTitle: string;
  /** 最終確認日 YYYY-MM-DD。 */
  lastChecked: string;
}

/** 1都道府県・1年度ぶんの学区制度レコード。 */
export interface PrefectureSchoolDistrict {
  prefectureCode: string;
  /** 例: '令和8年度（2026年度）'。制度・資料は年度で改定されるため必須。 */
  fiscalYear: string;
  status: SchoolDistrictStatus;
  systemType?: SchoolDistrictSystemType;
  /** systemType が 'districted' の場合のみ意味を持つ。 */
  districts?: SchoolDistrictArea[];
  /** 学区外からの就学条件の概要（隣接学区特例・専門学科は県域募集等）。 */
  outOfDistrictCondition?: string;
  /** 廃止の場合、廃止年度（例: '平成15年度（2003年度）'）。 */
  abolishedFiscalYear?: string;
  source: SchoolDistrictSource;
  note?: string;
}

/** 都道府県コード→レコードのマップの型（実データは `@/data/school-districts` 側が保持する）。 */
export type SchoolDistrictByPrefecture = Partial<Record<string, PrefectureSchoolDistrict>>;

/** 指定県のレコードを返す。未登録なら undefined（'unknown' 相当）。 */
export function getSchoolDistrict(
  byPrefecture: SchoolDistrictByPrefecture,
  prefectureCode: string
): PrefectureSchoolDistrict | undefined {
  return byPrefecture[prefectureCode];
}

/** 指定県が学区制度を持つか（districted）を返す。未登録/未確認は null。 */
export function hasDistrictSystem(
  byPrefecture: SchoolDistrictByPrefecture,
  prefectureCode: string
): boolean | null {
  const record = getSchoolDistrict(byPrefecture, prefectureCode);
  if (!record || record.status !== 'structured' || !record.systemType) return null;
  return record.systemType === 'districted';
}

/** 全登録県のうち、指定した学区制度類型に一致する都道府県コードの配列を返す（集計・テスト用）。 */
export function prefecturesBySystemType(
  byPrefecture: SchoolDistrictByPrefecture,
  systemType: SchoolDistrictSystemType
): string[] {
  return Object.values(byPrefecture)
    .filter(
      (r): r is PrefectureSchoolDistrict =>
        r !== undefined && r.status === 'structured' && r.systemType === systemType
    )
    .map((r) => r.prefectureCode)
    .sort();
}
