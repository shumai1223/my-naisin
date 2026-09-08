import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 佐賀県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ・C分類最後の1県）。
 *
 * 一次ソース: 佐賀県教育委員会「令和8年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後）
 * をお知らせします」（訂正版・令和8年2月25日付プレスリリース、既存の全日制`src/data/
 * competition-rates/saga.ts`と同一PDF）2頁目下段「（2）定時制課程」の全数表。
 * https://www.pref.saga.lg.jp/kyouiku/kiji003118261/3_118261_381978_up_jpwwphq6.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と全く同一のPDFの
 * 2頁目に全日制「（1）全日制課程」表に続けて「（2）定時制課程」の独立した学校別内訳表が
 * 存在した（fukushima・iwate・miyazaki・nara・oitaと同型の見落としパターン。ただし今回は
 * PDF自体がテキスト埋め込み型でRead toolから直接抽出できた＝ビジョン解析不要）。6校7レコード
 * （鳥栖工業[普通科/機械科・電気科（くくり募集）]・佐賀工業[機械科・情報科（くくり募集）]・
 * 有田工業[セラミック科・デザイン科（くくり募集）]・佐賀商業[総合文化科]・唐津商業[商業科]・
 * 伊万里実業[商業科]）の完全な学校別内訳。
 *
 * quotaは「一般選抜募集人員」列（学科別・学校別とも同値）、finalApplicantsは「一般選抜志願者数
 * （志願変更後）」列（i=e-g+h）。finalRateは資料に印字された「志願倍率」列（i/c）をそのまま
 * 採用（自前算出ではなく公式印字値）。
 *
 * 機械集計（quota280・applicants72、6校7レコード）が「合計」280/72/0.26と完全一致した（初回
 * 転記で一致・再修正なし）。鳥栖工業のみ校内2学科（普通科／機械科・電気科くくり募集）を持つため
 * 「鳥栖工業計」80/19/0.24の小計も原資料に印字されており、機械集計との完全一致を確認済み。
 * これでS1-3 C分類（22県）は全て解消（残るaichi/akita/fukuiはデータ不在確定で保留のまま）。
 */

export const SAGA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'saga',
  sources: [
    {
      url: 'https://www.pref.saga.lg.jp/kyouiku/kiji003118261/3_118261_381978_up_jpwwphq6.pdf',
      docTitle: '佐賀県教育委員会 令和8年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後・訂正版）2頁目「（2）定時制課程」',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程（6校7レコード）'],
    pendingDepartments: [],
    note: '2頁目「（2）定時制課程」の全7レコード（6校）を完全収録。「合計」280/72/0.26・「鳥栖工業計」80/19/0.24と完全一致。',
  },
  records: [
    { schoolName: '鳥栖工業', department: '普通科', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '鳥栖工業', department: '機械科・電気科（くくり募集）', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '佐賀工業', department: '機械科・情報科（くくり募集）', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '有田工業', department: 'セラミック科・デザイン科（くくり募集）', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '佐賀商業', department: '総合文化科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '唐津商業', department: '商業科', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '伊万里実業', department: '商業科', quota: 40, finalApplicants: 4, finalRate: 0.1 },
  ],
  officialSubtotals: [
    { label: '鳥栖工業計', schoolCount: 1, quota: 80, finalApplicants: 19, finalRate: 0.24 },
    { label: '合計', schoolCount: 6, quota: 280, finalApplicants: 72, finalRate: 0.26 },
  ],
};
