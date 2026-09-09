import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 奈良県 段階台帳（T-Y11F §5順序#7・22県目・全日制71レコードで完結）。
 *
 * 一次ソース: 奈良県教育委員会「令和8年度奈良県公立高等学校入学者一次選抜等受検状況」
 * https://www.pref.nara.lg.jp/documents/5981/itiji_jissijoukyou.pdf
 * および「令和8年度奈良県公立高等学校入学者一次選抜等合格者数」
 * https://www.pref.nara.lg.jp/documents/5981/r8_itiji_goukakusyasuu.pdf
 * （いずれも令和8年3月・全2ページ）。
 *
 * ⚠️`pref.nara.jp`の旧ドメインは現在`pref.nara.lg.jp`へ301リダイレクトされており、旧ドメインへの
 * 直接curlは403 Forbidden（HTML）を返す。WebFetchでリダイレクト先を確認し、新ドメインの同一パスで
 * 取得に成功した（罠: 403の原因を権限エラーと誤認しないこと）。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/nara.ts`（第一出願期間の出願者数）
 * を再利用し、testTakersConfirmedは受検状況資料の「受検者数」列、finalPassersは合格者数資料の
 * 「合格者数」列（第1希望・第2希望の合算選抜を経た最終値）から新規転記した。
 *
 * quota・testTakersConfirmed・finalPassersの71レコード全数の機械集計（6,896／6,238／5,882）が
 * 両資料本文の「合計」行（受検状況＝募集人員6,896・出願6,276・受検6,238／合格者数＝出願6,276・
 * 合格5,882）と初回転記で完全一致した（再修正なし）。
 *
 * ⚠️既知の24件: finalPassersがtestTakersConfirmedを上回るのは、奈良県一次選抜制度が第1希望校で
 * 不合格でも第2希望校で合格できる仕組みのため、定員に対して志願者が少なかった学科が他校の第2希望
 * 不合格者を追加合格させた結果（定員割れ学科の充足行動）で、既存パイプラインでも同型の現象が
 * 説明済み。普通科の多く（奈良・高田・郡山・畝傍・生駒・香芝・一条等）はfinalPassers=quotaで
 * 頭打ちになっており、定員超過分は不合格＝制度上正常な挙動。
 *
 * 定時制課程・外国人／帰国生徒特別選抜は既存パイプラインと同じ理由でスコープ外。
 */
export const NARA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'nara',
  sources: [
    {
      url: 'https://www.pref.nara.lg.jp/documents/5981/itiji_jissijoukyou.pdf',
      docTitle: '奈良県教育委員会 令和8年度奈良県公立高等学校入学者一次選抜等受検状況',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.pref.nara.lg.jp/documents/5981/r8_itiji_goukakusyasuu.pdf',
      docTitle: '奈良県教育委員会 令和8年度奈良県公立高等学校入学者一次選抜等合格者数',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程・一次選抜（29校71レコードを完全収録）'],
    pendingDepartments: [
      '定時制課程・外国人／帰国生徒特別選抜（既存パイプラインと同じ理由でスコープ外）',
    ],
    note:
      'quota・applicantsConfirmedは既存パイプライン`competition-rates/nara.ts`（第一出願期間の' +
      '出願者数）を再利用し、testTakersConfirmed・finalPassersは受検状況資料・合格者数資料から新規' +
      '転記した。3系列すべての機械集計（6,896／6,238／5,882）が両資料の「合計」行と初回転記で完全' +
      '一致した。finalPassersがtestTakersConfirmedを上回る24件は、奈良県一次選抜制度の第2希望校' +
      '合格による定員割れ学科の充足行動（制度上正常）。定時制課程・外国人／帰国生徒特別選抜は既存' +
      'パイプラインと同じ理由でスコープ外。',
  },
  officialSubtotals: [
    { label: '合計', quota: 6896, applicantsConfirmed: 6276, testTakersConfirmed: 6238, finalPassers: 5882 },
  ],
  records: [
    { schoolName: '奈良商工', department: '機械工学', quota: 74, applicantsConfirmed: 64, testTakersConfirmed: 64, finalPassers: 65 },
    { schoolName: '奈良商工', department: '情報工学', quota: 37, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 37 },
    { schoolName: '奈良商工', department: '建築工学', quota: 37, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '奈良商工', department: '総合ビジネス', quota: 80, applicantsConfirmed: 71, testTakersConfirmed: 70, finalPassers: 73 },
    { schoolName: '奈良商工', department: '情報ビジネス', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 26 },
    { schoolName: '奈良商工', department: '観光', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 33 },
    { schoolName: '国際', department: '国際(LI)', quota: 32, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 32 },
    { schoolName: '奈良', department: '普通', quota: 360, applicantsConfirmed: 432, testTakersConfirmed: 430, finalPassers: 360 },
    { schoolName: '山辺', department: '農業探究', quota: 20, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '山辺', department: '自立支援農業', quota: 20, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '山辺', department: '総合', quota: 38, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '高円芸術', department: '普通', quota: 120, applicantsConfirmed: 102, testTakersConfirmed: 102, finalPassers: 110 },
    { schoolName: '高円芸術', department: '音楽', quota: 35, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '高円芸術', department: '美術', quota: 35, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 19 },
    { schoolName: '高円芸術', department: 'デザイン', quota: 35, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '高田', department: '普通', quota: 360, applicantsConfirmed: 400, testTakersConfirmed: 397, finalPassers: 360 },
    { schoolName: '郡山', department: '普通', quota: 360, applicantsConfirmed: 456, testTakersConfirmed: 454, finalPassers: 360 },
    { schoolName: '添上', department: '普通(人文探究)', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '添上', department: '普通(人文探究以外)', quota: 160, applicantsConfirmed: 132, testTakersConfirmed: 128, finalPassers: 131 },
    { schoolName: '添上', department: 'スポーツサイエンス', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '二階堂', department: 'キャリアデザイン', quota: 160, applicantsConfirmed: 81, testTakersConfirmed: 81, finalPassers: 81 },
    { schoolName: '橿原', department: '普通', quota: 320, applicantsConfirmed: 283, testTakersConfirmed: 281, finalPassers: 312 },
    { schoolName: '畝傍', department: '普通', quota: 360, applicantsConfirmed: 398, testTakersConfirmed: 395, finalPassers: 360 },
    { schoolName: '商業', department: '会計・情報ビジネス・経営ビジネス・総合ビジネス(くくり募集)', quota: 200, applicantsConfirmed: 186, testTakersConfirmed: 185, finalPassers: 186 },
    { schoolName: '桜井', department: '普通(書芸)', quota: 35, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 17 },
    { schoolName: '桜井', department: '普通(書芸以外)', quota: 280, applicantsConfirmed: 310, testTakersConfirmed: 309, finalPassers: 280 },
    { schoolName: '五條', department: '普通', quota: 240, applicantsConfirmed: 202, testTakersConfirmed: 202, finalPassers: 208 },
    { schoolName: '五條', department: '商業', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '御所実業', department: '環境緑地', quota: 32, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '御所実業', department: '機械工学', quota: 63, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 44 },
    { schoolName: '御所実業', department: '電気工学', quota: 32, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '御所実業', department: '都市工学', quota: 32, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '御所実業', department: '薬品科学', quota: 28, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '生駒', department: '普通', quota: 320, applicantsConfirmed: 363, testTakersConfirmed: 361, finalPassers: 320 },
    { schoolName: '奈良北', department: '普通', quota: 280, applicantsConfirmed: 281, testTakersConfirmed: 281, finalPassers: 280 },
    { schoolName: '奈良北', department: '数理情報', quota: 80, applicantsConfirmed: 64, testTakersConfirmed: 63, finalPassers: 80 },
    { schoolName: '香芝', department: '普通(表現探究)', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 40 },
    { schoolName: '香芝', department: '普通(表現探究以外)', quota: 280, applicantsConfirmed: 295, testTakersConfirmed: 291, finalPassers: 280 },
    { schoolName: '宇陀', department: '普通', quota: 80, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 52 },
    { schoolName: '宇陀', department: '情報科学', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '宇陀', department: 'こども・福祉', quota: 80, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '西和清陵', department: '普通', quota: 160, applicantsConfirmed: 95, testTakersConfirmed: 94, finalPassers: 102 },
    { schoolName: '法隆寺国際', department: '普通', quota: 200, applicantsConfirmed: 225, testTakersConfirmed: 225, finalPassers: 200 },
    { schoolName: '法隆寺国際', department: '歴史文化', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 30 },
    { schoolName: '法隆寺国際', department: '総合英語', quota: 75, applicantsConfirmed: 30, testTakersConfirmed: 29, finalPassers: 36 },
    { schoolName: '磯城野', department: '農業科学(食料生産)', quota: 18, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 18 },
    { schoolName: '磯城野', department: '農業科学(動物活用)', quota: 19, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 19 },
    { schoolName: '磯城野', department: '施設園芸(施設野菜)', quota: 19, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 19 },
    { schoolName: '磯城野', department: '施設園芸(施設草花)', quota: 18, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '磯城野', department: 'バイオ技術(生物未来)', quota: 18, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '磯城野', department: 'バイオ技術(食品科学)', quota: 19, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '磯城野', department: '環境デザイン(造園緑化)', quota: 19, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '磯城野', department: '環境デザイン(緑化デザイン)', quota: 18, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '磯城野', department: 'フードデザイン(シェフ)', quota: 20, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 20 },
    { schoolName: '磯城野', department: 'フードデザイン(パティシエ)', quota: 20, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 20 },
    { schoolName: '磯城野', department: 'ファッションクリエイト', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 18 },
    { schoolName: '磯城野', department: 'ヒューマンライフ', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '高取国際', department: '普通', quota: 120, applicantsConfirmed: 135, testTakersConfirmed: 135, finalPassers: 120 },
    { schoolName: '高取国際', department: '国際英語', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 14 },
    { schoolName: '高取国際', department: '国際コミュニケーション', quota: 75, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 33 },
    { schoolName: '王寺工業', department: '機械工学', quota: 74, applicantsConfirmed: 63, testTakersConfirmed: 63, finalPassers: 63 },
    { schoolName: '王寺工業', department: '電気工学', quota: 72, applicantsConfirmed: 60, testTakersConfirmed: 59, finalPassers: 59 },
    { schoolName: '王寺工業', department: '情報電子工学', quota: 74, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '大和広陵', department: '普通', quota: 80, applicantsConfirmed: 65, testTakersConfirmed: 64, finalPassers: 65 },
    { schoolName: '大和広陵', department: '生涯スポーツ', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '奈良南', department: '普通', quota: 80, applicantsConfirmed: 44, testTakersConfirmed: 43, finalPassers: 43 },
    { schoolName: '奈良南', department: '伝統建築', quota: 37, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '奈良南', department: '情報科学', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '十津川', department: '総合', quota: 39, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '一条', department: '普通', quota: 200, applicantsConfirmed: 302, testTakersConfirmed: 299, finalPassers: 200 },
    { schoolName: '高田商業', department: '商業', quota: 197, applicantsConfirmed: 191, testTakersConfirmed: 190, finalPassers: 194 },
  ],
};
