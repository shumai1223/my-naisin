/**
 * 秋田県 公立高等学校 入学者選抜日程（T-Y12・23県目）。
 *
 * 一次ソース: 秋田県教育委員会「令和8年度秋田県公立高等学校入学者選抜実施要項（PDF版）」
 * 内「令和8年度秋田県公立高等学校入学者選抜関係日程」（カレンダー形式の日程表・p2）
 * https://www.pref.akita.lg.jp/uploads/public/archive_0000091551_00/令和８年度秋田県公立高等学校入学者選抜実施要項_（PDF版）.pdf
 *
 * ⚠️このPDFはp1がCIDフォントの言語パック欠落（Adobe-Japan1マッピング無し）でビジョン解析でも
 * 完全に白紙表示になる罠だったが、p2の日程表自体は正常にレンダリングされ問題なく転記できた
 * （他県のToUnicode欠落とは異なる種類の障害だが対処は同じ＝諦めず次ページを試すこと）。
 *
 * 通信制の課程の日程（第一次/第二次・2/20〜3/31）は全日制と別トラックのため本収録では対象外。
 * 内部事務日程（学習成績一覧表提出・調査書提出等）も志願者に直接関係する日程ではないため除外。
 *
 * 学力検査(3/4)・合格発表(3/13)・2次募集の日程(3/19・3/24)はWebSearchで得た独立した二次情報源
 * （高校受験対策サイト）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const AKITA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'akita',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl:
        'https://www.pref.akita.lg.jp/uploads/public/archive_0000091551_00/%E4%BB%A4%E5%92%8C%EF%BC%98%E5%B9%B4%E5%BA%A6%E7%A7%8B%E7%94%B0%E7%9C%8C%E5%85%AC%E7%AB%8B%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E5%85%A5%E5%AD%A6%E8%80%85%E9%81%B8%E6%8A%9C%E5%AE%9F%E6%96%BD%E8%A6%81%E9%A0%85_%EF%BC%88PDF%E7%89%88%EF%BC%89.pdf',
      docTitle: '令和8年度秋田県公立高等学校入学者選抜関係日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '1次募集 出願期間', startDate: '2026-02-02', endDate: '2026-02-05', note: '開始は午前9時・締切は正午' },
        { label: '1次募集 志願先変更期間', startDate: '2026-02-09', endDate: '2026-02-12', note: '開始は午前9時・締切は正午' },
        { label: '1次募集 学力検査等実施日', startDate: '2026-03-04' },
        { label: '1次募集 学力追検査等実施日', startDate: '2026-03-10' },
        { label: '1次募集 合否通知', startDate: '2026-03-13' },
        { label: '2次募集 出願期間', startDate: '2026-03-16', endDate: '2026-03-17', note: '開始は午前9時・締切は午前11時' },
        { label: '2次募集 面接等実施日', startDate: '2026-03-19' },
        { label: '2次募集 合否通知', startDate: '2026-03-24' },
      ],
    },
  ],
};
