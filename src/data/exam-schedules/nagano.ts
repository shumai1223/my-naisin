/**
 * 長野県 県立高等学校 入学者選抜日程（T-Y12・15県目）。
 *
 * 一次ソース: 長野県教育委員会高校教育課「令和8年度長野県立高等学校入学者選抜の実施日程について（案）」
 * （令和6年11月定例教育委員会資料）
 * https://www.pref.nagano.lg.jp/kyoiku/kyoiku/goannai/shiryo/r6teireikai-shiryo/documents/1123_g4.pdf
 *
 * ⚠️このPDFは「（案）」表記だが、WebSearchで得た2026年入試直前の報道記事（リセマム等）の
 * 実測日程（志願受付2/25-27・志願変更3/2-5・選抜実施3/10・発表3/19）と完全一致したため、
 * 案のまま確定したことを確認済み（2026-09-04）。
 *
 * 長野県は前期選抜（2月）・後期選抜（3月）の2段階選抜。後期選抜が募集人員の大半を占める
 * 主選抜（全日制8,807人・報道記事実測）。追検査（3/16）による入学予定者発表は本検査と
 * 同日（3/19）にまとめて行われる。
 *
 * 【2026-09-07追記・令和9年度分を追加】「令和9年度長野県立高等学校入学者選抜の実施日程
 * について」（`r9_konittei.pdf`・1頁・PDF内蔵テキスト層でRead toolから直接抽出）を新規収録。
 * この文書自体が「令和8年度」列を併記しており、上記の令和8年度分の全項目（志願受付
 * 2/2-2/4・選抜実施2/9・発表2/18／志願受付2/25-2/27・志望変更3/2-3/5・選抜実施3/10・
 * 追検査3/16・発表3/19）と完全に一致することを一次資料側からも再確認できた。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const NAGANO_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'nagano',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.nagano.lg.jp/kyoiku/kyoiku/goannai/shiryo/r6teireikai-shiryo/documents/1123_g4.pdf',
      docTitle: '令和8年度長野県立高等学校入学者選抜の実施日程について',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期選抜 志願受付期間', startDate: '2026-02-02', endDate: '2026-02-04' },
        { label: '前期選抜 選抜実施日', startDate: '2026-02-09' },
        { label: '前期選抜 入学予定者の発表', startDate: '2026-02-18' },
        { label: '後期選抜 志願受付期間', startDate: '2026-02-25', endDate: '2026-02-27' },
        { label: '後期選抜 志望変更受付期間', startDate: '2026-03-02', endDate: '2026-03-05' },
        { label: '後期選抜 選抜実施日', startDate: '2026-03-10' },
        { label: '後期選抜 追検査実施日', startDate: '2026-03-16' },
        { label: '後期選抜 入学予定者の発表', startDate: '2026-03-19' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r9/documents/r9_konittei.pdf',
      docTitle: '令和9年度長野県立高等学校入学者選抜の実施日程について',
      fetchedAt: '2026-09-07',
      events: [
        { label: '前期選抜 志願受付期間', startDate: '2027-01-29', endDate: '2027-02-02' },
        { label: '前期選抜 選抜実施日', startDate: '2027-02-08' },
        { label: '前期選抜 入学予定者の発表', startDate: '2027-02-17' },
        { label: '後期選抜 志願受付期間', startDate: '2027-02-24', endDate: '2027-02-26' },
        { label: '後期選抜 志望変更受付期間', startDate: '2027-03-01', endDate: '2027-03-03' },
        { label: '後期選抜 選抜実施日', startDate: '2027-03-09' },
        { label: '後期選抜 追検査実施日', startDate: '2027-03-15' },
        { label: '後期選抜 入学予定者の発表', startDate: '2027-03-18' },
        { label: '後期選抜 追検査による入学予定者の発表', startDate: '2027-03-18' },
      ],
    },
  ],
};
