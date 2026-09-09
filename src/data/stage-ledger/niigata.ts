import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 新潟県 段階台帳（T-Y11F §5順序#7・10県目・全日制93レコードで完結）。
 *
 * 一次ソース: 新潟県教育委員会「令和8年度新潟県公立高等学校入学状況」（令和8年5月19日公表）。
 * https://www.pref.niigata.lg.jp/sec/kotogakko/r8senbatsukekka.html
 * https://www.pref.niigata.lg.jp/uploaded/attachment/495928.pdf
 *
 * ⚠️このPDFはpdftotextで0文字しか抽出できない画像/埋め込みフォント種のPDFのため、
 * pdftoppm 300〜600dpi + ビジョン読み取りで転記した（全2ページ・1ページ目=全日制、
 * 2ページ目後半=定時制〈スコープ外〉）。
 *
 * ⚠️他県と異なり本県は**1つの資料に「特色化選抜」「一般選抜」「欠員補充のための2次募集」
 * 「海外帰国生徒等特別選抜」の4トラックの募集人員(A)・志願者数・受検者数・合格者数が併記**
 * されており、学科ごとの単一の「募集定員」列は4トラック合算後の総枠である。既存パイプライン
 * `competition-rates/niigata.ts`は「一般選抜募集人数(A)」列を持つ**別の**資料（令和8年3月時点の
 * 「志願変更後の志願状況一覧」・全6ページ）を典拠としており、本資料の「一般選抜志願者数」列とは
 * 一致しない学校がある（例: 新潟南・普通は本資料415人 vs 既存パイプライン404人）。両者は法的な
 * 対象時点が異なる別の集計（前者は入学状況の最終報告・後者は志願変更締切時点のスナップショット）
 * であり、どちらかが誤りというわけではないため、既存パイプラインの値を流用せず、
 * **quota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてを本資料
 * 単独から独立に転記した**（他県のstage-ledgerが採用する「既存パイプライン再利用」設計からの
 * 意図的な逸脱）。
 *
 * quotaの算出式: 一般選抜の実質募集枠 = 学科の総募集人数（A列）− 特色化選抜合格者数
 * （特色化選抜は一般選抜より先に実施され、その合格者数分だけ総枠から差し引かれた残りが一般選抜の
 * 実質募集枠になる）。この式は全93レコードの機械集計が資料本文末尾の「県立及び市立合計」行の
 * 一般選抜列（募集人員11,709・志願者数11,679・受検者数11,593・合格者数10,590）と完全一致する
 * ことで検証済み。さらに「市立計」小計（市立万代2レコード・quota240/applicants351/
 * testTakers348/finalPassers246）とも独立に一致した（3段階の独立突合）。個別レコードのquotaも
 * 既存パイプラインの複数校（新潟・新潟中央・新潟西・巻・十日町・十日町総合・新潟工業・塩沢商工等）
 * と一致することを確認済み（quota自体は募集定員という行政的に安定した値のため、時点が異なる
 * 資料間でも一致するのが自然）。
 *
 * 全93レコードでquota<=0・applicantsConfirmed<=0・testTakersConfirmed<=0・finalPassers<=0の
 * 例外は0件、testTakersConfirmedがapplicantsConfirmedを上回る例外も0件、finalPassersが
 * testTakersConfirmedを上回る例外も0件という、大阪府・静岡県に続き3県目のクリーンな県だった
 * （合格者数が一般選抜1トラックのみに厳密に限定されているため、他県で頻出する「特別選抜等の
 * 合算による超過」パターンが構造的に発生しない）。
 *
 * 定時制課程（PDF2ページ目後半）は他県と同じ理由で恒久的にスコープ外。
 */
export const NIIGATA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'niigata',
  sources: [
    {
      url: 'https://www.pref.niigata.lg.jp/uploaded/attachment/495928.pdf',
      docTitle: '新潟県教育委員会 令和8年度新潟県公立高等学校入学状況（1 学校別・学科別入学状況〈全日制の課程〉・一般選抜列）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（県立及び市立・73校93学科を完全収録）'],
    pendingDepartments: ['定時制の課程（PDF2ページ目後半・他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制73校93学科（県立71校91学科＋市立万代2学科）を完全収録。本資料は特色化選抜/一般選抜/欠員補充2次募集/海外帰国生徒等特別選抜の4トラックを併記する構造のため、既存パイプライン`competition-rates/niigata.ts`（別資料の一般選抜募集人数列を典拠）とは対象時点が異なりapplicantsConfirmedが完全一致しない学校がある（新潟南等）。そのためquota・applicantsConfirmed・testTakersConfirmed・finalPassersの4フィールドすべてを本資料単独（一般選抜列）から独立に転記した。quota=学科の総募集人数−特色化選抜合格者数という算出式を採用し、93件全数の機械集計（quota11,709/applicantsConfirmed11,679/testTakersConfirmed11,593/finalPassers10,590）が資料本文末尾の「県立及び市立合計」行の一般選抜列と完全一致、「市立計」小計（市立万代2件）とも独立に一致した（3段階の独立突合）。quota<=0等の0値例外・testTakersConfirmed>applicantsConfirmedの例外・finalPassers>testTakersConfirmedの例外はいずれも0件で、大阪府・静岡県に続き3県目のクリーンな県だった。',
  },
  officialSubtotals: [
    { label: '県立及び市立合計（一般選抜）', quota: 11709, applicantsConfirmed: 11679, testTakersConfirmed: 11593, finalPassers: 10590 },
    { label: '市立計（一般選抜・市立万代2件）', quota: 240, applicantsConfirmed: 351, testTakersConfirmed: 348, finalPassers: 246 },
  ],
  records: [
    { schoolName: '新潟', department: '普通', quota: 240, applicantsConfirmed: 353, testTakersConfirmed: 353, finalPassers: 241 },
    { schoolName: '新潟', department: '理数', quota: 80, applicantsConfirmed: 106, testTakersConfirmed: 106, finalPassers: 80 },
    { schoolName: '新潟中央', department: '普通', quota: 155, applicantsConfirmed: 146, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '新潟中央', department: '学究コース', quota: 80, applicantsConfirmed: 65, testTakersConfirmed: 65, finalPassers: 65 },
    { schoolName: '新潟中央', department: '食物', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '新潟中央', department: '音楽', quota: 21, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '新潟南', department: '普通', quota: 320, applicantsConfirmed: 415, testTakersConfirmed: 415, finalPassers: 325 },
    { schoolName: '新潟南', department: '理数コース', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '新潟江南', department: '普通', quota: 280, applicantsConfirmed: 379, testTakersConfirmed: 378, finalPassers: 283 },
    { schoolName: '新潟西', department: '普通', quota: 272, applicantsConfirmed: 258, testTakersConfirmed: 255, finalPassers: 255 },
    { schoolName: '新潟東', department: '普通', quota: 280, applicantsConfirmed: 214, testTakersConfirmed: 214, finalPassers: 214 },
    { schoolName: '碧', department: '普通', quota: 160, applicantsConfirmed: 153, testTakersConfirmed: 152, finalPassers: 150 },
    { schoolName: '新潟工業', department: 'ミライ創造工学', quota: 265, applicantsConfirmed: 247, testTakersConfirmed: 244, finalPassers: 244 },
    { schoolName: '新潟商業', department: '総合ビジネス', quota: 137, applicantsConfirmed: 178, testTakersConfirmed: 176, finalPassers: 141 },
    { schoolName: '新潟商業', department: '情報処理', quota: 79, applicantsConfirmed: 110, testTakersConfirmed: 109, finalPassers: 81 },
    { schoolName: '新潟商業', department: '国際教養', quota: 80, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 82 },
    { schoolName: '新潟向陽', department: '普通', quota: 200, applicantsConfirmed: 229, testTakersConfirmed: 223, finalPassers: 204 },
    { schoolName: '巻', department: '普通', quota: 235, applicantsConfirmed: 245, testTakersConfirmed: 243, finalPassers: 236 },
    { schoolName: '巻総合', department: '総合', quota: 160, applicantsConfirmed: 199, testTakersConfirmed: 196, finalPassers: 161 },
    { schoolName: '新津', department: '普通', quota: 240, applicantsConfirmed: 233, testTakersConfirmed: 232, finalPassers: 232 },
    { schoolName: '新津工業', department: '工業マイスター', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '新津工業', department: '生産工学', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '新津工業', department: 'ロボット工学', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '新津工業', department: '日本建築', quota: 30, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '新津南', department: '普通', quota: 120, applicantsConfirmed: 61, testTakersConfirmed: 61, finalPassers: 61 },
    { schoolName: '白根', department: '普通', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '五泉', department: '総合', quota: 200, applicantsConfirmed: 200, testTakersConfirmed: 199, finalPassers: 199 },
    { schoolName: '村松', department: '普通', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '阿賀黎明', department: '普通', quota: 36, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '新発田', department: '普通', quota: 240, applicantsConfirmed: 263, testTakersConfirmed: 261, finalPassers: 246 },
    { schoolName: '新発田', department: '理数', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 41 },
    { schoolName: '新発田南', department: '普通', quota: 160, applicantsConfirmed: 180, testTakersConfirmed: 180, finalPassers: 162 },
    { schoolName: '新発田南', department: '工業', quota: 160, applicantsConfirmed: 154, testTakersConfirmed: 153, finalPassers: 152 },
    { schoolName: '新発田農業', department: '農業', quota: 160, applicantsConfirmed: 164, testTakersConfirmed: 163, finalPassers: 160 },
    { schoolName: '新発田商業', department: '商業', quota: 115, applicantsConfirmed: 101, testTakersConfirmed: 98, finalPassers: 98 },
    { schoolName: '村上', department: '普通', quota: 160, applicantsConfirmed: 104, testTakersConfirmed: 102, finalPassers: 102 },
    { schoolName: '村上桜ケ丘', department: '総合', quota: 118, applicantsConfirmed: 112, testTakersConfirmed: 111, finalPassers: 109 },
    { schoolName: '中条', department: '普通', quota: 76, applicantsConfirmed: 31, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '阿賀野', department: '普通', quota: 35, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '長岡', department: '普通', quota: 240, applicantsConfirmed: 254, testTakersConfirmed: 253, finalPassers: 240 },
    { schoolName: '長岡', department: '理数', quota: 80, applicantsConfirmed: 83, testTakersConfirmed: 83, finalPassers: 80 },
    { schoolName: '長岡大手', department: '普通', quota: 233, applicantsConfirmed: 299, testTakersConfirmed: 299, finalPassers: 236 },
    { schoolName: '長岡大手', department: '家政', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 50, finalPassers: 41 },
    { schoolName: '長岡向陵', department: '普通', quota: 200, applicantsConfirmed: 278, testTakersConfirmed: 277, finalPassers: 200 },
    { schoolName: '長岡農業', department: '農業', quota: 160, applicantsConfirmed: 164, testTakersConfirmed: 161, finalPassers: 160 },
    { schoolName: '長岡工業', department: '工業', quota: 200, applicantsConfirmed: 190, testTakersConfirmed: 189, finalPassers: 189 },
    { schoolName: '長岡商業', department: '総合ビジネス', quota: 147, applicantsConfirmed: 151, testTakersConfirmed: 150, finalPassers: 147 },
    { schoolName: '正徳館', department: '普通', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '栃尾', department: '総合', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '見附', department: '普通', quota: 80, applicantsConfirmed: 73, testTakersConfirmed: 71, finalPassers: 71 },
    { schoolName: '三条', department: '普通', quota: 200, applicantsConfirmed: 229, testTakersConfirmed: 229, finalPassers: 203 },
    { schoolName: '三条', department: '理数', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40 },
    { schoolName: '三条東', department: '普通', quota: 200, applicantsConfirmed: 215, testTakersConfirmed: 214, finalPassers: 204 },
    { schoolName: '新潟県央工業', department: '工業', quota: 158, applicantsConfirmed: 91, testTakersConfirmed: 88, finalPassers: 88 },
    { schoolName: '三条商業', department: '総合ビジネス', quota: 120, applicantsConfirmed: 100, testTakersConfirmed: 99, finalPassers: 99 },
    { schoolName: '吉田', department: '普通', quota: 80, applicantsConfirmed: 63, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '分水', department: '普通', quota: 80, applicantsConfirmed: 59, testTakersConfirmed: 59, finalPassers: 59 },
    { schoolName: '加茂', department: '普通', quota: 160, applicantsConfirmed: 192, testTakersConfirmed: 192, finalPassers: 161 },
    { schoolName: '加茂農林', department: '農業', quota: 160, applicantsConfirmed: 127, testTakersConfirmed: 126, finalPassers: 126 },
    { schoolName: '小千谷', department: '普通', quota: 160, applicantsConfirmed: 159, testTakersConfirmed: 157, finalPassers: 157 },
    { schoolName: '小千谷西', department: '総合', quota: 120, applicantsConfirmed: 98, testTakersConfirmed: 98, finalPassers: 98 },
    { schoolName: '小出', department: '普通', quota: 113, applicantsConfirmed: 116, testTakersConfirmed: 114, finalPassers: 113 },
    { schoolName: '国際情報', department: '専門系', quota: 80, applicantsConfirmed: 14, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '六日町', department: '普通', quota: 200, applicantsConfirmed: 198, testTakersConfirmed: 198, finalPassers: 198 },
    { schoolName: '八海', department: '普通', quota: 72, applicantsConfirmed: 77, testTakersConfirmed: 77, finalPassers: 74 },
    { schoolName: '塩沢商工', department: '地域創造工学', quota: 80, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '塩沢商工', department: '商業', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '十日町', department: '普通', quota: 153, applicantsConfirmed: 161, testTakersConfirmed: 161, finalPassers: 153 },
    { schoolName: '十日町', department: 'クロス探究', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '十日町総合', department: '総合', quota: 119, applicantsConfirmed: 113, testTakersConfirmed: 111, finalPassers: 111 },
    { schoolName: '松代', department: '普通', quota: 77, applicantsConfirmed: 43, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '柏崎', department: '普通', quota: 195, applicantsConfirmed: 141, testTakersConfirmed: 140, finalPassers: 140 },
    { schoolName: '柏崎常盤', department: '普通', quota: 120, applicantsConfirmed: 99, testTakersConfirmed: 99, finalPassers: 99 },
    { schoolName: '柏崎総合', department: '総合', quota: 120, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 112 },
    { schoolName: '柏崎工業', department: '工業', quota: 120, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 55 },
    { schoolName: '高田', department: '普通', quota: 200, applicantsConfirmed: 209, testTakersConfirmed: 209, finalPassers: 201 },
    { schoolName: '高田', department: '理数', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '高田北城', department: '普通', quota: 160, applicantsConfirmed: 192, testTakersConfirmed: 191, finalPassers: 160 },
    { schoolName: '高田北城', department: '生活文化', quota: 40, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 40 },
    { schoolName: '高田農業', department: '農業', quota: 160, applicantsConfirmed: 186, testTakersConfirmed: 182, finalPassers: 161 },
    { schoolName: '上越総合技術', department: '工業', quota: 195, applicantsConfirmed: 215, testTakersConfirmed: 212, finalPassers: 195 },
    { schoolName: '高田商業', department: '総合ビジネス', quota: 120, applicantsConfirmed: 121, testTakersConfirmed: 120, finalPassers: 120 },
    { schoolName: '有恒', department: '普通', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '新井', department: '総合', quota: 158, applicantsConfirmed: 181, testTakersConfirmed: 181, finalPassers: 158 },
    { schoolName: '糸魚川', department: '普通', quota: 120, applicantsConfirmed: 111, testTakersConfirmed: 111, finalPassers: 111 },
    { schoolName: '糸魚川白嶺', department: '総合', quota: 120, applicantsConfirmed: 102, testTakersConfirmed: 101, finalPassers: 101 },
    { schoolName: '海洋', department: '水産', quota: 75, applicantsConfirmed: 74, testTakersConfirmed: 74, finalPassers: 74 },
    { schoolName: '佐渡', department: '普通', quota: 160, applicantsConfirmed: 179, testTakersConfirmed: 179, finalPassers: 160 },
    { schoolName: '佐渡(両津)', department: '普通', quota: 40, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '羽茂', department: '普通', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '佐渡総合', department: '総合', quota: 120, applicantsConfirmed: 89, testTakersConfirmed: 88, finalPassers: 88 },
    { schoolName: '市立万代', department: '普通', quota: 200, applicantsConfirmed: 306, testTakersConfirmed: 303, finalPassers: 205 },
    { schoolName: '市立万代', department: '英語理数', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 41 },
  ],
};
