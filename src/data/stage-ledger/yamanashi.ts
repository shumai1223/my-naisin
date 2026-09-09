import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 山梨県 段階台帳（T-Y11F §5順序#7・23県目・全日制48レコードで完結）。
 *
 * 一次ソース: 山梨県教育委員会「令和8年度山梨県公立高等学校入学者選抜 入学許可予定者の状況について
 * （甲陵高校を除く。）」（令和8年3月12日発表・全3ページ）。
 * https://www.pref.yamanashi.jp/documents/7061/r8nyuugakukyokayoteisyanozyokyo.pdf
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/yamanashi.ts`（「後期募集及び
 * 定時制課程の最終志願状況について」）を再利用し、testTakersConfirmed（受検者数）・finalPassers
 * （入学許可予定者数）は本資料から新規転記した。quotaは本資料の「後期募集人員」列と全48レコードで
 * 完全一致（既存パイプラインのquota定義と同一資料系列のため自明の一致）。
 *
 * 4系列すべての機械集計（3,356／3,037／3,021／2,897）が本資料の「全日制課程計」行（後期募集人員
 * 3,356・受検者数3,021・入学許可予定者数2,897）および既存パイプラインの「最終志願者数3,037」と
 * 完全一致した（初回転記で一致・再修正なし）。
 *
 * ⚠️既知の4件: finalPassersがtestTakersConfirmedを上回るのは、本資料が明記する「第２希望」制度
 * （注記4「『入学許可予定者数』欄のうち、『第２希望』欄は第２希望の学科による入学許可予定者数で
 * 内数」）による他学科からの合格者流入。北杜「総合学科」（+1・第2希望内数1）・甲府南「普通」
 * （+8・第2希望内数8＝理数科不合格者の普通科への振替と推定）・青洲「工業(一括)」（+2・第2希望
 * 内数4）・吉田「普通」（+8・第2希望内数8＝理数科からの振替と推定）の4件で、いずれも資料本文の
 * 「第２希望」内数列に対応する値が印字されており、転記ミスではなく制度上の正常な挙動であることが
 * 資料自身から確認できる（富山県で観測された同型の未確認パターンとは異なり、本県は制度が資料に
 * 明記されているため公開可能と判断した）。
 *
 * 定時制課程・甲陵高校（中等教育学校のため本資料の対象外）は既存パイプラインと同じ理由でスコープ外。
 */
export const YAMANASHI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'yamanashi',
  sources: [
    {
      url: 'https://www.pref.yamanashi.jp/documents/7061/r8nyuugakukyokayoteisyanozyokyo.pdf',
      docTitle: '山梨県教育委員会 令和8年度山梨県公立高等学校入学者選抜 入学許可予定者の状況について（甲陵高校を除く。）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制後期募集（26校48学科48レコードを完全収録）'],
    pendingDepartments: [
      '定時制課程・甲陵高校（中等教育学校のため本資料の対象外）は既存パイプラインと同じ理由でスコープ外',
    ],
    note:
      'quota・applicantsConfirmedは既存パイプライン`competition-rates/yamanashi.ts`を再利用し、' +
      'testTakersConfirmed・finalPassersは「入学許可予定者の状況について」から新規転記した。4系列' +
      'すべての機械集計（3,356／3,037／3,021／2,897）が本資料の「全日制課程計」行および既存' +
      'パイプラインの最終志願者数と完全一致した。finalPassersがtestTakersConfirmedを上回る4件は' +
      '本資料が明記する「第２希望」制度（他学科からの合格者流入）で、内数列の印字により制度上の' +
      '正常な挙動と確認済み。定時制課程・甲陵高校は既存パイプラインと同じ理由でスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制課程計', quota: 3356, applicantsConfirmed: 3037, testTakersConfirmed: 3021, finalPassers: 2897 },
  ],
  records: [
    { schoolName: '北杜', department: '普通', quota: 49, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 44 },
    { schoolName: '北杜', department: '総合学科', quota: 55, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 42 },
    { schoolName: '韮崎', department: '普通', quota: 126, applicantsConfirmed: 139, testTakersConfirmed: 139, finalPassers: 126 },
    { schoolName: '韮崎', department: '文理', quota: 21, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '韮崎工業', department: '工業(一括)', quota: 103, applicantsConfirmed: 84, testTakersConfirmed: 83, finalPassers: 74 },
    { schoolName: '甲府第一', department: '普通', quota: 122, applicantsConfirmed: 123, testTakersConfirmed: 122, finalPassers: 121 },
    { schoolName: '甲府第一', department: '探究', quota: 42, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '甲府西', department: '普通', quota: 141, applicantsConfirmed: 130, testTakersConfirmed: 130, finalPassers: 129 },
    { schoolName: '甲府南', department: '普通', quota: 143, applicantsConfirmed: 129, testTakersConfirmed: 129, finalPassers: 137 },
    { schoolName: '甲府南', department: '理数', quota: 28, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 28 },
    { schoolName: '甲府東', department: '普通', quota: 182, applicantsConfirmed: 207, testTakersConfirmed: 207, finalPassers: 182 },
    { schoolName: '甲府工業', department: '機械', quota: 45, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 39 },
    { schoolName: '甲府工業', department: '電気', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 38 },
    { schoolName: '甲府工業', department: '建築', quota: 20, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '甲府工業', department: '土木', quota: 23, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 21 },
    { schoolName: '甲府工業', department: '電子', quota: 30, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '甲府城西', department: '総合学科', quota: 130, applicantsConfirmed: 114, testTakersConfirmed: 112, finalPassers: 111 },
    { schoolName: '甲府昭和', department: '普通', quota: 160, applicantsConfirmed: 155, testTakersConfirmed: 155, finalPassers: 155 },
    { schoolName: '農林', department: 'システム園芸', quota: 23, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 23 },
    { schoolName: '農林', department: '森林科学', quota: 25, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 11 },
    { schoolName: '農林', department: '環境土木', quota: 20, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '農林', department: '造園緑地', quota: 23, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 10 },
    { schoolName: '農林', department: '食品科学', quota: 17, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '巨摩', department: '普通', quota: 108, applicantsConfirmed: 118, testTakersConfirmed: 117, finalPassers: 109 },
    { schoolName: '白根', department: '普通', quota: 75, applicantsConfirmed: 82, testTakersConfirmed: 82, finalPassers: 75 },
    { schoolName: '青洲', department: '普通', quota: 96, applicantsConfirmed: 106, testTakersConfirmed: 106, finalPassers: 96 },
    { schoolName: '青洲', department: '工業(一括)', quota: 43, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 43 },
    { schoolName: '青洲', department: '商業(一括)', quota: 42, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 42 },
    { schoolName: '身延', department: '総合学科', quota: 59, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '笛吹', department: '普通', quota: 49, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '笛吹', department: '食品化学', quota: 16, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '笛吹', department: '果樹園芸', quota: 21, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 9 },
    { schoolName: '笛吹', department: '総合学科', quota: 55, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 29 },
    { schoolName: '日川', department: '普通', quota: 118, applicantsConfirmed: 105, testTakersConfirmed: 105, finalPassers: 105 },
    { schoolName: '山梨', department: '普通', quota: 96, applicantsConfirmed: 102, testTakersConfirmed: 99, finalPassers: 96 },
    { schoolName: '塩山', department: '普通', quota: 56, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 22 },
    { schoolName: '塩山', department: '商業(一括)', quota: 30, applicantsConfirmed: 8, testTakersConfirmed: 7, finalPassers: 4 },
    { schoolName: '都留', department: '普通', quota: 128, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 115 },
    { schoolName: '上野原', department: '総合学科', quota: 69, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 50 },
    { schoolName: '都留興譲館', department: '普通', quota: 53, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 47 },
    { schoolName: '都留興譲館', department: '英語理数', quota: 22, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '都留興譲館', department: '工業(一括)', quota: 72, applicantsConfirmed: 40, testTakersConfirmed: 37, finalPassers: 33 },
    { schoolName: '吉田', department: '普通', quota: 140, applicantsConfirmed: 129, testTakersConfirmed: 129, finalPassers: 137 },
    { schoolName: '吉田', department: '理数', quota: 34, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 34 },
    { schoolName: '富士北稜', department: '総合学科', quota: 165, applicantsConfirmed: 135, testTakersConfirmed: 134, finalPassers: 133 },
    { schoolName: '富士河口湖', department: '普通', quota: 118, applicantsConfirmed: 105, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '甲府商業', department: '商業', quota: 75, applicantsConfirmed: 86, testTakersConfirmed: 86, finalPassers: 75 },
    { schoolName: '甲府商業', department: '情報処理', quota: 48, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 48 },
  ],
};
