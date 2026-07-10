/**
 * /ask（内申点クイックアンサー）の機械列挙Q&A（S-4①・GEO決定論網羅拡張）。
 *
 * answerQuery()（answer-bot.ts）は47都道府県×複数の意図（満点/対象学年/実技/計算式/オール3-5）を
 * 決定論的にカバーしているが、従来 /ask ページに可視・FAQPageSchema化されていたのは
 * 手書きの6件（実質4県分）のみ＝クローラー（Google/AI Overview/ChatGPT検索）から見える面が
 * エンジンの実力に対して大幅に過小だった。
 *
 * ここでは answerQuery() を直接呼び出して47都道府県分の質問・回答ペアを機械生成する
 * （新しい判定基準・データは一切追加しない。既存のnaishin-dataset検証済み値を再利用するのみ＝
 * 捏造ゼロ。interactiveツール（AnswerBotClient）と可視FAQが同じ関数から生成されるため
 * 表示内容がズレる心配もない＝単一ソース化）。
 */
import { PREFECTURES } from '@/lib/prefectures';
import { answerQuery } from '@/lib/answer-bot';

export interface AskFaqItem {
  question: string;
  answer: string;
}

/** 47都道府県 × 「内申点は何点満点ですか？」をanswerQuery()から機械生成する。 */
export function buildPrefectureMaxScoreFaqs(): AskFaqItem[] {
  return PREFECTURES.map((p) => {
    const question = `${p.name}の内申点は何点満点ですか？`;
    const result = answerQuery(question);
    if (!result) {
      throw new Error(`ask-faq-coverage: ${p.name}(${p.code})のmaxScore回答が生成できません`);
    }
    return { question, answer: result.answer };
  });
}
