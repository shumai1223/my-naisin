import { PREFECTURES, type PrefectureConfig } from '@/lib/prefectures';

/**
 * 「内申点の日本地図」用データ。全ての数値は src/lib/prefectures.ts
 * （各都道府県教育委員会の公式発表に基づく既存データ）から算出する派生値のみで、
 * 新規の一次データは追加しない（捏造ゼロ）。
 *
 * タイル座標は実際の県境SVGパスではなく、方角関係（北→南・西→東）を保った
 * 「簡略化した模式図」用の手作業グリッド配置（W-14 2026-07-17 👤裁定）。
 * 47件が重複なく一意の(col,row)を持つことは __tests__/naishin-map-data.test.ts で保証する。
 */
export interface MapTile {
  code: string;
  col: number;
  row: number;
}

export const GRID_COLS = 11;
export const GRID_ROWS = 15;

export const MAP_TILES: MapTile[] = [
  { code: 'hokkaido', col: 8, row: 0 },
  { code: 'aomori', col: 8, row: 2 },
  { code: 'iwate', col: 8, row: 3 },
  { code: 'akita', col: 7, row: 3 },
  { code: 'miyagi', col: 8, row: 4 },
  { code: 'yamagata', col: 7, row: 4 },
  { code: 'niigata', col: 7, row: 5 },
  { code: 'fukushima', col: 8, row: 5 },
  { code: 'toyama', col: 6, row: 6 },
  { code: 'ishikawa', col: 5, row: 6 },
  { code: 'nagano', col: 7, row: 6 },
  { code: 'gunma', col: 8, row: 6 },
  { code: 'tochigi', col: 9, row: 6 },
  { code: 'ibaraki', col: 10, row: 6 },
  { code: 'fukui', col: 5, row: 7 },
  { code: 'gifu', col: 6, row: 7 },
  { code: 'yamanashi', col: 7, row: 7 },
  { code: 'saitama', col: 8, row: 7 },
  { code: 'tokyo', col: 9, row: 7 },
  { code: 'chiba', col: 10, row: 7 },
  { code: 'shiga', col: 5, row: 8 },
  { code: 'aichi', col: 6, row: 8 },
  { code: 'shizuoka', col: 7, row: 8 },
  { code: 'kanagawa', col: 9, row: 8 },
  { code: 'kyoto', col: 4, row: 8 },
  { code: 'hyogo', col: 3, row: 8 },
  { code: 'tottori', col: 2, row: 8 },
  { code: 'shimane', col: 1, row: 8 },
  { code: 'okayama', col: 2, row: 9 },
  { code: 'hiroshima', col: 1, row: 9 },
  { code: 'yamaguchi', col: 0, row: 9 },
  { code: 'osaka', col: 4, row: 9 },
  { code: 'nara', col: 5, row: 9 },
  { code: 'mie', col: 6, row: 9 },
  { code: 'wakayama', col: 4, row: 10 },
  { code: 'tokushima', col: 5, row: 10 },
  { code: 'ehime', col: 3, row: 10 },
  { code: 'fukuoka', col: 1, row: 10 },
  { code: 'oita', col: 2, row: 10 },
  { code: 'kochi', col: 3, row: 11 },
  { code: 'kagawa', col: 5, row: 11 },
  { code: 'saga', col: 0, row: 11 },
  { code: 'kumamoto', col: 1, row: 11 },
  { code: 'miyazaki', col: 2, row: 11 },
  { code: 'nagasaki', col: 0, row: 12 },
  { code: 'kagoshima', col: 1, row: 12 },
  { code: 'okinawa', col: 1, row: 14 },
];

/**
 * データビジュアライゼーション用の検証済みシーケンシャル(単色)5段階ランプ。
 * dataviz skillのvalidate_palette.js --ordinal で白背景(#ffffff)に対して全項目PASS
 * （lightness monotone / adjacent ΔL >= 0.06 / light-end contrast 2.11:1 / hue spread 3°）。
 */
export const SEQUENTIAL_SCALE = ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281'] as const;
/** 各段の上に載せる文字色（塗りの明度で自動判定・WCAGを大きく割らない安全側の2値のみ）。 */
export const SEQUENTIAL_SCALE_TEXT = ['#0b0b0b', '#0b0b0b', '#ffffff', '#ffffff', '#ffffff'] as const;

export type MapMetricId = 'practical-skew' | 'grade3-weight' | 'max-score';

export interface MapMetricDefinition {
  id: MapMetricId;
  label: string;
  shortLabel: string;
  description: string;
  caveat?: string;
  getValue: (p: PrefectureConfig) => number;
  formatValue: (v: number) => string;
}

/** 中3の学年倍率が、対象学年全体の倍率合計に占める割合(0〜1)。学年別の重みづけを単一指標に圧縮した派生値。 */
function grade3WeightShare(p: PrefectureConfig): number {
  const total = p.targetGrades.reduce((sum, g) => sum + (p.gradeMultipliers[g] ?? 0), 0);
  if (total === 0) return 0;
  return (p.gradeMultipliers[3] ?? 0) / total;
}

export const MAP_METRICS: MapMetricDefinition[] = [
  {
    id: 'practical-skew',
    label: '実技教科の傾斜倍率（実技÷主要5教科）',
    shortLabel: '実技傾斜',
    description: '音楽・美術・保健体育・技術家庭の「実技4教科」が、国語・数学・英語・理科・社会の「主要5教科」の何倍の重みで扱われるか。',
    getValue: (p) => p.practicalMultiplier / p.coreMultiplier,
    formatValue: (v) => `${v}倍`,
  },
  {
    id: 'grade3-weight',
    label: '中3の重み（対象学年の倍率合計に占める割合）',
    shortLabel: '中3偏重度',
    description: '中1〜中3のうち入試の内申点に使う学年の倍率合計のなかで、中3の倍率が占める割合。100%は「中3のみで判定」を意味する。',
    getValue: (p) => Math.round(grade3WeightShare(p) * 1000) / 10,
    formatValue: (v) => `${v}%`,
  },
  {
    id: 'max-score',
    label: '内申点の満点',
    shortLabel: '満点',
    description: '本サイトの計算モデル上の内申点の満点。学年数・倍率の設定次第で変わるため、数字の大小そのものに合否の有利/不利の意味はない（詳しくは注記を参照）。',
    caveat: '満点は学年数・倍率設定の掛け算で決まる「ものさしの目盛り」であり、満点が大きい県ほど有利という意味ではありません。',
    getValue: (p) => p.maxScore,
    formatValue: (v) => `${v}点`,
  },
];

export function getMapMetric(id: MapMetricId): MapMetricDefinition {
  const found = MAP_METRICS.find((m) => m.id === id);
  if (!found) throw new Error(`unknown metric: ${id}`);
  return found;
}

/**
 * 47件の実測値から等件数(五分位)のブレークポイントを作り、bucketIndex(0-4)を返す。
 * しきい値を決め打ちにせず実データから毎回導出することで、恣意的な区切りを避ける。
 */
export function bucketIndexOf(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => a - b);
  const n = sorted.length;
  const rank = sorted.filter((v) => v <= value).length; // 1..n
  const bucket = Math.min(4, Math.floor(((rank - 1) / n) * 5));
  return bucket;
}

export interface MapCellDatum {
  code: string;
  name: string;
  region: string;
  col: number;
  row: number;
  value: number;
  formatted: string;
  bucket: number;
}

export function buildMapCells(metricId: MapMetricId): MapCellDatum[] {
  const metric = getMapMetric(metricId);
  const values = PREFECTURES.map((p) => metric.getValue(p));
  return MAP_TILES.map((tile) => {
    const pref = PREFECTURES.find((p) => p.code === tile.code);
    if (!pref) throw new Error(`prefecture not found for tile: ${tile.code}`);
    const value = metric.getValue(pref);
    return {
      code: pref.code,
      name: pref.name,
      region: pref.region,
      col: tile.col,
      row: tile.row,
      value,
      formatted: metric.formatValue(value),
      bucket: bucketIndexOf(value, values),
    };
  });
}
