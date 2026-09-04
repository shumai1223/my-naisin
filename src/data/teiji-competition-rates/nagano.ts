import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 長野県 定時制課程・定時制課程（多部制・単位制）（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 長野県教育委員会「令和8年度長野県公立高等学校入学者後期選抜志願者数②
 * （志望変更受付締切後の集計結果）」別紙1（2)学校別状況（令和8年3月5日発表・全8頁のうち
 * 7頁目。既存の全日制`src/data/competition-rates/nagano.ts`と同一PDF）。
 *
 * ⚠️対象範囲=【県立定時制課程】16レコード（14校・長野工業のみ2学科）と
 * 【県立定時制課程（多部制・単位制）】6レコード（3校）の計22レコード。多部制・単位制の
 * 東御清翔（午前部・午後部）と松本筑摩（午前部・午後部）は資料上「2部合わせて」募集人員が
 * 共有されているため分割せず1レコードとして収録（箕輪進修のⅠ部・Ⅱ部も同様に合算、
 * Ⅲ部・工業Ⅰ部は独立募集のため別レコード）。
 *
 * 機械集計は2セクションそれぞれの印字済み合計と完全一致した:
 * ①「合計」634／97／0.15（県立定時制課程） ②「合計」249／66／0.27（多部制・単位制）。
 * ToUnicode欠落は無く`pdftoppm 150dpi`のビジョン解析1回で全22レコードを判読できた。
 */

export const NAGANO_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'nagano',
  sources: [
    {
      url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/20260305web-teisei.pdf',
      docTitle:
        '長野県教育委員会 令和8年度長野県公立高等学校入学者後期選抜志願者数②（志望変更受付締切後の集計結果）別紙1(2)学校別状況【県立定時制課程】【県立定時制課程（多部制・単位制）】',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程', '定時制課程（多部制・単位制）'],
    pendingDepartments: [],
    note: '7頁目の【県立定時制課程】【県立定時制課程（多部制・単位制）】両表の全22レコードを完全収録。',
  },
  records: [
    // ===== 県立定時制課程 =====
    { schoolName: '中野立志館', department: '普通', quota: 29, finalApplicants: 2, finalRate: 0.07 },
    { schoolName: '長野吉田', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '長野', department: '普通', quota: 32, finalApplicants: 3, finalRate: 0.09 },
    { schoolName: '長野商業', department: '普通', quota: 31, finalApplicants: 2, finalRate: 0.06 },
    { schoolName: '長野工業', department: '工業（基礎工学）', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '長野工業', department: '工業（建築）', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '篠ノ井', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '上田千曲', department: '工業（機械）', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '上田', department: '普通', quota: 25, finalApplicants: 4, finalRate: 0.16 },
    { schoolName: '小諸義塾', department: '商業（商業）', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '野沢南', department: '普通', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '諏訪実業', department: '普通', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '赤穂', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '飯田OIDE長姫', department: '普通', quota: 80, finalApplicants: 21, finalRate: 0.26 },
    { schoolName: '木曽青峰', department: '普通', quota: 40, finalApplicants: 0, finalRate: 0 },
    { schoolName: '池田工業', department: '普通', quota: 37, finalApplicants: 2, finalRate: 0.05 },

    // ===== 県立定時制課程（多部制・単位制） =====
    { schoolName: '東御清翔', department: '普通（午前部・午後部）', quota: 48, finalApplicants: 46, finalRate: 0.96 },
    { schoolName: '箕輪進修', department: '普通（Ⅰ部・Ⅱ部）', quota: 41, finalApplicants: 10, finalRate: 0.24 },
    { schoolName: '箕輪進修', department: '普通・Ⅲ部', quota: 36, finalApplicants: 2, finalRate: 0.06 },
    { schoolName: '箕輪進修', department: '工業・Ⅰ部', quota: 23, finalApplicants: 4, finalRate: 0.17 },
    { schoolName: '松本筑摩', department: '普通（午前部・午後部）', quota: 63, finalApplicants: 2, finalRate: 0.03 },
    { schoolName: '松本筑摩', department: '普通・夜間部', quota: 38, finalApplicants: 2, finalRate: 0.05 },
  ],
  officialSubtotals: [
    { label: '定時制課程 合計', quota: 634, finalApplicants: 97, finalRate: 0.15 },
    { label: '多部制・単位制 合計', quota: 249, finalApplicants: 66, finalRate: 0.27 },
  ],
};
