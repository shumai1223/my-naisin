import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 群馬県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 群馬県教育委員会「令和8年度群馬県公立高等学校入学者選抜 第２回志願先変更後の
 * 定時制課程選抜志願状況」（既存の全日制`src/data/competition-rates/gunma.ts`と同一PDF
 * `689968.pdf`・全3頁のうち3頁目上段）。
 *
 * ⚠️S1-3台帳(`ops/S1-3-teiji-availability-ledger.md`)は「R8本体PDFに定時制セクションが
 * あるか未確認（タイトルに定時制の言及が無いため）」という留保付きでA分類にしていたが、
 * 実機確認の結果、**3頁目に定時制課程選抜の独立した表が存在することを確認した**（留保は解消）。
 * 同じ3頁目下段には「連携型選抜実施校志願状況」（尾瀬・万場・嬬恋の3校）も掲載されているが、
 * これは全日制データ側でも捏造ゼロのため未収録とした別制度（連携型選抜）であり、定時制でも
 * 全日制でもないため本ファイルにも収録しない。
 *
 * ⚠️対象範囲=定時制課程12校13レコード（前橋工業のみ機械/建築の2学科で計2レコード）。
 * 学校別募集定員(A)・学科等別募集定員(B)・学科等別志願者数(C)・学科等別倍率(C/B)・
 * 学校別志願者数(D)・学校別倍率(D/A)の6列のうち、既存の全日制gunma.tsと同じ規律で
 * quota=B・finalApplicants=C・finalRate=C/Bとして転記した。
 *
 * 機械集計（quota520・applicants89）は表末尾の印字済み「公立定時制合計」520／520／89／0.17
 * （学科等別列・学校別列とも同値）と完全一致した。gunma R8はテキスト埋め込み型で
 * `pdftotext -layout`によるテキスト抽出が機能するが、この3頁目のみ日本語ラベルが
 * フォント崩れで欠落する（既存の全日制コメントに記載のR6と同型の問題）ため、
 * `pdftoppm 200dpi`のビジョン解析1回で全13レコードを判読した。
 */

export const GUNMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'gunma',
  sources: [
    {
      url: 'https://www.pref.gunma.jp/uploaded/attachment/689968.pdf',
      docTitle: '群馬県教育委員会 令和8年度群馬県公立高等学校入学者選抜 第２回志願先変更後の定時制課程選抜志願状況',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程選抜'],
    pendingDepartments: [],
    note: '3頁目上段「定時制課程選抜志願状況」の全13レコードを完全収録。同頁下段の連携型選抜実施校（尾瀬・万場・嬬恋）は別制度のため未収録。',
  },
  records: [
    { schoolName: '前橋工業', department: '機械', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '前橋工業', department: '建築', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '高崎工業', department: '工業技術', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '高崎商業', department: '商業', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '桐生工業', department: '工業技術', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '伊勢崎工業', department: '工業技術', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '沼田', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '館林', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '渋川工業', department: '工業技術', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '藤岡中央', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '富岡', department: '普通', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '安中総合学園', department: '普通', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '桐生市立商業', department: '商業', quota: 40, finalApplicants: 8, finalRate: 0.2 },
  ],
  officialSubtotals: [{ label: '公立定時制合計', quota: 520, finalApplicants: 89, finalRate: 0.17 }],
};
