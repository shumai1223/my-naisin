import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 静岡県 段階台帳（T-Y11F §5順序#7・9県目・全日制162レコードで完結）。
 *
 * 一次ソース: 静岡県教育委員会「令和8年度静岡県公立高等学校入学者選抜合格者数一覧」
 * （令和8年3月27日公表・合格者数変更により差し替え済みの最終版）。
 * https://www.pref.shizuoka.jp/kodomokyoiku/school/kyoiku/1003764/1003891/1072279.html
 * https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8_gokakuhappyou3.pdf
 *
 * ⚠️このPDFはCJK埋め込みフォントのToUnicode CMapが欠落しておりpdftotextで文字が一切抽出
 * できない種類（0文字）だったため、pdftoppm 300dpi + ビジョン読み取りで全12ページを転記した。
 * 表構造は既存の倍率パイプライン`competition-rates/shizuoka.ts`が使う「志願者数一覧」
 * （締切時点・志願変更後）と同一の県教委フォーマットで、学科ごとに募集定員(A)・受検者数・
 * 合格者数・実質倍率（＝受検者数/合格者数）・再募集定員を記載する（インデントの無い最上位行が
 * 学科の総計・Ⅰ/Ⅱ/Ⅲ等の内訳行と連携/海外/長期/県外等の特殊枠は対象外＝既存パイプラインと
 * 同一の除外ルールを継承）。
 *
 * quota・applicantsConfirmedは既存パイプラインをそのまま再利用し（本資料自体には志願者数列が
 * 無いため）、testTakersConfirmed（受検者数）・finalPassers（合格者数）のみ本資料から新規
 * 転記した。突合は(schoolName, quota)の組をキーに機械的に行い、同一学校内で複数学科が同じ
 * quotaを持ち一意に決まらない場合（例: 焼津水産の3学科・磐田農業の5学科が全てquota40等）は、
 * 両資料内での学科の掲載順が完全一致することを個別に確認した上で位置対応で解決した
 * （既存パイプラインのapplicantsConfirmedと本資料のtestTakersConfirmedが近い値になるため
 * 誤対応は容易に検出できる設計）。
 *
 * **全162レコードが既存パイプラインの全162件のR8レコードと(schoolName, quota)で完全に対応**
 * （欠落0件・余剰0件）。抽出162件の機械集計（quota16,954・testTakersConfirmed16,826・
 * finalPassers16,078）がPDF9ページ目末尾の「公立合計」行（16954/16826/16078/1.05/1174）と
 * 完全一致し、applicantsConfirmed側の機械集計（16,895）も既存パイプラインのコメントが引用する
 * 同一資料グループの独立な合計値（quota16,954・applicants16,895）と完全一致した（quota・
 * applicantsConfirmedの二重独立確認）。
 *
 * finalPassersがtestTakersConfirmed・applicantsConfirmedを上回るケースが31件あり、他県の
 * 「特別選抜（推薦等）の合算による超過」パターンと同型と推測される。
 *
 * ⚠️スコープ: PDF10ページ目は特別選抜（海外帰国生徒選抜・外国人生徒選抜・長期欠席生徒選抜・
 * 連携型選抜・県外生徒特色選抜）の内訳詳細表で、既に本体の学科総計行に含まれる内数のため
 * 対象外。PDF11〜12ページ目は定時制で、既存パイプラインと同じ理由（東京都・神奈川県・千葉県・
 * 埼玉県・福岡県・兵庫県と同型）で恒久的にスコープ外。
 */
export const SHIZUOKA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'shizuoka',
  sources: [
    {
      url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8_gokakuhappyou3.pdf',
      docTitle: '静岡県教育委員会 令和8年度静岡県公立高等学校入学者選抜合格者数一覧（全日制・PDF1〜9ページ目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（PDF1〜9ページ目・下田〜浜松市立の90校・162学科を完全収録）'],
    pendingDepartments: [
      '特別選抜内訳（PDF10ページ目・既に本体の学科総計行に含まれる内数のため対象外）',
      '定時制（PDF11〜12ページ目・他県と同じ理由で恒久的にスコープ外）',
    ],
    note: '全日制90校162学科を完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/shizuoka.ts`のR8レコード（別の「志願者数一覧」xlsx/PDFから独立に転記済み）をそのまま再利用し、162件全数が(schoolName, quota)で一意に対応（欠落0件・余剰0件）。testTakersConfirmed・finalPassersのみ本資料（合格者数一覧PDF・CJKフォント埋め込みのためビジョン読み取りで全12ページ中9ページを転記）から新規転記した。抽出162件の機械集計（quota16,954/testTakersConfirmed16,826/finalPassers16,078）がPDF9ページ目末尾の「公立合計」行と完全一致し、applicantsConfirmed集計（16,895）も既存パイプラインのコメントが引用する独立な合計値と一致した（quota・志願者数の二重独立確認）。finalPassersがtestTakersConfirmed・applicantsConfirmedを上回るケースが31件あり、他県で頻出する「特別選抜（推薦等）の合算による超過」パターンと同型と推測される。testTakersConfirmedがapplicantsConfirmedを超えるケースは0件。quota<=0・他フィールド<=0の例外も0件（大阪府に続き2県目のクリーンな県）。',
  },
  officialSubtotals: [
    { label: '公立合計', quota: 16954, applicantsConfirmed: 16895, testTakersConfirmed: 16826, finalPassers: 16078 },
  ],
  records: [
    { schoolName: '下田', department: '普通科', quota: 120, applicantsConfirmed: 120, testTakersConfirmed: 120, finalPassers: 119 },
    { schoolName: '下田', department: '理数科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '南伊豆分校', department: '園芸', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '松崎', department: '普通科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '稲取', department: '普通科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '伊豆伊東', department: '普通科', quota: 160, applicantsConfirmed: 145, testTakersConfirmed: 145, finalPassers: 145 },
    { schoolName: '伊豆伊東', department: 'ビジネスマネジメント', quota: 80, applicantsConfirmed: 65, testTakersConfirmed: 64, finalPassers: 63 },
    { schoolName: '熱海', department: '普通科', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '伊豆総合', department: '工業', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '伊豆総合', department: '総合', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '土肥分校', department: '普通科', quota: 35, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '韮山', department: '普通科', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 222, finalPassers: 246 },
    { schoolName: '韮山', department: '理数科', quota: 40, applicantsConfirmed: 70, testTakersConfirmed: 70, finalPassers: 43 },
    { schoolName: '伊豆中央', department: '普通科', quota: 120, applicantsConfirmed: 92, testTakersConfirmed: 92, finalPassers: 92 },
    { schoolName: '田方農業', department: '生産科学・園芸デザイン', quota: 80, applicantsConfirmed: 64, testTakersConfirmed: 63, finalPassers: 63 },
    { schoolName: '田方農業', department: '動物科学', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 41 },
    { schoolName: '田方農業', department: '食品科学・ライフデザイン', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 76, finalPassers: 76 },
    { schoolName: '三島南', department: '普通科', quota: 200, applicantsConfirmed: 226, testTakersConfirmed: 225, finalPassers: 207 },
    { schoolName: '三島北', department: '普通科', quota: 280, applicantsConfirmed: 332, testTakersConfirmed: 329, finalPassers: 293 },
    { schoolName: '御殿場', department: '創造工学', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '御殿場', department: '創造ビジネス', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '御殿場', department: '生活創造デザイン', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '御殿場南', department: '普通科', quota: 160, applicantsConfirmed: 126, testTakersConfirmed: 125, finalPassers: 124 },
    { schoolName: '小山', department: '普通科', quota: 80, applicantsConfirmed: 64, testTakersConfirmed: 64, finalPassers: 64 },
    { schoolName: '裾野', department: '総合', quota: 80, applicantsConfirmed: 68, testTakersConfirmed: 67, finalPassers: 67 },
    { schoolName: '沼津東', department: '普通科', quota: 240, applicantsConfirmed: 229, testTakersConfirmed: 229, finalPassers: 244 },
    { schoolName: '沼津東', department: '理数科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 40 },
    { schoolName: '沼津西', department: '普通科', quota: 120, applicantsConfirmed: 131, testTakersConfirmed: 130, finalPassers: 125 },
    { schoolName: '沼津西', department: '芸術', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 27 },
    { schoolName: '沼津城北', department: '普通科', quota: 80, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '沼津工業', department: '機械・電気・電子ロボット・建設デザイン', quota: 160, applicantsConfirmed: 163, testTakersConfirmed: 162, finalPassers: 162 },
    { schoolName: '沼津商業', department: '総合ビジネス', quota: 80, applicantsConfirmed: 103, testTakersConfirmed: 103, finalPassers: 84 },
    { schoolName: '沼津商業', department: '情報ビジネス', quota: 80, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 84 },
    { schoolName: '沼津市立沼津', department: '普通科', quota: 132, applicantsConfirmed: 114, testTakersConfirmed: 114, finalPassers: 113 },
    { schoolName: '吉原', department: '普通科', quota: 120, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 115 },
    { schoolName: '吉原', department: '国際', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '吉原工業', department: '機械工学・ロボット工学・電気機器工学・理数化学', quota: 160, applicantsConfirmed: 140, testTakersConfirmed: 138, finalPassers: 138 },
    { schoolName: '富士', department: '普通科', quota: 200, applicantsConfirmed: 224, testTakersConfirmed: 224, finalPassers: 207 },
    { schoolName: '富士', department: '理数科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 40 },
    { schoolName: '富士東', department: '普通科', quota: 160, applicantsConfirmed: 160, testTakersConfirmed: 160, finalPassers: 160 },
    { schoolName: '富士宮東', department: '普通科', quota: 120, applicantsConfirmed: 99, testTakersConfirmed: 97, finalPassers: 97 },
    { schoolName: '富士宮東', department: '福祉', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '富士宮北', department: '普通科', quota: 120, applicantsConfirmed: 135, testTakersConfirmed: 135, finalPassers: 126 },
    { schoolName: '富士宮北', department: '商業', quota: 80, applicantsConfirmed: 73, testTakersConfirmed: 73, finalPassers: 80 },
    { schoolName: '富士宮西', department: '普通科', quota: 160, applicantsConfirmed: 114, testTakersConfirmed: 114, finalPassers: 114 },
    { schoolName: '富岳館', department: '総合', quota: 200, applicantsConfirmed: 171, testTakersConfirmed: 170, finalPassers: 170 },
    { schoolName: '富士市立', department: 'ビジネス探究', quota: 80, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 60 },
    { schoolName: '富士市立', department: 'スポーツ探究', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 42 },
    { schoolName: '富士市立', department: '総合探究', quota: 120, applicantsConfirmed: 106, testTakersConfirmed: 106, finalPassers: 107 },
    { schoolName: '清水東', department: '普通科', quota: 240, applicantsConfirmed: 231, testTakersConfirmed: 231, finalPassers: 232 },
    { schoolName: '清水東', department: '理数科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 37, finalPassers: 36 },
    { schoolName: '清水西', department: '普通科', quota: 160, applicantsConfirmed: 143, testTakersConfirmed: 143, finalPassers: 143 },
    { schoolName: '清水南', department: '普通科', quota: 34, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '清水南', department: '芸術', quota: 33, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '静岡市立清水桜が丘', department: '普通科', quota: 120, applicantsConfirmed: 126, testTakersConfirmed: 125, finalPassers: 126 },
    { schoolName: '静岡市立清水桜が丘', department: '商業', quota: 120, applicantsConfirmed: 129, testTakersConfirmed: 129, finalPassers: 126 },
    { schoolName: '静岡', department: '普通科', quota: 320, applicantsConfirmed: 419, testTakersConfirmed: 418, finalPassers: 335 },
    { schoolName: '静岡城北', department: '普通科', quota: 200, applicantsConfirmed: 191, testTakersConfirmed: 191, finalPassers: 201 },
    { schoolName: '静岡城北', department: 'グローバル', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 42 },
    { schoolName: '静岡東', department: '普通科', quota: 280, applicantsConfirmed: 308, testTakersConfirmed: 307, finalPassers: 294 },
    { schoolName: '静岡西', department: '普通科', quota: 80, applicantsConfirmed: 70, testTakersConfirmed: 70, finalPassers: 70 },
    { schoolName: '駿河総合', department: '総合', quota: 200, applicantsConfirmed: 197, testTakersConfirmed: 197, finalPassers: 197 },
    { schoolName: '静岡農業', department: '生物生産・生産流通', quota: 80, applicantsConfirmed: 68, testTakersConfirmed: 68, finalPassers: 80 },
    { schoolName: '静岡農業', department: '環境科学', quota: 40, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 42 },
    { schoolName: '静岡農業', department: '食品科学・生活科学', quota: 80, applicantsConfirmed: 90, testTakersConfirmed: 90, finalPassers: 84 },
    { schoolName: '科学技術', department: '機械工学', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 41 },
    { schoolName: '科学技術', department: 'ロボット工学', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '科学技術', department: '電気工学', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 41 },
    { schoolName: '科学技術', department: '情報システム', quota: 40, applicantsConfirmed: 75, testTakersConfirmed: 71, finalPassers: 41 },
    { schoolName: '科学技術', department: '建築デザイン', quota: 40, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 41 },
    { schoolName: '科学技術', department: '都市基盤工学', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 41 },
    { schoolName: '科学技術', department: '電子物質工学', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 40 },
    { schoolName: '科学技術', department: '理工', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 53, finalPassers: 41 },
    { schoolName: '静岡商業', department: '商業', quota: 160, applicantsConfirmed: 169, testTakersConfirmed: 169, finalPassers: 160 },
    { schoolName: '静岡商業', department: '情報処理', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 34 },
    { schoolName: '静岡市立', department: '普通科', quota: 280, applicantsConfirmed: 311, testTakersConfirmed: 310, finalPassers: 287 },
    { schoolName: '静岡市立', department: '科学探究', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 26, finalPassers: 29 },
    { schoolName: '焼津中央', department: '普通科', quota: 280, applicantsConfirmed: 291, testTakersConfirmed: 289, finalPassers: 287 },
    { schoolName: '焼津水産', department: '海洋科学', quota: 80, applicantsConfirmed: 84, testTakersConfirmed: 83, finalPassers: 81 },
    { schoolName: '焼津水産', department: '栽培漁業', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 27 },
    { schoolName: '焼津水産', department: '食品科学', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 37 },
    { schoolName: '焼津水産', department: '流通情報', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 41 },
    { schoolName: '清流館', department: '普通科', quota: 160, applicantsConfirmed: 168, testTakersConfirmed: 166, finalPassers: 165 },
    { schoolName: '清流館', department: '福祉', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '藤枝東', department: '普通科', quota: 280, applicantsConfirmed: 335, testTakersConfirmed: 333, finalPassers: 294 },
    { schoolName: '藤枝西', department: '普通科', quota: 160, applicantsConfirmed: 172, testTakersConfirmed: 170, finalPassers: 166 },
    { schoolName: '藤枝北', department: '総合', quota: 160, applicantsConfirmed: 170, testTakersConfirmed: 169, finalPassers: 167 },
    { schoolName: '島田', department: '普通科', quota: 160, applicantsConfirmed: 156, testTakersConfirmed: 155, finalPassers: 155 },
    { schoolName: '島田工業', department: '機械・電気・情報電子【Ⅰ類】', quota: 120, applicantsConfirmed: 104, testTakersConfirmed: 103, finalPassers: 102 },
    { schoolName: '島田工業', department: '建築・都市工学【Ⅱ類】', quota: 80, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 49 },
    { schoolName: '島田商業', department: '商業', quota: 160, applicantsConfirmed: 170, testTakersConfirmed: 169, finalPassers: 166 },
    { schoolName: '川根', department: '普通科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 23 },
    { schoolName: '榛原', department: '普通科', quota: 120, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 101 },
    { schoolName: '榛原', department: '理数科', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '相良', department: '普通科', quota: 80, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 84 },
    { schoolName: '相良', department: '商業', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 40 },
    { schoolName: '掛川東', department: '普通科', quota: 200, applicantsConfirmed: 257, testTakersConfirmed: 257, finalPassers: 210 },
    { schoolName: '掛川西', department: '普通科', quota: 280, applicantsConfirmed: 315, testTakersConfirmed: 315, finalPassers: 290 },
    { schoolName: '掛川西', department: '理数科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 42 },
    { schoolName: '掛川工業', department: '機械工学', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 42 },
    { schoolName: '掛川工業', department: '電気電子工学', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 40 },
    { schoolName: '掛川工業', department: '情報工学', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 33 },
    { schoolName: '掛川工業', department: '建築設備工学', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 41 },
    { schoolName: '横須賀', department: '普通科', quota: 120, applicantsConfirmed: 113, testTakersConfirmed: 110, finalPassers: 110 },
    { schoolName: '池新田', department: '普通科', quota: 120, applicantsConfirmed: 84, testTakersConfirmed: 84, finalPassers: 84 },
    { schoolName: '小笠', department: '総合', quota: 200, applicantsConfirmed: 202, testTakersConfirmed: 201, finalPassers: 199 },
    { schoolName: '遠江総合', department: '総合', quota: 160, applicantsConfirmed: 141, testTakersConfirmed: 141, finalPassers: 138 },
    { schoolName: '袋井', department: '普通科', quota: 240, applicantsConfirmed: 254, testTakersConfirmed: 254, finalPassers: 252 },
    { schoolName: '袋井商業', department: '商業', quota: 120, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 85 },
    { schoolName: '磐田南', department: '普通科', quota: 280, applicantsConfirmed: 283, testTakersConfirmed: 283, finalPassers: 292 },
    { schoolName: '磐田南', department: '理数科', quota: 40, applicantsConfirmed: 75, testTakersConfirmed: 75, finalPassers: 42 },
    { schoolName: '磐田北', department: '普通科', quota: 160, applicantsConfirmed: 144, testTakersConfirmed: 144, finalPassers: 144 },
    { schoolName: '磐田北', department: '福祉', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '磐田農業', department: '生産科学', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 40 },
    { schoolName: '磐田農業', department: '生産流通', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '磐田農業', department: '環境科学', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 40 },
    { schoolName: '磐田農業', department: '食品科学', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 41 },
    { schoolName: '磐田農業', department: '生活科学', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '磐田西', department: '普通科', quota: 120, applicantsConfirmed: 133, testTakersConfirmed: 132, finalPassers: 123 },
    { schoolName: '磐田西', department: '総合ビジネス', quota: 80, applicantsConfirmed: 74, testTakersConfirmed: 74, finalPassers: 80 },
    { schoolName: '天竜', department: '森林・環境', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '天竜', department: '福祉', quota: 20, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 4 },
    { schoolName: '天竜', department: '総合', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 76, finalPassers: 78 },
    { schoolName: '春野校舎', department: '普通科', quota: 35, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '浜松北', department: '普通科', quota: 320, applicantsConfirmed: 408, testTakersConfirmed: 407, finalPassers: 324 },
    { schoolName: '浜松北', department: '国際', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '浜松西', department: '普通科', quota: 105, applicantsConfirmed: 118, testTakersConfirmed: 118, finalPassers: 114 },
    { schoolName: '浜松南', department: '普通科', quota: 280, applicantsConfirmed: 374, testTakersConfirmed: 373, finalPassers: 289 },
    { schoolName: '浜松南', department: '理数科', quota: 40, applicantsConfirmed: 71, testTakersConfirmed: 71, finalPassers: 42 },
    { schoolName: '浜松湖東', department: '普通科', quota: 240, applicantsConfirmed: 228, testTakersConfirmed: 227, finalPassers: 226 },
    { schoolName: '浜松湖南', department: '普通科', quota: 280, applicantsConfirmed: 263, testTakersConfirmed: 262, finalPassers: 262 },
    { schoolName: '浜松湖南', department: '英語', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '浜松江之島', department: '普通科', quota: 120, applicantsConfirmed: 133, testTakersConfirmed: 133, finalPassers: 126 },
    { schoolName: '浜松江之島', department: '芸術', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '浜松東', department: '普通科', quota: 120, applicantsConfirmed: 125, testTakersConfirmed: 124, finalPassers: 121 },
    { schoolName: '浜松東', department: '総合ビジネス', quota: 80, applicantsConfirmed: 80, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '浜松東', department: '情報ビジネス', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '浜松大平台', department: '総合', quota: 160, applicantsConfirmed: 151, testTakersConfirmed: 151, finalPassers: 149 },
    { schoolName: '浜松工業', department: '機械', quota: 80, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 81 },
    { schoolName: '浜松工業', department: '電気', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 41 },
    { schoolName: '浜松工業', department: '情報技術', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 36 },
    { schoolName: '浜松工業', department: '建築', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 40 },
    { schoolName: '浜松工業', department: '土木', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 41 },
    { schoolName: '浜松工業', department: 'システム化学', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '浜松工業', department: 'デザイン', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '浜松工業', department: '理数工学', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '浜松城北工業', department: '機械', quota: 80, applicantsConfirmed: 79, testTakersConfirmed: 79, finalPassers: 80 },
    { schoolName: '浜松城北工業', department: '電子機械', quota: 40, applicantsConfirmed: 60, testTakersConfirmed: 60, finalPassers: 42 },
    { schoolName: '浜松城北工業', department: '電気', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 35, finalPassers: 38 },
    { schoolName: '浜松城北工業', department: '電子', quota: 80, applicantsConfirmed: 44, testTakersConfirmed: 43, finalPassers: 57 },
    { schoolName: '浜松商業', department: '商業', quota: 240, applicantsConfirmed: 278, testTakersConfirmed: 278, finalPassers: 252 },
    { schoolName: '浜松商業', department: '情報処理', quota: 80, applicantsConfirmed: 67, testTakersConfirmed: 67, finalPassers: 84 },
    { schoolName: '浜名', department: '普通科', quota: 320, applicantsConfirmed: 311, testTakersConfirmed: 308, finalPassers: 308 },
    { schoolName: '浜北西', department: '普通科', quota: 240, applicantsConfirmed: 237, testTakersConfirmed: 236, finalPassers: 236 },
    { schoolName: '浜松湖北', department: '普通科', quota: 120, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 101 },
    { schoolName: '浜松湖北', department: '産業マネジメントⅠ', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '浜松湖北', department: '産業マネジメントⅡ', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 76, finalPassers: 73 },
    { schoolName: '浜松湖北', department: '産業マネジメントⅢ', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '佐久間分校', department: '普通科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '新居', department: '普通科', quota: 160, applicantsConfirmed: 154, testTakersConfirmed: 153, finalPassers: 152 },
    { schoolName: '湖西', department: '普通科', quota: 120, applicantsConfirmed: 89, testTakersConfirmed: 89, finalPassers: 88 },
    { schoolName: '浜松市立', department: '普通科', quota: 360, applicantsConfirmed: 417, testTakersConfirmed: 417, finalPassers: 369 },
  ],
};
