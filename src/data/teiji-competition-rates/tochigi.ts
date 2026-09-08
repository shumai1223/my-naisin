import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 栃木県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 栃木県教育委員会「令和8(2026)年度県立高等学校入学者選抜一般選抜出願・合格状況
 * （定時制課程）」（1頁・全日制`src/data/competition-rates/tochigi.ts`とは別の専用PDF）。
 * https://www.pref.tochigi.lg.jp/m04/r08/documents/20260323115635.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、栃木県教育委員会は定時制課程専用の
 * 一般選抜出願・合格状況ページを別途公開しており（全日制とは異なるURL体系）、8校12レコード
 * （宇都宮工業[午後部普通/夜間部工業技術]・宇都宮商業[普通/商業]・鹿沼商工・学悠館[Ⅰ部/Ⅱ部/
 * Ⅲ部]・足利工業・真岡・大田原東・矢板東）の完全な学校別内訳が存在する。
 *
 * quotaは「一般選抜定員」列（学悠館のみ募集定員からフレックス特別選抜合格人員を控除した実質
 * 枠、他校は募集定員と同一と備考に明記）。finalApplicantsは「出願人員」列、finalRateは
 * 「出願倍率」列（＝出願人員÷一般選抜定員）を採用（受検倍率・合格倍率は別の分母を使うため
 * 対象外・全日制tochigi.tsと同じ規律）。
 *
 * 機械集計（quota452・applicants193・倍率0.43、12レコード）が表末尾の「合計」
 * 452/193/0.43/185(受検)/0.41/180(合格)/1.03と完全一致した（出願ベースの452/193/0.43のみ
 * 採用し受検・合格の列は対象外）。この頁はpdftotextで数字は抽出可能（日本語ラベルのみ欠落）
 * で、pdftoppm 180dpiのビジョン解析1回で全12レコードを判読できた。
 */

export const TOCHIGI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tochigi',
  sources: [
    {
      url: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/20260323115635.pdf',
      docTitle: '栃木県教育委員会 令和8(2026)年度県立高等学校入学者選抜一般選抜出願・合格状況（定時制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程（一般選抜）'],
    pendingDepartments: [],
    note: '定時制課程専用PDFの全12レコード（8校）を完全収録。',
  },
  records: [
    { schoolName: '宇都宮工業', department: '普通（午後部）', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '宇都宮工業', department: '工業技術（夜間部）', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '宇都宮商業', department: '普通', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '宇都宮商業', department: '商業', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '鹿沼商工', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '学悠館', department: '普通（Ⅰ部）', quota: 36, finalApplicants: 42, finalRate: 1.17 },
    { schoolName: '学悠館', department: '普通（Ⅱ部）', quota: 36, finalApplicants: 45, finalRate: 1.25 },
    { schoolName: '学悠館', department: '普通（Ⅲ部）', quota: 20, finalApplicants: 10, finalRate: 0.5 },
    { schoolName: '足利工業', department: '工業技術', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '真岡', department: '普通', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '大田原東', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '矢板東', department: '普通', quota: 40, finalApplicants: 3, finalRate: 0.08 },
  ],
  officialSubtotals: [{ label: '合計', quota: 452, finalApplicants: 193, finalRate: 0.43 }],
};
