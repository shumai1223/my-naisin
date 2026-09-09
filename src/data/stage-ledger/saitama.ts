import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 埼玉県 段階台帳（T-Y11F §5順序#7・2県目パイロット・「全日制 普通科」区分は完全収録）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校入学者選抜における入学許可候補者数・
 * 欠員補充人員（令和8年3月6日現在）」（全10頁）1〜2頁目「全日制 普通科」（102レコード）。
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
 * 「finalPassers≤quota」を全県共通の不変条件とはしない（🔁訂正2026-09-09: 当初「chibaでは
 * 常に成立していた」と記録したが、chibaのR7データ追加で「千葉 普通科」〈quota240・
 * finalPassers241〉も1名超過することが判明し、この訂正自体が誤りだったと分かった。
 * 同一県内でも年度によって超過が起きたり起きなかったりする——結局「finalPassers≤quota」は
 * どの県でも普遍的な制約ではなく、むしろ稀に例外が起きる現象と理解するのが正しい）。
 *
 * 2頁目末尾の「普通科 計」行（quota25,517・testTakersConfirmed27,593・finalPassers24,556）と
 * 102レコード全数の機械集計が完全一致した——**「全日制 普通科」区分についてcoverage=
 * 'complete'に格上げ**（applicantsConfirmedはこの資料に印字が無いため参考値27,668のまま。
 * 詳細は`officialSubtotals`のコメント参照）。残る3〜10頁目（専門学科・総合学科）は未収録。
 *
 * ⚠️低解像度(150dpi)での初回ビジョン読み取りで「桶川」を「滑川」、「桶川西」を「滑川西」、
 * 「越生翔桜」を「越生梅林」、「越ケ谷」を「越ヶ谷」（半角カタカナ「ケ」と「ヶ」の誤認）と
 * 誤読した。既存`competition-rates/saitama.ts`との突合で学校名が1件も一致しないことに
 * 気付き、300dpiで再クロップして正しい学校名を確認した——**低解像度ビジョン解析は数値より
 * 学校名の誤読リスクが高い（特に類似字形の漢字）ため、既存パイプラインとの突合テストが
 * この種の誤りを機械的に検知する安全網として機能した**。
 *
 * ⚠️さらに「普通科 計」との突合で初回集計が198（quota）・162（testTakers/finalPassers）
 * 不足していることが判明し、**「小川」（quota198・applicants162）を丸ごと転記し忘れていた**
 * ことを特定・追加した——**既存パイプラインとの学校単位突合だけでは「1件まるごと欠落」は
 * 検知できない（存在しないものは比較のしようがない）。区分単位の公式合計突合こそが、
 * 欠落を検知できる唯一の機械的な安全網**（chibaで確立した「学校単位突合＋区分合計突合の
 * 二段構え」の価値が、saitamaでも異なる種類の事故（学校名誤読と件数欠落）を2つとも
 * 検知したことで裏付けられた）。
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
      docTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校入学者選抜における入学許可候補者数・欠員補充人員（令和8年3月6日現在）1〜2頁目（全日制 普通科）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制普通科（1〜2頁目・102レコード）'],
    pendingDepartments: ['専門学科（3頁目以降）', '総合学科'],
    note: '「全日制 普通科」区分を完全収録。「普通科 計」（quota25,517/testTakersConfirmed27,593/finalPassers24,556）と102レコード全数の機械集計が完全一致。quota/applicantsConfirmedは既存competition-rates/saitama.ts（同一quotaを別資料で確認済み）を再利用し、testTakersConfirmed/finalPassersのみ本資料から新規転記。',
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
    { schoolName: '小川', department: '普通科', quota: 198, applicantsConfirmed: 162, testTakersConfirmed: 162, finalPassers: 162 },
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
    // --- 2頁目（普通科の残り・市立高校を含む） ---
    { schoolName: '秩父', department: '普通科', quota: 158, applicantsConfirmed: 140, testTakersConfirmed: 140, finalPassers: 140 },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 198, applicantsConfirmed: 131, testTakersConfirmed: 131, finalPassers: 131 },
    { schoolName: '所沢', department: '普通科', quota: 358, applicantsConfirmed: 495, testTakersConfirmed: 490, finalPassers: 358 },
    { schoolName: '所沢北', department: '普通科', quota: 318, applicantsConfirmed: 406, testTakersConfirmed: 405, finalPassers: 318 },
    { schoolName: '所沢中央', department: '普通科', quota: 318, applicantsConfirmed: 322, testTakersConfirmed: 321, finalPassers: 318 },
    { schoolName: '所沢西', department: '普通科', quota: 318, applicantsConfirmed: 346, testTakersConfirmed: 346, finalPassers: 318 },
    { schoolName: '豊岡', department: '普通科', quota: 318, applicantsConfirmed: 338, testTakersConfirmed: 338, finalPassers: 318 },
    { schoolName: '南稜', department: '普通科', quota: 318, applicantsConfirmed: 370, testTakersConfirmed: 370, finalPassers: 318 },
    { schoolName: '新座', department: '普通科', quota: 198, applicantsConfirmed: 162, testTakersConfirmed: 161, finalPassers: 161 },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, applicantsConfirmed: 215, testTakersConfirmed: 215, finalPassers: 198 },
    { schoolName: '蓮田松韻', department: '普通科', quota: 158, applicantsConfirmed: 146, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, applicantsConfirmed: 165, testTakersConfirmed: 164, finalPassers: 158 },
    { schoolName: '羽生第一', department: '普通科', quota: 158, applicantsConfirmed: 128, testTakersConfirmed: 128, finalPassers: 128 },
    { schoolName: '飯能', department: '普通科', quota: 278, applicantsConfirmed: 242, testTakersConfirmed: 241, finalPassers: 241 },
    { schoolName: '日高', department: '普通科', quota: 118, applicantsConfirmed: 92, testTakersConfirmed: 92, finalPassers: 92 },
    { schoolName: '日高', department: '情報コース', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '深谷', department: '普通科', quota: 198, applicantsConfirmed: 149, testTakersConfirmed: 149, finalPassers: 149 },
    { schoolName: '深谷第一', department: '普通科', quota: 278, applicantsConfirmed: 280, testTakersConfirmed: 279, finalPassers: 278 },
    { schoolName: '富士見', department: '普通科', quota: 198, applicantsConfirmed: 207, testTakersConfirmed: 206, finalPassers: 198 },
    { schoolName: 'ふじみ野', department: '普通科', quota: 118, applicantsConfirmed: 108, testTakersConfirmed: 108, finalPassers: 111 },
    { schoolName: '不動岡', department: '普通科', quota: 358, applicantsConfirmed: 482, testTakersConfirmed: 481, finalPassers: 358 },
    { schoolName: '本庄', department: '普通科', quota: 318, applicantsConfirmed: 347, testTakersConfirmed: 347, finalPassers: 319 },
    { schoolName: '松伏', department: '普通科', quota: 118, applicantsConfirmed: 116, testTakersConfirmed: 116, finalPassers: 116 },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '松山', department: '普通科', quota: 278, applicantsConfirmed: 226, testTakersConfirmed: 226, finalPassers: 226 },
    { schoolName: '松山女子', department: '普通科', quota: 318, applicantsConfirmed: 309, testTakersConfirmed: 308, finalPassers: 308 },
    { schoolName: '三郷', department: '普通科', quota: 198, applicantsConfirmed: 123, testTakersConfirmed: 123, finalPassers: 123 },
    { schoolName: '三郷北', department: '普通科', quota: 238, applicantsConfirmed: 254, testTakersConfirmed: 254, finalPassers: 238 },
    { schoolName: '宮代', department: '普通科', quota: 198, applicantsConfirmed: 184, testTakersConfirmed: 184, finalPassers: 184 },
    { schoolName: '妻沼', department: '普通科', quota: 118, applicantsConfirmed: 79, testTakersConfirmed: 79, finalPassers: 79 },
    { schoolName: '八潮フロンティア', department: '普通科', quota: 119, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 119 },
    { schoolName: '与野', department: '普通科', quota: 358, applicantsConfirmed: 370, testTakersConfirmed: 367, finalPassers: 358 },
    { schoolName: '和光国際', department: '普通科', quota: 238, applicantsConfirmed: 309, testTakersConfirmed: 307, finalPassers: 238 },
    { schoolName: '鷲宮', department: '普通科', quota: 278, applicantsConfirmed: 301, testTakersConfirmed: 301, finalPassers: 282 },
    { schoolName: '蕨', department: '普通科', quota: 318, applicantsConfirmed: 376, testTakersConfirmed: 374, finalPassers: 318 },
    { schoolName: '市立川越', department: '普通科', quota: 140, applicantsConfirmed: 178, testTakersConfirmed: 177, finalPassers: 140 },
    { schoolName: '市立浦和', department: '普通科', quota: 240, applicantsConfirmed: 461, testTakersConfirmed: 460, finalPassers: 246 },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, applicantsConfirmed: 446, testTakersConfirmed: 446, finalPassers: 324 },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, applicantsConfirmed: 342, testTakersConfirmed: 342, finalPassers: 281 },
    { schoolName: '川口市立', department: '普通科', quota: 240, applicantsConfirmed: 382, testTakersConfirmed: 380, finalPassers: 243 },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, applicantsConfirmed: 133, testTakersConfirmed: 133, finalPassers: 82 },
  ],
  officialSubtotals: [
    // ⚠️applicantsConfirmedはこの資料（3月6日版）には印字されていない（既存パイプライン由来の
    // 自己集計値27,668を参考値として置く。quota/testTakersConfirmed/finalPassersの3つだけが
    // この資料の印字済み「普通科 計」行と直接照合可能）。
    { label: '普通科 計', quota: 25_517, applicantsConfirmed: 27_668, testTakersConfirmed: 27_593, finalPassers: 24_556 },
  ],
};
