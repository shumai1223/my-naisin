import { PREFECTURES } from './prefectures';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from './utils';

// 都道府県別の計算例を関数で生成
export const generatePrefectureExamples = (prefectureCode: string) => {
  const prefecture = PREFECTURES.find(p => p.code === prefectureCode);
  if (!prefecture) return null;

  // 全教科3の成績データ
  const all3Scores = {
    japanese: 3,
    social: 3,
    math: 3,
    science: 3,
    english: 3,
    music: 3,
    art: 3,
    pe: 3,
    tech: 3,
    home: 3,
  };

  // 全教科4の成績データ
  const all4Scores = {
    japanese: 4,
    social: 4,
    math: 4,
    science: 4,
    english: 4,
    music: 4,
    art: 4,
    pe: 4,
    tech: 4,
    home: 4,
  };

  const all3Total = calculateTotalScore(all3Scores, prefectureCode);
  const all4Total = calculateTotalScore(all4Scores, prefectureCode);
  const maxScore = calculateMaxScore(prefectureCode);

  return {
    all3: {
      scores: all3Scores,
      total: all3Total,
      max: maxScore,
      percent: calculatePercent(all3Total, maxScore),
      display: `${all3Total}点 / ${maxScore}点満点`
    },
    all4: {
      scores: all4Scores,
      total: all4Total,
      max: maxScore,
      percent: calculatePercent(all4Total, maxScore),
      display: `${all4Total}点 / ${maxScore}点満点`
    }
  };
};

// 詳細な計算過程を生成
export const generateDetailedCalculation = (prefectureCode: string) => {
  const prefecture = PREFECTURES.find(p => p.code === prefectureCode);
  if (!prefecture) return null;

  const examples = generatePrefectureExamples(prefectureCode);
  if (!examples) return null;

  const breakdown = [];
  
  // 学年別の内訳を計算
  for (const grade of prefecture.targetGrades) {
    const multiplier = prefecture.gradeMultipliers[grade];
    const gradeAll3 = {
      core: 5 * 3 * prefecture.coreMultiplier * multiplier,
      practical: 4 * 3 * prefecture.practicalMultiplier * multiplier
    };
    const gradeAll4 = {
      core: 5 * 4 * prefecture.coreMultiplier * multiplier,
      practical: 4 * 4 * prefecture.practicalMultiplier * multiplier
    };
    
    breakdown.push({
      grade,
      multiplier,
      all3: {
        core: gradeAll3.core,
        practical: gradeAll3.practical,
        total: gradeAll3.core + gradeAll3.practical
      },
      all4: {
        core: gradeAll4.core,
        practical: gradeAll4.practical,
        total: gradeAll4.core + gradeAll4.practical
      }
    });
  }

  return {
    prefecture,
    examples,
    breakdown
  };
};
