/**
 * 広島県 公立高等学校 入学者選抜日程（T-Y12・12県目）。
 *
 * 一次ソース: 広島県教育委員会「令和8年度広島県公立高等学校入学者選抜実施要項」
 * 「令和8年度広島県公立高等学校入学者選抜日程」（実施要項本文中の日程表・p21）
 * https://www.pref.hiroshima.lg.jp/uploaded/attachment/643216.pdf
 *
 * ⚠️このPDFは184頁・7.5MBの大冊子でToUnicode欠落があった（tokyo/osaka等と同型のブロッカー・
 * T-Y11B段階2-aでhiroshimaの倍率PDFでも同じ問題が確認済み）ため、pdftoppmでレンダリングし
 * Read toolのビジョン解析で該当ページを特定・転記した（目次で「令和8年度広島県公立高等学校
 * 入学者選抜日程」が本文page21と判明→PDFファイル内の実際のページ番号との対応をpage24を
 * 試し読みして6ページ分のオフセットを実測し、page27で正しく的中させた）。
 *
 * 学力検査・自己表現等（2/25-27）・合格者発表（3/9）はWebSearchで独立した二次情報源
 * （学チャン・リセマム等の教育系メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 「全日制の課程・定時制の課程・フレキシブル課程」の一次選抜（主要トラック）を収録。
 * 二次選抜（3月12日以降）・通信制課程・連携型中高一貫教育選抜は対象生徒数が少なく
 * スコープ外とする。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const HIROSHIMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'hiroshima',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/643216.pdf',
      docTitle: '令和8年度広島県公立高等学校入学者選抜日程（一次選抜・全日制／定時制／フレキシブル課程）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '出願登録（志願者登録・中学校確認登録）', startDate: '2026-01-22', endDate: '2026-02-03', note: '2/3は16時まで' },
        { label: '出願登録（高等学校確認登録）', startDate: '2026-02-04', endDate: '2026-02-09', note: '2/9は正午まで' },
        { label: '志願変更', startDate: '2026-02-12', endDate: '2026-02-18' },
        { label: '調査書等提出', startDate: '2026-02-12', endDate: '2026-02-19', note: '2/19は正午まで' },
        { label: '学力検査・自己表現等', startDate: '2026-02-25', endDate: '2026-02-27' },
        { label: '追検査', startDate: '2026-03-04' },
        { label: '合格者発表', startDate: '2026-03-09' },
      ],
    },
  ],
};
