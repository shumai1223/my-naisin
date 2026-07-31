/**
 * 個別学校ページ層(Λ-2)のデータ取得ヘルパー。学校マスター+今季倍率から
 * SchoolPageData[]を組み立てる薄いグルー層（データ層自体はschool-page-data.tsが純粋関数として保持）。
 * `/pref/[code]/school/[schoolCode]`と`/pref/[code]`(Λ+3のハブリンク)の両方から共有する。
 */
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { buildSchoolPageDataForPrefecture, type SchoolPageData } from '@/lib/school-page-data';

export function getPrefectureSchoolPageData(code: string): { schools: SchoolPageData[] } | null {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  if (!master || !rates) return null;
  const { schools } = buildSchoolPageDataForPrefecture(master.schools, rates.records);
  return { schools };
}
