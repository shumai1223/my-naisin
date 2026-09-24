/**
 * T-TD1: 県別台帳(TD-0)・ONE-PAGER(TD-4)・商品ページ(TD-8)が共有する「R9の基準日」と「R8資料の種別」の導出。
 * 日付は必ず R9日程DB(EXAM_SCHEDULE_BY_PREFECTURE)から引く(手で打たない)。
 */
import { EXAM_SCHEDULE_BY_PREFECTURE } from '@/data/exam-schedules';

/** R8の資料名から「速報(志願変更前)／確定(志願変更後・最終)／判別不可」を機械判定する。 */
export function finalityOf(title: string): string {
  if (/変更前|速報/.test(title)) return '速報(志願変更前)';
  if (/変更後|最終|確定|調整後|締切後|本出願/.test(title)) return '確定(志願変更後・最終)';
  return '出願状況(時点は資料名から判別不可)';
}

/**
 * R9日程DBのうち「一般(全日制)選抜の志願変更、無ければ出願の締切」にあたるイベントのラベル(部分一致)。
 * 各県のR9イベント一覧(EXAM_SCHEDULE_BY_PREFECTURE)を目視で読んで選んだ。DBに存在しないラベルを書くと
 * 実行時に例外で止まる(=日付を手で打たず、必ずDBから引く)。null=R9日程に該当する出願・変更の締切が無い。
 */
const BASELINE_LABEL: Record<string, string | null> = {
  hokkaido: null, aomori: '出願先変更 受付期限', iwate: null, miyagi: null, akita: null, yamagata: null, fukushima: null,
  ibaraki: null, tochigi: '出願変更期間', gunma: '志願先変更期間（第2回）', saitama: '志願先変更期間', chiba: null,
  tokyo: '学力検査に基づく選抜（第一次募集・分割前期募集） 出願受付期間', kanagawa: '志願変更情報申請期間',
  niigata: '一般選抜 志願変更', toyama: '一般 志願期間', ishikawa: '一般入学 志願変更期間', fukui: '志願変更',
  yamanashi: '後期募集 出願期間', nagano: '後期選抜 志望変更受付期間', gifu: '第一次選抜 変更期間', shizuoka: '志願変更受付',
  aichi: '一般選抜 志願変更期日', mie: null, shiga: '一次募集 出願変更期間', kyoto: '前期選抜・特別入学者選抜 出願期間',
  osaka: '出願期間', hyogo: null, nara: '一次選抜 第二出願期間', wakayama: '一般選抜・スポーツ推薦 本出願受付',
  tottori: null, shimane: null, okayama: '一般入学者選抜（全日制・定時制） 出願の期間', hiroshima: '志願変更',
  yamaguchi: '第一次募集 出願期間', tokushima: '一般選抜 志願変更', kagawa: null, ehime: null, kochi: 'A日程 志願先変更期間',
  fukuoka: '一般入学者選抜 志願先変更受付', saga: '一般選抜 志願変更届', nagasaki: '一般選抜 入学願書受付',
  kumamoto: '後期（一般）選抜 出願変更', oita: '一般入学者選抜 第一志願志願変更期間', miyazaki: null, kagoshima: null,
  okinawa: '志願変更取り下げ・再出願',
};

export function r9Baseline(code: string): { date: string | null; label: string } {
  const y = EXAM_SCHEDULE_BY_PREFECTURE[code]?.years.find((x) => x.fiscalYear.includes('令和9'));
  if (!y || y.events.length === 0) return { date: null, label: '未公表(R9日程DB未収録)' };
  const want = BASELINE_LABEL[code];
  if (want === undefined) throw new Error('BASELINE_LABEL未定義: ' + code);
  if (want === null) return { date: null, label: 'R9日程DBに出願・変更の締切なし(検査日のみ等)' };
  const pick = y.events.find((e) => e.label.includes(want));
  if (!pick) throw new Error('R9日程DBに該当イベントなし: ' + code + ' / ' + want);
  const end = pick.endDate ?? pick.startDate;
  return { date: end, label: pick.label + ' の締切 ' + end };
}
