/**
 * 宮崎県私立高等学校の募集定員データ(Λ-5第二段)。
 * schools-private/miyazaki.ts(第一段・機械生成の参照台帳)14校のうち、個別学校の
 * 公式サイト調査で10校を先に収録。その後熊本・大分・鹿児島・山形・群馬・茨城・
 * 山口・広島・奈良・岩手・千葉・宮城に続き(株)育伸社(入試情報課)の「2026年度
 * 高専・私立高校募集要項【宮崎県】」(2025年11月4日現在)から都城聖ドミニコ学園・
 * 延岡学園・小林西の3校を追加(既存の宮崎学園=340・宮崎日本大学=500・都城=260は
 * 育伸社データと独立に完全一致確認できた)。日章学園九州国際高等学校のみこのPDFに
 * 掲載が無く見送り。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_MIYAZAKI: PrivateSchoolDetailFile = {
  prefectureCode: 'miyazaki',
  schools: [
    {
      schoolCode: 'D145320159027',
      schoolName: '宮崎学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進科', capacity: 110 },
        { courseName: '普通科(総合進学/グローバル/スポーツ科学/音楽/幼児保育コース計)', capacity: 170 },
        { courseName: '経営情報科', capacity: 60 },
      ],
      totalCapacity: 340,
      source: {
        url: 'https://www.miyagaku.ed.jp/wp-miyagaku/wp-content/uploads/2025/10/令和８年度入試要項.pdf',
        docTitle: '令和8年度 入学試験要項｜宮崎学園高等学校(専願受験の募集定員表・110+170+60=340で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159045',
      schoolName: '宮崎日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学科', capacity: 140 },
        { courseName: '総合進学科', capacity: 175 },
        { courseName: '英語進学科', capacity: 60 },
        { courseName: '芸術学科', capacity: 60 },
        { courseName: 'ICTソリューション学科', capacity: 65 },
      ],
      totalCapacity: 500,
      source: {
        url: 'https://www.m-nichidai.com/highschool/high_exam/high_pref/',
        docTitle: '入試情報(学科別募集定員)｜宮崎日本大学高等学校公式サイト(140+175+60+60+65=500で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159063',
      schoolName: '宮崎第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理科(内部進学生含む)', capacity: 140 },
        { courseName: '普通科', capacity: 60 },
        { courseName: '国際マルチメディア科', capacity: 60 },
        { courseName: '電気科', capacity: 40 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://miyaichi.ed.jp/hs/entry/',
        docTitle: '入試要項(学科別募集定員)｜宮崎第一中学高等学校公式サイト',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159072',
      schoolName: '日章学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学科(特別進学コース+特別アスリートコース)', capacity: 40 },
        { courseName: '普通科 共生コース', capacity: 20 },
        { courseName: '普通科 スポーツ進学コース', capacity: 35 },
        { courseName: '普通科 経営情報コース', capacity: 20 },
        { courseName: 'ヘアーデザイン科', capacity: 40 },
        { courseName: 'パティシエ科', capacity: 30 },
        { courseName: '福祉科', capacity: 25 },
        { courseName: 'トータルエステティック科', capacity: 30 },
        { courseName: '調理科', capacity: 120 },
        { courseName: 'コンピュータ科', capacity: 30 },
        { courseName: '電気科', capacity: 30 },
        { courseName: '自動車科', capacity: 30 },
      ],
      totalCapacity: 450,
      source: {
        url: 'https://nissho.ed.jp/wp-content/uploads/2025/10/2026youkou.pdf',
        docTitle: '令和8年度 募集要項｜日章学園高等学校(設置学科・募集定員表、自動車科は表中「30名(35名)」の併記だが本体数値30名を採用・合計450名と完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159081',
      schoolName: '鵬翔高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進英数科', capacity: 100 },
        { courseName: '英数科(総合進学コース+トップアスリートコース)', capacity: 90 },
        { courseName: '未来創造学科(ICT未来型ものづくり+ビジネスパイオニア+メディカルデンタルコース)', capacity: 100 },
        { courseName: '看護科(女子のみ)', capacity: 80 },
      ],
      totalCapacity: 370,
      source: {
        url: 'https://www.hosho.ed.jp/wp-content/uploads/2025/09/鵬翔高校入学試験要項.pdf',
        docTitle: '令和8年度 入学試験要項｜鵬翔高等学校(募集定員表・100+90+100+80=370【370名】と完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320259106',
      schoolName: '都城高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '電気システム科(2年次より電子技術/電気技術コースに分岐)', capacity: 40 },
        { courseName: '情報ビジネス科', capacity: 30 },
        { courseName: '福祉科', capacity: 20 },
        { courseName: '文理科', capacity: 15 },
        { courseName: '普通科(総合/農業経営/食物調理/ヘアーデザイン/トータルビューティー/ライフ/スポーツコース計)', capacity: 155 },
      ],
      totalCapacity: 260,
      source: {
        url: 'https://kubogakuen.ac.jp/full-time-course/',
        docTitle: '全日制課程(学科別募集定員)｜学校法人久保学園 都城高等学校公式サイト(40+30+20+15+155=260で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320359052',
      schoolName: '聖心ウルスラ学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学コース・総合コース)', capacity: 155 },
        { courseName: '看護科', capacity: 40 },
      ],
      totalCapacity: 195,
      source: {
        url: 'https://www.ursula.ed.jp/high/admission/requirements/img/聖心ウルスラ学園生徒募集要項-web用.pdf',
        docTitle: '令和8年度 生徒募集要項｜聖心ウルスラ学園高等学校(学科・募集定員表・155+40=195で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320459131',
      schoolName: '日南学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '理数科', capacity: 30 },
        { courseName: '普通科 キャリアデザインコース(新設)', capacity: 40 },
        { courseName: '普通科 アスリートコース(名称変更)', capacity: 70 },
        { courseName: '普通科 共育コース(名称変更)', capacity: 10 },
        { courseName: '看護科', capacity: 40 },
        { courseName: '調理科', capacity: 30 },
        { courseName: '通信制課程 普通科', capacity: 20 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.nichigaku-highschool.info/img/doc/requirements2026.pdf',
        docTitle: '2026年度入学生 生徒募集要項｜日南学園高等学校(設置学科・募集定員表。合計の明記は原資料に無いため courses 合計240を totalCapacity として採用)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145334159126',
      schoolName: '櫻美学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'スマートビジネス科', capacity: 30 },
        { courseName: '普通科 特別進学', capacity: 15 },
        { courseName: '普通科 進学キャリア', capacity: 15 },
        { courseName: '普通科 スポーツ', capacity: 20 },
        { courseName: '普通科 ヘアービューティ', capacity: 25 },
        { courseName: '普通科 夢サポート', capacity: 15 },
        { courseName: '調理科', capacity: 70 },
        { courseName: 'スマートエンジニア科', capacity: 60 },
        { courseName: '看護科(5年課程)', capacity: 40 },
      ],
      totalCapacity: 290,
      source: {
        url: 'https://oubi.ed.jp/edco/wp-content/uploads/2025/10/e17522b60a0e65e045b4a3471e05d096.pdf',
        docTitle: '令和8年度 櫻美学園高等学校 生徒募集要項(募集定員表・30+90(普通科5コース計)+70+60+40=290で完全一致)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D145320159018',
      schoolName: '日向学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 160,
      source: {
        url: 'http://www.hyugagakuin.ac.jp/data/requirements_senior.pdf',
        docTitle: '令和8年度 日向学院高等学校 生徒募集要項(募集定員表・普通科160名(内部進学生を含む))',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D145320259142',
      schoolName: '都城聖ドミニコ学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 90 },
        { courseName: '普通(単位制)', capacity: 10 },
      ],
      totalCapacity: 100,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03945.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【宮崎県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D145320359098',
      schoolName: '延岡学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '調理', capacity: 40 },
        { courseName: '普通', capacity: 170 },
        { courseName: '情報テックリート(新設)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03945.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【宮崎県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D145320559112',
      schoolName: '小林西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 50 },
        { courseName: 'ビジネス総合', capacity: 40 },
        { courseName: '調理', capacity: 30 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03945.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【宮崎県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D145320959163',
      schoolName: '日章学園九州国際高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
  ],
};
