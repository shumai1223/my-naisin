/**
 * 個別学校ページ層(Λ-2)のデータ取得ヘルパー。学校マスター+今季倍率から
 * SchoolPageData[]を組み立てる薄いグルー層（データ層自体はschool-page-data.tsが純粋関数として保持）。
 * `/pref/[code]/school/[schoolCode]`と`/pref/[code]`(Λ+3のハブリンク)の両方から共有する。
 */
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { buildSchoolPageDataForPrefecture, type SchoolPageData } from '@/lib/school-page-data';
import { SCHOOL_NAME_ALIASES_BY_PREFECTURE } from '@/lib/school-name-aliases';

/**
 * index解禁済みの県（分割公開の波・👤裁定2026-08-01）。
 * ページ側(generateStaticParams/robots)とsitemap.ts双方の単一ソース。
 * 新しい波を出す時はここに県コードを追加する（GSC確認後に次の波を追加すること）。
 * wave1(2026-08-01): tokyo(パイロット)+kanagawa/saitama/chiba/hyogo。
 * wave2(2026-08-04): tottori/kochi/saga/yamanashi/shimane
 *   (SERP実測2026-08-02で「地方中規模校=学校公式サイト/Wikipediaが上位に入り込み倍率の実数値を
 *   出しているページが競合に無い=空白地帯」と判定された県を優先。特にtottori/yamanashiは
 *   上位5件のどのページにも倍率の実数値が無い競合ゼロ状態と実測済み)。
 * wave3(2026-08-06): fukui/nara/kagawa/tokushima/wakayama
 *   (wave2に続き学校数最小クラスの地方県を優先・school-page-wave-readiness.tsで
 *   残り36県全て即座解禁可能=0県未準備と再確認済み。2〜3日おきの分割公開ペースを維持)。
 * wave4(2026-08-08頃): miyazaki/toyama/oita/ishikawa/aomori
 * wave5(2026-08-09): aichi/osaka/fukuoka/shizuoka/ibaraki/hiroshima/niigata/miyagi/
 *   kagoshima/gifu/gunma/tochigi/okinawa/ehime/nagasaki/mie/kyoto/kumamoto/okayama/
 *   akita/shiga（21県一括）。**gate-decisions-2026-07-28で👤が既に「46県一括解禁」を
 *   裁定済み**（loopは段階解禁を推奨したが👤が却下し一括を選択・条件はsitemap投入を
 *   数日ずらす分割デプロイのみ）と判明したため、5県ずつの自主規制ペースを是正し
 *   school-page-wave-readiness.tsで即座解禁可能と判定された県を全てまとめて追加した。
 * wave6(2026-08-09): nagano/iwate/fukushima/yamaguchi/yamagata（5県）。
 *   **wave5直後に発覚した重大バグの修正込み**: getPrefectureSchoolPageDataが掛-1の
 *   多年度レコード(fiscalYear付き)をフィルタせず渡していたため、同一学科が複数年度分
 *   そのままdepartmentRatesに混入しtotalQuota等が無意味な合算値になっていた
 *   (toyama等、既存indexed県で実際に発生・b51d296で修正)。この修正でschool-name-match
 *   のmatchRateも正常化し、旧校名(盛岡南・不来方等、統合前のR6専用レコード)による
 *   誤ブロックが解消してこの5県が即座解禁可能になった。
 *   残り1県(hokkaido)はcategory-detail粒度の学科→カテゴリ対応表が未整備でブロック中
 *   （school-page-wave-readiness.ts参照・DEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTUREへの
 *   追加が必要）。
 */
export const INDEXED_SCHOOL_PAGE_PREFECTURE_CODES = [
  'tokyo',
  'kanagawa',
  'saitama',
  'chiba',
  'hyogo',
  'tottori',
  'kochi',
  'saga',
  'yamanashi',
  'shimane',
  'fukui',
  'nara',
  'kagawa',
  'tokushima',
  'wakayama',
  'miyazaki',
  'toyama',
  'oita',
  'ishikawa',
  'aomori',
  'aichi',
  'osaka',
  'fukuoka',
  'shizuoka',
  'ibaraki',
  'hiroshima',
  'niigata',
  'miyagi',
  'kagoshima',
  'gifu',
  'gunma',
  'tochigi',
  'okinawa',
  'ehime',
  'nagasaki',
  'mie',
  'kyoto',
  'kumamoto',
  'okayama',
  'akita',
  'shiga',
  'nagano',
  'iwate',
  'fukushima',
  'yamaguchi',
  'yamagata',
];

export function getPrefectureSchoolPageData(code: string): { schools: SchoolPageData[] } | null {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  if (!master || !rates) return null;
  // ⚠️2026-08-09発見・緊急修正: 掛-1(学校別×多年度)がrates.recordsにR6/R7等の過去年度分を
  // fiscalYear付きで追加するようになったが、この関数はfiscalYearでフィルタしていなかったため、
  // 同じ学科が複数年度分そのままdepartmentRatesに混入し、totalQuota/totalApplicants/overallRateが
  // 複数年度の合算という無意味な値になっていた(toyama等、既にindex解禁済みの県で実際に発生を確認)。
  // 「今季倍率」が主役という本ファイル冒頭の設計方針どおり、今季(fiscalYearが無い=最新年度)分のみを渡す。
  const currentYearRecords = rates.records.filter((r) => !r.fiscalYear);
  const { schools } = buildSchoolPageDataForPrefecture(
    master.schools,
    currentYearRecords,
    SCHOOL_NAME_ALIASES_BY_PREFECTURE[code] ?? {}
  );
  return { schools };
}
