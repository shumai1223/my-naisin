/**
 * 群馬県 公立高等学校 入学者選抜日程（T-Y12・18県目）。
 *
 * 一次ソース: 群馬県教育委員会事務局高校教育課「令和8年度群馬県公立高校入試スケジュール」
 * （入試スケジュール・リーフレット）
 * https://www.pref.gunma.jp/uploaded/attachment/671260.pdf
 * （掲載元ページ: https://www.pref.gunma.jp/site/kyouiku/715449.html）
 *
 * ⚠️このPDFはToUnicode欠落があった（他県と同型のブロッカー）が1ページの図解リーフレットで
 * ビジョン解析は軽量に完了。
 *
 * 学力検査等実施（本検査2/19-20）・合格者発表（3/4）はWebSearchで得た独立した二次情報源
 * （塾業界メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 群馬県は志願先変更が2回に分かれる（第1回2/3-4・第2回2/6-10）珍しい設計。
 * Web出願システム(G-smart)関連の事前手続き（テストメール登録・写真撮影・志願者基本情報登録）は
 * 選抜そのものの日程ではないため収録しない。
 *
 * 令和9年度分（T-Y11F §5順序#2）: 「令和9年度県立学校入学者選抜日程について」
 * （https://www.pref.gunma.jp/site/kyouiku/742234.html・更新日2026年2月12日）を新規収録。
 * このページはPDF添付ではなくHTML本文に直接テーブルが書かれており、curlで取得した生HTMLから
 * 直接転記した（ビジョン解析不要）。全日制課程選抜・フレックススクール選抜・定時制課程選抜・
 * 連携型選抜が共通の日程を持つ点、志願先変更が2回に分かれる点はR8と同じ構造。R8には無かった
 * 「本検査は定時制課程選抜のみ1日のみ実施」という注記が明記されていたためnoteに残した。
 * 再募集・定時制課程追加募集・通信制課程選抜・県立中等教育学校/特別支援学校の選抜日程は
 * R8と同じ方針で対象外（全日制の主選抜のみを収録するスコープを継続）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const GUNMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'gunma',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/671260.pdf',
      docTitle: '令和8年度群馬県公立高校入試スケジュール',
      fetchedAt: '2026-09-04',
      events: [
        { label: '出願期間（志願情報登録）', startDate: '2026-01-05', endDate: '2026-01-30' },
        { label: '志願先変更期間（第1回）', startDate: '2026-02-03', endDate: '2026-02-04' },
        { label: '志願先変更期間（第2回）', startDate: '2026-02-06', endDate: '2026-02-10' },
        { label: '学力検査等実施（本検査）', startDate: '2026-02-19', endDate: '2026-02-20' },
        { label: '学力検査等実施（追検査）', startDate: '2026-02-26' },
        { label: '合格者発表', startDate: '2026-03-04' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.gunma.jp/site/kyouiku/742234.html',
      docTitle: '令和9年度県立学校入学者選抜日程について',
      fetchedAt: '2026-09-08',
      events: [
        { label: '出願期間（志願情報登録）', startDate: '2027-01-04', endDate: '2027-01-29' },
        { label: '志願先変更期間（第1回）', startDate: '2027-02-02', endDate: '2027-02-03' },
        { label: '志願先変更期間（第2回）', startDate: '2027-02-05', endDate: '2027-02-08' },
        { label: '学力検査等実施（本検査）', startDate: '2027-02-16', endDate: '2027-02-17', note: '定時制課程選抜は2/16のみに実施' },
        { label: '学力検査等実施（追検査）', startDate: '2027-02-24' },
        { label: '合格者発表', startDate: '2027-03-03' },
      ],
    },
  ],
};
