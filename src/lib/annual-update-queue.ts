/**
 * Y-10: 年次更新機械 — ローカル収録データの「年度ギャップ」検知キュー。
 *
 * `src/data/competition-rates/` は都道府県ごとに `sources[].fiscalYear`（例:
 * '令和8年度（2026年度）'）へ、その県が最後に取り込んだ入試年度を記録している
 * （Y-2/Y-6/T-A1で構築済み）。本モジュールは、この記録済みの最新年度と「現在の暦日から見て
 * 本来もう取り込めているはずの年度」を突き合わせ、取り込みが遅れている県をギャップの大きい順に
 * 検知する純関数群を提供する。
 *
 * ライブのWebスクレイピングによる差分検知（教委サイトを毎回巡回する）はスコープ外。ここでの
 * 「検知」は既存のローカルデータの整合性チェックに限定される（Y-0憲法「捏造ゼロ」＝全ての値は
 * 実際に収録済みのsourcesから機械的に導出するのみ）。
 *
 * 実際に新しい年度を取り込む作業（掛-1/T-A1と同型のPDF転記）自体は本モジュールの範囲外で、
 * 本モジュールはあくまで「次に確認すべき県」を機械的に提示するキューにとどまる
 * （freshness-queue.ts＝ZZ-9bと同じ設計思想。ZZ-9bは「最終確認日の古さ」、本モジュールは
 * 「収録している最新年度の遅れ」を見る点が異なる＝相互補完）。
 */
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { PREFECTURES } from '@/lib/prefectures';

/** '令和N年度（YYYY年度）' 等の文字列からNを抽出する。パースできなければnull。 */
export function parseReiwaYear(fiscalYear: string): number | null {
  const m = fiscalYear.match(/令和(\d+)年度/);
  return m ? Number(m[1]) : null;
}

/** 西暦年（例: 2026）を令和年度番号（例: 8）に変換する。令和1年度=2019年。 */
export function calendarYearToReiwa(calendarYear: number): number {
  return calendarYear - 2018;
}

/**
 * 現在の暦日から見て「本来もう収録できているはず」の最新令和年度を判定する。
 * 例年の公表は1月末〜3月中旬に完了する（AA-4の実測: 神奈川1/30〜福島3/19、
 * `docs/seasonal-repitch-calendar.md`参照）ため、余裕を持って4/1を境に切り替える
 * （4/1より前＝前年分がまだ最新のはず／4/1以降＝当年分が取り込めているはず）。
 */
export function expectedLatestReiwaYear(now: Date = new Date()): number {
  // タイムゾーン依存を避けるためUTC基準で判定する（seasonal.tsと同じ方針）。
  const calendarYear = now.getUTCFullYear();
  const aprilOrLater = now.getUTCMonth() >= 3; // getUTCMonth()は0始まり。3=4月
  const effectiveCalendarYear = aprilOrLater ? calendarYear : calendarYear - 1;
  return calendarYearToReiwa(effectiveCalendarYear);
}

/** sources[]から、その県が保持している最新の令和年度を求める。パース不能なsourcesしか無ければnull。 */
export function latestHeldReiwaYear(sources: { fiscalYear: string }[]): number | null {
  const years = sources.map((s) => parseReiwaYear(s.fiscalYear)).filter((y): y is number => y !== null);
  return years.length > 0 ? Math.max(...years) : null;
}

export interface AnnualUpdateGapEntry {
  prefectureCode: string;
  /** この県が実際に保持している最新の令和年度。sourcesから1件もパースできなければnull。 */
  latestHeldReiwaYear: number | null;
  /** 現在の暦日から見て本来取り込めているはずの令和年度。 */
  expectedReiwaYear: number;
  /** expectedReiwaYear - latestHeldReiwaYear（保持データが無ければexpectedReiwaYearと同値）。1以上がギャップあり。 */
  gap: number;
}

/**
 * 競争率データを保持している全都道府県について年度ギャップを検知し、
 * ギャップが大きい順（＝長く放置されている順）に返す。ギャップが無い（0以下）県は含めない。
 */
export function buildAnnualUpdateQueue(now: Date = new Date()): AnnualUpdateGapEntry[] {
  const expected = expectedLatestReiwaYear(now);
  const entries: AnnualUpdateGapEntry[] = [];
  for (const p of PREFECTURES) {
    const file = COMPETITION_RATE_BY_PREFECTURE[p.code];
    if (!file) continue; // 競争率データを一度も収録していない県は対象外（Y-6完走済みのため通常は無い想定）
    const held = latestHeldReiwaYear(file.sources);
    const gap = held === null ? expected : expected - held;
    entries.push({ prefectureCode: p.code, latestHeldReiwaYear: held, expectedReiwaYear: expected, gap });
  }
  return entries
    .filter((e) => e.gap > 0)
    .sort((a, b) => b.gap - a.gap || a.prefectureCode.localeCompare(b.prefectureCode));
}
