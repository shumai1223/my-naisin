/**
 * 石川県 公立高等学校 入学者選抜日程（T-Y12・27県目）。
 *
 * 一次ソース: 石川県教育委員会「令和8年度石川県公立高等学校入学者募集要綱」内
 * 「令和8年度石川県公立高等学校（全日制・定時制・通信制）生徒募集に係る主たる日程」（p2の表）
 * https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r8bosyuyoko.pdf
 *
 * ⚠️このPDFはCIDフォントの言語パック欠落（Adobe-Japan1マッピング無し・akitaと同型の障害）で
 * p1はビジョン解析でも文字が描画されない可能性があったが、p2の日程表自体は正常にレンダリング
 * され問題なく転記できた。全日制の課程（一般入学・推薦入学及び連携型入学）のみを収録し、
 * 定時制の課程・通信制の課程は対象外。
 *
 * 一般入学の出願期間(2/18-24)・志願変更期間(2/27-3/3)・学力検査等(3/10-11)・合格発表(3/18正午)
 * はWebSearchで得た独立した二次情報源（地元学習塾サイト）と完全一致を確認済み（2026-09-04）。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const ISHIKAWA_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'ishikawa',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r8bosyuyoko.pdf',
      docTitle: '令和8年度石川県公立高等学校（全日制・定時制・通信制）生徒募集に係る主たる日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦入学及び連携型入学 入学願書受付', startDate: '2026-01-30', endDate: '2026-02-03', note: '締切は午後4時' },
        { label: '推薦入学及び連携型入学 面接', startDate: '2026-02-09' },
        { label: '推薦入学及び連携型入学 合格内定者数公表', startDate: '2026-02-13', note: '午前10時' },
        { label: '一般入学 入学願書受付', startDate: '2026-02-18', endDate: '2026-02-24', note: '締切は午後3時' },
        { label: '一般入学 志願変更期間', startDate: '2026-02-27', endDate: '2026-03-03', note: '締切は午後3時・特例措置による出願期間を含む' },
        { label: '一般入学 学力検査等', startDate: '2026-03-10', endDate: '2026-03-11', note: '10日は国語・理科・英語、11日は社会・数学' },
        { label: '合格者の発表', startDate: '2026-03-18', note: '正午・一般入学と推薦入学及び連携型入学とも共通' },
      ],
    },
  ],
};
