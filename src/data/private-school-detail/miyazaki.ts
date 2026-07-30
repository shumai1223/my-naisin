/**
 * 宮崎県私立高等学校の募集定員データ(Λ-5第二段)。
 * schools-private/miyazaki.ts(第一段・機械生成の参照台帳)14校のうち、確度高く確認できた
 * 4校を収録。宮崎県には佐賀/香川のような県庁・協会一括PDFが見当たらず、学校ごとの個別
 * 調査(公式サイトの令和8年度入学試験要項PDF)で進めている。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_MIYAZAKI: PrivateSchoolDetailFile = {
  prefectureCode: 'miyazaki',
  schools: [
    {
      schoolCode: 'D145320159027',
      schoolName: '宮崎学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進科', capacity: 110 },
        { courseName: '普通科(総合進学/グローバル/スポーツ科学/音楽/幼児保育コース計)', capacity: 170 },
        { courseName: '経営情報科', capacity: 60 },
      ],
      totalCapacity: 340,
      source: {
        url: 'https://www.miyagaku.ed.jp/wp-miyagaku/wp-content/uploads/2025/10/令和８年度入試要項.pdf',
        docTitle: '令和8年度 入学試験要項｜宮崎学園高等学校(専願受験の募集定員表・110+170+60=340で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159045',
      schoolName: '宮崎日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学科', capacity: 140 },
        { courseName: '総合進学科', capacity: 175 },
        { courseName: '英語進学科', capacity: 60 },
        { courseName: '芸術学科', capacity: 60 },
        { courseName: 'ICTソリューション学科', capacity: 65 },
      ],
      totalCapacity: 500,
      source: {
        url: 'https://www.m-nichidai.com/highschool/high_exam/high_pref/',
        docTitle: '入試情報(学科別募集定員)｜宮崎日本大学高等学校公式サイト(140+175+60+60+65=500で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159063',
      schoolName: '宮崎第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理科(内部進学生含む)', capacity: 140 },
        { courseName: '普通科', capacity: 60 },
        { courseName: '国際マルチメディア科', capacity: 60 },
        { courseName: '電気科', capacity: 40 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://miyaichi.ed.jp/hs/entry/',
        docTitle: '入試要項(学科別募集定員)｜宮崎第一中学高等学校公式サイト',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159072',
      schoolName: '日章学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学科(特別進学コース+特別アスリートコース)', capacity: 40 },
        { courseName: '普通科 共生コース', capacity: 20 },
        { courseName: '普通科 スポーツ進学コース', capacity: 35 },
        { courseName: '普通科 経営情報コース', capacity: 20 },
        { courseName: 'ヘアーデザイン科', capacity: 40 },
        { courseName: 'パティシエ科', capacity: 30 },
        { courseName: '福祉科', capacity: 25 },
        { courseName: 'トータルエステティック科', capacity: 30 },
        { courseName: '調理科', capacity: 120 },
        { courseName: 'コンピュータ科', capacity: 30 },
        { courseName: '電気科', capacity: 30 },
        { courseName: '自動車科', capacity: 30 },
      ],
      totalCapacity: 450,
      source: {
        url: 'https://nissho.ed.jp/wp-content/uploads/2025/10/2026youkou.pdf',
        docTitle: '令和8年度 募集要項｜日章学園高等学校(設置学科・募集定員表、自動車科は表中「30名(35名)」の併記だが本体数値30名を採用・合計450名と完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
  ],
  skipped: [],
};
