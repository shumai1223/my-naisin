/**
 * 山形県私立高等学校の募集定員データ(Λ-5第二段)。
 * 山形県私立中学高等学校協会サイトは入試日程PDFのみで募集定員一覧が無かったが、
 * 熊本・大分・鹿児島に続き(株)育伸社(入試情報課)の「2026年度高専・私立高校
 * 募集要項【山形県】」(2025年11月4日現在)に学校別・コース別の募集人員が
 * 掲載されていることを発見。参照台帳15校中12校を収録。羽黒高等学校はPDF上に
 * 数値記載が無く学校HP参照の注記のみだったため見送り、和順館高等学校と
 * 基督教独立学園高等学校はこのPDF自体に掲載が無く見送り。日本大学山形の
 * 特進・進学・スポーツコース、東海大学山形の特進・総合進学・総合学習コース、
 * 九里学園のプログレス・ユニバーサルコースのように「普通科計X」「全コース計X」
 * と注記され複数コースで同一数値を共有している場合は合算せず1つの共有コースと
 * して統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03906.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【山形県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_YAMAGATA: PrivateSchoolDetailFile = {
  prefectureCode: 'yamagata',
  schools: [
    {
      schoolCode: 'D106320151013',
      schoolName: '東北文教大学山形城北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進', capacity: 50 },
        { courseName: 'アカデミック探究コース', capacity: 150 },
        { courseName: 'キャリア探究コース', capacity: 70 },
        { courseName: 'スポーツ探究コース', capacity: 70 },
      ],
      totalCapacity: 340,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320151022',
      schoolName: '山形学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 145 },
        { courseName: '情報', capacity: 35 },
        { courseName: '調理', capacity: 105 },
      ],
      totalCapacity: 285,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320151031',
      schoolName: '日本大学山形高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '全コース(特進・進学・スポーツコース計)', capacity: 330 }],
      totalCapacity: 330,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320151040',
      schoolName: '山形明正高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 90 },
        { courseName: '情報機械', capacity: 45 },
        { courseName: '自動車工学', capacity: 45 },
      ],
      totalCapacity: 180,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320151059',
      schoolName: '惺山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(コースセレクション)', capacity: 300 }],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320151068',
      schoolName: '東海大学山形高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進・総合進学・総合学習コース計)', capacity: 300 }],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320251012',
      schoolName: '九里学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(プログレスコース・ユニバーサルコース計)', capacity: 280 }],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320251021',
      schoolName: '米沢中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 75 },
        { courseName: 'キャリア教育コース', capacity: 200 },
      ],
      totalCapacity: 275,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320351020',
      schoolName: '鶴岡東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 75 },
        { courseName: '体育コース', capacity: 80 },
        { courseName: '普通コース', capacity: 160 },
      ],
      totalCapacity: 315,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320451029',
      schoolName: '酒田南高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学コース・キャリアデザインコース計)', capacity: 200 },
        { courseName: '家庭(食育調理コース)', capacity: 40 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D106320551019',
      schoolName: '新庄東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'Eコース', capacity: 15 },
        { courseName: 'Aコース', capacity: 35 },
        { courseName: 'Sコース', capacity: 105 },
        { courseName: 'Tコース', capacity: 35 },
      ],
      totalCapacity: 190,
      source: SOURCE,
    },
    {
      schoolCode: 'D106321051012',
      schoolName: '創学館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D106320351011',
      schoolName: '羽黒高等学校',
      reason: '育伸社募集要項PDF上に募集定員の数値記載が無く学校HP参照の注記のみだったため確認できなかった',
    },
    {
      schoolCode: 'D106320451010',
      schoolName: '和順館高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D106340151011',
      schoolName: '基督教独立学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
