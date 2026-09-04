import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 山梨県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 山梨県教育委員会「令和8年度山梨県公立高等学校入学者選抜 志願者数（後期募集・
 * 定時制課程）」（令和8年2月25日午後4時締切・全7頁。既存の全日制`src/data/competition-rates/
 * yamanashi.ts`と同一PDFの4頁目「［定時制課程］7校 13学科・部」）。
 * ⚠️7頁目に「○倍率の高い学科（定時制課程）」という上位5校のみのランキング表もあるが、
 * これは全数ではなく参考表のため対象外とし、4頁目の全数表を正としている。
 *
 * ⚠️対象範囲=定時制課程7校13レコード（中央・ひばりが丘は複数学科×昼夜間部の組み合わせで
 * 複数レコード）。quotaは「募集定員」列を採用。finalApplicantsは印字済み「最終志願者数」の
 * 生値ではなく、**倍率算定の分子（最終志願者数−帰国生徒等特別措置の適用者数）**を採用した
 * （表の注記3「志願者数のうち帰国生徒等特別措置の適用を受ける者は内数とし、倍率の算定には
 * 加えていない」に準拠。倍率欄自体も「倍率（帰国生徒等を除く）」と明記されている）。
 * 該当するのは中央・普通（夜間制・夜間部）が生値3→帰国1名を除き2、中央・普通（昼間制・
 * 午後部）が生値30→帰国3名を除き27の2レコードのみ（他11レコードは帰国生徒等0名のため
 * 生値と一致）。この調整によりquota×finalRate≈finalApplicantsの自己整合が全レコードで成立する。
 *
 * 機械集計（quota570・applicants141・倍率0.25）は表末尾の印字済み「定時制課程計」
 * 570/145(生値)/0.25の倍率算定分子(145−帰国4名=141)と完全一致した。ToUnicode欠落は無く
 * `pdftoppm 170dpi`のビジョン解析1回で全13レコードを判読できた。
 */

export const YAMANASHI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'yamanashi',
  sources: [
    {
      url: 'https://www.pref.yamanashi.jp/documents/7061/r8saisyuusigansyasuu1.pdf',
      docTitle: '山梨県教育委員会 令和8年度山梨県公立高等学校入学者選抜 志願者数（後期募集）［定時制課程］7校13学科・部',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程'],
    pendingDepartments: [],
    note: '4頁目「［定時制課程］7校 13学科・部」の全13レコードを完全収録。',
  },
  records: [
    { schoolName: '韮崎', department: '普通（昼間制）', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '甲府工業', department: '工業（一括・夜間制）', quota: 120, finalApplicants: 10, finalRate: 0.08 },
    { schoolName: '巨摩', department: '普通（夜間制）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '山梨', department: '普通（夜間制）', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '都留', department: '普通（夜間制）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '中央', department: '普通（昼間制・午前部）', quota: 60, finalApplicants: 17, finalRate: 0.28 },
    { schoolName: '中央', department: '普通（昼間制・午後部）', quota: 60, finalApplicants: 27, finalRate: 0.45 },
    { schoolName: '中央', department: '普通（夜間制・夜間部）', quota: 20, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '中央', department: '情報経理（昼間制・午後部）', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '中央', department: '情報経理（夜間制・夜間部）', quota: 20, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'ひばりが丘', department: '普通（昼間制）', quota: 30, finalApplicants: 35, finalRate: 1.17 },
    { schoolName: 'ひばりが丘', department: '普通（夜間制）', quota: 30, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'ひばりが丘', department: '情報経理（昼間制）', quota: 30, finalApplicants: 19, finalRate: 0.63 },
  ],
  officialSubtotals: [{ label: '定時制課程計', quota: 570, finalApplicants: 141, finalRate: 0.25 }],
};
