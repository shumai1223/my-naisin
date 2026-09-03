/**
 * 京都府 公立高等学校 入学者選抜日程（T-Y12・11県目）。
 *
 * 一次ソース: 京都府教育委員会「令和8年度京都府公立高等学校入学者選抜について（選抜の概要・広報資料）」
 * （令和7年8月28日付）p1「1 全日制、定時制 (1) 日程」
 * https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/08/002（広報資料）公立高等学校入学者選抜について.pdf
 *
 * ⚠️このPDFは埋め込みフォントのToUnicodeマッピングが欠落しておりpdftotextでは本文が読めない
 * （tokyo/osaka/aichi等と同型のブロッカー）ため、pdftoppm 200dpiでレンダリングしRead toolの
 * ビジョン解析でp1を直接転記した。
 *
 * 中期選抜の学力検査(3/6)・合格発表(3/17)はWebSearchで得た独立した二次情報源（塾業界メディア記事）
 * と突合し完全一致を確認済み（2026-09-04）。
 *
 * 京都府は前期選抜・中期選抜・後期選抜の3段階選抜が特徴（他県のような単一選抜ではない）。
 * 願書受付は「地域ごとに設定する会場での一括受付日」＋「志望校への直接提出日」の複数日にまたがるが、
 * 単一の期間として startDate〜endDate で収録する（内訳は出典PDFを参照）。
 * 定員100%を前期選抜で募集する学科等以外は前期選抜が実施されないため、多くの受験生の実質的な
 * 主選抜は中期選抜になる。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const KYOTO_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'kyoto',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/08/002（広報資料）公立高等学校入学者選抜について.pdf',
      docTitle: '令和8年度京都府公立高等学校入学者選抜について（選抜の概要）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期選抜 願書受付', startDate: '2026-02-03', endDate: '2026-02-05' },
        { label: '前期選抜 学力検査等', startDate: '2026-02-16', endDate: '2026-02-17', note: '共通学力検査は2/16 9:20〜12:40' },
        { label: '前期選抜 合格発表', startDate: '2026-02-24' },
        { label: '中期選抜 願書受付', startDate: '2026-02-26', endDate: '2026-03-03' },
        { label: '中期選抜 学力検査等', startDate: '2026-03-06' },
        { label: '中期選抜 合格発表', startDate: '2026-03-17' },
        { label: '後期選抜 願書受付', startDate: '2026-03-18', endDate: '2026-03-19' },
        { label: '後期選抜 学力検査等', startDate: '2026-03-24' },
        { label: '後期選抜 合格発表', startDate: '2026-03-26' },
      ],
    },
  ],
};
