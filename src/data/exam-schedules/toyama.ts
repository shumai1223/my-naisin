/**
 * 富山県 公立高等学校 入学者選抜日程（T-Y12・26県目）。
 *
 * 一次ソース: 富山県教育委員会「令和8年度富山県立高等学校入学者選抜日程」（1頁の日程表PDF）
 * https://www.pref.toyama.jp/documents/47208/r8nittei.pdf
 *
 * このPDFはToUnicode欠落でpdftotextは数字しか抽出できなかったが、ビジョン解析で一次ソースの
 * 表を直接確認できた。全日制の課程（推薦・一般・第2次）のみを収録し、全国募集（推薦と同日程の
 * 別枠）・定時制の課程・通信制の課程は対象外。
 *
 * 一般の学力検査(3/5・3/6)・合格者の発表(3/13)はWebSearchで得た独立した二次情報源（地元学習塾
 * サイト）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const TOYAMA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'toyama',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.toyama.jp/documents/47208/r8nittei.pdf',
      docTitle: '令和8年度富山県立高等学校入学者選抜日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦 志願期間', startDate: '2026-01-30', endDate: '2026-02-03', note: '開始は午前9時・締切は正午' },
        { label: '推薦 面接等実施期日', startDate: '2026-02-09' },
        { label: '推薦 合格内定の通知', startDate: '2026-02-12', note: '午前10時' },
        { label: '推薦 合格者の発表', startDate: '2026-03-13', note: '午後0時30分' },
        { label: '一般 志願期間', startDate: '2026-02-19', endDate: '2026-02-24', note: '開始は午前9時・締切は正午' },
        { label: '一般 学力検査実施期日', startDate: '2026-03-05', endDate: '2026-03-06' },
        { label: '一般 追検査実施期日', startDate: '2026-03-10' },
        { label: '一般 合格者の発表', startDate: '2026-03-13', note: '午後0時30分' },
        { label: '第2次 志願期間', startDate: '2026-03-16', endDate: '2026-03-17', note: '開始は午前9時・締切は午後4時' },
        { label: '第2次 合格者の発表', startDate: '2026-03-19', note: '午後0時30分' },
      ],
    },
  ],
};
