/**
 * 学科(competition-rates.department)→Λ-4県内区分(competition-rate-history.categories[].label)の対応表。
 *
 * 👤裁定(2026-08-01)の品質ゲート②「その学校の学科が属する県内区分の多年度推移を『県全体の傾向』
 * として粒度を明示して併記する」を実装するための橋渡し。**完全一致のみ**を採用し、対応が
 * 定義されていない学科は正直に「推移データなし」として扱う（あいまい一致・部分一致はしない・
 * Y-0憲法の精神を継承）。
 *
 * **この対応表は都道府県ごとに個別に検証が必要**（学科名の表記・Λ-4の区分粒度は県により異なる）。
 * 現時点では東京都のみ収録（1県パイロット）。他県へ横展開する際は、その県のcompetition-rates
 * departmentとcompetition-rate-history categoriesを両方確認したうえで個別に対応表を追加すること
 * （東京都の対応表をコピーして使い回さない＝表記ゆれによる誤対応のリスクを避ける）。
 */

/** 東京都: competition-ratesのdepartment表記 → competition-rate-historyのcategories[].label表記。 */
export const TOKYO_DEPARTMENT_TO_CATEGORY_LABEL: Record<string, string> = {
  普通科: '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計',
  '普通科（コース制・外国語）': 'コース制計',
  '普通科（コース制・造形美術）': 'コース制計',
  '普通科（単位制）': '単位制計',
  '普通科（海外帰国生徒対象・帰国生）': '海外帰国生徒対象計',
  '普通科（海外帰国生徒対象・引揚者）': '海外帰国生徒対象計',
  商業科: '商業科',
  ビジネスコミュニケーション科: 'ビジネスコミュニケーション科',
  工業科: '工業科(単位制以外)',
  '工業科（単位制）': '工業科(単位制)',
  科学技術科: '科学技術科',
  農業科: '農業科',
  水産科: '水産科',
  家庭科: '家庭科(単位制以外)',
  '家庭科（単位制）': '家庭科(単位制)',
  福祉科: '福祉科',
  理数科: '理数科',
  芸術科: '芸術科',
  体育科: '体育科',
  国際科: '国際科',
  '併合科（農林・家政）': '併合科',
  '併合科（農業・家政）': '併合科',
  '併合科（園芸・家政）': '併合科',
  産業科: '産業科',
  総合学科: '総合学科',
};

/** 都道府県コード→対応表。他県を追加する際はここにエントリを増やす。 */
export const DEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTURE: Record<string, Record<string, string>> = {
  tokyo: TOKYO_DEPARTMENT_TO_CATEGORY_LABEL,
};

/**
 * departmentからΛ-4のcategoryラベルを引く。対応表が無い都道府県・department自体は
 * 正直にnullを返す（あいまいな推測はしない）。
 */
export function resolveCategoryLabel(prefectureCode: string, department: string): string | null {
  const table = DEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTURE[prefectureCode];
  if (!table) return null;
  return table[department] ?? null;
}
