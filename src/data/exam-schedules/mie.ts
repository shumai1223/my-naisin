/**
 * 三重県 公立高等学校 入学者選抜日程（T-Y12・39県目）。
 *
 * 一次ソース: 三重県教育委員会「令和8年度三重県立高等学校入学者選抜実施日程」（表紙裏面・1頁）
 * https://www.pref.mie.lg.jp/common/content/001220018.pdf
 *
 * このPDFはビジョン解析で一次ソースの表を直接転記できた。全日制課程（前期選抜・連携型中高一貫
 * 教育に係る選抜、後期選抜、追検査・再募集）を収録し、定時制課程の特別選抜・スポーツ特別枠選抜、
 * 通信制課程、県立特別支援学校は対象外。合格者発表は前期選抜・後期選抜とも同一日（3/17）に
 * 統一されている。
 *
 * 全項目はWebSearchで得た独立した二次情報源（リセマム）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const MIE_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'mie',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.mie.lg.jp/common/content/001220018.pdf',
      docTitle: '令和8年度三重県立高等学校入学者選抜実施日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期選抜等 出願書類受付', startDate: '2026-01-23', endDate: '2026-01-27', note: '前期選抜・連携型中高一貫教育に係る選抜・特別選抜共通' },
        { label: '前期選抜等 検査', startDate: '2026-02-03', endDate: '2026-02-04' },
        { label: '前期選抜等 追検査', startDate: '2026-02-10' },
        { label: '後期選抜 出願書類受付', startDate: '2026-02-24', endDate: '2026-02-26' },
        { label: '後期選抜 志願変更書類受付', startDate: '2026-03-03', endDate: '2026-03-05' },
        { label: '後期選抜 検査', startDate: '2026-03-10' },
        { label: '合格者発表', startDate: '2026-03-17', note: '前期選抜・連携型中高一貫教育に係る選抜・特別選抜も含む' },
        { label: '追検査・再募集 出願書類受付', startDate: '2026-03-18', endDate: '2026-03-19' },
        { label: '追検査・再募集 検査', startDate: '2026-03-23' },
        { label: '追検査・再募集 合格者発表', startDate: '2026-03-25' },
      ],
    },
  ],
};
