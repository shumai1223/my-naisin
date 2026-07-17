/**
 * 大阪府の総合点計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝大阪府は学力検査(450点満点)と調査書(450点満点)を
 * 志望校の選抜タイプ(Ⅰ〜Ⅴ)ごとに異なる比率(7:3〜3:7)で加重合算する独自方式のため個別実装している。
 * OsakaTotalScoreCalculator.tsxにインラインだった計算ロジックを切り出した単一ソースで、
 * UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

export interface OsakaTypeOption {
  label: string;
  gakuryoku: number;
  naishin: number;
}

/** 選抜タイプ別の学力検査:内申の比率（Ⅰ=学力最重視〜Ⅴ=内申最重視）。 */
export const OSAKA_TYPE_OPTIONS: OsakaTypeOption[] = [
  { label: 'タイプⅠ（7:3 学力最重視）', gakuryoku: 0.7, naishin: 0.3 },
  { label: 'タイプⅡ（6:4 学力重視）', gakuryoku: 0.6, naishin: 0.4 },
  { label: 'タイプⅢ（5:5 標準）', gakuryoku: 0.5, naishin: 0.5 },
  { label: 'タイプⅣ（4:6 内申重視）', gakuryoku: 0.4, naishin: 0.6 },
  { label: 'タイプⅤ（3:7 内申最重視）', gakuryoku: 0.3, naishin: 0.7 },
];

export const OSAKA_TOTAL_SCORE_MAX = 450;

export interface OsakaTotalScoreInput {
  /** 内申点（450点満点＝3年間合算・9教科）。 */
  naishinRaw: number;
  /** 学力検査点（450点満点＝5教科×90点）。 */
  gakuryokuRaw: number;
  /** OSAKA_TYPE_OPTIONSのインデックス（既定2=タイプⅢ 5:5標準）。 */
  typeIndex?: number;
}

export interface OsakaTotalScoreResult {
  gakuryokuScore: number;
  naishinScore: number;
  total: number;
  max: number;
  percent: number;
  type: OsakaTypeOption;
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/** 総合点 = 学力検査点×学力比率 + 内申点×内申比率（両者とも450点満点・比率の合計は1）。 */
export function computeOsakaTotalScore(input: OsakaTotalScoreInput): OsakaTotalScoreResult {
  const type = OSAKA_TYPE_OPTIONS[input.typeIndex ?? 2] ?? OSAKA_TYPE_OPTIONS[2];
  const gakuryokuRaw = clamp(input.gakuryokuRaw, 0, OSAKA_TOTAL_SCORE_MAX);
  const naishinRaw = clamp(input.naishinRaw, 0, OSAKA_TOTAL_SCORE_MAX);
  const gakuryokuScore = gakuryokuRaw * type.gakuryoku;
  const naishinScore = naishinRaw * type.naishin;
  const total = Math.round(gakuryokuScore + naishinScore);
  return {
    gakuryokuScore,
    naishinScore,
    total,
    max: OSAKA_TOTAL_SCORE_MAX,
    percent: (total / OSAKA_TOTAL_SCORE_MAX) * 100,
    type,
  };
}

/** 総合点の帯からおおまかな併願校レベルの目安ラベルを返す（学校別ボーダー断定なし）。 */
export function osakaRankLabel(total: number): string {
  if (total >= 380) return '最難関校レベル（北野・茨木・天王寺・三国丘）';
  if (total >= 350) return '難関校レベル（豊中・大手前・四條畷・高津）';
  if (total >= 310) return '上位校レベル（春日丘・寝屋川・池田・千里）';
  if (total >= 270) return '中堅上位校レベル（牧野・刀根山・八尾）';
  if (total >= 220) return '中堅校レベル';
  return '基礎を固める段階';
}
