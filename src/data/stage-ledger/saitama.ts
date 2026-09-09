import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 埼玉県 段階台帳（T-Y11F §5順序#7・2県目パイロット・全日制普通科の一部・10レコード）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校入学者選抜における入学許可候補者数・
 * 欠員補充人員（令和8年3月6日現在）」（全10頁）1頁目の冒頭10校。
 * https://www.pref.saitama.lg.jp/documents/268192/r8nyugakukyokakouhosya0306_4.pdf
 *
 * ⚠️既存の`competition-rates/saitama.ts`（倍率パイプライン）は**別の一次資料**（「令和8年度
 * 埼玉県公立高等学校における入学志願確定者数」・2月19〜20日頃公表のPDF）から募集人員(quota)＝
 * 入学許可予定者数(A)・志願確定者数(applicants)＝B(倍率B÷A)を採用している。今回の3月6日資料は
 * 選抜結果（試験後）の資料で、列構成は[募集人員 / 転編入者数 / 入学許可予定者数(A) /
 * 実受検者数(B) / 入学許可候補者数(C) / 倍率(B÷C)]——**「志願確定者数」に相当する列が無い**
 * （実受検者数(B)は学力検査当日に実際に受検した人数で、志願確定者数よりわずかに少ない）。
 * そのため本ファイルは**quota・applicantsConfirmedを既存`competition-rates/saitama.ts`から
 * そのまま再利用**し（Aの値は両資料で完全一致することを確認済み）、**testTakersConfirmed・
 * finalPassersのみを本資料から新規に転記**する設計にした（同一の学校×学科について複数の
 * 一次資料を組み合わせる、段階台帳で初めてのケース）。
 *
 * ⚠️上尾（普通科）はfinalPassers(244)がquota(238)を6名上回る。これはY-0違反ではなく、
 * 学力検査の合格ボーダー得点に同点者が複数出た場合、全員を合格とする（募集人員をわずかに
 * 超過する）という一般的な選抜運用の結果と考えられる（推測に留め断定しない）。段階台帳では
 * 「finalPassers≤quota」を全県共通の不変条件とはしない（chibaでは常に成立していたが、
 * これは県ごとの選抜運用に依存するローカルな傾向であり普遍的な制約ではないと判明した）。
 *
 * coverage='partial'（1頁目全60レコード・全10頁中）。
 *
 * ⚠️低解像度(150dpi)での初回ビジョン読み取りで「桶川」を「滑川」、「桶川西」を「滑川西」、
 * 「越生翔桜」を「越生梅林」、「越ケ谷」を「越ヶ谷」（半角カタカナ「ケ」と「ヶ」の誤認）と
 * 誤読した。既存`competition-rates/saitama.ts`との突合で学校名が1件も一致しないことに
 * 気付き、300dpiで再クロップして正しい学校名を確認した——**低解像度ビジョン解析は数値より
 * 学校名の誤読リスクが高い（特に類似字形の漢字）ため、既存パイプラインとの突合テストが
 * この種の誤りを機械的に検知する安全網として機能した**。
 *
 * ⚠️越生翔桜（quota118・applicants51）はtestTakersConfirmed(51)<finalPassers(59)という、
 * chibaで頻出した逆転パターンがsaitamaでも確認された（欠員補充等の推測は留め、印字値の
 * まま転記）。
 */

export const SAITAMA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'saitama',
  sources: [
    {
      url: 'https://www.pref.saitama.lg.jp/documents/268192/r8nyugakukyokakouhosya0306_4.pdf',
      docTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校入学者選抜における入学許可候補者数・欠員補充人員（令和8年3月6日現在）1頁目',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制普通科（1頁目全60レコード）'],
    pendingDepartments: ['全日制普通科の残り（2〜10頁目）', '専門学科', '総合学科'],
    note: '1頁目（全日制普通科の一部区分）を完全収録。quota/applicantsConfirmedは既存competition-rates/saitama.ts（同一quotaを別資料で確認済み）を再利用し、testTakersConfirmed/finalPassersのみ本資料から新規転記。',
  },
  records: [
    { schoolName: '上尾', department: '普通科', quota: 238, applicantsConfirmed: 316, testTakersConfirmed: 315, finalPassers: 244 },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, applicantsConfirmed: 182, testTakersConfirmed: 182, finalPassers: 182 },
    { schoolName: '上尾橘', department: '普通科', quota: 118, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 53 },
    { schoolName: '上尾南', department: '普通科', quota: 238, applicantsConfirmed: 247, testTakersConfirmed: 247, finalPassers: 238 },
    { schoolName: '朝霞', department: '普通科', quota: 318, applicantsConfirmed: 305, testTakersConfirmed: 305, finalPassers: 303 },
    { schoolName: '朝霞西', department: '普通科', quota: 318, applicantsConfirmed: 369, testTakersConfirmed: 369, finalPassers: 318 },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 718, applicantsConfirmed: 789, testTakersConfirmed: 789, finalPassers: 718 },
    { schoolName: '入間向陽', department: '普通科', quota: 318, applicantsConfirmed: 332, testTakersConfirmed: 332, finalPassers: 318 },
    { schoolName: '岩槻', department: '普通科', quota: 278, applicantsConfirmed: 305, testTakersConfirmed: 305, finalPassers: 278 },
    { schoolName: '浦和', department: '普通科', quota: 358, applicantsConfirmed: 434, testTakersConfirmed: 424, finalPassers: 362 },
    { schoolName: '浦和北', department: '普通科', quota: 318, applicantsConfirmed: 334, testTakersConfirmed: 334, finalPassers: 319 },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, applicantsConfirmed: 437, testTakersConfirmed: 428, finalPassers: 358 },
    { schoolName: '浦和西', department: '普通科', quota: 358, applicantsConfirmed: 519, testTakersConfirmed: 517, finalPassers: 359 },
    { schoolName: '浦和東', department: '普通科', quota: 318, applicantsConfirmed: 318, testTakersConfirmed: 318, finalPassers: 318 },
    { schoolName: '大宮', department: '普通科', quota: 318, applicantsConfirmed: 507, testTakersConfirmed: 499, finalPassers: 326 },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, applicantsConfirmed: 203, testTakersConfirmed: 203, finalPassers: 198 },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '大宮東', department: '普通科', quota: 238, applicantsConfirmed: 219, testTakersConfirmed: 219, finalPassers: 218 },
    { schoolName: '大宮南', department: '普通科', quota: 358, applicantsConfirmed: 386, testTakersConfirmed: 386, finalPassers: 359 },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 198, applicantsConfirmed: 197, testTakersConfirmed: 196, finalPassers: 196 },
    { schoolName: '桶川', department: '普通科', quota: 278, applicantsConfirmed: 265, testTakersConfirmed: 265, finalPassers: 265 },
    { schoolName: '桶川西', department: '普通科', quota: 118, applicantsConfirmed: 102, testTakersConfirmed: 102, finalPassers: 102 },
    { schoolName: '越生翔桜', department: '普通科', quota: 118, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 59 },
    { schoolName: '春日部', department: '普通科', quota: 358, applicantsConfirmed: 473, testTakersConfirmed: 470, finalPassers: 358 },
    { schoolName: '春日部女子', department: '普通科', quota: 238, applicantsConfirmed: 243, testTakersConfirmed: 243, finalPassers: 239 },
    { schoolName: '春日部東', department: '普通科', quota: 318, applicantsConfirmed: 323, testTakersConfirmed: 323, finalPassers: 318 },
    { schoolName: '川口', department: '普通科', quota: 318, applicantsConfirmed: 356, testTakersConfirmed: 354, finalPassers: 319 },
    { schoolName: '川口北', department: '普通科', quota: 358, applicantsConfirmed: 374, testTakersConfirmed: 372, finalPassers: 358 },
    { schoolName: '川口青陵', department: '普通科', quota: 278, applicantsConfirmed: 277, testTakersConfirmed: 277, finalPassers: 276 },
    { schoolName: '川口東', department: '普通科', quota: 278, applicantsConfirmed: 314, testTakersConfirmed: 314, finalPassers: 279 },
    { schoolName: '川越', department: '普通科', quota: 358, applicantsConfirmed: 486, testTakersConfirmed: 486, finalPassers: 362 },
    { schoolName: '川越女子', department: '普通科', quota: 358, applicantsConfirmed: 435, testTakersConfirmed: 432, finalPassers: 359 },
    { schoolName: '川越西', department: '普通科', quota: 278, applicantsConfirmed: 302, testTakersConfirmed: 302, finalPassers: 280 },
    { schoolName: '川越初雁', department: '普通科', quota: 198, applicantsConfirmed: 163, testTakersConfirmed: 162, finalPassers: 162 },
    { schoolName: '川越南', department: '普通科', quota: 358, applicantsConfirmed: 431, testTakersConfirmed: 431, finalPassers: 358 },
    { schoolName: '北本', department: '普通科', quota: 118, applicantsConfirmed: 113, testTakersConfirmed: 113, finalPassers: 113 },
    { schoolName: '久喜', department: '普通科', quota: 278, applicantsConfirmed: 244, testTakersConfirmed: 243, finalPassers: 243 },
    { schoolName: '熊谷', department: '普通科', quota: 278, applicantsConfirmed: 314, testTakersConfirmed: 313, finalPassers: 279 },
    { schoolName: '熊谷女子', department: '普通科', quota: 278, applicantsConfirmed: 313, testTakersConfirmed: 313, finalPassers: 278 },
    { schoolName: '熊谷西', department: '普通科', quota: 278, applicantsConfirmed: 324, testTakersConfirmed: 324, finalPassers: 279 },
    { schoolName: '栗橋北彩', department: '普通科', quota: 158, applicantsConfirmed: 131, testTakersConfirmed: 131, finalPassers: 131 },
    { schoolName: '鴻巣', department: '普通科', quota: 198, applicantsConfirmed: 172, testTakersConfirmed: 172, finalPassers: 171 },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, applicantsConfirmed: 405, testTakersConfirmed: 403, finalPassers: 323 },
    { schoolName: '越谷北', department: '普通科', quota: 318, applicantsConfirmed: 381, testTakersConfirmed: 381, finalPassers: 319 },
    { schoolName: '越谷西', department: '普通科', quota: 318, applicantsConfirmed: 320, testTakersConfirmed: 320, finalPassers: 318 },
    { schoolName: '越谷東', department: '普通科', quota: 278, applicantsConfirmed: 290, testTakersConfirmed: 290, finalPassers: 279 },
    { schoolName: '越谷南', department: '普通科', quota: 318, applicantsConfirmed: 427, testTakersConfirmed: 426, finalPassers: 319 },
    { schoolName: '児玉', department: '普通科', quota: 79, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '坂戸', department: '普通科', quota: 318, applicantsConfirmed: 366, testTakersConfirmed: 366, finalPassers: 322 },
    { schoolName: '坂戸西', department: '普通科', quota: 318, applicantsConfirmed: 302, testTakersConfirmed: 301, finalPassers: 301 },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, applicantsConfirmed: 174, testTakersConfirmed: 174, finalPassers: 173 },
    { schoolName: '志木', department: '普通科', quota: 238, applicantsConfirmed: 253, testTakersConfirmed: 252, finalPassers: 238 },
    { schoolName: '庄和', department: '普通科', quota: 158, applicantsConfirmed: 157, testTakersConfirmed: 157, finalPassers: 157 },
    { schoolName: '白岡', department: '普通科', quota: 158, applicantsConfirmed: 149, testTakersConfirmed: 148, finalPassers: 148 },
    { schoolName: '杉戸', department: '普通科', quota: 278, applicantsConfirmed: 331, testTakersConfirmed: 331, finalPassers: 278 },
    { schoolName: '草加', department: '普通科', quota: 358, applicantsConfirmed: 356, testTakersConfirmed: 356, finalPassers: 356 },
    { schoolName: '草加西', department: '普通科', quota: 238, applicantsConfirmed: 241, testTakersConfirmed: 241, finalPassers: 239 },
    { schoolName: '草加東', department: '普通科', quota: 318, applicantsConfirmed: 329, testTakersConfirmed: 329, finalPassers: 318 },
    { schoolName: '草加南', department: '普通科', quota: 238, applicantsConfirmed: 242, testTakersConfirmed: 242, finalPassers: 239 },
  ],
};
