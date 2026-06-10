/**
 * 堀B（AIネイティブ層）の新ツール：compare_prefectures / reverse_calc / target_to_required_grades。
 * いずれも既存の検証済み計算（calculateTotalScore/MaxScore）に厳密整合することを保証する。
 */

import {
  comparePrefectures,
  reverseCalcRequiredAverage,
  targetToRequiredGrades,
} from '../naishin-dataset';
import { calculateMaxScore } from '../utils';

describe('comparePrefectures', () => {
  test('オール4の東京は内申52（満点65 × 4/5）', () => {
    const res = comparePrefectures({ codes: ['tokyo'], grade: 4 });
    expect(res.grade).toBe(4);
    expect(res.results).toHaveLength(1);
    const tokyo = res.results[0] as { total: number; max: number };
    expect(tokyo.total).toBe(52);
    expect(tokyo.max).toBe(65);
  });

  test('複数県を一括比較し、満点設計の違いが出る', () => {
    const res = comparePrefectures({ codes: ['tokyo', 'osaka', 'hyogo'] });
    expect(res.count).toBe(3);
    // 既定はオール4
    expect(res.grade).toBe(4);
  });

  test('不正な県コードは not_found を返す（落ちない）', () => {
    const res = comparePrefectures({ codes: ['atlantis'] });
    expect(res.results[0]).toHaveProperty('error', 'not_found');
  });

  test('gradeは1〜5にクランプされる', () => {
    const res = comparePrefectures({ codes: ['tokyo'], grade: 99 });
    expect(res.grade).toBe(5);
  });
});

describe('reverseCalcRequiredAverage', () => {
  test('東京で内申52を狙うなら必要評定平均は4.0', () => {
    const res = reverseCalcRequiredAverage({ prefectureCode: 'tokyo', targetNaishin: 52 });
    expect(res).not.toBeNull();
    expect(res!.requiredAverageGrade).toBe(4);
    expect(res!.requiredUniformGrade).toBe(4);
    expect(res!.achievable).toBe(true);
  });

  test('満点ちょうどはオール5（評定平均5.0）', () => {
    const max = calculateMaxScore('tokyo');
    const res = reverseCalcRequiredAverage({ prefectureCode: 'tokyo', targetNaishin: max });
    expect(res!.requiredAverageGrade).toBe(5);
  });

  test('満点超過はクランプされ achievable は true のまま', () => {
    const max = calculateMaxScore('tokyo');
    const res = reverseCalcRequiredAverage({ prefectureCode: 'tokyo', targetNaishin: max + 100 });
    expect(res!.targetNaishin).toBe(max);
    expect(res!.requiredAverageGrade).toBeLessThanOrEqual(5);
  });

  test('不正な県コードは null', () => {
    expect(reverseCalcRequiredAverage({ prefectureCode: 'nowhere', targetNaishin: 10 })).toBeNull();
  });
});

describe('targetToRequiredGrades', () => {
  test('兵庫は実技倍率が高く、実技を上げる方が効率的', () => {
    const res = targetToRequiredGrades({ prefectureCode: 'hyogo', targetNaishin: 200 });
    expect(res).not.toBeNull();
    expect(res!.perGradeGain.practical).toBeGreaterThan(res!.perGradeGain.core);
    expect(res!.note).toContain('実技');
  });

  test('現在の評定を渡すと不足ぶんと優先教科（増分降順）を提案する', () => {
    const current = {
      japanese: 3, math: 3, english: 3, science: 3, social: 3,
      music: 3, art: 3, pe: 3, tech: 3,
    };
    const res = targetToRequiredGrades({ prefectureCode: 'hyogo', targetNaishin: 230, currentScores: current });
    expect(res!.gap).toBeGreaterThan(0);
    expect(res!.raiseSuggestions!.length).toBeGreaterThan(0);
    // 兵庫では実技の増分が大きいので先頭は実技
    expect(res!.raiseSuggestions![0].category).toBe('practical');
    // 増分は降順
    const gains = res!.raiseSuggestions!.map((s) => s.naishinGain);
    for (let i = 1; i < gains.length; i++) {
      expect(gains[i - 1]).toBeGreaterThanOrEqual(gains[i]);
    }
  });

  test('既に目標到達ならgapは0', () => {
    const allFive = {
      japanese: 5, math: 5, english: 5, science: 5, social: 5,
      music: 5, art: 5, pe: 5, tech: 5,
    };
    const res = targetToRequiredGrades({ prefectureCode: 'tokyo', targetNaishin: 50, currentScores: allFive });
    expect(res!.gap).toBe(0);
  });
});
