/**
 * 山口県私立高等学校の募集定員データ(Λ-5第二段)。
 * 山口県私立中学高等学校協会サイトには募集定員一覧が見当たらなかったが、
 * 熊本・大分・鹿児島・山形・群馬・茨城に続き(株)育伸社(入試情報課)の
 * 「2026年度高専・私立高校募集要項【山口県】」(2025年11月4日現在)から
 * 学校別・コース別の募集人員を取得。参照台帳23校中20校を収録(精華学園・松陰・
 * 萩明倫館の3校はこのPDFに掲載が無く見送り)。山口県桜ケ丘の特進・進学・創学
 * コース各系統、高水のアドバンスコース・キャリアデザインコース、聖光の進学・
 * 総合コースのように複数コースが「普通科計X」と注記され同一数値を共有している
 * 場合は合算せず1つの共有コースとして統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03935.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【山口県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_YAMAGUCHI: PrivateSchoolDetailFile = {
  prefectureCode: 'yamaguchi',
  schools: [
    {
      schoolCode: 'D135310000012',
      schoolName: '梅光学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(GSSコース・SSコース)', capacity: 80 },
        { courseName: '音楽', capacity: 20 },
      ],
      totalCapacity: 100,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000021',
      schoolName: '早鞆高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '菁菁館特別進学コース第Ⅰ類', capacity: 35 },
        { courseName: '菁菁館特別進学コース第Ⅱ類', capacity: 35 },
        { courseName: '進学グローアップコース', capacity: 40 },
        { courseName: 'キャリア・アスリートコース', capacity: 105 },
        { courseName: 'ビューティーコース(美容30+理容10)', capacity: 40 },
        { courseName: '自動車工学', capacity: 40 },
        { courseName: '生活クリエイト', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 375,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000030',
      schoolName: '下関短期大学付属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000049',
      schoolName: '下関国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '電子機械', capacity: 40 },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000058',
      schoolName: '宇部鴻城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '普通コース', capacity: 150 },
        { courseName: '機械・自動車工学', capacity: 80 },
      ],
      totalCapacity: 260,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000067',
      schoolName: '慶進高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 70 },
        { courseName: '進学コース', capacity: 110 },
      ],
      totalCapacity: 180,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000076',
      schoolName: '宇部フロンティア大学付属香川高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 50 },
        { courseName: '進学コース', capacity: 60 },
        { courseName: '生活デザイン', capacity: 40 },
        { courseName: '食物調理', capacity: 65 },
        { courseName: '保育', capacity: 40 },
      ],
      totalCapacity: 255,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000085',
      schoolName: '山口中村学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 90 },
        { courseName: '看護', capacity: 40 },
        { courseName: '調理', capacity: 40 },
        { courseName: '福祉', capacity: 40 },
        { courseName: '商業', capacity: 40 },
      ],
      totalCapacity: 250,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000094',
      schoolName: '野田学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '未来創造コース', capacity: 160 },
        { courseName: '特別進学Aコース', capacity: 60 },
        { courseName: '特別進学Sコース', capacity: 30 },
      ],
      totalCapacity: 250,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000101',
      schoolName: '萩光塩学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000110',
      schoolName: '山口県桜ケ丘高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(特進コース・進学コース・創学コースキャリア系・アーティスト系・商業系・電気系計)',
          capacity: 240,
        },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000129',
      schoolName: '誠英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 35 },
        { courseName: '進学コース', capacity: 40 },
        { courseName: '総合コース', capacity: 87 },
        { courseName: '調理師コース', capacity: 38 },
        { courseName: '情報会計', capacity: 70 },
        { courseName: '福祉', capacity: 35 },
      ],
      totalCapacity: 305,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000138',
      schoolName: '高川学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 200 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000147',
      schoolName: '高水高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(アドバンスコース・キャリアデザインコース計)', capacity: 150 },
        { courseName: '六年制普通(内部進学含む)', capacity: 60 },
      ],
      totalCapacity: 210,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000156',
      schoolName: 'サビエル高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 105 }],
      totalCapacity: 105,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000165',
      schoolName: '聖光高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(進学コース・総合コース計)', capacity: 170 },
        { courseName: '社会福祉', capacity: 25 },
        { courseName: '総合ビジネス', capacity: 30 },
        { courseName: '機械', capacity: 40 },
      ],
      totalCapacity: 265,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000174',
      schoolName: '長門高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 120 },
        { courseName: '商業', capacity: 120 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000183',
      schoolName: '柳井学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合進学コース', capacity: 25 },
        { courseName: 'スポーツ科学コース', capacity: 35 },
        { courseName: '教養キャリアコース', capacity: 35 },
        { courseName: 'ビューティーコース', capacity: 25 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000192',
      schoolName: '成進高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 50 },
        { courseName: '総合ビジネス', capacity: 30 },
      ],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000209',
      schoolName: '山口県鴻城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 180 },
        { courseName: '情報商業', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 260,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D135310000218',
      schoolName: '精華学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(広域通信制の可能性)',
    },
    {
      schoolCode: 'D135310000227',
      schoolName: '松陰高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D135310000236',
      schoolName: '萩明倫館高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
