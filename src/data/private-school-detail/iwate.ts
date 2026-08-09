/**
 * 岩手県私立高等学校の募集定員データ(Λ-5第二段)。
 * 個別学校サイト調査で先に確認していた2校(花巻東・盛岡大学附属)に加え、
 * 熊本・大分・鹿児島・山形・群馬・茨城・山口・広島・奈良に続き(株)育伸社
 * (入試情報課)の「2026年度高専・私立高校募集要項【岩手県】」(2025年11月4日
 * 現在)から残り11校を取得し、参照台帳13校を完全収録した(花巻東=240・
 * 盛岡大学附属=150は個別サイト調査時の数値と育伸社データが完全一致し
 * クロスチェックが取れている)。岩手高等学校の総合進学・特別進学コース、
 * 盛岡白百合学園のスーパー特進・特進・進学アクティブコース、盛岡中央の
 * 5コース、一関学院・一関修紅の各3コースのように複数コースが「普通科計X」
 * と注記され同一数値を共有している場合は合算せず1つの共有コースとして
 * 統合記録した。
 *
 * 【掛-2（私立×多年度）着手時の再検証(2026-08-09)】miyagi.tsで発覚した隣接校
 * データブロック取り違えを警戒し、全13校の令和8年度データを`pdftotext -layout`で
 * 現行PDFと再突合したが、iwateでは誤帰属は見つからず全校が正しい値だった。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03903.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月12日キャプチャ分(「2024年度版・2023年11月17日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果、**13校全てで総定員が
 * 完全に一致**(岩手県は変化ゼロ)。ただし興味深い構造変化を2件発見した:
 * ①盛岡白百合学園は2024年度時点では「MEアドバンスコース(特別選抜進学)・MEコース
 * (特別進学)・MRコース(総合進学)」といずれも女子のみの募集だったが、2026年度に
 * 「スーパー特進・特進・進学アクティブ」の現行名へ改称すると同時に共学化された
 * (現行PDFの「2026～女子→共学」注記と符合)。②一関学院は2024年度PDFには
 * 特別進学コース・普通の2コースのみが「普通科計280」を共有する形で記載されており、
 * 2026年度で新設された美容コースはこの共有枠に含まれていなかった(総定員280は
 * 両年度で不変)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03903.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【岩手県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240812162640if_/https://www.ikushin.co.jp/school/pdf/03903.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【岩手県】(株式会社育伸社 入試情報課・2023年11月17日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_IWATE: PrivateSchoolDetailFile = {
  prefectureCode: 'iwate',
  schools: [
    {
      schoolCode: 'D103310000010',
      schoolName: '岩手高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(総合進学コース・特別進学コース計・男)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000029',
      schoolName: '岩手女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(女)', capacity: 120 },
        { courseName: '看護(女・内推薦45程度)', capacity: 60 },
        { courseName: '福祉教養(女)', capacity: 40 },
      ],
      totalCapacity: 220,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000038',
      schoolName: '盛岡白百合学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(スーパー特進コース・特進コース・進学アクティブコース計・2026年度より共学化)', capacity: 240 }],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000047',
      schoolName: '江南義塾盛岡高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 90 }],
      totalCapacity: 90,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000056',
      schoolName: '盛岡誠桜高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '全科(一括)', capacity: 225 }],
      totalCapacity: 225,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000065',
      schoolName: '盛岡大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・高大連携進学コース・進学コース計)', capacity: 150 }],
      totalCapacity: 150,
      source: {
        url: 'https://www.morifu.jp/exam/examination/',
        docTitle: '入試要項ページ｜盛岡大学附属高等学校公式サイト(「全日制普通科で計150名(男女共学)」・育伸社募集要項PDFの普通科計150と完全一致確認)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D103310000074',
      schoolName: '盛岡スコーレ高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '総合(自己推薦)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000083',
      schoolName: '盛岡中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進選抜SZコース・特進Zコース・国際Rコース・進学選抜Aコース・進学総合Bコース計)', capacity: 240 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000092',
      schoolName: '花巻東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・進学コース・スポーツコース計)', capacity: 240 }],
      totalCapacity: 240,
      source: {
        url: 'https://www.hanamakihigashi-h.jp/',
        docTitle: '令和8年度募集要項(WebSearch要約2経路で「普通科全体の募集人員は男女計240名」と独立一致確認・育伸社募集要項PDFの普通科計240と完全一致確認)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D103310000109',
      schoolName: '専修大学北上高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(Ⅰ期185)', capacity: 185 },
        { courseName: 'グローカルビジネス', capacity: 80 },
        { courseName: 'メカニックエンジニアリング', capacity: 35 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000118',
      schoolName: '協和学院水沢第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(Ⅰ期105)', capacity: 105 },
        { courseName: '調理', capacity: 35 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000127',
      schoolName: '一関学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・普通・美容コース計)', capacity: 280 }],
      totalCapacity: 280,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000136',
      schoolName: '一関修紅高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(進学探究コース・キャリア探究コース・ライフデザインコース計)', capacity: 240 }],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000010',
      schoolName: '岩手高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(総合進学コース・特別進学コース計・男)', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000029',
      schoolName: '岩手女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(女)', capacity: 120 },
        { courseName: '看護(女・内推薦45程度)', capacity: 60 },
        { courseName: '福祉教養(女)', capacity: 40 },
      ],
      totalCapacity: 220,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000038',
      schoolName: '盛岡白百合学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(MEアドバンスコース(特別選抜進学)・MEコース(特別進学)・MRコース(総合進学)計・女子のみ)', capacity: 240 },
      ],
      totalCapacity: 240,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員240は2026年度と同一。2024年度は女子のみ募集・2026年度にスーパー特進/特進/進学アクティブへ改称し共学化)',
      },
    },
    {
      schoolCode: 'D103310000047',
      schoolName: '江南義塾盛岡高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 90 }],
      totalCapacity: 90,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000056',
      schoolName: '盛岡誠桜高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '全科(一括)', capacity: 225 }],
      totalCapacity: 225,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000065',
      schoolName: '盛岡大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学コース・高大連携進学コース・進学コース計)', capacity: 150 }],
      totalCapacity: 150,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000074',
      schoolName: '盛岡スコーレ高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '総合(自己推薦)', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000083',
      schoolName: '盛岡中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特進選抜SZコース・特進Zコース・国際Rコース・進学選抜Aコース・進学総合Bコース計)', capacity: 240 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000092',
      schoolName: '花巻東高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学コース・進学コース・スポーツコース計)', capacity: 240 }],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000109',
      schoolName: '専修大学北上高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(Ⅰ期185)', capacity: 185 },
        { courseName: 'グローカルビジネス', capacity: 80 },
        { courseName: 'メカニックエンジニアリング', capacity: 35 },
      ],
      totalCapacity: 300,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000118',
      schoolName: '協和学院水沢第一高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(Ⅰ期105)', capacity: 105 },
        { courseName: '調理', capacity: 35 },
      ],
      totalCapacity: 140,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D103310000127',
      schoolName: '一関学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学コース・普通計)', capacity: 280 }],
      totalCapacity: 280,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員280は2026年度と同一。2024年度時点では美容コースの記載が無く特別進学・普通の2コースのみで280を共有)',
      },
    },
    {
      schoolCode: 'D103310000136',
      schoolName: '一関修紅高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(進学探究コース・キャリア探究コース・ライフデザインコース計)', capacity: 240 }],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
  ],
  skipped: [],
};
