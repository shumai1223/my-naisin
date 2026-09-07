/**
 * 熊本県 県立高等学校 入学者選抜日程（T-Y12・16県目）。
 *
 * 一次ソース: 熊本県教育委員会「令和8年度（2026年度）熊本県立高等学校入学者選抜要項」
 * 「令和8年度（2026年度）入学者選抜の主な日程」（p2-3の日程表）
 * https://www.pref.kumamoto.jp/uploaded/life/244675_716277_misc.pdf
 *
 * ⚠️このPDFは69頁でToUnicode欠落があった（他県と同型のブロッカー）が、日程表自体はp2-3に
 * 集約されておりビジョン解析2ページで完了。
 *
 * 後期（一般）選抜実施日（3/4-5）・合格者発表（3/12）はWebSearchで得た独立した二次情報源
 * （リセマム等の教育系メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 熊本県は「前期（特色）選抜」（2月）と「後期（一般）選抜」（3月・2日間の検査で募集人員の
 * 大半を占める主選抜）の2段階選抜。後期選抜実施日は教科によって3/4・3/5に分かれる
 * （国・理・英・面接・作文＝3/4／社・数・実技検査・面接・作文＝3/5）。
 *
 * 令和9年度分（T-Y11F §5順序#2）: R8と同名の「令和9年度（2027年度）熊本県立高等学校
 * 入学者選抜要項」（https://www.pref.kumamoto.jp/uploaded/life/277880_875692_misc.pdf・
 * 74頁）を新規収録。R8は「主な日程」がp2-3に集約されていたが、R9はp2が前期（特色）選抜・
 * 中高一貫教育（連携型）選抜、p3が国際バカロレア選抜、p4が後期（一般）選抜・追検査という
 * 構成に変わっており、目次の前提を持たずp2から順に確認して該当ページを特定した。p4は
 * 一部フォント（Adobe-Japan1マッピング欠落）でpdftoppmが警告を出したが表自体は正常に
 * レンダリングされ問題なく転記できた。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const KUMAMOTO_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'kumamoto',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/244675_716277_misc.pdf',
      docTitle: '令和8年度（2026年度）入学者選抜の主な日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '前期（特色）選抜 出願期間', startDate: '2026-01-20', endDate: '2026-01-23', note: '1/23は正午まで' },
        { label: '前期（特色）選抜実施日', startDate: '2026-02-02' },
        { label: '前期（特色）選抜 合格者発表', startDate: '2026-03-12' },
        { label: '後期（一般）選抜 出願期間', startDate: '2026-02-12', endDate: '2026-02-17', note: '2/17は正午まで' },
        { label: '後期（一般）選抜 出願変更', startDate: '2026-02-18', endDate: '2026-02-20', note: '2/20は正午まで' },
        { label: '後期（一般）選抜実施日', startDate: '2026-03-04', endDate: '2026-03-05', note: '3/4は国・理・英・面接・作文／3/5は社・数・実技検査・面接・作文' },
        { label: '後期（一般）選抜 合格者発表', startDate: '2026-03-12' },
        { label: '追検査実施日', startDate: '2026-03-13' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/277880_875692_misc.pdf',
      docTitle: '令和9年度（2027年度）入学者選抜の主な日程',
      fetchedAt: '2026-09-08',
      events: [
        { label: '前期（特色）選抜 出願期間', startDate: '2027-01-20', endDate: '2027-01-25', note: '1/25は正午まで' },
        { label: '前期（特色）選抜実施日', startDate: '2027-02-02' },
        { label: '前期（特色）選抜 合格者発表', startDate: '2027-03-12' },
        { label: '後期（一般）選抜 出願期間', startDate: '2027-02-12', endDate: '2027-02-17', note: '2/17は正午まで' },
        { label: '後期（一般）選抜 出願変更', startDate: '2027-02-18', endDate: '2027-02-22', note: '2/22は正午まで' },
        { label: '後期（一般）選抜実施日', startDate: '2027-03-04', endDate: '2027-03-05', note: '3/4は国・理・英・面接・作文／3/5は社・数・実技検査・面接・作文' },
        { label: '後期（一般）選抜 合格者発表', startDate: '2027-03-12' },
        { label: '追検査実施日', startDate: '2027-03-12' },
      ],
    },
  ],
};
