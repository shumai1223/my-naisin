/**
 * グラウンデッドAIアドバイザー（ZZ-3a）の質問分類器。
 * 準拠必須仕様: docs/zz-specs/zz3-grounded-advisor-spec.md §1（決定論・AI不使用）。
 *
 * 設計判断: 自然文からの評定・点数抽出（NLU）は行わない（誤抽出のリスクが数値グラウンディングの
 * 安全性と相容れないため）。分類器は「質問のタイプ」だけをキーワードで決定論的に判定し、
 * 実際の評定・点数・都道府県コードはAdvisorQuestionの構造化フィールドから受け取る
 * （UI側=ZZ-3cが既存の入力フォームから埋める前提）。
 */
import { PREFECTURES } from '@/lib/prefectures';

export type AdvisorQuestionType =
  | 'naishin-calc'
  | 'total-score'
  | 'hensachi'
  | 'reverse'
  | 'prefecture-compare'
  | 'system-explain'
  | 'out-of-scope';

export interface ClassifiedQuestion {
  type: AdvisorQuestionType;
  /** 質問文中に都道府県名が含まれていれば抽出したコード（構造化フィールドが未指定の場合の補助）。 */
  mentionedPrefectureCodes: string[];
}

/** 都道府県名（漢字表記）→コードの逆引きマップ（PREFECTURESから構築・新規データなし）。 */
const PREFECTURE_NAME_TO_CODE: ReadonlyMap<string, string> = new Map(PREFECTURES.map((p) => [p.name, p.code]));

function extractMentionedPrefectureCodes(text: string): string[] {
  const codes: string[] = [];
  for (const [name, code] of PREFECTURE_NAME_TO_CODE) {
    if (text.includes(name)) codes.push(code);
  }
  return codes;
}

/**
 * 質問文からタイプを決定論で分類する（純粋関数）。
 * 判定順序: 比較（2県以上言及）→ 逆算（目標・あと何点）→ 総合得点 → 偏差値 → 内申点計算 → 制度説明 → 範囲外。
 * どのキーワードにも一致しない質問は'out-of-scope'として正直に返す（無理に答えない）。
 */
export function classifyQuestion(raw: string): ClassifiedQuestion {
  const mentionedPrefectureCodes = extractMentionedPrefectureCodes(raw);

  if (mentionedPrefectureCodes.length >= 2 && /比較|どっち|違い|差/.test(raw)) {
    return { type: 'prefecture-compare', mentionedPrefectureCodes };
  }
  if (/目標|あと何点|逆算|足りない|届く/.test(raw)) {
    return { type: 'reverse', mentionedPrefectureCodes };
  }
  if (/総合得点|合計点|入試の点数|当日点.*内申/.test(raw)) {
    return { type: 'total-score', mentionedPrefectureCodes };
  }
  if (/偏差値/.test(raw)) {
    return { type: 'hensachi', mentionedPrefectureCodes };
  }
  // 「仕組み/制度」等は「内申点の仕組みを教えて」のように「教えて」も含みうるため、
  // system-explainをnaishin-calcより先に判定する（「教えて」だけでは計算依頼と誤分類しない）。
  if (/仕組み|制度|とは|方式|倍率/.test(raw)) {
    return { type: 'system-explain', mentionedPrefectureCodes };
  }
  if (/内申点/.test(raw) && /(計算|何点|教えて|出し方)/.test(raw)) {
    return { type: 'naishin-calc', mentionedPrefectureCodes };
  }
  return { type: 'out-of-scope', mentionedPrefectureCodes };
}
