import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 大阪府 段階台帳（T-Y11F §5順序#7・8県目・全165レコードで完結）。
 *
 * 一次ソース: 大阪府教育委員会「データで見る府立高校（入学者選抜結果・定員・学校別在籍者数）」
 * 掲載の「令和8年度 入学状況概要」xlsx（sheet16「１　普通教育を主とする学科（普通科（単位制
 * を除く。）及び文理探究科）を第１志望とした志願者の旧通学区域別割合」の1つ前に位置する
 * 学校別・学科別の詳細表。「Ⅴ　一般入学者選抜（全日制の課程）」区分の学校×学科粒度データを
 * 1シートに集約収録している）。
 * https://www.pref.osaka.lg.jp/o180040/kotogakko/chigai/index.html
 * https://www.pref.osaka.lg.jp/documents/9152/r08nyugakujokyogaiyo.xlsx
 *
 * 本資料は「募集人員（A）」「学校全体の志願者数（B）・受験者数」に加え、学科ごとに「当該学科を
 * 第１志望とする志願者数（C）・受験者数・合格者数（D）」を個別記載する。既存の倍率パイプライン
 * `competition-rates/osaka.ts`（R8・165レコード・別のxlsx「一般入学者選抜の志願者数」から
 * quota/finalApplicants=①第1志望者数を独立に転記・xlsx直読みで検証済み）とquota・第1志望
 * 志願者数（C＝既存パイプラインのfinalApplicantsと同一概念）の完全一致を突合キーとして機械的に
 * 結合し、本資料が独自に持つtestTakersConfirmed（受験者数）・finalPassers（合格者数D）のみを
 * 新規転記した。165件全数が(schoolName, quota, applicantsConfirmed)の3つ組で既存パイプラインと
 * 一意に一致（重複無し・欠落無し）し、資料本文末尾の総計行（quota31847/志願者数計33422/
 * 受験者数計33363/合格者数計29697）と165件の機械集計が4系列とも完全一致した。
 *
 * ⚠️既知の罠: xlsxの学校名にCJK互換漢字の異体字（例: 「塚」のU+FA10、標準字体U+585Aとは
 * 別コードポイント）が使われており、素朴な文字列一致では「貝塚」「貝塚南」がパイプライン側と
 * 一致しなかった。NFKC正規化で突合し、出力schoolNameは常にパイプライン側の正規表記を採用した
 * （scripts/bairitsu-ingest/extract-osaka-stage-ledger.tsに実装・[[fable5-loop-protocol]]の
 * 既知の罠に追記予定）。
 *
 * ⚠️既知の0値: 東淀工業「理工学科」（quota35・applicantsConfirmed/testTakersConfirmed/
 * finalPassers全て0）は既存パイプライン側も同一年度でfinalApplicants=0・finalRate=0と記録済み
 * （その年度の募集が事実上不成立だったことが両ソース独立に裏付けられている）。
 *
 * 大阪府は他県と異なりfinalPassersがtestTakersConfirmed/applicantsConfirmedを上回るケースが
 * 1件も無い（第1志望のみに絞った合格者数のため、他学科からの第2志望合格者を含まない一貫した
 * 定義になっているためと推測）。
 */
export const OSAKA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'osaka',
  sources: [
    {
      url: 'https://www.pref.osaka.lg.jp/documents/9152/r08nyugakujokyogaiyo.xlsx',
      docTitle:
        '大阪府教育委員会 令和8年度 公立高等学校入学状況概要（データで見る府立高校）sheet16「一般入学者選抜（全日制の課程）普通教育を主とする学科・専門学科・総合学科（クリエイティブスクールを含む。）」学校別・学科別合否判定の状況',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '普通教育を主とする学科（普通科・単位制以外＋併置専門学科）（府立103校＋市立1校）',
      '普通科（単位制）（4校）',
      '文理探究科（2校）',
      '専門学科のみを設置する高等学校（農業・工業・商業・文理学科等）',
      '総合学科（クリエイティブスクールを含む。）',
    ],
    pendingDepartments: [],
    note: '「一般入学者選抜（全日制の課程）」区分（sheet16）に掲載された学校×学科の全165組を完全収録。quota・applicantsConfirmed（当該学科を第1志望とする志願者数＝既存パイプラインのfinalApplicantsと同一概念）は既存パイプライン`competition-rates/osaka.ts`のR8レコードと165件全数で完全一致（本資料自体にもこの2値は印字されているが、既存パイプラインとの独立クロスチェックとして両者一致を確認した上でパイプライン値をそのまま採用）。testTakersConfirmed（受験者数）・finalPassers（合格者数）は本資料から新規転記。資料本文末尾の3段階の公式小計（普通教育を主とする学科の計/専門学科の計/総合学科（クリエイティブスクールを含む。）の計/総計）と165件全数の機械集計がquota/applicantsConfirmed/testTakersConfirmed/finalPassersの4系列すべてで完全一致。finalPassersがapplicantsConfirmed・testTakersConfirmedを上回るケースは0件（大阪府の合格者数は第1志望内のみを計上する一貫した定義のため、他県で頻出する「特別選抜等の合算による超過」パターンが構造的に発生しない）。既知の0値例外は東淀工業「理工学科」（quota35・applicants/testTakers/finalPassers全て0）の1件のみで既存パイプライン側も同一。',
  },
  officialSubtotals: [
    { label: '普通教育を主とする学科の計', quota: 19347, applicantsConfirmed: 20134, testTakersConfirmed: 20102, finalPassers: 18264 },
    { label: '専門学科の計', quota: 9130, applicantsConfirmed: 10005, testTakersConfirmed: 9988, finalPassers: 8382 },
    { label: '総合学科（クリエイティブスクールを含む。）の計', quota: 3370, applicantsConfirmed: 3283, testTakersConfirmed: 3273, finalPassers: 3051 },
    { label: '総計', quota: 31847, applicantsConfirmed: 33422, testTakersConfirmed: 33363, finalPassers: 29697 },
  ],
  records: [
    { schoolName: '東淀川', department: '普通科', quota: 264, applicantsConfirmed: 328, testTakersConfirmed: 327, finalPassers: 264 },
    { schoolName: '旭', department: '普通科', quota: 240, applicantsConfirmed: 245, testTakersConfirmed: 243, finalPassers: 240 },
    { schoolName: '旭', department: '国際文化科', quota: 77, applicantsConfirmed: 70, testTakersConfirmed: 70, finalPassers: 70 },
    { schoolName: '桜宮', department: '普通科', quota: 120, applicantsConfirmed: 132, testTakersConfirmed: 132, finalPassers: 120 },
    { schoolName: '東', department: '普通科', quota: 200, applicantsConfirmed: 271, testTakersConfirmed: 271, finalPassers: 200 },
    { schoolName: '東', department: '理数科', quota: 80, applicantsConfirmed: 99, testTakersConfirmed: 98, finalPassers: 77 },
    { schoolName: '東', department: '英語科', quota: 36, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 17 },
    { schoolName: '汎愛', department: '普通科', quota: 160, applicantsConfirmed: 167, testTakersConfirmed: 167, finalPassers: 160 },
    { schoolName: '清水谷', department: '普通科', quota: 280, applicantsConfirmed: 319, testTakersConfirmed: 318, finalPassers: 280 },
    { schoolName: '夕陽丘', department: '普通科', quota: 280, applicantsConfirmed: 317, testTakersConfirmed: 317, finalPassers: 280 },
    { schoolName: '港', department: '普通科', quota: 280, applicantsConfirmed: 302, testTakersConfirmed: 302, finalPassers: 280 },
    { schoolName: '阿倍野', department: '普通科', quota: 320, applicantsConfirmed: 384, testTakersConfirmed: 384, finalPassers: 320 },
    { schoolName: '東住吉', department: '普通科', quota: 280, applicantsConfirmed: 339, testTakersConfirmed: 339, finalPassers: 280 },
    { schoolName: '阪南', department: '普通科', quota: 280, applicantsConfirmed: 247, testTakersConfirmed: 246, finalPassers: 246 },
    { schoolName: '池田', department: '普通科', quota: 360, applicantsConfirmed: 359, testTakersConfirmed: 358, finalPassers: 358 },
    { schoolName: '渋谷', department: '普通科', quota: 240, applicantsConfirmed: 232, testTakersConfirmed: 230, finalPassers: 230 },
    { schoolName: '桜塚', department: '普通科', quota: 360, applicantsConfirmed: 419, testTakersConfirmed: 419, finalPassers: 360 },
    { schoolName: '豊島', department: '普通科', quota: 280, applicantsConfirmed: 276, testTakersConfirmed: 275, finalPassers: 275 },
    { schoolName: '刀根山', department: '普通科', quota: 360, applicantsConfirmed: 426, testTakersConfirmed: 425, finalPassers: 360 },
    { schoolName: '箕面', department: '普通科', quota: 280, applicantsConfirmed: 298, testTakersConfirmed: 298, finalPassers: 245 },
    { schoolName: '箕面', department: 'グローバル科', quota: 72, applicantsConfirmed: 126, testTakersConfirmed: 124, finalPassers: 72 },
    { schoolName: '茨木西', department: '普通科', quota: 240, applicantsConfirmed: 238, testTakersConfirmed: 237, finalPassers: 237 },
    { schoolName: '北摂つばさ', department: '普通科', quota: 200, applicantsConfirmed: 125, testTakersConfirmed: 125, finalPassers: 125 },
    { schoolName: '吹田', department: '普通科', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 223, finalPassers: 223 },
    { schoolName: '吹田東', department: '普通科', quota: 320, applicantsConfirmed: 383, testTakersConfirmed: 382, finalPassers: 320 },
    { schoolName: '北千里', department: '普通科', quota: 320, applicantsConfirmed: 415, testTakersConfirmed: 415, finalPassers: 320 },
    { schoolName: '山田', department: '普通科', quota: 360, applicantsConfirmed: 412, testTakersConfirmed: 410, finalPassers: 360 },
    { schoolName: '三島', department: '普通科', quota: 360, applicantsConfirmed: 456, testTakersConfirmed: 456, finalPassers: 360 },
    { schoolName: '高槻北', department: '普通科', quota: 280, applicantsConfirmed: 244, testTakersConfirmed: 244, finalPassers: 244 },
    { schoolName: '芥川', department: '普通科', quota: 280, applicantsConfirmed: 273, testTakersConfirmed: 273, finalPassers: 273 },
    { schoolName: '阿武野', department: '普通科', quota: 240, applicantsConfirmed: 243, testTakersConfirmed: 243, finalPassers: 240 },
    { schoolName: '大冠', department: '普通科', quota: 280, applicantsConfirmed: 280, testTakersConfirmed: 279, finalPassers: 279 },
    { schoolName: '摂津', department: '普通科', quota: 160, applicantsConfirmed: 180, testTakersConfirmed: 180, finalPassers: 160 },
    { schoolName: '寝屋川', department: '普通科', quota: 320, applicantsConfirmed: 398, testTakersConfirmed: 397, finalPassers: 320 },
    { schoolName: '西寝屋川', department: '普通科', quota: 240, applicantsConfirmed: 107, testTakersConfirmed: 107, finalPassers: 107 },
    { schoolName: '北かわち皐が丘', department: '普通科', quota: 240, applicantsConfirmed: 195, testTakersConfirmed: 195, finalPassers: 195 },
    { schoolName: '枚方', department: '普通科', quota: 240, applicantsConfirmed: 300, testTakersConfirmed: 300, finalPassers: 240 },
    { schoolName: '枚方', department: '国際文化科', quota: 77, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '長尾', department: '普通科', quota: 160, applicantsConfirmed: 90, testTakersConfirmed: 90, finalPassers: 90 },
    { schoolName: '牧野', department: '普通科', quota: 280, applicantsConfirmed: 284, testTakersConfirmed: 283, finalPassers: 280 },
    { schoolName: '香里丘', department: '普通科', quota: 240, applicantsConfirmed: 295, testTakersConfirmed: 295, finalPassers: 240 },
    { schoolName: '枚方津田', department: '普通科', quota: 240, applicantsConfirmed: 199, testTakersConfirmed: 199, finalPassers: 199 },
    { schoolName: 'いちりつ', department: '普通科', quota: 200, applicantsConfirmed: 228, testTakersConfirmed: 228, finalPassers: 200 },
    { schoolName: 'いちりつ', department: '理数科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: 'いちりつ', department: '英語科', quota: 39, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '守口東', department: '普通科', quota: 240, applicantsConfirmed: 195, testTakersConfirmed: 195, finalPassers: 195 },
    { schoolName: '門真西', department: '普通科', quota: 160, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 69 },
    { schoolName: '野崎', department: '普通科', quota: 160, applicantsConfirmed: 101, testTakersConfirmed: 99, finalPassers: 99 },
    { schoolName: '緑風冠', department: '普通科', quota: 240, applicantsConfirmed: 219, testTakersConfirmed: 219, finalPassers: 219 },
    { schoolName: '交野', department: '普通科', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 222, finalPassers: 222 },
    { schoolName: '布施', department: '普通科', quota: 320, applicantsConfirmed: 354, testTakersConfirmed: 353, finalPassers: 320 },
    { schoolName: '花園', department: '普通科', quota: 240, applicantsConfirmed: 316, testTakersConfirmed: 316, finalPassers: 240 },
    { schoolName: '花園', department: '国際文化科', quota: 77, applicantsConfirmed: 65, testTakersConfirmed: 65, finalPassers: 56 },
    { schoolName: 'みどり清朋', department: '普通科', quota: 240, applicantsConfirmed: 235, testTakersConfirmed: 235, finalPassers: 235 },
    { schoolName: '山本', department: '普通科', quota: 280, applicantsConfirmed: 302, testTakersConfirmed: 302, finalPassers: 280 },
    { schoolName: '八尾', department: '普通科', quota: 280, applicantsConfirmed: 308, testTakersConfirmed: 308, finalPassers: 280 },
    { schoolName: '八尾翠翔', department: '普通科', quota: 200, applicantsConfirmed: 204, testTakersConfirmed: 204, finalPassers: 200 },
    { schoolName: '大塚', department: '普通科', quota: 160, applicantsConfirmed: 110, testTakersConfirmed: 108, finalPassers: 108 },
    { schoolName: '河南', department: '普通科', quota: 280, applicantsConfirmed: 263, testTakersConfirmed: 263, finalPassers: 263 },
    { schoolName: '富田林', department: '普通科', quota: 123, applicantsConfirmed: 151, testTakersConfirmed: 151, finalPassers: 123 },
    { schoolName: '金剛', department: '普通科', quota: 240, applicantsConfirmed: 241, testTakersConfirmed: 241, finalPassers: 240 },
    { schoolName: '懐風館', department: '普通科', quota: 120, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 50 },
    { schoolName: '長野', department: '普通科', quota: 160, applicantsConfirmed: 134, testTakersConfirmed: 134, finalPassers: 134 },
    { schoolName: '長野', department: '国際文化科', quota: 77, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '藤井寺', department: '普通科', quota: 240, applicantsConfirmed: 254, testTakersConfirmed: 253, finalPassers: 240 },
    { schoolName: '登美丘', department: '普通科', quota: 280, applicantsConfirmed: 283, testTakersConfirmed: 283, finalPassers: 280 },
    { schoolName: '泉陽', department: '普通科', quota: 320, applicantsConfirmed: 412, testTakersConfirmed: 412, finalPassers: 320 },
    { schoolName: '金岡', department: '普通科', quota: 240, applicantsConfirmed: 242, testTakersConfirmed: 242, finalPassers: 240 },
    { schoolName: '東百舌鳥', department: '普通科', quota: 240, applicantsConfirmed: 253, testTakersConfirmed: 252, finalPassers: 240 },
    { schoolName: '堺西', department: '普通科', quota: 240, applicantsConfirmed: 243, testTakersConfirmed: 243, finalPassers: 240 },
    { schoolName: '堺上', department: '普通科', quota: 240, applicantsConfirmed: 237, testTakersConfirmed: 237, finalPassers: 237 },
    { schoolName: '泉大津', department: '普通科', quota: 240, applicantsConfirmed: 233, testTakersConfirmed: 233, finalPassers: 233 },
    { schoolName: '信太', department: '普通科', quota: 240, applicantsConfirmed: 221, testTakersConfirmed: 220, finalPassers: 220 },
    { schoolName: '高石', department: '普通科', quota: 280, applicantsConfirmed: 298, testTakersConfirmed: 298, finalPassers: 280 },
    { schoolName: '和泉', department: '普通科', quota: 240, applicantsConfirmed: 278, testTakersConfirmed: 278, finalPassers: 240 },
    { schoolName: '和泉', department: 'グローバル科', quota: 78, applicantsConfirmed: 73, testTakersConfirmed: 73, finalPassers: 70 },
    { schoolName: '久米田', department: '普通科', quota: 280, applicantsConfirmed: 284, testTakersConfirmed: 282, finalPassers: 280 },
    { schoolName: '佐野', department: '普通科', quota: 200, applicantsConfirmed: 270, testTakersConfirmed: 270, finalPassers: 200 },
    { schoolName: '佐野', department: '国際文化科', quota: 73, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 34 },
    { schoolName: '日根野', department: '普通科', quota: 240, applicantsConfirmed: 257, testTakersConfirmed: 257, finalPassers: 240 },
    { schoolName: '貝塚南', department: '普通科', quota: 240, applicantsConfirmed: 220, testTakersConfirmed: 219, finalPassers: 219 },
    { schoolName: 'りんくう翔南', department: '普通科', quota: 160, applicantsConfirmed: 121, testTakersConfirmed: 121, finalPassers: 121 },
    { schoolName: '東大阪市立日新', department: '普通科', quota: 160, applicantsConfirmed: 125, testTakersConfirmed: 125, finalPassers: 125 },
    { schoolName: '東大阪市立日新', department: '商業科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '東大阪市立日新', department: '英語科', quota: 38, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '市岡', department: '普通科（単位制）', quota: 280, applicantsConfirmed: 318, testTakersConfirmed: 318, finalPassers: 280 },
    { schoolName: '大阪府教育センター附属', department: '普通科（単位制）', quota: 240, applicantsConfirmed: 248, testTakersConfirmed: 247, finalPassers: 240 },
    { schoolName: '槻の木', department: '普通科（単位制）', quota: 240, applicantsConfirmed: 221, testTakersConfirmed: 221, finalPassers: 221 },
    { schoolName: '鳳', department: '普通科（単位制）', quota: 240, applicantsConfirmed: 221, testTakersConfirmed: 221, finalPassers: 221 },
    { schoolName: '春日丘', department: '文理探究科', quota: 320, applicantsConfirmed: 530, testTakersConfirmed: 528, finalPassers: 320 },
    { schoolName: '狭山', department: '文理探究科', quota: 240, applicantsConfirmed: 261, testTakersConfirmed: 261, finalPassers: 240 },
    { schoolName: '園芸', department: 'フラワーファクトリ科', quota: 80, applicantsConfirmed: 77, testTakersConfirmed: 77, finalPassers: 77 },
    { schoolName: '園芸', department: '環境緑化科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '園芸', department: 'バイオサイエンス科', quota: 80, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 51 },
    { schoolName: '農芸', department: 'ハイテク農芸科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '農芸', department: '資源動物科', quota: 80, applicantsConfirmed: 83, testTakersConfirmed: 81, finalPassers: 80 },
    { schoolName: '農芸', department: '食品加工科', quota: 80, applicantsConfirmed: 77, testTakersConfirmed: 77, finalPassers: 77 },
    { schoolName: '東淀工業', department: '機械工学科', quota: 70, applicantsConfirmed: 68, testTakersConfirmed: 67, finalPassers: 67 },
    { schoolName: '東淀工業', department: '電気工学科', quota: 35, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '東淀工業', department: '理工学科', quota: 35, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '淀川工科', department: '機械・電気・メカトロニクス科', quota: 175, applicantsConfirmed: 166, testTakersConfirmed: 166, finalPassers: 166 },
    { schoolName: '淀川工科', department: '工学系大学進学専科', quota: 35, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '都島工業', department: '機械・機械電気科', quota: 70, applicantsConfirmed: 77, testTakersConfirmed: 77, finalPassers: 70 },
    { schoolName: '都島工業', department: '電気電子工学科', quota: 70, applicantsConfirmed: 61, testTakersConfirmed: 61, finalPassers: 60 },
    { schoolName: '都島工業', department: '建築・都市工学科', quota: 105, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 105 },
    { schoolName: '都島工業', department: '理数工学科', quota: 35, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '泉尾工業', department: '機械科', quota: 35, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '泉尾工業', department: '電気科', quota: 35, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '泉尾工業', department: '工業化学・セラミック科', quota: 35, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '泉尾工業', department: 'ファッション工学科', quota: 35, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '今宮工科', department: '機械・電気・建築・デザイン科', quota: 210, applicantsConfirmed: 205, testTakersConfirmed: 205, finalPassers: 205 },
    { schoolName: '今宮工科', department: '工学系大学進学専科', quota: 35, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '茨木工科', department: '機械・電気・環境化学システム科', quota: 105, applicantsConfirmed: 108, testTakersConfirmed: 108, finalPassers: 105 },
    { schoolName: '茨木工科', department: '工学系大学進学専科', quota: 35, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '東大阪みらい工科', department: '機械工学・電気情報工学・都市住宅科', quota: 210, applicantsConfirmed: 208, testTakersConfirmed: 207, finalPassers: 207 },
    { schoolName: '東大阪みらい工科', department: '工学系大学進学専科', quota: 35, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '藤井寺工科', department: '機械・電気・メカトロニクス科', quota: 175, applicantsConfirmed: 175, testTakersConfirmed: 175, finalPassers: 175 },
    { schoolName: '堺工科', department: '機械・電気・環境化学システム科', quota: 210, applicantsConfirmed: 181, testTakersConfirmed: 181, finalPassers: 181 },
    { schoolName: '堺工科', department: '工学系大学進学専科', quota: 35, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '佐野工科', department: '機械・電気・産業創造科', quota: 210, applicantsConfirmed: 198, testTakersConfirmed: 198, finalPassers: 198 },
    { schoolName: '堺市立堺', department: '機械材料創造科', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 76, finalPassers: 76 },
    { schoolName: '堺市立堺', department: '建築インテリア創造科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '堺市立堺', department: 'マネジメント創造科', quota: 80, applicantsConfirmed: 67, testTakersConfirmed: 67, finalPassers: 67 },
    { schoolName: '堺市立堺', department: 'サイエンス創造科', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '淀商業', department: '商業科', quota: 160, applicantsConfirmed: 117, testTakersConfirmed: 117, finalPassers: 117 },
    { schoolName: '淀商業', department: '福祉ボランティア科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '鶴見商業', department: '商業科', quota: 160, applicantsConfirmed: 148, testTakersConfirmed: 148, finalPassers: 148 },
    { schoolName: '住吉商業', department: '商業科', quota: 160, applicantsConfirmed: 119, testTakersConfirmed: 119, finalPassers: 119 },
    { schoolName: '岸和田市立産業', department: '商業科', quota: 160, applicantsConfirmed: 154, testTakersConfirmed: 154, finalPassers: 154 },
    { schoolName: '岸和田市立産業', department: '情報科', quota: 80, applicantsConfirmed: 74, testTakersConfirmed: 72, finalPassers: 72 },
    { schoolName: '大阪ビジネスフロンティア', department: 'グローバルビジネス科', quota: 240, applicantsConfirmed: 259, testTakersConfirmed: 259, finalPassers: 240 },
    { schoolName: '住吉', department: '総合科学科', quota: 155, applicantsConfirmed: 193, testTakersConfirmed: 193, finalPassers: 143 },
    { schoolName: '住吉', department: '国際文化科', quota: 157, applicantsConfirmed: 224, testTakersConfirmed: 223, finalPassers: 157 },
    { schoolName: '千里', department: '総合科学科', quota: 155, applicantsConfirmed: 187, testTakersConfirmed: 187, finalPassers: 155 },
    { schoolName: '千里', department: '国際文化科', quota: 157, applicantsConfirmed: 184, testTakersConfirmed: 184, finalPassers: 157 },
    { schoolName: '泉北', department: '総合科学科', quota: 117, applicantsConfirmed: 151, testTakersConfirmed: 150, finalPassers: 117 },
    { schoolName: '泉北', department: '国際文化科', quota: 155, applicantsConfirmed: 168, testTakersConfirmed: 168, finalPassers: 144 },
    { schoolName: '北野', department: '文理学科', quota: 360, applicantsConfirmed: 452, testTakersConfirmed: 452, finalPassers: 360 },
    { schoolName: '大手前', department: '文理学科', quota: 360, applicantsConfirmed: 476, testTakersConfirmed: 474, finalPassers: 360 },
    { schoolName: '高津', department: '文理学科', quota: 360, applicantsConfirmed: 501, testTakersConfirmed: 500, finalPassers: 360 },
    { schoolName: '天王寺', department: '文理学科', quota: 360, applicantsConfirmed: 419, testTakersConfirmed: 419, finalPassers: 360 },
    { schoolName: '豊中', department: '文理学科', quota: 360, applicantsConfirmed: 644, testTakersConfirmed: 643, finalPassers: 360 },
    { schoolName: '茨木', department: '文理学科', quota: 320, applicantsConfirmed: 446, testTakersConfirmed: 446, finalPassers: 320 },
    { schoolName: '四條畷', department: '文理学科', quota: 360, applicantsConfirmed: 486, testTakersConfirmed: 486, finalPassers: 360 },
    { schoolName: '生野', department: '文理学科', quota: 360, applicantsConfirmed: 466, testTakersConfirmed: 465, finalPassers: 360 },
    { schoolName: '三国丘', department: '文理学科', quota: 320, applicantsConfirmed: 423, testTakersConfirmed: 423, finalPassers: 320 },
    { schoolName: '岸和田', department: '文理学科', quota: 320, applicantsConfirmed: 373, testTakersConfirmed: 373, finalPassers: 320 },
    { schoolName: '桜和', department: '教育文理学科', quota: 240, applicantsConfirmed: 265, testTakersConfirmed: 265, finalPassers: 240 },
    { schoolName: '柴島', department: '総合学科', quota: 240, applicantsConfirmed: 309, testTakersConfirmed: 308, finalPassers: 240 },
    { schoolName: '咲くやこの花', department: '食物文化科', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 39 },
    { schoolName: '咲くやこの花', department: '総合学科', quota: 80, applicantsConfirmed: 98, testTakersConfirmed: 97, finalPassers: 80 },
    { schoolName: '今宮', department: '総合学科', quota: 240, applicantsConfirmed: 308, testTakersConfirmed: 308, finalPassers: 240 },
    { schoolName: '千里青雲', department: '総合学科', quota: 240, applicantsConfirmed: 272, testTakersConfirmed: 269, finalPassers: 240 },
    { schoolName: '福井', department: '総合学科', quota: 144, applicantsConfirmed: 75, testTakersConfirmed: 74, finalPassers: 74 },
    { schoolName: '枚方なぎさ', department: '総合学科', quota: 240, applicantsConfirmed: 222, testTakersConfirmed: 222, finalPassers: 222 },
    { schoolName: '芦間', department: '総合学科', quota: 240, applicantsConfirmed: 224, testTakersConfirmed: 222, finalPassers: 222 },
    { schoolName: '門真なみはや', department: '総合学科', quota: 224, applicantsConfirmed: 246, testTakersConfirmed: 245, finalPassers: 224 },
    { schoolName: '枚岡樟風', department: '総合学科', quota: 160, applicantsConfirmed: 97, testTakersConfirmed: 97, finalPassers: 97 },
    { schoolName: '八尾北', department: '総合学科', quota: 224, applicantsConfirmed: 216, testTakersConfirmed: 215, finalPassers: 215 },
    { schoolName: '松原', department: '総合学科', quota: 240, applicantsConfirmed: 178, testTakersConfirmed: 178, finalPassers: 178 },
    { schoolName: '堺東', department: '総合学科', quota: 240, applicantsConfirmed: 249, testTakersConfirmed: 249, finalPassers: 240 },
    { schoolName: '成美', department: '総合学科', quota: 144, applicantsConfirmed: 92, testTakersConfirmed: 92, finalPassers: 92 },
    { schoolName: '伯太', department: '総合学科', quota: 240, applicantsConfirmed: 234, testTakersConfirmed: 234, finalPassers: 234 },
    { schoolName: '貝塚', department: '総合学科', quota: 240, applicantsConfirmed: 250, testTakersConfirmed: 250, finalPassers: 240 },
    { schoolName: '東住吉総合', department: '総合学科（クリエイティブスクール）', quota: 234, applicantsConfirmed: 213, testTakersConfirmed: 213, finalPassers: 213 },
  ],
};
