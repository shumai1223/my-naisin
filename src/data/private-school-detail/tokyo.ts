/**
 * 東京都私立高等学校の募集定員データ(Λ-5大都市圏5県の最後・北海道除く残り最後の1都)。
 * (株)育伸社「2026年度 国立高校・高専・私立高校 募集要項【東京都】」(2025年11月4日現在)を
 * Read toolでPDF原本を直接解析。参照台帳241校と規模が極めて大きいため複数周回に分けて
 * 処理する方針(千葉/兵庫/大阪/神奈川と同様、東京はさらに規模が大きい)。
 * **重要な発見(2026-07-31)**: このPDFは20頁あり、Read toolに一括で渡すと「too many pages」
 * エラーになるが、pagesパラメータで"1-10"のように範囲指定すると正常に読める(poppler未導入
 * によりpages指定が失敗するという既存の教訓[[fable5-loop-protocol]]は、13頁超のPDF全てに
 * 一律に適用されるわけではないと判明。少なくともこのPDFでは10頁単位のchunk読み込みが機能した)。
 * これにより東京都の20頁PDFも複数回のchunk読み込みで最終的に全頁処理できる見込み。
 * 1頁目は明確に読み取れた2校のみを収録(愛国・青山学院)。国立
 * (筑波大学附属駒場・お茶の水女子大学附属・東京藝術大学附属音楽・東京科学大学附属科学技術・
 * 筑波大学附属・東京学芸大学附属)・高専(東京工業高専・都立産業技術高専・私立サレジオ工業高専)
 * は私立高校マスターに含まれないため対象外。足立学園・安部学院は「推薦」ブロックと「一般」
 * ブロックが別枠なのか同一クォータの共有(↓)なのか原資料のみでは確証が持てず(愛国のような
 * 単一ブロック内の↓共有と、ブロック跨ぎの再掲が混在しているように見えるため)、誤帰属を避け
 * るため今回は見送り、次回別途官報方式で確認する。
 * **2頁目(2026-07-31追記)**: 岩倉(7限制100+6限制200+運輸120=420)・英明フロンティア
 * (αコース10+フロンティアコース120=130)・江戸川女子(Ⅱ類50+Ⅲ類50+国際英語25=125、帰国は
 * いずれも若干名のため未算入)の3校は単一の↓共有クォータブロックで明瞭だったため収録。
 * 郁文館・郁文館グローバルは「単願推薦60(shared)」とは別に「国立選抜・iP計20」「オープン10」
 * のように同一ラベルで異なる数値が並ぶ、または特進クラス/進学クラスの2コースにまたがって
 * 併優一般枠の数値ラベルが重複する(=学校またぎの共有クォータの可能性)複雑な構造で、原資料の
 * 解像度だけでは合算方法の確証が持てないため今回は見送り。上野学園は特別進学コースα/β・総合
 * 進学コースの3コース(10+15+25=50)は明瞭だが、音楽コースは推薦・一般で異なる数値が並び
 * かつ器楽/声楽/演奏家で細分されており構造が読み切れないため、学校単位の総定員を歪めない
 * よう学校ごと保留(1コースだけ収録すると総定員を過小表示するリスクがあるため)。
 * **3頁目(2026-07-31追記)**: 桜美林(国公立20+特別進学30+進学130=180)・大森学園(特選20+
 * 選抜40+総進80+工業40=180)・開成(男、一般のみ100)・かえつ有明(一般10)・科学技術学園
 * (総合60+特進20=80)・学習院高等科(男、一般のみ約20)・神田女学園(グローバル25+アドバンスト
 * 25+キャリアデザイン50=100)・関東国際(普通60+外国語120=180)の8校は単一の↓共有クォータ
 * ブロックで明瞭だったため収録。川村は「A推薦20」「B推薦①10・B推薦②↓」「一般・併優①
 * 一般15・併優15」という3つの異なるブロックが並び、A/B推薦の加算可否および「一般15・併優15」
 * が別建て30なのか併願優遇が一般15の内数(合計15)なのかの解釈で2つの独立した曖昧さが重なり
 * 確証が持てないため今回は見送り。
 * **4頁目(2026-07-31追記)**: 解釈ルールを確立=「推薦ブロック(A/B推薦等が↓で内部共有)」の後に
 * 続けて「一般ブロック(一般①/②等が↓で内部共有)」が別の数値(または偶然同じ数値)で始まる場合、
 * 一般側は推薦側とは独立の加算対象クォータである(合算して学校/コースの総定員とする)。この解釈は
 * 錦城学園高等学校で「令和7年度=推薦120名・一般120名の合計240名」というWebSearch独立情報源
 * (3頁目時点では未反映)と本頁のikushinデータ(A推薦120・一般①120)が構造的に一致することで
 * 検証できた。この解釈ルールに基づき関東第一(ハイパー80+アドバンスト240+アグレッシブ200+
 * アスリート80=600)・北里大学附属順天(旧順天、理数25+英語25+特進40=90)・北豊島(女、
 * インスパイアリング40+グローバル50+バリュアブル50=140)・共栄学園(未来探究15+国際共生15+
 * 理数創造15+探究特進35+探究進学80=160)・共立女子第二(女、特別進学35+総合進学80+英語15=130)・
 * 錦城(特進120は一般のみ掲載+進学330=推薦130+一般200=450)・錦城学園(推薦120+一般120=240)の
 * 7校を新たに収録。このルール確立により、3頁目で見送った川村は次回この解釈で再訪する価値がある。
 * 残り7校はWebSearchで個別調査し完全中高一貫(高校からの外部募集なし)と確認できたためスキップ:
 * 暁星・大妻・雙葉・共立女子(2006年度に高校募集停止)・三輪田学園・女子学院・白百合学園。
 * いずれも「女子御三家(女子学院・雙葉)」「男子伝統校(暁星)」等の著名中高一貫校で、
 * 兵庫/京都/神奈川で確立した「難関進学校ほど高校募集を廃止している」パターンが東京でも
 * 強く再現している。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_TOKYO_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03913.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【東京都】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_TOKYO: PrivateSchoolDetailFile = {
  prefectureCode: 'tokyo',
  schools: [
    {
      schoolCode: 'D113312300011',
      schoolName: '愛国高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(A推薦・B/C推薦・一般共通枠)', capacity: 80 },
        { courseName: '商業(A推薦・B/C推薦・一般共通枠)', capacity: 40 },
        { courseName: '家政(A推薦・B/C推薦・一般共通枠)', capacity: 40 },
        { courseName: '衛生看護(A推薦・B/C推薦・一般共通枠)', capacity: 20 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311300013',
      schoolName: '青山学院高等部',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦、約)', capacity: 65 },
        { courseName: '普通(帰国、約)', capacity: 25 },
        { courseName: '普通(一般、約)', capacity: 70 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310600012',
      schoolName: '岩倉高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '7限制(A推薦・B推薦・一般①・一般②共通枠)', capacity: 100 },
        { courseName: '6限制(A推薦・B推薦・一般①・一般②共通枠)', capacity: 200 },
        { courseName: '運輸(A推薦・B推薦・一般①・一般②共通枠)', capacity: 120 },
      ],
      totalCapacity: 420,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312000023',
      schoolName: '英明フロンティア高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'フロンティアαコース(単願推薦・併願推薦・併優・一般共通枠)', capacity: 10 },
        { courseName: 'フロンティアコース(単願推薦・併願推薦・併優・一般共通枠)', capacity: 120 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312300020',
      schoolName: '江戸川女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Ⅱ類(A推薦・B推薦・一般①・一般②共通枠、普通科計。帰国は若干のため未算入)', capacity: 50 },
        { courseName: 'Ⅲ類(A推薦・B推薦・一般①・一般②共通枠、普通科計。帰国は若干のため未算入)', capacity: 50 },
        { courseName: '国際英語(A推薦・B推薦・一般①・一般②共通枠。帰国は若干のため未算入)', capacity: 25 },
      ],
      totalCapacity: 125,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320900036',
      schoolName: '桜美林高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国公立コース(推薦・併優・オープン共通枠)', capacity: 20 },
        { courseName: '特別進学コース(推薦・併優・オープン共通枠)', capacity: 30 },
        { courseName: '進学コース(推薦・併優・オープン共通枠)', capacity: 130 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311100024',
      schoolName: '大森学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特選コース(推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 20 },
        { courseName: '選抜コース(推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 40 },
        { courseName: '総進コース(推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 80 },
        { courseName: '工業(男、推薦Ⅰ・推薦Ⅱ・一般①②③共通枠)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311800018',
      schoolName: '開成高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般のみ掲載)', capacity: 100 }],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310800010',
      schoolName: 'かえつ有明高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(一般、帰国生を含む)', capacity: 10 }],
      totalCapacity: 10,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311200274',
      schoolName: '科学技術学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '総合コース(男、推薦・一般A日程①②・B日程共通枠)', capacity: 60 },
        { courseName: '特進コース(男、推薦・一般A日程・B日程共通枠)', capacity: 20 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311600010',
      schoolName: '学習院高等科',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般のみ掲載、約)', capacity: 20 }],
      totalCapacity: 20,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310100026',
      schoolName: '神田女学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバルコース(単願推薦・併願推薦・併願優遇・一般共通枠)', capacity: 25 },
        { courseName: 'アドバンストコース(単願推薦・併願推薦・併願優遇・一般共通枠)', capacity: 25 },
        { courseName: 'キャリアデザインコース(単願推薦・併願推薦・併願優遇・一般共通枠)', capacity: 50 },
      ],
      totalCapacity: 100,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311300022',
      schoolName: '関東国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦・一般①②③共通枠、一般③は外国人生徒を含む)', capacity: 60 },
        { courseName: '外国語(推薦・一般①②③共通枠)', capacity: 120 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312300039',
      schoolName: '関東第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'ハイパーコース(A推薦・B推薦・一般①②共通枠)', capacity: 80 },
        { courseName: 'アドバンストコース(A推薦・B推薦・一般①②共通枠)', capacity: 240 },
        { courseName: 'アグレッシブコース(A・C推薦・B推薦・一般①②共通枠)', capacity: 200 },
        { courseName: 'アスリートコース(男、A・C推薦のみ掲載)', capacity: 80 },
      ],
      totalCapacity: 600,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311700037',
      schoolName: '北里大学附属順天高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '理数選抜類型(推薦Ⅰ・Ⅱ共通枠。帰国①②は若干のため未算入)', capacity: 10 },
        { courseName: '理数選抜類型(一般①・②共通枠)', capacity: 15 },
        { courseName: '英語選抜類型(推薦Ⅰ・Ⅱ共通枠。帰国①②は若干のため未算入)', capacity: 10 },
        { courseName: '英語選抜類型(一般①・②共通枠)', capacity: 15 },
        { courseName: '特進選抜類型(推薦Ⅰ・Ⅱ共通枠。帰国①②は若干のため未算入)', capacity: 10 },
        { courseName: '特進選抜類型(一般①・②共通枠)', capacity: 30 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113311800027',
      schoolName: '北豊島高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'インスパイアリング・プログラム(女、推薦A・B共通枠)', capacity: 20 },
        { courseName: 'インスパイアリング・プログラム(女、一般)', capacity: 20 },
        { courseName: 'グローバル・プログラム(女、推薦A・B共通枠)', capacity: 25 },
        { courseName: 'グローバル・プログラム(女、一般)', capacity: 25 },
        { courseName: 'バリュアブル・プログラム(女、推薦A・B共通枠)', capacity: 25 },
        { courseName: 'バリュアブル・プログラム(女、一般)', capacity: 25 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113312200012',
      schoolName: '共栄学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '未来探究コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 15 },
        { courseName: '国際共生コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 15 },
        { courseName: '理数創造コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 15 },
        { courseName: '探究特進コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 35 },
        { courseName: '探究進学コース(A推薦・B推薦・一般・チャレンジ共通枠)', capacity: 80 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113320100089',
      schoolName: '共立女子第二高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース(女、推薦)', capacity: 20 },
        { courseName: '特別進学コース(女、一般①・②共通枠)', capacity: 15 },
        { courseName: '総合進学コース(女、推薦)', capacity: 50 },
        { courseName: '総合進学コース(女、一般①・②共通枠)', capacity: 30 },
        { courseName: '英語コース(女、推薦)', capacity: 10 },
        { courseName: '英語コース(女、一般①・②共通枠)', capacity: 5 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113321100014',
      schoolName: '錦城高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(一般①・②共通枠、推薦の掲載なし)', capacity: 120 },
        { courseName: '進学コース(推薦)', capacity: 130 },
        { courseName: '進学コース(一般)', capacity: 200 },
      ],
      totalCapacity: 450,
      source: IKUSHIN_TOKYO_SOURCE,
    },
    {
      schoolCode: 'D113310100053',
      schoolName: '錦城学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(A推薦・B推薦共通枠)', capacity: 120 },
        { courseName: '普通(一般①・②共通枠)', capacity: 120 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_TOKYO_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D113310100035',
      schoolName: '暁星高等学校',
      reason: '完全中高一貫校で高校からの外部募集を実施していないため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100017',
      schoolName: '大妻高等学校',
      reason: '完全中高一貫校で高校段階での外部からの入学募集を実施していないため(Wikipedia等の確認)',
    },
    {
      schoolCode: 'D113310100124',
      schoolName: '雙葉高等学校',
      reason: '女子御三家の一角で高校では生徒を募集しない完全中高一貫方式のため(Wikipedia等の確認)',
    },
    {
      schoolCode: 'D113310100044',
      schoolName: '共立女子高等学校',
      reason: '2006年度(平成18年度)に高校募集を停止し中高完全一貫としているため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100133',
      schoolName: '三輪田学園高等学校',
      reason: '高校からの外部募集を実施していないため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100151',
      schoolName: '女子学院高等学校',
      reason: '女子御三家の一角で完全中高一貫校のため高校からの入学を受け付けていないため(WebSearch要約による確認)',
    },
    {
      schoolCode: 'D113310100160',
      schoolName: '白百合学園高等学校',
      reason: '高校からの外部募集は行われておらず中学からの内進生のみのため(WebSearch要約による確認)',
    },
  ],
};
