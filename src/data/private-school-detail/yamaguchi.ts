/**
 * 山口県私立高等学校の募集定員データ(Λ-5第二段)。
 * 山口県私立中学高等学校協会サイトには募集定員一覧が見当たらなかったが、
 * 熊本・大分・鹿児島・山形・群馬・茨城に続き(株)育伸社(入試情報課)の
 * 「2026年度高専・私立高校募集要項【山口県】」(2025年11月4日現在)から
 * 学校別・コース別の募集人員を取得。参照台帳23校中20校を収録(精華学園・松陰・
 * 萩明倫館の3校はこのPDFに掲載が無く見送り)。山口県桜ケ丘の特進・進学・創学
 * コース各系統、高水のアドバンスコース・キャリアデザインコース、聖光の進学・
 * 総合コースのように複数コースが「普通科計X」と注記され同一数値を共有している
 * 場合は合算せず1つの共有コースとして統合記録した。
 *
 * 【掛-2（私立×多年度）着手時の再検証(2026-08-09)】miyagi.tsで発覚した隣接校
 * データブロック取り違えを警戒し、全20校の令和8年度データを`pdftotext -layout`で
 * 現行PDFと再突合した。誤帰属は見つからなかったが、**慶進高等学校の2コース目が
 * ts上「進学コース」と記録されていたが現行PDFの実際のコース名は「グローバルコース」
 * だった**(定員110は正しかった・コース名のみの誤り)ため是正した。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03935.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月13日キャプチャ分(「2024年度版・2023年11月17日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果、18校は総定員が
 * 完全一致。**2校で実際の変化を検出**: 高水(アドバンス・キャリアデザインコースの
 * 共有枠210→150+六年制普通70→60で総定員280→210に大幅減少)、野田学園
 * (未来創造コース140→160に増加も、2024年度のみ存在したグローバル探究コース30が
 * 2026年度に廃止され総定員260→250に減少)。総定員は不変だが構造が変わった学校も
 * 多数発見: 宇部鴻城(医療秘書コース30が廃止され普通コースへ吸収)、サビエル
 * (特別進学・進学の2コース制が「コース制廃止」により単一「普通」へ統合)、
 * 柳井学園(2024年度に無かったビューティーコース25が新設され他3コースを圧縮)、
 * 山口中村学園(2024年度は「中村女子」の校名で女子校だったが、2026年度に現校名へ
 * 改称し共学化)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03935.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【山口県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240813194357if_/https://www.ikushin.co.jp/school/pdf/03935.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【山口県】(株式会社育伸社 入試情報課・2023年11月17日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_YAMAGUCHI: PrivateSchoolDetailFile = {
  prefectureCode: 'yamaguchi',
  schools: [
    {
      schoolCode: 'D135310000012',
      schoolName: '梅光学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(GSSコース・SSコース)', capacity: 80 },
        { courseName: '音楽', capacity: 20 },
      ],
      totalCapacity: 100,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000021',
      schoolName: '早鞆高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '菁菁館特別進学コース第Ⅰ類', capacity: 35 },
        { courseName: '菁菁館特別進学コース第Ⅱ類', capacity: 35 },
        { courseName: '進学グローアップコース', capacity: 40 },
        { courseName: 'キャリア・アスリートコース', capacity: 105 },
        { courseName: 'ビューティーコース(美容30+理容10)', capacity: 40 },
        { courseName: '自動車工学', capacity: 40 },
        { courseName: '生活クリエイト', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 375,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000030',
      schoolName: '下関短期大学付属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000049',
      schoolName: '下関国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '電子機械', capacity: 40 },
      ],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000058',
      schoolName: '宇部鴻城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '普通コース', capacity: 150 },
        { courseName: '機械・自動車工学', capacity: 80 },
      ],
      totalCapacity: 260,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000067',
      schoolName: '慶進高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 70 },
        { courseName: 'グローバルコース', capacity: 110 },
      ],
      totalCapacity: 180,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000076',
      schoolName: '宇部フロンティア大学付属香川高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 50 },
        { courseName: '進学コース', capacity: 60 },
        { courseName: '生活デザイン', capacity: 40 },
        { courseName: '食物調理', capacity: 65 },
        { courseName: '保育', capacity: 40 },
      ],
      totalCapacity: 255,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000085',
      schoolName: '山口中村学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 90 },
        { courseName: '看護', capacity: 40 },
        { courseName: '調理', capacity: 40 },
        { courseName: '福祉', capacity: 40 },
        { courseName: '商業', capacity: 40 },
      ],
      totalCapacity: 250,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000094',
      schoolName: '野田学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '未来創造コース', capacity: 160 },
        { courseName: '特別進学Aコース', capacity: 60 },
        { courseName: '特別進学Sコース', capacity: 30 },
      ],
      totalCapacity: 250,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000101',
      schoolName: '萩光塩学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000110',
      schoolName: '山口県桜ケ丘高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(特進コース・進学コース・創学コースキャリア系・アーティスト系・商業系・電気系計)',
          capacity: 240,
        },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000129',
      schoolName: '誠英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 35 },
        { courseName: '進学コース', capacity: 40 },
        { courseName: '総合コース', capacity: 87 },
        { courseName: '調理師コース', capacity: 38 },
        { courseName: '情報会計', capacity: 70 },
        { courseName: '福祉', capacity: 35 },
      ],
      totalCapacity: 305,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000138',
      schoolName: '高川学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 200 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000147',
      schoolName: '高水高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(アドバンスコース・キャリアデザインコース計)', capacity: 150 },
        { courseName: '六年制普通(内部進学含む)', capacity: 60 },
      ],
      totalCapacity: 210,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000156',
      schoolName: 'サビエル高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 105 }],
      totalCapacity: 105,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000165',
      schoolName: '聖光高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(進学コース・総合コース計)', capacity: 170 },
        { courseName: '社会福祉', capacity: 25 },
        { courseName: '総合ビジネス', capacity: 30 },
        { courseName: '機械', capacity: 40 },
      ],
      totalCapacity: 265,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000174',
      schoolName: '長門高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 120 },
        { courseName: '商業', capacity: 120 },
      ],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000183',
      schoolName: '柳井学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合進学コース', capacity: 25 },
        { courseName: 'スポーツ科学コース', capacity: 35 },
        { courseName: '教養キャリアコース', capacity: 35 },
        { courseName: 'ビューティーコース', capacity: 25 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000192',
      schoolName: '成進高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 50 },
        { courseName: '総合ビジネス', capacity: 30 },
      ],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000209',
      schoolName: '山口県鴻城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 180 },
        { courseName: '情報商業', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 260,
      source: SOURCE,
    },
    {
      schoolCode: 'D135310000012',
      schoolName: '梅光学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(GSSコース・SSコース)', capacity: 80 },
        { courseName: '音楽', capacity: 20 },
      ],
      totalCapacity: 100,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000021',
      schoolName: '早鞆高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '菁菁館特別進学コース第Ⅰ類', capacity: 35 },
        { courseName: '菁菁館特別進学コース第Ⅱ類', capacity: 35 },
        { courseName: '進学グローアップコース', capacity: 40 },
        { courseName: 'キャリア・アスリートコース', capacity: 105 },
        { courseName: 'ビューティーコース(美容30+理容10)', capacity: 40 },
        { courseName: '自動車工学', capacity: 40 },
        { courseName: '生活クリエイト', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 375,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000030',
      schoolName: '下関短期大学付属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000049',
      schoolName: '下関国際高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 80 },
        { courseName: '電子機械', capacity: 40 },
      ],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000058',
      schoolName: '宇部鴻城高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '普通コース', capacity: 120 },
        { courseName: '機械・自動車工学', capacity: 80 },
        { courseName: '医療秘書', capacity: 30 },
      ],
      totalCapacity: 260,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員260は2026年度と同一。医療秘書コース30が廃止され普通コース120→150に吸収)',
      },
    },
    {
      schoolCode: 'D135310000067',
      schoolName: '慶進高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 60 },
        { courseName: 'グローバルコース', capacity: 120 },
      ],
      totalCapacity: 180,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員180は2026年度と同一。2026年度はアドバンス60→70・グローバル120→110に再配分)',
      },
    },
    {
      schoolCode: 'D135310000076',
      schoolName: '宇部フロンティア大学付属香川高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース', capacity: 50 },
        { courseName: '進学コース', capacity: 60 },
        { courseName: '生活デザイン', capacity: 40 },
        { courseName: '食物調理', capacity: 65 },
        { courseName: '保育', capacity: 40 },
      ],
      totalCapacity: 255,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000085',
      schoolName: '山口中村学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(女)', capacity: 90 },
        { courseName: '看護(女)', capacity: 40 },
        { courseName: '調理(女)', capacity: 40 },
        { courseName: '福祉(女)', capacity: 40 },
        { courseName: '商業(女)', capacity: 40 },
      ],
      totalCapacity: 250,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員250は2026年度と同一。2024年度は校名「中村女子」で女子校・2026年度に山口中村学園へ改称し共学化)',
      },
    },
    {
      schoolCode: 'D135310000094',
      schoolName: '野田学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '未来創造コース', capacity: 140 },
        { courseName: '特別進学Aコース', capacity: 60 },
        { courseName: '特別進学Sコース', capacity: 30 },
        { courseName: 'グローバル探究コース', capacity: 30 },
      ],
      totalCapacity: 260,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(2026年度は未来創造コース140→160に増加も、グローバル探究コース30が廃止され総定員260→250に減少)',
      },
    },
    {
      schoolCode: 'D135310000101',
      schoolName: '萩光塩学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 120 }],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000110',
      schoolName: '山口県桜ケ丘高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(晃英館コース・特進コース・進学コース・創学コースキャリア系・アーティスト系・商業系・電気系計)',
          capacity: 240,
        },
      ],
      totalCapacity: 240,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(2026年度と総定員完全に同一。PDF上「※キャリアコース→創学コース・キャリア系」等の改称注記あり)',
      },
    },
    {
      schoolCode: 'D135310000129',
      schoolName: '誠英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 35 },
        { courseName: '進学コース', capacity: 40 },
        { courseName: '総合コース', capacity: 87 },
        { courseName: '調理師コース', capacity: 38 },
        { courseName: '情報会計', capacity: 70 },
        { courseName: '福祉', capacity: 35 },
      ],
      totalCapacity: 305,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000138',
      schoolName: '高川学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 200 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一・PDF上「※コース改編」注記あり)' },
    },
    {
      schoolCode: 'D135310000147',
      schoolName: '高水高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース・進路探究コース計', capacity: 210 },
        { courseName: '六年制普通(内部進学含む)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(2026年度は特別進学コース→アドバンスコース・進路探究コース→キャリアデザインコースに改称の上、共有枠210→150・六年制普通70→60に減少。総定員280→210)',
      },
    },
    {
      schoolCode: 'D135310000156',
      schoolName: 'サビエル高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 35 },
        { courseName: '進学コース', capacity: 70 },
      ],
      totalCapacity: 105,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(総定員105は2026年度と同一。2026年度はPDF上「※コース制廃止」の注記通り単一の「普通」105へ統合)',
      },
    },
    {
      schoolCode: 'D135310000165',
      schoolName: '聖光高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(進学コース・総合コース計)', capacity: 170 },
        { courseName: '普通科社会福祉コース', capacity: 25 },
        { courseName: '綜合ビジネス', capacity: 30 },
        { courseName: '機械', capacity: 40 },
      ],
      totalCapacity: 265,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一。普通科社会福祉コース→社会福祉科に改称)',
      },
    },
    {
      schoolCode: 'D135310000174',
      schoolName: '長門高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 120 },
        { courseName: '商業', capacity: 120 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000183',
      schoolName: '柳井学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合進学コース', capacity: 40 },
        { courseName: 'スポーツ科学コース', capacity: 40 },
        { courseName: '教養キャリアコース', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 160,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員160は2026年度と同一。2024年度にはビューティーコースが存在せず、2026年度新設(25)に伴い他3コースを40→25/35/35に圧縮)',
      },
    },
    {
      schoolCode: 'D135310000192',
      schoolName: '成進高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 50 },
        { courseName: '総合ビジネス', capacity: 30 },
      ],
      totalCapacity: 80,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D135310000209',
      schoolName: '山口県鴻城高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 180 },
        { courseName: '情報商業', capacity: 40 },
        { courseName: '衛生看護', capacity: 40 },
      ],
      totalCapacity: 260,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D135310000218',
      schoolName: '精華学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(広域通信制の可能性)',
    },
    {
      schoolCode: 'D135310000227',
      schoolName: '松陰高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D135310000236',
      schoolName: '萩明倫館高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
