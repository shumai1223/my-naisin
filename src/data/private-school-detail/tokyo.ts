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
 * 今回は1頁目のみを慎重に処理し、明確に読み取れた2校のみを収録(愛国・青山学院)。国立
 * (筑波大学附属駒場・お茶の水女子大学附属・東京藝術大学附属音楽・東京科学大学附属科学技術・
 * 筑波大学附属・東京学芸大学附属)・高専(東京工業高専・都立産業技術高専・私立サレジオ工業高専)
 * は私立高校マスターに含まれないため対象外。足立学園・安部学院は「推薦」ブロックと「一般」
 * ブロックが別枠なのか同一クォータの共有(↓)なのか原資料のみでは確証が持てず(愛国のような
 * 単一ブロック内の↓共有と、ブロック跨ぎの再掲が混在しているように見えるため)、誤帰属を避け
 * るため今回は見送り、次回別途官報方式で確認する。
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
