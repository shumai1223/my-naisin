import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 京都府 段階台帳（T-Y11F §5順序#7・26県目・全日制75レコードで完結）。
 *
 * 一次ソース: 京都府教育委員会「令和8年度京都府公立高等学校入学者選抜　中期選抜合格者数等一覧表」
 * （令和8年3月17日発表・全4ページ）。
 * https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2026/04/公立高校中期選抜合格者数-1-1.pdf
 *
 * ⚠️quota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてが単一資料
 * （学校別一覧表・列[募集定員(A)/中期選抜募集人員(B)/志願者数(C)/受検者数(D)/合格者数(E)]）に
 * 揃う高効率構造。quota=B（中期選抜募集人員）、applicantsConfirmed=C（第1志望第1順位の人数）、
 * testTakersConfirmed=D（追検査受検者を含む）、finalPassers=Eをそれぞれ転記した。既存パイプライン
 * `competition-rates/kyoto.ts`のquota・applicantsConfirmed定義と完全一致（同一資料系列）。
 *
 * ⚠️既存パイプラインが確立済みの2つの扱いを継承: ①綾部（東）の「農業・園芸」は資料上「両学科併せて」
 * 定員9人のくくり募集のため単一レコード（農業・園芸(くくり)）に合算。②「京都フォレスト」は北桑田
 * 高等学校の学科名だが資料上は別行で掲載されるため、既存パイプラインと同じくschoolName='京都
 * フォレスト'の独立レコードとして収録した（実体は同一校だが資料の行構造をそのまま反映する既存方針）。
 *
 * 4系列すべての機械集計（quota6,048・applicantsConfirmed5,160・testTakersConfirmed5,146・
 * finalPassers4,906、75レコード）が資料本文の「全日制計」行と初回転記で完全一致した
 * （再修正なし）。
 *
 * ⚠️既知の27件: finalPassersがtestTakersConfirmedを上回るのは、京都府の中期選抜が第1〜第3志望
 * まで出願できる制度（既存パイプラインの header comment 参照）のため。testTakersConfirmed
 * （＝第1志望第1順位者の受検者数）に対し、finalPassersは第2・第3志望での合格者も含むため、
 * 定員割れ学科では他校の1志望不合格者が２・３志望で流入し逆転が発生する。既知の4件（applicants
 * =0の完全未充足学科）も別途記録した。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const KYOTO_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'kyoto',
  sources: [
    {
      url: 'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2026/04/公立高校中期選抜合格者数-1-1.pdf',
      docTitle: '京都府教育委員会 令和8年度京都府公立高等学校入学者選抜 中期選抜合格者数等一覧表',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（中期選抜・75レコードを完全収録）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note:
      'quota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてを単一資料' +
      '（中期選抜合格者数等一覧表・3/17）から独立に転記した。4系列すべての機械集計（6,048／5,160／' +
      '5,146／4,906）が資料本文の「全日制計」行と完全一致した。既存パイプラインのquota・' +
      'applicantsConfirmed定義と全75件完全一致。finalPassersがtestTakersConfirmedを上回る27件は' +
      '京都府中期選抜の第1〜第3志望制度（志望校間の合格者再配分）による構造的な挙動。定時制課程は' +
      '他県と同じ理由でスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制計', quota: 6048, applicantsConfirmed: 5160, testTakersConfirmed: 5146, finalPassers: 4906 },
  ],
  records: [
    { schoolName: '山城', department: '普通[単位制]', quota: 224, applicantsConfirmed: 268, testTakersConfirmed: 268, finalPassers: 224 },
    { schoolName: '鴨沂', department: '普通', quota: 168, applicantsConfirmed: 207, testTakersConfirmed: 207, finalPassers: 168 },
    { schoolName: '洛北', department: '普通[単位制]', quota: 112, applicantsConfirmed: 135, testTakersConfirmed: 134, finalPassers: 112 },
    { schoolName: '北稜', department: '普通', quota: 168, applicantsConfirmed: 160, testTakersConfirmed: 160, finalPassers: 168 },
    { schoolName: '朱雀', department: '普通', quota: 134, applicantsConfirmed: 119, testTakersConfirmed: 117, finalPassers: 131 },
    { schoolName: '洛東', department: '普通', quota: 168, applicantsConfirmed: 125, testTakersConfirmed: 123, finalPassers: 140 },
    { schoolName: '鳥羽', department: '普通[単位制]', quota: 112, applicantsConfirmed: 125, testTakersConfirmed: 125, finalPassers: 112 },
    { schoolName: '嵯峨野', department: '普通', quota: 84, applicantsConfirmed: 96, testTakersConfirmed: 96, finalPassers: 84 },
    { schoolName: '北嵯峨', department: '普通', quota: 196, applicantsConfirmed: 176, testTakersConfirmed: 176, finalPassers: 191 },
    { schoolName: '桂', department: '普通', quota: 196, applicantsConfirmed: 215, testTakersConfirmed: 215, finalPassers: 196 },
    { schoolName: '桂', department: '植物クリエイト', quota: 12, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 9 },
    { schoolName: '桂', department: '園芸ビジネス', quota: 12, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 12 },
    { schoolName: '洛西', department: '普通', quota: 168, applicantsConfirmed: 141, testTakersConfirmed: 141, finalPassers: 162 },
    { schoolName: '桃山', department: '普通', quota: 196, applicantsConfirmed: 241, testTakersConfirmed: 239, finalPassers: 196 },
    { schoolName: '東稜', department: '普通', quota: 140, applicantsConfirmed: 83, testTakersConfirmed: 82, finalPassers: 94 },
    { schoolName: '洛水', department: '普通', quota: 112, applicantsConfirmed: 28, testTakersConfirmed: 27, finalPassers: 30 },
    { schoolName: '京都すばる', department: '商業学科群', quota: 60, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 43 },
    { schoolName: '京都すばる', department: '情報科学', quota: 24, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '向陽', department: '普通', quota: 140, applicantsConfirmed: 134, testTakersConfirmed: 134, finalPassers: 140 },
    { schoolName: '乙訓', department: '普通', quota: 137, applicantsConfirmed: 132, testTakersConfirmed: 132, finalPassers: 137 },
    { schoolName: '西乙訓', department: '普通', quota: 112, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 30 },
    { schoolName: '京都工学院', department: 'ものづくり分野', quota: 33, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '京都工学院', department: 'まちづくり分野', quota: 22, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '堀川', department: '普通', quota: 56, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 56 },
    { schoolName: '日吉ケ丘', department: '普通[単位制]', quota: 168, applicantsConfirmed: 216, testTakersConfirmed: 216, finalPassers: 168 },
    { schoolName: '紫野', department: '普通', quota: 140, applicantsConfirmed: 164, testTakersConfirmed: 164, finalPassers: 140 },
    { schoolName: '開建', department: 'ルミノベーション', quota: 120, applicantsConfirmed: 158, testTakersConfirmed: 158, finalPassers: 120 },
    { schoolName: '東宇治', department: '普通', quota: 168, applicantsConfirmed: 173, testTakersConfirmed: 171, finalPassers: 168 },
    { schoolName: '莵道', department: '普通', quota: 168, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 124 },
    { schoolName: '城南菱創', department: '普通[単位制]', quota: 80, applicantsConfirmed: 112, testTakersConfirmed: 111, finalPassers: 80 },
    { schoolName: '城陽', department: '普通', quota: 158, applicantsConfirmed: 134, testTakersConfirmed: 134, finalPassers: 144 },
    { schoolName: '西城陽', department: '普通', quota: 168, applicantsConfirmed: 154, testTakersConfirmed: 154, finalPassers: 160 },
    { schoolName: '京都八幡', department: '普通(総合選択制)', quota: 94, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 9 },
    { schoolName: '京都八幡(南)', department: '介護福祉', quota: 23, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '京都八幡(南)', department: '人間科学', quota: 18, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '久御山', department: '普通', quota: 140, applicantsConfirmed: 109, testTakersConfirmed: 109, finalPassers: 110 },
    { schoolName: '田辺', department: '普通', quota: 112, applicantsConfirmed: 141, testTakersConfirmed: 140, finalPassers: 112 },
    { schoolName: '田辺', department: '工学探究', quota: 28, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 3 },
    { schoolName: '田辺', department: '機械技術', quota: 9, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 9 },
    { schoolName: '田辺', department: '電気技術', quota: 9, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 9 },
    { schoolName: '田辺', department: '自動車', quota: 9, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 9 },
    { schoolName: '木津', department: '普通', quota: 112, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 46 },
    { schoolName: '木津', department: 'システム園芸', quota: 12, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '木津', department: '情報企画', quota: 20, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 3 },
    { schoolName: '南陽', department: '普通', quota: 112, applicantsConfirmed: 122, testTakersConfirmed: 121, finalPassers: 112 },
    { schoolName: '北桑田', department: '普通', quota: 42, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '京都フォレスト', department: '京都フォレスト', quota: 10, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '亀岡', department: '普通[単位制]', quota: 140, applicantsConfirmed: 165, testTakersConfirmed: 165, finalPassers: 140 },
    { schoolName: '南丹', department: '総合学科[単位制]', quota: 64, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 13 },
    { schoolName: '園部', department: '普通', quota: 84, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 39 },
    { schoolName: '農芸', department: '農業学科群', quota: 26, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 19 },
    { schoolName: '須知', department: '普通', quota: 42, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '須知', department: '食品科学', quota: 19, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '綾部', department: '普通', quota: 126, applicantsConfirmed: 110, testTakersConfirmed: 110, finalPassers: 110 },
    { schoolName: '綾部(東)', department: '農業・園芸(くくり)', quota: 9, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '綾部(東)', department: '農芸化学', quota: 9, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '福知山', department: '普通', quota: 112, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '工業', department: '機械テクノロジー', quota: 11, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 11 },
    { schoolName: '工業', department: 'ロボット技術', quota: 11, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 8 },
    { schoolName: '工業', department: '電気テクノロジー', quota: 11, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 11 },
    { schoolName: '工業', department: '環境デザイン', quota: 21, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 9 },
    { schoolName: '工業', department: '情報テクノロジー', quota: 11, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 7 },
    { schoolName: '大江', department: '地域創生[単位制]', quota: 56, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 2 },
    { schoolName: '東舞鶴', department: '普通', quota: 84, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '西舞鶴', department: '普通', quota: 112, applicantsConfirmed: 104, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '海洋', department: '海洋学科群', quota: 26, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '宮津天橋(宮津学舎)', department: '普通[単位制]', quota: 84, applicantsConfirmed: 73, testTakersConfirmed: 73, finalPassers: 73 },
    { schoolName: '宮津天橋(宮津学舎)', department: '建築[単位制]', quota: 8, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '宮津天橋(加悦谷学舎)', department: '普通[単位制]', quota: 58, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '峰山', department: '普通', quota: 112, applicantsConfirmed: 104, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '峰山', department: '機械創造', quota: 11, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '丹後緑風(網野学舎)', department: '普通[単位制]', quota: 49, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '丹後緑風(網野学舎)', department: '企画経営[単位制]', quota: 8, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '丹後緑風(久美浜学舎)', department: 'アグリサイエンス[単位制]', quota: 20, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '丹後緑風(久美浜学舎)', department: 'みらいクリエイト[単位制]', quota: 18, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
  ],
};
