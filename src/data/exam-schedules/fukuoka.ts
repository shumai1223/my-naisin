/**
 * 福岡県 県立高等学校 入学者選抜日程（T-Y12・8県目）。
 *
 * 一次ソース: 福岡県教育委員会「令和8年度福岡県立高等学校入学者選抜要項」p2の日程表
 * （推薦入学者選抜・特色化選抜・連携型選抜に関する日程表／一般入学者選抜に関する日程表）
 * https://www.pref.fukuoka.lg.jp/uploaded/attachment/268332.pdf
 *
 * ⚠️このPDFは92頁で埋め込みフォントのToUnicodeマッピングが欠落しており（tokyo/osaka/aichi等と
 * 同型・T-Y11B段階2-aでfukuokaの倍率PDFでも同じ問題が確認済み）pdftotextでは数字しか抽出できない
 * （日本語ラベルが全て欠落）ため、pdftoppm 200dpiでレンダリングしRead toolのビジョン解析で
 * p2（日程表2種）を直接転記した。
 *
 * 一般入学者選抜の志願受付(2/9-20)・志願先変更受付(2/24-27)・学力検査(3/10)・合格発表(3/19)は
 * WebSearchで得た独立した二次情報源（塾業界メディア記事）と全項目が完全一致することを確認済み
 * （2026-09-04）。
 *
 * 福岡県は「推薦入学者選抜・特色化選抜・連携型選抜」と「一般入学者選抜」の2本立てで、
 * 前者は選考結果通知（2/9）と合格発表（3/19）が別イベントとして分かれている点が他県と異なる
 * （項目名はそのまま転記・独自の言い換えはしない）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const FUKUOKA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'fukuoka',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/uploaded/attachment/268332.pdf',
      docTitle: '令和8年度福岡県立高等学校入学者選抜要項（日程表）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦・特色化・連携型選抜 志願受付', startDate: '2026-01-21', endDate: '2026-01-29', note: '1/29は正午まで' },
        { label: '推薦・特色化・連携型選抜 面接，作文，実技試験', startDate: '2026-02-03', endDate: '2026-02-04' },
        { label: '推薦・特色化・連携型選抜 選考結果通知', startDate: '2026-02-09', note: '9:00' },
        { label: '推薦・特色化・連携型選抜 合格発表', startDate: '2026-03-19', note: '9:00' },
        { label: '一般入学者選抜 志願受付', startDate: '2026-02-09', endDate: '2026-02-20', note: '2/20は正午まで' },
        { label: '一般入学者選抜 志願先変更受付', startDate: '2026-02-24', endDate: '2026-02-27', note: '2/27は正午まで' },
        { label: '一般入学者選抜 学力検査', startDate: '2026-03-10' },
        { label: '一般入学者選抜 合格発表', startDate: '2026-03-19', note: '9:00' },
      ],
    },
  ],
};
