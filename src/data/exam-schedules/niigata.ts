/**
 * 新潟県 公立高等学校 入学者選抜日程（T-Y12・13県目）。
 *
 * 一次ソース: 新潟県教育委員会・新潟市教育委員会「令和8年度新潟県公立高等学校入学者選抜要項」
 * p2「令和8年度新潟県公立高等学校入学者選抜事務日程」（12月〜4月のカレンダー形式）
 * https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf
 *
 * ⚠️このPDFはToUnicode欠落があった（他県と同型のブロッカー）が、事務日程がp2に
 * カレンダー形式で集約されておりビジョン解析1ページで完了。
 *
 * 一般選抜の学力検査等本検査（3/4）・学校独自検査本検査（3/5）はWebSearchで得た独立した
 * 二次情報源（塾業界メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 新潟県は「特色化選抜」（2月・面接等中心）と「一般選抜」（3月・学力検査中心）の2段階選抜。
 * カレンダー上の事務日程には県外からの出願申請・海外帰国生徒等特別選抜・通信制課程等の
 * 詳細な締切も多数記載されていたが、本ファイルは主要な2トラックの核となるイベントのみを収録する。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const NIIGATA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'niigata',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf',
      docTitle: '令和8年度新潟県公立高等学校入学者選抜要項「入学者選抜事務日程」',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色化選抜 出願受付', startDate: '2026-01-30', endDate: '2026-02-03', note: '2/3は11:00まで' },
        { label: '特色化選抜 面接等実施日', startDate: '2026-02-09' },
        { label: '特色化選抜 結果通知', startDate: '2026-02-12', note: '10:00' },
        { label: '一般選抜 出願受付', startDate: '2026-02-16', endDate: '2026-02-18', note: '2/18は11:00まで' },
        { label: '一般選抜 志願変更受付', startDate: '2026-02-24', endDate: '2026-02-26', note: '2/26は11:00まで' },
        { label: '一般選抜 学力検査等（本検査）', startDate: '2026-03-04' },
        { label: '一般選抜 学校独自検査（本検査）', startDate: '2026-03-05', note: '実施校のみ・定時制の課程では本検査当日に実施' },
        { label: '一般選抜 合格者の発表', startDate: '2026-03-12', note: '午後' },
      ],
    },
  ],
};
