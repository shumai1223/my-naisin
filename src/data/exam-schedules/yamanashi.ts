/**
 * 山梨県 公立高等学校 入学者選抜日程（T-Y12・29県目）。
 *
 * 一次ソース: 山梨県教育委員会「令和8年度山梨県公立高等学校・山梨県立特別支援学校高等部
 * 入学者選抜実施要項」内「令和8年度公立高等学校入学者選抜日程」（カレンダー形式の日程表・p2）
 * https://www.pref.yamanashi.jp/documents/7061/r8zissiyokko.pdf
 *
 * このPDFはToUnicode欠落でpdftotextは全く抽出できなかったが、ビジョン解析（高解像度クロップで
 * 縦書きラベルの範囲を確認）で一次ソースの表を直接転記できた。全日制の課程（前期募集・後期募集・
 * 全日制再募集）のみを収録し、定時制の課程・通信制の課程・県外及び転入学志願者等の特別措置は
 * 対象外。
 *
 * 前期募集検査(1/29-30)・後期募集学力検査(3/4-5)・入学許可予定者発表(3/12)はWebSearchで得た
 * 独立した二次情報源と完全一致を確認済み（2026-09-04）。
 *
 * ⚠️令和9年度分（T-Y11F §5順序#2）: 一次ソース「令和9年度山梨県公立高等学校入学者選抜の
 * 基本事項」（R8の「実施要項」相当・8頁）
 * https://www.pref.yamanashi.jp/documents/84777/r9kihonziko.pdf
 * このPDFもR8同型のフォント欠落があったが、pdftoppm 200dpi+Read toolのビジョン解析で第1〜3章
 * （前期募集・後期募集・再募集）を直接転記できた。R8にあった「後期募集 志願変更期間」に相当する
 * 項目はこの基本事項には記載がなく、Y-0に従い推測で追加しなかった。出願期間は一括受付日＋2営業日
 * （受付時間が日ごとに異なる）という構成のため、開始日〜最終日をstartDate/endDateとしnoteに
 * 各日の受付時間を明記した。リセマムの独立した二次情報源（前期検査1/28-29・内定2/5・後期検査
 * 3/3-4・合格発表3/11）と完全一致を確認済み（2026-09-08）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const YAMANASHI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'yamanashi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.yamanashi.jp/documents/7061/r8zissiyokko.pdf',
      docTitle: '令和8年度公立高等学校入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期募集 出願期間', startDate: '2026-01-15', endDate: '2026-01-19' },
        { label: '前期募集 検査', startDate: '2026-01-29', endDate: '2026-01-30', note: '検査を1日で実施する場合は1/29に実施' },
        { label: '前期募集 内定', startDate: '2026-02-06' },
        { label: '後期募集 出願期間', startDate: '2026-02-17', endDate: '2026-02-19' },
        { label: '後期募集 志願変更期間', startDate: '2026-02-20', endDate: '2026-02-24' },
        { label: '後期募集 学力検査（全日制）', startDate: '2026-03-04', endDate: '2026-03-05' },
        { label: '追検査', startDate: '2026-03-10' },
        { label: '入学許可予定者発表', startDate: '2026-03-12' },
        { label: '全日制再募集検査', startDate: '2026-03-17' },
        { label: '全日制再募集入学許可予定者発表', startDate: '2026-03-19' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.yamanashi.jp/documents/84777/r9kihonziko.pdf',
      docTitle: '令和9年度山梨県公立高等学校入学者選抜の基本事項',
      fetchedAt: '2026-09-08',
      events: [
        { label: '前期募集 出願期間', startDate: '2027-01-14', endDate: '2027-01-18', note: '1/14一括受付・1/15受付10時〜16時・1/18受付10時〜正午（土日を除く3日間）' },
        { label: '前期募集 検査', startDate: '2027-01-28', endDate: '2027-01-29' },
        { label: '前期募集 内定', startDate: '2027-02-05' },
        { label: '後期募集 出願期間', startDate: '2027-02-16', endDate: '2027-02-18', note: '2/16一括受付・2/17受付10時〜16時・2/18受付10時〜正午（土日を除く3日間）' },
        { label: '後期募集 学力検査（全日制）', startDate: '2027-03-03', endDate: '2027-03-04' },
        { label: '追検査', startDate: '2027-03-09' },
        { label: '入学許可予定者発表', startDate: '2027-03-11', note: '前期募集・後期募集とも共通' },
        { label: '全日制再募集 出願期間', startDate: '2027-03-11', endDate: '2027-03-15', note: '3/11受付13時〜16時・3/12受付10時〜16時・3/15受付10時〜正午（土日を除く3日間）' },
        { label: '全日制再募集検査', startDate: '2027-03-16' },
        { label: '全日制再募集入学許可予定者発表', startDate: '2027-03-18' },
      ],
    },
  ],
};
