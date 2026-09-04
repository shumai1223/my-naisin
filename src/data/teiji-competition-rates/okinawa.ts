import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 沖縄県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 沖縄県教育委員会「県立高等学校入学者選抜 一般選抜等最終志願状況」
 * https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/038/168/r07saisyu.pdf
 * （全4頁。既存の全日制`src/data/competition-rates/okinawa.ts`と同一PDF）。
 *
 * ⚠️他県と異なり本資料は【全日制・定時制課程】が単一の表に混在し、「課程」列の値
 * （全日／定時）で行を判別する必要がある（他県のような独立ブロックではない）。4頁全体を
 * 走査し「課程」列が「定時」の行のみを抽出した: コザ（商業）・北部農林（農業）・中部農林
 * （農業）・那覇工業（機械／電気）・八重山商工（商業）・泊（普通・午前部／夜間部）の6校8レコード。
 * finalApplicantsは「一般選抜最終志願者数」の「計」列（通学区域内＋区域外＋特別募集の合算＝
 * 特別選抜含む「最終志願」列と一致）を採用した（他県の「最終応募人員」相当）。
 *
 * ⚠️**印字済みの「定時制のみの県全体合計」は本資料に存在しない**（末尾の「総計」368学級・
 * 14,720人は全日制＋定時制の合算のみ）。よってofficialSubtotalsは空とし、本ファイル収集時点の
 * 自己集計（quota400・applicants162）を参考値としてこのコメントに残す（印字値との突合ではない
 * ため「確認済み」とは書かない＝Y-0）。レコード単位のfinalRate自己整合（quota×rate≈applicants）
 * のみが機械検証可能。
 *
 * ToUnicode欠落は無く`pdftoppm 150dpi`のビジョン解析で全4頁を走査し全8レコードを判読できた。
 */

export const OKINAWA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'okinawa',
  sources: [
    {
      url: 'https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/038/168/r07saisyu.pdf',
      docTitle: '沖縄県教育委員会 令和8年度（令和7年度実施）県立高等学校入学者選抜 一般選抜等最終志願状況【全日制・定時制課程】（定時制のみ抽出）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程（全日制と同一表内から「課程」列で抽出）'],
    pendingDepartments: [],
    note:
      '全4頁を走査し「課程」列が「定時」の全8レコード（6校）を完全収録。県全体の定時制限定の' +
      '印字済み合計が存在しないため、officialSubtotalsは空（自己集計quota400/applicants162は参考値）。',
  },
  records: [
    { schoolName: 'コザ', department: '商業', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '北部農林', department: '農業', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '中部農林', department: '農業', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '那覇工業', department: '機械', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '那覇工業', department: '電気', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '八重山商工', department: '商業', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '泊', department: '普通・午前部', quota: 120, finalApplicants: 64, finalRate: 0.53 },
    { schoolName: '泊', department: '普通・夜間部', quota: 40, finalApplicants: 25, finalRate: 0.63 },
  ],
  officialSubtotals: [],
};
