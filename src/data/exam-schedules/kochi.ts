/**
 * 高知県 公立高等学校 入学者選抜日程（T-Y12・37県目）。
 *
 * 一次ソース: 高知県教育委員会「令和8年度 高知県公立高等学校入学者選抜の主な日程」
 * （カレンダー形式の日程表・1頁）
 * https://www.pref.kochi.lg.jp/doc/r8_koukounyushi_main/file_contents/r8_koukounyushi_nittei.pdf
 *
 * このPDFはビジョン解析で一次ソースの表を直接確認できた（矢印の範囲を高解像度クロップで精密に
 * 特定・A日程の検査実施日と志願先変更期間が隣接する月にまたがって配置されており誤読しやすい
 * ため、月ごとに分けてクロップし直して確認した）。こうちフロンティア募集・A日程・B日程・C日程の
 * 4トラックを収録。
 *
 * B日程の検査実施日(3/18)はWebSearchで得た独立した二次情報源と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const KOCHI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'kochi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r8_koukounyushi_main/file_contents/r8_koukounyushi_nittei.pdf',
      docTitle: '令和8年度 高知県公立高等学校入学者選抜の主な日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: 'こうちフロンティア募集 出願期間・調査書等提出期間', startDate: '2026-01-06', endDate: '2026-01-07', note: '1/7必着' },
        { label: 'こうちフロンティア募集 検査実施期間', startDate: '2026-01-15', endDate: '2026-01-21', note: 'このうち学校が定める日に実施' },
        { label: 'こうちフロンティア募集 合格発表', startDate: '2026-01-23' },
        { label: 'A日程 出願期間', startDate: '2026-01-28', endDate: '2026-01-29' },
        { label: 'A日程 志願先変更期間', startDate: '2026-02-03', endDate: '2026-02-05' },
        { label: 'A日程 調査書等提出期間', startDate: '2026-02-10' },
        { label: 'A日程 検査実施日', startDate: '2026-03-03', endDate: '2026-03-04' },
        { label: 'A日程 合格発表', startDate: '2026-03-12' },
        { label: 'B日程 出願期間・調査書等提出期間', startDate: '2026-03-14', endDate: '2026-03-15', note: '調査書等は3/17まで' },
        { label: 'B日程 志願先変更期間', startDate: '2026-03-17' },
        { label: 'B日程 検査実施日', startDate: '2026-03-18' },
        { label: 'B日程 合格発表', startDate: '2026-03-23' },
        { label: 'C日程 実施期間', startDate: '2026-03-24', endDate: '2026-03-25', note: '出願期間は3/25まで' },
        { label: 'C日程 合格発表', startDate: '2026-03-26', note: '3/26までに発表' },
      ],
    },
  ],
};
