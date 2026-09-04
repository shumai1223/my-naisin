/**
 * 鳥取県 公立高等学校 入学者選抜日程（T-Y12・33県目）。
 *
 * 一次ソース: 鳥取県教育委員会「令和8年度鳥取県立高等学校入学者選抜実施日程表（全日制・定時制）」
 * https://www.pref.tottori.lg.jp/secure/1405970/p.03.pdf
 *
 * このPDFはToUnicode欠落だがビジョン解析で一次ソースの表を直接転記できた（学校間の事務提出
 * 期限等の内部手続き行は除き、志願者に直接関係する出願・検査・発表日のみを収録）。
 *
 * 特色入学者選抜(検査2/3)・一般入学者選抜(出願2/16-18・検査3/5-6・合格発表3/16)・再募集
 * 入学者選抜(出願3/19-23・検査3/25・合格発表3/26)はWebSearchで得た独立した二次情報源
 * （リセマム）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const TOTTORI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'tottori',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.tottori.lg.jp/secure/1405970/p.03.pdf',
      docTitle: '令和8年度鳥取県立高等学校入学者選抜実施日程表（全日制・定時制）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色入学者選抜 出願期間', startDate: '2026-01-26', endDate: '2026-01-27' },
        { label: '特色入学者選抜 検査', startDate: '2026-02-03' },
        { label: '特色入学者選抜 合格発表', startDate: '2026-02-10' },
        { label: '一般入学者選抜 出願期間', startDate: '2026-02-16', endDate: '2026-02-18' },
        { label: '一般入学者選抜 志願変更期間', startDate: '2026-02-20', endDate: '2026-02-24' },
        { label: '一般入学者選抜 検査', startDate: '2026-03-05', endDate: '2026-03-06' },
        { label: '一般入学者選抜 追検査', startDate: '2026-03-11' },
        { label: '一般入学者選抜 合格発表', startDate: '2026-03-16' },
        { label: '再募集入学者選抜 出願期間', startDate: '2026-03-19', endDate: '2026-03-23' },
        { label: '再募集入学者選抜 検査', startDate: '2026-03-25' },
        { label: '再募集入学者選抜 合格発表', startDate: '2026-03-26' },
      ],
    },
  ],
};
