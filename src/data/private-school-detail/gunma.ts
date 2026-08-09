/**
 * 群馬県私立高等学校の募集定員データ(Λ-5第二段)。
 * 熊本・大分・鹿児島・山形に続き(株)育伸社(入試情報課)の「2026年度高専・私立高校
 * 募集要項【群馬県】」(2025年11月4日現在)から学校別・コース別の募集人員を取得。
 * 参照台帳14校中11校を収録(白根開善学校高等部・ぐんま国際アカデミー高等部・
 * Ｒ高校の3校はこのPDFに掲載が無く見送り)。前橋育英・常磐・高崎健康福祉大学高崎・
 * 明和県央のように複数コースが「普通科計X」と注記され同一数値を共有している場合は
 * 合算せず1つの共有コースとして統合記録した。
 *
 * 【掛-2（私立×多年度）着手時の再検証(2026-08-09)】miyagi.tsで発覚した「隣接校の
 * データブロック取り違え」([[fable5-loop-protocol]]参照)を警戒し、`pdftotext -layout`で
 * 全11校の令和8年度データを現行PDFと再突合したが、gunmaでは誤帰属は見つからず全校が
 * 正しい値だった(桐生第一・樹徳・高崎商科大学附属・東京農業大学第二のように学校名
 * ラベルがコースブロックの途中に出現する変則配置は同様に存在するが、対応関係は正確だった)。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03910.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月12日キャプチャ分(「2024年度版・2023年11月17日現在」)が発掘できた。
 * pdftotext -layoutで現行(2026年度)版と機械的に突合した結果、9校は総定員が完全一致。
 * **2校で実際の変化を検出**: 高崎商科大学附属(進学コース230→210・総合ビジネス120→90で
 * 総定員500→450に減少)、東京農業大学第二(Ⅱ発展コース160+Ⅱ標準コース100の2コースが
 * Ⅱ(自己探究)コース210に統合され、他コースも定員調整の結果、総定員520→450に減少)。
 * 樹徳(SS/K/S/Jクラスの旧名称からの改称)と前橋育英(Ⅰ〜Ⅴ類から現行クラス名への
 * 全面改称)は総定員こそ不変だがコース名が全面的に付け替えられていた。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03910.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【群馬県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240812154407if_/https://www.ikushin.co.jp/school/pdf/03910.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【群馬県】(株式会社育伸社 入試情報課・2023年11月17日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
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
    {
      schoolCode: 'D110310000011',
      schoolName: '共愛学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(特進コース・進学コース計)', capacity: 230 },
        { courseName: '英語科(特進コース・進学コース計)', capacity: 130 },
      ],
      totalCapacity: 360,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D110310000020',
      schoolName: '前橋育英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName:
            '普通科(Ⅰ類特進選抜コース・Ⅱ類特進コース・Ⅲ類総合進学コース・Ⅳ類スポーツ科学コース・Ⅴ類保育コース計)',
          capacity: 510,
        },
      ],
      totalCapacity: 510,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員510は2026年度と同一。Ⅰ〜Ⅴ類の旧クラス名から現行クラス名(特別進学コース選抜/特進クラス・総合進学・スポーツ科学・保育)へ全面改称)',
      },
    },
    {
      schoolCode: 'D110310000039',
      schoolName: '高崎商科大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学選抜コース', capacity: 50 },
        { courseName: '特別進学コース', capacity: 100 },
        { courseName: '進学コース', capacity: 230 },
        { courseName: '総合ビジネス', capacity: 120 },
      ],
      totalCapacity: 500,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は進学コース230→210・総合ビジネス120→90に減少。総定員500→450)',
      },
    },
    {
      schoolCode: 'D110310000048',
      schoolName: '東京農業大学第二高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'グローバルコース', capacity: 20 },
        { courseName: 'Ⅰ(進学選抜)コース', capacity: 120 },
        { courseName: 'Ⅱ(発展)コース', capacity: 160 },
        { courseName: 'Ⅱ(標準)コース', capacity: 100 },
        { courseName: 'Ⅲ(クラブ選抜)コース', capacity: 120 },
      ],
      totalCapacity: 520,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(2026年度はグローバルコースがグローバル・アントレプレナーシップ(GEコース)に改称し30に増加、Ⅱ(発展)160+Ⅱ(標準)100の2コースがⅡ(自己探究)210に統合、Ⅰ進学選抜120→105・Ⅲクラブ選抜120→105に減少。総定員520→450)',
      },
    },
    {
      schoolCode: 'D110310000057',
      schoolName: '桐生第一高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 40 },
        { courseName: '進学スポーツコース(男)', capacity: 120 },
        { courseName: '総合コース', capacity: 250 },
        { courseName: '製菓衛生師コース', capacity: 30 },
        { courseName: '調理', capacity: 40 },
      ],
      totalCapacity: 480,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D110310000066',
      schoolName: '樹徳高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'スーパーサイエンスコース(SS組)', capacity: 10 },
        { courseName: '特別大学進学コース(K組)', capacity: 70 },
        { courseName: '大学進学コース(S組)', capacity: 35 },
        { courseName: '普通コース(J組)', capacity: 230 },
      ],
      totalCapacity: 345,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員345は2026年度と同一。SS組→進学探究コース(SSクラス)等、4コース全ての名称が現行の「進学探究/キャリア探究コース」体系に改称)',
      },
    },
    {
      schoolCode: 'D110310000075',
      schoolName: '常磐高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学・進学・総合・体育コース計)', capacity: 300 }],
      totalCapacity: 300,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D110310000084',
      schoolName: '関東学園大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学コース・進学コース計)', capacity: 240 }],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D110310000093',
      schoolName: '新島学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(併設中学含む)', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D110310000100',
      schoolName: '高崎健康福祉大学高崎高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特進・大進・進学・アスリートコース計)', capacity: 460 }],
      totalCapacity: 460,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D110310000128',
      schoolName: '明和県央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別進学・N進学・進学・競技スポーツコース計)', capacity: 280 }],
      totalCapacity: 280,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
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
