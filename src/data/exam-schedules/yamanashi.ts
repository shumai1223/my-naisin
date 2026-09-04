/**
 * 山梨県 公立高等学校 入学者選抜日程（T-Y12・29県目）。
 *
 * 一次ソース: 山梨県教育委員会「令和8年度山梨県公立高等学校・山梨県立特別支援学校高等部
 * 入学者選抜実施要項」内「令和8年度公立高等学校入学者選抜日程」（カレンダー形式の日程表・p2）
 * https://www.pref.yamanashi.jp/documents/7061/r8zissiyokko.pdf
 *
 * このPDFはToUnicode欠落でpdftotextは全く抽出できなかったが、ビジョン解析（高解像度クロップで
 * 縦書きラベルの範囲を確認）で一次ソースの表を直接転記できた。全日制の課程（前期募集・後期募集・
 * 全日制再募集）のみを収録し、定時制の課程・通信制の課程・県外及び転入学志願者等の特別措置は
 * 対象外。
 *
 * 前期募集検査(1/29-30)・後期募集学力検査(3/4-5)・入学許可予定者発表(3/12)はWebSearchで得た
 * 独立した二次情報源と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const YAMANASHI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'yamanashi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.yamanashi.jp/documents/7061/r8zissiyokko.pdf',
      docTitle: '令和8年度公立高等学校入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期募集 出願期間', startDate: '2026-01-15', endDate: '2026-01-19' },
        { label: '前期募集 検査', startDate: '2026-01-29', endDate: '2026-01-30', note: '検査を1日で実施する場合は1/29に実施' },
        { label: '前期募集 内定', startDate: '2026-02-06' },
        { label: '後期募集 出願期間', startDate: '2026-02-17', endDate: '2026-02-19' },
        { label: '後期募集 志願変更期間', startDate: '2026-02-20', endDate: '2026-02-24' },
        { label: '後期募集 学力検査（全日制）', startDate: '2026-03-04', endDate: '2026-03-05' },
        { label: '追検査', startDate: '2026-03-10' },
        { label: '入学許可予定者発表', startDate: '2026-03-12' },
        { label: '全日制再募集検査', startDate: '2026-03-17' },
        { label: '全日制再募集入学許可予定者発表', startDate: '2026-03-19' },
      ],
    },
  ],
};
