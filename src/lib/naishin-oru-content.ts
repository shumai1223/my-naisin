import { PREFECTURES } from '@/lib/prefectures';
import { calculateAllNScore } from '@/lib/prefecture-helpers';

/**
 * 「オール3/オール4/オール5」の内申点計算例（O-1）。
 * GSC実測（data/gsc-mining-2026-07-09.json・O-1バケット5,779imp）で「オール3で行ける高校 ○○」
 * 型の実在クエリを確認。ただし学校別の合格基準（ボーダー）は年度・倍率で変動し一次情報が無いため
 * 断定できない＝掲載しない（[[prefecture-exam-systems-verified]]の方針を踏襲）。
 * ここで提供できる確実な情報は「9教科すべてが評定nだった場合の内申点の実数」という決定論の計算例のみ。
 */

export const ORU_GRADES = [3, 4, 5] as const;
export type OruGrade = (typeof ORU_GRADES)[number];

export function parseOruGrade(value: string): OruGrade | null {
  const n = Number(value);
  return (ORU_GRADES as readonly number[]).includes(n) ? (n as OruGrade) : null;
}

export interface OruPrefectureExample {
  code: string;
  name: string;
  score: number;
  maxScore: number;
  /** 満点に対する割合（%・小数1桁）。都道府県ごとに満点が異なるため単純な点数比較の代わりに使う。 */
  percentage: number;
}

/** 全47都道府県について、9教科オールnの内申点を計算する（検証済み計算方式のみ使用・捏造ゼロ）。 */
export function getOruExamples(grade: OruGrade): OruPrefectureExample[] {
  return PREFECTURES.map((p) => {
    const score = calculateAllNScore(p.code, grade);
    return {
      code: p.code,
      name: p.name,
      score,
      maxScore: p.maxScore,
      percentage: Math.round((score / p.maxScore) * 1000) / 10,
    };
  });
}

/** GSC実測でクエリボリュームが多かった都道府県（O-1バケット上位）。ページ上部で優先表示する。 */
export const ORU_HIGHLIGHT_CODES = [
  'kanagawa',
  'tokyo',
  'saitama',
  'osaka',
  'aichi',
  'hyogo',
  'kyoto',
  'mie',
  'chiba',
  'nara',
] as const;

export const ORU_GRADE_LABEL: Record<OruGrade, string> = {
  3: 'オール3',
  4: 'オール4',
  5: 'オール5',
};
