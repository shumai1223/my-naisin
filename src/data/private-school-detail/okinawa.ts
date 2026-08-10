/**
 * 沖縄県私立高等学校の募集定員データ(Λ-5第二段)。
 *
 * 沖縄県はMEXT学校コード一覧の私立高校12校のうち、実質的に「全日制で外部募集を行う
 * 伝統校」は沖縄尚学・興南・沖縄カトリック・昭和薬科大学附属の4校のみで、残り8校は
 * 広域通信制(N高等学校・仙台育英学園ILC沖縄・瑞穂MSC・つくば開成国際・八洲学園大学
 * 国際・沖縄中央・ヒューマンキャンパス)またはスポーツ専門の通信制系(エナジック
 * スポーツ高等学院)であることをWebSearchで裏取りした。
 *
 * **2026-08-10(掛-2私立×多年度)**: 沖縄県のPDF公開形式は他県のikushin.co.jp集約PDFと異なり、
 * okisho.ed.jp(沖縄県私立中学高等学校協会)上の学校別個別PDF(sr_01=沖縄尚学のように学校ごとに
 * 連番)であると判明。Wayback CDX APIでokisho.ed.jpドメイン全体を検索したところsr_01_2025.pdf
 * (2025年度版・2025-06-03キャプチャ)を発掘。**このPDFは日本語フォントがpdftoppm/pdftotext
 * いずれでも文字化け(Adobe-Japan1文字コレクション未対応)して読めなかったが、PyMuPDF(fitz)の
 * get_pixmap()で300dpiレンダリングしたところ完全に判読可能だった**(hyogo等で確立済みの
 * pdftoppm失敗時のPyMuPDFフォールバックが本県でも有効)。沖縄尚学は2025年度版でも355+45=400と
 * 総定員が完全一致(内進生を含む定員という測定基盤も両年度で同一)。興南・沖縄カトリック・昭和薬科
 * 大学附属の他3伝統校は現行(2026年度)自体が募集要項アクセス不可等でスキップ済みのため掛-2の
 * 対象外(比較対象となる現行データが無い)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_OKINAWA: PrivateSchoolDetailFile = {
  prefectureCode: 'okinawa',
  schools: [
    {
      schoolCode: 'D147320100016',
      schoolName: '沖縄尚学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科(難関大・国公立大医学科/尚学パイオニアα・チャレンジャー/国際文化科学コース)', capacity: 355 },
        { courseName: '普通科(尚学パイオニアコースβ・旧体育コース)', capacity: 45 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.okisho.ed.jp/_/f/2025/11/sr_01_2026_v2.pdf',
        docTitle: '2026年度 高等学校募集定員およびコース(沖縄尚学高等学校)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D147320100016',
      schoolName: '沖縄尚学高等学校',
      fiscalYearLabel: '2025年度',
      courses: [
        { courseName: '普通科(難関大・国公立大医学科/尚学パイオニアα・チャレンジャー/国際文化科学コース)', capacity: 355 },
        { courseName: '普通科(尚学パイオニアコースβ・旧体育コース)', capacity: 45 },
      ],
      totalCapacity: 400,
      source: {
        url: 'http://web.archive.org/web/20250603144345/https://www.okisho.ed.jp/_/f/2025/05/sr_01_2025.pdf',
        docTitle: '2025年度 高等学校募集定員およびコース(沖縄尚学高等学校、Wayback Machine 2025-06-03キャプチャ)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D147320100025',
      schoolName: '興南高等学校',
      reason:
        '募集要項がebook5.net形式のデジタルパンフレット(閲覧用フリップブック)のみで公開されておりテキスト抽出不可。他の二次情報源でもコース別(フロンティア/特別進学/総合進学)の確度の高い定員数を確認できなかった。',
    },
    {
      schoolCode: 'D147320100034',
      schoolName: 'つくば開成国際高等学校',
      reason: '茨城県の開成学園グループが運営する広域通信制高校の沖縄拠点(那覇キャンパス)であり、都道府県別の募集定員という概念が無い。',
    },
    {
      schoolCode: 'D147320500012',
      schoolName: '沖縄カトリック高等学校',
      reason: '完全中高一貫校で高校からの外部募集(高校入試)を実施していないため、募集定員データが存在しない(WebSearchで学校側の説明を確認)。',
    },
    {
      schoolCode: 'D147320700010',
      schoolName: '瑞穂ＭＳＣ高等学校',
      reason: '東京・神戸・石垣島・バーチャルにキャンパスを持つ広域通信制(ネット高校)であり、都道府県別の募集定員という概念が無い。',
    },
    {
      schoolCode: 'D147320800019',
      schoolName: '昭和薬科大学附属高等学校',
      reason: '完全中高一貫(1学年200名)で、高校からの外部募集は原則実施せず欠員時の転入学試験のみのため、通常の募集定員データが存在しない。',
    },
    {
      schoolCode: 'D147320900018',
      schoolName: 'ヒューマンキャンパス高等学校',
      reason: '広域通信制高校の名護拠点であり、都道府県別の募集定員という概念が無い。',
    },
    {
      schoolCode: 'D147320900027',
      schoolName: 'エナジックスポーツ高等学院',
      reason: '2021年に通信制サポート校として開校し2024年から全日制課程も設置されたが、全日制の募集定員を公表する一次資料を確認できなかった。',
    },
    {
      schoolCode: 'D147321100014',
      schoolName: '仙台育英学園沖縄高等学校',
      reason: '宮城県の仙台育英学園高等学校が運営する広域通信制課程(ILC沖縄)の拠点であり、都道府県別の募集定員という概念が無い。',
    },
    {
      schoolCode: 'D147321300012',
      schoolName: 'Ｎ高等学校',
      reason: '角川ドワンゴ学園が運営する全国募集の広域通信制高校(本校所在地が沖縄県であるだけ)であり、都道府県別の募集定員という概念が無い。',
    },
    {
      schoolCode: 'D147321400011',
      schoolName: '沖縄中央高等学校',
      reason: '2025年開校の広域通信制高校(全国から入学可能)であり、都道府県別の募集定員という概念が無い。',
    },
    {
      schoolCode: 'D147330800018',
      schoolName: '八洲学園大学国際高等学校',
      reason: '全国から入学可能で入学試験自体が無い広域通信制高校であり、募集定員という概念が無い。',
    },
  ],
};
