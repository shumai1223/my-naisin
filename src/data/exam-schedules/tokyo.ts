/**
 * 東京都 都立高等学校 入学者選抜日程（T-Y12・47県目・全都道府県完了）。
 *
 * 一次ソース: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜の日程」（報道発表資料）
 * https://www.kyoiku.metro.tokyo.lg.jp/information/press/2025/05/2025052208
 *
 * このページはHTMLで正常に取得でき本文を直接確認できた（他県のPDF固有の障害は無し）。
 * 推薦に基づく選抜・学力検査に基づく選抜（第一次募集及び分割前期募集／分割後期募集及び全日制
 * 第二次募集／定時制第二次募集）を収録し、海外帰国生徒対象の選抜・在京外国人生徒等対象の選抜・
 * 通信制課程における選抜は対象外。
 *
 * 学力検査に基づく選抜（第一次募集）の実施日(2/21)・合格発表(3/2)はWebSearchで得た独立した
 * 二次情報源（リセマム）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const TOKYO_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'tokyo',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/information/press/2025/05/2025052208',
      docTitle: '令和8年度東京都立高等学校入学者選抜の日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦に基づく選抜 出願受付期間（書類提出）', startDate: '2026-01-09', endDate: '2026-01-16', note: '志願者情報入力は2025-12-19〜2026-01-16 17:00' },
        { label: '推薦に基づく選抜 実施日', startDate: '2026-01-26', endDate: '2026-01-27' },
        { label: '推薦に基づく選抜 合格発表', startDate: '2026-02-02' },
        { label: '学力検査に基づく選抜（第一次募集・分割前期募集） 出願受付期間（書類提出）', startDate: '2026-01-30', endDate: '2026-02-05', note: '志願者情報入力は2025-12-19〜2026-02-05 17:00' },
        { label: '学力検査に基づく選抜（第一次募集・分割前期募集） 実施日', startDate: '2026-02-21' },
        { label: '学力検査に基づく選抜（第一次募集・分割前期募集） 合格発表', startDate: '2026-03-02' },
        { label: '分割後期募集・全日制第二次募集 出願受付日', startDate: '2026-03-05' },
        { label: '分割後期募集・全日制第二次募集 実施日', startDate: '2026-03-10' },
        { label: '分割後期募集・全日制第二次募集 合格発表', startDate: '2026-03-13' },
        { label: '定時制第二次募集 出願受付日', startDate: '2026-03-23' },
        { label: '定時制第二次募集 実施日', startDate: '2026-03-26' },
        { label: '定時制第二次募集 合格発表', startDate: '2026-03-27' },
      ],
    },
  ],
};
