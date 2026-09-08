import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 愛媛県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 愛媛県教育委員会「令和8年度県立高等学校学科別入学志願者数（定時制）（志願変更後）」
 * （全1頁）。全日制`src/data/competition-rates/ehime.ts`のR8収集元（`ehime-kyoiku.esnet.ed.jp/
 * file/2314`＝全日制版）と同じfile-ID方式のホストで、隣接するfile/2315が定時制版だった。
 * https://ehime-kyoiku.esnet.ed.jp/file/2315
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、10校11レコード（川之江・新居浜西・
 * 西条・今治西・松山南[普通/商業]・松山工業・大洲[肱川分校]・八幡浜・宇和島東・北条清新）の
 * 完全な学校別内訳が独立したPDFとして公開されていた。大洲のみ「大洲｜肱川」という2セル表記
 * （本校ではなく肱川分校であることを示す）のため、schoolNameに「(肱川分校)」を付記した。
 *
 * quotaは「定員(A)」列、finalApplicantsは「入学志願者数(B)」列、finalRateは「倍率(B/A)」列
 * （印字済み値をそのまま採用）。機械集計（quota480・applicants166、10校11レコード）が「合計」
 * 480/166/0.35と完全一致した（初回転記で一致・再修正なし）。この頁はpdftotextで数字は抽出
 * 可能（日本語ラベルのみ欠落）で、pdftoppm 200〜400dpiのビジョン解析1回で全11レコードを
 * 判読できた。
 */

export const EHIME_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'ehime',
  sources: [
    {
      url: 'https://ehime-kyoiku.esnet.ed.jp/file/2315',
      docTitle: '愛媛県教育委員会 令和8年度県立高等学校学科別入学志願者数（定時制）（志願変更後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制'],
    pendingDepartments: [],
    note: '定時制専用PDFの全11レコード（10校）を完全収録。',
  },
  records: [
    { schoolName: '川之江', department: '普通', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '新居浜西', department: '普通', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '西条', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '今治西', department: '普通', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '松山南', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '松山南', department: '商業', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '松山工業', department: '機械システム', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '大洲（肱川分校）', department: '普通', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '八幡浜', department: '普通', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '宇和島東', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '北条清新', department: '総合学科', quota: 80, finalApplicants: 70, finalRate: 0.88 },
  ],
  officialSubtotals: [{ label: '合計', quota: 480, finalApplicants: 166, finalRate: 0.35 }],
};
