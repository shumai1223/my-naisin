/**
 * 鹿児島県 公立高等学校 入学者選抜日程（T-Y12・45県目）。
 *
 * 一次ソース: 鹿児島県教育委員会「令和8年度鹿児島県公立高等学校入学者選抜実施要綱」内
 * 「令和8年度公立高等学校入学者選抜関係日程」（p2のカレンダー形式日程表）
 * https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/123883_20251205110513-1.pdf
 *
 * このPDFはテキストが正常に抽出でき本文を直接確認できた（矢印の始点・終点を高解像度クロップで
 * 精密確認）。推薦入学者選抜等（推薦・帰国生徒等特別・連携型中高一貫教育校）・一般入学者選抜・
 * 第二次入学者選抜の3トラックを収録し、楠隼高等学校入学者選抜（特別な選抜校）・開陽高等学校
 * 通信制課程は対象外。
 *
 * 一般入学者選抜の学力検査(3/4-5)・追加の選抜(3/10)・合格者発表(3/12)はWebSearchで得た独立した
 * 二次情報源（リセマム）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const KAGOSHIMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'kagoshima',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/123883_20251205110513-1.pdf',
      docTitle: '令和8年度公立高等学校入学者選抜関係日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦入学者選抜等 出願期間', startDate: '2026-01-20', endDate: '2026-01-26', note: '締切は正午必着・帰国生徒等特別・連携型中高一貫教育校を含む' },
        { label: '推薦入学者選抜等 検査', startDate: '2026-02-03', note: '面接・作文等' },
        { label: '推薦入学者選抜等 合格者内定', startDate: '2026-02-09' },
        { label: '一般入学者選抜 出願期間', startDate: '2026-02-05', endDate: '2026-02-12', note: '締切は正午必着' },
        { label: '一般入学者選抜 出願変更受付', startDate: '2026-02-16', endDate: '2026-02-20', note: '締切は正午必着' },
        { label: '一般入学者選抜 学力検査', startDate: '2026-03-04', endDate: '2026-03-05', note: '3/4は国語・理科・英語、3/5は社会・数学' },
        { label: '一般入学者選抜 追加の選抜', startDate: '2026-03-10' },
        { label: '一般入学者選抜 合格者発表', startDate: '2026-03-12', note: '午前11時以後' },
        { label: '第二次入学者選抜 願書提出', startDate: '2026-03-17', endDate: '2026-03-18', note: '締切は正午必着' },
        { label: '第二次入学者選抜 面接等実施', startDate: '2026-03-19' },
        { label: '第二次入学者選抜 合格者発表', startDate: '2026-03-23', note: '午後2時以後' },
      ],
    },
  ],
};
