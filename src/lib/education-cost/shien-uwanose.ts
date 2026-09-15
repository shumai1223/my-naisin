// T-Y13: 都道府県独自「上乗せ」制度（高校生等就学支援金・私立高校授業料軽減）の型と純関数。
//
// `education-cost/data.ts` の SHUGAKU_SHIEN_TIERS は国の基礎制度3区分のみを実装しており、
// 都道府県が独自に上乗せする制度（授業料軽減助成金・奨学給付金の県単独上乗せ等）は対象外
// （同ファイルのコメント「自治体独自の補助があり、自治体ごとに要確認」参照）。本モジュールは
// その欠けているピースを扱う。既存の国3区分ベースの計算結果は一切上書きしない（後方互換）。
//
// Y-0憲章の適用（[[ops/tasks/T-Y13-shugaku-shien-uwanose-db.md]]参照）:
//  - 公表値のみを転記する。独自推定はしない
//  - 1データ点1出典（都道府県が公表するページ・PDFのURL必須）
//  - 制度は年度で改定されるため fiscalYear ごとに別レコードとして持つ
//  - 確認できない県は 'unknown' として明示。「制度なし確認済み」とは区別する
//  - 47県揃わなくてよい

import type { CostSource } from './types';

/** この都道府県の上乗せ制度の確認状況。 */
export type ShienUwanoseStatus =
  /** 独自の上乗せ制度があると一次資料で確認できた。 */
  | 'confirmed-yes'
  /** 独自の上乗せ制度が無い（国基礎制度のみ）と一次資料で確認できた。 */
  | 'confirmed-none'
  /** まだ一次資料で確認できていない（存在確認パス段階、または検索のみで未確定）。 */
  | 'unknown';

/**
 * 制度設計の類型（T-Y13ステップ2で発見・区別が必須と判明）。
 * - 'household': 都道府県が家庭（生徒・保護者）に直接、就学支援金へ上乗せする形で給付する
 * - 'school-subsidy': 私立学校が授業料等を減免した場合に、都道府県がその学校の設置者へ補助する
 *   （家庭から見れば結果的に授業料が下がる点は同じだが、「都道府県から家庭にいくら出るか」を
 *   単純な金額として持てない制度設計のため区別する）
 */
export type ShienUwanoseSchemeType = 'household' | 'school-subsidy';

/** 所得区分ごとの上乗せ額（年額・円）。 */
export interface ShienUwanoseIncomeTier {
  /** 世帯年収の目安ラベル（例: '世帯年収 約590万円未満（目安）'）。正確な判定は課税標準額で行われる。 */
  label: string;
  /** この区分の上乗せ額（年額・円）。学校補助型（school-subsidy）の場合は学校への補助上限額。 */
  annualAmountJpy: number;
  note?: string;
}

/** 1都道府県・1年度ぶんの上乗せ制度レコード。 */
export interface PrefectureShienUwanose {
  prefectureCode: string;
  /** 例: '令和8年度（2026年度）'。制度は年度で改定されるため必須。 */
  fiscalYear: string;
  status: ShienUwanoseStatus;
  /** status が 'confirmed-yes' の場合のみ意味を持つ。 */
  schemeType?: ShienUwanoseSchemeType;
  /** 公表されている制度の正式名称（例: '東京都私立高等学校等授業料軽減助成金'）。 */
  schemeName?: string;
  /** 所得区分別の上乗せ額。区分がない一律給付の場合は要素1件でよい。 */
  tiers?: ShienUwanoseIncomeTier[];
  source: CostSource;
  note?: string;
}

/** 都道府県コード→レコードのマップの型（実データは `@/data/shien-uwanose` 側が保持する）。 */
export type ShienUwanoseByPrefecture = Partial<Record<string, PrefectureShienUwanose>>;

/** 指定県の上乗せ制度レコードを返す。未登録なら undefined（'unknown' 相当）。 */
export function getShienUwanose(
  byPrefecture: ShienUwanoseByPrefecture,
  prefectureCode: string
): PrefectureShienUwanose | undefined {
  return byPrefecture[prefectureCode];
}

/**
 * 指定県・指定年収ラベルに一致する上乗せ額（年額・円）を返す。
 * 制度がconfirmed-yesかつ該当する所得区分が見つかった場合のみ数値を返す。
 * それ以外（confirmed-none/unknown/区分不一致）は null（「0円」と区別するため）。
 */
export function findUwanoseAmountForTierLabel(
  byPrefecture: ShienUwanoseByPrefecture,
  prefectureCode: string,
  tierLabel: string
): number | null {
  const record = getShienUwanose(byPrefecture, prefectureCode);
  if (!record || record.status !== 'confirmed-yes' || !record.tiers) return null;
  const tier = record.tiers.find((t) => t.label === tierLabel);
  return tier ? tier.annualAmountJpy : null;
}

/** 全登録県のうち、指定ステータスに一致する都道府県コードの配列を返す（集計・テスト用）。 */
export function prefecturesByStatus(
  byPrefecture: ShienUwanoseByPrefecture,
  status: ShienUwanoseStatus
): string[] {
  return Object.values(byPrefecture)
    .filter((r): r is PrefectureShienUwanose => r !== undefined && r.status === status)
    .map((r) => r.prefectureCode)
    .sort();
}
