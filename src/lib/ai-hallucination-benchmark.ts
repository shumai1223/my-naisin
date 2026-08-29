/**
 * T-N2-2: 「AIは日本の高校入試の内申点制度を間違える」を実測で証明するための正解セット。
 *
 * 47都道府県 × 4カテゴリ（満点・対象学年と学年倍率・実技傾斜・評定の段階）の設問と正解を
 * prefectures.ts（既存の一次ソースで裏取り済みのデータ）から機械的に生成する。新規のデータ
 * 収集は不要（既存の`sourceUrl`をそのまま出典として使う）。
 *
 * ⚠️ このファイルは「正解セット」と「簡易採点ロジック」のみを扱う。実際にAIへ質問を送って
 * 誤答率を測る処理（APIキーが必要）は`scripts/run-ai-hallucination-benchmark.ts`が担う。
 * ⚠️ 特定のAI製品を名指しで批判しない。集計は「AIモデル一般」として行う（N2-2本文の指示）。
 */
import { PREFECTURES, type PrefectureConfig } from './prefectures';

export type BenchmarkCategory = 'maxScore' | 'targetGrades' | 'practicalWeighting' | 'scale';

export interface BenchmarkQuestion {
  id: string;
  prefectureCode: string;
  prefectureName: string;
  category: BenchmarkCategory;
  question: string;
  correctAnswer: string;
  /** 採点時に照合する数値（複数可。全て出現していれば正解とみなす簡易採点）。 */
  expectedNumbers: number[];
  sourceUrl: string;
}

function gradeMultiplierText(config: PrefectureConfig): string {
  return config.targetGrades
    .map((g) => `中${g}×${config.gradeMultipliers[g] ?? '?'}倍`)
    .join('・');
}

/** prefectures.tsから47県×4カテゴリの設問セットを機械的に生成する（新規収集不要）。 */
export function buildBenchmarkQuestions(): BenchmarkQuestion[] {
  const questions: BenchmarkQuestion[] = [];

  for (const config of PREFECTURES) {
    const sourceUrl = config.sourceUrl ?? '';

    questions.push({
      id: `${config.code}-maxScore`,
      prefectureCode: config.code,
      prefectureName: config.name,
      category: 'maxScore',
      question: `${config.name}の公立高校入試における内申点（調査書点）の満点は何点ですか。`,
      correctAnswer: `${config.maxScore}点`,
      expectedNumbers: [config.maxScore],
      sourceUrl,
    });

    questions.push({
      id: `${config.code}-targetGrades`,
      prefectureCode: config.code,
      prefectureName: config.name,
      category: 'targetGrades',
      question: `${config.name}の内申点計算で対象となる学年と、学年ごとの倍率を答えてください。`,
      correctAnswer: gradeMultiplierText(config),
      expectedNumbers: config.targetGrades.map((g) => config.gradeMultipliers[g]),
      sourceUrl,
    });

    questions.push({
      id: `${config.code}-practicalWeighting`,
      prefectureCode: config.code,
      prefectureName: config.name,
      category: 'practicalWeighting',
      question: `${config.name}の内申点計算で、5教科（国数英理社）と実技4教科（音美保技）の倍率はそれぞれ何倍ですか。`,
      correctAnswer: `5教科×${config.coreMultiplier}倍・実技4教科×${config.practicalMultiplier}倍`,
      expectedNumbers: [config.coreMultiplier, config.practicalMultiplier],
      sourceUrl,
    });

    questions.push({
      id: `${config.code}-scale`,
      prefectureCode: config.code,
      prefectureName: config.name,
      category: 'scale',
      question: `${config.name}の内申点計算に使われる評定は5段階評価ですか、10段階評価ですか。`,
      correctAnswer: config.supports10PointScale ? '10段階評価' : '5段階評価',
      expectedNumbers: [config.supports10PointScale ? 10 : 5],
      sourceUrl,
    });
  }

  return questions;
}

/** 全角数字を半角に正規化する（AIの回答が全角数字で返ることがあるため）。 */
function normalizeDigits(text: string): string {
  return text.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

/**
 * 簡易採点: 期待される数値がすべてAIの回答テキスト中に出現していれば正解とみなす。
 * ⚠️ 完全な自然言語理解ではなく数値一致に基づく近似判定である（例えば桁が同じ別の数値と
 * 取り違える誤判定の可能性はゼロではない）。この限界を隠さず明記する。
 */
export function isAnswerCorrect(question: BenchmarkQuestion, aiAnswerText: string): boolean {
  const normalized = normalizeDigits(aiAnswerText);
  return question.expectedNumbers.every((n) => normalized.includes(String(n)));
}

export interface BenchmarkGradeSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  byCategory: Record<BenchmarkCategory, { total: number; correct: number }>;
}

/**
 * 質問と回答のペア配列から集計する。呼び出し側は複数のAIモデルの回答を混ぜて渡してもよい
 * （N2-2の方針どおり「AIモデル一般」として集計し、特定製品名は結果に含めない）。
 */
export function summarizeGrading(
  pairs: { question: BenchmarkQuestion; aiAnswerText: string }[]
): BenchmarkGradeSummary {
  const byCategory: Record<BenchmarkCategory, { total: number; correct: number }> = {
    maxScore: { total: 0, correct: 0 },
    targetGrades: { total: 0, correct: 0 },
    practicalWeighting: { total: 0, correct: 0 },
    scale: { total: 0, correct: 0 },
  };

  let correctCount = 0;
  for (const { question, aiAnswerText } of pairs) {
    const correct = isAnswerCorrect(question, aiAnswerText);
    byCategory[question.category].total += 1;
    if (correct) {
      byCategory[question.category].correct += 1;
      correctCount += 1;
    }
  }

  const totalQuestions = pairs.length;
  return {
    totalQuestions,
    correctCount,
    incorrectCount: totalQuestions - correctCount,
    accuracyRate: totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 1000) / 1000,
    byCategory,
  };
}
