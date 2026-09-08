import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 茨城県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 茨城県教育委員会「令和8年度茨城県立高等学校第1学年入学志願者数等（志願先変更後）」
 * （全5頁）3頁目下段【定時制】の全数表。既存の全日制`src/data/competition-rates/ibaraki.ts`
 * とは別ファイル（学力検査平均点で使った「実施状況報告書」とも異なる第三のPDF）。
 * https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/02/shigansha20260218.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、全日制と同じ資料の3頁目に
 * 【定時制】として独立した学校別内訳表（12校21レコード：高萩[午前/午後]・日立工業・
 * 水戸農業・水戸南[昼間/夜間]・ＩＴ未来[A/B]・鹿島灘[午前/午後/夜間]・土浦第一・石岡第一・
 * 竜ヶ崎第一・茎崎[午前/午後/夜間]・結城第二[午前/午後/夜間]・古河第一）が存在した。
 * 列構成は全日制と同じ「募集定員(a)」「志願者数(b)」「倍率(b/a)」を採用。
 *
 * 機械集計（quota960・applicants417・倍率0.43）が表末尾の「定時制計」960/417/0.43と
 * 完全一致した。この頁はToUnicode欠落があったが罫線・数字は明瞭で、pdftoppm 120dpiの
 * ビジョン解析1回で全21レコードを判読できた。
 */

export const IBARAKI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'ibaraki',
  sources: [
    {
      url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/02/shigansha20260218.pdf',
      docTitle: '茨城県教育委員会 令和8年度茨城県立高等学校第1学年入学志願者数等（志願先変更後・定時制・3頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制'],
    pendingDepartments: [],
    note: '3頁目「【定時制】」の全21レコード（12校）を完全収録。',
  },
  records: [
    { schoolName: '高萩', department: '普通（午前）', quota: 80, finalApplicants: 33, finalRate: 0.41 },
    { schoolName: '高萩', department: '普通（午後）', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '日立工業', department: '総合', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '水戸農業', department: '農業（昼間）', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '水戸南', department: '普通（昼間）', quota: 80, finalApplicants: 47, finalRate: 0.59 },
    { schoolName: '水戸南', department: '普通（夜間）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: 'ＩＴ未来', department: 'IT（A）', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: 'ＩＴ未来', department: 'IT（B）', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '鹿島灘', department: '普通（午前）', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '鹿島灘', department: '普通（午後）', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '鹿島灘', department: '普通（夜間）', quota: 40, finalApplicants: 0, finalRate: 0 },
    { schoolName: '土浦第一', department: '普通', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '石岡第一', department: '普通', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '竜ヶ崎第一', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '茎崎', department: '普通（午前）', quota: 80, finalApplicants: 47, finalRate: 0.59 },
    { schoolName: '茎崎', department: '普通（午後）', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '茎崎', department: '普通（夜間）', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '結城第二', department: '普通（午前）', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '結城第二', department: '普通（午後）', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '結城第二', department: '普通（夜間）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '古河第一', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
  ],
  officialSubtotals: [{ label: '定時制計', quota: 960, finalApplicants: 417, finalRate: 0.43 }],
};
