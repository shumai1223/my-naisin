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

/**
 * 47都道府県 × 「内申点の対象学年はいつですか？」をanswerQuery()から機械生成する（S-4④・軸拡張1本目）。
 * answer-bot.tsのdetectIntent()が「対象学年」を含む質問文を targetGrades 意図として検出する
 * （prefectureAnswer()に既存のロジックをそのまま再利用・新規判定基準はゼロ）。
 */
export function buildPrefectureTargetGradesFaqs(): AskFaqItem[] {
  return PREFECTURES.map((p) => {
    const question = `${p.name}の内申点の対象学年はいつですか？`;
    const result = answerQuery(question);
    if (!result) {
      throw new Error(`ask-faq-coverage: ${p.name}(${p.code})のtargetGrades回答が生成できません`);
    }
    return { question, answer: result.answer };
  });
}

/**
 * 47都道府県 × 「実技教科の倍率はいくつですか？」をanswerQuery()から機械生成する（S-4④・軸拡張2本目）。
 * detectIntent()の「実技|副教科|倍率|傾斜」正規表現にヒットする質問文で practical 意図を検出する
 * （prefectureAnswer()に既存のロジックをそのまま再利用・新規判定基準はゼロ）。
 */
export function buildPrefecturePracticalFaqs(): AskFaqItem[] {
  return PREFECTURES.map((p) => {
    const question = `${p.name}は実技教科の倍率はいくつですか？`;
    const result = answerQuery(question);
    if (!result) {
      throw new Error(`ask-faq-coverage: ${p.name}(${p.code})のpractical回答が生成できません`);
    }
    return { question, answer: result.answer };
  });
}

/**
 * 47都道府県 × 「内申点はどうやって計算しますか？」をanswerQuery()から機械生成する（S-4④・軸拡張3本目）。
 * detectIntent()の「計算|方法|出し方|どうやって|式」正規表現にヒットする質問文で formula 意図を検出する
 * （prefectureAnswer()に既存のロジックをそのまま再利用・新規判定基準はゼロ）。
 */
export function buildPrefectureFormulaFaqs(): AskFaqItem[] {
  return PREFECTURES.map((p) => {
    const question = `${p.name}の内申点はどうやって計算しますか？`;
    const result = answerQuery(question);
    if (!result) {
      throw new Error(`ask-faq-coverage: ${p.name}(${p.code})のformula回答が生成できません`);
    }
    return { question, answer: result.answer };
  });
}

/**
 * 47都道府県 × 「オール3・4・5だと内申点は何点ですか？」をanswerQuery()から機械生成する（S-4④・軸拡張4本目=最終軸）。
 * detectIntent()の`/オール([3-5])/`正規表現は最初にマッチした数字（3）だけで{all:3}意図を検出するため、
 * result.answerの一文はオール3のみを述べる。ただしprefectureAnswer()の{all}分岐が返すdetailsには
 * 常にオール3/4/5全ての例が含まれる（answer-bot.ts:114 `detail.examples.map(...)`）ため、
 * 質問文どおり「それぞれ」を網羅する回答にするためanswerとdetailsを連結する（新規判定基準・計算は追加せず、
 * 既存エンジンが返した値をそのまま連結するのみ＝捏造ゼロ）。
 */
export function buildPrefectureAllGradesFaqs(): AskFaqItem[] {
  return PREFECTURES.map((p) => {
    const question = `${p.name}でオール3・4・5だと内申点はそれぞれ何点ですか？`;
    const result = answerQuery(question);
    if (!result) {
      throw new Error(`ask-faq-coverage: ${p.name}(${p.code})のallGrades回答が生成できません`);
    }
    const details = result.details ?? [];
    const answer = details.length > 0 ? `${result.answer} ${details.join('、')}。` : result.answer;
    return { question, answer };
  });
}

/**
 * 都道府県に紐づかない一般Q&A（GENERAL_FACTS・answer-bot.ts）を機械生成する（S-4②）。
 * 各質問文は対応するGENERAL_FACTSの正規表現に一致するよう選定し、expectedTitleで
 * 実際にヒットしたfactが意図どおりか検証する（正規表現は先勝ち判定のため、文言次第では
 * 別のfactに誤ヒットしうる。ここでassertすることで誤配線をビルド/テスト時に検知する）。
 */
const GENERAL_FACT_QUESTIONS: { question: string; expectedTitle: string }[] = [
  { question: '換算内申とは何ですか？', expectedTitle: '換算内申とは' },
  { question: '不登校でも高校受験はできますか？', expectedTitle: '不登校でも高校受験はできる？' },
  { question: '推薦入試に調査書は必要ですか？', expectedTitle: '推薦入試に調査書は必要？種類の違いは？' },
  { question: '実技4教科で内申点を上げられますか？', expectedTitle: '実技4教科で内申点を上げられる？' },
  { question: '推薦に必要な評定平均はどのくらいですか？', expectedTitle: '推薦に必要な評定平均' },
  { question: '評定平均とは何ですか？', expectedTitle: '評定平均とは' },
  { question: '素内申とは何ですか？', expectedTitle: '素内申とは' },
  { question: '調査書はいつ誰に発行してもらいますか？', expectedTitle: '調査書の発行は誰に・いつ頼む？' },
  { question: '調査書とは何ですか？', expectedTitle: '調査書（調査書点）とは' },
  { question: '内申点はいつから対象になりますか？', expectedTitle: '内申点の対象学年' },
  { question: '偏差値とは何ですか？', expectedTitle: '偏差値とは' },
  { question: 'オール3で行ける高校はどこですか？', expectedTitle: 'オール3で行ける高校' },
  { question: 'オール4で行ける高校はどこですか？', expectedTitle: 'オール4で行ける高校' },
  { question: 'オール5で行ける高校はどこですか？', expectedTitle: 'オール5で行ける高校' },
  { question: '内申点とは何ですか？', expectedTitle: '内申点とは' },
  { question: '三者面談ではどんな準備をすればいいですか？', expectedTitle: '三者面談の準備' },
  { question: '当日点や総合得点とは何ですか？', expectedTitle: '当日点・総合得点とは' },
  { question: '高校受験の受験料や模試代はいくらですか？', expectedTitle: '高校受験の受験料・模試代' },
  { question: '就学支援金は年収いくらまでもらえますか？', expectedTitle: '就学支援金は年収いくらまで？' },
  { question: '高校無償化とはどんな制度ですか？', expectedTitle: '高校無償化・教育費の支援' },
  { question: '中学生の塾代の相場はどれくらいですか？', expectedTitle: '中学生の塾代の相場' },
  { question: '高校3年間の学費はどれくらいかかりますか？', expectedTitle: '高校の費用の目安' },
  { question: '高校入試の志願倍率とはどう計算しますか？', expectedTitle: '高校入試の倍率とは' },
  { question: '内申点が足りないときはどうすればいいですか？', expectedTitle: '内申点・当日点が足りないときの対策' },
];

export function buildGeneralFactFaqs(): AskFaqItem[] {
  return GENERAL_FACT_QUESTIONS.map(({ question, expectedTitle }) => {
    const result = answerQuery(question);
    if (!result || result.title !== expectedTitle) {
      throw new Error(
        `ask-faq-coverage: 「${question}」の回答タイトルが想定と不一致（想定=${expectedTitle} / 実際=${result?.title ?? 'null'}）。GENERAL_FACTSの正規表現の優先順位を確認してください。`
      );
    }
    return { question, answer: result.answer };
  });
}
