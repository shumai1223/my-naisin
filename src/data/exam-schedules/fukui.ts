/**
 * 福井県 公立高等学校 入学者選抜日程（T-Y12・28県目）。
 *
 * 一次ソース: 福井県教育委員会「令和8年度入学者選抜日程」（1頁のカレンダー形式日程表）
 * https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08nittei_d/fil/R08nittei.pdf
 *
 * このPDFはToUnicode欠落でpdftotextは使えなかったが、フォント欠落エラーは出ず
 * ビジョン解析で問題なく一次ソースの表を直接転記できた。
 *
 * 一般選抜の出願期間(2/5-9)・志願変更(2/12-16)・学力検査(2/18-19)・追検査(2/25-26)・
 * 合格者発表(3/3)はWebSearchで得た独立した二次情報源と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const FUKUI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'fukui',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08nittei_d/fil/R08nittei.pdf',
      docTitle: '令和8年度入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦・特色等出願', startDate: '2026-01-06', endDate: '2026-01-08', note: '締切は16:00' },
        { label: '推薦・特色・中高一貫教育校入学面接等', startDate: '2026-01-15', note: '特色選抜の面接等予備日は1/16' },
        { label: '推薦・特色・中高一貫教育校入学合格者通知', startDate: '2026-01-21' },
        { label: '一般選抜出願', startDate: '2026-02-05', endDate: '2026-02-09', note: '締切は16:00' },
        { label: '志願変更', startDate: '2026-02-12', endDate: '2026-02-16', note: '締切は12:00' },
        { label: '一般選抜学力検査', startDate: '2026-02-18', endDate: '2026-02-19' },
        { label: '追検査', startDate: '2026-02-25', endDate: '2026-02-26' },
        { label: '一般入学者選抜合格者発表', startDate: '2026-03-03', note: '14:00' },
        { label: '第2次募集出願', startDate: '2026-03-04', endDate: '2026-03-05', note: '締切は12:00' },
        { label: '第2次募集学力検査', startDate: '2026-03-09' },
        { label: '第2次募集合格者発表', startDate: '2026-03-11' },
      ],
    },
  ],
};
