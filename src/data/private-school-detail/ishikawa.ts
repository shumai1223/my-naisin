/**
 * 石川県私立高等学校の募集定員データ(Λ-5第二段)。
 * (株)育伸社 入試情報課が集計する「2026年度 国立高校・高専・私立高校 募集要項【石川県】」
 * (2025年11月4日現在)に、県内の国立/高専/私立高校の学科別募集定員が1枚の表にまとまって
 * いた(佐賀/富山/滋賀に続く高効率パターン・ただし出典は県庁/協会でなく民間教育情報会社の
 * 集計である点に留意)。国立(金沢大学附属)・高専(石川工業高専・私立国際高専)は対象外。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03917.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【石川県】(株式会社育伸社 入試情報課・2025年11月4日現在)',
  fetchedAt: '2026-07-30',
};

export const PRIVATE_SCHOOL_DETAIL_ISHIKAWA: PrivateSchoolDetailFile = {
  prefectureCode: 'ishikawa',
  schools: [
    {
      schoolCode: 'D117320100012',
      schoolName: '金沢高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Sコース', capacity: 70 },
        { courseName: '特進コース', capacity: 70 },
        { courseName: '進学コース', capacity: 280 },
      ],
      totalCapacity: 420,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320100021',
      schoolName: '金沢学院大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース', capacity: 60 },
        { courseName: '総合進学コース', capacity: 175 },
        { courseName: 'スポーツコース', capacity: 105 },
        { courseName: '芸術デザインコース', capacity: 35 },
      ],
      totalCapacity: 375,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320100030',
      schoolName: '遊学館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通科', capacity: 440 }],
      totalCapacity: 440,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320100049',
      schoolName: '金沢龍谷高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通科', capacity: 280 }],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320100058',
      schoolName: '北陸学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通科(特別進学コース・総合進学コース計)', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320100067',
      schoolName: '星稜高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Aコース', capacity: 70 },
        { courseName: 'Bコース', capacity: 280 },
        { courseName: 'Pコース', capacity: 50 },
      ],
      totalCapacity: 400,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(Pコースは一般入試の追加若干名を含まず推薦分50名のみ集計)' },
    },
    {
      schoolCode: 'D117320100076',
      schoolName: '金沢学院大学附属第二高等学校',
      fiscalYearLabel: '2026年度(2026年4月開校・第1期生募集分)',
      courses: [
        { courseName: '特進コース', capacity: 35 },
        { courseName: '総合コース', capacity: 35 },
        { courseName: '特進コース特別クラス', capacity: 35 },
      ],
      totalCapacity: 105,
      source: {
        url: 'https://www.kanazawa-gu.ac.jp/hs2/',
        docTitle: '金沢学院大学附属第二高等学校 公式サイト(2026年4月開校・コース別定員案内)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D117320200011',
      schoolName: '鵬学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科', capacity: 90 },
        { courseName: '調理科', capacity: 30 },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320300010',
      schoolName: '小松大谷高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科(特進コース・進学コース・教養コース計)', capacity: 260 },
        { courseName: '体育コース', capacity: 40 },
      ],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D117320400019',
      schoolName: '日本航空高等学校石川',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '航空科(航空工学コース・普通科コース計)', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D117321000011',
      schoolName: '叡明館（高等部）',
      reason: '学校法人叡明館中等部・高等部は既に休校(事実上の閉校)状態にあり、現行の生徒募集情報が存在しない。',
    },
    {
      schoolCode: 'D117321000020',
      schoolName: '美川特区アットマーク国際高等学校',
      reason: '内閣府・文部科学省認定の「美川教育特区」による広域通信制・単位制高校であり、都道府県別の募集定員という概念が無い。',
    },
  ],
};
