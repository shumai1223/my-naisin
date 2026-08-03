/**
 * 兵庫県 多年度アーカイブ（Λ-4・5県目）。
 *
 * 一次ソース: 兵庫県教育委員会「令和8年度兵庫県公立高等学校入学者選抜出願状況
 * （特別出願後確定数）」（2026年3月5日確定）
 * https://www.kobe-c.ed.jp/_view/sir-ms/attach/get2/995/0
 *
 * このPDFは1ページ目の表1「志願者数等」に令和8年度と令和7年度の全日制/定時制の
 * 定員・志願者数・倍率を並記しており（東京都の総括表と同じ「当年度＋前年度併記」形式）、
 * 5ページ目の「全日制127校 計」行（21150/20567/20567/0/0.97/1.02）で機械集計との
 * 完全一致も確認できる。この「全日制127校 計」の定員21150・志願者数20567・倍率0.97は
 * Y-6のhyogo.ts（令和8年度・学校粒度127校190レコード）が転記した公式グランドトータルと
 * 完全一致するため、令和7年度分（本ファイルに収録するのはこちら）もY-2/Y-6と同一の
 * 集計方法・スコープ（全日制のみ・定時制/通信制/多部制は対象外）であることを確認済み。
 * 令和8年度分は既存のsrc/data/competition-rates/hyogo.ts（学校粒度・より高精度）で
 * カバー済みのため本ファイルでは二重管理せず、令和7年度（前年度列）のみを収録する
 * （tokyo/kanagawa/chiba/fukuokaの各historyファイルと同じ設計方針）。ビジョン解析ではなく
 * PDFのテキスト抽出が明瞭に成功したため転記精度の懸念は無い。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const SOURCE = {
  sourceUrl: 'https://www.kobe-c.ed.jp/_view/sir-ms/attach/get2/995/0',
  sourceTitle: '兵庫県教育委員会 令和8年度兵庫県公立高等学校入学者選抜出願状況（特別出願後確定数）',
  fetchedAt: '2026-07-29',
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  ...SOURCE,
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制127校 計（同スコープ・前年度実績）', schoolCount: 127, quota: 21252, applicants: 21596, rate: 1.02 },
};

/**
 * 令和6年度（2024年度）: R7年度に公表された「令和7年度兵庫県公立高等学校入学者選抜出願状況
 * （特別出願後確定数）」PDF（令和7年3月4日確定・R8版と同じ構成）の1頁目「1 志願者数等」表に、
 * 令和7年度と令和6年度（前年度）の全日制/定時制の定員・志願者数・倍率が並記されている
 * （東京都・本ファイルのR7エントリと同じ「当年度＋前年度併記」形式）。全日制列: 定員21,889・
 * 志願者数22,677・倍率1.04（22677/21889=1.0360…≈1.04で印字済み値と整合）。R7エントリの
 * 定員21,252/志願者数21,596/倍率1.02が本PDFの令和7年度列と完全一致することも確認済み
 * （＝本PDFが正しい一次資料であることの裏取り）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2025/03/R7gakuryokusiganhenkousaisyuubi.pdf',
  sourceTitle: '兵庫県教育委員会 令和7年度兵庫県公立高等学校入学者選抜出願状況（特別出願後確定数）',
  fetchedAt: '2026-08-03',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 計（同スコープ・前年度実績）', quota: 21889, applicants: 22677, rate: 1.04 },
};

/**
 * 令和5年度（2023年度）: R6エントリと同じ一次資料（令和6年度兵庫県公立高等学校入学者選抜
 * 出願状況・特別出願後確定数・令和6年3月1日確定）の1頁目「1 志願者数等」表に、令和6年度と
 * 令和5年度（前年度）の全日制/定時制の定員・志願者数・倍率が並記されている。全日制列:
 * 定員21,903・志願者数22,663・倍率1.03（22663/21903=1.0347…≈1.03で印字済み値と整合）。
 * 5頁目の学区別合計表（全日制計 21889/22681/22677/-4/1.04/1.03）のR5倍率とも一致することを
 * 確認済み。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl:
    'https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2024/03/060301【確定】R6_一般入試-全日制-志願変更後の志願者確定数（３月1日）-1.pdf',
  sourceTitle: '兵庫県教育委員会 令和6年度兵庫県公立高等学校入学者選抜出願状況（特別出願後確定数）',
  fetchedAt: '2026-08-03',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 計（同スコープ・前年度実績）', quota: 21903, applicants: 22663, rate: 1.03 },
};

export const HYOGO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'hyogo',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
