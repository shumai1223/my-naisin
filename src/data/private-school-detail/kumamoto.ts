/**
 * 熊本県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本県私立中学高等学校協会サイトには募集定員一覧PDFが見当たらなかったが、
 * (株)育伸社(入試情報課)が公表する「2026年度 高専・私立高校 募集要項【熊本県】」
 * (2025年11月4日現在)に学校別・コース別の募集人員が掲載されていることを発見。
 * 民間予備校会社の集計だが兵庫県の同種データで既に採用実績あり(Λ-5兵庫の先例)。
 * 参照台帳25校中、通常の全日制入試日程に掲載されている20校を収録。
 * 複数コースが「普通科計」等の注記付きで同一数値を共有している場合(九州学院の
 * プログレスクラス/アドバンスクラス、ルーテル学院の特進/総合/芸術コース、開新の
 * 普通(特進コース)/普通(普通コース))は合算せず1つの共有コースとして統合記録。
 * 「･」区切りで学科ごとに個別の数値が明記されている場合(開新の工業=自動車80･
 * 機械80･土建80･半導体80、熊本国府のビジネス科=アクティブ160･コンピュータ80)は
 * 学科ごとの独立した募集定員として個別収録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03943.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【熊本県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_KUMAMOTO: PrivateSchoolDetailFile = {
  prefectureCode: 'kumamoto',
  schools: [
    {
      schoolCode: 'D143310000174',
      schoolName: '有明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(特進・進学キャリア・スポーツ総合)', capacity: 80 },
        { courseName: '看護学(5年一貫教育)', capacity: 80 },
        { courseName: '福祉', capacity: 40 },
        { courseName: '機械', capacity: 35 },
        { courseName: '電気情報', capacity: 35 },
      ],
      totalCapacity: 270,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000049',
      schoolName: '開新高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '工業(自動車80+機械80+土建80+半導体80)', capacity: 320 },
        { courseName: '総合', capacity: 80 },
        { courseName: '普通科(特進コース・普通コース計)', capacity: 100 },
      ],
      totalCapacity: 500,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000192',
      schoolName: '菊池女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 35 },
        { courseName: '家庭', capacity: 60 },
      ],
      totalCapacity: 95,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000012',
      schoolName: '九州学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(プログレスクラス・アドバンスクラス計)', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000058',
      schoolName: '熊本学園大学付属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 360 }],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000094',
      schoolName: '熊本国府高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通コース', capacity: 200 },
        { courseName: '特進コース', capacity: 20 },
        { courseName: 'アスリートコース', capacity: 20 },
        { courseName: 'ビジネス科(アクティブ)', capacity: 160 },
        { courseName: 'ビジネス科(コンピュータ)', capacity: 80 },
      ],
      totalCapacity: 480,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000129',
      schoolName: '熊本信愛女学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進選抜コース', capacity: 30 },
        { courseName: 'グローバルコース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 140 },
      ],
      totalCapacity: 210,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000138',
      schoolName: '熊本中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 160 },
        { courseName: '総合ビジネス', capacity: 80 },
        { courseName: '看護学(5年制)', capacity: 80 },
      ],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000101',
      schoolName: '熊本マリスト学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 225 }],
      totalCapacity: 225,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000165',
      schoolName: '秀岳館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 360 }],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000076',
      schoolName: '尚絅高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '総合進学コース', capacity: 290 },
      ],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000218',
      schoolName: '城北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 100 },
        { courseName: '調理', capacity: 60 },
        { courseName: '医療福祉', capacity: 30 },
        { courseName: '看護・看護専攻', capacity: 50 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000183',
      schoolName: '玉名女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 60 },
        { courseName: 'ビジネス', capacity: 40 },
        { courseName: '食物', capacity: 50 },
        { courseName: '看護学', capacity: 60 },
      ],
      totalCapacity: 210,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000209',
      schoolName: '専修大学熊本玉名高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 30 },
        { courseName: '普通コース', capacity: 80 },
        { courseName: '国際ビジネス', capacity: 60 },
        { courseName: '情報メディア', capacity: 40 },
      ],
      totalCapacity: 210,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000021',
      schoolName: '鎮西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(専願生)', capacity: 310 }],
      totalCapacity: 310,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000067',
      schoolName: '東海大学付属熊本星翔高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'アドバンストコース', capacity: 30 },
        { courseName: 'アドバンストスポーツコース', capacity: 40 },
        { courseName: 'アカデミックコース(サイエンスクラス)', capacity: 40 },
        { courseName: 'アカデミックコース(スタンダードクラス)', capacity: 290 },
      ],
      totalCapacity: 400,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000147',
      schoolName: '文徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '東大・医進コース', capacity: 30 },
        { courseName: '進特コース', capacity: 150 },
        { courseName: '普通コース', capacity: 80 },
        { courseName: '理工(特別進学コース)', capacity: 20 },
        { courseName: '理工(専門コース)', capacity: 80 },
      ],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000085',
      schoolName: '慶誠高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 20 },
        { courseName: '進学コース', capacity: 40 },
        { courseName: '教養コース', capacity: 180 },
        { courseName: '食物', capacity: 40 },
      ],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000156',
      schoolName: '八代白百合学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D143310000110',
      schoolName: 'ルーテル学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進・総合・芸術コース計・含内部進学)', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D143310000030',
      schoolName: '真和高等学校',
      reason: '原資料の募集人員が奨学約80・専願約20・一般約20のように全て「約」の概算表記で、合算した確定値としての収録は見送り(捏造ゼロ優先)',
    },
    {
      schoolCode: 'D143310000227',
      schoolName: '勇志国際高等学校',
      reason: '広域通信制のため通常の全日制入試日程一覧に掲載なし',
    },
    {
      schoolCode: 'D143310000236',
      schoolName: '一ツ葉高等学校',
      reason: '広域通信制のため通常の全日制入試日程一覧に掲載なし',
    },
    {
      schoolCode: 'D143310000245',
      schoolName: 'くまもと清陵高等学校',
      reason: '広域通信制のため通常の全日制入試日程一覧に掲載なし',
    },
    {
      schoolCode: 'D143310000254',
      schoolName: 'やまと高等学校',
      reason: '広域通信制のため通常の全日制入試日程一覧に掲載なし',
    },
  ],
};
