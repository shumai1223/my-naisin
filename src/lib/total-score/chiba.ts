/**
 * 千葉県の総合得点計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝千葉県は評定合計(135点満点)にK値(0.5〜2.0・高校ごとに
 * 異なる)を掛けた調査書点＋学力検査点(500点満点)＋任意の調査書その他(最大50点)＋学校設定検査(最大150点)
 * を単純加算する独自方式のため個別実装している。ChibaKValueCalculator.tsxにインラインだった
 * 計算ロジックを切り出した単一ソースで、UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

/** K値のプリセット候補（0.5〜2.0。高校ごとに指定される・直接入力も可）。 */
export const CHIBA_K_PRESETS = [0.5, 1.0, 1.5, 2.0] as const;

export interface ChibaKValueInput {
  /** 評定合計（135点満点＝9教科×5段階×3学年）。 */
  hyoteiRaw: number;
  /** 学力検査点（500点満点＝5教科×100点）。 */
  gakuryokuRaw: number;
  /** 志望校のK値（既定1.0・0.5〜2.0が一般的）。 */
  kValue?: number;
  /** 調査書のその他（任意・最大50点）。入力有無で満点の目安が変わるためincludeOthersと分離。 */
  othersRaw?: number;
  /** その他点を満点計算に含めるか（UIで入力欄が空欄=未入力かどうかに対応）。 */
  includeOthers?: boolean;
  /** 学校設定検査（任意・最大150点）。 */
  schoolExamRaw?: number;
  /** 学校設定検査を満点計算に含めるか。 */
  includeSchoolExam?: boolean;
}

export interface ChibaKValueResult {
  reportScore: number;
  total: number;
  /** 満点はK値・その他・学校設定検査の入力有無で変わる概算の目安。 */
  max: number;
}

/** 総合得点＝学力検査点 + (評定合計×K値) + 調査書その他(任意) + 学校設定検査(任意)。 */
export function computeChibaKValue(input: ChibaKValueInput): ChibaKValueResult {
  const k = input.kValue ?? 1.0;
  const others = input.includeOthers ? (input.othersRaw ?? 0) : 0;
  const schoolExam = input.includeSchoolExam ? (input.schoolExamRaw ?? 0) : 0;

  const reportScore = input.hyoteiRaw * k;
  const total = Math.round(input.gakuryokuRaw + reportScore + others + schoolExam);
  const max = Math.round(500 + 135 * k + (input.includeOthers ? 50 : 0) + (input.includeSchoolExam ? 150 : 0));

  return { reportScore, total, max };
}
