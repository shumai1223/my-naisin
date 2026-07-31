/**
 * 長崎県私立高等学校の募集定員データ（Λ-5第二段）。
 * 長崎県私立中学高等学校協会が公表する「令和8年度 私立中学高等学校生徒募集一覧（高等学校）」
 * PDF（長崎地区1/長崎地区2/中地区/佐世保地区の4地区に分割・全4頁）から、schools-private/
 * nagasaki.ts（第一段・機械生成の参照台帳）24校中22校を収録できた。佐賀県の県庁PDFと同型の
 * 「協会が地区別に1枚へまとめた一覧」で、個別学校サイト巡回より遥かに効率が良かった。
 *
 * 【重要な発見】原資料が「長崎女子 125」と表記する学校は、schools-private/nagasaki.tsの
 * 「鶴鳴高等学校」(D142310000040)と同一校である。この学校は1997年度〜令和7年度まで
 * 「長崎女子高等学校」を名乗っていたが、令和8年4月1日付で29年ぶりに「鶴鳴高等学校」へ
 * 校名復活した。本募集一覧PDFが対象とする入試（令和8年1月実施・3月入学手続）は校名変更前の
 * 時点で行われるため、原資料の表記がそのまま「長崎女子」となっている（捏造ではなく年度の
 * ねじれによる表記差）。schoolCodeで参照台帳と紐付け、schoolNameは学校コード一覧側の現行名称
 * 「鶴鳴高等学校」を採用しつつsourceに経緯を明記した。
 *
 * こころ未来高等学校・こころ咲良高等学校（第二岩永学園）は広域/狭域通信制高校で、本一覧が
 * 対象とする全日制の一般入試スケジュール形式に馴染まず協会一覧に掲載が無いため、確度の高い
 * 募集定員を確認できず正直にskipped扱いとする。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE_BASE = {
  url: 'http://www.nagasaki-shigaku.jp/koshin_images/files/08koukouseitoboshuu.pdf',
  docTitle: '令和8年度 私立中学高等学校生徒募集一覧（高等学校）（長崎県私立中学高等学校協会）',
  fetchedAt: '2026-07-30',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_NAGASAKI: PrivateSchoolDetailFile = {
  prefectureCode: 'nagasaki',
  schools: [
    {
      schoolCode: 'D142310000013',
      schoolName: '海星高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 340,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区1）' },
    },
    {
      schoolCode: 'D142310000040',
      schoolName: '鶴鳴高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 125,
      source: {
        ...SOURCE_BASE,
        docTitle: SOURCE_BASE.docTitle + '（長崎地区1・原資料表記は「長崎女子」＝令和8年4月の校名復活前の旧称。入試実施は令和8年1-3月で校名変更前のため原資料はこの表記のまま）',
      },
    },
    {
      schoolCode: 'D142310000031',
      schoolName: '活水高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 120,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区1）' },
    },
    {
      schoolCode: 'D142310000086',
      schoolName: '瓊浦高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 280,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区1）' },
    },
    {
      schoolCode: 'D142310000095',
      schoolName: '純心女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 150,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区1）' },
    },
    {
      schoolCode: 'D142310000077',
      schoolName: '聖母の騎士高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 40,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区1）' },
    },
    {
      schoolCode: 'D142310000068',
      schoolName: '長崎女子商業高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 140,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区2）' },
    },
    {
      schoolCode: 'D142310000111',
      schoolName: '長崎総合科学大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 140,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区2）' },
    },
    {
      schoolCode: 'D142310000022',
      schoolName: '長崎南山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 200,
      source: {
        ...SOURCE_BASE,
        docTitle: SOURCE_BASE.docTitle + '（長崎地区2・募集定員には併設中学校からの進学者を含むと原資料に注記）',
      },
    },
    {
      schoolCode: 'D142310000219',
      schoolName: '青雲高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 250,
      source: {
        ...SOURCE_BASE,
        docTitle: SOURCE_BASE.docTitle + '（長崎地区2・募集定員には併設中学校からの進学者を含むと原資料に注記）',
      },
    },
    {
      schoolCode: 'D142310000228',
      schoolName: '精道三川台高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 40,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（長崎地区2）' },
    },
    {
      schoolCode: 'D142310000059',
      schoolName: '長崎玉成高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 155,
      source: {
        ...SOURCE_BASE,
        docTitle: SOURCE_BASE.docTitle + '（長崎地区2・募集定員には併設中学校からの進学者を含むと原資料に注記）',
      },
    },
    {
      schoolCode: 'D142310000184',
      schoolName: '鎮西学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 300,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（中地区）' },
    },
    {
      schoolCode: 'D142310000193',
      schoolName: '長崎日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 400,
      source: {
        ...SOURCE_BASE,
        docTitle: SOURCE_BASE.docTitle + '（中地区・募集定員には併設中学校からの進学者を含むと原資料に注記）',
      },
    },
    {
      schoolCode: 'D142310000200',
      schoolName: '向陽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 240,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（中地区）' },
    },
    {
      schoolCode: 'D142310000175',
      schoolName: '島原中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 65,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（中地区）' },
    },
    {
      schoolCode: 'D142310000102',
      schoolName: '創成館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 270,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（中地区）' },
    },
    {
      schoolCode: 'D142310000157',
      schoolName: '九州文化学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 280,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（佐世保地区）' },
    },
    {
      schoolCode: 'D142310000120',
      schoolName: '西海学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 140,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（佐世保地区）' },
    },
    {
      schoolCode: 'D142310000139',
      schoolName: '久田学園佐世保女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 40,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（佐世保地区）' },
    },
    {
      schoolCode: 'D142310000148',
      schoolName: '聖和女子学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 80,
      source: {
        ...SOURCE_BASE,
        docTitle: SOURCE_BASE.docTitle + '（佐世保地区・募集定員には併設中学校からの進学者を含むと原資料に注記）',
      },
    },
    {
      schoolCode: 'D142310000166',
      schoolName: '佐世保実業高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 160,
      source: { ...SOURCE_BASE, docTitle: SOURCE_BASE.docTitle + '（佐世保地区）' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D142310000237',
      schoolName: 'こころ未来高等学校',
      reason: '広域通信制高校（第二岩永学園・弥生町キャンパス）。長崎県私立中学高等学校協会が公表する全日制向け募集一覧に掲載が無く、通信制は入試スケジュール形式が全日制と異なり確度の高い募集定員を確認できなかった',
    },
    {
      schoolCode: 'D142310000246',
      schoolName: 'こころ咲良高等学校',
      reason: '狭域通信制高校（第二岩永学園・愛宕キャンパス）。長崎県私立中学高等学校協会が公表する全日制向け募集一覧に掲載が無く、通信制は入試スケジュール形式が全日制と異なり確度の高い募集定員を確認できなかった',
    },
  ],
};
