import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { RANK_DEFINITIONS, SUBJECTS } from './constants';
import { getPrefectureByCode, resolvePrefectureConfig } from './prefectures';
import type { RankDefinition, Scores, SubjectCategory, SubjectKey } from './types';

 const RANK_DEFINITIONS_DESC = [...RANK_DEFINITIONS].sort((a, b) => b.minPercent - a.minPercent);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function roundInt(value: number) {
  return Math.round(value);
}

 export function toIntPercent(value: number) {
   return Math.floor(clamp(value, 0, 100));
 }

export function calculateTotalScore(scores: Scores, prefectureCode: string, use10PointScale?: boolean, variantCode?: string): number {
  const rawPrefecture = getPrefectureByCode(prefectureCode);
  const prefecture = rawPrefecture ? resolvePrefectureConfig(rawPrefecture, variantCode) : undefined;
  if (!prefecture) {
    // デフォルトは通常計算（45点満点）
    return SUBJECTS.reduce((sum, subject) => {
      const raw = scores[subject.key];
      const safe = clamp(roundInt(raw), 1, 5);
      return sum + safe;
    }, 0);
  }

  const coreSubjects: SubjectKey[] = ['japanese', 'math', 'english', 'science', 'social'];
  const practicalSubjects: SubjectKey[] = ['music', 'art', 'pe', 'tech'];
  
  let total = 0;
  const maxGrade = (use10PointScale && prefecture.supports10PointScale) ? 10 : 5;

  for (const grade of prefecture.targetGrades) {
    let gradeTotal = 0;
    // 5教科
    for (const key of coreSubjects) {
      const raw = scores[key];
      const safe = clamp(roundInt(raw), 1, maxGrade);
      gradeTotal += safe * prefecture.coreMultiplier;
    }
    
    // 実技4教科
    for (const key of practicalSubjects) {
      const raw = scores[key];
      const safe = clamp(roundInt(raw), 1, maxGrade);
      gradeTotal += safe * prefecture.practicalMultiplier;
    }
    total += gradeTotal * (prefecture.gradeMultipliers[grade] || 1);
  }
  
  return Math.round(total);
}

export function calculateMaxScore(prefectureCode: string, use10PointScale?: boolean, variantCode?: string): number {
  const rawPrefecture = getPrefectureByCode(prefectureCode);
  if (!rawPrefecture) {
    return 45; // デフォルト
  }
  const prefecture = resolvePrefectureConfig(rawPrefecture, variantCode);
  
  const maxGrade = (use10PointScale && prefecture.supports10PointScale) ? 10 : 5;
  
  let totalMax = 0;

  for (const grade of prefecture.targetGrades) {
    const coreMax = 5 * maxGrade * prefecture.coreMultiplier;
    const practicalMax = 4 * maxGrade * prefecture.practicalMultiplier;
    const gradeMax = coreMax + practicalMax;  
    totalMax += gradeMax * (prefecture.gradeMultipliers[grade] || 1);
  }

  return Math.round(totalMax);
}

export function calculatePercent(total: number, max: number) {
  if (max <= 0) return 0;
  return toIntPercent((total / max) * 100);
}

export function getRankForPercent(percent: number): RankDefinition {
  const p = clamp(percent, 0, 100);
  return RANK_DEFINITIONS_DESC.find((r) => p >= r.minPercent) ?? RANK_DEFINITIONS_DESC[RANK_DEFINITIONS_DESC.length - 1];
}

export function getSubjectWeight(prefectureCode: string, category: SubjectCategory): number {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) return 1;
  return category === 'core' ? prefecture.coreMultiplier : prefecture.practicalMultiplier;
}

export function updateScoreValue(scores: Scores, key: SubjectKey, nextValue: number): Scores {
  return {
    ...scores,
    [key]: clamp(roundInt(nextValue), 1, 5)
  };
}

/**
 * 都道府県別計算機（InteractiveCalculator）からトップページ（HomeClient）へ設定を引き継ぐための
 * 軽量なURLエンコード/デコード。2026-08-01 Cowork実地UXテストで「詳細な分析はこちら」のリンクが
 * ただの"/"で県別設定(満点/実技倍率)や入力済みの評定が引き継がれるか不明瞭との指摘を受けて新設
 * （[[fable5-fullaccel-backlog-2026-07]]のΛ+2）。SUBJECTS順のカンマ区切り数値のみを扱う最小
 * フォーマット（share.tsのbase64url JSON方式ほど汎用ではないが、9個の整数を運ぶだけなら十分）。
 * 壊れた入力は例外を投げずnullを返す（外部入力を信用しない設計をshare.tsから踏襲）。
 */
export function encodeScoresQuery(scores: Scores): string {
  return SUBJECTS.map((subject) => String(clamp(roundInt(scores[subject.key]), 1, 10))).join(',');
}

export function decodeScoresQuery(raw: string | null | undefined): Scores | null {
  if (!raw) return null;
  const parts = raw.split(',');
  if (parts.length !== SUBJECTS.length) return null;
  const next = {} as Scores;
  for (let i = 0; i < SUBJECTS.length; i++) {
    const n = Number(parts[i]);
    if (!Number.isFinite(n)) return null;
    next[SUBJECTS[i].key] = clamp(roundInt(n), 1, 10);
  }
  return next;
}

export function buildShareText(params: {
  appName: string;
  rankCode: string;
  title: string;
  total: number;
  max: number;
  percent: number;
  url: string;
}) {
  const percentText = `${toIntPercent(params.percent)}%`;
  return `${params.appName}で内申点チェック！\n${params.rankCode}：${params.title}\n${params.total}/${params.max}（${percentText}）\n${params.url}`;
}
