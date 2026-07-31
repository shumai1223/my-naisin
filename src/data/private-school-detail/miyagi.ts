/**
 * 宮城県私立高等学校の募集定員データ(Λ-5第二段)。
 * 宮城県私立中学高等学校連合会サイトには入試日程一覧PDFのみで募集定員の記載が無く、
 * 一括収録は見送り。個別学校の公式サイトから募集要項PDFを確認する方式で仙台育英学園
 * (1,000名)と東北学院(360名)の2校を先に確認し、その後熊本・大分・鹿児島・山形・
 * 群馬・茨城・山口・広島・奈良・岩手・千葉に続き(株)育伸社(入試情報課)の
 * 「2026年度高専・私立高校募集要項【宮城県】」(2025年11月4日現在)から11校を追加した。
 * 育伸社データは既存2校の数値とも独立に一致確認できた(仙台育英学園の7コース内訳・
 * 東北学院TG総進コースの普通科計360は既存記録と完全一致)。東北高等学校・クラークNEXT・
 * 仙台城南・東北生活文化大学・東陵・飛鳥未来きずな・日本ウェルネス宮城・西山学院の
 * 8校はこのPDFに掲載が無く見送り(クラークNEXT・飛鳥未来きずなは広域通信制)。
 * 東北学院榴ケ岡は「創進・文理計135」「栄泉・スポ計245」のように2コースずつ共有する
 * 変則的な命名だったため原資料の注記をそのまま反映した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03904.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【宮城県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
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
        { courseName: '創進コース・TG選抜コース計(創進・文理計)', capacity: 135 },
        { courseName: '文理コース', capacity: 280 },
        { courseName: '栄泉コース・スポーツコース計(栄泉・スポ計)', capacity: 245 },
      ],
      totalCapacity: 660,
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
  ],
  skipped: [
    {
      schoolCode: 'D104391010053',
      schoolName: '東北高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
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
      schoolCode: 'D104392050016',
      schoolName: '東陵高等学校',
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
