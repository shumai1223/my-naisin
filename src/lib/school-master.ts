/**
 * 全国学校マスターDB（Y-1・Project 3500の第一段）。
 *
 * 一次ソース: 文部科学省「学校コード一覧」（東日本/西日本の2ファイル・Shift_JIS CSV）。
 * https://www.mext.go.jp/b_menu/toukei/mext_01087.html
 * 令和8年5月29日公表版（東日本=北海道〜愛知県 / 西日本=滋賀県〜沖縄県）。
 *
 * Y-0憲法に従い、ここに載るのは①公表値のみ（学校コード・学校名・所在地・郵便番号）
 * ②公立（設置区分='2(公)'）のみ ③廃止年月日が空＝現存校のみ。学校別の偏差値・
 * ボーダー等の独自推定は一切含まない（[[prefecture-exam-systems-verified]]の
 * 「学校別ボーダーは非掲載＝信頼の堀」を継承）。
 *
 * このファイルは①生CSV行から正規化レコードへの変換（純関数・テスト可能）と
 * ②生成済みチャンク（src/data/schools/）を読むランタイムAPI、の2役を持つ。
 * 実際のCSV取得・ファイル書き出しは scripts/build-school-master.ts が担う
 * （Cloudflare Workersにfsが無いため、ビルド時生成物をstatic importで読む設計）。
 */

/** MEXT CSVの12列を名前付きで扱う生行（`src/lib/csv-parse.ts`のparseCsv出力1行分に対応）。 */
export interface RawMextRow {
  schoolCode: string;
  schoolType: string;
  prefectureNumberField: string; // 例: '01(北海道)'
  establishment: string; // 例: '2(公)'
  branchFlag: string; // '1(本)' | '2(分)'
  name: string;
  address: string;
  postalCode: string;
  attributeSetDate: string;
  attributeAbolishDate: string;
  oldSurveyNumber: string;
  migratedCode: string;
}

/** parseCsvの1行（12列固定）をRawMextRowへ。列数が合わない行はnull（壊れた行を握りつぶさず除外）。 */
export function parseMextRow(cols: string[]): RawMextRow | null {
  if (cols.length !== 12) return null;
  const [
    schoolCode,
    schoolType,
    prefectureNumberField,
    establishment,
    branchFlag,
    name,
    address,
    postalCode,
    attributeSetDate,
    attributeAbolishDate,
    oldSurveyNumber,
    migratedCode,
  ] = cols;
  return {
    schoolCode,
    schoolType,
    prefectureNumberField,
    establishment,
    branchFlag,
    name,
    address,
    postalCode,
    attributeSetDate,
    attributeAbolishDate,
    oldSurveyNumber,
    migratedCode,
  };
}

/** Y-0②③の絞り込み: 高等学校（本校・分校とも含む）・設置区分=公立・廃止年月日が空（現存校）。 */
export function isPublicActiveHighSchool(row: RawMextRow): boolean {
  return row.schoolType === 'D1(高校)' && row.establishment === '2(公)' && row.attributeAbolishDate === '';
}

/** '01(北海道)' のような表記から先頭2桁の都道府県番号を取り出す。取れなければnull。 */
export function extractPrefectureNumber(field: string): string | null {
  const m = /^(\d{2})/.exec(field);
  return m ? m[1] : null;
}

/**
 * PREFECTURES配列（prefectures.ts）の並び順＝JIS都道府県コード順（01=北海道…47=沖縄）を利用し、
 * '01'→'hokkaido' のような対応表を機械的に作る（手打ちの47行対応表による転記ミスを避ける）。
 */
export function buildPrefectureNumberMap(prefectureCodesInOrder: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  prefectureCodesInOrder.forEach((code, i) => {
    map[String(i + 1).padStart(2, '0')] = code;
  });
  return map;
}

export interface SchoolRecord {
  code: string;
  name: string;
  address: string;
  postalCode: string;
  /** true=分校。Y-1では本校・分校とも採用（生徒数の多い分校を除外する理由が無いため）。 */
  branch: boolean;
}

/** RawMextRow（公立・現存高校であることを確認済みの行）を最終レコードへ整形。 */
export function toSchoolRecord(row: RawMextRow): SchoolRecord {
  return {
    code: row.schoolCode,
    name: row.name,
    address: row.address,
    postalCode: row.postalCode,
    branch: row.branchFlag.includes('分'),
  };
}

export interface SchoolMasterSource {
  url: string;
  docTitle: string;
  /** 例: '令和8年5月29日公表（令和8年5月1日時点）'。 */
  edition: string;
  /** このチャンクを生成した日（'YYYY-MM-DD'）。 */
  fetchedAt: string;
}

export interface SchoolMasterFile {
  prefectureCode: string;
  source: SchoolMasterSource;
  schools: SchoolRecord[];
}

/** 学校コードの重複を検出（0件が正常）。全チャンク横断で呼ぶことを想定。 */
export function findDuplicateCodes(files: SchoolMasterFile[]): string[] {
  const seen = new Map<string, number>();
  for (const f of files) {
    for (const s of f.schools) {
      seen.set(s.code, (seen.get(s.code) ?? 0) + 1);
    }
  }
  return [...seen.entries()].filter(([, n]) => n > 1).map(([code]) => code);
}
