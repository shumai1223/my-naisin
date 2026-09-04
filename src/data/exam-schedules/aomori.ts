/**
 * 青森県 公立高等学校 入学者選抜日程（T-Y12・22県目）。
 *
 * 一次ソース: 青森県教育委員会「令和8年度青森県立高等学校（全日制の課程及び定時制の課程）
 * 入学者選抜要項」（令和7年8月29日公表）
 * https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/nyuugakusyasenbatsuyoukou2026.pdf
 *
 * ⚠️このPDFは88頁でToUnicode欠落があった（他県と同型のブロッカー）ため、目次で該当する
 * 項目（4 出願の手続/6 入学願書の受付/7 出願先変更の手続/10 学力検査等/11 追検査/13 合格者の
 * 発表/14 再募集/追検査取扱要項）のdoc内ページを特定した上でオフセット(+2)を実測しビジョン
 * 解析で全項目を本文から直接確認（yamaguchi/hiroshimaと同型の目次オフセット手法）。
 *
 * 全項目（学力検査日3/5・合格発表3/13・追検査3/11等）はWebSearchで得た2つの独立した二次情報源
 * （青森県高校受験情報サイト・学習塾ブログ）とも完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const AOMORI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'aomori',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/nyuugakusyasenbatsuyoukou2026.pdf',
      docTitle: '令和8年度青森県立高等学校（全日制の課程及び定時制の課程）入学者選抜要項',
      fetchedAt: '2026-09-04',
      events: [
        { label: '入学願書の受付期間', startDate: '2026-02-12', endDate: '2026-02-17', note: '受付時間9時〜16時(最終日は正午)・土日を除く' },
        { label: '出願先変更 受付期限', startDate: '2026-02-27' },
        { label: '学力検査等 検査実施日', startDate: '2026-03-05' },
        { label: '追検査実施日', startDate: '2026-03-11' },
        { label: '合格者の発表', startDate: '2026-03-13', note: '9時' },
        { label: '再募集 募集人員発表', startDate: '2026-03-13' },
        { label: '再募集入学願書 受付期間', startDate: '2026-03-16', note: '9時〜16時' },
        { label: '再募集 学力検査等 検査実施日', startDate: '2026-03-17' },
        { label: '再募集 合格者の発表', startDate: '2026-03-18', note: '13時' },
      ],
    },
  ],
};
