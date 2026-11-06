import assignmentFile from '@/data/school-serp-experiment-2026-11.json';

/**
 * T-SC1 学校ページのSERP実験（ops/tasks/T-SC1-school-page-serp-experiment.md）。
 *
 * 群 A=現行 / B=titleに収録年度を付ける / C=descriptionから倍率の数値を外す。
 * 割り当ては scripts/make-school-serp-assignment.mjs が作る固定表（実験開始後は変更しない）。
 * 表にない学校（基準期間の表示が少ない・非index県）は現行のまま。
 *
 * ⚠️ 現行群(A)の文言は、実験導入前の page.tsx と1文字も違わないこと（テストで固定している）。
 *    titleには必ず「校名」と「倍率」を残す（過去に「○○高校 倍率」の順位が消えた前科）。
 */
export type SchoolSerpArm = 'A' | 'B' | 'C';

const ASSIGNMENT = assignmentFile.assignment as Record<string, SchoolSerpArm>;

export function getSchoolSerpArm(code: string, schoolCode: string): SchoolSerpArm | null {
  return ASSIGNMENT[`${code}/${schoolCode}`] ?? null;
}

/** 「令和8年度（2026年度）」→「令和8年度」。読み取れなければ null（その場合Bは現行のtitleにする）。 */
export function extractReiwaLabel(fiscalYear: string | undefined | null): string | null {
  return fiscalYear?.match(/令和\d+年度/)?.[0] ?? null;
}

export interface SchoolSerpTextInput {
  arm: SchoolSerpArm | null;
  displayName: string;
  prefectureName: string;
  overallRate: number | string;
  totalQuota: number | string;
  totalApplicants: number | string;
  /** そのページの数字の年度（例: 令和8年度）。数字と一致する年度だけを渡すこと。 */
  fiscalLabel: string | null;
}

export function buildSchoolSerpText(input: SchoolSerpTextInput): { title: string; description: string } {
  const { arm, displayName, prefectureName, overallRate, totalQuota, totalApplicants, fiscalLabel } = input;

  const currentTitle = `${displayName}の入試倍率・募集人員 | My Naishin`;
  const currentDescription = `${displayName}(${prefectureName})の今季入試倍率${overallRate}倍・募集人員${totalQuota}名・応募者数${totalApplicants}名。教育委員会公表の一次データに基づく。`;

  if (arm === 'B' && fiscalLabel) {
    return { title: `${displayName}の入試倍率（${fiscalLabel}）・募集人員 | My Naishin`, description: currentDescription };
  }
  if (arm === 'C') {
    return {
      title: currentTitle,
      description: `${displayName}(${prefectureName})の学科別の入試倍率・募集人員・応募者数。教育委員会公表の一次データに基づく。`,
    };
  }
  return { title: currentTitle, description: currentDescription };
}
