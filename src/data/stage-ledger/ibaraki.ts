import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 茨城県 段階台帳（T-Y11F §5順序#7・4県目・全日制県立区分が完結・149レコード）。
 *
 * 一次ソース: 茨城県教育委員会「令和8年度茨城県立高等学校第1学年合格状況（一般入学）」
 * （3月10日公表・全4頁）の1頁目（高萩清松〜玉造工業・34校63レコード）＋2頁目（麻生〜
 * 石下紫峰・38校66レコード）＋3頁目全日制部分（水海道第一〜伊奈・12校20レコード）。
 * https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/03/gokaku.pdf
 *
 * ⚠️既存の`competition-rates/ibaraki.ts`（倍率パイプライン）は**別の一次資料**（「入学志願者数等
 * （志願先変更後）」・2月18日公表のPDF）を採用している。列構成は[募集定員/受検者数/合格者数/
 * 帰国生徒特例選抜(内数:受検者数・合格者数)/外国人特例選抜(内数:受検者数・合格者数)/特色選抜
 * (内数:募集人員・受検者数・合格者数)]で、**本資料には「志願者数」列自体が存在しない**（志願者数は
 * 試験前の2月18日資料にのみ存在し、本資料は試験後の受検者数・合格者数のみを掲載）。そのため
 * quota・applicantsConfirmedは既存パイプラインから再利用し（募集定員は試験日まで不変で全63件
 * 完全一致を確認済み）、testTakersConfirmed=受検者数・finalPassers=合格者数のみを本資料から
 * 新規に転記した（段階台帳で複数の一次資料を組み合わせる設計・saitama.tsの3月資料合成と同型）。
 * 特色選抜等の内数列は主要3列（募集定員・受検者数・合格者数）に既に含まれているため、本ファイルの
 * スコープでは参照のみで転記対象にしない。
 *
 * ⚠️新種の異常値を2種確認（1頁目）: ①**quota超過**が2件（水戸第一・普通=quota161→
 * final164、水戸農業・生活科学=quota40→final41）——chiba/saitamaで確認済みの「合格
 * ボーダー同点者の全員合格」と同型と推測。②**finalPassers>applicantsConfirmed**が3件
 * （日立商業・情報処理=applicants38→final40、水戸農業・農業経済=applicants27→final32、
 * 水戸工業・電気=applicants78→final80）——chiba R7で確認済みの「特別入学者選抜等の別枠
 * 合算」と同型パターンがibarakiでも再現された。
 *
 * 🔁2頁目追加（麻生〜石下紫峰・38校66レコード）: quotaは既存パイプラインと66件すべて完全
 * 一致（1頁目と合わせ計129件）。異常値がさらに2種4件追加発見された: ①quota超過1件
 * （藤代・普通=quota240→final242）で累計3件。②finalPassers>applicantsConfirmedが3件
 * （波崎・機械=applicants35→final37、波崎・電気=applicants28→final34、下館工業・
 * 電気電子=applicants72→final73）で累計6件。2頁とも一貫して「合格ボーダー同点者」型
 * （quota超過）と「特別入学者選抜等の別枠合算」型（applicants超過）の2系統に収まっており、
 * 新種の第3パターンは出現していない。
 *
 * 🔁3頁目追加（水海道第一〜伊奈・12校20レコード）＝**これで「全日制県立」区分が完結・
 * 既存パイプライン冒頭コメントの「85校149レコード」と件数完全一致**。quotaは既存
 * パイプラインと20件すべて完全一致（3頁とも計149件）。この頁は異常値0件（quota超過も
 * finalPassers>applicantsConfirmedも無し）。**3頁目に本資料自体の「全日制計」行**
 * （募集定員16,647/受検者数14,990/合格者数14,020）が印字されており、149レコード全数の
 * 機械集計がquota16,647・testTakersConfirmed14,990・finalPassers14,020の3系列すべてと
 * 一発で完全一致した（applicantsConfirmedはこの資料に印字が無いため対象外だが、参考値の
 * 合計15,211は既存パイプライン冒頭コメントの「applicants15,211」と一致することを確認
 * 済み）——個別レコードの既存パイプライン突合とは独立した、資料自体からの最上位検算にも
 * 一度も外れることなく到達でき、茨城県「全日制県立」149レコードに収録漏れ・重複が一件も
 * 無いことを証明できた。3頁目末尾には「附属中からの入学予定者」（503名・外数）を加えた
 * 「全日制総計」（17,150/15,493/14,523）と、別スコープの【定時制】（960/406/398）・
 * 【連携型入学者選抜】（小瀬1件）も掲載されているが、既存パイプラインと同じ理由でいずれも
 * 本ファイルのスコープ外。
 */

export const IBARAKI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'ibaraki',
  sources: [
    {
      url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/03/gokaku.pdf',
      docTitle: '茨城県教育委員会 令和8年度茨城県立高等学校第1学年合格状況（一般入学）1〜3頁目全日制部分（高萩清松〜伊奈）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '全日制県立（1頁目・高萩清松〜玉造工業・34校63レコード）',
      '全日制県立（2頁目・麻生〜石下紫峰・38校66レコード）',
      '全日制県立（3頁目・水海道第一〜伊奈・12校20レコード）',
    ],
    pendingDepartments: [],
    note: '「全日制県立」区分（85校149レコード）を完全収録し既存パイプラインの「85校149レコード」と件数完全一致。quotaは既存competition-rates/ibaraki.tsと全149件で完全一致（募集定員は試験日まで不変であることを確認）。applicantsConfirmedも既存パイプラインをそのまま再利用（本資料には志願者数列が存在しないため）。testTakersConfirmed/finalPassersのみ本資料から新規転記。quota超過3件・finalPassers>applicantsConfirmed6件を確認（いずれもchiba/saitamaで確認済みの既知パターンと同型）。3頁目末尾の「全日制計」（quota16,647/testTakers14,990/final14,020）と149レコード全数の機械集計が3系列とも完全一致。附属中入学予定者を加えた「全日制総計」・別スコープの【定時制】【連携型入学者選抜】は対象外。',
  },
  records: [
    { schoolName: '高萩清松', department: '総合', quota: 120, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 101 },
    { schoolName: '日立第一', department: '普通・サイエンス', quota: 161, applicantsConfirmed: 211, testTakersConfirmed: 198, finalPassers: 161 },
    { schoolName: '日立第二', department: '普通', quota: 160, applicantsConfirmed: 61, testTakersConfirmed: 61, finalPassers: 61 },
    { schoolName: '日立工業', department: '機械・工業化学', quota: 80, applicantsConfirmed: 60, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '日立工業', department: '電気', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '日立工業', department: '情報電子', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '多賀', department: '普通', quota: 240, applicantsConfirmed: 208, testTakersConfirmed: 207, finalPassers: 207 },
    { schoolName: '日立商業', department: '商業', quota: 160, applicantsConfirmed: 191, testTakersConfirmed: 190, finalPassers: 160 },
    { schoolName: '日立商業', department: '情報処理', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 40 },
    { schoolName: '日立北', department: '普通', quota: 200, applicantsConfirmed: 154, testTakersConfirmed: 149, finalPassers: 149 },
    { schoolName: '磯原郷英', department: '普通', quota: 80, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '太田第一', department: '普通', quota: 161, applicantsConfirmed: 119, testTakersConfirmed: 115, finalPassers: 115 },
    { schoolName: '太田西山', department: '普通', quota: 160, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 46 },
    { schoolName: '大子清流', department: '農林科学', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '大子清流', department: '総合', quota: 80, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '小瀬', department: '普通', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '常陸大宮', department: '普通', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '常陸大宮', department: '機械・情報技術', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '常陸大宮', department: '商業', quota: 40, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '水戸第一', department: '普通', quota: 161, applicantsConfirmed: 235, testTakersConfirmed: 225, finalPassers: 164 },
    { schoolName: '水戸第二', department: '普通', quota: 320, applicantsConfirmed: 326, testTakersConfirmed: 319, finalPassers: 319 },
    { schoolName: '水戸第三', department: '普通', quota: 240, applicantsConfirmed: 331, testTakersConfirmed: 328, finalPassers: 240 },
    { schoolName: '水戸第三', department: '家政', quota: 40, applicantsConfirmed: 59, testTakersConfirmed: 59, finalPassers: 40 },
    { schoolName: '水戸第三', department: '音楽', quota: 30, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '緑岡', department: '普通・理数', quota: 280, applicantsConfirmed: 324, testTakersConfirmed: 300, finalPassers: 280 },
    { schoolName: '水戸農業', department: '農業', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '水戸農業', department: '園芸', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '水戸農業', department: '畜産', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '水戸農業', department: '食品化学', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '水戸農業', department: '農業土木', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '水戸農業', department: '生活科学', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 45, finalPassers: 41 },
    { schoolName: '水戸農業', department: '農業経済', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 32 },
    { schoolName: '水戸工業', department: '機械', quota: 80, applicantsConfirmed: 91, testTakersConfirmed: 89, finalPassers: 80 },
    { schoolName: '水戸工業', department: '電気', quota: 80, applicantsConfirmed: 78, testTakersConfirmed: 76, finalPassers: 80 },
    { schoolName: '水戸工業', department: '情報技術', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '水戸工業', department: '建築', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 40 },
    { schoolName: '水戸工業', department: '土木', quota: 40, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 40 },
    { schoolName: '水戸工業', department: '工業化学', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '水戸商業', department: '商業', quota: 120, applicantsConfirmed: 161, testTakersConfirmed: 159, finalPassers: 120 },
    { schoolName: '水戸商業', department: '情報ビジネス', quota: 80, applicantsConfirmed: 102, testTakersConfirmed: 102, finalPassers: 80 },
    { schoolName: '水戸商業', department: '国際ビジネス', quota: 80, applicantsConfirmed: 92, testTakersConfirmed: 92, finalPassers: 80 },
    { schoolName: '水戸桜ノ牧', department: '普通', quota: 320, applicantsConfirmed: 385, testTakersConfirmed: 369, finalPassers: 320 },
    { schoolName: '水戸桜ノ牧常北校', department: '普通', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '勝田工業', department: '総合工学', quota: 240, applicantsConfirmed: 111, testTakersConfirmed: 110, finalPassers: 110 },
    { schoolName: '佐和', department: '普通', quota: 240, applicantsConfirmed: 250, testTakersConfirmed: 247, finalPassers: 240 },
    { schoolName: '那珂湊', department: '普通', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '那珂湊', department: '商業に関する学科', quota: 80, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: '海洋', department: '海洋技術', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '海洋', department: '海洋食品', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '海洋', department: '海洋産業', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '笠間', department: '普通', quota: 80, applicantsConfirmed: 64, testTakersConfirmed: 63, finalPassers: 63 },
    { schoolName: '笠間', department: '美術', quota: 30, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '笠間', department: 'メディア芸術', quota: 30, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '大洗', department: '普通', quota: 80, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '大洗', department: '普通〔音楽〕', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '東海', department: '普通', quota: 160, applicantsConfirmed: 142, testTakersConfirmed: 139, finalPassers: 139 },
    { schoolName: '茨城東', department: '普通', quota: 80, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '那珂', department: '普通', quota: 160, applicantsConfirmed: 166, testTakersConfirmed: 165, finalPassers: 160 },
    { schoolName: '鉾田第一', department: '普通', quota: 202, applicantsConfirmed: 190, testTakersConfirmed: 188, finalPassers: 188 },
    { schoolName: '鉾田第二', department: '総合', quota: 160, applicantsConfirmed: 136, testTakersConfirmed: 136, finalPassers: 136 },
    { schoolName: '鉾田第二', department: '農業', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '鉾田第二', department: '食品技術', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '玉造工業', department: '工業に関する学科', quota: 120, applicantsConfirmed: 63, testTakersConfirmed: 63, finalPassers: 63 },
    // --- 2頁目（麻生〜石下紫峰） ---
    { schoolName: '麻生', department: '普通', quota: 200, applicantsConfirmed: 204, testTakersConfirmed: 202, finalPassers: 200 },
    { schoolName: '潮来', department: '普通', quota: 80, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 58 },
    { schoolName: '潮来', department: '地域ビジネス', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '潮来', department: '人間科学', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '鹿島', department: '普通', quota: 202, applicantsConfirmed: 225, testTakersConfirmed: 223, finalPassers: 202 },
    { schoolName: '神栖', department: '普通', quota: 160, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 112 },
    { schoolName: '波崎', department: '普通', quota: 80, applicantsConfirmed: 78, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '波崎', department: '機械', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 37 },
    { schoolName: '波崎', department: '電気', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 34 },
    { schoolName: '波崎', department: '工業化学・情報', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 48, finalPassers: 40 },
    { schoolName: '波崎柳川', department: '普通', quota: 120, applicantsConfirmed: 60, testTakersConfirmed: 59, finalPassers: 59 },
    { schoolName: '土浦第一', department: '普通', quota: 161, applicantsConfirmed: 181, testTakersConfirmed: 176, finalPassers: 161 },
    { schoolName: '土浦第二', department: '普通', quota: 320, applicantsConfirmed: 373, testTakersConfirmed: 366, finalPassers: 320 },
    { schoolName: '土浦第三', department: '普通', quota: 120, applicantsConfirmed: 144, testTakersConfirmed: 141, finalPassers: 120 },
    { schoolName: '土浦第三', department: '商業に関する学科', quota: 120, applicantsConfirmed: 166, testTakersConfirmed: 166, finalPassers: 120 },
    { schoolName: '土浦工業', department: '機械', quota: 80, applicantsConfirmed: 70, testTakersConfirmed: 69, finalPassers: 69 },
    { schoolName: '土浦工業', department: '電気', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '土浦工業', department: '情報技術', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '土浦工業', department: '建築', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '土浦工業', department: '土木', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '土浦湖北', department: '普通', quota: 240, applicantsConfirmed: 247, testTakersConfirmed: 246, finalPassers: 240 },
    { schoolName: '石岡第一', department: '普通', quota: 240, applicantsConfirmed: 222, testTakersConfirmed: 218, finalPassers: 218 },
    { schoolName: '石岡第一', department: '園芸', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '石岡第一', department: '造園', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '石岡第二', department: '普通', quota: 160, applicantsConfirmed: 130, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '石岡第二', department: '生活デザイン', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '石岡商業', department: '商業', quota: 80, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '石岡商業', department: '情報処理', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '中央', department: '普通', quota: 160, applicantsConfirmed: 105, testTakersConfirmed: 103, finalPassers: 103 },
    { schoolName: '中央', department: '普通〔スポーツ科学〕', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '竜ヶ崎第一', department: '普通', quota: 200, applicantsConfirmed: 206, testTakersConfirmed: 199, finalPassers: 199 },
    { schoolName: '竜ヶ崎第二', department: '普通', quota: 80, applicantsConfirmed: 93, testTakersConfirmed: 92, finalPassers: 80 },
    { schoolName: '竜ヶ崎第二', department: '商業', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 40 },
    { schoolName: '竜ヶ崎第二', department: '人間文化', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 49, finalPassers: 40 },
    { schoolName: '竜ヶ崎南', department: '普通', quota: 80, applicantsConfirmed: 47, testTakersConfirmed: 46, finalPassers: 46 },
    { schoolName: '江戸崎総合', department: '総合', quota: 160, applicantsConfirmed: 111, testTakersConfirmed: 109, finalPassers: 109 },
    { schoolName: '取手第一', department: '総合', quota: 240, applicantsConfirmed: 269, testTakersConfirmed: 269, finalPassers: 240 },
    { schoolName: '取手第二', department: '普通', quota: 120, applicantsConfirmed: 155, testTakersConfirmed: 155, finalPassers: 120 },
    { schoolName: '取手第二', department: '家政', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '取手松陽', department: '普通', quota: 160, applicantsConfirmed: 169, testTakersConfirmed: 169, finalPassers: 160 },
    { schoolName: '取手松陽', department: '美術', quota: 30, applicantsConfirmed: 34, testTakersConfirmed: 33, finalPassers: 30 },
    { schoolName: '取手松陽', department: '音楽', quota: 30, applicantsConfirmed: 14, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '藤代', department: '普通', quota: 240, applicantsConfirmed: 249, testTakersConfirmed: 246, finalPassers: 242 },
    { schoolName: '藤代紫水', department: '普通', quota: 240, applicantsConfirmed: 139, testTakersConfirmed: 139, finalPassers: 139 },
    { schoolName: '牛久', department: '普通', quota: 240, applicantsConfirmed: 250, testTakersConfirmed: 248, finalPassers: 240 },
    { schoolName: '牛久栄進', department: '普通', quota: 360, applicantsConfirmed: 388, testTakersConfirmed: 379, finalPassers: 360 },
    { schoolName: '筑波', department: '普通〔進学アドバンスト〕', quota: 40, applicantsConfirmed: 8, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '筑波', department: '普通〔地域キャリアビジネス〕', quota: 80, applicantsConfirmed: 36, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '竹園', department: '普通・国際', quota: 320, applicantsConfirmed: 400, testTakersConfirmed: 397, finalPassers: 320 },
    { schoolName: 'つくばサイエンス', department: '普通', quota: 120, applicantsConfirmed: 59, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: 'つくばサイエンス', department: '科学技術', quota: 120, applicantsConfirmed: 89, testTakersConfirmed: 86, finalPassers: 86 },
    { schoolName: '岩瀬', department: '普通', quota: 120, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '岩瀬', department: '衛生看護', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '真壁', department: '普通', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '真壁', department: '農業・環境緑地', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '真壁', department: '食品化学', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '下館第一', department: '普通', quota: 202, applicantsConfirmed: 188, testTakersConfirmed: 184, finalPassers: 184 },
    { schoolName: '下館第二', department: '普通', quota: 240, applicantsConfirmed: 258, testTakersConfirmed: 258, finalPassers: 240 },
    { schoolName: '下館工業', department: '機械', quota: 80, applicantsConfirmed: 81, testTakersConfirmed: 81, finalPassers: 80 },
    { schoolName: '下館工業', department: '電気・電子', quota: 80, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 73 },
    { schoolName: '下館工業', department: '建設工学', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '下妻第一', department: '普通', quota: 203, applicantsConfirmed: 244, testTakersConfirmed: 241, finalPassers: 203 },
    { schoolName: '下妻第二', department: '普通', quota: 280, applicantsConfirmed: 299, testTakersConfirmed: 297, finalPassers: 280 },
    { schoolName: '結城第一', department: '普通', quota: 120, applicantsConfirmed: 63, testTakersConfirmed: 62, finalPassers: 59 },
    { schoolName: '鬼怒商業', department: '商業に関する学科', quota: 160, applicantsConfirmed: 163, testTakersConfirmed: 163, finalPassers: 160 },
    { schoolName: '石下紫峰', department: '普通', quota: 160, applicantsConfirmed: 138, testTakersConfirmed: 137, finalPassers: 135 },
    // --- 3頁目「全日制」部分（水海道第一〜伊奈） ---
    { schoolName: '水海道第一', department: '普通', quota: 204, applicantsConfirmed: 275, testTakersConfirmed: 272, finalPassers: 204 },
    { schoolName: '水海道第二', department: '普通', quota: 120, applicantsConfirmed: 118, testTakersConfirmed: 117, finalPassers: 117 },
    { schoolName: '水海道第二', department: '商業', quota: 80, applicantsConfirmed: 79, testTakersConfirmed: 79, finalPassers: 79 },
    { schoolName: '水海道第二', department: '家政', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 40 },
    { schoolName: '八千代', department: '総合', quota: 200, applicantsConfirmed: 200, testTakersConfirmed: 197, finalPassers: 197 },
    { schoolName: '古河第一', department: '普通', quota: 80, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 53 },
    { schoolName: '古河第一', department: '商業に関する学科', quota: 200, applicantsConfirmed: 193, testTakersConfirmed: 192, finalPassers: 192 },
    { schoolName: '古河第二', department: '普通', quota: 200, applicantsConfirmed: 160, testTakersConfirmed: 159, finalPassers: 159 },
    { schoolName: '古河第二', department: '福祉', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '古河第三', department: '普通', quota: 240, applicantsConfirmed: 239, testTakersConfirmed: 234, finalPassers: 234 },
    { schoolName: '総和工業', department: '機械', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '総和工業', department: '電子機械', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '総和工業', department: '電気', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '三和', department: '普通', quota: 80, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 47 },
    { schoolName: '三和', department: '普通〔ヒューマンサービス〕', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 16 },
    { schoolName: '境', department: '普通', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 222, finalPassers: 222 },
    { schoolName: '坂東清風', department: '農と食', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '坂東清風', department: '総合', quota: 160, applicantsConfirmed: 80, testTakersConfirmed: 77, finalPassers: 77 },
    { schoolName: '守谷', department: '普通', quota: 240, applicantsConfirmed: 218, testTakersConfirmed: 217, finalPassers: 217 },
    { schoolName: '伊奈', department: '普通', quota: 240, applicantsConfirmed: 239, testTakersConfirmed: 238, finalPassers: 238 },
  ],
  officialSubtotals: [
    // 3頁目末尾の「全日制計」行。applicantsConfirmedはこの資料に印字が無いため、既存
    // パイプライン再利用値の機械集計を参考値として置く（既存パイプライン冒頭コメントの
    // 「applicants15,211」と一致することを確認済み）。
    { label: '全日制計', quota: 16_647, applicantsConfirmed: 15_211, testTakersConfirmed: 14_990, finalPassers: 14_020 },
  ],
};
