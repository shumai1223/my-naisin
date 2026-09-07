/**
 * 佐賀県 公立高等学校 入学者選抜日程（T-Y12・38県目）。
 *
 * 一次ソース: 佐賀県教育委員会「令和8年度佐賀県立高等学校入学者選抜実施要項」内
 * 「令和8年度佐賀県立高等学校入学者選抜実施日程の概要」（p2の概要表）
 * https://www.pref.saga.lg.jp/kyouiku/kiji003115881/3_115881_367555_up_pqkdtzi7.pdf
 *
 * ⚠️WebSearchが最初に提示したPDF URL（kiji003106438配下）は実在せず404だった（既知の罠と
 * 同型・別ページのWebFetch要約も同じ404 URLをそのまま再提示した二次的な誤りだった）。実施要項
 * ページ（kiji003115881）を直接WebFetchしPDFの相対パスを取得したうえでcurl -Iで200確認して
 * から正しいURLを採用した。このPDF自体は108頁・23MBの大部だが、p2に日程概要表が独立して
 * まとまっており容易に転記できた。
 *
 * 特別選抜（全日制課程のみ）・一般選抜（全日制課程及び定時制課程）・再募集の3トラックを収録し、
 * 通信制課程・併設型中高一貫教育校における選抜は対象外。
 *
 * 全項目はWebSearchで得た独立した二次情報源（リセマム）と完全一致を確認済み（2026-09-04）。
 *
 * 令和9年度分（T-Y11F §5順序#2）: 「令和9年度佐賀県立高等学校入学者の選抜実施日程を
 * お知らせします」（令和8年4月28日付・報道資料・1頁・ToUnicode欠落だが英数字は
 * pdftotextで抽出可・日本語部分はpdftoppm+visionで転記）を新規収録。R8の108頁の
 * 実施要項とは別に、日程だけを先行公表する1頁の報道資料が存在した（本文に「入学選抜
 * 内容の詳細については、9月に公表を予定している『実施要項』でお知らせします」と明記）。
 * 特別選抜（全日制のみ）・一般選抜（全日制及び定時制）・再募集の3トラックはR8と同じ
 * 構造。佐賀北高等学校通信制（前期・後期）はR8と同じ方針で対象外。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const SAGA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'saga',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.saga.lg.jp/kyouiku/kiji003115881/3_115881_367555_up_pqkdtzi7.pdf',
      docTitle: '令和8年度佐賀県立高等学校入学者選抜実施日程の概要',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特別選抜 出願期間', startDate: '2026-01-27', endDate: '2026-01-28' },
        { label: '特別選抜 学力検査等', startDate: '2026-02-03' },
        { label: '特別選抜 合格者発表', startDate: '2026-02-09' },
        { label: '一般選抜 出願期間', startDate: '2026-02-16', endDate: '2026-02-17' },
        { label: '一般選抜 志願変更期間', startDate: '2026-02-20', endDate: '2026-02-24' },
        { label: '一般選抜 志願変更届', startDate: '2026-02-25' },
        { label: '一般選抜 学力検査等', startDate: '2026-03-03', endDate: '2026-03-04' },
        { label: '一般選抜 追検査等', startDate: '2026-03-09' },
        { label: '一般選抜 合格者発表', startDate: '2026-03-11' },
        { label: '再募集 出願期間', startDate: '2026-03-12', endDate: '2026-03-13' },
        { label: '再募集 面接等', startDate: '2026-03-17' },
        { label: '再募集 合格者発表', startDate: '2026-03-18' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.saga.lg.jp/kyouiku/kiji003119218/3_119218_389544_up_7eamtra8.pdf',
      docTitle: '令和9年度佐賀県立高等学校入学者の選抜実施日程をお知らせします',
      fetchedAt: '2026-09-08',
      events: [
        { label: '特別選抜 出願期間', startDate: '2027-01-26', endDate: '2027-01-27' },
        { label: '特別選抜 学力検査等', startDate: '2027-02-02' },
        { label: '特別選抜 合格者発表', startDate: '2027-02-08' },
        { label: '一般選抜 出願期間', startDate: '2027-02-15', endDate: '2027-02-16' },
        { label: '一般選抜 志願変更期間', startDate: '2027-02-19', endDate: '2027-02-22' },
        { label: '一般選抜 志願変更届', startDate: '2027-02-24' },
        { label: '一般選抜 学力検査等', startDate: '2027-03-02', endDate: '2027-03-03' },
        { label: '一般選抜 追検査等', startDate: '2027-03-08' },
        { label: '一般選抜 合格者発表', startDate: '2027-03-10' },
        { label: '再募集 出願期間', startDate: '2027-03-11', endDate: '2027-03-12' },
        { label: '再募集 面接等', startDate: '2027-03-16' },
        { label: '再募集 合格者発表', startDate: '2027-03-17' },
      ],
    },
  ],
};
