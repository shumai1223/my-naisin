import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 神奈川県 段階台帳（T-Y11F §5順序#7・6県目・「普通科」〈96レコード〉＋「専門学科」
 * 〈33レコード〉＋「単位制」〈35レコード〉＝計164レコード）。
 *
 * 一次ソース: 神奈川県教育委員会「令和8年度神奈川県公立高等学校入学者選抜一般募集共通選抜等
 * 合格状況（各学校別の合格の状況等）」別紙4（xlsx版・5シート構成: 普通科・クリエイティブ／
 * 専門学科／単位制／定時制・通信制／特別募集等）のsheet1「普通科・クリエイティブ」。
 * https://www.pref.kanagawa.jp/documents/132524/bessi4.xlsx
 * （xlsx版はPDF版と同一内容・列がテキストとして直接読めるためビジョン解析不要）
 *
 * ⚠️既存の`competition-rates/kanagawa.ts`（倍率パイプライン）は**別の一次資料**（志願変更締切時の
 * 志願者数）を採用しており、本資料には志願者数列そのものが存在しない（受検者数・合格者数のみを
 * 掲載する試験後資料）。そのためquota・applicantsConfirmedは既存パイプラインから再利用し
 * （募集人員は試験日まで不変で全96件完全一致を確認済み）、testTakersConfirmed＝「計（Ａ）＋
 * （Ｂ）」列（２月17日の本検査受検者＋追検査受検者の合計）・finalPassers＝「合格者数（Ｃ）」列
 * のみを本資料から新規に転記した（ibaraki.ts/saitama.tsと同型の複数資料合成設計）。
 *
 * 🔍**xlsx構造の発見**: セル抽出の共有ライブラリ`src/lib/xlsx-parse.ts`に自己終端セル
 * （`<c .../>`）の列ずれバグがあり、本資料の実データで発見・同日中に修正済み（詳細は
 * [[fable5-loop-protocol]]既知の罠を参照）。列は学校名(D列・県立は「県立」接頭辞付き)・
 * 募集定員(E列・A)・計(F列・(A)+(B))・２月17日(G列・A)・追検査(H列・B)・合格者数(K列・C)・
 * 取消者数(L列・D)・競争率(M列・(A+B-D)/C)・欠員(N列)。市立2校（横浜市立桜丘・横浜市立金沢）は
 * 「学区内／学区外」の内訳列(I/J)を持つが最終合計はK列に統一されており県立と同じ列位置で
 * 読める。クリエイティブスクール4校のみ学校名がB列（先頭に半角スペース＋「県立」接頭辞）に
 * ある点が唯一の構造差。
 *
 * quotaは96件全数が既存パイプラインと完全一致（募集人員は試験日まで不変）。県立87校・
 * 市立5校（横浜市立2＋川崎市立3）・クリエイティブスクール4校の内訳もxlsx本文の「県立計」
 * 「市立計」「合計」「（クリエイティブ）合計」の4段階の公式小計と96レコード全数の機械集計が
 * quota/testTakersConfirmed/finalPassersの3系列すべてで完全一致（applicantsConfirmedは
 * この資料に印字が無い参考値のため既存パイプラインの小計との一致のみ確認）。
 *
 * ⚠️新種の異常値: **finalPassers>quota**が7件（合格ボーダー同点者の全員合格と推測・
 * chiba/saitama/ibarakiで確認済みの既知パターンと同型）: 横浜立野(278→279)・湘南(359→360)・
 * 藤沢西(318→319)・海老名(398→399)・綾瀬(318→319)・伊志田(308→311)・上溝(238→242)。
 * 超過量は+1が5件・+3(伊志田)/+4(上溝)が各1件。
 * finalPassers>applicantsConfirmedとなるレコードは0件（他県と異なりこのパターンは今回
 * 出現しなかった）。
 *
 * 🔁**sheet2「専門学科」を追加（33レコード・累計129レコード）**: sheet2は農業/工業/商業/水産/
 * 家庭/福祉/理数/体育/美術/国際の10区分に分かれ、各区分見出し行の直後に列見出しが繰り返される
 * （sheet1と同一の列位置＝学校名C列・学科名D列・募集定員E列・計F列・合格者数K列）。
 * **既存パイプラインとの粒度差の発見**: 本資料は学校×学科（例:平塚農商「都市農業科」
 * 「都市環境科」「食品科学科」「農業総合科」の4学科）まで分解して掲載するが、`competition-
 * rates/kanagawa.ts`は学校×区分（例:平塚農商「農業科」1件のみ・quota152=4学科の合計）という
 * 粗い粒度で収録している。段階台帳は既存パイプラインとの突合を設計の柱とするため、本資料側も
 * 学校が複数学科を持つ場合は資料内に印字済みの「計」行（学校単位の小計・quota/testTakers/
 * finalPassersとも印字済み）を1レコードとして採用し、単一学科の学校（例:海洋科学「水産科」）は
 * その1行をそのまま採用した（33レコード=農業3・工業10・商業7・水産1・家庭1・福祉4・理数1・
 * 体育2・美術2・国際2）。quotaは33件全数が既存パイプラインと完全一致。
 * 10区分中7区分（農業/工業/商業/福祉/体育/美術/国際）は資料本文に区分ごとの「合計」行があり、
 * 該当区分のレコード集計がquota/testTakersConfirmed/finalPassersの3系列とも完全一致
 * （水産・家庭・理数は学校数が1のため区分合計行が印字されず、該当レコード自体が区分合計と
 * 同値）。⚠️新種の異常値: finalPassers>quotaが3件（相原・農業科114→115、相原・商業科
 * 118→119、神奈川工業・工業科312→319）。神奈川工業の+7は4学科の「計」行への集約のため、
 * 単一の同点者事象でなく複数学科それぞれの小さな超過（各学科の合格ボーダー同点者）が積算
 * された結果と推測される。finalPassers>applicantsConfirmedは0件（sheet1と同様に今回は
 * 不出現）。
 *
 * 🔁**sheet3「単位制」を追加（35レコード・累計164レコード）**: sheet3は「１ 一般募集共通選抜
 * 合格状況」内に13の見出し区分（普通科／普通科専門コース／総合学科〈クリエイティブ除く〉／
 * 総合学科クリエイティブスクール／専門学科〈農業・家庭・理数・体育・音楽・美術・国際関係・
 * 総合産業・舞台芸術〉）を持ち、末尾に別スコープの「２ 連携募集合格状況」（光陵・愛川の連携型
 * 入学者選抜・quota85）を持つ。列位置はsheet1/2と同一。
 * **既存パイプラインの学科ラベルが「◯◯科（単位制）」というsuffix付きで、同じ学校名でも
 * 全日制の「◯◯科」とは別レコードとして扱われている**ことを確認したうえで転記（例:相模原弥栄は
 * 普通科・体育科・音楽科・美術科の4区分すべてに単位制で登場する）。sheet2と同様、複数学科を
 * 持つ学校は資料内の学校単位「計」行を採用（神奈川総合〈普通科個性化+国際文化2コース→計208〉・
 * 吉田島〈農業科3学科→計114〉・横浜国際〈国際科+国際科国際バカロレアコース→計159〉）。
 * ⚠️**唯一の例外**: 横浜市立戸塚は「普通科専門コース」区分で音楽コース（quota39）が独立して
 * 掲載されるが、既存パイプラインは一般コース（quota279・「普通科（単位制・一般コース）」）と
 * 音楽コース（「普通科（単位制・音楽コース）」）を別学科として扱うため、本ファイルでも「普通科」
 * 区分の一般コース行とは別レコードとして両方を独立収録した（合算しない）。
 * quotaは35件全数が既存パイプラインと完全一致。単位制普通科（16校）・総合学科〈クリエイティブ
 * 除く〉（7校）・専門学科農業（2校）の3区分は資料本文に区分ごとの「合計」行があり、
 * quota/testTakersConfirmed/finalPassersの3系列とも完全一致（他10区分は学校数1のため区分
 * 合計行が印字されない）。⚠️新種の異常値: finalPassers>quotaが3件（藤沢総合・総合学科
 * 268→269、相模原弥栄・体育科78→80、横浜国際・国際科159→160）。finalPassers>
 * applicantsConfirmedは0件（他区分と同様に今回も不出現）。
 * ⚠️スコープ外: 「２ 連携募集合格状況」（光陵・愛川、quota85）は連携型入学者選抜のため対象外
 * （ibaraki.ts等の既存stage-ledgerファイルの「連携型入学者選抜はスコープ外」という規律を踏襲）。
 *
 * ⚠️スコープ: 定時制/通信制・特別募集等（sheet4〜5）は別セッションで横展開する。
 */

export const KANAGAWA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'kanagawa',
  sources: [
    {
      url: 'https://www.pref.kanagawa.jp/documents/132524/bessi4.xlsx',
      docTitle: '神奈川県教育委員会 令和8年度神奈川県公立高等学校入学者選抜一般募集共通選抜等合格状況（各学校別の合格の状況等）別紙4 sheet1「普通科・クリエイティブ」＋sheet2「専門学科」＋sheet3「単位制」',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '普通科（共通選抜・県立87校＋市立5校＝92レコード）',
      '普通科（クリエイティブスクール・県立4校＝4レコード）',
      '専門学科（農業3・工業10・商業7・水産1・家庭1・福祉4・理数1・体育2・美術2・国際2＝33レコード）',
      '単位制（普通科16・普通科音楽コース1・総合学科7・総合学科クリエイティブ1・専門学科農業2・家庭1・理数1・体育1・音楽1・美術1・国際関係1・総合産業1・舞台芸術1＝35レコード）',
    ],
    pendingDepartments: [
      '定時制・通信制（sheet4）',
      '特別募集等（sheet5）',
    ],
    note: '「普通科」区分（共通選抜92校＋クリエイティブスクール4校＝96レコード）＋「専門学科」区分（10区分33レコード）＋「単位制」区分（13区分35レコード）を完全収録し累計164レコード。quotaは既存competition-rates/kanagawa.tsと全164件で完全一致（募集人員は試験日まで不変であることを確認）。applicantsConfirmedも既存パイプラインをそのまま再利用（本資料には志願者数列が存在しないため）。testTakersConfirmed/finalPassersのみ本資料から新規転記。普通科は資料本文の4段階の公式小計、専門学科は7/10区分、単位制は3/13区分の公式小計（学校数1の区分は区分合計行が印字されず該当レコード自体が区分合計と同値）と、いずれもquota/testTakersConfirmed/finalPassersの3系列すべてで完全一致。finalPassers>quotaが普通科7件・専門学科3件・単位制3件の計13件（既知パターン）。「連携募集合格状況」（連携型入学者選抜・光陵/愛川）はスコープ外。定時制/通信制・特別募集等（sheet4〜5）は未着手。',
  },
  officialSubtotals: [
    { label: '県立計（普通科・共通選抜）', quota: 26045, applicantsConfirmed: 30122, testTakersConfirmed: 29656, finalPassers: 25173 },
    { label: '市立計（普通科・共通選抜）', quota: 1230, applicantsConfirmed: 1603, testTakersConfirmed: 1572, finalPassers: 1230 },
    { label: '合計（普通科・共通選抜）', quota: 27275, applicantsConfirmed: 31725, testTakersConfirmed: 31228, finalPassers: 26403 },
    { label: '合計（普通科クリエイティブスクール）', quota: 672, applicantsConfirmed: 525, testTakersConfirmed: 520, finalPassers: 520 },
    { label: '合計（専門学科・農業）', quota: 460, applicantsConfirmed: 488, testTakersConfirmed: 486, finalPassers: 446 },
    { label: '合計（専門学科・工業）', quota: 2181, applicantsConfirmed: 1874, testTakersConfirmed: 1855, finalPassers: 1810 },
    { label: '合計（専門学科・商業）', quota: 1026, applicantsConfirmed: 1078, testTakersConfirmed: 1073, finalPassers: 969 },
    { label: '合計（専門学科・福祉）', quota: 193, applicantsConfirmed: 128, testTakersConfirmed: 127, finalPassers: 126 },
    { label: '合計（専門学科・体育）', quota: 77, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 77 },
    { label: '合計（専門学科・美術）', quota: 76, applicantsConfirmed: 82, testTakersConfirmed: 81, finalPassers: 72 },
    { label: '合計（専門学科・国際）', quota: 74, applicantsConfirmed: 102, testTakersConfirmed: 101, finalPassers: 74 },
    { label: '合計（単位制・普通科）', quota: 4097, applicantsConfirmed: 4204, testTakersConfirmed: 4136, finalPassers: 3715 },
    { label: '合計（単位制・総合学科）', quota: 1859, applicantsConfirmed: 2011, testTakersConfirmed: 1993, finalPassers: 1815 },
    { label: '合計（単位制・専門学科農業）', quota: 152, applicantsConfirmed: 105, testTakersConfirmed: 103, finalPassers: 104 },
  ],
  records: [
    { schoolName: '鶴見', department: '普通科', quota: 318, applicantsConfirmed: 381, testTakersConfirmed: 373, finalPassers: 318 },
    { schoolName: '横浜翠嵐', department: '普通科', quota: 359, applicantsConfirmed: 736, testTakersConfirmed: 714, finalPassers: 359 },
    { schoolName: '城郷', department: '普通科', quota: 238, applicantsConfirmed: 277, testTakersConfirmed: 271, finalPassers: 238 },
    { schoolName: '港北', department: '普通科', quota: 358, applicantsConfirmed: 478, testTakersConfirmed: 464, finalPassers: 358 },
    { schoolName: '新羽', department: '普通科', quota: 398, applicantsConfirmed: 450, testTakersConfirmed: 439, finalPassers: 398 },
    { schoolName: '岸根', department: '普通科', quota: 318, applicantsConfirmed: 427, testTakersConfirmed: 423, finalPassers: 318 },
    { schoolName: '霧が丘', department: '普通科', quota: 318, applicantsConfirmed: 339, testTakersConfirmed: 331, finalPassers: 318 },
    { schoolName: '白山', department: '普通科', quota: 238, applicantsConfirmed: 224, testTakersConfirmed: 222, finalPassers: 221 },
    { schoolName: '市ケ尾', department: '普通科', quota: 398, applicantsConfirmed: 515, testTakersConfirmed: 501, finalPassers: 398 },
    { schoolName: '元石川', department: '普通科', quota: 358, applicantsConfirmed: 432, testTakersConfirmed: 426, finalPassers: 358 },
    { schoolName: '川和', department: '普通科', quota: 359, applicantsConfirmed: 452, testTakersConfirmed: 434, finalPassers: 359 },
    { schoolName: '荏田', department: '普通科', quota: 398, applicantsConfirmed: 473, testTakersConfirmed: 459, finalPassers: 398 },
    { schoolName: '新栄', department: '普通科', quota: 346, applicantsConfirmed: 359, testTakersConfirmed: 351, finalPassers: 346 },
    { schoolName: '希望ケ丘', department: '普通科', quota: 359, applicantsConfirmed: 527, testTakersConfirmed: 516, finalPassers: 359 },
    { schoolName: '二俣川', department: '普通科', quota: 118, applicantsConfirmed: 94, testTakersConfirmed: 92, finalPassers: 91 },
    { schoolName: '旭', department: '普通科', quota: 318, applicantsConfirmed: 326, testTakersConfirmed: 322, finalPassers: 318 },
    { schoolName: '松陽', department: '普通科', quota: 318, applicantsConfirmed: 410, testTakersConfirmed: 406, finalPassers: 318 },
    { schoolName: '横浜瀬谷', department: '普通科', quota: 318, applicantsConfirmed: 378, testTakersConfirmed: 373, finalPassers: 318 },
    { schoolName: '横浜平沼', department: '普通科', quota: 319, applicantsConfirmed: 443, testTakersConfirmed: 434, finalPassers: 319 },
    { schoolName: '光陵', department: '普通科', quota: 279, applicantsConfirmed: 380, testTakersConfirmed: 377, finalPassers: 279 },
    { schoolName: '保土ケ谷', department: '普通科', quota: 238, applicantsConfirmed: 249, testTakersConfirmed: 246, finalPassers: 238 },
    { schoolName: '舞岡', department: '普通科', quota: 358, applicantsConfirmed: 364, testTakersConfirmed: 358, finalPassers: 356 },
    { schoolName: '上矢部', department: '普通科', quota: 238, applicantsConfirmed: 243, testTakersConfirmed: 241, finalPassers: 238 },
    { schoolName: '金井', department: '普通科', quota: 318, applicantsConfirmed: 358, testTakersConfirmed: 353, finalPassers: 318 },
    { schoolName: '横浜南陵', department: '普通科', quota: 238, applicantsConfirmed: 272, testTakersConfirmed: 267, finalPassers: 238 },
    { schoolName: '柏陽', department: '普通科', quota: 319, applicantsConfirmed: 503, testTakersConfirmed: 490, finalPassers: 319 },
    { schoolName: '横浜緑ケ丘', department: '普通科', quota: 279, applicantsConfirmed: 433, testTakersConfirmed: 426, finalPassers: 279 },
    { schoolName: '横浜立野', department: '普通科', quota: 278, applicantsConfirmed: 336, testTakersConfirmed: 330, finalPassers: 279 },
    { schoolName: '横浜氷取沢', department: '普通科', quota: 358, applicantsConfirmed: 428, testTakersConfirmed: 424, finalPassers: 358 },
    { schoolName: '新城', department: '普通科', quota: 268, applicantsConfirmed: 440, testTakersConfirmed: 423, finalPassers: 268 },
    { schoolName: '住吉', department: '普通科', quota: 358, applicantsConfirmed: 440, testTakersConfirmed: 434, finalPassers: 358 },
    { schoolName: '川崎北', department: '普通科', quota: 278, applicantsConfirmed: 255, testTakersConfirmed: 251, finalPassers: 251 },
    { schoolName: '多摩', department: '普通科', quota: 279, applicantsConfirmed: 491, testTakersConfirmed: 466, finalPassers: 279 },
    { schoolName: '生田', department: '普通科', quota: 398, applicantsConfirmed: 470, testTakersConfirmed: 446, finalPassers: 398 },
    { schoolName: '百合丘', department: '普通科', quota: 398, applicantsConfirmed: 384, testTakersConfirmed: 381, finalPassers: 378 },
    { schoolName: '生田東', department: '普通科', quota: 318, applicantsConfirmed: 335, testTakersConfirmed: 329, finalPassers: 318 },
    { schoolName: '菅', department: '普通科', quota: 278, applicantsConfirmed: 162, testTakersConfirmed: 162, finalPassers: 161 },
    { schoolName: '麻生', department: '普通科', quota: 318, applicantsConfirmed: 318, testTakersConfirmed: 310, finalPassers: 308 },
    { schoolName: '横須賀', department: '普通科', quota: 279, applicantsConfirmed: 348, testTakersConfirmed: 346, finalPassers: 279 },
    { schoolName: '横須賀大津', department: '普通科', quota: 278, applicantsConfirmed: 321, testTakersConfirmed: 320, finalPassers: 278 },
    { schoolName: '追浜', department: '普通科', quota: 318, applicantsConfirmed: 349, testTakersConfirmed: 348, finalPassers: 318 },
    { schoolName: '津久井浜', department: '普通科', quota: 238, applicantsConfirmed: 281, testTakersConfirmed: 279, finalPassers: 238 },
    { schoolName: '逗子葉山', department: '普通科', quota: 318, applicantsConfirmed: 364, testTakersConfirmed: 362, finalPassers: 318 },
    { schoolName: '鎌倉', department: '普通科', quota: 359, applicantsConfirmed: 441, testTakersConfirmed: 433, finalPassers: 359 },
    { schoolName: '七里ガ浜', department: '普通科', quota: 358, applicantsConfirmed: 529, testTakersConfirmed: 524, finalPassers: 358 },
    { schoolName: '大船', department: '普通科', quota: 398, applicantsConfirmed: 471, testTakersConfirmed: 468, finalPassers: 398 },
    { schoolName: '湘南', department: '普通科', quota: 359, applicantsConfirmed: 593, testTakersConfirmed: 567, finalPassers: 360 },
    { schoolName: '藤沢西', department: '普通科', quota: 318, applicantsConfirmed: 379, testTakersConfirmed: 378, finalPassers: 319 },
    { schoolName: '湘南台', department: '普通科', quota: 238, applicantsConfirmed: 273, testTakersConfirmed: 272, finalPassers: 238 },
    { schoolName: '茅ケ崎', department: '普通科', quota: 278, applicantsConfirmed: 337, testTakersConfirmed: 336, finalPassers: 278 },
    { schoolName: '茅ケ崎北陵', department: '普通科', quota: 279, applicantsConfirmed: 371, testTakersConfirmed: 367, finalPassers: 279 },
    { schoolName: '鶴嶺', department: '普通科', quota: 383, applicantsConfirmed: 438, testTakersConfirmed: 436, finalPassers: 383 },
    { schoolName: '茅ケ崎西浜', department: '普通科', quota: 358, applicantsConfirmed: 371, testTakersConfirmed: 368, finalPassers: 358 },
    { schoolName: '寒川', department: '普通科', quota: 238, applicantsConfirmed: 132, testTakersConfirmed: 131, finalPassers: 130 },
    { schoolName: '平塚江南', department: '普通科', quota: 319, applicantsConfirmed: 374, testTakersConfirmed: 367, finalPassers: 319 },
    { schoolName: '高浜', department: '普通科', quota: 228, applicantsConfirmed: 249, testTakersConfirmed: 247, finalPassers: 228 },
    { schoolName: '大磯', department: '普通科', quota: 278, applicantsConfirmed: 346, testTakersConfirmed: 344, finalPassers: 278 },
    { schoolName: '二宮', department: '普通科', quota: 238, applicantsConfirmed: 84, testTakersConfirmed: 83, finalPassers: 82 },
    { schoolName: '秦野', department: '普通科', quota: 358, applicantsConfirmed: 414, testTakersConfirmed: 408, finalPassers: 358 },
    { schoolName: '秦野曽屋', department: '普通科', quota: 278, applicantsConfirmed: 247, testTakersConfirmed: 247, finalPassers: 247 },
    { schoolName: '伊勢原', department: '普通科', quota: 228, applicantsConfirmed: 255, testTakersConfirmed: 253, finalPassers: 228 },
    { schoolName: '伊志田', department: '普通科', quota: 308, applicantsConfirmed: 331, testTakersConfirmed: 331, finalPassers: 311 },
    { schoolName: '小田原東', department: '普通科', quota: 118, applicantsConfirmed: 67, testTakersConfirmed: 67, finalPassers: 67 },
    { schoolName: '西湘', department: '普通科', quota: 348, applicantsConfirmed: 340, testTakersConfirmed: 339, finalPassers: 338 },
    { schoolName: '足柄', department: '普通科', quota: 238, applicantsConfirmed: 239, testTakersConfirmed: 238, finalPassers: 237 },
    { schoolName: '山北', department: '普通科', quota: 198, applicantsConfirmed: 153, testTakersConfirmed: 153, finalPassers: 153 },
    { schoolName: '厚木', department: '普通科', quota: 359, applicantsConfirmed: 450, testTakersConfirmed: 443, finalPassers: 359 },
    { schoolName: '厚木王子', department: '普通科', quota: 198, applicantsConfirmed: 214, testTakersConfirmed: 214, finalPassers: 198 },
    { schoolName: '厚木北', department: '普通科', quota: 238, applicantsConfirmed: 253, testTakersConfirmed: 252, finalPassers: 238 },
    { schoolName: '厚木西', department: '普通科', quota: 238, applicantsConfirmed: 204, testTakersConfirmed: 203, finalPassers: 203 },
    { schoolName: '海老名', department: '普通科', quota: 398, applicantsConfirmed: 473, testTakersConfirmed: 467, finalPassers: 399 },
    { schoolName: '有馬', department: '普通科', quota: 318, applicantsConfirmed: 345, testTakersConfirmed: 344, finalPassers: 318 },
    { schoolName: '愛川', department: '普通科', quota: 178, applicantsConfirmed: 97, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '大和', department: '普通科', quota: 279, applicantsConfirmed: 379, testTakersConfirmed: 368, finalPassers: 279 },
    { schoolName: '大和南', department: '普通科', quota: 308, applicantsConfirmed: 307, testTakersConfirmed: 307, finalPassers: 307 },
    { schoolName: '大和西', department: '普通科', quota: 278, applicantsConfirmed: 321, testTakersConfirmed: 318, finalPassers: 278 },
    { schoolName: '座間', department: '普通科', quota: 318, applicantsConfirmed: 421, testTakersConfirmed: 419, finalPassers: 318 },
    { schoolName: '綾瀬', department: '普通科', quota: 318, applicantsConfirmed: 324, testTakersConfirmed: 321, finalPassers: 319 },
    { schoolName: '綾瀬西', department: '普通科', quota: 318, applicantsConfirmed: 288, testTakersConfirmed: 288, finalPassers: 286 },
    { schoolName: '麻溝台', department: '普通科', quota: 358, applicantsConfirmed: 419, testTakersConfirmed: 414, finalPassers: 358 },
    { schoolName: '上鶴間', department: '普通科', quota: 278, applicantsConfirmed: 287, testTakersConfirmed: 285, finalPassers: 278 },
    { schoolName: '上溝', department: '普通科', quota: 238, applicantsConfirmed: 278, testTakersConfirmed: 276, finalPassers: 242 },
    { schoolName: '相模原', department: '普通科', quota: 279, applicantsConfirmed: 360, testTakersConfirmed: 350, finalPassers: 279 },
    { schoolName: '上溝南', department: '普通科', quota: 358, applicantsConfirmed: 383, testTakersConfirmed: 379, finalPassers: 358 },
    { schoolName: '橋本', department: '普通科', quota: 268, applicantsConfirmed: 314, testTakersConfirmed: 311, finalPassers: 268 },
    { schoolName: '相模田名', department: '普通科', quota: 278, applicantsConfirmed: 267, testTakersConfirmed: 266, finalPassers: 266 },
    { schoolName: '津久井', department: '普通科', quota: 158, applicantsConfirmed: 59, testTakersConfirmed: 59, finalPassers: 59 },
    { schoolName: '横浜市立桜丘', department: '普通科', quota: 318, applicantsConfirmed: 390, testTakersConfirmed: 383, finalPassers: 318 },
    { schoolName: '横浜市立金沢', department: '普通科', quota: 318, applicantsConfirmed: 413, testTakersConfirmed: 408, finalPassers: 318 },
    { schoolName: '川崎市立橘', department: '普通科', quota: 198, applicantsConfirmed: 286, testTakersConfirmed: 279, finalPassers: 198 },
    { schoolName: '川崎市立高津', department: '普通科', quota: 278, applicantsConfirmed: 349, testTakersConfirmed: 342, finalPassers: 278 },
    { schoolName: '川崎市立幸', department: '普通科', quota: 118, applicantsConfirmed: 165, testTakersConfirmed: 160, finalPassers: 118 },
    { schoolName: '釜利谷', department: '普通科（クリエイティブスクール）', quota: 238, applicantsConfirmed: 113, testTakersConfirmed: 111, finalPassers: 111 },
    { schoolName: '横須賀南', department: '普通科（クリエイティブスクール）', quota: 118, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 115 },
    { schoolName: '小田原北', department: '普通科（クリエイティブスクール）', quota: 78, applicantsConfirmed: 73, testTakersConfirmed: 73, finalPassers: 73 },
    { schoolName: '大和東', department: '普通科（クリエイティブスクール）', quota: 238, applicantsConfirmed: 224, testTakersConfirmed: 221, finalPassers: 221 },
    { schoolName: '平塚農商', department: '農業科', quota: 152, applicantsConfirmed: 168, testTakersConfirmed: 168, finalPassers: 152 },
    { schoolName: '相原', department: '農業科', quota: 114, applicantsConfirmed: 138, testTakersConfirmed: 138, finalPassers: 115 },
    { schoolName: '中央農業', department: '農業科', quota: 194, applicantsConfirmed: 182, testTakersConfirmed: 180, finalPassers: 179 },
    { schoolName: '神奈川工業', department: '工業科', quota: 312, applicantsConfirmed: 354, testTakersConfirmed: 348, finalPassers: 319 },
    { schoolName: '商工', department: '工業科', quota: 118, applicantsConfirmed: 102, testTakersConfirmed: 102, finalPassers: 102 },
    { schoolName: '磯子工業', department: '工業科', quota: 224, applicantsConfirmed: 212, testTakersConfirmed: 210, finalPassers: 207 },
    { schoolName: '川崎工科', department: '工業科', quota: 238, applicantsConfirmed: 248, testTakersConfirmed: 246, finalPassers: 238 },
    { schoolName: '向の岡工業', department: '工業科', quota: 234, applicantsConfirmed: 181, testTakersConfirmed: 181, finalPassers: 181 },
    { schoolName: '横須賀工業', department: '工業科', quota: 232, applicantsConfirmed: 179, testTakersConfirmed: 179, finalPassers: 179 },
    { schoolName: '平塚工科', department: '工業科', quota: 238, applicantsConfirmed: 127, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '藤沢工科', department: '工業科', quota: 238, applicantsConfirmed: 161, testTakersConfirmed: 159, finalPassers: 158 },
    { schoolName: '小田原北', department: '工業科', quota: 152, applicantsConfirmed: 117, testTakersConfirmed: 117, finalPassers: 116 },
    { schoolName: '川崎市立川崎総合科学', department: '工業科', quota: 195, applicantsConfirmed: 193, testTakersConfirmed: 186, finalPassers: 183 },
    { schoolName: '商工', department: '商業科', quota: 118, applicantsConfirmed: 106, testTakersConfirmed: 105, finalPassers: 105 },
    { schoolName: '平塚農商', department: '商業科', quota: 158, applicantsConfirmed: 164, testTakersConfirmed: 164, finalPassers: 158 },
    { schoolName: '小田原東', department: '商業科', quota: 118, applicantsConfirmed: 75, testTakersConfirmed: 74, finalPassers: 73 },
    { schoolName: '相原', department: '商業科', quota: 118, applicantsConfirmed: 136, testTakersConfirmed: 136, finalPassers: 119 },
    { schoolName: '厚木王子', department: '商業科', quota: 158, applicantsConfirmed: 184, testTakersConfirmed: 184, finalPassers: 158 },
    { schoolName: '横浜市立横浜商業', department: '商業科', quota: 238, applicantsConfirmed: 274, testTakersConfirmed: 272, finalPassers: 238 },
    { schoolName: '川崎市立幸', department: '商業科', quota: 118, applicantsConfirmed: 139, testTakersConfirmed: 138, finalPassers: 118 },
    { schoolName: '海洋科学', department: '水産科', quota: 152, applicantsConfirmed: 141, testTakersConfirmed: 140, finalPassers: 135 },
    { schoolName: '川崎市立川崎', department: '家庭科', quota: 39, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 30 },
    { schoolName: '二俣川', department: '福祉科', quota: 38, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '横須賀南', department: '福祉科', quota: 78, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 46 },
    { schoolName: '津久井', department: '福祉科', quota: 38, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '川崎市立川崎', department: '福祉科', quota: 39, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '川崎市立川崎総合科学', department: '理数科', quota: 39, applicantsConfirmed: 53, testTakersConfirmed: 51, finalPassers: 39 },
    { schoolName: '厚木北', department: '体育科', quota: 38, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 38 },
    { schoolName: '川崎市立橘', department: '体育科', quota: 39, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 39 },
    { schoolName: '白山', department: '美術科', quota: 38, applicantsConfirmed: 35, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '上矢部', department: '美術科', quota: 38, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 38 },
    { schoolName: '横浜市立横浜商業', department: '国際科', quota: 35, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 35 },
    { schoolName: '川崎市立橘', department: '国際科', quota: 39, applicantsConfirmed: 50, testTakersConfirmed: 49, finalPassers: 39 },
    { schoolName: '神奈川総合', department: '普通科（単位制）', quota: 208, applicantsConfirmed: 320, testTakersConfirmed: 311, finalPassers: 208 },
    { schoolName: '横浜緑園', department: '普通科（単位制）', quota: 278, applicantsConfirmed: 262, testTakersConfirmed: 257, finalPassers: 257 },
    { schoolName: '横浜桜陽', department: '普通科（単位制）', quota: 270, applicantsConfirmed: 191, testTakersConfirmed: 185, finalPassers: 185 },
    { schoolName: '横浜清陵', department: '普通科（単位制）', quota: 305, applicantsConfirmed: 332, testTakersConfirmed: 330, finalPassers: 305 },
    { schoolName: '横浜栄', department: '普通科（単位制）', quota: 318, applicantsConfirmed: 382, testTakersConfirmed: 378, finalPassers: 318 },
    { schoolName: '川崎', department: '普通科（単位制）', quota: 222, applicantsConfirmed: 284, testTakersConfirmed: 281, finalPassers: 222 },
    { schoolName: '大師', department: '普通科（単位制）', quota: 225, applicantsConfirmed: 150, testTakersConfirmed: 147, finalPassers: 147 },
    { schoolName: '三浦初声', department: '普通科（単位制）', quota: 198, applicantsConfirmed: 86, testTakersConfirmed: 85, finalPassers: 85 },
    { schoolName: '藤沢清流', department: '普通科（単位制）', quota: 278, applicantsConfirmed: 303, testTakersConfirmed: 296, finalPassers: 278 },
    { schoolName: '平塚湘風', department: '普通科（単位制）', quota: 238, applicantsConfirmed: 170, testTakersConfirmed: 169, finalPassers: 169 },
    { schoolName: '小田原', department: '普通科（単位制）', quota: 319, applicantsConfirmed: 371, testTakersConfirmed: 366, finalPassers: 319 },
    { schoolName: '厚木清南', department: '普通科（単位制）', quota: 230, applicantsConfirmed: 234, testTakersConfirmed: 232, finalPassers: 230 },
    { schoolName: '相模原城山', department: '普通科（単位制）', quota: 278, applicantsConfirmed: 263, testTakersConfirmed: 262, finalPassers: 262 },
    { schoolName: '相模原弥栄', department: '普通科（単位制）', quota: 183, applicantsConfirmed: 191, testTakersConfirmed: 188, finalPassers: 183 },
    { schoolName: '横浜市立東', department: '普通科（単位制）', quota: 268, applicantsConfirmed: 324, testTakersConfirmed: 313, finalPassers: 268 },
    { schoolName: '横浜市立戸塚', department: '普通科（単位制・一般コース）', quota: 279, applicantsConfirmed: 341, testTakersConfirmed: 336, finalPassers: 279 },
    { schoolName: '横浜市立戸塚', department: '普通科（単位制・音楽コース）', quota: 39, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 39 },
    { schoolName: '鶴見総合', department: '総合学科（単位制）', quota: 259, applicantsConfirmed: 302, testTakersConfirmed: 296, finalPassers: 259 },
    { schoolName: '金沢総合', department: '総合学科（単位制）', quota: 278, applicantsConfirmed: 316, testTakersConfirmed: 311, finalPassers: 278 },
    { schoolName: '藤沢総合', department: '総合学科（単位制）', quota: 268, applicantsConfirmed: 320, testTakersConfirmed: 318, finalPassers: 269 },
    { schoolName: '秦野総合', department: '総合学科（単位制）', quota: 238, applicantsConfirmed: 198, testTakersConfirmed: 197, finalPassers: 197 },
    { schoolName: '座間総合', department: '総合学科（単位制）', quota: 264, applicantsConfirmed: 261, testTakersConfirmed: 260, finalPassers: 260 },
    { schoolName: '横浜市立みなと総合', department: '総合学科（単位制）', quota: 232, applicantsConfirmed: 250, testTakersConfirmed: 248, finalPassers: 232 },
    { schoolName: '横須賀市立横須賀総合', department: '総合学科（単位制）', quota: 320, applicantsConfirmed: 364, testTakersConfirmed: 363, finalPassers: 320 },
    { schoolName: '青葉総合', department: '総合学科（単位制・クリエイティブスクール）', quota: 158, applicantsConfirmed: 143, testTakersConfirmed: 138, finalPassers: 138 },
    { schoolName: '三浦初声', department: '農業科（単位制）', quota: 38, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '吉田島', department: '農業科（単位制）', quota: 114, applicantsConfirmed: 79, testTakersConfirmed: 77, finalPassers: 78 },
    { schoolName: '吉田島', department: '家庭科（単位制）', quota: 38, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '横浜サイエンスフロンティア', department: '理数科（単位制）', quota: 158, applicantsConfirmed: 255, testTakersConfirmed: 244, finalPassers: 158 },
    { schoolName: '相模原弥栄', department: '体育科（単位制）', quota: 78, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 80 },
    { schoolName: '相模原弥栄', department: '音楽科（単位制）', quota: 38, applicantsConfirmed: 45, testTakersConfirmed: 43, finalPassers: 38 },
    { schoolName: '相模原弥栄', department: '美術科（単位制）', quota: 38, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 38 },
    { schoolName: '横浜国際', department: '国際科（単位制）', quota: 159, applicantsConfirmed: 190, testTakersConfirmed: 183, finalPassers: 160 },
    { schoolName: '神奈川総合産業', department: '総合産業科（単位制）', quota: 238, applicantsConfirmed: 218, testTakersConfirmed: 217, finalPassers: 213 },
    { schoolName: '神奈川総合', department: '舞台芸術科（単位制）', quota: 30, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 30 },
  ],
};
