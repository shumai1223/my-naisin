/**
 * T-S1 S1-4: 個別学校ページ（`/pref/[code]/school/[schoolCode]`）から、その学校固有の
 * 定時制・通信制課程データを引くための薄いグルー層。
 *
 * データ自体はT-P1 P1-4で整備済みの`getPrefectureAlternativeTracks`（学校名は短縮表記）を
 * そのまま再利用し、`school-name-match.ts`の既存の突合ロジック（`matchSchoolNameToCode`・
 * competition-rates側の短縮名との突合で実績のある関数）で学校マスターのschoolCodeへ紐付ける。
 * 全日制の`buildSchoolPageDataForPrefecture`パイプラインには一切触れない（既存の47県分の
 * 本番挙動を壊すリスクをゼロにするため、完全に独立した追加のみのモジュールとする）。
 */
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';
import { getPrefectureAlternativeTracks, type AlternativeTrackSchool } from '@/lib/teiji-tsushin-options';
import { matchSchoolNameToCode } from '@/lib/school-name-match';

/**
 * 指定した学校（都道府県コード+学校マスターのschoolCode）が持つ定時制・通信制課程のレコードを返す。
 * 一致しない場合・データが無い都道府県の場合は空配列（`this school has no data` を正直に表す）。
 * `matchSchoolNameToCode`が'ambiguous'/'no-match'と判定した場合も誤った紐付けをしないため除外する。
 */
export function getSchoolTeijiRecords(prefectureCode: string, schoolCode: string): AlternativeTrackSchool[] {
  const data = getPrefectureAlternativeTracks(prefectureCode);
  const master = SCHOOL_MASTER_BY_PREFECTURE[prefectureCode];
  if (!data || !master) return [];
  return data.schools.filter(
    (s) => matchSchoolNameToCode(s.schoolName, master.schools).matchedCode === schoolCode
  );
}
