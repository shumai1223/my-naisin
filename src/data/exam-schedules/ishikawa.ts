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
 *
 * 令和9年度分（T-Y11F §5順序#2）: R8と同型の「募集要綱」はまだ公表されていない（公式ページに
 * 「全日制及び定時制高等学校の募集要綱は11月下旬に配付」と明記）。代わりに石川県公報 号外
 * 第39号（令和8年6月5日）「令和9年度石川県公立高等学校...における入学者選抜方針」
 * （https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r9housin.pdf・6頁・
 * `<Crypt>`フィルタ関連の警告があったがpdftoppm+visionで問題なく転記できた）に「2 日程」として
 * 具体的な日付が明記されていたためこれを一次資料として採用した。ラベルは既存R8エントリに
 * 揃えたが、推薦入学の選考結果通知はこの資料では「選考結果通知」（R8募集要綱の「合格内定者数
 * 公表」とは別表現）と呼ばれているためそのまま転記した。全日制・定時制共通の日程のみ収録し、
 * 通信制課程・特別支援学校・金沢錦丘中学校はR8と同じ方針で対象外。
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
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r9housin.pdf',
      docTitle: '令和9年度石川県公立高等学校、石川県立特別支援学校及び石川県立金沢錦丘中学校における入学者選抜方針',
      fetchedAt: '2026-09-08',
      events: [
        { label: '推薦入学及び連携型入学 入学願書受付', startDate: '2027-01-28', endDate: '2027-02-01' },
        { label: '推薦入学及び連携型入学 面接', startDate: '2027-02-08' },
        { label: '推薦入学及び連携型入学 選考結果通知', startDate: '2027-02-12' },
        { label: '一般入学 入学願書受付', startDate: '2027-02-16', endDate: '2027-02-19' },
        { label: '一般入学 志願変更期間', startDate: '2027-02-25', endDate: '2027-03-01', note: '特例出願期間も同一' },
        { label: '一般入学 学力検査等', startDate: '2027-03-09', endDate: '2027-03-10', note: '全日制課程は3/9及び3/10、定時制課程は3/9のみ実施' },
        { label: '合格者の発表', startDate: '2027-03-17', note: '正午・一般入学と推薦入学及び連携型入学とも共通' },
      ],
    },
  ],
};
