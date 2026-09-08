/**
 * 徳島県 公立高等学校 入学者選抜日程（T-Y12・34県目）。
 *
 * 一次ソース: 徳島県教育委員会「令和8年度徳島県公立高等学校入学者選抜関係日程」
 * （カレンダー形式の日程表・画像ファイル）
 * https://nyuushi.tokushima-ec.ed.jp/file/215
 *
 * このファイルはPDFではなくJPEG画像として配信されていたが、Read toolでそのまま閲覧でき
 * 一次ソースの表を直接転記できた。育成型選抜・連携型選抜（同日程のため統合表記）・一般選抜・
 * 第2次募集選抜の全トラックを収録。
 *
 * 全項目はWebSearchで得た独立した二次情報源と完全一致を確認済み（2026-09-04）。
 *
 * ⚠️令和9年度分（T-Y11F §5順序#2）: 一次ソース「令和9年度徳島県公立高等学校入学者選抜関係
 * 日程」（PNG画像、`/R9_nittei`ページからリンク）
 * https://nyuushi.tokushima-ec.ed.jp/file/1893
 * R8と同じくカレンダー形式の画像で、Read toolでそのまま閲覧・転記できた。区分構成（育成型選抜・
 * 連携型選抜〈同日程のため統合表記〉・一般選抜・第2次募集選抜）はR8と同一。「一般選抜 志願変更」
 * は2/22・24・25の3日間で、間に挟まる2/23（天皇誕生日・振替含む祝日でグレー表示）は対象外
 * だったためnoteに明記した。独立した二次情報源（学習塾ブログ）と完全一致を確認済み
 * （2026-09-08）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const TOKUSHIMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'tokushima',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://nyuushi.tokushima-ec.ed.jp/file/215',
      docTitle: '令和8年度徳島県公立高等学校入学者選抜関係日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '育成型選抜・連携型選抜 願書受付', startDate: '2026-01-21', endDate: '2026-01-22' },
        { label: '育成型選抜・連携型選抜 検査', startDate: '2026-02-03' },
        { label: '育成型選抜・連携型選抜 結果通知', startDate: '2026-02-07' },
        { label: '一般選抜 願書受付', startDate: '2026-02-17', endDate: '2026-02-18' },
        { label: '一般選抜 志願変更', startDate: '2026-02-24', endDate: '2026-02-26' },
        { label: '一般選抜 学力検査', startDate: '2026-03-03' },
        { label: '一般選抜 面接等', startDate: '2026-03-04' },
        { label: '一般選抜 追検査・追面接', startDate: '2026-03-10' },
        { label: '一般選抜 結果通知', startDate: '2026-03-13' },
        { label: '第2次募集選抜 願書受付', startDate: '2026-03-18' },
        { label: '第2次募集選抜', startDate: '2026-03-25' },
        { label: '第2次募集選抜 結果通知', startDate: '2026-03-26' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://nyuushi.tokushima-ec.ed.jp/file/1893',
      docTitle: '令和9年度徳島県公立高等学校入学者選抜関係日程',
      fetchedAt: '2026-09-08',
      events: [
        { label: '育成型選抜・連携型選抜 願書受付', startDate: '2027-01-20', endDate: '2027-01-21' },
        { label: '育成型選抜・連携型選抜 検査', startDate: '2027-02-02' },
        { label: '育成型選抜・連携型選抜 結果通知', startDate: '2027-02-06' },
        { label: '一般選抜 願書受付', startDate: '2027-02-16', endDate: '2027-02-17' },
        { label: '一般選抜 志願変更', startDate: '2027-02-22', endDate: '2027-02-25', note: '2/22・24・25の3日間。間の2/23（天皇誕生日）は対象外' },
        { label: '一般選抜 学力検査', startDate: '2027-03-03' },
        { label: '一般選抜 面接等', startDate: '2027-03-04' },
        { label: '一般選抜 追検査・追面接', startDate: '2027-03-10' },
        { label: '一般選抜 結果通知', startDate: '2027-03-13' },
        { label: '第2次募集選抜 願書受付', startDate: '2027-03-18' },
        { label: '第2次募集選抜', startDate: '2027-03-25' },
        { label: '第2次募集選抜 結果通知', startDate: '2027-03-26' },
      ],
    },
  ],
};
