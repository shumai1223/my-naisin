/**
 * 大分県 公立高等学校 入学者選抜日程（T-Y12・43県目）。
 *
 * 一次ソース: 大分県教育委員会「令和8年度大分県立高等学校入学者選抜の主な日程」（1頁）
 * https://www.pref.oita.jp/uploaded/life/2295371_4452583_misc.pdf
 *
 * このPDFはテキストが正常に抽出でき本文を直接確認できた。推薦入学者選抜等（推薦・連携型中高
 * 一貫教育・帰国及び外国人生徒特別入学者選抜）・第一次入学者選抜・第二次入学者選抜の全トラック
 * を収録し、通信制課程は対象外（別途定めるため）。
 *
 * 第一次入学者選抜の検査日(3/10・3/11)は大分県教育委員会の別ページ（学力検査結果分析ページの
 * タイトル）でも「学力検査（第一次）は3月10日実施」と独立に確認できた（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const OITA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'oita',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.oita.jp/uploaded/life/2295371_4452583_misc.pdf',
      docTitle: '令和8年度大分県立高等学校入学者選抜の主な日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦入学者選抜等 出願期間', startDate: '2026-01-20', endDate: '2026-01-23', note: '推薦・連携型中高一貫教育・帰国及び外国人生徒特別入学者選抜' },
        { label: '推薦入学者選抜等 検査日', startDate: '2026-02-03', endDate: '2026-02-04' },
        { label: '推薦入学者選抜等 合格内定通知日', startDate: '2026-02-04', endDate: '2026-02-05' },
        { label: '第一次入学者選抜 出願期間', startDate: '2026-02-13', endDate: '2026-02-19' },
        { label: '第一次入学者選抜 志願変更期間', startDate: '2026-02-24', endDate: '2026-02-27' },
        { label: '第一次入学者選抜 検査日', startDate: '2026-03-10', endDate: '2026-03-11' },
        { label: '合格者発表日', startDate: '2026-03-13', note: '推薦入学者選抜等・第一次入学者選抜とも共通・第二次入学者選抜実施校等発表も同日' },
        { label: '第二次入学者選抜 出願期間', startDate: '2026-03-16', endDate: '2026-03-17' },
        { label: '第二次入学者選抜 検査日', startDate: '2026-03-18' },
        { label: '第二次入学者選抜 合格者発表日', startDate: '2026-03-19' },
      ],
    },
  ],
};
