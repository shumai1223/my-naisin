/**
 * 北海道 道立高等学校 入学者選抜日程（T-Y12・7県目）。
 *
 * 一次ソース: 北海道教育委員会教育庁学校教育局学力向上推進課
 * 「北海道立高等学校入学者選抜 学力検査日、追検査日、推薦入学面接日及び合格発表日について」
 * https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/184082.html
 *
 * ⚠️kanagawaと同様、このページは既に令和9年度（2027年度）分に更新されており令和8年度分は
 * 掲載されていない（2026-09-04時点でWebFetch確認・教委が年度更新のたびに古い年度を消す
 * 運用と一致）。よって本県も令和9年度分から収録する。
 *
 * 学力検査日（3/3）・合格発表日（3/16）はWebSearchで独立した二次情報源（リセマム・
 * 北海道高校受験情報サイト等）と突合し完全一致を確認済み（2026-09-04）。
 *
 * ⚠️このページのタイトルどおり「学力検査日・追検査日・推薦入学面接日・合格発表日」の4項目のみが
 * 掲載されており、出願受付期間・志願変更期間はこのページには記載がなかった（別ページ/PDFの
 * 「入学者選抜手続きの手引」等に記載されている可能性があるが未確認）。捏造ゼロ優先のため、
 * 確認できた4項目のみを収録し、出願期間は無理に埋めない。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const HOKKAIDO_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'hokkaido',
  years: [
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/184082.html',
      docTitle: '北海道立高等学校入学者選抜 学力検査日、追検査日、推薦入学面接日及び合格発表日について',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦入学面接日', startDate: '2027-02-09' },
        { label: '学力検査日', startDate: '2027-03-03' },
        { label: '追検査日', startDate: '2027-03-10' },
        { label: '合格発表日', startDate: '2027-03-16' },
      ],
    },
  ],
};
