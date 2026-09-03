/**
 * 茨城県 公立高等学校 入学者選抜日程（T-Y12・1県目パイロット）。
 *
 * 一次ソース: 茨城県教育委員会「入学者選抜の日程」
 * https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/schedule2026/
 * （2026-09-04にWebFetchで内容確認・同日WebSearchで学力検査日2/26・合格者発表3/11を
 * 独立した二次情報源（塾選ジャーナル・やる気アシスト等の複数の教育系メディア記事）と突合し一致を確認）。
 *
 * ページタイトルは「令和8年度」の日程で、令和9年度（2027年度）分はこのURLにはまだ公表されて
 * いない（2026-09-04時点）。令和9年度分の公表を確認でき次第、追加すること。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const IBARAKI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'ibaraki',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/schedule2026/',
      docTitle: '入学者選抜の日程（茨城県教育委員会）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '志願者情報入力期間', startDate: '2026-01-07', endDate: '2026-01-28' },
        { label: '郵送出願受付', startDate: '2026-02-04', endDate: '2026-02-06' },
        { label: '一般入学出願期間', startDate: '2026-02-05', endDate: '2026-02-09' },
        { label: '志願先変更・転勤子女特例受付', startDate: '2026-02-16', endDate: '2026-02-17' },
        { label: '一般入学学力検査', startDate: '2026-02-26' },
        { label: '特色選抜・実技検査・連携型入学者選抜', startDate: '2026-02-27' },
        { label: '追検査（学力検査）', startDate: '2026-03-06' },
        { label: '追検査（実技検査等）', startDate: '2026-03-09' },
        { label: '合格者発表', startDate: '2026-03-11', note: '9:00' },
        { label: '第2次募集出願', startDate: '2026-03-12', endDate: '2026-03-13' },
        { label: '第2次学力検査', startDate: '2026-03-16' },
        { label: '第2次合格者発表', startDate: '2026-03-18', note: '9:00' },
      ],
    },
  ],
};
