/**
 * 神奈川県 公立高等学校 入学者選抜日程（T-Y12・5県目）。
 *
 * 一次ソース: 神奈川県「令和9年度神奈川県公立高等学校の入学者の募集及び選抜の主な日程等について」
 * https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/r9/r9nyusen-nittei.html
 * （詳細PDF: https://www.pref.kanagawa.jp/documents/134086/r9nittei_1.pdf）
 *
 * ⚠️他県と異なり令和8年度（2026年度）分のページは既にexpiredで404（教委が年度ごとにディレクトリを
 * 作り替え旧年度を消す前科どおり・T-Y11B「年度スナップショットのR5遡り」の教訓と同型）。
 * 一方で令和9年度（2027年度）分は2026年5月時点で既に公表されておりWebFetchで直接読めた
 * （神奈川県は他県より早期に翌年度日程を公表する運用）。よって本ファイルは他県より1年進んだ
 * 令和9年度分から収録を開始する。
 *
 * 共通検査(2/16)・合格者発表(2/26)はWebSearchで独立した二次情報源（リセマム・複数の教育系
 * メディア記事）と突合し完全一致を確認済み（2026-09-04）。
 *
 * 掲載元ページには「共通選抜」の他に「定通分割選抜」（定時制・通信制の二次募集相当）と
 * 「海洋科学高等学校専攻科」（1校のみの専攻科・R8秋実施）も記載されていたが、他県の
 * 「全日制の一般選抜」相当に対応するのは「共通選抜」のみのため、本ファイルは共通選抜のみを収録する
 * （公表資料の項目名はそのまま転記・独自の言い換えはしない）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const KANAGAWA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'kanagawa',
  years: [
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/r9/r9nyusen-nittei.html',
      docTitle: '令和9年度神奈川県公立高等学校の入学者の募集及び選抜の主な日程等について（共通選抜）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '志願情報申請期間', startDate: '2027-01-25', endDate: '2027-01-29' },
        { label: '中学校長承認期間', startDate: '2027-01-25', endDate: '2027-02-01' },
        { label: '志願変更情報申請期間', startDate: '2027-02-04', endDate: '2027-02-08' },
        { label: '志願変更中学校長承認期間', startDate: '2027-02-04', endDate: '2027-02-09' },
        { label: '共通検査（学力検査等）実施', startDate: '2027-02-16' },
        { label: '特色検査及び面接実施', startDate: '2027-02-16', endDate: '2027-02-18' },
        { label: '追検査実施', startDate: '2027-02-22' },
        { label: '合格者発表', startDate: '2027-02-26' },
      ],
    },
  ],
};
