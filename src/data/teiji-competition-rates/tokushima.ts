import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 徳島県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 徳島県教育委員会「令和8年度徳島県公立高等学校一般選抜出願状況（2月26日志願変更後）」
 * https://nyuushi.tokushima-ec.ed.jp/file/975 （全1頁・全日制は左右2段組＋定時制は右端1段の
 * 3ブロック構成。既存の全日制`src/data/competition-rates/tokushima.ts`と同一PDF）。
 *
 * ⚠️対象範囲=【定時制課程】ブロックの6校9レコード（徳島科学技術・徳島中央は複数学科/時間帯を
 * 持つため学科・部ごとに別レコード）。同一頁右下の「学区外からの出願状況」は全日制普通科の
 * 学区外集計のため対象外。
 *
 * 機械集計（quota210・applicants112・倍率0.53）は表末尾の印字済み「合計」210/112/0.53と
 * 完全一致した。ToUnicode欠落は無く`pdftoppm 250dpi`のビジョン解析1回で全9レコードを判読できた
 * （既存の全日制tokushimaデータと同一のPDF・同一の読みやすさ）。
 */

export const TOKUSHIMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tokushima',
  sources: [
    {
      url: 'https://nyuushi.tokushima-ec.ed.jp/file/975',
      docTitle: '徳島県教育委員会 令和8年度徳島県公立高等学校一般選抜出願状況（2月26日志願変更後）【定時制課程】',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程'],
    pendingDepartments: [],
    note: '【定時制課程】ブロックの全9レコードを完全収録。',
  },
  records: [
    { schoolName: '徳島科学技術', department: '機械類', quota: 20, finalApplicants: 6, finalRate: 0.3 },
    { schoolName: '徳島科学技術', department: '工業技術類', quota: 20, finalApplicants: 8, finalRate: 0.4 },
    { schoolName: '徳島中央', department: '普通（昼間部午前）', quota: 60, finalApplicants: 48, finalRate: 0.8 },
    { schoolName: '徳島中央', department: '普通（昼間部午後）', quota: 30, finalApplicants: 19, finalRate: 0.63 },
    { schoolName: '徳島中央', department: '普通（夜間部）', quota: 20, finalApplicants: 5, finalRate: 0.25 },
    { schoolName: '富岡東', department: '普通', quota: 15, finalApplicants: 4, finalRate: 0.27 },
    { schoolName: '鳴門', department: '普通', quota: 20, finalApplicants: 9, finalRate: 0.45 },
    { schoolName: '名西', department: '普通', quota: 15, finalApplicants: 11, finalRate: 0.73 },
    { schoolName: '池田', department: '普通', quota: 10, finalApplicants: 2, finalRate: 0.2 },
  ],
  officialSubtotals: [{ label: '合計', quota: 210, finalApplicants: 112, finalRate: 0.53 }],
};
