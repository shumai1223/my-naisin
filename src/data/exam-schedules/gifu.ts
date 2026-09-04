/**
 * 岐阜県 公立高等学校 入学者選抜日程（T-Y12・30県目）。
 *
 * 一次ソース: 岐阜県教育委員会「令和8年度岐阜県立高等学校入学者選抜について」
 * （令和7年4月18日付 岐阜県発表資料・報道発表資料PDF）
 * https://www.pref.gifu.lg.jp/uploaded/attachment/444065.pdf
 *
 * ⚠️WebSearchが最初に提示したPDF URL（452405.pdf）は実在せずHTMLの404相当ページに
 * リダイレクトされる幻覚URLだった（既知の罠と同型）。プレスリリース掲載ページを
 * WebFetchで辿り直し、curl -Iで200 OKを確認してから正しいURLを採用した。
 *
 * このPDFはフォント欠落（Symbol/ArialUnicode）エラーが出たが本文自体は正常にレンダリング
 * され、ビジョン解析で一次ソースの本文から全項目を直接確認できた。第一次選抜・第二次選抜
 * （いずれも全日制・定時制の課程）のみを収録し、連携型選抜（第一次選抜と同一日程のため
 * 重複収録を避けた）・通信制の課程（日程未定）は対象外。
 *
 * 全項目はWebSearchで得た独立した二次情報源（地元学習塾サイト2件・教科別時間割まで一致）とも
 * 完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const GIFU_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'gifu',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.gifu.lg.jp/uploaded/attachment/444065.pdf',
      docTitle: '令和8年度岐阜県立高等学校入学者選抜について',
      fetchedAt: '2026-09-04',
      events: [
        { label: '第一次選抜 出願期間', startDate: '2026-02-06', endDate: '2026-02-12', note: '締切は正午' },
        { label: '第一次選抜 変更期間', startDate: '2026-02-13', endDate: '2026-02-17', note: '締切は正午' },
        { label: '第一次選抜 検査期日', startDate: '2026-03-04', note: '一部の高等学校では3/5にも実施' },
        { label: '第一次選抜 追検査期日', startDate: '2026-03-10', note: '一部の高等学校では3/11にも実施' },
        { label: '第一次選抜 合格発表・第二次選抜募集人員発表', startDate: '2026-03-13' },
        { label: '第二次選抜 出願期間', startDate: '2026-03-14', endDate: '2026-03-16' },
        { label: '第二次選抜 変更期日', startDate: '2026-03-17' },
        { label: '第二次選抜 検査期日', startDate: '2026-03-19' },
        { label: '第二次選抜 合格発表', startDate: '2026-03-24' },
      ],
    },
  ],
};
