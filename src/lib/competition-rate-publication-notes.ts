/**
 * T-Y11 A-1: `CompetitionRatePublicationBaselineEntry.unresolved`のうち
 * 「公表日（発表日そのもの）」を1県ずつ目視で埋めていく手作業台帳。
 *
 * `CompetitionRateSource`型に`publishedAt`フィールドが無いため、各県ファイルの
 * ヘッダコメントに既に自然文で書かれている公表日をここへ転記する（新しい調査ではなく、
 * 既存の記述を構造化するだけ＝Y-0憲法③「1データ点1出典」を保ったまま機械可読にする）。
 * 47県中この記述が既にある県から埋まっていく。無い県は無理に調べに行かず`unknown`のまま
 * （公表日を調べるための追加調査そのものは、A-1本体ではなくA-2の更新検知で自然に判明する）。
 */

export interface PublicationTimingNote {
  /** 判明している精度のまま書く（「頃」「〜」等の曖昧さを削らない）。 */
  publishedAt: string;
  /** どのファイルのどの記述から転記したか。 */
  evidence: string;
}

export const PUBLICATION_TIMING_NOTES: Partial<Record<string, PublicationTimingNote>> = {
  aichi: {
    publishedAt: '2026年2月17日発表',
    evidence: 'aichi.tsヘッダコメント既存記載（志願変更後の志願者数（最終）について）',
  },
  akita: {
    publishedAt: '令和8年2月12日発表',
    evidence: 'akita.tsヘッダコメント既存記載（公－２・志願先変更後）',
  },
  aomori: {
    publishedAt: '令和8年2月18日発表',
    evidence: 'aomori.tsヘッダコメント既存記載（出願期間2/12〜2/17正午締切）',
  },
  chiba: {
    publishedAt: '令和8年（2026年）2月13日',
    evidence: 'chiba.tsヘッダコメント既存記載（xlsx版は公開されておらずPDF版のみ）',
  },
  fukui: {
    publishedAt: '2月16日（変更最終日）',
    evidence: 'fukui.ts sources[]のdocTitle既存記載（令和8年度・志願変更状況）',
  },
  fukushima: {
    publishedAt: '令和8年3月19日公表',
    evidence: 'fukushima.tsヘッダコメント既存記載（全日制2ページ）',
  },
  gifu: {
    publishedAt: '令和8年2月17日正午締切時',
    evidence: 'gifu.tsヘッダコメント既存記載（第一次・連携型選抜、通信制前期選抜 変更後出願者数）',
  },
  gunma: {
    publishedAt: '2月12日確定',
    evidence: 'gunma.tsヘッダコメント既存記載（第２回志願先変更後の全日制課程選抜・フレックススクール選抜志願状況）',
  },
  hiroshima: {
    publishedAt: '令和8年2月18日確定',
    evidence: 'hiroshima.tsヘッダコメント既存記載（志願変更後の最終志願者数）',
  },
  hyogo: {
    publishedAt: '令和8年3月5日確定',
    evidence: 'hyogo.tsヘッダコメント既存記載（特別出願後確定数）',
  },
  ibaraki: {
    publishedAt: '2月18日公表',
    evidence: 'ibaraki.tsヘッダコメント既存記載（志願先変更後）',
  },
  ishikawa: {
    publishedAt: '2月24日',
    evidence: 'ishikawa.ts sources[]のdocTitle既存記載（令和8年度・一般入学(全日制)の出願状況）',
  },
  iwate: {
    publishedAt: '令和8年2月20日発表',
    evidence: 'iwate.tsヘッダコメント既存記載（志願者数一覧表（調整後）＜全日制＞）',
  },
  kagawa: {
    publishedAt: '2月24日（一般選抜志願変更締切後）',
    evidence: 'kagawa.tsヘッダコメント既存記載（一般選抜出願者数）',
  },
  kagoshima: {
    publishedAt: '令和8年3月4日',
    evidence: 'kagoshima.tsヘッダコメント既存記載（入学学力検査最終出願者数（訂正版）・学区別7学区分）',
  },
  kanagawa: {
    publishedAt: '2026-02-09',
    evidence: 'kanagawa.tsヘッダコメント既存記載（sourceUrl直下に明記）',
  },
  kochi: {
    publishedAt: '令和8年3月12日修正',
    evidence: 'kochi.tsヘッダコメント既存記載（Ａ日程等志願先変更後の状況（学校別））',
  },
  kumamoto: {
    publishedAt: '令和8年2月20日確定',
    evidence: 'kumamoto.tsヘッダコメント既存記載（後期（一般）選抜出願者数・出願変更後の最終出願確定者数）',
  },
  kyoto: {
    publishedAt: '令和8年3月4日発表',
    evidence: 'kyoto.tsヘッダコメント既存記載（中期選抜志願者数等一覧表）',
  },
  mie: {
    publishedAt: '3月5日公表',
    evidence: 'mie.tsヘッダコメント既存記載（後期選抜志願状況（最終））',
  },
  miyagi: {
    publishedAt: '令和8年2月13日公表',
    evidence: 'miyagi.tsヘッダコメント既存記載（第一次募集学校・学科別出願状況・出願確定の志願者数）',
  },
  miyazaki: {
    publishedAt: '令和8年2月24日発表',
    evidence: 'miyazaki.tsヘッダコメント既存記載（一般入学者選抜『最終』志願状況・志願変更後）',
  },
  nagano: {
    publishedAt: '3月5日公表',
    evidence: 'nagano.tsヘッダコメント既存記載（志願者数②（志望変更受付締切後の集計結果））',
  },
  nagasaki: {
    publishedAt: '令和8年2月6日15:00時点',
    evidence: 'nagasaki.tsヘッダコメント既存記載（志願変更制度自体が無く2/6締切時点の数値が確定値）',
  },
  nara: {
    publishedAt: '令和8年3月2日発表',
    evidence: 'nara.tsヘッダコメント既存記載（一次選抜等出願状況（第二出願期間））',
  },
  niigata: {
    publishedAt: '令和8年2月26日現在',
    evidence: 'niigata.tsヘッダコメント既存記載（一般選抜志願変更後の志願状況一覧）',
  },
  oita: {
    publishedAt: '2月27日公表',
    evidence: 'oita.tsヘッダコメント既存記載（第一次入学者選抜第一志願最終志願状況）',
  },
  okayama: {
    publishedAt: '令和8年2月27日公表',
    evidence: 'okayama.tsヘッダコメント既存記載（一般入学者選抜志願者数について・全国募集を除く）',
  },
  okinawa: {
    publishedAt: '令和8年2月17日発表',
    evidence: 'okinawa.tsヘッダコメント既存記載（一般選抜等最終志願状況）',
  },
  osaka: {
    publishedAt: '令和8年3月7日',
    evidence: 'osaka.tsヘッダコメント既存記載（志願者数の締切は3月6日午後2時・公表は翌日）',
  },
  saga: {
    publishedAt: '2月25日公表（訂正版）',
    evidence: 'saga.tsヘッダコメント既存記載（一般選抜志願状況（志願変更後）・最初の2/17時点版は不採用）',
  },
  saitama: {
    publishedAt: '令和8年2月19〜20日頃',
    evidence: 'saitama.tsヘッダコメント既存記載（xlsx版は公開されておらずPDF版のみ）',
  },
  shiga: {
    publishedAt: '令和8年2月13日公表',
    evidence: 'shiga.tsヘッダコメント既存記載（一次募集に係る公表資料（一次募集確定出願者数））',
  },
  shimane: {
    publishedAt: '令和8年2月16日17:00現在',
    evidence: 'shimane.tsヘッダコメント既存記載（全日制1ページ）',
  },
  shizuoka: {
    publishedAt: '令和8年2月26日確定',
    evidence: 'shizuoka.tsヘッダコメント既存記載（志願者数一覧（変更後）・志願変更後の最終確定数）',
  },
  tochigi: {
    publishedAt: '2月25日変更後確定値',
    evidence: 'tochigi.tsヘッダコメント既存記載（出願変更状況・複数版のうち②変更後確定値を採用）',
  },
  tokushima: {
    publishedAt: '2月26日志願変更後',
    evidence: 'tokushima.tsヘッダコメント既存記載（一般選抜出願状況）',
  },
  tokyo: {
    publishedAt: '2026-02-13',
    evidence: 'tokyo.tsヘッダコメント既存記載（令和8年度・最終応募状況）',
  },
  tottori: {
    publishedAt: '2月24日志願変更締切後',
    evidence: 'tottori.tsヘッダコメント既存記載（最終版・資料提供日も2月24日）',
  },
  toyama: {
    publishedAt: '令和8年2月24日正午現在',
    evidence: 'toyama.tsヘッダコメント既存記載（全日制の課程一般入学者選抜志願状況）',
  },
  wakayama: {
    publishedAt: '令和8年2月26日現在',
    evidence: 'wakayama.tsヘッダコメント既存記載（学校別・学科別状況(全日制)）',
  },
  yamagata: {
    publishedAt: '令和8年2月24日発表',
    evidence: 'yamagata.tsヘッダコメント既存記載（後期（一般）選抜 志願状況）',
  },
  yamaguchi: {
    publishedAt: '令和8年2月27日訂正',
    evidence: 'yamaguchi.tsヘッダコメント既存記載（訂正版・出願期間2/13〜2/24午前10時締切の確定値。予備調査版は不採用）',
  },
  yamanashi: {
    publishedAt: '令和8年2月25日午後4時締切',
    evidence: 'yamanashi.tsヘッダコメント既存記載（志願変更後の最終志願者数）',
  },
};

/**
 * ⚠️公表日が一次資料のヘッダコメントから抽出できなかった県（2026-09-01時点）。
 * `fetchedAt`（loopが取得した日）を公表日として代用しない（Y-0憲法③）。
 * 次にこれらの県のcompetition-rates/<pref>.tsに触れる回で、ヘッダコメントに
 * 公表日の記述を追記する機会があれば、この配列から外してPUBLICATION_TIMING_NOTESへ移す。
 */
export const UNRESOLVED_PUBLICATION_DATE_PREFECTURES = ['ehime', 'fukuoka', 'hokkaido'] as const;
