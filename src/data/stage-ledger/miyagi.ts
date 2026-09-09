import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 宮城県 段階台帳（T-Y11F §5順序#7・25県目・全日制129レコードで完結）。
 *
 * 一次ソース: 宮城県教育庁高校教育課「令和8年度宮城県公立高等学校入学者選抜に係る第一次募集等の
 * 合格状況について」（令和8年3月16日公表・全10ページ）。
 * https://www.pref.miyagi.jp/documents/64371/260316_r8daiichizibosyu_goukakujyoukyou.pdf
 *
 * ⚠️quota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてが単一資料
 * （3「第一次募集の合格状況 学校・学科別」表・全68校129学科）に揃う高効率構造（ishikawa・kochi・
 * shimaneと同型）。quota=令和8年度募集定員、applicantsConfirmed=第一次募集出願者数、
 * testTakersConfirmed=第一次募集受験者数（欠席者数を除く）、finalPassers=第一次募集合格者数を
 * それぞれ転記した。
 *
 * ⚠️既存パイプラインとの1件差: 既存パイプライン`competition-rates/miyagi.ts`は本資料より1ヶ月早い
 * 「第一次募集学校・学科別出願状況」（2/13公表）を典拠とするため、仙台高校「普通科」のみ
 * applicantsが1名差（既存313・本台帳314）。他128件は完全一致。本台帳は自資料完結を優先し、
 * 2/13時点と3/16時点の間の志願変更等による差と推測されるため独立に転記した本資料の値を採用した
 * （kumamotoで確認済みの「別時点スナップショット差」と同型）。
 *
 * 4系列すべての機械集計（quota13,400・applicantsConfirmed12,517・testTakersConfirmed12,346・
 * finalPassers11,004、68校129レコード）が資料本文の「全日制合計」行と初回転記で完全一致した
 * （再修正なし）。
 *
 * ⚠️既知の7件: finalPassersがtestTakersConfirmedを上回るのは、いずれも定員に対し出願者数が少ない
 * 小規模学科（大河原産業「企画デザイン科」・仙台東「英語科」・宮城工「電子機械科」・松島「観光科」・
 * 登米総合産業「農業科」・宮城水産「生物環境科」・石巻工「化学技術科」）で、他県で確認した定員割れ
 * 学科の構造的パターンと同型。
 *
 * 定時制・通信制課程は他県と同じ理由でスコープ外。
 */
export const MIYAGI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'miyagi',
  sources: [
    {
      url: 'https://www.pref.miyagi.jp/documents/64371/260316_r8daiichizibosyu_goukakujyoukyou.pdf',
      docTitle: '宮城県教育庁高校教育課 令和8年度宮城県公立高等学校入学者選抜に係る第一次募集等の合格状況について',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（68校（県立64校+市立4校）129学科129レコードを完全収録）'],
    pendingDepartments: ['定時制・通信制課程（他県と同じ理由でスコープ外）'],
    note:
      'quota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてを単一資料' +
      '（第一次募集等の合格状況・3/16）から独立に転記した。4系列すべての機械集計（13,400／12,517／' +
      '12,346／11,004）が資料本文の「全日制合計」行と完全一致した。既存パイプライン（2/13時点の' +
      '出願状況を典拠）とは仙台高校「普通科」のみ1名差（志願変更等による別時点スナップショット差と' +
      '推測）で他128件は完全一致。finalPassersがtestTakersConfirmedを上回る7件は定員割れ学科の' +
      '構造的パターン。定時制・通信制課程は他県と同じ理由でスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制合計', quota: 13400, applicantsConfirmed: 12517, testTakersConfirmed: 12346, finalPassers: 11004 },
  ],
  records: [
    { schoolName: '白石', department: '普通科', quota: 240, applicantsConfirmed: 231, testTakersConfirmed: 229, finalPassers: 228 },
    { schoolName: '白石', department: '看護科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 36 },
    { schoolName: '白石蔵王', department: '普通科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '白石工', department: '機械科', quota: 80, applicantsConfirmed: 50, testTakersConfirmed: 49, finalPassers: 47 },
    { schoolName: '白石工', department: '電気科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '白石工', department: '工業化学科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '白石工', department: '建築科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 29 },
    { schoolName: '白石工', department: '設備工業科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 14 },
    { schoolName: '村田', department: '総合学科', quota: 120, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '大河原産業', department: '農業科学科', quota: 80, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 80 },
    { schoolName: '大河原産業', department: '企画デザイン科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 39 },
    { schoolName: '大河原産業', department: '総合ビジネス科', quota: 120, applicantsConfirmed: 113, testTakersConfirmed: 113, finalPassers: 112 },
    { schoolName: '大河原産川崎', department: '普通科', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '柴田', department: '普通科', quota: 120, applicantsConfirmed: 59, testTakersConfirmed: 59, finalPassers: 59 },
    { schoolName: '柴田', department: '体育科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 34 },
    { schoolName: '角田', department: '普通科', quota: 160, applicantsConfirmed: 120, testTakersConfirmed: 120, finalPassers: 120 },
    { schoolName: '伊具', department: '総合学科', quota: 120, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '名取', department: '普通科', quota: 240, applicantsConfirmed: 263, testTakersConfirmed: 262, finalPassers: 240 },
    { schoolName: '名取', department: '家政科', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '名取北', department: '普通科', quota: 240, applicantsConfirmed: 257, testTakersConfirmed: 252, finalPassers: 240 },
    { schoolName: '亘理', department: '普通科', quota: 80, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '亘理', department: '食品科学科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '亘理', department: '家政科', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '宮城農', department: '農業科・園芸科', quota: 120, applicantsConfirmed: 153, testTakersConfirmed: 153, finalPassers: 120 },
    { schoolName: '宮城農', department: '農業機械科', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '宮城農', department: '食品化学科', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '宮城農', department: '生活科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 40 },
    { schoolName: '仙台一', department: '普通科', quota: 320, applicantsConfirmed: 452, testTakersConfirmed: 449, finalPassers: 321 },
    { schoolName: '仙台二華', department: '普通科', quota: 240, applicantsConfirmed: 268, testTakersConfirmed: 264, finalPassers: 240 },
    { schoolName: '仙台三桜', department: '普通科', quota: 280, applicantsConfirmed: 378, testTakersConfirmed: 365, finalPassers: 280 },
    { schoolName: '仙台向山', department: '普通科', quota: 160, applicantsConfirmed: 204, testTakersConfirmed: 198, finalPassers: 160 },
    { schoolName: '仙台向山', department: '理数科', quota: 40, applicantsConfirmed: 64, testTakersConfirmed: 45, finalPassers: 40 },
    { schoolName: '仙台南', department: '普通科', quota: 280, applicantsConfirmed: 385, testTakersConfirmed: 380, finalPassers: 280 },
    { schoolName: '仙台西', department: '普通科', quota: 240, applicantsConfirmed: 225, testTakersConfirmed: 222, finalPassers: 221 },
    { schoolName: '仙台東', department: '普通科', quota: 200, applicantsConfirmed: 251, testTakersConfirmed: 250, finalPassers: 200 },
    { schoolName: '仙台東', department: '英語科', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 40 },
    { schoolName: '宮城工', department: '機械科', quota: 80, applicantsConfirmed: 93, testTakersConfirmed: 93, finalPassers: 80 },
    { schoolName: '宮城工', department: '電子機械科', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 40 },
    { schoolName: '宮城工', department: '電気科', quota: 80, applicantsConfirmed: 105, testTakersConfirmed: 103, finalPassers: 80 },
    { schoolName: '宮城工', department: '情報技術科', quota: 40, applicantsConfirmed: 67, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '宮城工', department: '化学工業科', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 48, finalPassers: 40 },
    { schoolName: '宮城工', department: 'インテリア科', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 48, finalPassers: 40 },
    { schoolName: '仙台工', department: '建築科', quota: 30, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 30 },
    { schoolName: '仙台工', department: '機械科', quota: 60, applicantsConfirmed: 72, testTakersConfirmed: 70, finalPassers: 60 },
    { schoolName: '仙台工', department: '電気科', quota: 40, applicantsConfirmed: 52, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '仙台工', department: '土木科', quota: 30, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 30 },
    { schoolName: '仙台工', department: '情報科', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 45, finalPassers: 40 },
    { schoolName: '仙台二', department: '普通科', quota: 320, applicantsConfirmed: 381, testTakersConfirmed: 381, finalPassers: 320 },
    { schoolName: '仙台三', department: '普通科', quota: 240, applicantsConfirmed: 326, testTakersConfirmed: 325, finalPassers: 240 },
    { schoolName: '仙台三', department: '理数科', quota: 80, applicantsConfirmed: 96, testTakersConfirmed: 94, finalPassers: 80 },
    { schoolName: '宮城一', department: '普通科', quota: 200, applicantsConfirmed: 321, testTakersConfirmed: 320, finalPassers: 200 },
    { schoolName: '宮城一', department: '国際探究科・理数探究科', quota: 80, applicantsConfirmed: 108, testTakersConfirmed: 107, finalPassers: 80 },
    { schoolName: '宮城広瀬', department: '普通科', quota: 240, applicantsConfirmed: 99, testTakersConfirmed: 99, finalPassers: 99 },
    { schoolName: '泉', department: '普通科', quota: 200, applicantsConfirmed: 266, testTakersConfirmed: 258, finalPassers: 200 },
    { schoolName: '泉', department: '英語科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 49, finalPassers: 40 },
    { schoolName: '泉松陵', department: '普通科', quota: 240, applicantsConfirmed: 185, testTakersConfirmed: 183, finalPassers: 183 },
    { schoolName: '泉館山', department: '普通科', quota: 240, applicantsConfirmed: 293, testTakersConfirmed: 289, finalPassers: 240 },
    { schoolName: '宮城野', department: '普通科', quota: 200, applicantsConfirmed: 225, testTakersConfirmed: 220, finalPassers: 200 },
    { schoolName: '宮城野', department: '美術科', quota: 40, applicantsConfirmed: 59, testTakersConfirmed: 59, finalPassers: 40 },
    { schoolName: '仙台', department: '普通科', quota: 280, applicantsConfirmed: 314, testTakersConfirmed: 307, finalPassers: 280 },
    { schoolName: '仙台商', department: '商業科', quota: 320, applicantsConfirmed: 376, testTakersConfirmed: 375, finalPassers: 320 },
    { schoolName: '塩釜', department: '普通科', quota: 200, applicantsConfirmed: 255, testTakersConfirmed: 254, finalPassers: 200 },
    { schoolName: '塩釜', department: 'ビジネス科', quota: 80, applicantsConfirmed: 123, testTakersConfirmed: 122, finalPassers: 80 },
    { schoolName: '多賀城', department: '普通科', quota: 240, applicantsConfirmed: 275, testTakersConfirmed: 268, finalPassers: 240 },
    { schoolName: '多賀城', department: '災害科学科', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '松島', department: '普通科', quota: 80, applicantsConfirmed: 91, testTakersConfirmed: 89, finalPassers: 80 },
    { schoolName: '松島', department: '観光科', quota: 80, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 62 },
    { schoolName: '利府', department: '普通科', quota: 200, applicantsConfirmed: 175, testTakersConfirmed: 174, finalPassers: 173 },
    { schoolName: '利府', department: 'スポーツ科学科', quota: 80, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 67 },
    { schoolName: '黒川', department: '普通科', quota: 80, applicantsConfirmed: 56, testTakersConfirmed: 56, finalPassers: 56 },
    { schoolName: '黒川', department: '機械科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '黒川', department: '電子工学科', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '黒川', department: '環境技術科', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '富谷', department: '普通科', quota: 240, applicantsConfirmed: 242, testTakersConfirmed: 236, finalPassers: 235 },
    { schoolName: '古川', department: '普通科', quota: 240, applicantsConfirmed: 213, testTakersConfirmed: 206, finalPassers: 205 },
    { schoolName: '古川黎明', department: '普通科', quota: 240, applicantsConfirmed: 219, testTakersConfirmed: 219, finalPassers: 219 },
    { schoolName: '岩出山', department: '普通科', quota: 80, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '中新田', department: '普通科', quota: 120, applicantsConfirmed: 80, testTakersConfirmed: 79, finalPassers: 79 },
    { schoolName: '松山', department: '普通科', quota: 40, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '松山', department: '家政科', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '加美農', department: '農業科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '加美農', department: '農業機械科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '加美農', department: '生活技術科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '古川工', department: '土木情報科', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '古川工', department: '建築科', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 25 },
    { schoolName: '古川工', department: '電気電子科', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '古川工', department: '機械科', quota: 80, applicantsConfirmed: 78, testTakersConfirmed: 78, finalPassers: 77 },
    { schoolName: '古川工', department: '化学技術科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '鹿島台商', department: '商業科', quota: 80, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '涌谷', department: '普通科', quota: 120, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '小牛田農林', department: '農業技術科・農業科学コース', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 36 },
    { schoolName: '小牛田農林', department: '農業技術科・農業土木コース', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 34 },
    { schoolName: '小牛田農林', department: '総合学科', quota: 120, applicantsConfirmed: 118, testTakersConfirmed: 116, finalPassers: 116 },
    { schoolName: '南郷', department: '普通科', quota: 40, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '南郷', department: '産業技術科', quota: 40, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '佐沼', department: '普通科', quota: 240, applicantsConfirmed: 239, testTakersConfirmed: 238, finalPassers: 238 },
    { schoolName: '登米', department: '普通科', quota: 80, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 48 },
    { schoolName: '登米総合産業', department: '農業科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 29 },
    { schoolName: '登米総合産業', department: '機械科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '登米総合産業', department: '電気科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 15 },
    { schoolName: '登米総合産業', department: '情報技術科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 29 },
    { schoolName: '登米総合産業', department: '商業科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '登米総合産業', department: '福祉科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '築館', department: '普通科', quota: 160, applicantsConfirmed: 159, testTakersConfirmed: 158, finalPassers: 156 },
    { schoolName: '築館一迫商業', department: '情報ビジネス科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 19 },
    { schoolName: '岩ヶ崎', department: '普通科', quota: 80, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '迫桜', department: '総合学科', quota: 160, applicantsConfirmed: 80, testTakersConfirmed: 80, finalPassers: 80 },
    { schoolName: '石巻', department: '普通科', quota: 240, applicantsConfirmed: 213, testTakersConfirmed: 209, finalPassers: 209 },
    { schoolName: '石巻好文館', department: '普通科', quota: 200, applicantsConfirmed: 168, testTakersConfirmed: 166, finalPassers: 166 },
    { schoolName: '石巻西', department: '普通科', quota: 160, applicantsConfirmed: 170, testTakersConfirmed: 170, finalPassers: 160 },
    { schoolName: '石巻北', department: '総合学科', quota: 160, applicantsConfirmed: 73, testTakersConfirmed: 73, finalPassers: 73 },
    { schoolName: '宮城水産', department: '船舶運航科', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 32 },
    { schoolName: '宮城水産', department: '生物環境科', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 31 },
    { schoolName: '宮城水産', department: '食品科', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '石巻工', department: '機械科', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '石巻工', department: '電気情報科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 36 },
    { schoolName: '石巻工', department: '化学技術科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 28 },
    { schoolName: '石巻工', department: '土木システム科', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '石巻工', department: '建築科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '石巻商', department: '総合ビジネス科', quota: 160, applicantsConfirmed: 75, testTakersConfirmed: 75, finalPassers: 75 },
    { schoolName: '桜坂', department: '普通科・学励探求コース', quota: 80, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 43 },
    { schoolName: '桜坂', department: '普通科・キャリア探求コース', quota: 80, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 53 },
    { schoolName: '気仙沼', department: '普通科', quota: 240, applicantsConfirmed: 202, testTakersConfirmed: 200, finalPassers: 200 },
    { schoolName: '南三陸', department: '普通科', quota: 80, applicantsConfirmed: 22, testTakersConfirmed: 21, finalPassers: 20 },
    { schoolName: '南三陸', department: '情報ビジネス科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 10 },
    { schoolName: '本吉響', department: '総合学科', quota: 120, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '気仙沼向洋', department: '情報海洋科', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '気仙沼向洋', department: '産業経済科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '気仙沼向洋', department: '機械技術科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
  ],
};
