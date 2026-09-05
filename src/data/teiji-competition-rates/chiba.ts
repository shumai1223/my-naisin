import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 千葉県 県立定時制（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 千葉県教育委員会「令和8年度公立高等学校 一般入学者選抜等志願者確定数一覧＜その６＞
 * （特別入学者選抜及び地域連携アクティブスクールの入学者選抜を含む）」（既存の全日制
 * `src/data/competition-rates/chiba.ts`と同一PDF・全6頁のうち6頁目「3．県立定時制」）。
 *
 * ⚠️対象範囲=県立定時制16校22レコード（生浜・松戸南・佐倉南の3校は午前部/午後部/夜間部の
 * 3部制で各部を別レコード化。他13校は単一部制のため1校1レコード）。募集定員/募集人員/
 * 志願者確定数/倍率の4列のうち、他都道府県の「最終応募人員」に相当する募集人員をquotaとして
 * 採用した（募集定員は転入学等の予定人員を控除する前の名目値のため不採用）。
 *
 * 機械集計（quota1,237・applicants821）は表内の「県立定時制　合計」1,360／1,237／821／0.66・
 * 「公立定時制　合計」（県立と同値）と完全一致した。ToUnicode欠落は無く`pdftoppm 200dpi`の
 * ビジョン解析1回で全22レコードを判読できた。
 */

export const CHIBA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'chiba',
  sources: [
    {
      url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/r8kakuteiippan.pdf',
      docTitle:
        '千葉県教育委員会 令和8年度公立高等学校 一般入学者選抜等志願者確定数一覧＜その６＞（特別入学者選抜及び地域連携アクティブスクールの入学者選抜を含む）3．県立定時制',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['県立定時制'],
    pendingDepartments: [],
    note: '6頁目「3．県立定時制」の全22レコードを完全収録（通信制課程は別資料のため未収録）。',
  },
  records: [
    { schoolName: '千葉商業', department: '商業科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '千葉工業', department: '工業科', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '生浜', department: '普通科（午前部）', quota: 66, finalApplicants: 67, finalRate: 1.02 },
    { schoolName: '生浜', department: '普通科（午後部）', quota: 66, finalApplicants: 51, finalRate: 0.77 },
    { schoolName: '生浜', department: '普通科（夜間部）', quota: 66, finalApplicants: 13, finalRate: 0.2 },
    { schoolName: '船橋', department: '総合学科', quota: 80, finalApplicants: 47, finalRate: 0.59 },
    { schoolName: '市川工業', department: '工業科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '松戸南', department: '普通科（午前部）', quota: 104, finalApplicants: 126, finalRate: 1.21 },
    { schoolName: '松戸南', department: '普通科（午後部）', quota: 104, finalApplicants: 135, finalRate: 1.3 },
    { schoolName: '松戸南', department: '普通科（夜間部）', quota: 66, finalApplicants: 70, finalRate: 1.06 },
    { schoolName: '東葛飾', department: '普通科', quota: 80, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '佐倉南', department: '普通科（午前部）', quota: 66, finalApplicants: 71, finalRate: 1.08 },
    { schoolName: '佐倉南', department: '普通科（午後部）', quota: 66, finalApplicants: 72, finalRate: 1.09 },
    { schoolName: '佐倉南', department: '普通科（夜間部）', quota: 33, finalApplicants: 23, finalRate: 0.7 },
    { schoolName: '佐原', department: '普通科', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '銚子商業', department: '商業科', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '匝瑳', department: '普通科', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '東金', department: '普通科', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '長生', department: '普通科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '長狭', department: '普通科', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '館山総合', department: '普通科', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '木更津東', department: '普通科', quota: 40, finalApplicants: 22, finalRate: 0.55 },
  ],
  officialSubtotals: [{ label: '県立定時制　合計', quota: 1237, finalApplicants: 821, finalRate: 0.66 }],
};
