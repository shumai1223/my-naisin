/**
 * 宮崎県 公立高等学校 入学者選抜日程（T-Y12・44県目）。
 *
 * 一次ソース: 宮崎県教育委員会「令和8年度宮崎県立高等学校入学者選抜に関する日程（12月～4月）」
 * （1頁のカレンダー形式日程表）
 * https://www.pref.miyazaki.lg.jp/documents/99874/99874_20250707194459-1.pdf
 *
 * このPDFはテキストが正常に抽出でき本文を直接確認できた。推薦・連携型、帰国・外国人生徒等
 * 入学者選抜・一般入学者選抜・二次募集の3トラックを収録し、通信制課程・学区外高等学校入学志願
 * 許可願等の内部手続きは対象外。合格者発表は一般入学者選抜・推薦連携型帰国外国人選抜とも同一日
 * （3/17）に統一されている。
 *
 * 推薦・連携型等の検査(2/4)・合格内定通知(2/12)・合格者発表(3/17)はWebSearchで得た独立した
 * 二次情報源と完全一致を確認済み（2026-09-04）。
 *
 * 令和9年度分（T-Y11F §5順序#2）: 「令和9年度県立高等学校生徒募集（令和9年春入学生）に
 * ついて」（https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/
 * 20260519170532.html・更新日2026年8月6日）の本文「5.入学者選抜日程、その他」を
 * curl取得の生HTMLから直接転記（ビジョン解析不要）。同ページには「実施細目」
 * （出願期間等の詳細を含む文書）が「令和8年10月上旬発表予定」と明記されており、
 * まだ公表されていないため入学願書受付期間・志願変更受付期間はR9では収録しない
 * （Y-0）。R8にあった「二次募集 願書受付期間」も同じ理由で対象外。通信制課程は
 * R8と同じ方針で引き続き対象外。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const MIYAZAKI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'miyazaki',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.miyazaki.lg.jp/documents/99874/99874_20250707194459-1.pdf',
      docTitle: '令和8年度宮崎県立高等学校入学者選抜に関する日程（12月～4月）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦・連携型等 入学願書受付期間', startDate: '2026-01-22', endDate: '2026-01-26', note: '推薦・連携型、帰国・外国人生徒等入学者選抜' },
        { label: '推薦・連携型等 検査', startDate: '2026-02-04' },
        { label: '推薦・連携型等 合格内定通知', startDate: '2026-02-12' },
        { label: '一般入学者選抜 入学願書受付期間', startDate: '2026-02-16', endDate: '2026-02-18' },
        { label: '一般入学者選抜 志願変更受付期間', startDate: '2026-02-20', endDate: '2026-02-24' },
        { label: '一般入学者選抜 学力検査', startDate: '2026-03-04' },
        { label: '一般入学者選抜 学力検査・面接', startDate: '2026-03-05' },
        { label: '一般入学者選抜 追検査', startDate: '2026-03-10' },
        { label: '合格者発表', startDate: '2026-03-17', note: '一般入学者選抜・推薦連携型帰国外国人生徒等選抜とも共通' },
        { label: '二次募集 願書受付期間', startDate: '2026-03-18', endDate: '2026-03-19' },
        { label: '二次募集 入学者選抜検査', startDate: '2026-03-23' },
        { label: '二次募集 合格者発表', startDate: '2026-03-24' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20260519170532.html',
      docTitle: '令和9年度県立高等学校生徒募集（令和9年春入学生）について',
      fetchedAt: '2026-09-08',
      events: [
        { label: '推薦・連携型等 検査', startDate: '2027-02-03' },
        { label: '推薦・連携型等 合格内定通知', startDate: '2027-02-12' },
        { label: '一般入学者選抜 学力検査', startDate: '2027-03-03', endDate: '2027-03-04' },
        { label: '一般入学者選抜 追検査', startDate: '2027-03-10' },
        { label: '合格者発表', startDate: '2027-03-17', note: '一般入学者選抜・推薦連携型帰国外国人生徒等選抜とも共通' },
        { label: '二次募集 入学者選抜検査', startDate: '2027-03-23' },
        { label: '二次募集 合格者発表', startDate: '2027-03-24' },
      ],
    },
  ],
};
