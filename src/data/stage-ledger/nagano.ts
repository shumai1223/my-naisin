import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 長野県 段階台帳（T-Y11F §5順序#7・5県目・第1〜3通学区（北信・東信・南信地区）・全日制102レコード）。
 *
 * 一次ソース: 長野県教育委員会「令和8年度公立高等学校入学者後期選抜の入学予定者数をお知らせ
 * します」別紙1（2）学校別状況（3月19日公表・全7頁）の第1通学区（北信地区・別紙1の3頁目・
 * 26校37レコード）＋第2通学区（東信地区・別紙1の4頁目・18校25レコード）＋第3通学区
 * （南信地区・別紙1の5頁目・26校40レコード）。
 * https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/20260319web1.pdf
 *
 * ⚠️既存の`competition-rates/nagano.ts`（倍率パイプライン）は**別の一次資料**（「入学者後期選抜
 * 志願者数②（志望変更受付締切後の集計結果）」・3月5日公表）を採用している。列構成は[募集人員/
 * 受検者数/入学予定者数]で、**本資料には「志願者数」列自体が存在しない**（志願者数は試験前の
 * 3月5日資料にのみ存在し、本資料は試験後の受検者数・入学予定者数のみを掲載）。そのため
 * quota・applicantsConfirmedは既存パイプラインから再利用し（募集人員は試験日まで不変で第1・
 * 第2通学区とも全件完全一致を確認済み）、testTakersConfirmed=受検者数・finalPassers=入学予定者数
 * のみを本資料から新規に転記した（ibaraki.tsと同型の複数資料合成設計）。
 *
 * ⚠️くくり募集: 既存パイプラインが確立した連結学科名の単一レコード方式をそのまま踏襲した
 * （飯山「自然科学探究・人文科学探究（くくり募集）」・須坂創成「農業（園芸農学・食品科学・
 * 環境造園）」・長野商業「商業・会計（くくり募集）」・更級農業「地域園芸・植物活用・食農科学
 * （くくり募集）」・佐久平総合技術「農業（食料マネジメント・生物サービス・食農クリエイト）」）。
 *
 * ⚠️既知の例外（第1通学区）: 篠ノ井犀峡校・普通はapplicantsConfirmed（既存パイプライン再利用値）・
 * testTakersConfirmed・finalPassersのすべてが0（受検者0名・入学予定者0名という実際の公表値）。
 * quota（募集人員33）自体は0より大きいためレコードとして収録するが、
 * 「0より大きい」不変条件はこの1件のみ例外として明示的に許容する。
 *
 * ⚠️既知の例外（新種・finalPassersがapplicantsConfirmed・testTakersConfirmedの両方を上回る・
 * 第1〜3通学区で計14件）: 第1通学区=須坂創成「工業（創造工学）」（test14→final15）・長野工業
 * 「機械工学」（test15→final16）。第2通学区=上田千曲「工業（電気）」（test13→final16）・
 * 佐久平総合技術「創造実践」（test22→final26）・野沢北「普通」（test158→final160）。第3通学区=
 * 岡谷工業「電気工学」（test5→final7）・岡谷工業「電子機械」（test6→final7）・伊那北「普通」
 * （test158→final161）・赤穂「普通」（test112→final114）・飯田「普通」（test192→final204・
 * 差12で最大）・飯田OIDE長姫「電子機械工学」（test15→final16）・飯田OIDE長姫「社会基盤工学」
 * （test13→final15）・飯田OIDE長姫「商業」（test29→final31）・下伊那農業「生物活用」
 * （test15→final16）。これまでのchiba/ibarakiで確認した「finalPassers>applicantsConfirmed」
 * パターンと同型だが、本件はtestTakersConfirmedとの比較でも同じレコードが該当する点が新規。
 * 一般選抜の受検者数に含まれない特別選抜（推薦等）合格者が入学予定者数に合算されるための
 * 差と推定される（他資料の既知パターンと同じ推定理由）。
 *
 * 別紙1（3頁目）末尾の「第1通学区 合計」（quota2,623・testTakersConfirmed2,299・
 * finalPassers2,236）と37レコード全数の機械集計が3系列とも完全一致、（4頁目）末尾の
 * 「第2通学区 合計」（quota1,875・testTakersConfirmed1,758・finalPassers1,699）と25レコード
 * 全数の機械集計、（5頁目）末尾の「第3通学区 合計」（quota2,246・testTakersConfirmed1,975・
 * finalPassers1,937）と40レコード全数の機械集計もそれぞれ3系列とも完全一致した（いずれも
 * applicantsConfirmedはこの資料に印字が無いため対象外・既存パイプライン再利用値の参考集計のみ）。
 */

export const NAGANO_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'nagano',
  sources: [
    {
      url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/20260319web1.pdf',
      docTitle: '長野県教育委員会 令和8年度公立高等学校入学者後期選抜の入学予定者数をお知らせします 別紙1（2）学校別状況 第1〜3通学区（北信・東信・南信地区）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制県立（第1通学区・北信地区・26校37レコード＋第2通学区・東信地区・18校25レコード＋第3通学区・南信地区・26校40レコード）'],
    pendingDepartments: ['第4通学区（中信地区）の残り学校'],
    note: '第1〜3通学区（北信・東信・南信地区・102レコード）まで完了。quotaは既存competition-rates/nagano.tsと全102件で完全一致（募集人員は試験日まで不変であることを確認）。applicantsConfirmedも既存パイプラインをそのまま再利用（本資料には志願者数列が存在しないため）。testTakersConfirmed/finalPassersのみ本資料から新規転記。篠ノ井犀峡校・普通のみapplicants/test/final全て0という既知の例外。finalPassersがapplicantsConfirmed・testTakersConfirmedの両方を上回る新種の既知例外が第1〜3通学区で計14件。別紙1末尾の「第1通学区 合計」（quota2,623/testTakers2,299/final2,236）・「第2通学区 合計」（quota1,875/testTakers1,758/final1,699）・「第3通学区 合計」（quota2,246/testTakers1,975/final1,937）と各レコード全数の機械集計が3系列とも完全一致。',
  },
  records: [
    { schoolName: '飯山', department: '普通', quota: 56, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '飯山', department: '自然科学探究・人文科学探究（くくり募集）', quota: 44, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '飯山', department: 'スポーツ科学', quota: 13, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '下高井農林', department: '地域創造農学', quota: 41, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '中野立志館', department: '総合', quota: 64, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '中野西', department: '普通', quota: 80, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 69 },
    { schoolName: '須坂東', department: '普通', quota: 86, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '須坂', department: '普通', quota: 240, applicantsConfirmed: 252, testTakersConfirmed: 252, finalPassers: 246 },
    { schoolName: '須坂創成', department: '農業（園芸農学・食品科学・環境造園）', quota: 48, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 48 },
    { schoolName: '須坂創成', department: '工業（創造工学）', quota: 16, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 15 },
    { schoolName: '須坂創成', department: '商業', quota: 32, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '北部', department: '普通', quota: 51, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '長野吉田', department: '普通', quota: 240, applicantsConfirmed: 262, testTakersConfirmed: 262, finalPassers: 246 },
    { schoolName: '長野', department: '普通', quota: 280, applicantsConfirmed: 290, testTakersConfirmed: 289, finalPassers: 281 },
    { schoolName: '長野西', department: '普通', quota: 200, applicantsConfirmed: 208, testTakersConfirmed: 208, finalPassers: 200 },
    { schoolName: '長野西', department: '国際教養', quota: 4, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 4 },
    { schoolName: '長野商業', department: '商業・会計（くくり募集）', quota: 80, applicantsConfirmed: 82, testTakersConfirmed: 81, finalPassers: 80 },
    { schoolName: '長野東', department: '普通', quota: 112, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 112 },
    { schoolName: '長野工業', department: '機械工学', quota: 16, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 16 },
    { schoolName: '長野工業', department: '電気電子工学', quota: 16, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 16 },
    { schoolName: '長野工業', department: '物質化学', quota: 16, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 16 },
    { schoolName: '長野工業', department: '情報工学', quota: 16, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '長野工業', department: '土木工学', quota: 16, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 16 },
    { schoolName: '長野工業', department: '建築学', quota: 16, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 16 },
    { schoolName: '長野西中条校', department: '普通', quota: 31, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '篠ノ井犀峡校', department: '普通', quota: 33, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '市立長野', department: '総合', quota: 45, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 46 },
    { schoolName: '長野南', department: '普通', quota: 120, applicantsConfirmed: 104, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '篠ノ井', department: '普通', quota: 200, applicantsConfirmed: 198, testTakersConfirmed: 198, finalPassers: 198 },
    { schoolName: '更級農業', department: '地域園芸・植物活用・食農科学（くくり募集）', quota: 48, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '松代', department: '普通', quota: 61, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '松代', department: '商業', quota: 18, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '屋代', department: '普通', quota: 160, applicantsConfirmed: 158, testTakersConfirmed: 158, finalPassers: 157 },
    { schoolName: '屋代', department: '理数', quota: 12, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '屋代南', department: '普通', quota: 48, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 45 },
    { schoolName: '屋代南', department: '家庭（ライフデザイン）', quota: 16, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '坂城', department: '普通', quota: 48, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    // ── 第2通学区（東信地区・別紙1の4頁目・18校25レコード） ──
    { schoolName: '上田千曲', department: '工業（メカニカル工学）', quota: 16, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 16 },
    { schoolName: '上田千曲', department: '工業（電気）', quota: 16, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 16 },
    { schoolName: '上田千曲', department: '工業（建築）', quota: 16, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 16 },
    { schoolName: '上田千曲', department: '商業', quota: 16, applicantsConfirmed: 19, testTakersConfirmed: 18, finalPassers: 16 },
    { schoolName: '上田千曲', department: '家庭（生活福祉）', quota: 16, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 16 },
    { schoolName: '上田千曲', department: '家庭（食物栄養）', quota: 16, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 16 },
    { schoolName: '上田', department: '普通', quota: 280, applicantsConfirmed: 279, testTakersConfirmed: 279, finalPassers: 279 },
    { schoolName: '上田染谷丘', department: '普通', quota: 240, applicantsConfirmed: 254, testTakersConfirmed: 253, finalPassers: 242 },
    { schoolName: '上田染谷丘', department: '国際教養', quota: 8, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 8 },
    { schoolName: '上田東', department: '普通', quota: 240, applicantsConfirmed: 255, testTakersConfirmed: 255, finalPassers: 242 },
    { schoolName: '丸子修学館', department: '総合', quota: 101, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '蓼科', department: '普通', quota: 51, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '小諸義塾', department: '普通', quota: 60, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 61 },
    { schoolName: '小諸義塾', department: '商業（ビジネス）', quota: 48, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 48 },
    { schoolName: '小諸義塾', department: '音楽', quota: 10, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '軽井沢', department: '普通', quota: 32, applicantsConfirmed: 38, testTakersConfirmed: 37, finalPassers: 33 },
    { schoolName: '佐久平総合技術', department: '農業（食料マネジメント・生物サービス・食農クリエイト）', quota: 48, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 48 },
    { schoolName: '佐久平総合技術', department: '工業（機械システム）', quota: 16, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '佐久平総合技術', department: '工業（電気情報）', quota: 20, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '佐久平総合技術', department: '創造実践', quota: 46, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 26 },
    { schoolName: '岩村田', department: '普通', quota: 200, applicantsConfirmed: 203, testTakersConfirmed: 203, finalPassers: 202 },
    { schoolName: '野沢北', department: '普通', quota: 160, applicantsConfirmed: 158, testTakersConfirmed: 158, finalPassers: 160 },
    { schoolName: '野沢北', department: '理数', quota: 4, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 4 },
    { schoolName: '野沢南', department: '普通', quota: 160, applicantsConfirmed: 155, testTakersConfirmed: 155, finalPassers: 155 },
    { schoolName: '小海', department: '普通', quota: 55, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    // ── 第3通学区（南信地区・別紙1の5頁目・26校40レコード） ──
    { schoolName: '富士見', department: '普通', quota: 23, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '富士見', department: '農業（園芸）', quota: 16, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '茅野', department: '普通', quota: 65, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '諏訪実業', department: '商業（商業・会計情報）', quota: 47, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '諏訪実業', department: '家庭（服飾）', quota: 17, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '諏訪清陵', department: '普通', quota: 161, applicantsConfirmed: 154, testTakersConfirmed: 151, finalPassers: 151 },
    { schoolName: '諏訪二葉', department: '普通', quota: 200, applicantsConfirmed: 202, testTakersConfirmed: 202, finalPassers: 200 },
    { schoolName: '下諏訪向陽', department: '普通', quota: 100, applicantsConfirmed: 55, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '岡谷東', department: '普通', quota: 48, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 48 },
    { schoolName: '岡谷南', department: '普通', quota: 160, applicantsConfirmed: 153, testTakersConfirmed: 153, finalPassers: 153 },
    { schoolName: '岡谷工業', department: '機械工学', quota: 24, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '岡谷工業', department: '電気工学', quota: 21, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 7 },
    { schoolName: '岡谷工業', department: '電子機械', quota: 18, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 7 },
    { schoolName: '岡谷工業', department: '情報技術', quota: 16, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 16 },
    { schoolName: '辰野', department: '普通', quota: 32, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '辰野', department: '商業', quota: 16, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '上伊那農業', department: '農業（つくるマネジメント・流通マネジメント・くらしマネジメント）', quota: 48, applicantsConfirmed: 51, testTakersConfirmed: 50, finalPassers: 49 },
    { schoolName: '高遠', department: '普通', quota: 32, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '伊那北', department: '普通', quota: 160, applicantsConfirmed: 159, testTakersConfirmed: 158, finalPassers: 161 },
    { schoolName: '伊那北', department: '理数', quota: 4, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 5 },
    { schoolName: '伊那弥生ヶ丘', department: '普通', quota: 160, applicantsConfirmed: 162, testTakersConfirmed: 162, finalPassers: 160 },
    { schoolName: '赤穂', department: '普通', quota: 120, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 114 },
    { schoolName: '赤穂', department: '商業', quota: 32, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 32 },
    { schoolName: '駒ケ根工業', department: '工業（機械・電気・情報技術）', quota: 48, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 43 },
    { schoolName: '松川', department: '普通', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '飯田', department: '普通', quota: 200, applicantsConfirmed: 193, testTakersConfirmed: 192, finalPassers: 204 },
    { schoolName: '飯田', department: '理数', quota: 12, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 12 },
    { schoolName: '飯田風越', department: '普通', quota: 160, applicantsConfirmed: 164, testTakersConfirmed: 164, finalPassers: 160 },
    { schoolName: '飯田風越', department: '国際教養', quota: 4, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '飯田OIDE長姫', department: '機械工学', quota: 16, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 16 },
    { schoolName: '飯田OIDE長姫', department: '電子機械工学', quota: 16, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 16 },
    { schoolName: '飯田OIDE長姫', department: '電気電子工学', quota: 16, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '飯田OIDE長姫', department: '社会基盤工学', quota: 16, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 15 },
    { schoolName: '飯田OIDE長姫', department: '建築学', quota: 16, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 16 },
    { schoolName: '飯田OIDE長姫', department: '商業', quota: 32, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 31 },
    { schoolName: '下伊那農業', department: '栽培科学', quota: 16, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '下伊那農業', department: '地域資源', quota: 16, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '下伊那農業', department: '生物活用', quota: 16, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 16 },
    { schoolName: '阿智', department: '普通', quota: 48, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '阿南', department: '普通', quota: 54, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
  ],
  officialSubtotals: [
    // applicantsConfirmedはこの資料に印字が無いため、既存パイプライン再利用値の機械集計を
    // 参考値として置く（quota/testTakersConfirmed/finalPassersの3つだけが本資料の
    // 印字済み合計行と直接照合可能）。
    { label: '第1通学区 合計', quota: 2_623, applicantsConfirmed: 2_303, testTakersConfirmed: 2_299, finalPassers: 2_236 },
    { label: '第2通学区 合計', quota: 1_875, applicantsConfirmed: 1_761, testTakersConfirmed: 1_758, finalPassers: 1_699 },
    { label: '第3通学区 合計', quota: 2_246, applicantsConfirmed: 1_985, testTakersConfirmed: 1_975, finalPassers: 1_937 },
  ],
};
