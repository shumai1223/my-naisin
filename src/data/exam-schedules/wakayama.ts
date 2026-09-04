/**
 * 和歌山県 公立高等学校 入学者選抜日程（T-Y12・40県目）。
 *
 * 一次ソース: 和歌山県教育委員会「令和8年度和歌山県立高等学校入学者選抜日程」（1頁）
 * https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08nittei.pdf
 *
 * このPDFはテキストが正常に抽出でき本文を直接確認できた。特色化選抜・一般選抜・スポーツ推薦・
 * 追募集の全トラックを収録。
 *
 * 一般選抜の学力検査(3/10)・面接実技検査等(3/11)・合格発表(3/18)はWebSearchで得た独立した
 * 二次情報源（リセマム）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const WAKAYAMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'wakayama',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08nittei.pdf',
      docTitle: '令和8年度和歌山県立高等学校入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色化選抜 出願受付', startDate: '2026-01-22' },
        { label: '特色化選抜 面接等', startDate: '2026-01-29' },
        { label: '特色化選抜 合格内定', startDate: '2026-02-06' },
        { label: '一般選抜・スポーツ推薦 一般出願受付', startDate: '2026-02-16' },
        { label: '一般選抜・スポーツ推薦 本出願受付', startDate: '2026-02-25', endDate: '2026-02-26' },
        { label: '一般選抜・スポーツ推薦 学力検査', startDate: '2026-03-10' },
        { label: '一般選抜・スポーツ推薦 面接、実技検査等', startDate: '2026-03-11' },
        { label: '一般選抜・スポーツ推薦 合格発表', startDate: '2026-03-18' },
        { label: '追募集 出願受付', startDate: '2026-03-24' },
        { label: '追募集 学力検査等', startDate: '2026-03-26' },
        { label: '追募集 合格発表', startDate: '2026-03-30' },
      ],
    },
  ],
};
