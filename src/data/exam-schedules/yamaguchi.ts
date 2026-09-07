/**
 * 山口県 公立高等学校 入学者選抜日程（T-Y12・21県目）。
 *
 * 一次ソース: 山口県教育委員会「令和8年度山口県公立高等学校入学者選抜実施要領（抄）」
 * 「入学者選抜関係日程等」（p17-18のカレンダー形式表）
 * https://www.pref.yamaguchi.lg.jp/uploaded/attachment/221844.pdf
 *
 * ⚠️このPDFは54頁でToUnicode欠落があった（他県と同型のブロッカー・T-Y11B段階2-aで
 * yamaguchiの倍率PDFでも同じ問題が確認済みの県）ため、目次で「入学者選抜関係日程等」が
 * 本文page17と特定した上でオフセット(+2)を実測しビジョン解析で的中（hiroshimaと同型の
 * 目次オフセット手法）。
 *
 * 第一次募集の学力検査(3/5)・合格発表(3/12)はWebSearchで得た独立した二次情報源（塾業界
 * メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 山口県は令和8年度から推薦入学が廃止され「特色選抜」（中学校長の推薦不要）に変更された点が
 * 特徴（WebSearchで確認）。特色選抜（1月出願・2月選抜）＋第一次募集（2月出願・3月選抜・
 * 主選抜）＋第二次募集（3月・二次募集）の3トラックを収録。
 *
 * 【2026-09-07追記・令和9年度分を追加】§5順序#1（exam-system側）で既に取得済みだった
 * 「令和9年度山口県公立高等学校入学者選抜実施大綱」（`353652_683067_misc.pdf`・6頁・
 * 埋め込みテキスト層でRead toolから直接抽出）を本タスクでも再利用。令和8年度分の一次ソースは
 * 実施要領抄内のカレンダー表だったが、令和9年度分は実施大綱本体（章立て文章形式）のため
 * 文書の型が異なる。ただし記載内容は同一の3トラック構造（特色選抜／第一次募集／第二次募集）
 * で完全に対応しており、項目名も実質同一のため令和8年度分と同じラベル構成で転記した。
 * なお実施大綱には「特色選抜の合格者は第一次募集の合格者発表(3/16)にあわせて発表する」旨の
 * 追記があるが、これは第一次募集 合格者発表及び通知のイベントと同日のため独立イベント化していない
 * （令和8年度分の収録方針を踏襲）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const YAMAGUCHI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'yamaguchi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.yamaguchi.lg.jp/uploaded/attachment/221844.pdf',
      docTitle: '令和8年度山口県公立高等学校入学者選抜「入学者選抜関係日程等」',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色選抜 出願期間', startDate: '2026-01-21', endDate: '2026-01-28', note: '1/28は午前10時まで' },
        { label: '特色選抜 面接等', startDate: '2026-02-04' },
        { label: '特色選抜 結果通知', startDate: '2026-02-12', note: '午前10時以降' },
        { label: '第一次募集 出願期間', startDate: '2026-02-13', endDate: '2026-02-24', note: '2/24は午前10時まで' },
        { label: '第一次募集 学力検査，面接等', startDate: '2026-03-05' },
        { label: '第一次募集 合格者発表及び通知', startDate: '2026-03-12', note: '午前10時' },
        { label: '第二次募集 出願期間', startDate: '2026-03-13', endDate: '2026-03-18', note: '3/18は午後2時まで' },
        { label: '第二次募集 面接等', startDate: '2026-03-23' },
        { label: '第二次募集 合格者発表及び通知', startDate: '2026-03-24', note: '正午' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.yamaguchi.lg.jp/uploaded/life/353652_683067_misc.pdf',
      docTitle: '令和9年度山口県公立高等学校入学者選抜実施大綱',
      fetchedAt: '2026-09-07',
      events: [
        { label: '特色選抜 出願期間', startDate: '2027-01-26', endDate: '2027-02-02', note: '2/2は午前10時まで' },
        { label: '特色選抜 面接等', startDate: '2027-02-09' },
        { label: '特色選抜 結果通知', startDate: '2027-02-16', note: '午前10時以降' },
        { label: '第一次募集 出願期間', startDate: '2027-02-17', endDate: '2027-02-25', note: '2/25は午前10時まで' },
        { label: '第一次募集 学力検査，面接等', startDate: '2027-03-09' },
        { label: '第一次募集 合格者発表及び通知', startDate: '2027-03-16', note: '午前10時' },
        { label: '第二次募集 出願期間', startDate: '2027-03-17', endDate: '2027-03-19', note: '3/19は午後2時まで' },
        { label: '第二次募集 面接等', startDate: '2027-03-24' },
        { label: '第二次募集 合格者発表及び通知', startDate: '2027-03-25', note: '正午' },
      ],
    },
  ],
};
