/**
 * 広島県私立高等学校の募集定員データ(Λ-5第二段)。
 * 広島県私学協会サイトには一括PDFへのリンクが見当たらなかったが、熊本・大分・
 * 鹿児島・山形・群馬・茨城・山口に続き(株)育伸社(入試情報課)の「2026年度国立
 * 高校・高専・私立高校募集要項【広島県】」(2025年11月4日現在)から学校別・
 * コース別の募集人員を取得。参照台帳40校中32校を収録。広島女学院・ノートルダム
 * 清心・広島学院・並木学院・東林館(本校・呉分校)・並木学院福山・シンギュラリティ
 * の8校はこのPDFに掲載が無く見送り(広島学院・ノートルダム清心・広島女学院は
 * 独自の入試日程を持つ難関校で別枠掲載の可能性、他は通信制/新設校の可能性)。
 * 崇徳は「推薦100・一般312」のように推薦時点と一般時点で異なる募集人員が
 * 記載されており、一般時点のより大きい数値を採用。広島新庄は「推薦約80・
 * 一般約40」という記法(3コースで共有)を推薦分+一般分の合計120として解釈した。
 * 複数コースが「普通科計X」「全科計X」と注記され同一数値を共有している場合は
 * 合算せず1つの共有コースとして統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03934.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【広島県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_HIROSHIMA: PrivateSchoolDetailFile = {
  prefectureCode: 'hiroshima',
  schools: [
    {
      schoolCode: 'D134310000013',
      schoolName: '修道高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(内部287含む・約300)', capacity: 300 }],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000022',
      schoolName: '崇徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・進学コース計・一般時点)', capacity: 312 }],
      totalCapacity: 312,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000031',
      schoolName: '広陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '難関コース(約70)', capacity: 70 },
        { courseName: '総合進学クラス(約430)', capacity: 430 },
      ],
      totalCapacity: 500,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000040',
      schoolName: '山陽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進フロンティアコース', capacity: 20 },
        { courseName: '特進コース', capacity: 40 },
        { courseName: '選抜コース', capacity: 80 },
        { courseName: '進学コース', capacity: 180 },
        { courseName: '工学', capacity: 70 },
      ],
      totalCapacity: 390,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000059',
      schoolName: '広島県瀬戸内高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学探究コース', capacity: 40 },
        { courseName: '探究コース', capacity: 300 },
        { courseName: 'ビューティースタイリストコース', capacity: 20 },
      ],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000068',
      schoolName: '広島桜が丘高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 300 }],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000077',
      schoolName: '進徳女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(総合コース・選抜コース計)', capacity: 130 },
        { courseName: '国際食育デザイン', capacity: 70 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000086',
      schoolName: '安田女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(帰国含む)', capacity: 80 }],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000095',
      schoolName: '比治山女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学コース・文理進学コース・国際共生コース計・約200・2026年度より比治山学園に校名変更し共学化)', capacity: 200 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000120',
      schoolName: '広島翔洋高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(内推薦約50%)', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000148',
      schoolName: '広島工業大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学類型・総合進学類型・K-STEAM類型計・内推薦約60%)', capacity: 400 }],
      totalCapacity: 400,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000166',
      schoolName: '広島城北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 80 }],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000175',
      schoolName: '広島なぎさ高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 25 }],
      totalCapacity: 25,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000184',
      schoolName: '呉港高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進コース・進学コース計)', capacity: 105 },
        { courseName: '機械', capacity: 80 },
        { courseName: '情報システム', capacity: 40 },
      ],
      totalCapacity: 225,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000193',
      schoolName: '清水ケ丘高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学コース・進学コース計)', capacity: 80 },
        { courseName: '総合ビジネス', capacity: 35 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 155,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000200',
      schoolName: '呉青山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部)', capacity: 70 }],
      totalCapacity: 70,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000219',
      schoolName: '如水館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '難関特進S類', capacity: 80 },
        { courseName: '特進A類', capacity: 80 },
        { courseName: '総合進学B類', capacity: 120 },
      ],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000228',
      schoolName: '広島三育学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 90 }],
      totalCapacity: 90,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000237',
      schoolName: '尾道高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別入試・含内部)', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000246',
      schoolName: '盈進高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 40 },
        { courseName: '進学コース', capacity: 120 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000255',
      schoolName: '福山暁の星女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '学究コース・探究コース(含内部)', capacity: 90 }],
      totalCapacity: 90,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000264',
      schoolName: '近畿大学附属広島高等学校福山校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別選抜コース(含内部)', capacity: 20 },
        { courseName: '進学コース(含内部)', capacity: 40 },
        { courseName: '総合進学コース(含内部)', capacity: 120 },
        { courseName: 'スポーツコース(含内部)', capacity: 40 },
      ],
      totalCapacity: 220,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000273',
      schoolName: '銀河学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部)', capacity: 210 }],
      totalCapacity: 210,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000282',
      schoolName: '英数学館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学クラス・総合進学クラス・IBクラス計・含内部)', capacity: 90 }],
      totalCapacity: 90,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000291',
      schoolName: '広島国際学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(難関コース・特進コース・選抜進学コース・総合進学コース計・含内部)', capacity: 440 },
      ],
      totalCapacity: 440,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000308',
      schoolName: '山陽女学園高等部',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '全科(S特進コース・文系特進コース・理系特進コース・総合進学コース・こども教育コース・パティシエコース計)',
          capacity: 140,
        },
      ],
      totalCapacity: 140,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000317',
      schoolName: 'ＡＩＣＪ高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(東医・早慶国立大・IBDPコース・含内部約110)', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000326',
      schoolName: '広島文教大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学クラス・総合進学クラス計)', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000335',
      schoolName: '広島修道大学ひろしま協創高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学コース(含内部)', capacity: 160 },
        { courseName: '特別進学コース(含内部)', capacity: 60 },
      ],
      totalCapacity: 220,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000344',
      schoolName: '広島新庄高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(スーパー特進コース・特進コース・社会探究コース計・推薦約80+一般約40)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000353',
      schoolName: '武田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(GAコース・GBコース計・約160含内部)', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D134310000362',
      schoolName: '近畿大学附属広島高等学校東広島校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(ADⅠコース・ADⅡコース計・約220含内部)', capacity: 220 }],
      totalCapacity: 220,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D134310000102',
      schoolName: '広島女学院高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000111',
      schoolName: 'ノートルダム清心高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000157',
      schoolName: '広島学院高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000371',
      schoolName: '並木学院高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000380',
      schoolName: '東林館高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000399',
      schoolName: '東林館高等学校呉分校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000406',
      schoolName: '並木学院福山高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D134310000415',
      schoolName: 'シンギュラリティ高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(新設校の可能性)',
    },
  ],
};
