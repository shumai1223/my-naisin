/**
 * 宮城県 県立高等学校 入学者選抜日程（T-Y12・14県目）。
 *
 * 一次ソース: 宮城県教育庁高校教育課「令和8年度宮城県立高等学校入学者選抜方針及び日程等について」
 * （記者発表資料・令和6年12月18日付）
 * https://www.pref.miyagi.jp/documents/55375/1218r8nyuusisenbatuhousintonittei.pdf
 * （掲載元ページ: https://www.pref.miyagi.jp/soshiki/kyou-kikaku/happyou241218-3.html）
 *
 * ⚠️このPDFはToUnicode欠落だったがビジョン解析3ページで完了。ただし本PDFに掲載されているのは
 * 「第一次募集：実施日・追試験日・合格発表日」の3項目のみで、出願期間・志願変更期間は
 * 記載がなかった。WebSearchで2つの独立記事を確認したところ「出願期間2/9-2/13」
 * 「基本情報登録期間1/19-2/13正午」と**内容が食い違っており**、2026年度から導入された
 * Web出願システムの新方式のためどちらが正確か一次ソースで確認できなかった。
 * **捏造ゼロ原則により、出願期間・志願変更期間は収録せず、確実な3項目のみを収録する。**
 *
 * 実施日（3/4）・合格発表日（3/16）はWebSearchで得た独立した二次情報源（塾業界メディア記事）
 * と突合し完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const MIYAGI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'miyagi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.miyagi.jp/documents/55375/1218r8nyuusisenbatuhousintonittei.pdf',
      docTitle: '令和8年度宮城県立高等学校入学者選抜方針及び日程等について（第一次募集）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '実施日', startDate: '2026-03-04' },
        { label: '追試験日', startDate: '2026-03-10' },
        { label: '合格発表日', startDate: '2026-03-16' },
      ],
    },
  ],
};
