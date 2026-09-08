import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 石川県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 石川県教育委員会「令和8年度石川県公立高等学校一般入学（定時制）の出願状況
 * （3月23日）」（全1頁）。全日制`src/data/competition-rates/ishikawa.ts`の収集元
 * （2月24日発表の3頁PDF）とは別の、定時制専用の独立した選抜スケジュール（3月25日学力検査等・
 * 3月27日合格発表）に基づく資料。
 * https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260323.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、「6校10学科」の完全な学校別内訳
 * （加賀聖城・小松北[夜間部/午前部/午後部]・金沢中央[夜間部/午前部/午後部]・羽松・七尾城北・
 * 輪島）が独立して存在する。石川県定時制は「夜間制」と「昼間制（午前部・午後部の2部制）」の
 * 2区分があり、資料は各校の区分ごとに小計・県全体の夜間制計/昼間制計/総計まで4段階の集計行を
 * 持つ（三重県と同型の高信頼度設計）。
 *
 * quotaは「募集定員(A)」列、finalApplicantsは「出願者数(B)」列、finalRateは「出願倍率
 * (B/A)」列（印字済み値をそのまま採用）。機械集計（quota480・applicants236、6校10レコード）が
 * 「総計」480/236/0.49と、区分別小計（小松北120/57/0.48・金沢中央200/134/0.67・夜間制
 * 200/46/0.23・昼間制280/190/0.68）の全てと完全一致した（初回転記で一致・再修正なし）。
 * この頁はpdftotextで数字は抽出可能（日本語ラベルは全欠落・罫線構造も複雑なため誤読の危険が
 * あった）、pdftoppm 200dpiのビジョン解析1回で全10レコードを判読した。
 */

export const ISHIKAWA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'ishikawa',
  sources: [
    {
      url: 'https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260323.pdf',
      docTitle: '石川県教育委員会 令和8年度石川県公立高等学校一般入学（定時制）の出願状況（3月23日）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制（夜間制・昼間制）'],
    pendingDepartments: [],
    note: '定時制専用PDFの全10レコード（6校）を完全収録。',
  },
  records: [
    { schoolName: '加賀聖城', department: '普通（夜間部）', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '小松北', department: '普通（夜間部）', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '小松北', department: '普通（午前部）', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '小松北', department: '普通（午後部）', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '金沢中央', department: '総合学科（夜間部）', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '金沢中央', department: '総合学科（午前部）', quota: 80, finalApplicants: 55, finalRate: 0.69 },
    { schoolName: '金沢中央', department: '総合学科（午後部）', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '羽松', department: '普通（午前部）', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '七尾城北', department: '普通（夜間部）', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '輪島', department: '普通（夜間部）', quota: 40, finalApplicants: 1, finalRate: 0.03 },
  ],
  officialSubtotals: [
    { label: '小松北　小計', schoolCount: 1, quota: 120, finalApplicants: 57, finalRate: 0.48 },
    { label: '金沢中央　小計', schoolCount: 1, quota: 200, finalApplicants: 134, finalRate: 0.67 },
    { label: '夜間制', quota: 200, finalApplicants: 46, finalRate: 0.23 },
    { label: '昼間制', quota: 280, finalApplicants: 190, finalRate: 0.68 },
    { label: '総計', schoolCount: 6, quota: 480, finalApplicants: 236, finalRate: 0.49 },
  ],
};
