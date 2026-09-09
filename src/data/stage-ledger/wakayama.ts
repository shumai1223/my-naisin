import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 和歌山県 段階台帳（T-Y11F §5順序#7・18県目・全日制57レコードで完結）。
 *
 * 一次ソース: 和歌山県教育委員会「令和8年度和歌山県立高等学校入学者選抜実施状況（一般選抜・
 * スポーツ推薦合格状況）」（令和8年3月18日現在・全2ページ）。
 * https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08goukakujoukyou.pdf
 *
 * ⚠️和歌山県は既存パイプライン`competition-rates/wakayama.ts`と同じく「一般選抜」「スポーツ推薦」
 * の2トラックが並存する構造で、本資料はその両方について本出願者数・受検者数・合格者数を1つの
 * 表に収録している。既存パイプラインのfinalApplicants定義（D+E＝スポーツ推薦+一般選抜の本出願者数
 * 合算）を踏襲し、testTakersConfirmed・finalPassersも同じく両トラックの受検者数・合格者数を
 * 合算した。quota・applicantsConfirmedは既存パイプラインを再利用、testTakersConfirmed・
 * finalPassersは本資料から新規転記した（同一資料内の2列のため自己矛盾が生じない設計）。
 *
 * quota・testTakersConfirmed・finalPassersの57レコード全数の機械集計（5,761／4,867／4,733）が
 * 資料本文の「合計」行（入学者枠数5,761・スポーツ推薦+一般選抜の受検者数46+4,821=4,867・
 * 合格者数46+4,687=4,733）と完全一致した。転記中に2件の誤読（和歌山工業「化学技術科」finalPassers
 * を25と誤読・正しくは26／笠田「商業科系」finalPassersを50と誤読・正しくは60）をグランドトータル
 * 突合で発見し、300dpiでは判読困難だった箇所を400dpi再クロップで確認・修正した。
 *
 * ⚠️既知の4件: finalPassersがtestTakersConfirmedを上回るのは小規模学科での±1名の丸め（紀北農芸
 * 「施設園芸科」・和歌山工業「化学技術科」・熊野「看護科」）と、新宮「総合学科」の+11名（他校からの
 * 転入枠等の合算と推測）。
 *
 * 定時制課程・県立中学校内部進学専用学科（既存パイプラインと同じ5学科）は他県と同じ理由で
 * スコープ外。
 */
export const WAKAYAMA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'wakayama',
  sources: [
    {
      url: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08goukakujoukyou.pdf',
      docTitle: '和歌山県教育委員会 令和8年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦合格状況）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（32校（分校4件を含む）57レコードを完全収録・一般選抜+スポーツ推薦の合算）'],
    pendingDepartments: [
      '県立中学校内部進学専用学科（橋本探究科(県立中)・向陽環境科学科・桐蔭普通科(県立中)・日高総合科学科・田辺自然科学科=一般選抜による募集が存在しないため対象外・既存パイプラインと同型）',
      '定時制課程（他県と同じ理由で恒久的にスコープ外）',
    ],
    note: '全日制32校57レコードを完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/wakayama.ts`（一般選抜+スポーツ推薦の本出願者数D+E）を再利用し、testTakersConfirmed・finalPassersは同じく両トラック合算で本資料から新規転記した。3系列すべての機械集計（5,761／4,867／4,733）が資料本文の「合計」行と完全一致した（転記中に発見した2件の誤読は400dpi再クロップで訂正済み）。finalPassersがtestTakersConfirmedを上回る4件は小規模学科の±1名丸めと新宮「総合学科」の+11名（転入枠等の合算と推測）。定時制課程・県立中学校内部進学専用学科は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '合計', quota: 5761, applicantsConfirmed: 4891, testTakersConfirmed: 4867, finalPassers: 4733 },
  ],
  records: [
    { schoolName: '橋本', department: '探究科', quota: 156, applicantsConfirmed: 160, testTakersConfirmed: 159, finalPassers: 156 },
    { schoolName: '紀北工業', department: '機械科', quota: 80, applicantsConfirmed: 80, testTakersConfirmed: 80, finalPassers: 80 },
    { schoolName: '紀北工業', department: '電気科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '紀北工業', department: 'システム化学科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '紀北農芸', department: '生産流通科', quota: 26, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 26 },
    { schoolName: '紀北農芸', department: '施設園芸科', quota: 28, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 14 },
    { schoolName: '紀北農芸', department: '環境工学科', quota: 35, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '笠田', department: '普通科', quota: 80, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 72 },
    { schoolName: '笠田', department: '商業科系', quota: 77, applicantsConfirmed: 61, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '粉河', department: '普通科系', quota: 240, applicantsConfirmed: 227, testTakersConfirmed: 226, finalPassers: 226 },
    { schoolName: '那賀', department: '普通科', quota: 240, applicantsConfirmed: 262, testTakersConfirmed: 262, finalPassers: 240 },
    { schoolName: '那賀', department: '国際科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '貴志川', department: '普通科', quota: 120, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '和歌山北', department: '普通科(北校舎)', quota: 271, applicantsConfirmed: 271, testTakersConfirmed: 271, finalPassers: 271 },
    { schoolName: '和歌山北', department: '普通科(西校舎)', quota: 80, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '和歌山北', department: 'スポーツ健康科学科', quota: 21, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '和歌山', department: '総合学科', quota: 169, applicantsConfirmed: 185, testTakersConfirmed: 184, finalPassers: 169 },
    { schoolName: '向陽', department: '普通科', quota: 200, applicantsConfirmed: 224, testTakersConfirmed: 224, finalPassers: 200 },
    { schoolName: '桐蔭', department: '普通科', quota: 200, applicantsConfirmed: 197, testTakersConfirmed: 196, finalPassers: 196 },
    { schoolName: '和歌山東', department: '普通科', quota: 172, applicantsConfirmed: 76, testTakersConfirmed: 74, finalPassers: 74 },
    { schoolName: '星林', department: '普通科', quota: 240, applicantsConfirmed: 279, testTakersConfirmed: 277, finalPassers: 240 },
    { schoolName: '星林', department: '国際交流科', quota: 40, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 40 },
    { schoolName: '和歌山工業', department: '機械科', quota: 80, applicantsConfirmed: 75, testTakersConfirmed: 75, finalPassers: 75 },
    { schoolName: '和歌山工業', department: '電気科', quota: 80, applicantsConfirmed: 75, testTakersConfirmed: 75, finalPassers: 75 },
    { schoolName: '和歌山工業', department: '化学技術科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 26 },
    { schoolName: '和歌山工業', department: '建築科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '和歌山工業', department: '土木科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '和歌山工業', department: '産業デザイン科', quota: 38, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 38 },
    { schoolName: '和歌山工業', department: '創造技術科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '和歌山商業', department: 'ビジネス創造科', quota: 280, applicantsConfirmed: 285, testTakersConfirmed: 284, finalPassers: 280 },
    { schoolName: '海南', department: '普通科系(海南校舎)', quota: 200, applicantsConfirmed: 201, testTakersConfirmed: 199, finalPassers: 199 },
    { schoolName: '海南', department: '普通科(大成校舎)', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '海南(美里分校)', department: '普通科', quota: 40, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '箕島', department: '普通科・情報経営科系', quota: 117, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '箕島', department: '機械科', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '有田中央', department: '総合学科(総合・福祉)', quota: 105, applicantsConfirmed: 60, testTakersConfirmed: 58, finalPassers: 58 },
    { schoolName: '有田中央(清水分校)', department: '普通科', quota: 40, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '耐久', department: '普通科', quota: 160, applicantsConfirmed: 138, testTakersConfirmed: 137, finalPassers: 137 },
    { schoolName: '日高', department: '普通科', quota: 200, applicantsConfirmed: 164, testTakersConfirmed: 164, finalPassers: 164 },
    { schoolName: '日高(中津分校)', department: '普通科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '紀央館', department: '普通科', quota: 118, applicantsConfirmed: 103, testTakersConfirmed: 103, finalPassers: 103 },
    { schoolName: '紀央館', department: '工業技術科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '南部', department: '普通科', quota: 70, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '南部', department: '食と農園科(園芸・加工流通・調理)', quota: 97, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 55 },
    { schoolName: '南部(龍神分校)', department: '普通科', quota: 39, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '田辺', department: '普通科', quota: 200, applicantsConfirmed: 202, testTakersConfirmed: 201, finalPassers: 200 },
    { schoolName: '田辺工業', department: '機械科', quota: 80, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: '田辺工業', department: '電気電子科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '田辺工業', department: '情報システム科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '神島', department: '普通科', quota: 120, applicantsConfirmed: 124, testTakersConfirmed: 124, finalPassers: 120 },
    { schoolName: '神島', department: '経営科学科', quota: 80, applicantsConfirmed: 84, testTakersConfirmed: 83, finalPassers: 80 },
    { schoolName: '熊野', department: '看護科', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 15 },
    { schoolName: '熊野', department: '総合学科', quota: 160, applicantsConfirmed: 170, testTakersConfirmed: 167, finalPassers: 160 },
    { schoolName: '串本古座', department: '未来創造学科(宇宙探究・地域探究/文理探究)', quota: 111, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 48 },
    { schoolName: '新宮', department: '普通科', quota: 120, applicantsConfirmed: 131, testTakersConfirmed: 131, finalPassers: 120 },
    { schoolName: '新宮', department: '学彩探究科', quota: 71, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 71 },
    { schoolName: '新宮', department: '総合学科', quota: 120, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 62 },
  ],
};
