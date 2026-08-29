import {
  buildBenchmarkQuestions,
  isAnswerCorrect,
  summarizeGrading,
  type BenchmarkQuestion,
} from '../ai-hallucination-benchmark';
import { PREFECTURES } from '../prefectures';

describe('buildBenchmarkQuestions（T-N2-2 正解セット）', () => {
  const questions = buildBenchmarkQuestions();

  test('47県×4カテゴリ=188問が生成される', () => {
    expect(questions.length).toBe(PREFECTURES.length * 4);
  });

  test('全問に出典URL(sourceUrl)が付いている(新規収集不要・既存一次ソースのみを使う方針)', () => {
    for (const q of questions) {
      expect(q.sourceUrl).toBeTruthy();
    }
  });

  test('idに重複がない', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('maxScoreカテゴリの正解はprefectures.tsのmaxScoreと完全一致する(捏造防止の不変条件)', () => {
    for (const pref of PREFECTURES) {
      const q = questions.find((x) => x.id === `${pref.code}-maxScore`);
      expect(q).toBeDefined();
      expect(q!.expectedNumbers).toEqual([pref.maxScore]);
      expect(q!.correctAnswer).toBe(`${pref.maxScore}点`);
    }
  });

  test('practicalWeightingカテゴリの正解はcoreMultiplier/practicalMultiplierと完全一致する', () => {
    for (const pref of PREFECTURES) {
      const q = questions.find((x) => x.id === `${pref.code}-practicalWeighting`);
      expect(q!.expectedNumbers).toEqual([pref.coreMultiplier, pref.practicalMultiplier]);
    }
  });
});

describe('isAnswerCorrect（簡易採点ロジック）', () => {
  const sample: BenchmarkQuestion = {
    id: 'test-maxScore',
    prefectureCode: 'test',
    prefectureName: 'テスト県',
    category: 'maxScore',
    question: 'テスト県の満点は？',
    correctAnswer: '135点',
    expectedNumbers: [135],
    sourceUrl: 'https://example.jp',
  };

  test('正しい数値を含む回答は正解と判定される', () => {
    expect(isAnswerCorrect(sample, '135点満点です')).toBe(true);
    expect(isAnswerCorrect(sample, '内申点は135点です。')).toBe(true);
  });

  test('全角数字でも正解と判定される(AIが全角で返すことがあるため)', () => {
    expect(isAnswerCorrect(sample, '１３５点です')).toBe(true);
  });

  test('異なる数値を含む回答は不正解と判定される', () => {
    expect(isAnswerCorrect(sample, '150点です')).toBe(false);
  });

  test('数値を含まない回答は不正解と判定される', () => {
    expect(isAnswerCorrect(sample, 'わかりません')).toBe(false);
  });

  test('複数の期待数値のうち一部しか含まない回答は不正解(全て揃って初めて正解)', () => {
    const multi: BenchmarkQuestion = { ...sample, expectedNumbers: [5, 20] };
    expect(isAnswerCorrect(multi, '5倍です')).toBe(false);
    expect(isAnswerCorrect(multi, '5倍と20倍です')).toBe(true);
  });
});

describe('summarizeGrading', () => {
  const q1: BenchmarkQuestion = {
    id: 'a',
    prefectureCode: 'a',
    prefectureName: 'A',
    category: 'maxScore',
    question: 'q1',
    correctAnswer: '100点',
    expectedNumbers: [100],
    sourceUrl: 'https://example.jp',
  };
  const q2: BenchmarkQuestion = {
    id: 'b',
    prefectureCode: 'b',
    prefectureName: 'B',
    category: 'scale',
    question: 'q2',
    correctAnswer: '5段階評価',
    expectedNumbers: [5],
    sourceUrl: 'https://example.jp',
  };

  test('正答率・カテゴリ別集計が正しく計算される', () => {
    const summary = summarizeGrading([
      { question: q1, aiAnswerText: '100点です' },
      { question: q2, aiAnswerText: '10段階です' }, // 誤答
    ]);
    expect(summary.totalQuestions).toBe(2);
    expect(summary.correctCount).toBe(1);
    expect(summary.incorrectCount).toBe(1);
    expect(summary.accuracyRate).toBe(0.5);
    expect(summary.byCategory.maxScore).toEqual({ total: 1, correct: 1 });
    expect(summary.byCategory.scale).toEqual({ total: 1, correct: 0 });
  });

  test('空配列を渡すとaccuracyRate=0で例外にならない', () => {
    const summary = summarizeGrading([]);
    expect(summary.totalQuestions).toBe(0);
    expect(summary.accuracyRate).toBe(0);
  });
});
