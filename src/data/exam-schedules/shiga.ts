/**
 * 滋賀県 公立高等学校 入学者選抜日程（T-Y12・31県目）。
 *
 * 一次ソース: 滋賀県教育委員会「令和8年度滋賀県立高等学校入学者選抜要項について」
 * （R8選抜要項概要・主な日程を含む・1頁）
 * https://www.pref.shiga.lg.jp/file/attachment/5545806.pdf
 *
 * このPDFはフォント欠落（Adobe-Japan1言語パック無し・akitaと同型の障害）だったが、
 * ビジョン解析で一次ソースの表を直接転記できた。全日制・定時制の課程（一次募集・二次募集）の
 * みを収録し、全国募集枠（信楽・伊香・虎姫高等学校の特別出願）・通信制の課程（大津清陵高等学校）
 * は対象外。令和8年度から従来の2月・3月の2回選抜が一本化され、全員が学力検査を受ける「一般型
 * 選抜」＋希望者が受ける「学校独自型選抜」の新制度に変更された点が特徴。⚠️このPDFには出願期間の
 * 記載が無く（「主な日程」という表題どおり検査・発表日のみに絞られた資料のため）、出願期間は
 * 収録していない。
 *
 * 一般型選抜（学力検査・2/25）はWebSearchで得た独立した二次情報源（リセマム）と完全一致を
 * 確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const SHIGA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'shiga',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.shiga.lg.jp/file/attachment/5545806.pdf',
      docTitle: '令和8年度滋賀県立高等学校入学者選抜要項について',
      fetchedAt: '2026-09-04',
      events: [
        { label: '一次募集 一般型選抜（学力検査）', startDate: '2026-02-25' },
        { label: '一次募集 学校独自型選抜（学校独自検査）', startDate: '2026-02-26' },
        { label: '一次募集 追検査（学力検査）', startDate: '2026-03-01' },
        { label: '一次募集 追検査（学校独自検査）', startDate: '2026-03-02' },
        { label: '一次募集 入学許可予定者の発表', startDate: '2026-03-09' },
        { label: '二次募集検査', startDate: '2026-03-16' },
        { label: '二次募集 入学許可予定者の発表', startDate: '2026-03-18' },
      ],
    },
  ],
};
