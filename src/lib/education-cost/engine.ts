// 教育費の純粋関数（サーバー安全・捏造ゼロ）。データは data.ts の一次ソースのみを使う。

import {
  HIGH_SCHOOL_INITIAL_COST,
  JUKU_GRADE_FACTOR,
  JUKU_RATES,
  LEARNING_COST_ANNUAL,
  SHUGAKU_SHIEN_TIERS,
} from './data';
import type {
  CourseType,
  EducationCostInput,
  EducationCostResult,
  IncomeBracket,
  JukuType,
  SchoolStage,
} from './types';

/** 円の整形（¥1,234,567）。負値は0に丸める。 */
export function formatYen(n: number): string {
  return '¥' + Math.max(0, Math.round(n)).toLocaleString('ja-JP');
}

/** 万円表記（約123万円）。概数の見出し用。 */
export function toManYen(n: number): string {
  const man = Math.round(Math.max(0, n) / 10000);
  return `約${man.toLocaleString('ja-JP')}万円`;
}

/** 1段階×課程の年間学習費総額（円）。 */
export function annualLearningCost(stage: SchoolStage, course: CourseType): number {
  return LEARNING_COST_ANNUAL[stage][course];
}

/** 高校3年間の学習費総額＋入学準備費（円）。 */
export function highSchoolTotal(course: CourseType): number {
  return annualLearningCost('koukou', course) * 3 + HIGH_SCHOOL_INITIAL_COST[course];
}

/** 中学の残り在学費用（現在の学年から中3まで）。中1=3年・中2=2年・中3=1年。 */
export function juniorRemainingCost(currentGrade: 1 | 2 | 3, course: CourseType): number {
  const years = 4 - currentGrade; // 1->3, 2->2, 3->1
  return annualLearningCost('chuugakkou', course) * years;
}

/**
 * 塾代（現在の学年から中3まで）の概算。
 * 学年が上がるほど月謝が上がる係数（JUKU_GRADE_FACTOR）を各学年に適用して合算する。
 */
export function jukuCost(currentGrade: 1 | 2 | 3, jukuType: JukuType): number {
  if (jukuType === 'none') return 0;
  const rate = JUKU_RATES[jukuType];
  let total = 0;
  for (let g = currentGrade; g <= 3; g++) {
    const factor = JUKU_GRADE_FACTOR[g as 1 | 2 | 3];
    total += rate.monthly * factor * 12 + rate.seasonal;
  }
  return Math.round(total);
}

/**
 * 教育費総額シミュレーション（現在の中学の学年〜高校卒業まで）。
 * = 中学の残り在学費用 ＋ 高校3年間の学習費総額（＋準備費） ＋ 通塾費（中3まで）。
 */
export function simulateEducationCost(input: EducationCostInput): EducationCostResult {
  const { currentGrade, juniorCourse, highCourse, jukuType } = input;
  const juniorRemainingYears = 4 - currentGrade;
  const juniorRemaining = juniorRemainingCost(currentGrade, juniorCourse);
  const highSchool = highSchoolTotal(highCourse);
  const juku = jukuCost(currentGrade, jukuType);
  return {
    juniorRemaining,
    highSchool,
    highSchoolBeforeSupport: highSchool,
    juku,
    total: juniorRemaining + highSchool + juku,
    juniorRemainingYears,
  };
}

/** 就学支援金の区分別・年額支援の目安（円）。 */
export function shugakuShienAnnual(course: CourseType, bracket: IncomeBracket): number {
  const tier = SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === bracket);
  if (!tier) return 0;
  return course === 'private' ? tier.privateAnnual : tier.publicAnnual;
}

/** 就学支援金を加味した高校3年間の授業料負担の軽減目安（円）。学習費総額のうち授業料相当分の控除。 */
export function highSchoolSupportOver3Years(course: CourseType, bracket: IncomeBracket): number {
  return shugakuShienAnnual(course, bracket) * 3;
}

/**
 * 就学支援金を差し引いた高校3年間の「実質負担」の目安（円）。
 * ＝ 学習費総額（3年）−就学支援金（3年）。支援は授業料部分が対象のため目安。0未満は0に丸める。
 * 「私立は無償化後いくらか」「公立とどちらが安いか」を支援後の手出しで比べるための差別化指標。
 */
export function highSchoolRealCost(course: CourseType, bracket: IncomeBracket): number {
  return Math.max(0, highSchoolTotal(course) - highSchoolSupportOver3Years(course, bracket));
}
