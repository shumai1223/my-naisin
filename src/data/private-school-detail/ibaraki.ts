/**
 * 茨城県私立高等学校の募集定員データ(Λ-5第二段)。
 * 茨城県私立中学高等学校の一括PDFは以前(W-16期)に構造が複雑で採用見送りとした
 * 前例があるが、今回は熊本・大分・鹿児島・山形・群馬に続き(株)育伸社(入試情報課)の
 * 「2026年度高専・私立高校募集要項【茨城県】」(2025年11月4日現在)から学校別・
 * コース別の募集人員を取得できた。参照台帳36校中21校を収録。翔洋学園・水戸平成
 * 学園・EIKOデジタルクリエイティブ・飛鳥未来きぼう・わせがくPURE・第一学院高萩校・
 * 日本ウェルネス・つくば開成・Ｓ高等学校・四谷学院・ルネサンス・晃陽学園・青丘学院
 * つくばの13校はこのPDFに掲載が無く見送り(通信制/広域校が多く含まれる)。茗溪学園は
 * 推薦(MG15・IB若干)/一般(25)/IB生特別(若干)/国際生特別(特に定めない)のように
 * 数値が不明瞭な項目が多く確度不足として見送った。常総学院・東洋大学附属牛久は
 * 推薦時点(290・210)と一般時点(310・290)で異なる募集人員が記載されており、
 * 最終的な公表総数として一般時点のより大きい数値を採用した。複数コースが
 * 「普通科計X」「全コース計X」と注記され同一数値を共有している場合は合算せず
 * 1つの共有コースとして統合記録した。
 *
 * 【掛-2（私立×多年度）着手時に発見した誤り(2026-08-09是正)】miyagi/oita/kagoshimaと
 * 同型の誤りを警戒し全21校の令和8年度データをpdftotext -layoutで現行PDFと再突合した
 * ところ、隣接校の取り違えのような重大な誤りは無かったが、霞ヶ浦高等学校のコース名が
 * ts上「総合選学コース」となっていた箇所は現行PDFの実際の表記「総合進学コース」の
 * 誤記(定員430は正しかった)と判明し是正した。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03908.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月13日キャプチャ分(「2024年度版・2023年11月17日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果、18校は総定員が
 * 完全一致。**3校で実際の変化を検出**: 霞ヶ浦(普通科計480(含内部)→430に減少)、
 * 聖徳大学附属取手聖徳女子(普通60→90に増加・音楽10は不変・総定員70→100)、
 * 明秀学園日立(2024年度は特進ST・特進S・特進Aの3コースが「全コース計360」を
 * 共有していたが、2026年度は特進Sコース・特進Aコースが総合キャリアコースへ統合され
 * 探究GSコースが新設された上で共有枠が「全コース計320」に減少)。総定員は不変だが
 * 内部構造が変化した学校も複数: 江戸川学園取手(2024年度は医科20・東大20が別枠
 * だったが2026年度は「医科・東大計40」の共有枠に統合)、水城(SZ/SU/SS/SAの4コース
 * から Z/U/Sグループの3グループへ再編)、常磐大学・水戸葵陵(共有枠内に新しい
 * サブコースが追加)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03908.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【茨城県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240813014805if_/https://www.ikushin.co.jp/school/pdf/03908.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【茨城県】(株式会社育伸社 入試情報課・2023年11月17日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_IBARAKI: PrivateSchoolDetailFile = {
  prefectureCode: 'ibaraki',
  schools: [
    {
      schoolCode: 'D108320100013',
      schoolName: '茨城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(一般コース・国際教養コース計・約80)', capacity: 80 }],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100022',
      schoolName: '常磐大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進選抜コース(学特)・特進選抜コース・特進コース計)', capacity: 400 }],
      totalCapacity: 400,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100031',
      schoolName: '大成女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 160 },
        { courseName: '家政', capacity: 40 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100040',
      schoolName: '水戸女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '商業', capacity: 20 },
        { courseName: '普通', capacity: 100 },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100059',
      schoolName: '水戸啓明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進Gコース・特進フロンティアコース・特進文理コース計・連携含む)', capacity: 260 },
        { courseName: '商業(人間経済コース・連携含む)', capacity: 40 },
      ],
      totalCapacity: 300,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100068',
      schoolName: '水城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(Zグループ・Uグループ・Sグループ計)', capacity: 640 }],
      totalCapacity: 640,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100077',
      schoolName: '学校法人田中学園水戸葵陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(医歯薬コース・特進iコース・DigitalXコース・進学Vコース計・連携含む)', capacity: 280 }],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320200012',
      schoolName: '明秀学園日立高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '全コース(探究GSコース・特進STコース・総合キャリアコース計)', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320200021',
      schoolName: '茨城キリスト教学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進SGクラス・SGクラス計)', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320300011',
      schoolName: '学校法人土浦日本大学学園土浦日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(特別進学コース(スーパーハイ)・特別進学コース(特進)・総合進学コース(進学)・総合進学コース(スポーツ)・グローバル・スタディコース計)',
          capacity: 630,
        },
      ],
      totalCapacity: 630,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320300020',
      schoolName: 'つくば国際大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320300039',
      schoolName: '常総学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(特進選抜コース・進学選抜コース(プログレス)・進学選抜コース(フロンティア)計・一般時点)',
          capacity: 310,
        },
      ],
      totalCapacity: 310,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320800016',
      schoolName: '愛国学園大学附属龍ケ崎高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D108321700015',
      schoolName: '学校法人江戸川学園江戸川取手高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '医科コース・東大コース計', capacity: 40 },
        { courseName: '難関大コース', capacity: 100 },
      ],
      totalCapacity: 140,
      source: SOURCE,
    },
    {
      schoolCode: 'D108321700024',
      schoolName: '聖徳大学附属取手聖徳女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 90 },
        { courseName: '音楽', capacity: 10 },
      ],
      totalCapacity: 100,
      source: SOURCE,
    },
    {
      schoolCode: 'D108321900013',
      schoolName: '学校法人東洋大学東洋大学附属牛久高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学コース・進学コース・グローバルコース計・一般時点・スポーツサイエンスコース約35を含む)', capacity: 290 },
      ],
      totalCapacity: 290,
      source: SOURCE,
    },
    {
      schoolCode: 'D108322000029',
      schoolName: '学校法人温習塾つくば秀英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進Sコース・進学Tコース計)', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D108322200018',
      schoolName: '学校法人清真学園清真学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 40 }],
      totalCapacity: 40,
      source: SOURCE,
    },
    {
      schoolCode: 'D108322200027',
      schoolName: '鹿島学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学コース', capacity: 190 },
        { courseName: '芸術コース', capacity: 30 },
        { courseName: 'グローバルコース', capacity: 20 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D108323000018',
      schoolName: 'つくば国際大学東風高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース・進学コース計', capacity: 170 },
        { courseName: '医療・看護進学コース', capacity: 30 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D108323100017',
      schoolName: '岩瀬日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・日大進学コース計)', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D108344300011',
      schoolName: '霞ヶ浦高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特進選抜コース・特進コース・総合進学コース計)', capacity: 430 }],
      totalCapacity: 430,
      source: SOURCE,
    },
    {
      schoolCode: 'D108320100013',
      schoolName: '茨城高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(一般コース・国際教養コース計・約80)', capacity: 80 }],
      totalCapacity: 80,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320100022',
      schoolName: '常磐大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特進選抜コース・特進コース計)', capacity: 400 }],
      totalCapacity: 400,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員400は2026年度と同一。2026年度に共有枠内へ特進選抜コース(学特)が新設)',
      },
    },
    {
      schoolCode: 'D108320100031',
      schoolName: '大成女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 160 },
        { courseName: '家政', capacity: 40 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320100040',
      schoolName: '水戸女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '商業', capacity: 20 },
        { courseName: '普通', capacity: 100 },
      ],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320100059',
      schoolName: '水戸啓明高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特進Gコース・特進フロンティアコース・特進文理コース計・連携含む)', capacity: 260 },
        { courseName: '商業(人間経済コース・連携含む)', capacity: 40 },
      ],
      totalCapacity: 300,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320100068',
      schoolName: '水城高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(SZコース・SUコース・SSコース・SAコース計)', capacity: 640 }],
      totalCapacity: 640,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一。SZ/SU/SS/SAの4コースがZグループ/Uグループ/Sグループの3グループへ再編)',
      },
    },
    {
      schoolCode: 'D108320100077',
      schoolName: '学校法人田中学園水戸葵陵高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(医歯薬コース・特進iコース・進学Vコース計・連携含む)', capacity: 280 }],
      totalCapacity: 280,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員280は2026年度と同一。2026年度に共有枠内へDigitalXコースが新設)',
      },
    },
    {
      schoolCode: 'D108320200012',
      schoolName: '明秀学園日立高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '全コース(特進STコース・特進Sコース・特進Aコース計)', capacity: 360 }],
      totalCapacity: 360,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(2026年度は探究GSコースが新設され、特進Sコース・特進Aコースが総合キャリアコースへ統合。共有枠は全コース計360→320に減少)',
      },
    },
    {
      schoolCode: 'D108320200021',
      schoolName: '茨城キリスト教学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特進SGクラス・SGクラス計)', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320300011',
      schoolName: '学校法人土浦日本大学学園土浦日本大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(特別進学コース(スーパーハイ)・特別進学コース(特進)・総合進学コース(進学)・総合進学コース(スポーツ)・グローバル・スタディコース計)',
          capacity: 630,
        },
      ],
      totalCapacity: 630,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320300020',
      schoolName: 'つくば国際大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 240 }],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320300039',
      schoolName: '常総学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(特進選抜コース・進学選抜コース(プログレス)・進学選抜コース(フロンティア)計・一般時点)',
          capacity: 310,
        },
      ],
      totalCapacity: 310,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108320800016',
      schoolName: '愛国学園大学附属龍ケ崎高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 120 }],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108321700015',
      schoolName: '学校法人江戸川学園江戸川取手高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '医科コース', capacity: 20 },
        { courseName: '東大コース', capacity: 20 },
        { courseName: '難関大コース', capacity: 100 },
      ],
      totalCapacity: 140,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員140は2026年度と同一。2024年度は医科20・東大20が別枠だったが2026年度は「医科・東大計40」の共有枠に統合)',
      },
    },
    {
      schoolCode: 'D108321700024',
      schoolName: '聖徳大学附属取手聖徳女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 60 },
        { courseName: '音楽', capacity: 10 },
      ],
      totalCapacity: 70,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は普通コースのみ60→90に増加。総定員70→100)',
      },
    },
    {
      schoolCode: 'D108321900013',
      schoolName: '学校法人東洋大学東洋大学附属牛久高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特別進学コース・進学コース・グローバルコース計・一般時点・スポーツサイエンスコース約35を含む)', capacity: 290 },
      ],
      totalCapacity: 290,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108322000029',
      schoolName: '学校法人温習塾つくば秀英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特進Sコース・進学Tコース計)', capacity: 320 }],
      totalCapacity: 320,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108322200018',
      schoolName: '学校法人清真学園清真学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 40 }],
      totalCapacity: 40,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108322200027',
      schoolName: '鹿島学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学コース(推薦70+一般120)', capacity: 190 },
        { courseName: '芸術コース(推薦10+一般20)', capacity: 30 },
        { courseName: 'グローバルコース(推薦10+一般10)', capacity: 20 },
      ],
      totalCapacity: 240,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員240は2026年度と同一。2024年度は推薦・一般で異なる募集人員が明記されていたが2026年度は単一の合計値表記に変更)',
      },
    },
    {
      schoolCode: 'D108323000018',
      schoolName: 'つくば国際大学東風高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース・進学コース計', capacity: 170 },
        { courseName: '医療・看護進学コース', capacity: 30 },
      ],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108323100017',
      schoolName: '岩瀬日本大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学コース・日大進学コース計)', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D108344300011',
      schoolName: '霞ヶ浦高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特進選抜コース・特進コース・総合進学コース計・含内部)', capacity: 480 }],
      totalCapacity: 480,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は普通科計480(含内部)→430に減少。「含内部」注記も消滅)',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D108320100086',
      schoolName: '水戸平成学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108320100095',
      schoolName: 'EIKOデジタル・クリエイティブ高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108320100102',
      schoolName: '飛鳥未来きぼう高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
    {
      schoolCode: 'D108320200030',
      schoolName: '翔洋学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108320400010',
      schoolName: '晃陽学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108320500019',
      schoolName: '青丘学院つくば高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108321100011',
      schoolName: 'わせがくPURE高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
    {
      schoolCode: 'D108321400018',
      schoolName: '第一学院高等学校高萩校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
    {
      schoolCode: 'D108321600016',
      schoolName: '日本ウェルネス高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
    {
      schoolCode: 'D108321900022',
      schoolName: 'つくば開成高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108322000010',
      schoolName: '学校法人茗溪学園茗溪学園高等学校',
      reason: '推薦(MG15・IB若干)/一般(25)/IB生特別(若干)/国際生特別(特に定めない)のように数値が不明瞭な項目が多く、確度の高い募集定員として収録できなかった',
    },
    {
      schoolCode: 'D108322000038',
      schoolName: 'Ｓ高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
    {
      schoolCode: 'D108322700013',
      schoolName: '四谷学院高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D108336400016',
      schoolName: 'ルネサンス高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
  ],
};
