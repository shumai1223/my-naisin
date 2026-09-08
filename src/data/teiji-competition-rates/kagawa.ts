import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 香川県 定時制課程（T-Y11F §5順序#4・S1-3 B分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 香川県教育委員会「令和8年度香川県公立高等学校 一般選抜 出願者数」
 * （全2頁・既存の全日制`src/data/competition-rates/kagawa.ts`と同一PDF）2頁目下段
 * 「（11-3）定時制課程 小学科別」の全数表（一般選抜志願変更締切後・令和8年2月24日16:00現在）。
 *
 * ⚠️S1-3台帳の懸念「表のみへの言及で学校別詳細か集計のみか不明瞭」は誤りだったと判明した。
 * 実際は全日制と同型の学校別内訳表（9校12レコード）が独立して存在する。
 *
 * quotaは「入学定員－別日程定員留保数」列を採用（三木のみ入学定員40人中8人を別日程募集
 * （音楽科等の特別選抜）に留保しており、第1次募集の実質枠は32人。他11レコードは留保なしで
 * quota=入学定員=40と一致）。finalApplicantsは「出願者数」列（志願変更締切後の確定値）を
 * そのまま採用。finalRateは表に明記の「競争率」列＝finalApplicants÷quota。
 *
 * 機械集計（quota472・applicants76・倍率0.16、9校12レコード）が表末尾の「定時制合計」
 * 480(入学定員)/472(留保後)/76/0.16と完全一致した（入学定員の単純合計480とは別に、
 * quota基準の472が公式の競争率算定分母）。この頁はpdftotextで数字は抽出可能（日本語
 * ラベルのみ欠落）で、pdftoppm 150dpiのビジョン解析1回で学校名・学科名を判読できた。
 */

export const KAGAWA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kagawa',
  sources: [
    {
      url: 'https://www.pref.kagawa.lg.jp/documents/15096/syutugan8-3-2.pdf',
      docTitle: '香川県教育委員会 令和8年度香川県公立高等学校一般選抜出願者数（定時制課程小学科別・2頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程'],
    pendingDepartments: [],
    note: '2頁目「（11-3）定時制課程小学科別」の全12レコード（9校）を完全収録。',
  },
  records: [
    { schoolName: '小豆島中央', department: '普通', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '三本松', department: '普通', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '三木', department: '普通', quota: 32, finalApplicants: 10, finalRate: 0.31 },
    { schoolName: '高松', department: '普通', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '高松工芸', department: '工業（機械）', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '高松工芸', department: '工業（建築）', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '高松工芸', department: '工業（インテリア）', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '高松商業', department: '商業', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '丸亀', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '多度津', department: '工業（機械）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '多度津', department: '工業（電気）', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '観音寺第一', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
  ],
  officialSubtotals: [{ label: '定時制合計', quota: 472, finalApplicants: 76, finalRate: 0.16 }],
};
