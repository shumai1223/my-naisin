import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { MODE_CONFIG, RANK_DEFINITIONS, SUBJECTS } from './constants';
import { getPrefectureByCode, type PrefectureConfig } from './prefectures';
import type { RankDefinition, ScoreMode, Scores, SubjectCategory, SubjectKey } from './types';

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

export function calculateTotalScore(scores: Scores, mode: ScoreMode, prefectureCode?: string, use10PointScale?: boolean) {
  if (mode === 'prefecture' && prefectureCode) {
    return calculatePrefectureScore(scores, prefectureCode, use10PointScale);
  }
  const weights = MODE_CONFIG[mode].weights;
  return SUBJECTS.reduce((sum, subject) => {
    const raw = scores[subject.key];
    const safe = clamp(roundInt(raw), 1, 5);
    const weight = subject.category === 'core' ? weights.core : weights.practical;
    return sum + safe * weight;
  }, 0);
}

export function calculatePrefectureScore(scores: Scores, prefectureCode: string, use10PointScale?: boolean): number {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) return 0;

  const coreSubjects: SubjectKey[] = ['japanese', 'math', 'english', 'science', 'social'];
  const practicalSubjects: SubjectKey[] = ['music', 'art', 'pe', 'tech'];
  
  let total = 0;
  const maxGrade = use10PointScale ? 10 : 5;
  
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

export function calculateMaxScore(mode: ScoreMode, prefectureCode?: string, use10PointScale?: boolean) {
  if (mode === 'prefecture' && prefectureCode) {
    const prefecture = getPrefectureByCode(prefectureCode);
    if (prefecture) {
      // 10段階評価の場合は満点を2倍に
      if (use10PointScale && prefecture.supports10PointScale) {
        return prefecture.maxScore * 2;
      }
      return prefecture.maxScore;
    }
  }
  return MODE_CONFIG[mode].max;
}

export function calculatePercent(total: number, max: number) {
  if (max <= 0) return 0;
  return toIntPercent((total / max) * 100);
}

export function getRankForPercent(percent: number): RankDefinition {
  const p = clamp(percent, 0, 100);
  return RANK_DEFINITIONS_DESC.find((r) => p >= r.minPercent) ?? RANK_DEFINITIONS_DESC[RANK_DEFINITIONS_DESC.length - 1];
}

export function getSubjectWeight(mode: ScoreMode, category: SubjectCategory) {
  const weights = MODE_CONFIG[mode].weights;
  return category === 'core' ? weights.core : weights.practical;
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
