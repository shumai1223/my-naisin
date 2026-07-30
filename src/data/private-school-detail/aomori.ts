/**
 * 青森県私立高等学校の募集定員データ(Λ-5第二段)。
 * 個別学校サイト調査で先に確認していた青森山田(360)・弘前学院聖愛(216)に加え、
 * 熊本・大分・鹿児島・山形・群馬・茨城・山口・広島・奈良・岩手・千葉・宮城・宮崎に
 * 続き(株)育伸社(入試情報課)の「2026年度高専・私立高校募集要項【青森県】」
 * (2025年11月4日現在)から残り15校を取得し、参照台帳17校を完全収録した。
 * 既存2校の数値は育伸社データと完全一致し二重チェックが取れている
 * (岩手・宮城・宮崎に続き4県連続でこの一致検証が再現)。八戸聖ウルスラ学院の
 * LAコース・MAコース・SAコースのように複数コースが「普通科計X」と注記され
 * 同一数値を共有している場合は合算せず1つの共有コースとして統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03902.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【青森県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_AOMORI: PrivateSchoolDetailFile = {
  prefectureCode: 'aomori',
  schools: [
    {
      schoolCode: 'D102310000057',
      schoolName: '青森山田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
        { courseName: 'ITビジネス科', capacity: 40 },
        { courseName: '調理科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.aomoriyamada-hs.jp/wp/wp-content/uploads/2025/10/2026-生徒募集要項.pdf',
        docTitle: '令和8年度 生徒募集要項｜青森山田高等学校（学科・コース及び募集人数表・育伸社募集要項PDFの普通科計280+40+40=360と完全一致）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D102310000011',
      schoolName: '弘前学院聖愛高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '総合進学コース・特別進学コース(合算)', capacity: 216 }],
      totalCapacity: 216,
      source: {
        url: 'https://seiai.hirogaku.ac.jp/wp-content/uploads/2025/09/7a0065b59fd4bf8c38db35fcb343063a.pdf',
        docTitle: '2026（令和8）年度 生徒募集要項｜弘前学院聖愛高等学校（募集人員216名＝推薦入試と一般入試あわせて・育伸社募集要項PDFと完全一致）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D102310000020',
      schoolName: '柴田学園大学附属柴田学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通・家政・情報', capacity: 210 }],
      totalCapacity: 210,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000039',
      schoolName: '東奥義塾高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(特別進学・進学選抜・総合コース制)', capacity: 234 }],
      totalCapacity: 234,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000048',
      schoolName: '東奥学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(内スポーツ40以内)', capacity: 120 },
        { courseName: '調理', capacity: 40 },
        { courseName: '情報科学', capacity: 40 },
        { courseName: '福祉', capacity: 40 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000066',
      schoolName: '青森明の星高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 130 },
        { courseName: '英語', capacity: 40 },
      ],
      totalCapacity: 170,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000075',
      schoolName: '千葉学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 35 },
        { courseName: '生活文化', capacity: 60 },
        { courseName: '調理', capacity: 35 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 170,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000084',
      schoolName: '八戸聖ウルスラ学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(LAコース・MAコース・SAコース計)', capacity: 140 },
        { courseName: '英語(内推薦若干)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000093',
      schoolName: '八戸学院光星高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 270 },
        { courseName: '保育福祉', capacity: 90 },
      ],
      totalCapacity: 360,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000100',
      schoolName: '八戸工業大学第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '工業', capacity: 245 },
      ],
      totalCapacity: 325,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000119',
      schoolName: '五所川原第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 140 }],
      totalCapacity: 140,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000128',
      schoolName: '下山学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '商業(内推薦80%以内)', capacity: 80 },
        { courseName: '普通(内推薦80%以内)', capacity: 40 },
      ],
      totalCapacity: 120,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000137',
      schoolName: '弘前東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '電子', capacity: 40 },
        { courseName: '情報', capacity: 80 },
        { courseName: '自動車', capacity: 40 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000146',
      schoolName: '八戸学院野辺地西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '総合', capacity: 100 }],
      totalCapacity: 100,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000155',
      schoolName: '松風塾高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(総合進学コースのみ)', capacity: 25 }],
      totalCapacity: 25,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000164',
      schoolName: '八戸工業大学第二高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(進学コース・総合コース・美術コース計・一貫含む)', capacity: 240 }],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D102310000173',
      schoolName: '向陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 80 }],
      totalCapacity: 80,
      source: IKUSHIN_SOURCE,
    },
  ],
  skipped: [],
};
