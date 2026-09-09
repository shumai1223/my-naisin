import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 鳥取県 段階台帳（T-Y11F §5順序#7・14県目・全日制43レコードで完結）。
 *
 * 一次ソース: 鳥取県教育委員会「令和8年度鳥取県立高等学校一般入学者選抜受検者数等（学力検査時）
 * について」（令和8年3月5日・全7頁）＋「令和8年度鳥取県立高等学校入学者選抜合格者数等について」
 * （令和8年3月16日・全6頁）の2資料。
 * https://www.pref.tottori.lg.jp/secure/1419422/R08_ippan_jyukensya.pdf
 * https://www.pref.tottori.lg.jp/secure/1421302/R08_ippan_goukakusya.pdf
 *
 * ⚠️両PDFともpdftotextは数値のみ抽出可能で学校名・学科名は空欄化するため、pdftoppm 200dpi +
 * ビジョン読み取りで転記した。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/tottori.ts`（「最終志願者数一覧」
 * ＝実質募集定員・最終志願者数）をそのまま再利用。testTakersConfirmed・finalPassersは合格者数資料
 * （3/16公表）の「受検者数」列・「一般入試」合格者数列（特色入試合格者を含まない）から転記した
 * ——同資料内の2列を採るのは、受検者数資料（3/5公表）の受検者数が追検査（3/11実施）受検者を
 * 含まないのに対し、合格者数資料の受検者数は追検査受検者を含む（脚注に明記）ため、finalPassersと
 * 同一資料・同一時点のtestTakersConfirmedを組にして自己矛盾（finalPassers>testTakersConfirmed）を
 * 避けるため。
 *
 * ⚠️くくり募集2組は既存パイプラインの統合方針を継承: 鳥取東（普通・理数）は理数科の数値行が独立
 * 存在せず学校計に統合、智頭農林（生産科学・森林科学）・鳥取工業（機械・電気・情報工学・建設工学）
 * も学校計を1レコードとして採用。米子東の普通（生命科学）・普通（普通）は既存パイプラインと同じく
 * quotaが分離提示されているため独立レコード。
 *
 * quota・applicantsConfirmedの機械集計（2,937／2,334）が既存パイプラインの「県計」と、
 * testTakersConfirmed・finalPassersの機械集計（2,234／2,159）が合格者数資料本文の「県計」行
 * （受検者数2,234・一般入試合格者数計2,159）とそれぞれ完全一致した——4系列すべてが独立に県全体の
 * 印字済みグランドトータルと一致する高信頼度検証（初回転記で一致・再修正なし）。
 *
 * ⚠️既知の例外: 米子南「ＩＴビジネス」1件のみfinalPassers（48）がtestTakersConfirmed（38）を
 * 上回る。学校計（testTakers72／一般入試合格71）は不整合が無いため、同一校内の他学科
 * （生活創造〈ライフデザイン〉はtestTakers20に対し一般入試合格11で逆に下振れ）との間で学科間の
 * 合格者再配分が生じたためと推測される（Y-0につき断定はしない）。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const TOTTORI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'tottori',
  sources: [
    {
      url: 'https://www.pref.tottori.lg.jp/secure/1419422/R08_ippan_jyukensya.pdf',
      docTitle: '鳥取県教育委員会 令和8年度鳥取県立高等学校一般入学者選抜受検者数等（学力検査時）について',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.pref.tottori.lg.jp/secure/1421302/R08_ippan_goukakusya.pdf',
      docTitle: '鳥取県教育委員会 令和8年度鳥取県立高等学校入学者選抜合格者数等について',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（東部・中部・西部の3地区22校43レコードを完全収録）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制22校43レコードを完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/tottori.ts`を再利用。testTakersConfirmed・finalPassersは「合格者数等について」（3/16公表）の受検者数列・一般入試合格者数列（特色入試を除く）から転記した（受検者数資料〈3/5公表〉ではなくこちらを採用したのは、追検査受検者の扱いが揃っており finalPassers との自己矛盾を避けられるため）。4系列すべての機械集計（quota2,937／applicantsConfirmed2,334／testTakersConfirmed2,234／finalPassers2,159）が資料本文の「県計」行と独立に完全一致した。米子南「ＩＴビジネス」1件のみfinalPassersがtestTakersConfirmedを上回るが学校計では整合しており、学科間の合格者再配分と推測される。定時制課程は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制県計', quota: 2937, applicantsConfirmed: 2334, testTakersConfirmed: 2234, finalPassers: 2159 },
  ],
  records: [
    { schoolName: '鳥取東', department: '普通・理数（くくり募集）', quota: 280, applicantsConfirmed: 294, testTakersConfirmed: 290, finalPassers: 280 },
    { schoolName: '鳥取西', department: '普通', quota: 272, applicantsConfirmed: 308, testTakersConfirmed: 304, finalPassers: 278 },
    { schoolName: '鳥取商業', department: '商業', quota: 100, applicantsConfirmed: 67, testTakersConfirmed: 67, finalPassers: 66 },
    { schoolName: '鳥取工業', department: '工業（機械・電気・情報工学・建設工学）（くくり募集）', quota: 104, applicantsConfirmed: 47, testTakersConfirmed: 45, finalPassers: 44 },
    { schoolName: '鳥取湖陵', department: '食品システム', quota: 21, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '鳥取湖陵', department: '緑地デザイン', quota: 28, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '鳥取湖陵', department: '電子機械', quota: 31, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '鳥取湖陵', department: '人間環境', quota: 27, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '鳥取湖陵', department: '情報科学', quota: 24, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '青谷', department: '総合', quota: 57, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '岩美', department: '普通', quota: 55, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '八頭', department: '普通', quota: 182, applicantsConfirmed: 139, testTakersConfirmed: 138, finalPassers: 137 },
    { schoolName: '智頭農林', department: '生産科学・森林科学（くくり募集）', quota: 57, applicantsConfirmed: 9, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '倉吉東', department: '普通', quota: 170, applicantsConfirmed: 158, testTakersConfirmed: 155, finalPassers: 154 },
    { schoolName: '倉吉西', department: '普通', quota: 96, applicantsConfirmed: 68, testTakersConfirmed: 65, finalPassers: 65 },
    { schoolName: '倉吉農業', department: '生物', quota: 24, applicantsConfirmed: 14, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '倉吉農業', department: '食品', quota: 24, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '倉吉農業', department: '環境', quota: 29, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '倉吉総合産業', department: '機械', quota: 21, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '倉吉総合産業', department: '電気', quota: 23, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 8 },
    { schoolName: '倉吉総合産業', department: 'ビジネス', quota: 19, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '倉吉総合産業', department: '生活デザイン', quota: 19, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '鳥取中央育英', department: '普通', quota: 72, applicantsConfirmed: 47, testTakersConfirmed: 44, finalPassers: 42 },
    { schoolName: '米子東', department: '普通（生命科学）', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 40 },
    { schoolName: '米子東', department: '普通（普通）', quota: 240, applicantsConfirmed: 250, testTakersConfirmed: 247, finalPassers: 240 },
    { schoolName: '米子西', department: '普通', quota: 245, applicantsConfirmed: 302, testTakersConfirmed: 253, finalPassers: 245 },
    { schoolName: '米子', department: '総合', quota: 114, applicantsConfirmed: 83, testTakersConfirmed: 81, finalPassers: 81 },
    { schoolName: '米子南', department: 'ＩＴビジネス', quota: 69, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 48 },
    { schoolName: '米子南', department: '生活創造（ライフデザイン）', quota: 11, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 11 },
    { schoolName: '米子南', department: '生活創造（調理）', quota: 12, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 12 },
    { schoolName: '米子工業', department: '機械', quota: 22, applicantsConfirmed: 14, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '米子工業', department: '電気', quota: 21, applicantsConfirmed: 16, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '米子工業', department: '情報電子', quota: 22, applicantsConfirmed: 19, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '米子工業', department: '環境エネルギー', quota: 23, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 11 },
    { schoolName: '米子工業', department: '建設（土木）', quota: 10, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 9 },
    { schoolName: '米子工業', department: '建設（建築）', quota: 10, applicantsConfirmed: 9, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '境', department: '普通', quota: 150, applicantsConfirmed: 106, testTakersConfirmed: 102, finalPassers: 102 },
    { schoolName: '境港総合技術', department: '海洋', quota: 29, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 18 },
    { schoolName: '境港総合技術', department: '食品・ビジネス', quota: 33, applicantsConfirmed: 19, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '境港総合技術', department: '機械', quota: 30, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 12 },
    { schoolName: '境港総合技術', department: '電気電子', quota: 38, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '境港総合技術', department: '福祉', quota: 29, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '日野', department: '総合', quota: 54, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
  ],
};
