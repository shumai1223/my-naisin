// 都道府県データの一元化ヘルパー
// すべての表示・注意点はprefectures.tsのデータから自動生成

import { PrefectureConfig, PREFECTURES, getPrefectureByCode } from './prefectures';

export interface PrefecturePitfall {
  title: string;
  items: string[];
}

export interface PrefectureFAQ {
  question: string;
  answer: string;
}

// 対象学年のテキストを生成
export function getTargetGradesText(prefecture: PrefectureConfig): string {
  const grades = prefecture.targetGrades;
  if (grades.length === 1) {
    return `中${grades[0]}のみ`;
  }
  if (grades.length === 3 && grades.includes(1) && grades.includes(2) && grades.includes(3)) {
    return '中1〜中3の3年間';
  }
  return `中${grades.join('・')}`;
}

// 学年倍率のテキストを生成
export function getGradeMultiplierText(prefecture: PrefectureConfig): string {
  const { gradeMultipliers, targetGrades } = prefecture;
  const parts: string[] = [];
  
  for (const grade of targetGrades) {
    const mult = gradeMultipliers[grade];
    if (mult === 1) {
      parts.push(`中${grade}`);
    } else if (mult > 1) {
      parts.push(`中${grade}×${mult}倍`);
    }
  }
  
  return parts.join('、');
}

// 実技倍率のテキストを生成
export function getPracticalMultiplierText(prefecture: PrefectureConfig): string {
  if (prefecture.practicalMultiplier === 1 && prefecture.coreMultiplier === 1) {
    return '全教科等倍';
  }
  
  const parts: string[] = [];
  if (prefecture.coreMultiplier !== 1) {
    parts.push(`5教科×${prefecture.coreMultiplier}倍`);
  }
  if (prefecture.practicalMultiplier !== 1) {
    parts.push(`実技4教科×${prefecture.practicalMultiplier}倍`);
  }
  
  return parts.join('、');
}

// 満点計算（一元化されたロジック）
export function calculatePrefectureMaxScore(prefecture: PrefectureConfig, use10PointScale = false): number {
  const maxGrade = (use10PointScale && prefecture.supports10PointScale) ? 10 : 5;
  
  let total = 0;
  for (const grade of prefecture.targetGrades) {
    const multiplier = prefecture.gradeMultipliers[grade] || 1;
    const coreScore = 5 * maxGrade * prefecture.coreMultiplier * multiplier;
    const practicalScore = 4 * maxGrade * prefecture.practicalMultiplier * multiplier;
    total += coreScore + practicalScore;
  }
  
  return Math.round(total);
}

// 注意点を自動生成
export function generatePitfalls(prefectureCode: string): PrefecturePitfall {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) {
    return {
      title: 'この県の注意点',
      items: [
        '計算方法や配点は高校によって異なる場合があります',
        '最新の情報は各都道府県教育委員会の公式サイトでご確認ください'
      ]
    };
  }

  const items: string[] = [];
  
  // 対象学年
  const gradesText = getTargetGradesText(prefecture);
  items.push(`${gradesText}の成績が対象（${prefecture.maxScore}点満点）`);
  
  // 学年倍率
  const hasGradeMultiplier = prefecture.targetGrades.some(g => prefecture.gradeMultipliers[g] > 1);
  if (hasGradeMultiplier) {
    const ratios = prefecture.targetGrades.map(g => prefecture.gradeMultipliers[g]).join(':');
    items.push(`学年比率は${ratios}で計算`);
  }
  
  // 実技倍率
  if (prefecture.practicalMultiplier > 1) {
    items.push(`実技4教科は${prefecture.practicalMultiplier}倍で計算`);
  }
  if (prefecture.coreMultiplier > 1 && prefecture.coreMultiplier !== prefecture.practicalMultiplier) {
    items.push(`5教科は${prefecture.coreMultiplier}倍で計算`);
  }
  
  // 備考
  if (prefecture.note) {
    items.push(prefecture.note);
  }
  
  // 共通注意点
  items.push('高校や入試方式によって配点が異なる場合があります');
  
  return {
    title: `${prefecture.name}の注意点`,
    items
  };
}

// FAQを自動生成
export function generateFAQ(prefectureCode: string): PrefectureFAQ[] {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) {
    return getDefaultFAQ();
  }

  const faqs: PrefectureFAQ[] = [];
  
  // Q1: 満点
  faqs.push({
    question: `${prefecture.name}の内申点は何点満点ですか？`,
    answer: `${prefecture.name}の内申点は${prefecture.maxScore}点満点です。${prefecture.description}`
  });
  
  // Q2: 対象学年
  const gradesText = getTargetGradesText(prefecture);
  faqs.push({
    question: `${prefecture.name}はいつの成績が内申点になりますか？`,
    answer: `${prefecture.name}は${gradesText}の成績が対象です。${
      prefecture.targetGrades.length === 1 
        ? `中${prefecture.targetGrades[0]}以外の成績は含まれません。`
        : ''
    }`
  });
  
  // Q3: 実技倍率（該当する場合）
  if (prefecture.practicalMultiplier > 1 || prefecture.coreMultiplier > 1) {
    faqs.push({
      question: `${prefecture.name}で教科の倍率はありますか？`,
      answer: getPracticalMultiplierText(prefecture) + 'で計算されます。' +
        (prefecture.practicalMultiplier > 1 
          ? '実技教科の成績を上げると、内申点への影響が大きくなります。'
          : '')
    });
  }
  
  // Q4: 内申点を上げるコツ
  faqs.push({
    question: `${prefecture.name}で内申点を上げるコツは？`,
    answer: generateImprovementAdvice(prefecture)
  });
  
  return faqs;
}

function generateImprovementAdvice(prefecture: PrefectureConfig): string {
  const advice: string[] = [];
  
  if (prefecture.targetGrades.length === 1 && prefecture.targetGrades[0] === 3) {
    advice.push('中3の成績のみが対象なので、中3で集中的に対策することが重要です');
  } else if (prefecture.targetGrades.includes(1)) {
    advice.push('中1から内申点が対象になるため、早い段階からの対策が重要です');
  }
  
  if (prefecture.practicalMultiplier > 1) {
    advice.push(`実技4教科が${prefecture.practicalMultiplier}倍で計算されるため、実技教科の成績アップが効果的です`);
  }
  
  const hasWeightedGrade = prefecture.targetGrades.some(g => prefecture.gradeMultipliers[g] > 1);
  if (hasWeightedGrade) {
    const maxGrade = prefecture.targetGrades.reduce((max, g) => 
      prefecture.gradeMultipliers[g] > prefecture.gradeMultipliers[max] ? g : max
    );
    advice.push(`中${maxGrade}の成績が重視されるため、中${maxGrade}での成績向上が最も効果的です`);
  }
  
  return advice.join('。') + '。';
}

function getDefaultFAQ(): PrefectureFAQ[] {
  return [
    {
      question: 'この県の内申点は何点満点ですか？',
      answer: '都道府県や計算方式によって異なります。上記の「計算方法の概要」をご確認ください。'
    },
    {
      question: '内申点を上げるにはどうすればいいですか？',
      answer: '定期テストで高得点を取る、提出物を期限内に丁寧に仕上げる、授業に積極的に参加する、の3つが基本です。'
    }
  ];
}

// 1点アップの価値を計算（P2用）
export function calculatePointValue(
  prefectureCode: string, 
  isCore: boolean,
  currentGrade: number = 3
): { rawPoints: number; percentageGain: number; advice: string } {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) {
    return { rawPoints: 1, percentageGain: 2.2, advice: '1点上げると約2%の改善になります' };
  }
  
  const multiplier = isCore ? prefecture.coreMultiplier : prefecture.practicalMultiplier;
  const totalGradeMultiplier = prefecture.targetGrades.reduce((sum, g) => 
    sum + (prefecture.gradeMultipliers[g] || 1), 0
  );
  
  const rawPoints = multiplier * (prefecture.gradeMultipliers[currentGrade] || 1);
  const percentageGain = (rawPoints / prefecture.maxScore) * 100;
  
  const advice = isCore
    ? `5教科で1点上げると${rawPoints}点（${percentageGain.toFixed(1)}%）アップ`
    : `実技で1点上げると${rawPoints}点（${percentageGain.toFixed(1)}%）アップ`;
  
  return { rawPoints, percentageGain, advice };
}

// 全47都道府県の満点一覧を取得
export function getAllPrefectureScores(): Array<{
  code: string;
  name: string;
  region: string;
  maxScore: number;
  targetGrades: number[];
  practicalMultiplier: number;
  sourceUrl?: string;
  lastVerified?: string;
}> {
  return PREFECTURES.map(p => ({
    code: p.code,
    name: p.name,
    region: p.region,
    maxScore: p.maxScore,
    targetGrades: p.targetGrades,
    practicalMultiplier: p.practicalMultiplier,
    sourceUrl: p.sourceUrl,
    lastVerified: p.lastVerified
  }));
}

// オール5/オール1の計算（テスト用）
export function calculateAllFiveScore(prefectureCode: string): number {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) return 45;
  
  let total = 0;
  for (const grade of prefecture.targetGrades) {
    const multiplier = prefecture.gradeMultipliers[grade] || 1;
    total += (5 * 5 * prefecture.coreMultiplier + 4 * 5 * prefecture.practicalMultiplier) * multiplier;
  }
  return Math.round(total);
}

export function calculateAllOneScore(prefectureCode: string): number {
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) return 9;
  
  let total = 0;
  for (const grade of prefecture.targetGrades) {
    const multiplier = prefecture.gradeMultipliers[grade] || 1;
    total += (5 * 1 * prefecture.coreMultiplier + 4 * 1 * prefecture.practicalMultiplier) * multiplier;
  }
  return Math.round(total);
}
