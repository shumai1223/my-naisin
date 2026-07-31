/**
 * 静岡県私立高等学校の募集定員データ(Λ-5第二段)。
 * (公社)静岡県私学協会が公表する「令和8年度静岡県私立高等学校生徒募集一覧」PDF(全日制40校)から
 * 全校を1周回で完全収録。栃木県庁PDFと同型の番号付き1校1行+複数学科は「計」欄併記という明瞭な
 * 表形式で、40校のcourses合計を積み上げた結果が原資料の全体合計「11,485(内部進学者1,312名)」と
 * 完全一致することを検算済み(佐賀9/9・富山10/10・栃木15/15に続く4例目の一括完全収録・単独県では
 * 最大の40校)。狭域通信制5校(沼津中央/静岡学園なごみ/静清/キラリ/聖隷クリストファーの各通信課程)
 * は同一校が全日制と別課程で二重掲載される可能性があり紛らわしいため今回は対象外(全日制の値のみ採用)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_SHIZUOKA: PrivateSchoolDetailFile = {
  prefectureCode: 'shizuoka',
  schools: [
    {
      schoolCode: 'D122310000080',
      schoolName: '御殿場西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000017',
      schoolName: '知徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 210 },
        { courseName: '情報ビジネス科', capacity: 80 },
        { courseName: '福祉科', capacity: 80 },
        { courseName: '創造デザイン科', capacity: 40 },
      ],
      totalCapacity: 410,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000035',
      schoolName: '日本大学三島高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 580 },
      ],
      totalCapacity: 580,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000044',
      schoolName: '沼津中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 240 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000053',
      schoolName: '飛龍高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 390 },
        { courseName: '自動車工業科', capacity: 40 },
      ],
      totalCapacity: 430,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000115',
      schoolName: '桐陽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 350 },
      ],
      totalCapacity: 350,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000062',
      schoolName: '加藤学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 390 },
      ],
      totalCapacity: 390,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000124',
      schoolName: '加藤学園暁秀高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進コース・バイリンガルコース)', capacity: 210 },
      ],
      totalCapacity: 210,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000071',
      schoolName: '誠恵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 240 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000106',
      schoolName: '星陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 80 },
        { courseName: '英数科', capacity: 320 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000099',
      schoolName: '静岡県富士見高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 400 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000142',
      schoolName: '清水国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 180 },
        { courseName: 'ITビジネス科', capacity: 70 },
      ],
      totalCapacity: 250,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000151',
      schoolName: '静岡サレジオ高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 210 },
      ],
      totalCapacity: 210,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000160',
      schoolName: '東海大学付属静岡翔洋高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 360 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000188',
      schoolName: '静岡大成高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 200 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000197',
      schoolName: '静岡英和女学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(女子)', capacity: 120 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000213',
      schoolName: '城南静岡高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'ICT科', capacity: 240 },
        { courseName: '普通科', capacity: 40 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000222',
      schoolName: '静岡女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(女子)', capacity: 80 },
        { courseName: '家政科(女子)', capacity: 40 },
        { courseName: '商業科(女子)', capacity: 40 },
        { courseName: '福祉科(女子)', capacity: 40 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000231',
      schoolName: '常葉大学附属常葉高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(女子)', capacity: 120 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000240',
      schoolName: '常葉大学附属橘高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 340 },
        { courseName: '英数科', capacity: 60 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000259',
      schoolName: '静岡北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '理数科', capacity: 90 },
        { courseName: '国際コミュニケーション科', capacity: 40 },
        { courseName: '普通科', capacity: 310 },
      ],
      totalCapacity: 440,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000268',
      schoolName: '静岡学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '教養科学科', capacity: 360 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000302',
      schoolName: '静岡聖光学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(男子)', capacity: 120 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000277',
      schoolName: '焼津高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合学科', capacity: 175 },
      ],
      totalCapacity: 175,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000179',
      schoolName: '静清高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理探究科', capacity: 40 },
        { courseName: '工学探究科', capacity: 200 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000286',
      schoolName: '藤枝順心高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(女子)', capacity: 160 },
      ],
      totalCapacity: 160,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000320',
      schoolName: '藤枝明誠高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 200 },
        { courseName: '英数科', capacity: 185 },
      ],
      totalCapacity: 385,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000295',
      schoolName: '島田樟誠高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000311',
      schoolName: '常葉大学附属菊川高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 335 },
        { courseName: '美術・デザイン科', capacity: 40 },
      ],
      totalCapacity: 375,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000339',
      schoolName: '磐田東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 330 },
      ],
      totalCapacity: 330,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000348',
      schoolName: '浜松学院興誠高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000384',
      schoolName: '浜松修学舎高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '夢みらい科', capacity: 210 },
        { courseName: '看護・看護専攻科', capacity: 70 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000366',
      schoolName: '浜松開誠館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000375',
      schoolName: '浜松学芸高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 196 },
        { courseName: '探究創造科', capacity: 60 },
        { courseName: '芸術科', capacity: 70 },
      ],
      totalCapacity: 326,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000357',
      schoolName: '静岡県西遠女子学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(女子)', capacity: 150 },
      ],
      totalCapacity: 150,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000393',
      schoolName: '浜松聖星高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 240 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000400',
      schoolName: '浜松日体高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 320 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000419',
      schoolName: '聖隷クリストファー高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '英数科', capacity: 60 },
        { courseName: '普通科', capacity: 234 },
      ],
      totalCapacity: 294,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000428',
      schoolName: 'オイスカ浜松国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 180 },
      ],
      totalCapacity: 180,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D122310000437',
      schoolName: '浜松啓陽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '情報コミュニケーション科', capacity: 200 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.shizuoka-shigaku.net/app/uploads/R8koukou-bosyu.pdf',
        docTitle: '令和8年度静岡県私立高等学校生徒募集一覧｜(公社)静岡県私学協会(全日制40校の学科別募集定員表・学校ごとの「計」欄と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D122310000026',
      schoolName: '不二聖心女子学院高等学校',
      reason: '静岡県私学協会「令和8年度静岡県私立高等学校生徒募集一覧」(全日制40校)に掲載が無く、募集定員を確認できなかった。',
    },
    {
      schoolCode: 'D122310000133',
      schoolName: '菊川南陵高等学校',
      reason: '静岡県私学協会「令和8年度静岡県私立高等学校生徒募集一覧」(全日制40校)に掲載が無く、募集定員を確認できなかった。',
    },
    {
      schoolCode: 'D122310000204',
      schoolName: '静岡雙葉高等学校',
      reason: '静岡県私学協会「令和8年度静岡県私立高等学校生徒募集一覧」(全日制40校)に掲載が無く、募集定員を確認できなかった。',
    },
    {
      schoolCode: 'D122310000446',
      schoolName: 'キラリ高等学校',
      reason: '全日制一覧には掲載が無く、狭域通信制一覧(募集定員500名)にのみ掲載。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D122310000455',
      schoolName: '静岡学園なごみ高等学校',
      reason: '全日制一覧には掲載が無く、狭域通信制一覧(募集定員80名)にのみ掲載。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D122310000464',
      schoolName: '静岡泉洋高等学校',
      reason: '静岡県私学協会「令和8年度静岡県私立高等学校生徒募集一覧」(全日制40校)に掲載が無く、募集定員を確認できなかった。',
    },
    {
      schoolCode: 'D122310000473',
      schoolName: 'あおい開惺高等学校',
      reason: '静岡県私学協会「令和8年度静岡県私立高等学校生徒募集一覧」(全日制40校)に掲載が無く、募集定員を確認できなかった。',
    },
    {
      schoolCode: 'D122310000482',
      schoolName: '聖隷クリストファーグローバルスクール高等部',
      reason: '静岡県私学協会「令和8年度静岡県私立高等学校生徒募集一覧」(全日制40校)に掲載が無く、募集定員を確認できなかった。',
    },
  ],
};
