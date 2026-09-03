/**
 * 静岡県 公立高等学校 入学者選抜日程（T-Y12・10県目）。
 *
 * 一次ソース: 静岡県教育委員会「令和8年度 公立高校をめざすあなたへII」
 * I 令和8年度静岡県公立高等学校入学者選抜の流れ p1「1 一般選抜日程」「2 再募集日程」
 * https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8anatahe2-1-1.pdf
 * （掲載元ページ: https://www.pref.shizuoka.jp/kodomokyoiku/school/kyoiku/1003764/1003891/1072279.html）
 *
 * ⚠️このPDFは埋め込みフォントのToUnicodeマッピングが欠落しておりpdftotextでは本文が読めない
 * （tokyo/osaka/aichi/fukuoka等と同型のブロッカー）ため、pdftoppm 200dpiでレンダリングし
 * Read toolのビジョン解析でp1（1ページ目・目次を除く実質1ページ）を直接転記した。
 *
 * 学力検査日（3/4・3/5の2日間）はWebSearchで得た独立した二次情報源（各教科の検査問題公開
 * ページに明記の実施日）と突合し一致を確認済み（2026-09-04）。
 *
 * 静岡県は「1学校の1学科（科）に志願」＋「2つ以上の学科がある学校は志望順位を付けて併願可」
 * という他県にない併願制度を持つが、これは選抜方法自体の説明でありスケジュールの一部ではない
 * ため注記に留め、日程イベントとしては収録しない。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const SHIZUOKA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'shizuoka',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8anatahe2-1-1.pdf',
      docTitle: '令和8年度公立高校をめざすあなたへII「I 令和8年度静岡県公立高等学校入学者選抜の流れ」',
      fetchedAt: '2026-09-04',
      events: [
        { label: '願書受付', startDate: '2026-02-17', endDate: '2026-02-19', note: '2/19は正午まで' },
        { label: '志願変更受付', startDate: '2026-02-25', endDate: '2026-02-26', note: '2/26は正午まで' },
        { label: '学力検査・面接など', startDate: '2026-03-04', endDate: '2026-03-05' },
        { label: '追検査', startDate: '2026-03-10' },
        { label: '合格者発表', startDate: '2026-03-13', note: '正午以降' },
        { label: '再募集 実施校・募集定員発表', startDate: '2026-03-13', note: '午後4時以降' },
        { label: '再募集 願書受付', startDate: '2026-03-17', endDate: '2026-03-18', note: '午後2時まで' },
        { label: '再募集 面接，作文など', startDate: '2026-03-23' },
      ],
    },
  ],
};
