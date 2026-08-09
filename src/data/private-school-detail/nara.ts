/**
 * 奈良県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本・大分・鹿児島・山形・群馬・茨城・山口・広島に続き(株)育伸社(入試情報課)の
 * 「2026年度高専・私立高校募集要項【奈良県】」(2025年11月4日現在)から学校別・
 * コース別の募集人員を取得。参照台帳18校中12校を収録。東大寺学園・奈良学園
 * 登美ヶ丘・飛鳥未来・日本教育学院・関西中央・関西文化芸術の6校はこのPDFに
 * 掲載が無く見送り(東大寺学園は独自の入試日程を持つ難関校で別枠掲載の可能性、
 * 飛鳥未来は通信制の可能性)。帝塚山の男子英数コース・女子英数コースはそれぞれ
 * 「スーパー理系選抜クラス/スーパー選抜クラス」の募集人員が「若干」(数値不明)、
 * 「英数クラス」が「約15」と明記されており、数値の明瞭な英数クラス分のみを収録し
 * 若干名枠は捏造ゼロの観点から除外した。西大和学園は専願・帰国・県外の複数出願
 * 枠が全て同一の「約120(含帰国)」を指しているため1つのコースとして統合記録した。
 *
 * 【掛-2（私立×多年度）着手時の再検証(2026-08-09)】miyagi.tsで発覚した隣接校
 * データブロック取り違えを警戒し、全12校の令和8年度データを`pdftotext -layout`で
 * 現行PDFと再突合したが、naraでは誤帰属は見つからず全校が正しい値だった。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03929.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月13日キャプチャ分(「2024年度版・2023年11月17日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果、10校は総定員が
 * 完全一致。**2校で実際の変化を検出**: 天理(進学コース(1類)が320→280に減少・
 * 総定員480→440)、奈良文化(文理特進コースが20→40に増加した一方、人間探究コースが
 * 60→50・衛生看護が80→60に減少し、総定員190→180に減少)。育英西(特設コースⅠ類/Ⅱ類
 * →特設文理/特設連携コース)・奈良学園(理数コース→文理コース)・奈良育英(国際理解G
 * コース→高大連携Gコース)・奈良大学附属(特進コースⅠ類・Ⅱ類の2コースが特進コース
 * 1本へ統合)は総定員こそ不変だがコース名・コース構成が改称/再編されていた。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03929.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【奈良県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240813202223if_/https://www.ikushin.co.jp/school/pdf/03929.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【奈良県】(株式会社育伸社 入試情報課・2023年11月17日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_NARA: PrivateSchoolDetailFile = {
  prefectureCode: 'nara',
  schools: [
    {
      schoolCode: 'D129310000010',
      schoolName: '奈良育英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '選抜コース', capacity: 60 },
        { courseName: '高大連携Gコース', capacity: 20 },
        { courseName: '高大連携Sコース', capacity: 80 },
        { courseName: '総合進学コース', capacity: 120 },
      ],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000029',
      schoolName: '奈良女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 20 },
        { courseName: '保育進学コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 140 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000038',
      schoolName: '帝塚山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '男子英数コース(英数クラス・外部約15)', capacity: 15 },
        { courseName: '女子英数コース(英数クラス・外部約15)', capacity: 15 },
        { courseName: '女子特進コース(外部約30)', capacity: 30 },
      ],
      totalCapacity: 60,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000056',
      schoolName: '橿原学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 40 },
        { courseName: '標準コース', capacity: 80 },
        { courseName: '美術', capacity: 40 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000065',
      schoolName: '智辯学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '国公立大学進学コース', capacity: 30 },
        { courseName: '未来探究コース', capacity: 30 },
        { courseName: '普通コース(男・硬式野球部所属)', capacity: 20 },
      ],
      totalCapacity: 80,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000092',
      schoolName: '奈良大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース(60程度)', capacity: 60 },
        { courseName: '文理コース(105程度)', capacity: 105 },
        { courseName: '標準コース(115程度)', capacity: 115 },
      ],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000109',
      schoolName: '奈良文化高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理特進コース(文理グローバル系・文系)', capacity: 40 },
        { courseName: 'アスリートコース', capacity: 30 },
        { courseName: '人間探究コース(こども教育系・食文化系・総合キャリア系)', capacity: 50 },
        { courseName: '衛生看護', capacity: 60 },
      ],
      totalCapacity: 180,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000118',
      schoolName: '奈良学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '文理コース', capacity: 40 }],
      totalCapacity: 40,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000127',
      schoolName: '育英西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特設文理コース(含内部)', capacity: 40 },
        { courseName: '特設連携コース(含内部)', capacity: 40 },
        { courseName: '立命館コース(含内部)', capacity: 80 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000136',
      schoolName: '西大和学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '東大・京大・国公医コース(約120・帰国含む)', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000145',
      schoolName: '天理高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学コース(1類・含内部)', capacity: 280 },
        { courseName: '特別進学コース(2類・含内部)', capacity: 80 },
        { courseName: '天理スポーツ・文化コース(3類・含内部)', capacity: 80 },
      ],
      totalCapacity: 440,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000154',
      schoolName: '智辯学園奈良カレッジ高等部',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理選抜コース(約35)', capacity: 35 },
        { courseName: '特進選抜コース(約15・陸上競技部専願のみ)', capacity: 15 },
      ],
      totalCapacity: 50,
      source: SOURCE,
    },
    {
      schoolCode: 'D129310000010',
      schoolName: '奈良育英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '選抜コース', capacity: 60 },
        { courseName: '国際理解Gコース', capacity: 20 },
        { courseName: '高大連携Sコース', capacity: 80 },
        { courseName: '総合進学コース', capacity: 120 },
      ],
      totalCapacity: 280,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一。国際理解Gコース→高大連携Gコースに改称)',
      },
    },
    {
      schoolCode: 'D129310000029',
      schoolName: '奈良女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 20 },
        { courseName: '保育進学コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 140 },
      ],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D129310000038',
      schoolName: '帝塚山高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '男子英数コース(英数クラス・外部約15)', capacity: 15 },
        { courseName: '女子英数コース(英数クラス・外部約15)', capacity: 15 },
        { courseName: '女子特進コース(外部約30)', capacity: 30 },
      ],
      totalCapacity: 60,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D129310000056',
      schoolName: '橿原学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース', capacity: 40 },
        { courseName: '標準コース', capacity: 80 },
        { courseName: '美術', capacity: 40 },
      ],
      totalCapacity: 160,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D129310000065',
      schoolName: '智辯学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '国公立大学進学コース', capacity: 30 },
        { courseName: '未来探究コース', capacity: 30 },
        { courseName: '普通コース(男・硬式野球部所属)', capacity: 20 },
      ],
      totalCapacity: 80,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一・PDF上「※コース改編」注記あり)' },
    },
    {
      schoolCode: 'D129310000092',
      schoolName: '奈良大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コースⅠ類', capacity: 30 },
        { courseName: '特進コースⅡ類', capacity: 30 },
        { courseName: '文理コース(105程度)', capacity: 105 },
        { courseName: '標準コース(115程度)', capacity: 115 },
      ],
      totalCapacity: 280,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(総定員280は2026年度と同一。特進コースⅠ類・Ⅱ類の2コース(各30程度)が2026年度は特進コース1本(60程度)へ統合)',
      },
    },
    {
      schoolCode: 'D129310000109',
      schoolName: '奈良文化高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Ⅱ類(看護医療特進・特進コース)', capacity: 20 },
        { courseName: 'Ⅱ類(スポーツ特進コース)', capacity: 30 },
        { courseName: 'Ⅰ類(こども教育・食文化・総合進学コース)', capacity: 60 },
        { courseName: '衛生看護', capacity: 80 },
      ],
      totalCapacity: 190,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(2026年度は文理特進コース(旧Ⅱ類看護医療特進・特進)20→40に増加、人間探究コース(旧Ⅰ類)60→50・衛生看護80→60に減少。総定員190→180)',
      },
    },
    {
      schoolCode: 'D129310000118',
      schoolName: '奈良学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '理数コース', capacity: 40 }],
      totalCapacity: 40,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一。理数コース→文理コースに改称)',
      },
    },
    {
      schoolCode: 'D129310000127',
      schoolName: '育英西高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特設コースⅡ類(含内部)', capacity: 40 },
        { courseName: '特設コースⅠ類(含内部)', capacity: 40 },
        { courseName: '立命館コース(含内部)', capacity: 80 },
      ],
      totalCapacity: 160,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle + '(2026年度と総定員完全に同一。特設コースⅡ類/Ⅰ類→特設文理コース/特設連携コースに改称)',
      },
    },
    {
      schoolCode: 'D129310000136',
      schoolName: '西大和学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '東大・京大・国公医コース(約120・帰国含む)', capacity: 120 }],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D129310000145',
      schoolName: '天理高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学コース(1類・含内部)', capacity: 320 },
        { courseName: '特別進学コース(2類・含内部)', capacity: 80 },
        { courseName: '天理スポーツ・文化コース(3類・含内部)', capacity: 80 },
      ],
      totalCapacity: 480,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は進学コース(1類)のみ320→280に減少。総定員480→440)',
      },
    },
    {
      schoolCode: 'D129310000154',
      schoolName: '智辯学園奈良カレッジ高等部',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理選抜コース(約35)', capacity: 35 },
        { courseName: '特進選抜コース(約15・陸上競技部専願のみ)', capacity: 15 },
      ],
      totalCapacity: 50,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D129310000083',
      schoolName: '東大寺学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(独自の入試日程を持つ難関校で別枠掲載の可能性)',
    },
    {
      schoolCode: 'D129310000163',
      schoolName: '奈良学園登美ヶ丘高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D129310000172',
      schoolName: '飛鳥未来高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(通信制の可能性)',
    },
    {
      schoolCode: 'D129310000181',
      schoolName: '日本教育学院高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D129310000047',
      schoolName: '関西中央高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D129310000190',
      schoolName: '関西文化芸術高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
