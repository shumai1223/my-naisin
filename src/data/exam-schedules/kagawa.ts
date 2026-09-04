/**
 * 香川県 公立高等学校 入学者選抜日程（T-Y12・35県目）。
 *
 * 一次ソース: 香川県教育委員会・高松市教育委員会「令和8年度香川県公立高等学校入学者選抜
 * 実施細目」（92頁）
 * https://www.pref.kagawa.lg.jp/documents/15096/saimoku8.pdf
 *
 * ⚠️WebSearchが最初に提示したURL（documents/15088/saimoku8.pdf）は実在せず404だった
 * （既知の罠と同型）。curl -Iで200確認してから正しいURL（documents/15096）を採用した。
 * このPDFはToUnicode欠落でpdftotextは使えなかったが、ビジョン解析で目的の各章（VI〜XIII）を
 * 直接確認し全項目を一次ソース本文から転記した。
 *
 * 自己推薦選抜は入学願書登録・受付期間と合格発表のみを収録（検査実施日は本文中に明記された
 * 具体的な日付が見当たらず、捏造を避けるため未収録）。一般選抜は志願変更・学力検査・適性検査・
 * 面接・追検査・合格発表まで全項目を収録。
 *
 * 一般選抜の学力検査(3/10)・適性検査(3/11)・追学力検査(3/14)・追適性検査(3/15)・合格発表(3/19)
 * はWebSearchで得た独立した二次情報源と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const KAGAWA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'kagawa',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.kagawa.lg.jp/documents/15096/saimoku8.pdf',
      docTitle: '令和8年度香川県公立高等学校入学者選抜実施細目',
      fetchedAt: '2026-09-04',
      events: [
        { label: '自己推薦選抜 入学願書登録期間', startDate: '2025-12-19', endDate: '2026-01-21', note: '締切は16:00' },
        { label: '自己推薦選抜 入学願書受付期間', startDate: '2026-01-22', endDate: '2026-01-23', note: '締切は16:00' },
        { label: '自己推薦選抜 合格発表', startDate: '2026-02-10', note: '9:30' },
        { label: '一般選抜 入学願書登録期間', startDate: '2025-12-19', endDate: '2026-02-13', note: '締切は16:00' },
        { label: '一般選抜 入学願書受付期間', startDate: '2026-02-16', endDate: '2026-02-17', note: '締切は16:00' },
        { label: '一般選抜 志願変更受付期間', startDate: '2026-02-19', endDate: '2026-02-24', note: '締切は16:00' },
        { label: '一般選抜 学力検査', startDate: '2026-03-10' },
        { label: '一般選抜 適性検査・面接', startDate: '2026-03-11', note: '美術科等適性検査・音楽科適性検査・面接とも同日' },
        { label: '一般選抜 追検査（学力検査）', startDate: '2026-03-14' },
        { label: '一般選抜 追検査（適性検査）', startDate: '2026-03-15' },
        { label: '一般選抜 合格発表', startDate: '2026-03-19', note: '9:30' },
      ],
    },
  ],
};
