import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 島根県 段階台帳（T-Y11F §5順序#7・24県目・全日制64レコードで完結）。
 *
 * 一次ソース: 島根県教育委員会「令和8年度島根県公立高等学校入学者選抜 一般選抜等合格者数及び
 * 第２次募集募集人員一覧」（令和8年3月13日・全1ページ2段組）。
 * https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/kanendosenbatsu.data/01_R8_gokakusha-2jiboshu.pdf
 *
 * ⚠️学校名誤帰属バグの発見と訂正（詳細は`competition-rates/shimane.ts`の該当コメント参照）: 本資料
 * を読む過程で、既存パイプラインが「情報科学（情報システム・情報処理・マルチメディア）」を安来の
 * 1学科として誤って収録していたことが判明した。本資料・別の「学力検査受検状況」(3/4)資料・および
 * 学校マスター`src/data/schools/shimane.ts`のいずれもが「情報科学」を安来市の独立校（島根県立
 * 情報科学高等学校）として別行掲載しており、既存パイプラインをR5〜R8全4年度で訂正した（本作業の
 * 副産物・ibaraki/tokushimaと同型の学校名誤帰属バグの6件目）。段階台帳は訂正後の学校名を採用する。
 *
 * ⚠️別資料との時点差に注意: 本資料より前に読んだ「学力検査受検状況」(3/4)は本資料の脚注が明記する
 * 「受検者数には追検査の受検者数を含む」対応をしておらず、県立高校計の受検者数が本資料と10名差
 * （2,278 vs 2,288）だった。段階台帳は単一資料内で完結させる設計を優先し、quota・applicantsConfirmed
 * ・testTakersConfirmed・finalPassersの4フィールドすべてを本資料（3/13・追検査反映済み）から
 * 独立に転記した（quota=募集定員d=b-c、applicantsConfirmed=出願者数e、testTakersConfirmed=
 * 受検者数g、finalPassers=一般選抜合格者数h。特色選抜合格者数cは含まない）。
 *
 * 4系列すべての機械集計（quota3,084・applicantsConfirmed2,493・testTakersConfirmed2,332・
 * finalPassers2,200、35校（県立34校+市立1校）64レコード）が資料本文の「合計」行と、県立高校
 * 分のみの機械集計（3,031／2,447／2,288／2,156）が「県立高校計」行と、それぞれ初回転記で完全
 * 一致した（再修正なし）。quota・applicantsConfirmedは訂正後の既存パイプラインとも全件完全一致。
 *
 * ⚠️既知の6件: finalPassersがtestTakersConfirmedを上回るのは、いずれも定員に対し出願者数が
 * 少ない小規模学科（松江南「探究科学」・松江農林「環境土木」・出雲工業「機械」「電気」・出雲農林
 * 「植物科学」・江津工業「機械・ロボット」）で、福井県で確認した「定員割れ学科は受験者全員合格+
 * 追加充当」と同型のパターンと推測される。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const SHIMANE_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'shimane',
  sources: [
    {
      url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/kanendosenbatsu.data/01_R8_gokakusha-2jiboshu.pdf',
      docTitle: '島根県教育委員会 令和8年度島根県公立高等学校入学者選抜 一般選抜等合格者数及び第２次募集募集人員一覧',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（35校（県立34校+市立1校）64レコードを完全収録）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note:
      'quota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてを単一資料' +
      '（一般選抜等合格者数及び第２次募集募集人員一覧・3/13）から独立に転記した。4系列すべての' +
      '機械集計（3,084／2,493／2,332／2,200）が資料本文の「合計」行、県立高校分（3,031／2,447／' +
      '2,288／2,156）が「県立高校計」行とそれぞれ完全一致した。本作業で既存パイプラインの' +
      '「情報科学」学校名誤帰属バグ（安来の学科として誤収録）を発見・訂正済み。finalPassersが' +
      'testTakersConfirmedを上回る6件は定員割れ学科の構造的パターン。定時制課程は他県と同じ理由で' +
      'スコープ外。',
  },
  officialSubtotals: [
    { label: '合計', quota: 3084, applicantsConfirmed: 2493, testTakersConfirmed: 2332, finalPassers: 2200 },
    { label: '県立高校計', quota: 3031, applicantsConfirmed: 2447, testTakersConfirmed: 2288, finalPassers: 2156 },
  ],
  records: [
    { schoolName: '安来', department: '普通', quota: 81, applicantsConfirmed: 48, testTakersConfirmed: 43, finalPassers: 43 },
    { schoolName: '情報科学', department: '情報科学(情報システム・情報処理・マルチメディア)', quota: 72, applicantsConfirmed: 46, testTakersConfirmed: 40, finalPassers: 39 },
    { schoolName: '松江北', department: '普通', quota: 192, applicantsConfirmed: 201, testTakersConfirmed: 188, finalPassers: 186 },
    { schoolName: '松江北', department: '理数', quota: 36, applicantsConfirmed: 35, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '松江南', department: '普通', quota: 163, applicantsConfirmed: 201, testTakersConfirmed: 179, finalPassers: 163 },
    { schoolName: '松江南', department: '探究科学', quota: 24, applicantsConfirmed: 19, testTakersConfirmed: 14, finalPassers: 19 },
    { schoolName: '松江東', department: '普通', quota: 109, applicantsConfirmed: 121, testTakersConfirmed: 112, finalPassers: 109 },
    { schoolName: '松江工業', department: '機械', quota: 23, applicantsConfirmed: 25, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '松江工業', department: '電子機械', quota: 19, applicantsConfirmed: 20, testTakersConfirmed: 18, finalPassers: 15 },
    { schoolName: '松江工業', department: '電気電子工学', quota: 22, applicantsConfirmed: 19, testTakersConfirmed: 16, finalPassers: 15 },
    { schoolName: '松江工業', department: '情報クリエイター学', quota: 27, applicantsConfirmed: 22, testTakersConfirmed: 15, finalPassers: 13 },
    { schoolName: '松江工業', department: '建築都市工学', quota: 27, applicantsConfirmed: 18, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '松江商業', department: '商業(商業・国際ビジネス・情報処理)', quota: 101, applicantsConfirmed: 133, testTakersConfirmed: 131, finalPassers: 101 },
    { schoolName: '松江農林', department: '生物生産', quota: 24, applicantsConfirmed: 30, testTakersConfirmed: 29, finalPassers: 24 },
    { schoolName: '松江農林', department: '環境土木', quota: 24, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 19 },
    { schoolName: '松江農林', department: '総合学科', quota: 44, applicantsConfirmed: 49, testTakersConfirmed: 47, finalPassers: 44 },
    { schoolName: '大東', department: '普通', quota: 52, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 22 },
    { schoolName: '横田', department: '普通', quota: 67, applicantsConfirmed: 37, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '三刀屋', department: '総合学科', quota: 89, applicantsConfirmed: 52, testTakersConfirmed: 48, finalPassers: 48 },
    { schoolName: '掛合', department: '普通', quota: 33, applicantsConfirmed: 23, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '飯南', department: '普通', quota: 34, applicantsConfirmed: 19, testTakersConfirmed: 17, finalPassers: 9 },
    { schoolName: '平田', department: '普通', quota: 88, applicantsConfirmed: 105, testTakersConfirmed: 100, finalPassers: 88 },
    { schoolName: '出雲', department: '普通', quota: 143, applicantsConfirmed: 160, testTakersConfirmed: 151, finalPassers: 143 },
    { schoolName: '出雲', department: '理数', quota: 24, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 22 },
    { schoolName: '出雲工業', department: '機械', quota: 22, applicantsConfirmed: 22, testTakersConfirmed: 20, finalPassers: 22 },
    { schoolName: '出雲工業', department: '電気', quota: 24, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 21 },
    { schoolName: '出雲工業', department: '電子機械', quota: 24, applicantsConfirmed: 30, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '出雲工業', department: '建築', quota: 21, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 21 },
    { schoolName: '出雲商業', department: '商業', quota: 68, applicantsConfirmed: 56, testTakersConfirmed: 54, finalPassers: 53 },
    { schoolName: '出雲商業', department: '情報処理', quota: 24, applicantsConfirmed: 21, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '出雲農林', department: '植物科学', quota: 23, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 23 },
    { schoolName: '出雲農林', department: '環境科学', quota: 19, applicantsConfirmed: 20, testTakersConfirmed: 18, finalPassers: 16 },
    { schoolName: '出雲農林', department: '食品科学', quota: 23, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '出雲農林', department: '動物科学', quota: 23, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 23 },
    { schoolName: '大社', department: '普通', quota: 140, applicantsConfirmed: 163, testTakersConfirmed: 155, finalPassers: 140 },
    { schoolName: '大社', department: '体育', quota: 12, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 12 },
    { schoolName: '大田', department: '普通', quota: 92, applicantsConfirmed: 76, testTakersConfirmed: 75, finalPassers: 74 },
    { schoolName: '大田', department: '理数', quota: 30, applicantsConfirmed: 7, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '邇摩', department: '総合学科', quota: 68, applicantsConfirmed: 24, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '島根中央', department: '普通', quota: 55, applicantsConfirmed: 22, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '矢上', department: '普通', quota: 41, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '矢上', department: '産業技術', quota: 20, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 15 },
    { schoolName: '江津', department: '普通', quota: 49, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 11 },
    { schoolName: '江津工業', department: '機械・ロボット', quota: 33, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 8 },
    { schoolName: '江津工業', department: '建築・電気', quota: 22, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 22 },
    { schoolName: '浜田', department: '普通', quota: 92, applicantsConfirmed: 68, testTakersConfirmed: 67, finalPassers: 67 },
    { schoolName: '浜田', department: '理数', quota: 29, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 7 },
    { schoolName: '浜田商業', department: '商業(商業・情報処理)', quota: 44, applicantsConfirmed: 29, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '浜田水産', department: '海洋技術', quota: 22, applicantsConfirmed: 10, testTakersConfirmed: 8, finalPassers: 7 },
    { schoolName: '浜田水産', department: '食品流通', quota: 30, applicantsConfirmed: 4, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '益田', department: '普通', quota: 106, applicantsConfirmed: 101, testTakersConfirmed: 99, finalPassers: 99 },
    { schoolName: '益田', department: '理数', quota: 38, applicantsConfirmed: 14, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '益田翔陽', department: '電子機械', quota: 24, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 5 },
    { schoolName: '益田翔陽', department: '電気', quota: 22, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '益田翔陽', department: '生物環境工学', quota: 22, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '益田翔陽', department: '総合学科', quota: 22, applicantsConfirmed: 12, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '吉賀', department: '普通', quota: 18, applicantsConfirmed: 3, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '津和野', department: '未来共創', quota: 44, applicantsConfirmed: 20, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '隠岐', department: '普通', quota: 38, applicantsConfirmed: 4, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '隠岐', department: '商業', quota: 24, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 9 },
    { schoolName: '隠岐島前', department: '普通(普通・地域共創)', quota: 51, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '隠岐水産', department: '海洋システム', quota: 26, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 10 },
    { schoolName: '隠岐水産', department: '海洋生産', quota: 28, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 8 },
    { schoolName: '皆美が丘女子', department: '普通', quota: 53, applicantsConfirmed: 46, testTakersConfirmed: 44, finalPassers: 44 },
  ],
};
