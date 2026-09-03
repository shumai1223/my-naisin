/**
 * 福島県 県立高等学校 入学者選抜日程（T-Y12・19県目）。
 *
 * 一次ソース: 福島県教育委員会「令和8年度福島県立高等学校入学者選抜関係日程」（カレンダー形式）
 * https://www.pref.fukushima.lg.jp/uploaded/attachment/706715.pdf
 * （掲載元ページ: https://www.pref.fukushima.lg.jp/site/edu/r8koukounyushi.html）
 *
 * ⚠️このPDFは1ページのカレンダー表でToUnicode欠落もビジョン解析で軽量に完了。
 *
 * ⚠️福島県は「前期選抜」（全校で実施・一般選抜と特色選抜の両方を含み全志願者が学力検査を
 * 受ける主選抜）と「後期選抜」（前期選抜で定員に満たなかった学校のみの二次募集）の2段階。
 * 名称の印象と異なり「前期」の方が主選抜（WebSearchで独立確認済み）。
 *
 * 前期選抜の学力検査（3/4）・選抜結果発表（3/16）はWebSearchで得た独立した二次情報源
 * （リセマム等）と突合し完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const FUKUSHIMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'fukushima',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/706715.pdf',
      docTitle: '令和8年度福島県立高等学校入学者選抜関係日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期選抜・連携型選抜 出願書類受付', startDate: '2026-02-04', endDate: '2026-02-06' },
        { label: '前期選抜・連携型選抜 出願先変更受付', startDate: '2026-02-09', endDate: '2026-02-13' },
        { label: '調査書提出', startDate: '2026-02-16', endDate: '2026-02-17' },
        { label: '前期選抜・連携型選抜 学力検査・面接等', startDate: '2026-03-04', endDate: '2026-03-06', note: '学力検査は3/4・面接等(一般面接・特色面接・連携型面接等)は3/4〜3/6' },
        { label: '追検査等', startDate: '2026-03-10', endDate: '2026-03-11' },
        { label: '前期選抜・連携型選抜 選抜結果発表', startDate: '2026-03-16', note: '13:00〜' },
        { label: '後期選抜 出願書類受付', startDate: '2026-03-17', endDate: '2026-03-18' },
        { label: '後期選抜 出願先変更受付', startDate: '2026-03-19' },
        { label: '後期選抜 面接等', startDate: '2026-03-24' },
        { label: '後期選抜 選抜結果発表', startDate: '2026-03-25' },
      ],
    },
  ],
};
