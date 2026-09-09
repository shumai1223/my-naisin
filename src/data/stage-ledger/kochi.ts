import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 高知県 段階台帳（T-Y11F §5順序#7・21県目・全日制75レコードで完結）。
 *
 * 一次ソース: 高知県教育委員会「令和8年度Ａ日程等合格者等の状況（学校別）」
 * （令和8年3月12日・全2頁）。
 * https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_goukakusha.pdf
 *
 * ⚠️高知県のPDFは日本語ToUnicodeマッピングが欠落しておりpdftotextでは数値のみ抽出されるため、
 * pdftoppm 200dpi + ビジョン読み取りで転記した。この単一資料に段階台帳が必要とする4フィールド
 * すべて（募集定員＝quota／第1志望者数／受検者数＝testTakersConfirmed／合格者数＝finalPassers）
 * が揃っており、applicantsConfirmedのみ既存パイプライン`competition-rates/kochi.ts`（同一資料の
 * 「第1志望者数」列を典拠とする既存の転記値）を再利用した。
 *
 * ⚠️既存パイプラインと同じくスコープ外: 高知国際「国際（グローバル）探究」学科・DPコース
 * （募集定員が「若干名」で数値化不能）、高知海洋「船舶職員養成課程」（募集定員が入学定員の内数
 * [ ]表記）、Ｂ日程・多部制単位制・連携型中高一貫教育校特別選抜（いずれも他県の2次募集/推薦選抜
 * と同じ理由でスコープ外）。
 *
 * quotaの75レコード全数が既存パイプラインと完全一致した。testTakersConfirmed・finalPassers・
 * quotaの機械集計（4,372／3,099／2,958）は、本資料の「合計」行（募集定員4,372・受検者数3,104・
 * 合格者数2,963）と**quotaは完全一致するがtestTakersConfirmed・finalPassersはそれぞれ5名分
 * 少ない**——差分は高知国際「国際（グローバル）探究」学科（受検5名・合格5名、既存パイプラインの
 * 第1志望者数の除外と同型の理由で本台帳でも除外）で完全に説明がつく（既存パイプラインの
 * 第1志望者数除外〈2837→2830・差7〉と同じ設計判断。学科によって除外時の差分人数が異なるのは
 * 対象フィールドが異なるため）。officialSubtotalsは本台帳が実際に積み上げられる数値を採用した。
 *
 * ⚠️既知の例外: 清水「普通（未来）」はapplicantsConfirmed（既存パイプライン第1志望者数3名）に
 * 対しtestTakersConfirmed・finalPassersともに0（「受検者なし」と資料に明記）。他は軽微な学科間
 * 差（±1〜7名程度）で他県と同型の合格者調整と推測される。
 *
 * 定時制課程・多部制単位制は他県と同じ理由でスコープ外。
 */
export const KOCHI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'kochi',
  sources: [
    {
      url: 'https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_goukakusha.pdf',
      docTitle: '高知県教育委員会 令和8年度Ａ日程等合格者等の状況（学校別）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（Ａ日程、県立31校＋市立1校の75レコードを完全収録）'],
    pendingDepartments: [
      '高知国際「国際（グローバル）探究」学科・DPコース（募集定員が「若干名」で数値化不能）',
      '高知海洋「船舶職員養成課程」（募集定員が入学定員の内数）',
      'Ｂ日程・多部制単位制・連携型中高一貫教育校特別選抜（他県の2次募集/推薦選抜と同じ理由でスコープ外）',
      '定時制課程（他県と同じ理由で恒久的にスコープ外）',
    ],
    note: '全日制32校75レコードを完全収録。単一資料（合格者等の状況）にquota・testTakersConfirmed・finalPassersがすべて揃い、applicantsConfirmedのみ既存パイプライン`competition-rates/kochi.ts`を再利用した。quotaは75レコード全数が既存パイプラインと完全一致。testTakersConfirmed・finalPassersの機械集計（3,099／2,958）は本資料の「合計」行（3,104／2,963）よりそれぞれ5少ないが、高知国際「国際（グローバル）探究」学科（受検5・合格5、募集定員が無いため除外）で完全に説明がつく（既存パイプラインの第1志望者数除外と同型の設計判断）。清水「普通（未来）」はapplicantsConfirmed3名に対し受検者・合格者とも0（資料に「受検者なし」と明記）。定時制課程・多部制単位制は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '県立計＋市立計（機械集計）', quota: 4372, applicantsConfirmed: 3144, testTakersConfirmed: 3099, finalPassers: 2958 },
  ],
  records: [
    { schoolName: '室戸', department: '総合', quota: 44, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '安芸', department: '普通', quota: 95, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '安芸', department: '工業(機械)', quota: 20, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '安芸', department: '工業(土木)', quota: 20, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '安芸', department: '商業(ビジネス)', quota: 34, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '城山', department: '普通', quota: 70, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '山田', department: '普通', quota: 80, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '山田', department: '探究(グローバル)', quota: 40, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '山田', department: '商業(ビ探)', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 25 },
    { schoolName: '嶺北', department: '普通', quota: 50, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '高知農業', department: '農業(農総)', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 37, finalPassers: 38 },
    { schoolName: '高知農業', department: '農業(畜総)', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '高知農業', department: '農業(森総)', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 31 },
    { schoolName: '高知農業', department: '農業(環土)', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '高知農業', department: '農業(食ビ)', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40 },
    { schoolName: '高知農業', department: '農業(生総)', quota: 40, applicantsConfirmed: 52, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '高知東工業', department: '工業(機械)', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 25 },
    { schoolName: '高知東工業', department: '工業(機械システム)', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '高知東工業', department: '工業(電子)', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '高知東工業', department: '工業(電機)', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '岡豊', department: '普通', quota: 200, applicantsConfirmed: 212, testTakersConfirmed: 208, finalPassers: 200 },
    { schoolName: '岡豊', department: '普通(芸術コース)', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 27 },
    { schoolName: '岡豊', department: '普通(体育コース)', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 39 },
    { schoolName: '高知東', department: '総合', quota: 200, applicantsConfirmed: 151, testTakersConfirmed: 148, finalPassers: 144 },
    { schoolName: '高知東', department: '看護', quota: 30, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '高知工業', department: '工業(機械)', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '高知工業', department: '工業(電気)', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 35 },
    { schoolName: '高知工業', department: '工業(情技)', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '高知工業', department: '工業(工化)', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 31 },
    { schoolName: '高知工業', department: '工業(土木)', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '高知工業', department: '工業(建築)', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40 },
    { schoolName: '高知工業', department: '工業(総デ)', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '高知追手前', department: '普通', quota: 240, applicantsConfirmed: 206, testTakersConfirmed: 203, finalPassers: 202 },
    { schoolName: '吾北', department: '普通', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '高知丸の内', department: '普通', quota: 140, applicantsConfirmed: 164, testTakersConfirmed: 164, finalPassers: 140 },
    { schoolName: '高知丸の内', department: 'チャレンジＡ', quota: 10, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '高知丸の内', department: '音楽', quota: 30, applicantsConfirmed: 14, testTakersConfirmed: 13, finalPassers: 14 },
    { schoolName: '高知小津', department: '普通', quota: 240, applicantsConfirmed: 242, testTakersConfirmed: 239, finalPassers: 238 },
    { schoolName: '高知小津', department: '理数', quota: 30, applicantsConfirmed: 17, testTakersConfirmed: 16, finalPassers: 15 },
    { schoolName: '高知国際', department: '普通', quota: 200, applicantsConfirmed: 204, testTakersConfirmed: 202, finalPassers: 200 },
    { schoolName: '伊野商業', department: '商業(キャリア)', quota: 120, applicantsConfirmed: 66, testTakersConfirmed: 61, finalPassers: 55 },
    { schoolName: '春野', department: '総合', quota: 160, applicantsConfirmed: 128, testTakersConfirmed: 125, finalPassers: 123 },
    { schoolName: '高岡', department: '普通', quota: 70, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 19 },
    { schoolName: '高知海洋', department: '水産(海洋)', quota: 35, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 10 },
    { schoolName: '須崎総合', department: '普通', quota: 120, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 83 },
    { schoolName: '須崎総合', department: '工業(機械系)機械', quota: 20, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 15 },
    { schoolName: '須崎総合', department: '工業(造船)', quota: 20, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 3 },
    { schoolName: '須崎総合', department: '工業(電情系)電気', quota: 20, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '須崎総合', department: '工業(電情)', quota: 20, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 8 },
    { schoolName: '須崎総合', department: '工業(シ工系)機制', quota: 20, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '須崎総合', department: '工業(住環)', quota: 20, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '佐川', department: '普通', quota: 70, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '窪川', department: '普通', quota: 50, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '檮原', department: '普通', quota: 31, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 2 },
    { schoolName: '四万十', department: '普通', quota: 22, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '四万十', department: '普通(自環コース)', quota: 25, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '大方', department: '普通', quota: 33, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 5 },
    { schoolName: '幡多農業', department: '農業(園システム)', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '幡多農業', department: '農業(アグリ)', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '幡多農業', department: '農業(グリーン)', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '幡多農業', department: '農業(コーディネート)', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 30 },
    { schoolName: '中村', department: '普通', quota: 161, applicantsConfirmed: 139, testTakersConfirmed: 138, finalPassers: 135 },
    { schoolName: '西土佐', department: '普通', quota: 34, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '宿毛工業', department: '工業(機械系)機械', quota: 20, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 4 },
    { schoolName: '宿毛工業', department: '工業(自車)', quota: 20, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 15 },
    { schoolName: '宿毛工業', department: '工業(建設系)土木', quota: 20, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '宿毛工業', department: '工業(建築)', quota: 20, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '宿毛工業', department: '工業(電気)', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '宿毛工業', department: '工業(情技)', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '宿毛', department: '総合', quota: 58, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '清水', department: '普通(未来)', quota: 50, applicantsConfirmed: 3, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '高知商業', department: '商業(総合マネ)', quota: 140, applicantsConfirmed: 146, testTakersConfirmed: 144, finalPassers: 140 },
    { schoolName: '高知商業', department: '商業(社会マネ)', quota: 70, applicantsConfirmed: 91, testTakersConfirmed: 90, finalPassers: 70 },
    { schoolName: '高知商業', department: '商業(情報マネ)', quota: 35, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 35 },
    { schoolName: '高知商業', department: '商業(スポマネ)', quota: 35, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 35 },
  ],
};
