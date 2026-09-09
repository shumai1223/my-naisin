import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 千葉県 段階台帳（T-Y11F §5順序#7・パイロット1県目・全9頁中1〜2頁目）。
 *
 * 一次ソース: 千葉県教育委員会「令和8年度 公立高等学校 一般入学者選抜等 入学許可候補者数
 * 一覧＜その１〉＜その２〉＜その３＞」（特別入学者選抜及び地域連携アクティブスクールの
 * 入学者選抜を含む・全9頁）のうち1頁目「1．県立全日制」（学校番号1〜25・35レコード）・
 * 2頁目（学校番号26〜53・35レコード）・3頁目（学校番号54〜77・35レコード）。
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf
 *
 * ⚠️pdftotextは数値は抽出できたが学校名・学科名のラベルが欠落（他県で頻出のフォント欠落と
 * 同型）のため、pdftoppm 200〜300dpiのビジョン解析で全105レコードを転記した（PIL crop
 * による部分拡大で複数回クロス確認済み）。3頁目は東葛飾のように募集定員(320)と募集人員(240)
 * が異なる校があり、既存`competition-rates/chiba.ts`と同じ規律で募集人員をquotaに採用した。
 *
 * 既存の`src/data/competition-rates/chiba.ts`（倍率パイプライン）とquota・
 * applicantsConfirmed（同ファイルのfinalApplicantsに相当）が独立した情報源から取得したにも
 * かかわらず完全一致することを確認済み（例: 千葉普通科quota240/applicants331・
 * 千葉女子普通科quota240/applicants234・検見川普通科quota320/applicants514・
 * 船橋普通科quota320/applicants618・薬園台普通科quota280/applicants480）——これは
 * 段階台帳が既存データと矛盾しない独立した裏取りになっている。
 *
 * ⚠️新規フィールドfinalPassers（入学許可候補者数）は既存のどのデータセットにも無い情報。
 * 千葉工業工業化学科・市川工業建築科のようにtestTakersConfirmed<finalPassersとなる逆転
 * レコードが複数存在するが、これは資料の印字値をそのまま転記した結果であり（欠員補充等で
 * quotaまで合格者を充足する運用と推測されるが、推測は本文コメントに留め独自の補正はしない
 * ＝Y-0）、数値自体は原資料どおり正確に転記している。
 *
 * coverage='partial'。残り6頁（学校番号78以降の県立全日制・県立定時制・市立高校等）は
 * 未収録（Y-0憲法③正直にスキップ）。
 */

export const CHIBA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'chiba',
  sources: [
    {
      url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf',
      docTitle: '千葉県教育委員会 令和8年度公立高等学校一般入学者選抜等入学許可候補者数一覧＜その1＞＜その2＞＜その3＞（1〜3頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['県立全日制（1〜3頁目・学校番号1〜77・105レコード）'],
    pendingDepartments: ['県立全日制の残り（4〜9頁目・学校番号78以降）', '県立定時制', '市立高校等'],
    note: '全9頁のうち1〜3頁目のみパイロット収集。quota/applicantsConfirmedは既存competition-rates/chiba.tsと独立に完全一致確認済み。',
  },
  records: [
    { schoolName: '千葉', department: '普通科', quota: 240, applicantsConfirmed: 331, testTakersConfirmed: 321, finalPassers: 240 },
    { schoolName: '千葉女子', department: '普通科', quota: 240, applicantsConfirmed: 234, testTakersConfirmed: 230, finalPassers: 229 },
    { schoolName: '千葉女子', department: '家政科', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '千葉東', department: '普通科', quota: 320, applicantsConfirmed: 448, testTakersConfirmed: 448, finalPassers: 320 },
    { schoolName: '千葉商業', department: '商業科・情報処理科', quota: 320, applicantsConfirmed: 359, testTakersConfirmed: 357, finalPassers: 320 },
    { schoolName: '京葉工業', department: '機械科', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '京葉工業', department: '電子工業科', quota: 80, applicantsConfirmed: 60, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '京葉工業', department: '設備システム科', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '京葉工業', department: '建設科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '千葉工業', department: '電子機械科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 54, finalPassers: 40 },
    { schoolName: '千葉工業', department: '電気科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '千葉工業', department: '情報技術科', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '千葉工業', department: '工業化学科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 40 },
    { schoolName: '千葉工業', department: '理数工学科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 32 },
    { schoolName: '千葉南', department: '普通科', quota: 320, applicantsConfirmed: 340, testTakersConfirmed: 338, finalPassers: 320 },
    { schoolName: '検見川', department: '普通科', quota: 320, applicantsConfirmed: 514, testTakersConfirmed: 508, finalPassers: 320 },
    { schoolName: '千葉北', department: '普通科', quota: 280, applicantsConfirmed: 278, testTakersConfirmed: 278, finalPassers: 278 },
    { schoolName: '若松', department: '普通科', quota: 320, applicantsConfirmed: 324, testTakersConfirmed: 324, finalPassers: 320 },
    { schoolName: '千城台', department: '普通科', quota: 280, applicantsConfirmed: 283, testTakersConfirmed: 282, finalPassers: 280 },
    { schoolName: '生浜', department: '普通科', quota: 80, applicantsConfirmed: 88, testTakersConfirmed: 87, finalPassers: 80 },
    { schoolName: '磯辺', department: '普通科', quota: 320, applicantsConfirmed: 447, testTakersConfirmed: 447, finalPassers: 320 },
    { schoolName: '泉', department: '普通科', quota: 120, applicantsConfirmed: 91, testTakersConfirmed: 91, finalPassers: 90 },
    { schoolName: '幕張総合', department: '総合学科', quota: 640, applicantsConfirmed: 910, testTakersConfirmed: 903, finalPassers: 640 },
    { schoolName: '幕張総合', department: '看護科', quota: 40, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 40 },
    { schoolName: '柏井', department: '普通科', quota: 200, applicantsConfirmed: 240, testTakersConfirmed: 239, finalPassers: 200 },
    { schoolName: '土気', department: '普通科', quota: 240, applicantsConfirmed: 279, testTakersConfirmed: 277, finalPassers: 240 },
    { schoolName: '千葉西', department: '普通科', quota: 320, applicantsConfirmed: 356, testTakersConfirmed: 348, finalPassers: 320 },
    { schoolName: '犢橋', department: '普通科', quota: 200, applicantsConfirmed: 193, testTakersConfirmed: 191, finalPassers: 190 },
    { schoolName: '八千代', department: '普通科', quota: 240, applicantsConfirmed: 338, testTakersConfirmed: 336, finalPassers: 240 },
    { schoolName: '八千代', department: '家政科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 34, finalPassers: 35 },
    { schoolName: '八千代', department: '体育科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '八千代東', department: '普通科', quota: 200, applicantsConfirmed: 184, testTakersConfirmed: 182, finalPassers: 175 },
    { schoolName: '八千代西', department: '普通科', quota: 80, applicantsConfirmed: 61, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '津田沼', department: '普通科', quota: 320, applicantsConfirmed: 393, testTakersConfirmed: 388, finalPassers: 320 },
    { schoolName: '実籾', department: '普通科', quota: 320, applicantsConfirmed: 364, testTakersConfirmed: 361, finalPassers: 320 },
    // --- 2頁目（学校番号26〜53） ---
    { schoolName: '船橋', department: '普通科', quota: 320, applicantsConfirmed: 618, testTakersConfirmed: 597, finalPassers: 320 },
    { schoolName: '船橋', department: '理数科', quota: 40, applicantsConfirmed: 88, testTakersConfirmed: 82, finalPassers: 40 },
    { schoolName: '薬園台', department: '普通科', quota: 280, applicantsConfirmed: 480, testTakersConfirmed: 475, finalPassers: 280 },
    { schoolName: '薬園台', department: '園芸科', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '船橋東', department: '普通科', quota: 320, applicantsConfirmed: 451, testTakersConfirmed: 448, finalPassers: 320 },
    { schoolName: '船橋啓明', department: '普通科', quota: 320, applicantsConfirmed: 333, testTakersConfirmed: 328, finalPassers: 320 },
    { schoolName: '船橋芝山', department: '普通科', quota: 320, applicantsConfirmed: 446, testTakersConfirmed: 445, finalPassers: 320 },
    { schoolName: '船橋二和', department: '普通科', quota: 280, applicantsConfirmed: 296, testTakersConfirmed: 296, finalPassers: 280 },
    { schoolName: '船橋古和釜', department: '普通科', quota: 200, applicantsConfirmed: 193, testTakersConfirmed: 191, finalPassers: 188 },
    { schoolName: '船橋法典', department: '普通科', quota: 200, applicantsConfirmed: 201, testTakersConfirmed: 201, finalPassers: 200 },
    { schoolName: '船橋豊富', department: '普通科', quota: 80, applicantsConfirmed: 81, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '船橋北', department: '普通科', quota: 160, applicantsConfirmed: 94, testTakersConfirmed: 94, finalPassers: 94 },
    { schoolName: '市川工業', department: '機械科', quota: 80, applicantsConfirmed: 79, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '市川工業', department: '電気科', quota: 80, applicantsConfirmed: 82, testTakersConfirmed: 82, finalPassers: 80 },
    { schoolName: '市川工業', department: '建築科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 33 },
    { schoolName: '市川工業', department: 'インテリア科', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '国府台', department: '普通科', quota: 320, applicantsConfirmed: 373, testTakersConfirmed: 370, finalPassers: 320 },
    { schoolName: '国分', department: '普通科', quota: 320, applicantsConfirmed: 420, testTakersConfirmed: 415, finalPassers: 320 },
    { schoolName: '行徳', department: '普通科', quota: 120, applicantsConfirmed: 103, testTakersConfirmed: 101, finalPassers: 100 },
    { schoolName: '市川東', department: '普通科', quota: 320, applicantsConfirmed: 328, testTakersConfirmed: 326, finalPassers: 320 },
    { schoolName: '市川昴', department: '普通科', quota: 320, applicantsConfirmed: 320, testTakersConfirmed: 319, finalPassers: 319 },
    { schoolName: '市川南', department: '普通科', quota: 280, applicantsConfirmed: 281, testTakersConfirmed: 281, finalPassers: 280 },
    { schoolName: '浦安', department: '普通科', quota: 200, applicantsConfirmed: 170, testTakersConfirmed: 166, finalPassers: 165 },
    { schoolName: '浦安南', department: '普通科', quota: 120, applicantsConfirmed: 62, testTakersConfirmed: 62, finalPassers: 61 },
    { schoolName: '鎌ヶ谷', department: '普通科', quota: 320, applicantsConfirmed: 435, testTakersConfirmed: 435, finalPassers: 320 },
    { schoolName: '鎌ヶ谷西', department: '普通科', quota: 160, applicantsConfirmed: 172, testTakersConfirmed: 172, finalPassers: 160 },
    { schoolName: '松戸', department: '普通科', quota: 200, applicantsConfirmed: 223, testTakersConfirmed: 221, finalPassers: 200 },
    { schoolName: '松戸', department: '芸術科', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '小金', department: '総合学科', quota: 320, applicantsConfirmed: 598, testTakersConfirmed: 595, finalPassers: 320 },
    { schoolName: '松戸国際', department: '普通科', quota: 200, applicantsConfirmed: 219, testTakersConfirmed: 218, finalPassers: 200 },
    { schoolName: '松戸国際', department: '国際教養科', quota: 120, applicantsConfirmed: 113, testTakersConfirmed: 112, finalPassers: 119 },
    { schoolName: '松戸六実', department: '普通科', quota: 320, applicantsConfirmed: 444, testTakersConfirmed: 442, finalPassers: 320 },
    { schoolName: '松戸向陽', department: '普通科', quota: 160, applicantsConfirmed: 182, testTakersConfirmed: 181, finalPassers: 160 },
    { schoolName: '松戸向陽', department: '福祉教養科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '松戸馬橋', department: '普通科', quota: 320, applicantsConfirmed: 361, testTakersConfirmed: 360, finalPassers: 320 },
    // --- 3頁目（学校番号54〜77） ---
    { schoolName: '東葛飾', department: '普通科', quota: 240, applicantsConfirmed: 437, testTakersConfirmed: 420, finalPassers: 240 },
    { schoolName: '柏', department: '普通科', quota: 280, applicantsConfirmed: 337, testTakersConfirmed: 331, finalPassers: 280 },
    { schoolName: '柏', department: '理数科', quota: 40, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 40 },
    { schoolName: '柏南', department: '普通科', quota: 360, applicantsConfirmed: 531, testTakersConfirmed: 529, finalPassers: 360 },
    { schoolName: '柏陵', department: '普通科', quota: 320, applicantsConfirmed: 362, testTakersConfirmed: 362, finalPassers: 320 },
    { schoolName: '柏の葉', department: '普通科', quota: 280, applicantsConfirmed: 370, testTakersConfirmed: 369, finalPassers: 280 },
    { schoolName: '柏の葉', department: '情報理数科', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '柏中央', department: '普通科', quota: 320, applicantsConfirmed: 351, testTakersConfirmed: 348, finalPassers: 320 },
    { schoolName: '沼南', department: '普通科', quota: 80, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '沼南高柳', department: '普通科', quota: 160, applicantsConfirmed: 141, testTakersConfirmed: 141, finalPassers: 141 },
    { schoolName: '流山', department: '園芸科', quota: 120, applicantsConfirmed: 139, testTakersConfirmed: 138, finalPassers: 120 },
    { schoolName: '流山', department: '商業科・情報処理科', quota: 80, applicantsConfirmed: 81, testTakersConfirmed: 81, finalPassers: 80 },
    { schoolName: '流山おおたかの森', department: '普通科', quota: 320, applicantsConfirmed: 381, testTakersConfirmed: 376, finalPassers: 320 },
    { schoolName: '流山おおたかの森', department: '国際コミュニケーション科', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '流山南', department: '普通科', quota: 280, applicantsConfirmed: 282, testTakersConfirmed: 278, finalPassers: 277 },
    { schoolName: '流山北', department: '普通科', quota: 200, applicantsConfirmed: 127, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '野田中央', department: '普通科', quota: 280, applicantsConfirmed: 232, testTakersConfirmed: 231, finalPassers: 231 },
    { schoolName: '清水', department: '食品科学科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '清水', department: '機械科・電気科・環境化学科', quota: 120, applicantsConfirmed: 115, testTakersConfirmed: 114, finalPassers: 114 },
    { schoolName: '関宿', department: '普通科', quota: 80, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '我孫子', department: '普通科', quota: 320, applicantsConfirmed: 357, testTakersConfirmed: 356, finalPassers: 320 },
    { schoolName: '我孫子東', department: '普通科', quota: 200, applicantsConfirmed: 132, testTakersConfirmed: 131, finalPassers: 131 },
    { schoolName: '白井', department: '普通科', quota: 240, applicantsConfirmed: 281, testTakersConfirmed: 278, finalPassers: 240 },
    { schoolName: '印旛明誠', department: '普通科', quota: 200, applicantsConfirmed: 239, testTakersConfirmed: 239, finalPassers: 200 },
    { schoolName: '成田西陵', department: '園芸科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '成田西陵', department: '土木造園科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '成田西陵', department: '食品科学科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '成田西陵', department: '情報処理科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '成田国際', department: '普通科', quota: 200, applicantsConfirmed: 264, testTakersConfirmed: 261, finalPassers: 200 },
    { schoolName: '成田国際', department: '国際科', quota: 120, applicantsConfirmed: 142, testTakersConfirmed: 140, finalPassers: 120 },
    { schoolName: '成田北', department: '普通科', quota: 280, applicantsConfirmed: 310, testTakersConfirmed: 309, finalPassers: 280 },
    { schoolName: '下総', department: '園芸科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '下総', department: '自動車科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '下総', department: '情報処理科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '富里', department: '普通科', quota: 160, applicantsConfirmed: 173, testTakersConfirmed: 173, finalPassers: 160 },
  ],
};
