/**
 * 大阪府 公立高等学校 入学者選抜日程（T-Y12・3県目）。
 *
 * 一次ソース: 大阪府教育委員会「令和8年度大阪府公立高等学校入学者選抜実施要項」第7 一般入学者選抜
 * https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_jisshiyoko.html
 * （本文PDF: https://www.pref.osaka.lg.jp/documents/118149/13_r08_ippan.pdf）
 *
 * ⚠️このPDFは埋め込みフォントのToUnicodeマッピングが欠落しておりpdftotextでは本文が読めない
 * （tokyo/hokkaido/aichi/miyazaki/yamaguchiと同じ構造的ブロッカー・T-Y11B段階2-a参照）ため、
 * pdftoppm 200dpiでレンダリングしRead toolのビジョン解析で該当ページ（p58-61）を直接転記した。
 *
 * 学力検査日（3/11）・合格発表日（3/19）はWebSearchで独立した二次情報源（塾業界メディア記事）と
 * 突合し一致を確認済み（2026-09-04）。
 *
 * 出願は「志願者による出願登録期間」（令和7年12月8日〜令和8年3月6日、オンライン出願システムでの
 * 長期の入力受付窓口）と、狭義の「志願先高等学校長による出願受理期間」（3月4日〜3月6日、学校側が
 * 受理する最終窓口）の2段構造。他県のような単純な「出願期間」1本ではないため、両方を別イベントとして
 * 収録する（公表資料の項目名をそのまま転記する原則を優先し独自に単純化しない）。
 *
 * 令和9年度（2027年度）分はまだ公表されていない（2026-09-04時点）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const OSAKA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'osaka',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.osaka.lg.jp/documents/118149/13_r08_ippan.pdf',
      docTitle: '令和8年度大阪府公立高等学校入学者選抜実施要項「第7 一般入学者選抜」',
      fetchedAt: '2026-09-04',
      events: [
        { label: '志願者による出願登録期間（志願者情報等の入力）', startDate: '2025-12-08', endDate: '2026-03-06', note: '入力期限は3/6 14:00' },
        { label: '志願先高等学校長による出願受理期間', startDate: '2026-03-04', endDate: '2026-03-06', note: '3/6 14:00まで' },
        { label: '学力検査', startDate: '2026-03-11', note: '9:00開始' },
        { label: '合格発表', startDate: '2026-03-19', note: '10:00' },
      ],
    },
  ],
};
