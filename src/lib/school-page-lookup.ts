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
];

export function getPrefectureSchoolPageData(code: string): { schools: SchoolPageData[] } | null {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  if (!master || !rates) return null;
  const { schools } = buildSchoolPageDataForPrefecture(
    master.schools,
    rates.records,
    SCHOOL_NAME_ALIASES_BY_PREFECTURE[code] ?? {}
  );
  return { schools };
}
