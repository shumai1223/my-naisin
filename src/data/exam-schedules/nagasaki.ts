/**
 * 長崎県 公立高等学校 入学者選抜日程（T-Y12・42県目）。
 *
 * 一次ソース: 長崎県教育委員会「令和8年度長崎県公立高等学校入学者選抜実施要領」内
 * 「令和8年度入学者選抜の主な日程」（p2の概要表）
 * https://www.pref.nagasaki.jp/uploads/2025/09/1757565086.pdf
 *
 * ⚠️WebSearchが最初に提示したページURLは404、続いて提示したPDF URLも存在しないドメイン
 * （nagasaki.lg.jp・既知の罠と同型のURL幻覚）だった。正しいドメイン（www.pref.nagasaki.jp）を
 * 試したところ200 OKで取得できた。このPDFはテキストが正常に抽出でき本文を直接確認できた。
 *
 * 全日制課程・定時制課程昼間部の特別選抜（美術・離島・工科等特別選抜）・一般選抜・チャレンジ
 * 選抜を収録し、定時制課程Ⅰ期・Ⅱ期選抜（昼間部を除く）・通信制課程は対象外。
 *
 * チャレンジ選抜の検査(3/12)はWebSearchで得た独立した二次情報源と完全一致を確認済み
 * （2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const NAGASAKI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'nagasaki',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.nagasaki.jp/uploads/2025/09/1757565086.pdf',
      docTitle: '令和8年度入学者選抜の主な日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特別選抜 入学願書受付', startDate: '2026-01-13', endDate: '2026-01-19', note: '締切は15:00・美術/離島/工科等特別選抜' },
        { label: '特別選抜 検査', startDate: '2026-01-27' },
        { label: '特別選抜 合格者発表', startDate: '2026-01-30', note: '14:00' },
        { label: '一般選抜 入学願書受付', startDate: '2026-02-02', endDate: '2026-02-06', note: '締切は15:00' },
        { label: '一般選抜 学力検査', startDate: '2026-02-17', endDate: '2026-02-18', note: '連携型中高一貫教育に係る検査(作文等)は2/17のみ・追検査は3/3' },
        { label: '一般選抜 合格者発表', startDate: '2026-03-05', note: '14:00・追検査含む' },
        { label: 'チャレンジ選抜 入学願書受付', startDate: '2026-03-06', endDate: '2026-03-10', note: '締切は15:00' },
        { label: 'チャレンジ選抜 検査', startDate: '2026-03-12' },
        { label: 'チャレンジ選抜 合格者発表', startDate: '2026-03-17', note: '9:30' },
      ],
    },
  ],
};
