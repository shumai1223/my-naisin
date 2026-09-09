import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 徳島県 段階台帳（T-Y11F §5順序#7・17県目・全日制69レコードで完結）。
 *
 * 一次ソース: 徳島県教育委員会「令和8年度徳島県公立高等学校一般選抜受検状況（3月10日追検査・
 * 追面接終了後）」＋「令和8年度徳島県公立高等学校一般選抜合格状況（3月13日現在）」の2資料。
 * https://nyuushi.tokushima-ec.ed.jp/file/980
 * https://nyuushi.tokushima-ec.ed.jp/file/981
 *
 * ⚠️両PDFとも学校名の折返しレイアウトを含む2段組・pdftotextは数値のみ抽出できるため、
 * pdftoppm 200dpi + ビジョン読み取りで転記した。
 *
 * quota・testTakersConfirmedは受検状況資料、finalPassersは合格状況資料の合格者数列から転記。
 * applicantsConfirmedのみ既存パイプライン`competition-rates/tokushima.ts`（出願状況2/26）を
 * 再利用。
 *
 * ⚠️★既存パイプラインのバグを発見・修正（本台帳の調査中）: 既存パイプラインの「那賀・普通」
 * （quota47/applicants43）と「海部・普通」（quota30/applicants25）は学校名が入れ替わっていた。
 * 本台帳の受検状況・合格状況・独立第三資料（一般選抜募集人員）の3資料すべてで「那賀=30前後
 * （小規模）・海部=47（中規模）」と一致し、かつR7〜R5の3年度分もすべて同じ大小関係（那賀23〜33・
 * 海部48〜50）だったため、R8のみ逆転していたのは転記時の学校名取り違えと判断し
 * `competition-rates/tokushima.ts`側を訂正した（値は無変更・学校名の帰属のみ訂正）。
 *
 * quota・testTakersConfirmed・finalPassersの69レコード全数の機械集計（4,165／4,152／4,010）が
 * 両資料本文の「合計」行と完全一致した（初回転記で一致・再修正なし）。
 *
 * ⚠️既知の10件: finalPassersがtestTakersConfirmedを上回るのは主に理数科・専門学科（例: 富岡西
 * 「理数」quota30・testTakers18・finalPassers30）で、他県と同型の複数選抜トラックの合算・
 * 学科間再配分と推測される。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const TOKUSHIMA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'tokushima',
  sources: [
    {
      url: 'https://nyuushi.tokushima-ec.ed.jp/file/980',
      docTitle: '徳島県教育委員会 令和8年度徳島県公立高等学校一般選抜受検状況（3月10日追検査・追面接終了後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://nyuushi.tokushima-ec.ed.jp/file/981',
      docTitle: '徳島県教育委員会 令和8年度徳島県公立高等学校一般選抜合格状況（3月13日現在）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（32校69レコードを完全収録）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制32校69レコードを完全収録。quota・testTakersConfirmedは受検状況資料、finalPassersは合格状況資料から転記し、applicantsConfirmedのみ既存パイプライン`competition-rates/tokushima.ts`（出願状況2/26）を再利用。3系列すべての機械集計（4,165／4,152／4,010）が両資料本文の「合計」行と完全一致した。本台帳の調査過程で既存パイプラインの「那賀・海部」の学校名取り違えバグ（R8のみ発生・R7〜R5は正しい大小関係）を発見し、competition-rates/tokushima.ts側を訂正した。finalPassersがtestTakersConfirmedを上回る10件は主に理数科・専門学科で、他県と同型の複数選抜トラック合算・学科間再配分と推測。定時制課程は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制合計', quota: 4165, applicantsConfirmed: 4160, testTakersConfirmed: 4152, finalPassers: 4010 },
  ],
  records: [
    { schoolName: '城東', department: '普通', quota: 251, applicantsConfirmed: 243, testTakersConfirmed: 243, finalPassers: 242 },
    { schoolName: '城南', department: '普通', quota: 210, applicantsConfirmed: 221, testTakersConfirmed: 221, finalPassers: 210 },
    { schoolName: '城南', department: '応用数理', quota: 28, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 28 },
    { schoolName: '城北', department: '普通', quota: 217, applicantsConfirmed: 229, testTakersConfirmed: 229, finalPassers: 217 },
    { schoolName: '城北', department: '理数科学', quota: 27, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 27 },
    { schoolName: '徳島北', department: '普通', quota: 214, applicantsConfirmed: 216, testTakersConfirmed: 216, finalPassers: 212 },
    { schoolName: '徳島北', department: '国際英語', quota: 38, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 38 },
    { schoolName: '徳島市立', department: '普通', quota: 248, applicantsConfirmed: 253, testTakersConfirmed: 253, finalPassers: 248 },
    { schoolName: '徳島市立', department: '理数', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 30 },
    { schoolName: '城西', department: '生産技術', quota: 18, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 18 },
    { schoolName: '城西', department: '植物活用', quota: 20, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 20 },
    { schoolName: '城西', department: '食品科学', quota: 24, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 24 },
    { schoolName: '城西', department: 'アグリビジネス', quota: 24, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 24 },
    { schoolName: '城西', department: '総合', quota: 62, applicantsConfirmed: 70, testTakersConfirmed: 70, finalPassers: 62 },
    { schoolName: '城西・神山', department: '地域創生類', quota: 26, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 25 },
    { schoolName: '徳島科学技術', department: '総合科学類', quota: 54, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 54 },
    { schoolName: '徳島科学技術', department: '機械技術類', quota: 56, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 52 },
    { schoolName: '徳島科学技術', department: '電気技術類', quota: 53, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 48 },
    { schoolName: '徳島科学技術', department: '建設技術類', quota: 62, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 59 },
    { schoolName: '徳島科学技術', department: '海洋科学類', quota: 10, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 10 },
    { schoolName: '徳島科学技術', department: '海洋技術類', quota: 18, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '徳島商業', department: 'ビジネス探究', quota: 56, applicantsConfirmed: 57, testTakersConfirmed: 56, finalPassers: 56 },
    { schoolName: '徳島商業', department: 'ビジネス創造', quota: 149, applicantsConfirmed: 156, testTakersConfirmed: 156, finalPassers: 149 },
    { schoolName: '小松島', department: '普通', quota: 154, applicantsConfirmed: 157, testTakersConfirmed: 157, finalPassers: 154 },
    { schoolName: '小松島西', department: '商業', quota: 38, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 38 },
    { schoolName: '小松島西', department: '食物', quota: 64, applicantsConfirmed: 67, testTakersConfirmed: 67, finalPassers: 64 },
    { schoolName: '小松島西', department: '生活文化', quota: 20, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '小松島西', department: '福祉', quota: 30, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 30 },
    { schoolName: '小松島西・勝浦', department: '応用生産', quota: 12, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 11 },
    { schoolName: '小松島西・勝浦', department: '園芸福祉', quota: 13, applicantsConfirmed: 6, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '富岡東', department: '普通', quota: 73, applicantsConfirmed: 60, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '富岡東', department: '商業', quota: 17, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '富岡東・羽ノ浦', department: '看護', quota: 33, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '富岡西', department: '普通', quota: 147, applicantsConfirmed: 160, testTakersConfirmed: 160, finalPassers: 147 },
    { schoolName: '富岡西', department: '理数', quota: 30, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 30 },
    { schoolName: '阿南光', department: '機械ロボットシステム', quota: 25, applicantsConfirmed: 28, testTakersConfirmed: 27, finalPassers: 25 },
    { schoolName: '阿南光', department: '電気情報システム', quota: 23, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 23 },
    { schoolName: '阿南光', department: '都市環境システム', quota: 25, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 25 },
    { schoolName: '阿南光', department: '産業創造', quota: 64, applicantsConfirmed: 77, testTakersConfirmed: 76, finalPassers: 64 },
    { schoolName: '那賀', department: '普通', quota: 30, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '那賀', department: '森林クリエイト', quota: 13, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '海部', department: '普通', quota: 47, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 42 },
    { schoolName: '海部', department: '情報ビジネス', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '海部', department: '数理科学', quota: 28, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '鳴門', department: '普通', quota: 236, applicantsConfirmed: 239, testTakersConfirmed: 239, finalPassers: 236 },
    { schoolName: '鳴門渦潮', department: '総合', quota: 108, applicantsConfirmed: 124, testTakersConfirmed: 123, finalPassers: 108 },
    { schoolName: '板野', department: '普通', quota: 118, applicantsConfirmed: 138, testTakersConfirmed: 138, finalPassers: 118 },
    { schoolName: '名西', department: '普通', quota: 56, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 55 },
    { schoolName: '名西', department: '芸術（音楽）', quota: 4, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '吉野川', department: '農業科学', quota: 12, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 12 },
    { schoolName: '吉野川', department: '生物活用', quota: 15, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '吉野川', department: '会計ビジネス', quota: 20, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 17 },
    { schoolName: '吉野川', department: '情報ビジネス', quota: 19, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 19 },
    { schoolName: '吉野川', department: '食ビジネス', quota: 23, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 23 },
    { schoolName: '川島', department: '普通', quota: 61, applicantsConfirmed: 61, testTakersConfirmed: 61, finalPassers: 61 },
    { schoolName: '阿波', department: '普通', quota: 131, applicantsConfirmed: 131, testTakersConfirmed: 131, finalPassers: 131 },
    { schoolName: '阿波西', department: '普通', quota: 20, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '穴吹', department: '普通', quota: 38, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 38 },
    { schoolName: '脇町', department: '普通', quota: 158, applicantsConfirmed: 157, testTakersConfirmed: 157, finalPassers: 156 },
    { schoolName: 'つるぎ', department: '電気', quota: 33, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: 'つるぎ', department: '機械', quota: 34, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: 'つるぎ', department: '建設', quota: 15, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: 'つるぎ', department: '商業', quota: 24, applicantsConfirmed: 22, testTakersConfirmed: 21, finalPassers: 20 },
    { schoolName: 'つるぎ', department: '地域ビジネス', quota: 19, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 14 },
    { schoolName: '池田', department: '普通', quota: 101, applicantsConfirmed: 79, testTakersConfirmed: 79, finalPassers: 79 },
    { schoolName: '池田', department: '探究', quota: 35, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '池田・辻', department: '総合', quota: 41, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '池田・三好', department: '食農科学', quota: 20, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '池田・三好', department: '環境資源', quota: 15, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 5 },
  ],
};
