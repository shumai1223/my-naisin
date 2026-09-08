import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 滋賀県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 滋賀県教育委員会「令和8年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料
 * （一次募集確定出願者数）」（全3頁・既存の全日制`src/data/competition-rates/shiga.ts`と
 * 同一PDF）3頁目末尾【定時制】の全数表。
 * https://www.pref.shiga.lg.jp/documents/16947/5591236_1.pdf
 * ⚠️旧URL(`file/attachment/5591236.pdf`)は404化していたため、県公式ページから新URL体系
 * (`documents/16947/`)を再取得した（教委サイトの構造変更・恒久リンクではない点に注意）。
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と同一PDFの3頁目に
 * 独立した【定時制】表（7校8レコード：大津清陵[昼間部/夜間部]・瀬田工業定時制・彦根工業
 * 定時制・長浜北星定時制・能登川[昼間部が学校独自型・一般型の2レコード/夜間部]）が存在する。
 *
 * ⚠️全日制shiga.tsと同じ構造的複雑さ（学校独自型選抜と一般型選抜が同一学科枠を共有し、
 * 一般型選抜の出願者数は学校独自型選抜併願者を含む）があり、全日制と同じ方針で**学校独自型
 * 選抜（能登川昼間部の中学校長推薦・quota12/確定出願者数4）はスコープ外**とし、一般型選抜の
 * みを収録した。quota=一般型選抜の募集人数（括弧書き値、能登川昼間部は(28)）、
 * finalApplicants=一般型選抜の確定出願者数を採用。
 *
 * 全日制shiga.tsと同様、資料の「計②」（280/190/163）は学校独自型＋一般型の合算値のため、
 * 一般型選抜のみの本データベース集計（quota268・applicants159）とは直接一致しない。
 * 「計②」から本データベースの自己集計値を差し引いた残差（quota12・applicants4）が、
 * 除外した学校独自型選抜（能登川昼間部の中学校長推薦12/4）の値と完全に一致することを
 * 確認し、内部整合性を担保した（全日制shiga.tsと同じ検証方式）。この頁はToUnicode欠落が
 * あったが罫線・数字は明瞭で、pdftoppm 150dpiのビジョン解析1回で全8レコードを判読できた。
 */

export const SHIGA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shiga',
  sources: [
    {
      url: 'https://www.pref.shiga.lg.jp/documents/16947/5591236_1.pdf',
      docTitle: '滋賀県教育委員会 令和8年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料（定時制・3頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制（一般型選抜のみ）'],
    pendingDepartments: ['定時制（学校独自型選抜・能登川昼間部の中学校長推薦のみ該当）'],
    note: '3頁目【定時制】の一般型選抜7レコード（7校）を完全収録。学校独自型選抜1レコード（能登川昼間部）は全日制と同じ方針でスコープ外。',
  },
  records: [
    { schoolName: '大津清陵（昼間部）', department: '普通', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '大津清陵（夜間部）', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '瀬田工業定時制', department: '工業（機械・電気）', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '彦根工業定時制', department: '工業（機械）', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '長浜北星定時制', department: '総合', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '能登川（昼間部）', department: '普通（一般型）', quota: 28, finalApplicants: 28, finalRate: 1.0 },
    { schoolName: '能登川（夜間部）', department: '普通', quota: 40, finalApplicants: 20, finalRate: 0.5 },
  ],
  officialSubtotals: [{ label: '一般型選抜のみ自己集計（定時制）', schoolCount: 7, quota: 268, finalApplicants: 159 }],
};
