/**
 * 岩手県 県立高等学校 入学者選抜日程（T-Y12・20県目）。
 *
 * 一次ソース: 岩手県教育委員会「令和8年度入学者選抜日程」
 * https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/1074139.html
 *
 * ⚠️このページには一次募集（一般入試・特色入試）と二次募集の本検査日・追検査日・合格者発表日
 * のみが掲載されており、出願期間・志願変更期間・面接日の記載が無かった。WebSearchでも
 * 出願期間を確認できる独立ソースが見つからなかったため、Y-0捏造ゼロ原則により
 * 確実な項目のみを収録し、出願期間は書かない（miyagiと同型の判断）。
 *
 * 一次募集の学力検査（3/4-5）・二次募集の検査日（3/24）はWebSearchで得た独立した二次情報源
 * と突合し完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const IWATE_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'iwate',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/1074139.html',
      docTitle: '令和8年度岩手県立高等学校入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '一次募集（一般入試・特色入試） 本検査', startDate: '2026-03-04', endDate: '2026-03-05' },
        { label: '一次募集（一般入試・特色入試） 追検査', startDate: '2026-03-10', endDate: '2026-03-11' },
        { label: '一次募集（一般入試・特色入試） 合格者発表', startDate: '2026-03-16' },
        { label: '二次募集 検査日', startDate: '2026-03-24' },
        { label: '二次募集 合格者発表', startDate: '2026-03-26' },
      ],
    },
  ],
};
