/**
 * 群馬県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本・大分・鹿児島・山形に続き(株)育伸社(入試情報課)の「2026年度高専・私立高校
 * 募集要項【群馬県】」(2025年11月4日現在)から学校別・コース別の募集人員を取得。
 * 参照台帳14校中11校を収録(白根開善学校高等部・ぐんま国際アカデミー高等部・
 * Ｒ高校の3校はこのPDFに掲載が無く見送り)。前橋育英・常磐・高崎健康福祉大学高崎・
 * 明和県央のように複数コースが「普通科計X」と注記され同一数値を共有している場合は
 * 合算せず1つの共有コースとして統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03910.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【群馬県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_GUNMA: PrivateSchoolDetailFile = {
  prefectureCode: 'gunma',
  schools: [
    {
      schoolCode: 'D110310000011',
      schoolName: '共愛学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進コース・進学コース計)', capacity: 230 },
        { courseName: '英語科(特進コース・進学コース計)', capacity: 130 },
      ],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000020',
      schoolName: '前橋育英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学選抜クラス・特別進学特進クラス・総合進学コース・スポーツ科学コース・保育コース計)', capacity: 510 },
      ],
      totalCapacity: 510,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000039',
      schoolName: '高崎商科大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学選抜コース', capacity: 50 },
        { courseName: '特別進学コース', capacity: 100 },
        { courseName: '進学コース', capacity: 210 },
        { courseName: '総合ビジネス', capacity: 90 },
      ],
      totalCapacity: 450,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000048',
      schoolName: '東京農業大学第二高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'グローバル・アントレプレナーシップ(GEコース)', capacity: 30 },
        { courseName: 'Ⅰ(進学選抜)コース', capacity: 105 },
        { courseName: 'Ⅱ(自己探究)コース', capacity: 210 },
        { courseName: 'Ⅲ(クラブ選抜)コース', capacity: 105 },
      ],
      totalCapacity: 450,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000057',
      schoolName: '桐生第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 40 },
        { courseName: '進学スポーツコース(男)', capacity: 120 },
        { courseName: '総合コース', capacity: 250 },
        { courseName: '製菓衛生師コース', capacity: 30 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 480,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000066',
      schoolName: '樹徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学探究コース(SSクラス)', capacity: 10 },
        { courseName: '進学探究コース(Kクラス)', capacity: 70 },
        { courseName: '進学探究コース(Sクラス)', capacity: 35 },
        { courseName: 'キャリア探究コース(Jクラス)', capacity: 230 },
      ],
      totalCapacity: 345,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000075',
      schoolName: '常磐高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学・進学・総合・体育コース計)', capacity: 300 }],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000084',
      schoolName: '関東学園大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・進学コース計)', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000093',
      schoolName: '新島学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(併設中学含む)', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000100',
      schoolName: '高崎健康福祉大学高崎高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進・大進・進学・アスリートコース計)', capacity: 460 }],
      totalCapacity: 460,
      source: SOURCE,
    },
    {
      schoolCode: 'D110310000128',
      schoolName: '明和県央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学・N進学・進学・競技スポーツコース計)', capacity: 280 }],
      totalCapacity: 280,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D110310000119',
      schoolName: '白根開善学校高等部',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D110310000137',
      schoolName: 'ぐんま国際アカデミー高等部',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D110310000146',
      schoolName: 'Ｒ高校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
  ],
};
