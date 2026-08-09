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
 *
 * 【掛-2（私立×多年度）着手時の再検証(2026-08-09)】miyagi/oita/kagoshimaで発覚した
 * 誤りを警戒し全20校の令和8年度データをpdftotext -layout+pdftoppm(300dpi画像)で
 * 現行PDFと再突合したが、kumamotoでは誤りは見つからず全校が正しい値だった。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03943.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月12日キャプチャ分(「2024年度版・2024年1月10日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果、**総定員は20校全てで
 * 完全に一致**(熊本県は容量変化ゼロ)。ただし内部のコース構成が大きく変化した学校が
 * 複数あった: 秀岳館(2024年度は普通220・商業60・建設工業80の3コース制だったが
 * 2026年度は商業・建設工業が廃止され単一の「普通」360へ統合)、東海大学付属熊本星翔
 * (2024年度は「普通(含特進1クラス)」400の単一コースだったが2026年度はアドバンスト
 * ・アドバンストスポーツ・アカデミック(サイエンス/スタンダード)の4コースへ再編、
 * 現行PDF自体に「※新設」「※普通科→アカデミックコーススタンダードクラス」の
 * 改称注記あり)、城北(普通80→100・医療福祉40→30・看護看護専攻60→50とコース間で
 * 定員が再配分)、菊池女子(2024年度は普通・家庭の2コースが「全科計95」という単一
 * 共有枠だったが2026年度は35+60=95と個別の定員に明示分割)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03943.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【熊本県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240812195841if_/https://www.ikushin.co.jp/school/pdf/03943.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【熊本県】(株式会社育伸社 入試情報課・2024年1月10日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
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
    {
      schoolCode: 'D143310000174',
      schoolName: '有明高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(特進20+進学20+キャリア20+スポーツ20)', capacity: 80 },
        { courseName: '看護学(5年一貫教育)', capacity: 80 },
        { courseName: '福祉', capacity: 40 },
        { courseName: '機械', capacity: 35 },
        { courseName: '電気情報', capacity: 35 },
      ],
      totalCapacity: 270,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000049',
      schoolName: '開新高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '工業(自動車80+機械80+土建80+電情80)', capacity: 320 },
        { courseName: '総合', capacity: 80 },
        { courseName: '普通科(特進コース・普通コース計)', capacity: 100 },
      ],
      totalCapacity: 500,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一。工業の電情学科が半導体学科へ改称)',
      },
    },
    {
      schoolCode: 'D143310000192',
      schoolName: '菊池女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通・家庭(全科計)', capacity: 95 }],
      totalCapacity: 95,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員95は2026年度と同一。2024年度は普通・家庭の2コースが「全科計95」の単一共有枠だったが2026年度は35+60に個別分割)',
      },
    },
    {
      schoolCode: 'D143310000012',
      schoolName: '九州学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(プログレスクラス・アドバンスクラス計)', capacity: 320 }],
      totalCapacity: 320,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000058',
      schoolName: '熊本学園大学付属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 360 }],
      totalCapacity: 360,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000094',
      schoolName: '熊本国府高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通コース', capacity: 200 },
        { courseName: '特進コース', capacity: 20 },
        { courseName: 'アスリートコース', capacity: 20 },
        { courseName: 'ビジネス科(アクティブ)', capacity: 160 },
        { courseName: 'ビジネス科(コンピュータ)', capacity: 80 },
      ],
      totalCapacity: 480,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000129',
      schoolName: '熊本信愛女学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進選抜コース', capacity: 30 },
        { courseName: 'グローバルコース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 140 },
      ],
      totalCapacity: 210,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000138',
      schoolName: '熊本中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 160 },
        { courseName: '総合ビジネス', capacity: 80 },
        { courseName: '看護学(5年制)', capacity: 80 },
      ],
      totalCapacity: 320,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000101',
      schoolName: '熊本マリスト学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 225 }],
      totalCapacity: 225,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000165',
      schoolName: '秀岳館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 220 },
        { courseName: '商業', capacity: 60 },
        { courseName: '建設工業', capacity: 80 },
      ],
      totalCapacity: 360,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員360は2026年度と同一。商業・建設工業コースが廃止され単一の「普通」360へ統合)',
      },
    },
    {
      schoolCode: 'D143310000076',
      schoolName: '尚絅高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '総合進学コース', capacity: 290 },
      ],
      totalCapacity: 320,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000218',
      schoolName: '城北高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '調理', capacity: 60 },
        { courseName: '医療福祉', capacity: 40 },
        { courseName: '看護・看護専攻', capacity: 60 },
      ],
      totalCapacity: 240,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員240は2026年度と同一。普通80→100・医療福祉40→30・看護看護専攻60→50に再配分)',
      },
    },
    {
      schoolCode: 'D143310000183',
      schoolName: '玉名女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(含特進10程度)', capacity: 60 },
        { courseName: 'ビジネス', capacity: 40 },
        { courseName: '食物', capacity: 50 },
        { courseName: '看護学', capacity: 60 },
      ],
      totalCapacity: 210,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000209',
      schoolName: '専修大学熊本玉名高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(旧文理選抜コース)', capacity: 30 },
        { courseName: '普通コース(旧スタンダードコース)', capacity: 80 },
        { courseName: '国際ビジネス', capacity: 60 },
        { courseName: '情報メディア', capacity: 40 },
      ],
      totalCapacity: 210,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000021',
      schoolName: '鎮西高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(専願生)', capacity: 310 }],
      totalCapacity: 310,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000067',
      schoolName: '東海大学付属熊本星翔高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含特進1クラス)', capacity: 400 }],
      totalCapacity: 400,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員400は2026年度と同一。2024年度の単一「普通」コースが2026年度はアドバンスト・アドバンストスポーツ・アカデミック(サイエンス/スタンダード)の4コースへ再編・現行PDFに「※新設」「※普通科→アカデミックコーススタンダードクラス」の改称注記あり)',
      },
    },
    {
      schoolCode: 'D143310000147',
      schoolName: '文徳高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '東大・医進コース', capacity: 30 },
        { courseName: '進特コース', capacity: 150 },
        { courseName: '普通コース', capacity: 80 },
        { courseName: '理工(特別進学コース)', capacity: 20 },
        { courseName: '理工(専門コース)', capacity: 80 },
      ],
      totalCapacity: 360,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000085',
      schoolName: '慶誠高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 20 },
        { courseName: '進学コース', capacity: 40 },
        { courseName: '教養コース', capacity: 180 },
        { courseName: '食物', capacity: 40 },
      ],
      totalCapacity: 280,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000156',
      schoolName: '八代白百合学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 160 }],
      totalCapacity: 160,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D143310000110',
      schoolName: 'ルーテル学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特進・総合・芸術コース計・含内部進学)', capacity: 320 }],
      totalCapacity: 320,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
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
