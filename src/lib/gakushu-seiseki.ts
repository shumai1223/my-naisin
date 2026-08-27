/**
 * 学習成績の状況（大学入学者選抜の調査書・旧称「評定平均（値）」）計算エンジン（T-C4）。
 *
 * 出典: 文部科学省「令和９年度大学入学者選抜実施要項について（通知）」
 * （令和８年５月27日付け８文科高第318号文部科学省高等教育局長通知）別紙様式１
 * 「調査書記入上の注意事項等について」8(2)(4)・9(1)
 * https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf
 * （2026-08-27にPyMuPDFで全文抽出し確認。R4版から定義に変更なし。source-history.tsに登録）
 *
 * ★最重要の設計制約: 修得単位数は計算式に一切入らない（通知の計算例は4単位科目も2単位科目も
 * 「評定数1」として数えている）。この型は単位数というフィールドを持たない＝受け取れない。
 */

export type Hyotei = 1 | 2 | 3 | 4 | 5;

/** 単位数(tanni)を意図的に持たない。学習成績の状況の計算に単位数は使わないため。 */
export interface Kamoku {
  /** 教科（例: 国語・地理歴史・数学・理科・保健体育…）。 */
  kyoka: string;
  /** 科目（例: 現代の国語・物理基礎…）。 */
  kamoku: string;
  /** 学年（複数学年にわたる科目は学年ごとに1件ずつ計上する＝各学年1科目分）。 */
  gakunen: 1 | 2 | 3 | 4;
  /** 評定（5段階）。 */
  hyotei: Hyotei;
}

export type GakushuSeihyou = 'A' | 'B' | 'C' | 'D' | 'E';

/**
 * 「小数点以下第２位を四捨五入」（＝小数第1位までに丸める。例: 3.6666…→3.7／3.8709…→3.9）。
 * 浮動小数の誤差（除算結果が3.45の直前でわずかに小さい等）で四捨五入の境界を誤判定しないよう、
 * 10倍した値に極小のepsilonを加えてから整数丸めする（境界値0.05単位に対し十分小さい1e-9）。
 */
function roundToFirstDecimal(value: number): number {
  return Math.round(value * 10 + 1e-9) / 10;
}

/**
 * 各教科の学習成績の状況＝各教科ごとに各科目の評定の合計数を各教科の評定数で除した数値
 * （小数点以下第2位を四捨五入）。教科名でグループ化して算出する。
 * 複数学年にわたる科目は、呼び出し側が学年ごとに別々の Kamoku として渡すことで
 * 「各学年ごとの評定数をそれぞれ1科目分」の取り扱いを満たす。
 */
export function calcKyokaStatus(kamoku: Kamoku[]): Record<string, number> {
  const byKyoka = new Map<string, number[]>();
  for (const k of kamoku) {
    const list = byKyoka.get(k.kyoka) ?? [];
    list.push(k.hyotei);
    byKyoka.set(k.kyoka, list);
  }

  const result: Record<string, number> = {};
  for (const [kyoka, hyoteiList] of byKyoka) {
    const sum = hyoteiList.reduce((a, b) => a + b, 0);
    result[kyoka] = roundToFirstDecimal(sum / hyoteiList.length);
  }
  return result;
}

/**
 * 全体の学習成績の状況＝すべての教科・科目の評定の合計数をすべての評定数で除した数値
 * （小数点以下第2位を四捨五入）。
 * ★教科ごとの学習成績の状況（calcKyokaStatus）の平均ではない＝全評定の単純平均。
 */
export function calcOverallStatus(kamoku: Kamoku[]): number {
  if (kamoku.length === 0) return 0;
  const sum = kamoku.reduce((a, k) => a + k.hyotei, 0);
  return roundToFirstDecimal(sum / kamoku.length);
}

/**
 * 学習成績概評（全体の学習成績の状況・3か年間分から判定するA〜E）。
 * 丸め済みの値（小数第1位）を渡す前提。境界は通知の表のとおり。
 */
export function toGaihyou(overall: number): GakushuSeihyou {
  if (overall >= 4.3) return 'A';
  if (overall >= 3.5) return 'B';
  if (overall >= 2.7) return 'C';
  if (overall >= 1.9) return 'D';
  return 'E';
}
