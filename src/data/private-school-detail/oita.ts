/**
 * 大分県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本・新潟に続き(株)育伸社(入試情報課)の「2026年度高専・私立高校募集要項【大分県】」
 * (2025年11月4日現在)から学校別・コース別の募集人員を取得。参照台帳15校中13校を収録
 * (稲葉学園・府内の2校はこのPDFに掲載が無く見送り)。東九州龍谷の特別進学コース/
 * 総合選択コース、明豊の特別進学クラス/高大連携クラス/体育専攻クラスのように
 * 「普通科計X」と注記され複数コースで同一数値を共有している場合は合算せず
 * 1つの共有コースとして統合記録した。
 *
 * 【掛-2（私立×多年度）着手時に発見した重大な誤り(2026-08-09是正)】miyagi.tsの
 * 東北学院榴ケ岡と同型の隣接校ブロック取り違えを警戒し全13校をpdftoppm(300dpi画像)で
 * 直接目視再確認したところ、**大分国際情報と大分東明の2校が旧セッションにより
 * 大幅に過小収録されていた**と判明した。大分国際情報は「普通35+情報通信35+情報電子
 * (デザイン35+ものづくり35=70)＝140」が正しいが、ts上は情報電子コース(70)のみが
 * 記録され普通・情報通信の2コース(計70)が丸ごと欠落していた。大分東明はさらに深刻で、
 * 「特別進学コース40(特別クラス若干・特進クラス40)・準特コース40・普通コース115・
 * 歯科衛生コース40(女)・国際コース35・商業(商業・介護福祉コース)40・商業(情報処理
 * コース)50・衛生看護(5年一貫コース)40(女)・看護教養(医療系進学コース)40＝440」が
 * 正しいが、ts上は普通35+情報通信35=70という**全く別の学校(大分国際情報)の値**が
 * 誤って記録されていた(実際には両校の隣接ブロックが入れ替わって収録されていた)。
 * pdftoppmで表の罫線・校名セルを直接目視して修正した。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03944.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月12日キャプチャ分(「2024年度版・2023年11月17日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果(上記の是正を反映した
 * 13校で比較)、11校は総定員が完全一致。**2校で実際の変化を検出**: 大分(特進選抜
 * ・特進・準特進・普通・アスリート・書道の6コースが2024年度は「普通科計320」の
 * 共有枠+アニメコースがその内数だったが、2026年度は各コースへ個別定員へ再配分され
 * 総定員440→400に減少)、昭和学園(福祉コースが2026年度に福祉ホスピタリティコースへ
 * 改称の上40→25に減少し総定員255→240)。楊志館は総定員こそ365で不変だが、福祉コースが
 * 廃止されライフデザインコースへ再編される等、8コース中5コースが改称・統廃合された。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03944.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【大分県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240812114037if_/https://www.ikushin.co.jp/school/pdf/03944.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【大分県】(株式会社育伸社 入試情報課・2023年11月17日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_OITA: PrivateSchoolDetailFile = {
  prefectureCode: 'oita',
  schools: [
    {
      schoolCode: 'D144310000011',
      schoolName: '岩田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: 'APU・立命館コース', capacity: 30 }],
      totalCapacity: 30,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000020',
      schoolName: '福徳学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'トータルビューティ', capacity: 50 },
        { courseName: '健康調理', capacity: 60 },
        { courseName: 'こども教育', capacity: 30 },
        { courseName: '普通科(スポーツ強化コース・ITライセンスコース計)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000039',
      schoolName: '大分高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進選抜コース', capacity: 15 },
        { courseName: '特進コース', capacity: 30 },
        { courseName: '準特進コース', capacity: 60 },
        { courseName: 'アスリートコース', capacity: 60 },
        { courseName: '書道コース', capacity: 10 },
        { courseName: '普通コース', capacity: 80 },
        { courseName: 'アニメコース', capacity: 25 },
        { courseName: '商業', capacity: 80 },
        { courseName: '自動車工業', capacity: 40 },
      ],
      totalCapacity: 400,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000048',
      schoolName: '楊志館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(アドバンスコース)', capacity: 20 },
        { courseName: '普通(スポーツマネジメントコース)', capacity: 20 },
        { courseName: '普通(キャリアライセンスコース)', capacity: 57 },
        { courseName: '普通(ライフデザインコース)', capacity: 70 },
        { courseName: '商業(デジタルデザインコース)', capacity: 42 },
        { courseName: '調理(調理師コース)', capacity: 76 },
        { courseName: '工業(エンジニアコース)', capacity: 80 },
      ],
      totalCapacity: 365,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000057',
      schoolName: '大分東明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース(特別クラス若干・特進クラス40)', capacity: 40 },
        { courseName: '準特コース', capacity: 40 },
        { courseName: '普通コース', capacity: 115 },
        { courseName: '歯科衛生コース(女)', capacity: 40 },
        { courseName: '国際コース', capacity: 35 },
        { courseName: '商業(商業・介護福祉コース)', capacity: 40 },
        { courseName: '商業(情報処理コース)', capacity: 50 },
        { courseName: '衛生看護(5年一貫コース・女)', capacity: 40 },
        { courseName: '看護教養(医療系進学コース)', capacity: 40 },
      ],
      totalCapacity: 440,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000066',
      schoolName: '大分国際情報高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 35 },
        { courseName: '情報通信', capacity: 35 },
        { courseName: '情報電子(デザイン35+ものづくり35)', capacity: 70 },
      ],
      totalCapacity: 140,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000075',
      schoolName: '別府溝部学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '食物', capacity: 40 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000084',
      schoolName: '東九州龍谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学コース・総合選択コース計)', capacity: 160 },
        { courseName: '食物', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000093',
      schoolName: '昭和学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 20 },
        { courseName: 'キャリアデザインコース(進学・総合)', capacity: 60 },
        { courseName: '製菓衛生師コース', capacity: 35 },
        { courseName: '調理', capacity: 40 },
        { courseName: '福祉ホスピタリティ', capacity: 25 },
        { courseName: '看護学', capacity: 60 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000100',
      schoolName: '藤蔭高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 120 },
        { courseName: '情報経済', capacity: 80 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000119',
      schoolName: '日本文理大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(特別進学・進学・キャリアデザイン・ソーシャルコミュニケーション)', capacity: 105 },
        { courseName: '情報技術', capacity: 60 },
      ],
      totalCapacity: 165,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000137',
      schoolName: '柳ヶ浦高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 200 },
        { courseName: '看護学', capacity: 40 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000146',
      schoolName: '明豊高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学クラス・高大連携クラス・体育専攻クラス計)', capacity: 160 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000011',
      schoolName: '岩田高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: 'APU・立命館コース', capacity: 30 }],
      totalCapacity: 30,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000020',
      schoolName: '福徳学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'トータルビューティ', capacity: 50 },
        { courseName: '健康調理', capacity: 60 },
        { courseName: 'こども教育', capacity: 30 },
        { courseName: '普通科(スポーツ強化コース・ITライセンスコース計)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000039',
      schoolName: '大分高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特進選抜・特進・準特進・普通・アスリート・書道・アニメコース計)', capacity: 320 },
        { courseName: '商業', capacity: 80 },
        { courseName: '自動車工業', capacity: 40 },
      ],
      totalCapacity: 440,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(2026年度は特進選抜・特進・準特進・普通・アスリート・書道・アニメの7コースが共有枠320から個別定員(15+30+60+80+60+10+25=280)へ再配分。総定員440→400に減少)',
      },
    },
    {
      schoolCode: 'D144310000048',
      schoolName: '楊志館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(進学コース)', capacity: 20 },
        { courseName: '普通(医療事務コース)', capacity: 15 },
        { courseName: '普通(キャリアライセンスコース)', capacity: 57 },
        { courseName: '普通(保育進学コース)', capacity: 35 },
        { courseName: '福祉(福祉コース)', capacity: 40 },
        { courseName: '商業(デジタルデザインコース)', capacity: 42 },
        { courseName: '調理(調理師コース)', capacity: 76 },
        { courseName: '工業(マルチエンジニアコース)', capacity: 80 },
      ],
      totalCapacity: 365,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員365は2026年度と同一。福祉コース40が廃止されライフデザインコース70へ再編される等、進学/医療事務/保育進学コースが2026年度はアドバンス/スポーツマネジメント/ライフデザインコースへ全面改称)',
      },
    },
    {
      schoolCode: 'D144310000057',
      schoolName: '大分東明高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース(特別クラス若干・特進クラス40)', capacity: 40 },
        { courseName: '準特コース', capacity: 40 },
        { courseName: '普通コース', capacity: 115 },
        { courseName: '歯科衛生コース(女)', capacity: 40 },
        { courseName: '国際コース', capacity: 35 },
        { courseName: '商業(商業・介護福祉コース)', capacity: 40 },
        { courseName: '商業(情報処理コース)', capacity: 50 },
        { courseName: '衛生看護(女)', capacity: 40 },
        { courseName: '看護教養', capacity: 40 },
      ],
      totalCapacity: 440,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000066',
      schoolName: '大分国際情報高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 35 },
        { courseName: '情報通信', capacity: 35 },
        { courseName: '情報電子', capacity: 70 },
      ],
      totalCapacity: 140,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000075',
      schoolName: '別府溝部学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '食物', capacity: 40 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 160,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000084',
      schoolName: '東九州龍谷高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特別進学コース・総合選択コース計)', capacity: 160 },
        { courseName: '食物', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000093',
      schoolName: '昭和学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 20 },
        { courseName: 'キャリアデザインコース(進学・総合)', capacity: 60 },
        { courseName: '製菓衛生師コース', capacity: 35 },
        { courseName: '調理', capacity: 40 },
        { courseName: '福祉', capacity: 40 },
        { courseName: '看護学', capacity: 60 },
      ],
      totalCapacity: 255,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は福祉コース→福祉ホスピタリティコースに改称の上40→25に減少。総定員255→240)',
      },
    },
    {
      schoolCode: 'D144310000100',
      schoolName: '藤蔭高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 120 },
        { courseName: '情報経済', capacity: 80 },
      ],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000119',
      schoolName: '日本文理大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(特別進学・進学・キャリアデザイン・ソーシャルコミュニケーション)', capacity: 105 },
        { courseName: '情報技術', capacity: 60 },
      ],
      totalCapacity: 165,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000137',
      schoolName: '柳ヶ浦高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 200 },
        { courseName: '看護学', capacity: 40 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D144310000146',
      schoolName: '明豊高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特別進学クラス・高大連携クラス・体育専攻クラス計)', capacity: 160 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D144310000128',
      schoolName: '稲葉学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D144310000155',
      schoolName: '府内高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
