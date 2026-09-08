import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 和歌山県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 和歌山県教育委員会「令和8年度県立高等学校入学者選抜出願状況」（全2頁・既存の
 * 全日制`src/data/competition-rates/wakayama.ts`と同一PDF）2頁目冒頭【定時制】の県立7校
 * 13レコード、および同頁末尾「（参考）市立高等学校入学者選抜実施状況」の市立1校2レコード
 * （和歌山市立和歌山）。
 * https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08honsyutugan.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と同一PDFの2頁目に
 * 独立した定時制の学校別内訳（県立：伊都中央[昼/夜]・きのくに青雲[昼/夜/情報会計科夜]・
 * 和歌山工業[機械電気科夜/建築科夜]・耐久[夜]・日高[夜]・南紀[昼/夜]・新宮[昼(新翔校舎)/
 * 夜(新宮校舎)]、市立：和歌山市立和歌山[ビジネス実践科/ビジネス情報科]）が存在する。
 *
 * 列は「入学者枠数(A)」「一般選抜出願者数(C)」「本出願者数(D+E)」「本出願倍率((D+E)/A)」の
 * 4本立て（Dはスポーツ推薦本出願者数だが定時制は全校0のためE本出願者数と一致）。quota=A、
 * finalApplicants=本出願者数(D+E)、finalRate=本出願倍率を採用（志願変更を反映した最終値のため
 * 一般選抜出願者数Cではなくこちらを正とする＝全日制wakayama.tsと同じ規律）。
 *
 * 機械集計は2段階の自己検算が一致した: 県立定時制計=quota570・applicants204・倍率0.36
 * （13レコード、表末尾「合計」16学級/570/570/202/0.35/204/0.36と完全一致）／市立定時制計=
 * quota80・applicants9・倍率0.11（2レコード、表末尾「合計」2学級/80/80/10/0.13/9/0.11と
 * 完全一致）。この頁はToUnicode欠落があったが罫線・数字は明瞭で、pdftoppm 150dpiの
 * ビジョン解析1回で全15レコードを判読できた。
 */

export const WAKAYAMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'wakayama',
  sources: [
    {
      url: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08honsyutugan.pdf',
      docTitle: '和歌山県教育委員会 令和8年度県立高等学校入学者選抜出願状況（定時制・2頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制（県立）', '定時制（市立）'],
    pendingDepartments: [],
    note: '2頁目冒頭【定時制】の県立13レコード（7校）＋「（参考）市立高等学校」の2レコード（1校）を完全収録。',
  },
  records: [
    { schoolName: '伊都中央', department: '普通科（昼）', quota: 70, finalApplicants: 29, finalRate: 0.41 },
    { schoolName: '伊都中央', department: '普通科（夜）', quota: 30, finalApplicants: 5, finalRate: 0.17 },
    { schoolName: 'きのくに青雲', department: '普通科（昼）', quota: 105, finalApplicants: 76, finalRate: 0.72 },
    { schoolName: 'きのくに青雲', department: '普通科（夜）', quota: 30, finalApplicants: 4, finalRate: 0.13 },
    { schoolName: 'きのくに青雲', department: '情報会計科（夜）', quota: 30, finalApplicants: 3, finalRate: 0.1 },
    { schoolName: '和歌山工業', department: '機械電気科（夜）', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '和歌山工業', department: '建築科（夜）', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '耐久', department: '普通科（夜）', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '日高', department: '普通科（夜）', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '南紀', department: '普通科（昼）', quota: 35, finalApplicants: 33, finalRate: 0.94 },
    { schoolName: '南紀', department: '普通科（夜）', quota: 30, finalApplicants: 3, finalRate: 0.1 },
    { schoolName: '新宮', department: '普通科（昼・新翔校舎）', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '新宮', department: '普通科（夜・新宮校舎）', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '和歌山市立和歌山', department: 'ビジネス実践科', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '和歌山市立和歌山', department: 'ビジネス情報科', quota: 40, finalApplicants: 4, finalRate: 0.1 },
  ],
  officialSubtotals: [
    { label: '定時制 県立合計', quota: 570, finalApplicants: 204, finalRate: 0.36 },
    { label: '定時制 市立合計', quota: 80, finalApplicants: 9, finalRate: 0.11 },
  ],
};
