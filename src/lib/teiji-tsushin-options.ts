/**
 * T-P1 P1-4: 「内申点が足りない」ときに制度上どういう選択肢が公表されているかを返すための
 * データ層。`src/data/teiji-competition-rates/`（T-P1 P1-3で収集）を都道府県別に集約し、
 * ページ側が「あなたはここへ行くべき」を一切書かずに済むよう、公表値（学校名・学科・募集人員・
 * 出願者数・倍率）だけを返す純粋関数として実装する（Y-0憲法③捏造ゼロ・P1-0の出口確定に基づく）。
 *
 * ⚠️trackType（定時制/通信制）の判定は、各`<pref>.ts`が既に手入力時点でdepartment文字列に
 * 埋め込んでいる「通信制」という語の有無だけで機械的に判定する（推測しない）。department文字列に
 * 「通信制」が含まれないレコードはすべて定時制として扱う（このデータセットには定時制と通信制
 * しか存在しないため）。
 */
import { TEIJI_COMPETITION_RATE_BY_PREFECTURE } from '@/data/teiji-competition-rates';
import type { CompetitionRateSource } from './competition-rate';

export type AlternativeTrackType = '定時制' | '通信制';

export interface AlternativeTrackSchool {
  schoolName: string;
  department: string;
  trackType: AlternativeTrackType;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

export interface PrefectureAlternativeTracks {
  prefectureCode: string;
  coverageStatus: 'partial' | 'complete';
  coverageNote: string;
  schools: AlternativeTrackSchool[];
  schoolCount: number;
  teijiCount: number;
  tsushinCount: number;
  sources: CompetitionRateSource[];
}

function classifyTrack(department: string): AlternativeTrackType {
  return department.includes('通信制') ? '通信制' : '定時制';
}

/**
 * 都道府県コードから、公表されている定時制・通信制の選択肢一覧を返す。
 * データが無い（=T-P1 P1-3で未収集、またはhyogo/yamaguchiのようにブロック中の）
 * 都道府県はnullを返す（推測でページを作らないため・呼び出し側はnotFound()すること）。
 */
export function getPrefectureAlternativeTracks(prefectureCode: string): PrefectureAlternativeTracks | null {
  const file = TEIJI_COMPETITION_RATE_BY_PREFECTURE[prefectureCode];
  if (!file) return null;

  const schools: AlternativeTrackSchool[] = file.records.map((r) => ({
    schoolName: r.schoolName,
    department: r.department,
    trackType: classifyTrack(r.department),
    quota: r.quota,
    finalApplicants: r.finalApplicants,
    finalRate: r.finalRate,
  }));

  return {
    prefectureCode,
    coverageStatus: file.coverage.status,
    coverageNote: file.coverage.note,
    schools,
    schoolCount: new Set(schools.map((s) => s.schoolName)).size,
    teijiCount: schools.filter((s) => s.trackType === '定時制').length,
    tsushinCount: schools.filter((s) => s.trackType === '通信制').length,
    sources: file.sources,
  };
}

/** T-P1 P1-3でデータを収録済みの都道府県コード一覧（SSGのgenerateStaticParams用）。 */
export const ALTERNATIVE_TRACK_PREFECTURE_CODES: string[] = Object.keys(TEIJI_COMPETITION_RATE_BY_PREFECTURE);
