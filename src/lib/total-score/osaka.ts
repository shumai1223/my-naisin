/**
 * 大阪府の総合点計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝大阪府は学力検査(450点満点)と調査書(450点満点)を
 * 志望校の選抜タイプ(Ⅰ〜Ⅴ)ごとに異なる倍率(タイプⅠ=学力1.4倍/調査書0.6倍〜タイプⅤ=学力0.6倍/
 * 調査書1.4倍)で加重合算する独自方式のため個別実装している。OsakaTotalScoreCalculator.tsxに
 * インラインだった計算ロジックを切り出した単一ソースで、UIとAPI/MCPで計算結果がズレないようにする
 * （新規計算ロジックの追加ではない）。
 *
 * ⚠️2026-08-21修正: 旧実装は倍率を7:3〜3:7の「比率の合計が1になる加重平均」（総合点450点満点）
 * として扱っていたが、実際の制度は各倍率の合計が常に2になる「加重合計」（総合点900点満点＝
 * prefectures.tsのosaka.reverseCalc.totalMaxScoreと同じ）。複数の外部情報源
 * （例:「学力検査350点、調査書400点の場合、(350×1.4)+(400×0.6)=730点（900点満点）」という
 * タイプⅠの計算例）で倍率が0.6〜1.4刻みであることを確認して倍率とOSAKA_TOTAL_SCORE_MAXを修正した。
 * ReverseCalculator.tsx（prefectures.tsのosakaTypes）は元々examMultiplier/naishinMultiplierとして
 * 0.6〜1.4刻みを前提にしたコードだった（examMultiplierのデフォルトフォールバック値1.2＝タイプⅡ）ため
 * 実装の意図と定数値が食い違っていたバグ。同時にprefectures.tsのosakaTypes.examMultiplier
 * （旧: 全タイプ一律1.0）も修正した。
 */

export interface OsakaTypeOption {
  label: string;
  gakuryoku: number;
  naishin: number;
}

/** 選抜タイプ別の学力検査:内申の倍率（Ⅰ=学力最重視〜Ⅴ=内申最重視・倍率の合計は常に2）。 */
export const OSAKA_TYPE_OPTIONS: OsakaTypeOption[] = [
  { label: 'タイプⅠ（7:3 学力最重視）', gakuryoku: 1.4, naishin: 0.6 },
  { label: 'タイプⅡ（6:4 学力重視）', gakuryoku: 1.2, naishin: 0.8 },
  { label: 'タイプⅢ（5:5 標準）', gakuryoku: 1.0, naishin: 1.0 },
  { label: 'タイプⅣ（4:6 内申重視）', gakuryoku: 0.8, naishin: 1.2 },
  { label: 'タイプⅤ（3:7 内申最重視）', gakuryoku: 0.6, naishin: 1.4 },
];

/** 学力検査・調査書それぞれの素点満点（クランプ用）。総合点の満点はOSAKA_TOTAL_SCORE_MAXを参照。 */
const OSAKA_COMPONENT_MAX_SCORE = 450;

export const OSAKA_TOTAL_SCORE_MAX = 900;

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

/** 総合点 = 学力検査点×学力倍率 + 内申点×内申倍率（両者とも450点満点・倍率の合計は2＝総合点900点満点）。 */
export function computeOsakaTotalScore(input: OsakaTotalScoreInput): OsakaTotalScoreResult {
  const type = OSAKA_TYPE_OPTIONS[input.typeIndex ?? 2] ?? OSAKA_TYPE_OPTIONS[2];
  const gakuryokuRaw = clamp(input.gakuryokuRaw, 0, OSAKA_COMPONENT_MAX_SCORE);
  const naishinRaw = clamp(input.naishinRaw, 0, OSAKA_COMPONENT_MAX_SCORE);
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

// 2026-08-21: 旧しきい値(380/350/310/270/220)は総合点450点満点だった旧実装からの引き継ぎ値。
// 総合点の満点を900点に修正したのに合わせ、同じ満点比を保つよう単純に2倍している
// （学校別の実測ボーダーへの校正ではない＝断定しない方針は変更なし）。
/** 総合点の帯からおおまかな併願校レベルの目安ラベルを返す（学校別ボーダー断定なし）。 */
export function osakaRankLabel(total: number): string {
  if (total >= 760) return '最難関校レベル（北野・茨木・天王寺・三国丘）';
  if (total >= 700) return '難関校レベル（豊中・大手前・四條畷・高津）';
  if (total >= 620) return '上位校レベル（春日丘・寝屋川・池田・千里）';
  if (total >= 540) return '中堅上位校レベル（牧野・刀根山・八尾）';
  if (total >= 440) return '中堅校レベル';
  return '基礎を固める段階';
}
