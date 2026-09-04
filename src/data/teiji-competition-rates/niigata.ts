import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 新潟県 定時制の課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 新潟県教育委員会「令和8年度新潟県公立高等学校入学者選抜一般選抜志願変更後の
 * 志願状況一覧」（令和8年2月26日現在・全6頁）
 * https://kyouikucho.nein.ed.jp/koukoukyouiku/senbatu/koukou/ippan_henkogo.pdf
 * （既存の全日制`src/data/competition-rates/niigata.ts`と同一PDFの6頁目末尾「定時制の課程」）。
 *
 * ⚠️対象範囲=定時制の課程10校12レコード（長岡明徳・市立明鏡は午前部/夜間部で別レコード）。
 * finalApplicantsは「一般選抜志願者数B」列を採用（他県の「最終応募人員」相当）。長岡明徳・
 * 堀之内には別途「海外帰国生徒等特別選抜志願者数」が2名・1名あるが、これは一般選抜の外側の
 * 別枠選抜のためfinalApplicantsには含めない（他県の特別選抜除外と同じ扱い）。
 *
 * 機械集計（quota670・applicants437・倍率0.65）は頁末尾の印字済み「定時制合計」670/437/0.65と
 * 完全一致した。ToUnicode欠落は無く`pdftoppm 180dpi`のビジョン解析1回で全12レコードを判読できた。
 */

export const NIIGATA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'niigata',
  sources: [
    {
      url: 'https://kyouikucho.nein.ed.jp/koukoukyouiku/senbatu/koukou/ippan_henkogo.pdf',
      docTitle: '新潟県教育委員会 令和8年度新潟県公立高等学校入学者選抜一般選抜志願変更後の志願状況一覧（定時制の課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制の課程'],
    pendingDepartments: [],
    note: '6頁目末尾「定時制の課程」の全12レコードを完全収録。',
  },
  records: [
    { schoolName: '新潟翠江', department: '普通・午前', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '西新発田', department: '普通・午前', quota: 70, finalApplicants: 78, finalRate: 1.11 },
    { schoolName: '荒川', department: '普通・午前', quota: 35, finalApplicants: 34, finalRate: 0.97 },
    { schoolName: '長岡明徳', department: '普通・午前', quota: 105, finalApplicants: 73, finalRate: 0.69 },
    { schoolName: '長岡明徳', department: '普通・夜間', quota: 35, finalApplicants: 11, finalRate: 0.31 },
    { schoolName: '堀之内', department: '普通・午前', quota: 70, finalApplicants: 36, finalRate: 0.51 },
    { schoolName: '十日町', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.17 },
    { schoolName: '出雲崎', department: '普通・午前', quota: 35, finalApplicants: 22, finalRate: 0.62 },
    { schoolName: '高田南城', department: '普通・午前', quota: 70, finalApplicants: 44, finalRate: 0.62 },
    { schoolName: '佐渡（相川）', department: '普通・午前', quota: 35, finalApplicants: 10, finalRate: 0.28 },
    { schoolName: '市立明鏡', department: '普通・午前', quota: 105, finalApplicants: 96, finalRate: 0.91 },
    { schoolName: '市立明鏡', department: '普通・夜間', quota: 35, finalApplicants: 8, finalRate: 0.22 },
  ],
  officialSubtotals: [{ label: '定時制合計', quota: 670, finalApplicants: 437, finalRate: 0.65 }],
};
