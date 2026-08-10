/**
 * 愛媛県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * schools-private/ehime.ts（第一段・機械生成の参照台帳）14校のうち、
 * 公式募集要項PDFで最新年度の定員を確度高く確認できた学校のみ収録。
 * 残りは正直にスキップ台帳へ（[[fable5-fullaccel-backlog-2026-07]]のΛ-5進捗ノート参照）。
 *
 * **2026-08-07クローズ**: 「愛媛県私立学校名簿」の「定員」欄は凡例・脚注が一切なく、
 * 決定的な傍証（同名簿の大学ページで岡山理科大の入学定員×修業年数＝収容定員と完全一致）
 * から収容定員と確定した。収容定員÷3で募集定員として載せるのは推定値になり
 * Y-0憲法（独自推定は永久禁止）に反するため、この名簿を代替情報源として使うのは不採用。
 * 学校ごとの公式募集要項を個別に確認する現行の収集方針（本ファイル）が正しいアプローチと
 * 確定し、このタスクをクローズする。済美高等学校は当初SVG画像でテキスト抽出できず
 * スキップしていたが、公式ページの画像表を目視で読み取り募集人員を確認できたため収録済みに
 * 昇格（一般入試枠単独の数値は非公表のため、学校全体の募集人員として収録）。
 *
 * **2026-08-10(掛-2私立×多年度)**: hyogo/okinawa完走を受け着手。ehimeは各校が個別公式サイト
 * ソース(ikushin形式ではない)のため、各校のドメイン単体でWayback CDX APIを検索する方式を採用。
 * 愛光(aiko.ed.jp)はyoukou2022〜2024.pdfが連番で発掘でき、youkou2024.pdf(令和6年度)を取得。
 * 「内進生含め250名」は令和8年度版と完全に同一の文言・数値で総定員250=250完全一致。聖カタリナ
 * 学園(catalina.ed.jp)はbosyuyoukou202110〜202310.pdfが発掘でき、202310.pdf(令和6年度)を取得。
 * 2024年度版は普通科(特進+スポーツ進学、200)と総合学科(240)が別々の学科として掲載されていたが、
 * 2026年度版では総合コースが普通科の1コースとして統合され「普通科4コース合算400」という単一
 * グループに再編されている(学科レベルの統合再編)。看護科80は両年度で不変。合計は520→480へ
 * 減少(学科統合による構造変化を伴う実質減)。帝京第五・今治精華・松山学院・松山東雲・FC今治
 * 里山校の残り5校は個別ドメインのWayback CDX検索で該当する過去年度の募集要項PDFを発見できず
 * (帝京第五は2004-2006年の行事写真のみヒット・他は今回未着手)、今回は愛光・聖カタリナ学園の
 * 2校のみで区切りとする。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_EHIME: PrivateSchoolDetailFile = {
  prefectureCode: 'ehime',
  schools: [
    {
      schoolCode: 'D138320100062',
      schoolName: '愛光高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [{ courseName: '募集人員（内進生含め・コース分けなし）', capacity: 250 }],
      totalCapacity: 250,
      source: {
        url: 'https://www.aiko.ed.jp/admission/ar_high/youkou2026.pdf',
        docTitle: '令和8年度（2026年度）愛光高等学校 入学試験要項',
        fetchedAt: '2026-08-03',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100026',
      schoolName: '聖カタリナ学園高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        {
          courseName: '普通科（文理特進・国際特進・スポーツ・総合の4コース合算）',
          capacity: 400,
        },
        { courseName: '看護科', capacity: 80 },
      ],
      totalCapacity: 480,
      source: {
        url: 'https://catalina.ed.jp/wp-content/themes/catalina-hs/pdf/bosyuyoukou202510.pdf',
        docTitle: '令和8年度 募集要項（聖カタリナ学園高等学校）',
        fetchedAt: '2026-08-03',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320700011',
      schoolName: '帝京第五高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        { courseName: '普通科', capacity: 40 },
        { courseName: '看護科', capacity: 40 },
        { courseName: '総合学科', capacity: 120 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://teikyo5-h.ed.jp/wp-content/uploads/2026/05/yoko2026.pdf',
        docTitle: '2026(令和8)年度 入学試験要項（Web出願）（帝京第五高等学校）',
        fetchedAt: '2026-08-03',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320200034',
      schoolName: '今治精華高等学校',
      fiscalYearLabel: '令和9年度（2027年度）',
      courses: [
        { courseName: '普通科（普通科IIを含む）', capacity: 120 },
        { courseName: '調理科', capacity: 40 },
      ],
      totalCapacity: 160,
      source: {
        url: 'https://highschool.imabariseika.ac.jp/entrance-information/youkou/',
        docTitle: '入試要項（令和9年度）（今治精華高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100044',
      schoolName: '松山学院高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        { courseName: '普通科 進学コース', capacity: 80 },
        { courseName: '普通科 情報コース', capacity: 25 },
        { courseName: '普通科 総合コース', capacity: 30 },
        { courseName: '普通科 スポーツコース', capacity: 25 },
        { courseName: '普通科 Newコース', capacity: 110 },
        { courseName: '調理科', capacity: 10 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://mg-h.ed.jp/admissions/requirements/',
        docTitle: '募集要項（松山学院高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100035',
      schoolName: '松山東雲高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [{ courseName: '普通科', capacity: 90 }],
      totalCapacity: 90,
      source: {
        url: 'https://highschool.shinonome.ac.jp/wp-content/uploads/2025/10/e87b2da24be7945a01b1d6c5ac98ddee.pdf',
        docTitle: '令和8年度 生徒募集要項・出願書類（松山東雲高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320200025',
      schoolName: 'ＦＣ今治高等学校里山校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '前期(推薦)・後期(一般)共通枠', capacity: 80 }],
      totalCapacity: 80,
      source: {
        url: 'https://api.fcihs-satoyama.ed.jp/assets/files/4%EF%BC%8E2026%E5%B9%B4%E5%BA%A6%EF%BC%A6%EF%BC%A3%E4%BB%8A%E6%B2%BB%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1_%E9%87%8C%E5%B1%B1%E6%A0%A1_%E5%85%A5%E8%A9%A6%E8%A6%81%E9%A0%855.pdf',
        docTitle: '2026年度FC今治高等学校 里山校 入試要項PDF',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100017',
      schoolName: '済美高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        { courseName: '普通科', capacity: 685 },
        { courseName: '美術科', capacity: 80 },
      ],
      totalCapacity: 765,
      source: {
        url: 'https://saibi.ac.jp/entrance/exam-info/',
        docTitle: '受験案内（済美高等学校・画像表を目視で判読）',
        fetchedAt: '2026-08-06',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100062',
      schoolName: '愛光高等学校',
      fiscalYearLabel: '令和6年度（2024年度）',
      courses: [{ courseName: '募集人員（内進生含め・コース分けなし）', capacity: 250 }],
      totalCapacity: 250,
      source: {
        url: 'http://web.archive.org/web/20240504222326/https://www.aiko.ed.jp//admission/ar_high/youkou2024.pdf',
        docTitle: '令和6年度（2024年度）愛光高等学校 入学試験要項（Wayback Machine 2024-05-04キャプチャ）',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100026',
      schoolName: '聖カタリナ学園高等学校',
      fiscalYearLabel: '令和6年度（2024年度）',
      courses: [
        { courseName: '普通科（特進コース・スポーツ進学コース合算）', capacity: 200 },
        { courseName: '総合学科', capacity: 240 },
        { courseName: '看護科', capacity: 80 },
      ],
      totalCapacity: 520,
      source: {
        url: 'http://web.archive.org/web/20240716045729/https://catalina.ed.jp/wp-content/themes/catalina-hs/pdf/bosyuyoukou202310.pdf',
        docTitle: '令和6年度 募集要項（聖カタリナ学園高等学校、Wayback Machine 2024-07-16キャプチャ）',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D138320100053',
      schoolName: '新田高等学校',
      reason:
        '公式サイトの募集予定人数表(nitta.ac.jp/admission/examination/#cont_03)がHTML→テキスト変換で推薦/一般の数値が矛盾して抽出され確度高く読み取れず、募集要項の直接PDFリンクも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D138320100071',
      schoolName: '松山聖陵高等学校',
      reason:
        '令和8年度募集要項ページ(matsuyamaseiryo-h.ed.jp/exam/reiwa8youkou/)は404、令和9年度ページ(同/exam/reiwa9youkou)は「準備中」表示のみで、学校案内パンフレットPDFは10MB超でWebFetch取得不可のため現行の募集定員が確認できず見送り。',
    },
    {
      schoolCode: 'D138320100080',
      schoolName: '未来高等学校',
      reason:
        '広域通信制高校のため公式サイト(mirai-hs.kawahara.ac.jp)・運営元ポータル(mirai.gakurinsha.co.jp)ともにコース案内はあるが松山本校固有の募集定員数値は掲載されておらず(全国共通ページに他キャンパスの定員例が出るのみ)、募集要項PDFへの直接リンクも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D138320200016',
      schoolName: 'ＦＣ今治高等学校明徳校',
      reason:
        '公式サイト(meitokuhonko.com/entrance-examination)は「推薦入試(専願)80名」「一般入試(併願)240名(推薦を含む総定員)」という記載だが、この240名が80名を含む総定員なのか一般入試枠単独で320名が真の総定員なのか文言から確定できず、学校案内PDF(7.9MB)も破損読み取り不能でクロスチェックできないため見送り。同法人の里山校(FC今治高等学校里山校)は募集定員合計80名という明確な単一枠の記載があり収録済みだが、明徳校は数値の構造自体が不明瞭なため区別して保留。',
    },
    {
      schoolCode: 'D138320200043',
      schoolName: '日本ウェルネス高等学校',
      reason:
        '広域通信制・単位制高校のため公式サイト(taiken.ac.jp)の学校概要ページに所在地・開校年度等の記載はあるが募集定員(入学定員)の数値記載自体が無く、WebSearchでも複数回試行したが確認できなかったため見送り。',
    },
    {
      schoolCode: 'D138320500013',
      schoolName: '未来高等学校新居浜校',
      reason:
        '同法人の運営元ポータル(mirai.gakurinsha.co.jp/study-guides/)に週4日コース30名・週2日コース30名という数値の記載があったが、これは新居浜校ではなく別キャンパス(国立本校)の数値であり誤帰属のリスクが高いため不採用。新居浜校固有の公式ページ(mirai-hs.kawahara.ac.jp/category/blog/nihamako/)には募集定員の記載自体が無く、同法人松山本校(既にスキップ済み)と同様のケースとして見送り。',
    },
  ],
};
