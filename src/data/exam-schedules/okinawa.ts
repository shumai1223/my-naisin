/**
 * 沖縄県 公立高等学校 入学者選抜日程（T-Y12・46県目）。
 *
 * 一次ソース: 沖縄県教育委員会「令和8年度 沖縄県立学校入学者選抜 日程」（1頁のカレンダー
 * 形式日程表）
 * https://www.pref.okinawa.lg.jp/_res/projects/default_project/_page_/001/035/054/08nittei.pdf
 *
 * このPDFはテキストが正常に抽出でき本文を直接確認できた。県立高校（全日制・定時制）の連携型
 * 選抜・特色選抜・一般選抜（Web出願は3方式共通）を収録し、県立特別支援学校・通信制課程・
 * 併設型中高一貫教育校・沖縄水産高校専攻科は対象外。
 *
 * 学力検査(3/4-5)・合格発表(3/17)・2次募集出願(3/18-19)・2次募集合格発表(3/27)はWebSearchで
 * 得た独立した二次情報源（首里高校公式サイトの「受検心得」PDF等）と完全一致を確認済み
 * （2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const OKINAWA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'okinawa',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.okinawa.lg.jp/_res/projects/default_project/_page_/001/035/054/08nittei.pdf',
      docTitle: '令和8年度 沖縄県立学校入学者選抜 日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: 'Web出願期間', startDate: '2026-01-20', endDate: '2026-01-30', note: '連携型選抜・特色選抜・一般選抜共通' },
        { label: '出願書類受付・出願締切', startDate: '2026-02-02', endDate: '2026-02-03', note: '初回志願状況発表も2/3' },
        { label: '志願変更申し出', startDate: '2026-02-06', endDate: '2026-02-09' },
        { label: '志願変更取り下げ・再出願', startDate: '2026-02-16', endDate: '2026-02-17', note: '最終志願状況発表も2/17' },
        { label: '学力検査', startDate: '2026-03-04', endDate: '2026-03-05', note: '特別募集検査は3/5' },
        { label: '学力検査追検査', startDate: '2026-03-09' },
        { label: '合格発表', startDate: '2026-03-17' },
        { label: '2次募集願書受付', startDate: '2026-03-18', endDate: '2026-03-19' },
        { label: '2次募集面接', startDate: '2026-03-25', note: '午前' },
        { label: '2次募集合格発表', startDate: '2026-03-27' },
      ],
    },
  ],
};
