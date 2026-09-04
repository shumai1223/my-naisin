/**
 * 島根県 公立高等学校 入学者選抜日程（T-Y12・41県目）。
 *
 * 一次ソース: 島根県教育委員会・松江市教育委員会「令和8年度島根県公立高等学校入学者選抜実施要綱」
 * 内「令和8年度島根県公立高等学校 入学者選抜関係日程表」（p2のカレンダー形式日程表）
 * https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/R8_youkou0113.pdf
 *
 * ⚠️WebSearchが最初に提示したPDF URL（R07_kouritsukoutougakkounyuushi.data配下）は実在せず
 * 404だった（既知の罠と同型）。一覧ページを直接WebFetchし正しいディレクトリ（index.data配下）
 * を取得したうえでcurl -Iで200確認してから採用した。このPDFはフォント警告が出たが本文自体は
 * 正常にレンダリングされビジョン解析で問題なく転記できた。
 *
 * 特色選抜・一般選抜・第2次募集の3トラックを収録し、通信制課程・地域認定願・志願変更特別措置
 * 等の内部事務手続きは対象外。
 *
 * 一般選抜の学力検査等(3/4-5)・合格発表(3/13)はWebSearchで得た独立した二次情報源と完全一致を
 * 確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const SHIMANE_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'shimane',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/R8_youkou0113.pdf',
      docTitle: '令和8年度島根県公立高等学校 入学者選抜関係日程表',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色選抜 願書受付期間', startDate: '2026-01-07', endDate: '2026-01-09', note: '締切は17:00' },
        { label: '特色選抜 学力検査日', startDate: '2026-01-21', note: '教育委員会作成の学力検査を実施する学校のみ' },
        { label: '特色選抜 合格内定通知', startDate: '2026-01-29' },
        { label: '一般選抜 出願期間', startDate: '2026-02-04', endDate: '2026-02-05', note: '締切は12:00' },
        { label: '一般選抜 志願変更受付期間', startDate: '2026-02-10', endDate: '2026-02-16', note: '出願先・志願変更先とも含む' },
        { label: '一般選抜 学力検査', startDate: '2026-03-04', note: '国語・数学・社会・英語・理科' },
        { label: '一般選抜 面接等', startDate: '2026-03-05' },
        { label: '一般選抜 追検査', startDate: '2026-03-10' },
        { label: '一般選抜等 合格発表', startDate: '2026-03-13', note: '第2次募集実施校公表も同日10:00' },
        { label: '第2次募集 願書受付期間', startDate: '2026-03-16', endDate: '2026-03-17', note: '締切は15:00' },
        { label: '第2次募集 作文・面接検査等', startDate: '2026-03-19' },
        { label: '第2次募集 合格発表', startDate: '2026-03-24', note: '15:00' },
      ],
    },
  ],
};
