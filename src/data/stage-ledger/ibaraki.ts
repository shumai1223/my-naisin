import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 茨城県 段階台帳（T-Y11F §5順序#7・4県目・1頁目のみ・全日制県立63レコード）。
 *
 * 一次ソース: 茨城県教育委員会「令和8年度茨城県立高等学校第1学年合格状況（一般入学）」
 * （3月10日公表・全4頁）の1頁目（高萩清松〜玉造工業・34校63レコード）。
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
 * ⚠️新種の異常値を2種確認: ①**quota超過**が2件（水戸第一・普通=quota161→final164、
 * 水戸農業・生活科学=quota40→final41）——chiba/saitamaで確認済みの「合格ボーダー同点者の
 * 全員合格」と同型と推測。②**finalPassers>applicantsConfirmed**が3件（日立商業・情報処理=
 * applicants38→final40、水戸農業・農業経済=applicants27→final32、水戸工業・電気=
 * applicants78→final80）——chiba R7で確認済みの「特別入学者選抜等の別枠合算」と同型
 * パターンがibarakiでも再現された。
 */

export const IBARAKI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'ibaraki',
  sources: [
    {
      url: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/03/gokaku.pdf',
      docTitle: '茨城県教育委員会 令和8年度茨城県立高等学校第1学年合格状況（一般入学）1頁目（高萩清松〜玉造工業）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制県立（1頁目のみ・高萩清松〜玉造工業・34校63レコード）'],
    pendingDepartments: ['2〜4頁目の残り学校'],
    note: '1頁目（34校63レコード）のみのパイロット。quotaは既存competition-rates/ibaraki.tsと全63件で完全一致（募集定員は試験日まで不変であることを確認）。applicantsConfirmedも既存パイプラインをそのまま再利用（本資料には志願者数列が存在しないため）。testTakersConfirmed/finalPassersのみ本資料から新規転記。quota超過2件・finalPassers>applicantsConfirmed3件を確認（いずれもchiba/saitamaで確認済みの既知パターンと同型）。',
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
  ],
};
