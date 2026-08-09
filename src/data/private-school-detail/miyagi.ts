/**
 * 宮城県私立高等学校の募集定員データ(Λ-5第二段)。
 * 宮城県私立中学高等学校連合会サイトには入試日程一覧PDFのみで募集定員の記載が無く、
 * 一括収録は見送り。個別学校の公式サイトから募集要項PDFを確認する方式で仙台育英学園
 * (1,000名)と東北学院(360名)の2校を先に確認し、その後熊本・大分・鹿児島・山形・
 * 群馬・茨城・山口・広島・奈良・岩手・千葉に続き(株)育伸社(入試情報課)の
 * 「2026年度高専・私立高校募集要項【宮城県】」(2025年11月4日現在)から11校を追加した。
 * 育伸社データは既存2校の数値とも独立に一致確認できた(仙台育英学園の7コース内訳・
 * 東北学院TG総進コースの普通科計360は既存記録と完全一致)。クラークNEXT・仙台城南・
 * 東北生活文化大学・飛鳥未来きずな・日本ウェルネス宮城・西山学院の6校はこのPDFに
 * 掲載が無く見送り(クラークNEXT・飛鳥未来きずなは広域通信制)。
 *
 * 【掛-2（私立×多年度）着手時に発見した誤り(2026-08-09是正)】東北学院榴ケ岡
 * (schoolCode D104391050036)に旧セッションが「創進コース・TG選抜コース計(創進・文理計)135・
 * 文理コース280・栄泉コース・スポーツコース計(栄泉・スポ計)245＝660」と記録していたが、
 * pdftotext -layoutでPDFのレイアウトを再確認したところ、この「創進/文理/文教/栄泉/スポーツ」
 * という組み合わせと660という総定員は**実際には東北高等学校(旧スキップ扱い)の値**であり、
 * 東北学院榴ケ岡の真の値は「特別進学コース60(内特待30)・TG選抜コース80(内推薦30)・
 * 総合進学コース130(内推薦60)＝270」だったと判明した(誤って隣接する学校のブロックを
 * 東北学院榴ケ岡に紐付けていた)。この機会に東北高等学校を正しい660のデータで新規収録し、
 * 同様に「掲載が無い」として見送られていた東陵高等学校も実際には
 * 「特別進学コース・総合進学コース計(普通科計)120」の記載がPDFにあることを発見し新規収録した。
 *
 * 【掛-2（私立×多年度）追加】同一URL(03904.pdf)はikushin.co.jpが年次更新のたびに
 * 上書きする方式のため、Wayback CDX APIで過去スナップショットを確認したところ
 * 2024年8月12日キャプチャ分(「2024年度版・2023年12月4日現在」)が発掘できた
 * (ishikawa/yamagata/aomoriの2年ギャップと同型)。pdftotext -layoutで現行(2026年度)版と
 * 機械的に突合した結果(上記の是正を反映した13校で比較)、11校は総定員が完全一致(東北学院
 * 榴ケ岡・東北・東陵を含む)。**2校で実際の変化を検出**: 仙台白百合学園(225→175に減少)、
 * 宮城学院(特別進学コースのみ70→50に減少・総定員170→150)。聖ドミニコ学院は総定員こそ
 * 155で不変だが、コース構成が「特別進学35・総合進学60・未来探究進学60(※女子→共学の注記
 * あり)」から「進学選抜80・進学探究75」へ全面的に再編されていた。仙台育英学園・東北学院の
 * 2校は個別学校公式PDFを一次ソースとしているため今回は多年度化を見送り(次回の課題)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03904.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【宮城県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_SOURCE = {
  url: 'https://web.archive.org/web/20240812124819if_/https://www.ikushin.co.jp/school/pdf/03904.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【宮城県】(株式会社育伸社 入試情報課・2023年12月4日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_MIYAGI: PrivateSchoolDetailFile = {
  prefectureCode: 'miyagi',
  schools: [
    {
      schoolCode: 'D104391020024',
      schoolName: '仙台育英学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '秀光コース(宮城野校舎)', capacity: 70 },
        { courseName: '特別進学コース(宮城野校舎)', capacity: 240 },
        { courseName: '情報科学コース(宮城野校舎)', capacity: 90 },
        { courseName: '外国語コース(多賀城校舎・女子)', capacity: 70 },
        { courseName: '英進進学コース(多賀城校舎)', capacity: 210 },
        { courseName: 'フレックスコース(多賀城校舎)', capacity: 160 },
        { courseName: '技能開発コース(多賀城校舎)', capacity: 160 },
      ],
      totalCapacity: 1000,
      source: {
        url: 'https://www.sendaiikuei.ed.jp/media/files/hs/admission/summary/26nyushi.pdf',
        docTitle: '令和8年度 仙台育英学園高等学校募集概要（コース別定員予定表）',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D104391020015',
      schoolName: '東北学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(コース制)', capacity: 360 }],
      totalCapacity: 360,
      source: {
        url: 'https://www.jhs.tohoku-gakuin.ac.jp/admission/hs/files/guide/admissions.pdf',
        docTitle: '2026年度（令和8年度）東北学院高等学校生徒募集要項（募集定員男女360名）',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D104391010017',
      schoolName: '宮城学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース(女・約50名含内部)', capacity: 50 },
        { courseName: 'グローバルコミュニケーションコース(女・約30名含内部)', capacity: 30 },
        { courseName: '総合進学コース(女・約70名含内部)', capacity: 70 },
      ],
      totalCapacity: 150,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391010026',
      schoolName: '尚絅学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '文理進学コース', capacity: 90 },
        { courseName: '総合進学コース', capacity: 120 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391010035',
      schoolName: '常盤木学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(リバティコース・スーパー両立コース・国際教養コース計・女)', capacity: 300 },
        { courseName: '音楽', capacity: 30 },
      ],
      totalCapacity: 330,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391010044',
      schoolName: '仙台大学附属明成高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'スポーツ創志', capacity: 120 },
        { courseName: '福祉未来創志', capacity: 35 },
        { courseName: '食文化創志', capacity: 105 },
        { courseName: '普通', capacity: 70 },
      ],
      totalCapacity: 330,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391010062',
      schoolName: '聖ドミニコ学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学選抜コース', capacity: 80 },
        { courseName: '進学探究コース', capacity: 75 },
      ],
      totalCapacity: 155,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391030013',
      schoolName: '聖和学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進アドバンスコース・特進アスリートコース計(薬師堂キャンパス)', capacity: 90 },
        { courseName: 'リベラルアーツコース(薬師堂キャンパス)', capacity: 200 },
        { courseName: 'プログレスコース(薬師堂キャンパス)', capacity: 100 },
        { courseName: '特進パイオニアコース(三神峯キャンパス)', capacity: 60 },
        { courseName: 'ジェネラルスタディコース(三神峯キャンパス)', capacity: 130 },
      ],
      totalCapacity: 580,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391030022',
      schoolName: '聖ウルスラ学院英智高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別志学コースType1・Type2・尚志コース計)', capacity: 240 }],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391050018',
      schoolName: '仙台白百合学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(女・併設中学含む)', capacity: 175 }],
      totalCapacity: 175,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391050036',
      schoolName: '東北学院榴ケ岡高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース(内特待30)', capacity: 60 },
        { courseName: 'TG選抜コース(内推薦30)', capacity: 80 },
        { courseName: '総合進学コース(内推薦60)', capacity: 130 },
      ],
      totalCapacity: 270,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104391010053',
      schoolName: '東北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '創進コース・文理コース計(創進・文理計)', capacity: 135 },
        { courseName: '文教コース', capacity: 280 },
        { courseName: '栄泉コース・スポーツコース計(栄泉・スポ計)', capacity: 245 },
      ],
      totalCapacity: 660,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104392050016',
      schoolName: '東陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '特別進学コース・総合進学コース計(普通科計)', capacity: 120 }],
      totalCapacity: 120,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104392150015',
      schoolName: '古川学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(進学コース・創志コース・総合コース計)', capacity: 280 },
        { courseName: '情報ビジネス', capacity: 60 },
      ],
      totalCapacity: 340,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104392150024',
      schoolName: '大崎中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合', capacity: 120 },
        { courseName: '介護福祉', capacity: 30 },
        { courseName: '保育', capacity: 30 },
      ],
      totalCapacity: 180,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D104392150024',
      schoolName: '大崎中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合', capacity: 120 },
        { courseName: '介護福祉', capacity: 30 },
        { courseName: '保育', capacity: 30 },
      ],
      totalCapacity: 180,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391010026',
      schoolName: '尚絅学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '文理進学コース', capacity: 90 },
        { courseName: '総合進学コース', capacity: 120 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391030022',
      schoolName: '聖ウルスラ学院英智高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(特別志学コースType1・Type2・尚志コース計)', capacity: 240 }],
      totalCapacity: 240,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391010062',
      schoolName: '聖ドミニコ学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 35 },
        { courseName: '総合進学コース', capacity: 60 },
        { courseName: '未来探究進学コース(※女子→共学)', capacity: 60 },
      ],
      totalCapacity: 155,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員155は2026年度と同一だがコース構成が全面再編=特別進学35+総合進学60+未来探究進学60→進学選抜80+進学探究75)',
      },
    },
    {
      schoolCode: 'D104391030013',
      schoolName: '聖和学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進アドバンスコース・特進アスリートコース計(薬師堂キャンパス)', capacity: 90 },
        { courseName: 'リベラルアーツコース(薬師堂キャンパス)', capacity: 200 },
        { courseName: 'プログレスコース(薬師堂キャンパス)', capacity: 100 },
        { courseName: '特進パイオニアコース(三神峯キャンパス)', capacity: 60 },
        { courseName: 'ジェネラルスタディコース(三神峯キャンパス)', capacity: 130 },
      ],
      totalCapacity: 580,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391050018',
      schoolName: '仙台白百合学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(女・併設中学含む)', capacity: 225 }],
      totalCapacity: 225,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は225→175に減少)',
      },
    },
    {
      schoolCode: 'D104391010044',
      schoolName: '仙台大学附属明成高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'スポーツ創志', capacity: 120 },
        { courseName: '福祉未来創志', capacity: 35 },
        { courseName: '食文化創志', capacity: 105 },
        { courseName: '普通', capacity: 70 },
      ],
      totalCapacity: 330,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391010035',
      schoolName: '常盤木学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(リバティコース・スーパー両立コース・国際教養コース計・女)', capacity: 300 },
        { courseName: '音楽', capacity: 30 },
      ],
      totalCapacity: 330,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391050036',
      schoolName: '東北学院榴ケ岡高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース(内特待30)', capacity: 60 },
        { courseName: 'TG選抜コース(内推薦30)', capacity: 80 },
        { courseName: '総合進学コース(内推薦60)', capacity: 130 },
      ],
      totalCapacity: 270,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391010053',
      schoolName: '東北高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '創進コース・文理コース計(創進・文理計)', capacity: 135 },
        { courseName: '文教コース', capacity: 280 },
        { courseName: '栄泉コース・スポーツコース・総合コース計(栄泉・スポ・総合計)', capacity: 245 },
      ],
      totalCapacity: 660,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle:
          KAKE2_2024_SOURCE.docTitle +
          '(総定員660は2026年度と同一。2024年度は栄泉・スポの共有枠に総合コースも含まれていたが2026年度は総合コースの掲載が無くなった)',
      },
    },
    {
      schoolCode: 'D104392050016',
      schoolName: '東陵高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '特別進学コース・総合進学コース計(普通科計)', capacity: 120 }],
      totalCapacity: 120,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104392150015',
      schoolName: '古川学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(進学コース・創志コース・総合コース計)', capacity: 280 },
        { courseName: '情報ビジネス', capacity: 60 },
      ],
      totalCapacity: 340,
      source: { ...KAKE2_2024_SOURCE, docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度と完全に同一)' },
    },
    {
      schoolCode: 'D104391010017',
      schoolName: '宮城学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース(女・約70名含内部)', capacity: 70 },
        { courseName: 'グローバルコミュニケーションコース(女・約30名含内部)', capacity: 30 },
        { courseName: '総合進学コース(女・約70名含内部)', capacity: 70 },
      ],
      totalCapacity: 170,
      source: {
        ...KAKE2_2024_SOURCE,
        docTitle: KAKE2_2024_SOURCE.docTitle + '(2026年度は特別進学コースのみ70→50に減少。総定員170→150)',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D104391030031',
      schoolName: 'クラークＮＥＸＴ高等学校',
      reason: '広域通信制のため育伸社募集要項PDF(全日制中心)に掲載が無いと確認',
    },
    {
      schoolCode: 'D104391040011',
      schoolName: '仙台城南高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D104391050027',
      schoolName: '東北生活文化大学高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D104392120012',
      schoolName: '飛鳥未来きずな高等学校',
      reason: '広域通信制のため育伸社募集要項PDF(全日制中心)に掲載が無いと確認',
    },
    {
      schoolCode: 'D104392140018',
      schoolName: '日本ウェルネス宮城高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D104393020011',
      schoolName: '西山学院高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
