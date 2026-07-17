/**
 * 神奈川県のS値（S1・S2）計算（S-5②）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝神奈川県は内申点(135点満点)と学力検査点(500点満点)を
 * 志望校ごとに異なる比率(4:6〜7:3等)で100点満点換算し合算するS1値、特色検査を加えたS2値という
 * 独自方式のため個別実装している。KanagawaSValueCalculator.tsxにインラインだった計算ロジックを
 * 切り出した単一ソースで、UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

export interface KanagawaRatioOption {
  label: string;
  naishin: number;
  gakuryoku: number;
}

/** 志望校の内申：学力の比率パターン（比率の合計は常に10）。 */
export const KANAGAWA_RATIO_OPTIONS: KanagawaRatioOption[] = [
  { label: '4:6（標準）', naishin: 4, gakuryoku: 6 },
  { label: '3:7（学力重視）', naishin: 3, gakuryoku: 7 },
  { label: '2:8（学力最重視）', naishin: 2, gakuryoku: 8 },
  { label: '5:5（バランス型）', naishin: 5, gakuryoku: 5 },
  { label: '6:4（内申重視）', naishin: 6, gakuryoku: 4 },
  { label: '7:3（内申最重視）', naishin: 7, gakuryoku: 3 },
];

export const KANAGAWA_S_VALUE_MAX = 1000;

export interface KanagawaSValueInput {
  /** 内申点（135点満点＝中2＋中3×2の9教科評定）。 */
  naishinRaw: number;
  /** 学力検査点（500点満点＝5教科×100点）。 */
  gakuryokuRaw: number;
  /** 特色検査の得点（任意・最大100点。難関校のみ実施）。0または未指定で加味しない。 */
  tokushokuRaw?: number;
  /** KANAGAWA_RATIO_OPTIONSのインデックス（既定0=4:6標準）。 */
  ratioIndex?: number;
}

export interface KanagawaSValueResult {
  naishinConverted: number;
  gakuryokuConverted: number;
  /** S1値（特色検査なし）。 */
  s1: number;
  /** S2値（S1＋特色検査×5。特色検査未入力時はs1と同値）。 */
  s2: number;
  ratio: KanagawaRatioOption;
  max: number;
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/**
 * S1値 = (内申/135×100×内申比率) + (学力/500×100×学力比率)。
 * S2値 = S1 + 特色検査の得点×5（特色検査を実施する難関校向けの簡略加算）。
 */
export function computeKanagawaSValue(input: KanagawaSValueInput): KanagawaSValueResult {
  const ratio = KANAGAWA_RATIO_OPTIONS[input.ratioIndex ?? 0] ?? KANAGAWA_RATIO_OPTIONS[0];
  const tokushoku = clamp(input.tokushokuRaw ?? 0, 0, 100);
  const naishinRaw = clamp(input.naishinRaw, 0, 135);
  const gakuryokuRaw = clamp(input.gakuryokuRaw, 0, 500);

  const naishinConverted = (naishinRaw / 135) * 100 * ratio.naishin;
  const gakuryokuConverted = (gakuryokuRaw / 500) * 100 * ratio.gakuryoku;
  const s1 = Math.round(naishinConverted + gakuryokuConverted);
  const s2 = Math.round(s1 + tokushoku * 5);

  return { naishinConverted, gakuryokuConverted, s1, s2, ratio, max: KANAGAWA_S_VALUE_MAX };
}

/** S1値の帯からおおまかな併願校レベルの目安ラベルを返す（学校別ボーダー断定なし）。 */
export function kanagawaRankLabel(s1: number): string {
  if (s1 >= 900) return '最難関校レベル（横浜翠嵐・湘南）';
  if (s1 >= 830) return '難関校レベル（柏陽・厚木・川和）';
  if (s1 >= 750) return '上位校レベル（光陵・希望ヶ丘・小田原）';
  if (s1 >= 680) return '中堅上位校レベル（鎌倉・大和・横浜緑ヶ丘）';
  if (s1 >= 600) return '中堅校レベル';
  return '基礎を固める段階';
}
