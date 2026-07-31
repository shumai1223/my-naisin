/**
 * 大分県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本・新潟に続き(株)育伸社(入試情報課)の「2026年度高専・私立高校募集要項【大分県】」
 * (2025年11月4日現在)から学校別・コース別の募集人員を取得。参照台帳15校中13校を収録
 * (稲葉学園・府内の2校はこのPDFに掲載が無く見送り)。東九州龍谷の特別進学コース/
 * 総合選択コース、明豊の特別進学クラス/高大連携クラス/体育専攻クラスのように
 * 「普通科計X」と注記され複数コースで同一数値を共有している場合は合算せず
 * 1つの共有コースとして統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03944.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【大分県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
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
        { courseName: '普通', capacity: 35 },
        { courseName: '情報通信', capacity: 35 },
      ],
      totalCapacity: 70,
      source: SOURCE,
    },
    {
      schoolCode: 'D144310000066',
      schoolName: '大分国際情報高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '情報電子(デザイン35+ものづくり35)', capacity: 70 }],
      totalCapacity: 70,
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
