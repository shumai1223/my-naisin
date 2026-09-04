/**
 * 奈良県 公立高等学校 入学者選抜日程（T-Y12・32県目）。
 *
 * 一次ソース: 奈良県教育委員会「令和8年度奈良県立高等学校入学者選抜の日程」（1頁のカレンダー
 * 形式日程表）
 * https://www.pref.nara.lg.jp/documents/18782/r8-nyuusinittei.pdf
 *
 * このPDFはToUnicode欠落だがビジョン解析で一次ソースの表を直接転記できた。全ての受検者が
 * 対象の一次選抜・二次選抜・追検査のみを収録し、特別選抜（全国募集特別選抜・インクルーシブ
 * 教育推進特別選抜・外国人及び帰国生徒特別選抜・成人特別選抜）・通信制課程選抜は対象外。
 *
 * 一次選抜の第一出願期間(2/16-24)・第二出願期間(2/25-3/2)・学力検査等(3/4)・学校独自検査(3/5)
 * はWebSearchで得た独立した二次情報源（リセマム）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const NARA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'nara',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.nara.lg.jp/documents/18782/r8-nyuusinittei.pdf',
      docTitle: '令和8年度奈良県立高等学校入学者選抜の日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '一次選抜 第一出願期間', startDate: '2026-02-16', endDate: '2026-02-24' },
        { label: '一次選抜 第二出願期間', startDate: '2026-02-25', endDate: '2026-03-02' },
        { label: '一次選抜 学力検査等', startDate: '2026-03-04' },
        { label: '一次選抜 学校独自検査', startDate: '2026-03-05' },
        { label: '一次選抜 合格発表', startDate: '2026-03-13' },
        { label: '追検査 学力検査', startDate: '2026-03-17', note: '追検査申請最終日は3/16' },
        { label: '追検査 合格発表', startDate: '2026-03-18' },
        { label: '二次選抜 出願期間', startDate: '2026-03-16', endDate: '2026-03-18' },
        { label: '二次選抜 学校独自検査', startDate: '2026-03-24' },
        { label: '二次選抜 合格発表', startDate: '2026-03-25' },
      ],
    },
  ],
};
