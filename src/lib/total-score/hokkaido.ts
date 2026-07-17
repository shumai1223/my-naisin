/**
 * 北海道の総合点・内申ランク計算（S-5②・最終県）。
 *
 * 統一エンジン（engine.ts/registry.ts）の対象外＝北海道は内申点(315点満点)から独自のA〜Mランク表で
 * 帯判定を行い、学力検査点(300点満点)と単純合算した総合点(615点満点)を出す独自方式のため
 * 個別実装している。HokkaidoRankCalculator.tsxにインラインだった計算ロジックを切り出した単一ソースで、
 * UIとAPI/MCPで計算結果がズレないようにする（新規計算ロジックの追加ではない）。
 */

export interface HokkaidoRankEntry {
  rank: string;
  min: number;
  label: string;
}

/** 内申点(315点満点)からA〜Mランクへの帯判定テーブル。 */
export const HOKKAIDO_RANK_TABLE: HokkaidoRankEntry[] = [
  { rank: 'A', min: 296, label: '最上位（札幌南・札幌北レベル）' },
  { rank: 'B', min: 276, label: '上位（札幌西・札幌東・札幌旭丘）' },
  { rank: 'C', min: 256, label: '上位中堅（札幌月寒・札幌国際情報）' },
  { rank: 'D', min: 236, label: '中堅上位（札幌北陵・札幌新川）' },
  { rank: 'E', min: 216, label: '中堅（札幌啓成・市立札幌藻岩）' },
  { rank: 'F', min: 196, label: '中堅下位（札幌平岸・札幌東陵）' },
  { rank: 'G', min: 176, label: '一般中堅（札幌厚別・札幌真栄）' },
  { rank: 'H', min: 156, label: '一般（札幌東豊・市立札幌啓北商業）' },
  { rank: 'I', min: 136, label: '下位（札幌白石・札幌東商業）' },
  { rank: 'J', min: 116, label: '下位中堅' },
  { rank: 'K', min: 96, label: '基礎（札幌琴似工業など）' },
  { rank: 'L', min: 76, label: '基礎下位' },
  { rank: 'M', min: 0, label: '要努力' },
];

export const HOKKAIDO_MAX_NAISHIN = 315;
export const HOKKAIDO_MAX_GAKURYOKU = 300;
export const HOKKAIDO_TOTAL_SCORE_MAX = 615;

export interface HokkaidoRankInput {
  /** 内申点（315点満点＝中1〜中3の9教科・中1×2+中2×2+中3×3の重み）。 */
  naishinRaw: number;
  /** 学力検査点（300点満点＝5教科×60点）。 */
  gakuryokuRaw: number;
}

export interface HokkaidoRankResult {
  rank: HokkaidoRankEntry;
  total: number;
  max: number;
  percent: number;
}

/** 内申点からランク(A〜M)を判定し、学力検査点との単純合算(615点満点)を算出する。 */
const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

export function computeHokkaidoRank(input: HokkaidoRankInput): HokkaidoRankResult {
  const naishinRaw = clamp(input.naishinRaw, 0, HOKKAIDO_MAX_NAISHIN);
  const gakuryokuRaw = clamp(input.gakuryokuRaw, 0, HOKKAIDO_MAX_GAKURYOKU);
  const rank = HOKKAIDO_RANK_TABLE.find((r) => naishinRaw >= r.min) ?? HOKKAIDO_RANK_TABLE[HOKKAIDO_RANK_TABLE.length - 1];
  const total = naishinRaw + gakuryokuRaw;
  return { rank, total, max: HOKKAIDO_TOTAL_SCORE_MAX, percent: (total / HOKKAIDO_TOTAL_SCORE_MAX) * 100 };
}
