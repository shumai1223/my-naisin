import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 千葉県 段階台帳（T-Y11F §5順序#7・パイロット1県目・「全日制課程」区分は完全収録）。
 *
 * 一次ソース: 千葉県教育委員会「令和8年度 公立高等学校 一般入学者選抜等 入学許可候補者数
 * 一覧＜その１〉〜＜その７＞」（特別入学者選抜及び地域連携アクティブスクールの入学者選抜を
 * 含む・全9頁）のうち1〜6頁目「1．県立全日制」（学校番号1〜121・176レコード）＋7頁目
 * 「2．市立全日制」（学校番号市1〜市7・12レコード）。
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf
 *
 * ⚠️pdftotextは数値は抽出できたが学校名・学科名のラベルが欠落（他県で頻出のフォント欠落と
 * 同型）のため、pdftoppm 200〜300dpiのビジョン解析で全176レコードを転記した（PIL crop
 * による部分拡大で複数回クロス確認済み）。3頁目は東葛飾のように募集定員(320)と募集人員(240)
 * が異なる校があり、既存`competition-rates/chiba.ts`と同じ規律で募集人員をquotaに採用した。
 * 東金国際教養科（4頁目）・茂原樟陽環境化学科・木更津東普通科（5頁目）のように、志願者数・
 * 受検者数を上回る合格者数レコードが複数校で確認されている（欠員補充等の推測は本文コメントに
 * 留め、独自の補正はしない＝Y-0）。
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
 * 6頁目末尾の「県立全日制 合計」（quota26,960/applicants29,594/testTakers29,359/
 * finalPassers25,085）、7頁目末尾の「市立全日制 合計」（quota1,920/applicants2,414/
 * testTakers2,402/finalPassers1,920）、同頁の「公立全日制 合計」（quota28,880/
 * applicants32,008/testTakers31,761/finalPassers27,005）の3段階すべてで、188レコード
 * 全数の機械集計が完全一致した（初回転記で一致・再修正なし）——**「全日制課程」区分全体に
 * ついてcoverage='complete'に格上げ**。残る8〜9頁目（県立定時制等の別区分）は次のセクション
 * のため未収録（Y-0憲法③正直にスキップ）。
 */

export const CHIBA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'chiba',
  sources: [
    {
      url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf',
      docTitle: '千葉県教育委員会 令和8年度公立高等学校一般入学者選抜等入学許可候補者数一覧＜その1＞〜＜その7＞（1〜7頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['県立全日制（1〜6頁目・学校番号1〜121・176レコード）', '市立全日制（7頁目・学校番号市1〜市7・12レコード）'],
    pendingDepartments: ['県立定時制（8〜9頁目相当）'],
    note: '「全日制課程」区分（県立＋市立）は完全収録。「県立全日制 合計」「市立全日制 合計」「公立全日制 合計」の3段階すべてで機械集計が完全一致。県立定時制は別区分のため未収録。',
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
    // --- 4頁目（学校番号78〜98・81は欠番） ---
    { schoolName: '佐倉', department: '普通科', quota: 280, applicantsConfirmed: 424, testTakersConfirmed: 419, finalPassers: 280 },
    { schoolName: '佐倉', department: '理数科', quota: 40, applicantsConfirmed: 65, testTakersConfirmed: 65, finalPassers: 40 },
    { schoolName: '佐倉東', department: '普通科', quota: 120, applicantsConfirmed: 135, testTakersConfirmed: 135, finalPassers: 120 },
    { schoolName: '佐倉東', department: '調理国際科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '佐倉東', department: '服飾デザイン科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '佐倉西', department: '普通科', quota: 160, applicantsConfirmed: 150, testTakersConfirmed: 149, finalPassers: 149 },
    { schoolName: '八街', department: '総合学科', quota: 120, applicantsConfirmed: 116, testTakersConfirmed: 116, finalPassers: 116 },
    { schoolName: '四街道', department: '普通科', quota: 320, applicantsConfirmed: 379, testTakersConfirmed: 377, finalPassers: 320 },
    { schoolName: '四街道北', department: '普通科', quota: 240, applicantsConfirmed: 269, testTakersConfirmed: 269, finalPassers: 240 },
    { schoolName: '佐原', department: '普通科', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 222, finalPassers: 222 },
    { schoolName: '佐原', department: '理数科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '佐原白楊', department: '普通科', quota: 200, applicantsConfirmed: 204, testTakersConfirmed: 204, finalPassers: 200 },
    { schoolName: '小見川', department: '普通科', quota: 160, applicantsConfirmed: 147, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '多古', department: '普通科', quota: 80, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '多古', department: '園芸科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '銚子', department: '普通科', quota: 120, applicantsConfirmed: 132, testTakersConfirmed: 132, finalPassers: 120 },
    { schoolName: '銚子商業', department: '商業科・情報処理科', quota: 160, applicantsConfirmed: 151, testTakersConfirmed: 151, finalPassers: 151 },
    { schoolName: '銚子商業', department: '海洋科', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '旭農業', department: '畜産科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '旭農業', department: '園芸科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '旭農業', department: '食品科学科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '東総工業', department: '電子機械科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '東総工業', department: '電気科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '東総工業', department: '情報技術科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '東総工業', department: '建設科', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '匝瑳', department: '総合学科', quota: 240, applicantsConfirmed: 207, testTakersConfirmed: 207, finalPassers: 207 },
    { schoolName: '松尾', department: '普通科', quota: 120, applicantsConfirmed: 106, testTakersConfirmed: 106, finalPassers: 106 },
    { schoolName: '成東', department: '普通科・理数科', quota: 240, applicantsConfirmed: 238, testTakersConfirmed: 236, finalPassers: 236 },
    { schoolName: '東金', department: '普通科', quota: 160, applicantsConfirmed: 182, testTakersConfirmed: 181, finalPassers: 160 },
    { schoolName: '東金', department: '国際教養科', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 40 },
    { schoolName: '東金商業', department: '商業科・情報処理科', quota: 120, applicantsConfirmed: 99, testTakersConfirmed: 99, finalPassers: 98 },
    { schoolName: '大網', department: '普通科', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '大網', department: '農業科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '大網', department: '食品科学科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 37 },
    { schoolName: '大網', department: '生物工学科', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    // --- 5頁目（学校番号99〜120） ---
    { schoolName: '九十九里', department: '普通科', quota: 80, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '長生', department: '普通科・理数科', quota: 280, applicantsConfirmed: 357, testTakersConfirmed: 356, finalPassers: 280 },
    { schoolName: '茂原', department: '普通科', quota: 160, applicantsConfirmed: 161, testTakersConfirmed: 160, finalPassers: 160 },
    { schoolName: '茂原樟陽', department: '農業科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '茂原樟陽', department: '食品科学科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '茂原樟陽', department: '土木造園科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '茂原樟陽', department: '電子機械科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '茂原樟陽', department: '電気科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '茂原樟陽', department: '環境化学科', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 7 },
    { schoolName: '一宮商業', department: '商業科・情報処理科', quota: 120, applicantsConfirmed: 107, testTakersConfirmed: 107, finalPassers: 107 },
    { schoolName: '大多喜', department: '普通科', quota: 160, applicantsConfirmed: 147, testTakersConfirmed: 147, finalPassers: 147 },
    { schoolName: '大原', department: '総合学科', quota: 160, applicantsConfirmed: 94, testTakersConfirmed: 94, finalPassers: 93 },
    { schoolName: '長狭', department: '普通科', quota: 160, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '安房拓心', department: '総合学科', quota: 120, applicantsConfirmed: 96, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '安房', department: '普通科', quota: 240, applicantsConfirmed: 216, testTakersConfirmed: 214, finalPassers: 214 },
    { schoolName: '館山総合', department: '工業科', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '館山総合', department: '商業科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '館山総合', department: '海洋科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '館山総合', department: '家政科', quota: 40, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 6 },
    { schoolName: '天羽', department: '普通科', quota: 120, applicantsConfirmed: 56, testTakersConfirmed: 55, finalPassers: 54 },
    { schoolName: '君津商業', department: '商業科・情報処理科', quota: 160, applicantsConfirmed: 138, testTakersConfirmed: 138, finalPassers: 138 },
    { schoolName: '木更津', department: '普通科', quota: 280, applicantsConfirmed: 385, testTakersConfirmed: 375, finalPassers: 280 },
    { schoolName: '木更津', department: '理数科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '木更津東', department: '普通科', quota: 120, applicantsConfirmed: 111, testTakersConfirmed: 111, finalPassers: 113 },
    { schoolName: '木更津東', department: '家政科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '君津', department: '普通科', quota: 240, applicantsConfirmed: 250, testTakersConfirmed: 246, finalPassers: 240 },
    { schoolName: '君津', department: '園芸科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '君津青葉', department: '総合学科', quota: 120, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 72 },
    { schoolName: '袖ヶ浦', department: '普通科', quota: 240, applicantsConfirmed: 293, testTakersConfirmed: 292, finalPassers: 240 },
    { schoolName: '袖ヶ浦', department: '情報コミュニケーション科', quota: 40, applicantsConfirmed: 56, testTakersConfirmed: 56, finalPassers: 40 },
    { schoolName: '市原', department: '普通科', quota: 80, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '市原', department: '園芸科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '京葉', department: '普通科', quota: 120, applicantsConfirmed: 121, testTakersConfirmed: 121, finalPassers: 120 },
    { schoolName: '市原緑', department: '普通科', quota: 120, applicantsConfirmed: 97, testTakersConfirmed: 97, finalPassers: 97 },
    { schoolName: '姉崎', department: '普通科', quota: 120, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 115 },
    // --- 6頁目（学校番号121・「1．県立全日制」区分の最終校） ---
    { schoolName: '市原八幡', department: '普通科', quota: 200, applicantsConfirmed: 199, testTakersConfirmed: 199, finalPassers: 195 },
    // --- 7頁目「2．市立全日制」（学校番号市1〜市7） ---
    { schoolName: '市立千葉', department: '普通科', quota: 280, applicantsConfirmed: 433, testTakersConfirmed: 430, finalPassers: 280 },
    { schoolName: '市立千葉', department: '理数科', quota: 40, applicantsConfirmed: 70, testTakersConfirmed: 69, finalPassers: 40 },
    { schoolName: '市立習志野', department: '普通科', quota: 240, applicantsConfirmed: 241, testTakersConfirmed: 238, finalPassers: 240 },
    { schoolName: '市立習志野', department: '商業科', quota: 80, applicantsConfirmed: 93, testTakersConfirmed: 93, finalPassers: 80 },
    { schoolName: '市立船橋', department: '普通科', quota: 240, applicantsConfirmed: 294, testTakersConfirmed: 291, finalPassers: 240 },
    { schoolName: '市立船橋', department: '商業科', quota: 80, applicantsConfirmed: 122, testTakersConfirmed: 122, finalPassers: 80 },
    { schoolName: '市立船橋', department: '体育科', quota: 80, applicantsConfirmed: 82, testTakersConfirmed: 82, finalPassers: 80 },
    { schoolName: '市立松戸', department: '普通科', quota: 280, applicantsConfirmed: 390, testTakersConfirmed: 389, finalPassers: 280 },
    { schoolName: '市立松戸', department: '国際人文科', quota: 40, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 40 },
    { schoolName: '市立柏', department: '普通科', quota: 280, applicantsConfirmed: 343, testTakersConfirmed: 342, finalPassers: 280 },
    { schoolName: '市立柏', department: 'スポーツ科学科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '市立銚子', department: '普通科・理数科', quota: 240, applicantsConfirmed: 247, testTakersConfirmed: 247, finalPassers: 240 },
  ],
  officialSubtotals: [
    { label: '県立全日制 合計', quota: 26_960, applicantsConfirmed: 29_594, testTakersConfirmed: 29_359, finalPassers: 25_085 },
    { label: '市立全日制 合計', quota: 1_920, applicantsConfirmed: 2_414, testTakersConfirmed: 2_402, finalPassers: 1_920 },
    { label: '公立全日制 合計', quota: 28_880, applicantsConfirmed: 32_008, testTakersConfirmed: 31_761, finalPassers: 27_005 },
  ],
};
