/**
 * 愛知県 公立高等学校 入学者選抜日程（T-Y12・6県目）。
 *
 * 一次ソース: 愛知県教育委員会「令和8年度愛知県公立高等学校入学者選抜実施日程について」
 * （報告事項・令和6年11月13日高等学校教育課）
 * https://www.pref.aichi.jp/uploaded/attachment/540176.pdf
 * （掲載元ページ: https://www.pref.aichi.jp/soshiki/kotogakko/r8nyugakusyasenbatsu.html）
 *
 * ⚠️このPDFは埋め込みフォントのToUnicodeマッピングが欠落しておりpdftotextでは本文が読めない
 * （tokyo/hokkaido/osaka/saitamaと同型のブロッカー・T-Y11B段階2-aでaichi自体も
 * 倍率PDFで同じ問題が確認済み＝同じ発注元のPDF生成パイプラインの可能性）。
 * pdftoppm 200dpiでレンダリングしRead toolのビジョン解析で該当ページ（p2-4）を直接転記した。
 *
 * 一般選抜の学力検査日（2/25）・合格発表日（3/10）はWebSearchで独立した二次情報源
 * （リセマム・進研ゼミ高校入試情報サイト等）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 愛知県は選抜区分が「推薦選抜」「特色選抜」「一般選抜」等に分かれ日程も別々（他県のような
 * 単一の「一般入学者選抜」1本ではない）。本ファイルは主要な志願者数を占める「一般選抜」
 * （全日制課程(6)）を中心に、参考として「推薦選抜」（同(2)）も収録する。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const AICHI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'aichi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.aichi.jp/uploaded/attachment/540176.pdf',
      docTitle: '令和8年度愛知県公立高等学校入学者選抜実施日程について（別紙・案）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦選抜 出願期間', startDate: '2026-01-26', endDate: '2026-02-02' },
        { label: '推薦選抜 面接実施期日', startDate: '2026-02-05', endDate: '2026-02-06', note: '2/6は音楽科等の特別検査がある場合のみ実施' },
        { label: '推薦選抜 合格発表期日', startDate: '2026-02-09' },
        { label: '一般選抜 出願期間', startDate: '2026-02-06', endDate: '2026-02-16' },
        { label: '一般選抜 志願変更期日', startDate: '2026-02-17' },
        { label: '一般選抜 学力検査実施期日', startDate: '2026-02-25' },
        { label: '一般選抜 面接実施期日（Aグループ）', startDate: '2026-02-26' },
        { label: '一般選抜 面接実施期日（Bグループ）', startDate: '2026-02-27' },
        { label: '一般選抜 合格発表期日', startDate: '2026-03-10' },
      ],
    },
  ],
};
