/**
 * 愛媛県 公立高等学校 入学者選抜日程（T-Y12・36県目）。
 *
 * 一次ソース: 愛媛県教育委員会「令和8年度愛媛県県立高等学校入学者選抜実施要項」（14頁）
 * https://ehime-kyoiku.esnet.ed.jp/file/2005
 *
 * このPDFはページ内テキストが正常に抽出でき（ToUnicode欠落なし）本文を直接確認できた。
 * 特色入学者選抜（第5）・一般入学者選抜（第3）・追検査（第4）の各章を収録し、定時制の課程の
 * 第2次募集（第6）は対象外。合格者の発表は特色入学者選抜・一般入学者選抜とも同一日（3/18）に
 * 統一されている点が特徴（特色入学者選抜は2/6-9に別途「合格内定」の通知がある）。
 *
 * 特色入学者選抜の検査(1/30)・一般入学者選抜の学力検査等(3/5-6)・合格者の発表(3/18)は
 * WebSearchで得た独立した二次情報源と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const EHIME_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'ehime',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://ehime-kyoiku.esnet.ed.jp/file/2005',
      docTitle: '令和8年度愛媛県県立高等学校入学者選抜実施要項',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色入学者選抜 出願期間', startDate: '2026-01-13', endDate: '2026-01-20', note: '締切は正午' },
        { label: '特色入学者選抜 検査', startDate: '2026-01-30' },
        { label: '特色入学者選抜 合格内定者の通知', startDate: '2026-02-06', endDate: '2026-02-09', note: '締切は正午' },
        { label: '一般入学者選抜 出願期間', startDate: '2026-02-09', endDate: '2026-02-16', note: '締切は正午' },
        { label: '一般入学者選抜 志願変更', startDate: '2026-02-17', endDate: '2026-02-25', note: '締切は正午' },
        { label: '一般入学者選抜 学力検査等', startDate: '2026-03-05', endDate: '2026-03-06', note: '面接は3/6' },
        { label: '追検査', startDate: '2026-03-13' },
        { label: '合格者の発表', startDate: '2026-03-18', note: '午前10時・特色入学者選抜と一般入学者選抜とも共通' },
      ],
    },
  ],
};
