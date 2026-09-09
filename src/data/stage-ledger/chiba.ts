import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 千葉県 段階台帳（T-Y11F §5順序#7・パイロット1県目・全9頁中1頁目のみ）。
 *
 * 一次ソース: 千葉県教育委員会「令和8年度 公立高等学校 一般入学者選抜等 入学許可候補者数
 * 一覧＜その１＞」（特別入学者選抜及び地域連携アクティブスクールの入学者選抜を含む・全9頁）
 * のうち1頁目「1．県立全日制」（学校番号1〜25・35レコード）。
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf
 *
 * ⚠️pdftotextは数値は抽出できたが学校名・学科名のラベルが欠落（他県で頻出のフォント欠落と
 * 同型）のため、pdftoppm 150〜300dpiのビジョン解析で全35レコードを転記した（PIL crop
 * による部分拡大で複数回クロス確認済み）。
 *
 * 既存の`src/data/competition-rates/chiba.ts`（倍率パイプライン）とquota・
 * applicantsConfirmed（同ファイルのfinalApplicantsに相当）が独立した情報源から取得したにも
 * かかわらず完全一致することを確認済み（例: 千葉普通科quota240/applicants331・
 * 千葉女子普通科quota240/applicants234・検見川普通科quota320/applicants514）——これは
 * 段階台帳が既存データと矛盾しない独立した裏取りになっている。
 *
 * ⚠️新規フィールドfinalPassers（入学許可候補者数）は既存のどのデータセットにも無い情報。
 * 千葉工業工業化学科のようにtestTakersConfirmed(38)<finalPassers(40)となる逆転レコードが
 * 存在するが、これは資料の印字値をそのまま転記した結果であり（欠員補充等で quota まで
 * 合格者を充足する運用と推測されるが、推測は本文コメントに留め独自の補正はしない＝Y-0）、
 * 数値自体は原資料どおり正確に転記している。
 *
 * coverage='partial'。残り8頁（学校番号26以降の県立全日制・県立定時制・市立高校等）は
 * 未収録（Y-0憲法③正直にスキップ）。
 */

export const CHIBA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'chiba',
  sources: [
    {
      url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf',
      docTitle: '千葉県教育委員会 令和8年度公立高等学校一般入学者選抜等入学許可候補者数一覧＜その1＞（1頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['県立全日制（1頁目・学校番号1〜25・35レコード）'],
    pendingDepartments: ['県立全日制の残り（2〜9頁目・学校番号26以降）', '県立定時制', '市立高校等'],
    note: '全9頁のうち1頁目のみパイロット収集。quota/applicantsConfirmedは既存competition-rates/chiba.tsと独立に完全一致確認済み。',
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
  ],
};
