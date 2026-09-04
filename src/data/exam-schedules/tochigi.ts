/**
 * 栃木県 公立高等学校 入学者選抜日程（T-Y12・25県目）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度栃木県立高等学校入学者選抜関係諸日程」
 * （日程一覧版PDF・1頁）
 * https://www.pref.tochigi.lg.jp/m04/r08/documents/r08shonittei.pdf
 *
 * このPDFはpdftotextではToUnicode欠落で数字しか抽出できなかったが、ビジョン解析（フォント
 * 欠落エラーが出たものの本文自体は正常にレンダリングされた）で全項目を一次ソースから直接
 * 確認できた。全日制課程（特色選抜・一般選抜）のみを収録し、定時制課程（フレックス特別選抜・
 * 一般選抜）・通信制課程は別トラックのため対象外。
 *
 * 一般選抜の学力検査(3/5)・合格者発表(3/11)はWebSearchで得た独立した二次情報源（学習塾サイト）
 * と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const TOCHIGI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'tochigi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/r08shonittei.pdf',
      docTitle: '令和8（2026）年度栃木県立高等学校入学者選抜関係諸日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色選抜 願書等提出期間', startDate: '2026-01-29', endDate: '2026-01-30' },
        { label: '特色選抜 面接等', startDate: '2026-02-05', endDate: '2026-02-06', note: '一日で行う学校は2/5に実施' },
        { label: '特色選抜 合格者内定', startDate: '2026-02-12' },
        { label: '一般選抜 願書等提出期間', startDate: '2026-02-18', endDate: '2026-02-19' },
        { label: '一般選抜 出願変更期間', startDate: '2026-02-24', endDate: '2026-02-25' },
        { label: '一般選抜 受検票交付期間', startDate: '2026-02-26', endDate: '2026-02-27' },
        { label: '一般選抜 学力検査', startDate: '2026-03-05' },
        { label: '一般選抜 合格者発表', startDate: '2026-03-11' },
      ],
    },
  ],
};
