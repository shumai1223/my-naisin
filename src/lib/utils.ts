import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { RANK_DEFINITIONS, SUBJECTS } from './constants';
import { getPrefectureByCode } from './prefectures';
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

export function calculateTotalScore(scores: Scores, prefectureCode: string, use10PointScale?: boolean): number {
  const prefecture = getPrefectureByCode(prefectureCode);
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
  
  // 5教科
  for (const key of coreSubjects) {
    const raw = scores[key];
    const safe = clamp(roundInt(raw), 1, maxGrade);
    total += safe * prefecture.coreMultiplier;
  }
  
  // 実技4教科
  for (const key of practicalSubjects) {
    const raw = scores[key];
    const safe = clamp(roundInt(raw), 1, maxGrade);
    total += safe * prefecture.practicalMultiplier;
  }
  
  return Math.round(total);
}

export function calculateMaxScore(prefectureCode: string, use10PointScale?: boolean): number {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) {
    return 45; // デフォルト
  }
  
  const maxGrade = (use10PointScale && prefecture.supports10PointScale) ? 10 : 5;
  
  // 満点を動的に計算: 5教科 × maxGrade × coreMultiplier + 4教科 × maxGrade × practicalMultiplier
  const coreMax = 5 * maxGrade * prefecture.coreMultiplier;
  const practicalMax = 4 * maxGrade * prefecture.practicalMultiplier;
  
  return Math.round(coreMax + practicalMax);
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
