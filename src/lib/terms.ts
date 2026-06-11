/**
 * 学期ラベル（中1→中3の時系列トラッキング用）。
 *
 * 計算履歴の各エントリに「どの学年・学期の成績か」を後付けで紐づけられるようにし、
 * ダッシュボードで中1→中3の内申点の伸びを学期順に可視化する。
 * 値はlocalStorageに永続化されるため、安定した短いコード（g{学年}-t{学期}）を使う。
 */

export interface TermOption {
  /** 永続化キー（不変） */
  value: string;
  /** 表示名 */
  label: string;
  /** グラフのx軸用の短縮名 */
  shortLabel: string;
  /** 学期順の並び（中1-1学期=1 … 中3-学年末=9） */
  order: number;
  /** 学年（1〜3） */
  grade: 1 | 2 | 3;
}

export const TERM_OPTIONS: ReadonlyArray<TermOption> = [
  { value: 'g1-t1', label: '中1・1学期', shortLabel: '中1①', order: 1, grade: 1 },
  { value: 'g1-t2', label: '中1・2学期', shortLabel: '中1②', order: 2, grade: 1 },
  { value: 'g1-t3', label: '中1・学年末', shortLabel: '中1末', order: 3, grade: 1 },
  { value: 'g2-t1', label: '中2・1学期', shortLabel: '中2①', order: 4, grade: 2 },
  { value: 'g2-t2', label: '中2・2学期', shortLabel: '中2②', order: 5, grade: 2 },
  { value: 'g2-t3', label: '中2・学年末', shortLabel: '中2末', order: 6, grade: 2 },
  { value: 'g3-t1', label: '中3・1学期', shortLabel: '中3①', order: 7, grade: 3 },
  { value: 'g3-t2', label: '中3・2学期', shortLabel: '中3②', order: 8, grade: 3 },
  { value: 'g3-t3', label: '中3・学年末', shortLabel: '中3末', order: 9, grade: 3 },
];

const TERM_BY_VALUE = new Map(TERM_OPTIONS.map((t) => [t.value, t]));

export function isValidTerm(value: unknown): value is string {
  return typeof value === 'string' && TERM_BY_VALUE.has(value);
}

export function getTerm(value: string | undefined | null): TermOption | undefined {
  if (!value) return undefined;
  return TERM_BY_VALUE.get(value);
}

export function getTermLabel(value: string | undefined | null): string | undefined {
  return getTerm(value)?.label;
}

export function getTermOrder(value: string | undefined | null): number {
  return getTerm(value)?.order ?? Number.POSITIVE_INFINITY;
}
