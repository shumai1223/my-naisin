/**
 * 鹿児島県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本・大分に続き(株)育伸社(入試情報課)の「2026年度高専・私立高校募集要項【鹿児島県】」
 * (2025年11月4日現在)から学校別・コース別の募集人員を取得。参照台帳22校中21校を収録
 * (屋久島おおぞら高等学校のみこのPDFに掲載が無く見送り＝広域通信制の可能性)。
 * 大口明光学園のグローバル・アドバンスコース(進学クラス/難関大クラス)、鹿児島の
 * 選抜コース/一般コース、れいめいのみらい探究コース/キャリアアップコースのように
 * 「普通科計X」と注記され複数コースで同一数値を共有している場合は合算せず1つの
 * 共有コースとして統合記録した。龍桜高等学校の「ｲﾝｸﾞﾄｸﾘｴｲﾄ」コースは原資料の
 * 半角カタカナ表記をそのまま転記した(OCR的に読み取りにくい表記だが数値40は明瞭)。
 *
 * 【掛-2（私立×多年度）着手時に発見した誤り(2026-08-09是正)】miyagi/oitaと同型の
 * 誤りを警戒し全21校をpdftoppm(300dpi画像)で直接目視再確認したところ、2校で誤りを
 * 発見した。出水中央は「特進課程35・教養課程40・普通課程40・医療福祉科40・
 * 看護学科80＝235」が正しいが、ts上は看護学科が丸ごと欠落し普通課程の値も誤って
 * 80(実際は40)と記録され総定員195になっていた。鹿児島第一は正しくは「普通155
 * (含内部・推薦約40)」だが、ts上は桁落ちと見られる誤りで55とだけ記録されていた。
 * 両校とも是正済み。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03946.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月13日キャプチャ分(「2024年度版・2023年11月29日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果(上記の是正を反映した
 * 21校で比較)、**総定員は21校全てで完全に一致**(鹿児島県は容量変化ゼロ)。ただし
 * 内部のコース構成が大きく変化した学校が複数あった: 鹿児島純心女子(2024年度は
 * S特進・選抜・英語・本科の4コース制だったが2026年度はS特進・G探究の2コース制へ
 * 統合)、鳳凰(2024年度はメディカルシステム・総合福祉・特進コースの3コースだったが
 * 2026年度は普通科の中の未来/ビジネス/福祉/スポーツ4系統へ再編)、鹿児島(2024年度の
 * 単一「普通」270が2026年度に選抜コース・一般コースへ名目分割)、尚志館・出水中央
 * (コース間で定員が数名〜十数名再配分)。樟南第二の工業コース・龍桜のイングトクリエイト
 * コースは2024年度PDFに「※男子→共学」「※女子→共学」の注記があり、既にこの時点で
 * 共学化されていたことが分かる。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03946.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【鹿児島県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240813182405if_/https://www.ikushin.co.jp/school/pdf/03946.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【鹿児島県】(株式会社育伸社 入試情報課・2023年11月29日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_KAGOSHIMA: PrivateSchoolDetailFile = {
  prefectureCode: 'kagoshima',
  schools: [
    {
      schoolCode: 'D146310000019',
      schoolName: '鹿児島実業高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理コース', capacity: 60 },
        { courseName: '普通コース', capacity: 120 },
        { courseName: '総合コース', capacity: 270 },
      ],
      totalCapacity: 450,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000028',
      schoolName: 'れいめい高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理', capacity: 60 },
        { courseName: '普通科(みらい探究コース・キャリアアップコース計)', capacity: 100 },
        { courseName: '工学', capacity: 40 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000037',
      schoolName: '樟南高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理コース', capacity: 40 },
        { courseName: '英数コース', capacity: 90 },
        { courseName: '未来創造コース', capacity: 100 },
        { courseName: '商業(特進ビジネスコース+資格キャリアコース)', capacity: 80 },
        { courseName: '工業(機械工学+電気工学+自動車工学コース)', capacity: 70 },
      ],
      totalCapacity: 380,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000046',
      schoolName: '樟南第二高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 40 },
        { courseName: '商業', capacity: 80 },
        { courseName: '工業', capacity: 20 },
      ],
      totalCapacity: 140,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000055',
      schoolName: '鹿児島城西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'ヘアーデザイン', capacity: 30 },
        { courseName: 'トータルエステティック', capacity: 20 },
        { courseName: '進学体育', capacity: 55 },
        { courseName: '普通', capacity: 115 },
        { courseName: '社会福祉', capacity: 20 },
        { courseName: 'ホテル観光', capacity: 20 },
        { courseName: '調理', capacity: 80 },
        { courseName: 'ビジネス情報', capacity: 20 },
        { courseName: 'ファッションデザイン', capacity: 20 },
      ],
      totalCapacity: 380,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000064',
      schoolName: '鹿児島高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '英数(特進コース・英数コース)', capacity: 120 },
        { courseName: '普通科(選抜コース・一般コース計)', capacity: 270 },
        { courseName: '情報ビジネス', capacity: 120 },
      ],
      totalCapacity: 510,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000073',
      schoolName: '鹿児島純心女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'S特進コース', capacity: 80 },
        { courseName: 'G探究コース', capacity: 120 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000082',
      schoolName: '鹿児島情報高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'e-プレップ', capacity: 25 },
        { courseName: 'プレップ', capacity: 25 },
        { courseName: '普通', capacity: 40 },
        { courseName: '情報システム(AI30+システム50)', capacity: 80 },
        { courseName: 'マルチメディア', capacity: 120 },
        { courseName: '自動車工学', capacity: 50 },
        { courseName: 'メカトロニクス', capacity: 30 },
        { courseName: '情報処理', capacity: 80 },
      ],
      totalCapacity: 450,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000091',
      schoolName: 'ラ・サール高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000108',
      schoolName: '龍桜高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '看護学', capacity: 80 },
        { courseName: '医療福祉', capacity: 35 },
        { courseName: 'ｲﾝｸﾞﾄｸﾘｴｲﾄ', capacity: 40 },
      ],
      totalCapacity: 155,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000117',
      schoolName: '鳳凰高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(未来創造35+ビジネス35+福祉30+スポーツ探究40)', capacity: 140 },
        { courseName: '文理', capacity: 30 },
        { courseName: '看護', capacity: 200 },
      ],
      totalCapacity: 370,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000126',
      schoolName: '神村学園高等部',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理', capacity: 40 },
        { courseName: '普通', capacity: 120 },
        { courseName: '看護学', capacity: 120 },
        { courseName: '保育', capacity: 40 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000135',
      schoolName: '出水中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科特進課程', capacity: 35 },
        { courseName: '普通科教養課程', capacity: 40 },
        { courseName: '普通科普通課程', capacity: 40 },
        { courseName: '医療福祉科', capacity: 40 },
        { courseName: '看護学科', capacity: 80 },
      ],
      totalCapacity: 235,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000144',
      schoolName: '大口明光学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: 'グローバル・アドバンスコース(進学クラス・難関大クラス計)', capacity: 100 }],
      totalCapacity: 100,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000153',
      schoolName: '鹿児島第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部・推薦約40)', capacity: 155 }],
      totalCapacity: 155,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000162',
      schoolName: '鹿屋中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理コース', capacity: 25 },
        { courseName: '進学コース', capacity: 30 },
        { courseName: '体育コース', capacity: 40 },
        { courseName: '教養コース', capacity: 80 },
        { courseName: '調理コース', capacity: 40 },
        { courseName: '食物コース', capacity: 40 },
      ],
      totalCapacity: 255,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000171',
      schoolName: '尚志館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進', capacity: 30 },
        { courseName: '普通', capacity: 40 },
        { courseName: '商業', capacity: 35 },
        { courseName: '建設工業', capacity: 30 },
        { courseName: '医療福祉', capacity: 25 },
        { courseName: '看護学', capacity: 40 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000180',
      schoolName: '志學館高等部高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000199',
      schoolName: '池田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(県外募集含む・含内部進学)', capacity: 130 }],
      totalCapacity: 130,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000206',
      schoolName: '鹿児島育英館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 40 }],
      totalCapacity: 40,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000215',
      schoolName: '鹿児島修学館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 80 }],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D146310000019',
      schoolName: '鹿児島実業高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理コース', capacity: 60 },
        { courseName: '普通コース', capacity: 120 },
        { courseName: '総合コース', capacity: 270 },
      ],
      totalCapacity: 450,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000028',
      schoolName: 'れいめい高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理', capacity: 60 },
        { courseName: '普通科(みらい探究コース・キャリアアップコース計)', capacity: 100 },
        { courseName: '工学', capacity: 40 },
      ],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000037',
      schoolName: '樟南高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理コース', capacity: 40 },
        { courseName: '英数コース', capacity: 90 },
        { courseName: '未来創造コース', capacity: 100 },
        { courseName: '商業(資格60+特進ビジネス20)', capacity: 80 },
        { courseName: '工業(機械25+電気25+自動車20)', capacity: 70 },
      ],
      totalCapacity: 380,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000046',
      schoolName: '樟南第二高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 40 },
        { courseName: '商業', capacity: 80 },
        { courseName: '工業(※男子→共学)', capacity: 20 },
      ],
      totalCapacity: 140,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000055',
      schoolName: '鹿児島城西高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'ヘアーデザイン', capacity: 30 },
        { courseName: 'トータルエステティック', capacity: 20 },
        { courseName: '進学体育', capacity: 55 },
        { courseName: '普通', capacity: 115 },
        { courseName: '社会福祉', capacity: 20 },
        { courseName: 'ホテル観光', capacity: 20 },
        { courseName: '調理', capacity: 80 },
        { courseName: 'ビジネス情報', capacity: 20 },
        { courseName: 'ファッションデザイン', capacity: 20 },
      ],
      totalCapacity: 380,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000064',
      schoolName: '鹿児島高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '英数', capacity: 120 },
        { courseName: '普通', capacity: 270 },
        { courseName: '情報ビジネス', capacity: 120 },
      ],
      totalCapacity: 510,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員510は2026年度と同一。単一の「普通」270が2026年度に選抜コース・一般コースへ名目分割)',
      },
    },
    {
      schoolCode: 'D146310000073',
      schoolName: '鹿児島純心女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'S特進コース', capacity: 30 },
        { courseName: '選抜コース', capacity: 40 },
        { courseName: '英語コース', capacity: 40 },
        { courseName: '本科コース', capacity: 90 },
      ],
      totalCapacity: 200,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員200は2026年度と同一。2024年度のS特進・選抜・英語・本科の4コース制が2026年度はS特進(80)・G探究(120)の2コース制へ統合)',
      },
    },
    {
      schoolCode: 'D146310000082',
      schoolName: '鹿児島情報高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'e-プレップ', capacity: 25 },
        { courseName: 'プレップ', capacity: 25 },
        { courseName: '普通', capacity: 40 },
        { courseName: '情報システム(特進30+システム50)', capacity: 80 },
        { courseName: 'マルチメディア', capacity: 120 },
        { courseName: '自動車工学', capacity: 50 },
        { courseName: 'メカトロニクス', capacity: 30 },
        { courseName: '情報処理', capacity: 80 },
      ],
      totalCapacity: 450,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000091',
      schoolName: 'ラ・サール高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 240 }],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000108',
      schoolName: '龍桜高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '看護学', capacity: 80 },
        { courseName: '医療福祉', capacity: 35 },
        { courseName: 'ｲﾝｸﾞﾄｸﾘｴｲﾄ(※女子→共学)', capacity: 40 },
      ],
      totalCapacity: 155,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000117',
      schoolName: '鳳凰高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'メディカルシステム', capacity: 40 },
        { courseName: '総合福祉', capacity: 40 },
        { courseName: '特進コース', capacity: 60 },
        { courseName: '文理コース', capacity: 30 },
        { courseName: '看護学', capacity: 200 },
      ],
      totalCapacity: 370,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員370は2026年度と同一。2024年度のメディカルシステム・総合福祉・特進コースの3コース(計140)が2026年度は普通科内の未来/ビジネス/福祉/スポーツ4系統(計140)へ再編)',
      },
    },
    {
      schoolCode: 'D146310000126',
      schoolName: '神村学園高等部',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理', capacity: 40 },
        { courseName: '普通(英語国際コース・特別能力コース)', capacity: 120 },
        { courseName: '看護学', capacity: 120 },
        { courseName: '保育', capacity: 40 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 360,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000135',
      schoolName: '出水中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科特進課程', capacity: 50 },
        { courseName: '普通科教養課程', capacity: 30 },
        { courseName: '普通科普通課程', capacity: 35 },
        { courseName: '医療福祉科', capacity: 40 },
        { courseName: '看護学科', capacity: 80 },
      ],
      totalCapacity: 235,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員235は2026年度と同一。特進課程50→35・教養課程30→40・普通課程35→40とコース間で定員が再配分)',
      },
    },
    {
      schoolCode: 'D146310000144',
      schoolName: '大口明光学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: 'グローバル・アドバンスコース(進学クラス・難関大クラス計)', capacity: 100 }],
      totalCapacity: 100,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000153',
      schoolName: '鹿児島第一高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含内部・推薦約40)', capacity: 155 }],
      totalCapacity: 155,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000162',
      schoolName: '鹿屋中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理コース', capacity: 25 },
        { courseName: '進学コース', capacity: 30 },
        { courseName: '体育コース', capacity: 40 },
        { courseName: '教養コース', capacity: 80 },
        { courseName: '調理コース', capacity: 40 },
        { courseName: '食物コース', capacity: 40 },
      ],
      totalCapacity: 255,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000171',
      schoolName: '尚志館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進', capacity: 30 },
        { courseName: '普通', capacity: 40 },
        { courseName: '商業', capacity: 30 },
        { courseName: '建設工業', capacity: 30 },
        { courseName: '医療福祉', capacity: 30 },
        { courseName: '看護学', capacity: 40 },
      ],
      totalCapacity: 200,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員200は2026年度と同一。商業30→35・医療福祉30→25とコース間で定員が再配分)',
      },
    },
    {
      schoolCode: 'D146310000180',
      schoolName: '志學館高等部高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 160 }],
      totalCapacity: 160,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000199',
      schoolName: '池田高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(県外募集含む・含内部進学)', capacity: 130 }],
      totalCapacity: 130,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000206',
      schoolName: '鹿児島育英館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 40 }],
      totalCapacity: 40,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D146310000215',
      schoolName: '鹿児島修学館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含内部進学)', capacity: 80 }],
      totalCapacity: 80,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D146310000224',
      schoolName: '屋久島おおぞら高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(広域通信制の可能性)',
    },
  ],
};
