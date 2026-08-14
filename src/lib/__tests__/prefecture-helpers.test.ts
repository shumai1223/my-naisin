// prefecture-helpers.ts: prefecture-calculation.test.tsがカバーしない
// テキスト生成系・calculatePointValue・getAllPrefectureScoresの不変条件テスト。
// 2026-08-08のavgNaishin>maxScore事故と同型(生成した数値がmaxScoreを超えないか)を
// この層でも機械的に保証する(M-4棚卸し)。

import { PREFECTURES, getPrefectureByCode } from '../prefectures';
import {
  getTargetGradesText,
  getGradeMultiplierText,
  getPracticalMultiplierText,
  generatePitfalls,
  generateFAQ,
  calculatePointValue,
  getAllPrefectureScores,
} from '../prefecture-helpers';

describe('getTargetGradesText', () => {
  test.each(PREFECTURES.map(p => [p.code, p.name]))(
    '%s (%s): 空文字にならない。中1〜3全対象以外は各学年の中N表記を含む',
    (code: string) => {
      const prefecture = getPrefectureByCode(code as string);
      expect(prefecture).toBeDefined();
      if (!prefecture) return;
      const text = getTargetGradesText(prefecture);
      expect(text.length).toBeGreaterThan(0);
      const grades = prefecture.targetGrades;
      const isAllThreeYears = grades.length === 3 && [1, 2, 3].every(g => grades.includes(g));
      if (isAllThreeYears) {
        expect(text).toBe('中1〜中3の3年間');
      } else if (grades.length === 1) {
        expect(text).toBe(`中${grades[0]}のみ`);
      } else {
        expect(text).toBe(`中${grades.join('・')}`);
      }
    }
  );

  test('中1〜中3全て対象の場合は3年間表記に集約される', () => {
    const prefecture = getPrefectureByCode('hokkaido');
    expect(prefecture).toBeDefined();
    if (!prefecture) return;
    expect(prefecture.targetGrades).toEqual([1, 2, 3]);
    expect(getTargetGradesText(prefecture)).toBe('中1〜中3の3年間');
  });

  test('単一学年のみ対象なら「のみ」表記になる', () => {
    const prefecture = getPrefectureByCode('fukuoka');
    expect(prefecture).toBeDefined();
    if (!prefecture) return;
    expect(prefecture.targetGrades).toEqual([3]);
    expect(getTargetGradesText(prefecture)).toBe('中3のみ');
  });
});

describe('getGradeMultiplierText', () => {
  test.each(PREFECTURES.map(p => [p.code, p.name]))(
    '%s (%s): 対象学年ごとに区切られ、倍率>1の学年は「×N倍」を含む',
    (code: string) => {
      const prefecture = getPrefectureByCode(code as string);
      expect(prefecture).toBeDefined();
      if (!prefecture) return;
      const text = getGradeMultiplierText(prefecture);
      for (const grade of prefecture.targetGrades) {
        const mult = prefecture.gradeMultipliers[grade];
        if (mult > 1) {
          expect(text).toContain(`中${grade}×${mult}倍`);
        }
      }
    }
  );
});

describe('getPracticalMultiplierText', () => {
  test.each(PREFECTURES.map(p => [p.code, p.name]))(
    '%s (%s): 空文字にならない',
    (code: string) => {
      const prefecture = getPrefectureByCode(code as string);
      expect(prefecture).toBeDefined();
      if (!prefecture) return;
      expect(getPracticalMultiplierText(prefecture).length).toBeGreaterThan(0);
    }
  );

  test('coreMultiplier=practicalMultiplier=1の県は「全教科等倍」', () => {
    const prefecture = getPrefectureByCode('tokyo');
    expect(prefecture).toBeDefined();
    if (!prefecture) return;
    if (prefecture.coreMultiplier === 1 && prefecture.practicalMultiplier === 1) {
      expect(getPracticalMultiplierText(prefecture)).toBe('全教科等倍');
    }
  });

  test('実技倍率が5教科倍率と異なる県(兵庫)は両方の倍率を個別に表記する', () => {
    const prefecture = getPrefectureByCode('hyogo');
    expect(prefecture).toBeDefined();
    if (!prefecture) return;
    const text = getPracticalMultiplierText(prefecture);
    expect(text).toContain(`5教科×${prefecture.coreMultiplier}倍`);
    expect(text).toContain(`実技4教科×${prefecture.practicalMultiplier}倍`);
  });
});

describe('generatePitfalls', () => {
  test.each(PREFECTURES.map(p => [p.code, p.name, p.maxScore]))(
    '%s (%s): タイトルに県名、itemsに満点%d点の記載を含む',
    (code: string, name: string, maxScore: number) => {
      const result = generatePitfalls(code as string);
      expect(result.title).toBe(`${name}の注意点`);
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.some(item => item.includes(`${maxScore}点満点`))).toBe(true);
    }
  );

  test('未知の県コードはフォールバックの汎用注意点を返す', () => {
    const result = generatePitfalls('not-a-real-prefecture');
    expect(result.title).toBe('この県の注意点');
    expect(result.items.length).toBeGreaterThan(0);
  });
});

describe('generateFAQ', () => {
  test.each(PREFECTURES.map(p => [p.code, p.name, p.maxScore]))(
    '%s (%s): 最低2問(満点・対象学年)を含み、Q1の回答に満点%d点満点の記載がある',
    (code: string, name: string, maxScore: number) => {
      const faqs = generateFAQ(code as string);
      expect(faqs.length).toBeGreaterThanOrEqual(2);
      expect(faqs[0].question).toBe(`${name}の内申点は何点満点ですか？`);
      expect(faqs[0].answer).toContain(`${maxScore}点満点`);
      // 質問文が重複しない
      const questions = faqs.map(f => f.question);
      expect(new Set(questions).size).toBe(questions.length);
    }
  );

  test('未知の県コードは空配列を返す', () => {
    expect(generateFAQ('not-a-real-prefecture')).toEqual([]);
  });

  test('教科倍率がある県(兵庫)は倍率に関するFAQを含む', () => {
    const prefecture = getPrefectureByCode('hyogo');
    expect(prefecture).toBeDefined();
    if (!prefecture) return;
    expect(prefecture.coreMultiplier > 1 || prefecture.practicalMultiplier > 1).toBe(true);
    const faqs = generateFAQ('hyogo');
    expect(faqs.some(f => f.question.includes('倍率'))).toBe(true);
  });
});

describe('calculatePointValue', () => {
  test.each(PREFECTURES.map(p => [p.code, p.name, p.maxScore]))(
    '%s (%s): rawPointsは正、percentageGainは0より大きく100以下(満点%d点に対する比率)',
    (code: string, name: string, maxScore: number) => {
      for (const isCore of [true, false]) {
        const result = calculatePointValue(code as string, isCore);
        expect(result.rawPoints).toBeGreaterThan(0);
        expect(result.percentageGain).toBeGreaterThan(0);
        expect(result.percentageGain).toBeLessThanOrEqual(100);
        expect(result.advice.length).toBeGreaterThan(0);
        // percentageGainはrawPoints/maxScoreの%表記と一致する(表示と計算式のズレを検知)
        expect(result.percentageGain).toBeCloseTo((result.rawPoints / maxScore) * 100, 5);
      }
    }
  );

  test('未知の県コードはデフォルト値(1点・約2%)を返す', () => {
    const result = calculatePointValue('not-a-real-prefecture', true);
    expect(result.rawPoints).toBe(1);
    expect(result.percentageGain).toBeCloseTo(2.2, 5);
  });

  test('isCore=trueとfalseで案内文が5教科/実技の別を正しく示す', () => {
    const core = calculatePointValue('tokyo', true);
    const practical = calculatePointValue('tokyo', false);
    expect(core.advice).toContain('5教科で1点上げると');
    expect(practical.advice).toContain('実技で1点上げると');
  });
});

describe('getAllPrefectureScores', () => {
  test('47都道府県すべてを、PREFECTURESと一致する値で返す', () => {
    const scores = getAllPrefectureScores();
    expect(scores.length).toBe(47);
    for (const p of PREFECTURES) {
      const entry = scores.find(s => s.code === p.code);
      expect(entry).toBeDefined();
      if (!entry) continue;
      expect(entry.name).toBe(p.name);
      expect(entry.maxScore).toBe(p.maxScore);
      expect(entry.targetGrades).toEqual(p.targetGrades);
      expect(entry.practicalMultiplier).toBe(p.practicalMultiplier);
      expect(entry.sourceUrl).toBe(p.sourceUrl);
      expect(entry.lastVerified).toBe(p.lastVerified);
    }
  });

  test('コードの重複がない', () => {
    const scores = getAllPrefectureScores();
    const codes = scores.map(s => s.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
