/**
 * 個別学校ページ層(Λ-2)のデータ取得ヘルパー。学校マスター+今季倍率から
 * SchoolPageData[]を組み立てる薄いグルー層（データ層自体はschool-page-data.tsが純粋関数として保持）。
 * `/pref/[code]/school/[schoolCode]`と`/pref/[code]`(Λ+3のハブリンク)の両方から共有する。
 */
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { buildSchoolPageDataForPrefecture, type SchoolPageData } from '@/lib/school-page-data';

/**
 * index解禁済みの県（分割公開の波・👤裁定2026-08-01）。
 * ページ側(generateStaticParams/robots)とsitemap.ts双方の単一ソース。
 * 新しい波を出す時はここに県コードを追加する（GSC確認後に次の波を追加すること）。
 * wave1(2026-08-01): tokyo(パイロット)+kanagawa/saitama/chiba/hyogo。
 */
export const INDEXED_SCHOOL_PAGE_PREFECTURE_CODES = ['tokyo', 'kanagawa', 'saitama', 'chiba', 'hyogo'];

export function getPrefectureSchoolPageData(code: string): { schools: SchoolPageData[] } | null {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  if (!master || !rates) return null;
  const { schools } = buildSchoolPageDataForPrefecture(master.schools, rates.records);
  return { schools };
}
