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
