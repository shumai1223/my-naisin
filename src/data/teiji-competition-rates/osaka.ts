import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 大阪府 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 大阪府教育委員会「令和８年度大阪府公立高等学校 一般入学者選抜（定時制の課程）の
 * 志願者数（令和８年３月６日午後５時（締切数））」。既存の全日制`src/data/competition-rates/
 * osaka.ts`と同一のxlsxブック内の第2シート【定時制制】（シート名は末尾に半角スペース付き）。
 * https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と全く同一のxlsx
 * ブックの2シート目に定時制専用シートが独立して存在した（他県のPDF内後段ページ見落とし
 * パターンとは異なり、こちらは「同一ファイル内の別シート」という見落としパターン）。unzip+
 * sharedStrings.xmlの機械抽出で全18レコードを判読（ビジョン解析不要・高信頼度）。
 *
 * ３区分に分かれる: 「1 普通科を設置する高等学校」（7校・府立）、「2 専門学科のみを設置する
 * 高等学校」（2校・堺市立堺は機械自動車創造・建築創造とマネジメント創造の2学科にまたがる
 * 総合募集[★印]のため1レコードに統合、岸和田市立は産業[商業]）、「3 総合学科のみを設置する
 * 高等学校」（9校・都島工業・りんくう翔南・工芸・今宮工科・藤井寺工科・堺工科・佐野工科・
 * 成城・和泉総合）。列はF=募集人員(quota)・J=学校全体の志願者数(finalApplicants)・
 * L=学校全体の競争率(finalRate、資料に印字済みでそのまま採用)。
 *
 * 機械集計（quota840・applicants398、18校18レコード）が3区分の「合計」行（普通科計370/221/0.6・
 * 専門学科計110/34/0.31・総合学科計360/143/0.4）といずれも完全一致した（初回転記で一致・
 * 再修正なし）。シート全体を通した単一の総合計行は原資料に存在しない（3区分の合計のみ公表）。
 */

export const OSAKA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'osaka',
  sources: [
    {
      url: 'https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx',
      docTitle: '大阪府教育委員会 令和８年度大阪府公立高等学校 一般入学者選抜（定時制の課程）の志願者数（【定時制】シート）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制の課程（普通科7校・専門学科2校・総合学科9校）'],
    pendingDepartments: [],
    note: '【定時制】シートの全18レコード（18校）を完全収録。「普通科計」「専門学科計」「総合学科計」の3区分小計と完全一致。',
  },
  records: [
    { schoolName: '大手前', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '桃谷', department: '普通', quota: 50, finalApplicants: 30, finalRate: 0.6 },
    { schoolName: '桜塚', department: '普通', quota: 80, finalApplicants: 49, finalRate: 0.61 },
    { schoolName: '春日丘', department: '普通', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '寝屋川', department: '普通', quota: 80, finalApplicants: 39, finalRate: 0.49 },
    { schoolName: '布施', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '三国丘', department: '普通', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '堺市立堺', department: '機械自動車創造・建築創造・マネジメント創造（総合募集）', quota: 70, finalApplicants: 19, finalRate: 0.27 },
    { schoolName: '岸和田市立', department: '産業（商業）', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '都島工業', department: '総合学科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: 'りんくう翔南', department: '総合学科', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '工芸', department: '総合学科', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '今宮工科', department: '総合学科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '藤井寺工科', department: '総合学科', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '堺工科', department: '総合学科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '佐野工科', department: '総合学科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '成城', department: '総合学科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '和泉総合', department: '総合学科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
  ],
  officialSubtotals: [
    { label: '普通科計', schoolCount: 7, quota: 370, finalApplicants: 221, finalRate: 0.6 },
    { label: '専門学科計', schoolCount: 2, quota: 110, finalApplicants: 34, finalRate: 0.31 },
    { label: '総合学科計', schoolCount: 9, quota: 360, finalApplicants: 143, finalRate: 0.4 },
  ],
};
