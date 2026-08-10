/**
 * 香川県私立高等学校の募集定員データ(Λ-5第二段)。
 * 香川県総務部総務学事課が公表する「令和8年度香川県内私立高等学校生徒募集要項」
 * (全日制・その1/その2の2分冊、計3,272名)に、県内私立高校の学科別募集定員が
 * まとまっていた(佐賀の県庁一覧に続く県庁直接発表の高効率パターン)。
 * 別冊の「通信制生徒募集要項」(計580名)も突合し、穴吹学園・村上学園・RITA学園の
 * 3校が通信制専門校(全日制課程なし)であることを確認した。
 *
 * 【重要】県資料内の「香川県藤井高等学校」は、2026年度から校名変更した現在の
 * 「蓬莱高等学校」と同一校(2026年度入学式で新校名初適用・報道で確認)。MEXT学校
 * コード一覧(2026-05-29公表)では既に新校名「蓬莱高等学校」で登録されているため、
 * 本ファイルもD137320200026(蓬莱高等学校)としてこの資料の定員データを紐付ける。
 *
 * 【掛-2(私立×多年度)追加・2026-08-10】同ページ(youkou2024.html)経由のPDFはr8ippan.pdf
 * のように年度接頭辞付きファイル名だが、令和7年度時点では接頭辞なしの`ippan.pdf`だった
 * (Wayback CDX APIで2025-01-17キャプチャを発掘)。9校が一致・1校(藤井→蓬莱)で実際の
 * 変化を検出・1校(大手前丸亀)は令和7年度資料に存在せず令和8年度新設と判明。
 * 合計3,352(令和7年度・9校)-500(藤井旧)+340(蓬莱新)+80(大手前丸亀新設)=3,272
 * (令和8年度・10校)と完全に整合し読み取り精度を裏付けた。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.pref.kagawa.lg.jp/documents/43700/r8ippan.pdf',
  docTitle: '令和8年度香川県内私立高等学校全日制生徒募集要項(香川県総務部総務学事課)',
  fetchedAt: '2026-07-30',
  sourceTier: 'primary' as const,
};

const KAKE2_2025_SOURCE = {
  url: 'https://web.archive.org/web/20250117120851if_/https://www.pref.kagawa.lg.jp/documents/43700/ippan.pdf',
  docTitle: '令和7年度香川県内私立高等学校全日制生徒募集要項(香川県総務部総務学事課・Web Archive 2025-01-17キャプチャ経由で取得)',
  fetchedAt: '2026-08-10',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_KAGAWA: PrivateSchoolDetailFile = {
  prefectureCode: 'kagawa',
  schools: [
    {
      schoolCode: 'D137320100018',
      schoolName: '英明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 570 }],
      totalCapacity: 570,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320100027',
      schoolName: '高松中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 360 },
        { courseName: '商業科', capacity: 120 },
      ],
      totalCapacity: 480,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320100036',
      schoolName: '大手前高松高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 450 }],
      totalCapacity: 450,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320100045',
      schoolName: '香川誠陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320200017',
      schoolName: '大手前丸亀高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 80 }],
      totalCapacity: 80,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(令和7年度資料には掲載なし=令和8年度新設とみられる)' },
    },
    {
      schoolCode: 'D137320200026',
      schoolName: '蓬莱高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科ユリーカコース', capacity: 70 },
        { courseName: '普通科アンビシャスコース・地域創造コース計', capacity: 180 },
        { courseName: '商業科スポーツビジネスコース', capacity: 90 },
      ],
      totalCapacity: 340,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '(資料内の表記は旧校名「香川県藤井高等学校」・2026年度に蓬莱高等学校へ校名変更)',
      },
    },
    {
      schoolCode: 'D137320300016',
      schoolName: '坂出第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科特別進学コース', capacity: 30 },
        { courseName: '普通科選択型コース', capacity: 210 },
        { courseName: '食物科', capacity: 72 },
      ],
      totalCapacity: 312,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320400015',
      schoolName: '尽誠学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科特別進学コース', capacity: 40 },
        { courseName: '普通科(進学・アビリティ・アスリートコース計)', capacity: 200 },
        { courseName: '衛生看護科', capacity: 80 },
      ],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320600013',
      schoolName: '寒川高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 210 },
        { courseName: '看護科', capacity: 40 },
      ],
      totalCapacity: 250,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(資料内の運営法人名は「藤井学園」)' },
    },
    {
      schoolCode: 'D137320800011',
      schoolName: '四国学院大学香川西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特別進学・Neo・スポーツ・キャリアコース計)', capacity: 190 },
        { courseName: '衛生看護科', capacity: 80 },
      ],
      totalCapacity: 270,
      source: SOURCE,
    },
    {
      schoolCode: 'D137320100018',
      schoolName: '英明高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 570 }],
      totalCapacity: 570,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D137320100027',
      schoolName: '高松中央高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 360 },
        { courseName: '商業科', capacity: 120 },
      ],
      totalCapacity: 480,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D137320100036',
      schoolName: '大手前高松高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 450 }],
      totalCapacity: 450,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D137320100045',
      schoolName: '香川誠陵高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D137320200026',
      schoolName: '蓬莱高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科ユリーカコース', capacity: 70 },
        { courseName: '普通科アンビシャスコース・地域創造コース計', capacity: 180 },
        { courseName: '商業科', capacity: 250 },
      ],
      totalCapacity: 500,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(資料内の表記は旧校名「香川県藤井高等学校」。普通科は令和8年度と完全に同一だが商業科は250→90へ大幅減少=令和8年度の校名変更(蓬莱高等学校へ)に伴う商業科再編とみられる)',
      },
    },
    {
      schoolCode: 'D137320300016',
      schoolName: '坂出第一高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科特別進学コース', capacity: 30 },
        { courseName: '普通科選択型コース', capacity: 210 },
        { courseName: '食物科', capacity: 72 },
      ],
      totalCapacity: 312,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D137320400015',
      schoolName: '尽誠学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科特別進学コース', capacity: 40 },
        { courseName: '普通科(進学・アビリティ・アスリートコース計)', capacity: 200 },
        { courseName: '衛生看護科', capacity: 80 },
      ],
      totalCapacity: 320,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D137320600013',
      schoolName: '寒川高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 210 },
        { courseName: '看護科', capacity: 40 },
      ],
      totalCapacity: 250,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一。資料内の運営法人名は「藤井学園」)',
      },
    },
    {
      schoolCode: 'D137320800011',
      schoolName: '四国学院大学香川西高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科(特別進学・Neo・スポーツ・キャリアコース計)', capacity: 190 },
        { courseName: '衛生看護科', capacity: 80 },
      ],
      totalCapacity: 270,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D137320100054',
      schoolName: '穴吹学園高等学校',
      reason: '2021年開校の通信制専門校(全日制課程なし)。県の通信制生徒募集要項では募集定員100名(週5日登校型・フレックス型)。',
    },
    {
      schoolCode: 'D137320200035',
      schoolName: '村上学園高等学校',
      reason: '通信制専門校(全日制課程なし・丸亀/高松の2校舎)。県の通信制生徒募集要項では募集定員100名(丸亀・高松合計)。',
    },
    {
      schoolCode: 'D137340400013',
      schoolName: 'ＲＩＴＡ学園高等学校',
      reason: '広域通信制・単位制専門校(全日制課程なし・47都道府県から募集)。県の通信制生徒募集要項では募集定員100名。',
    },
  ],
};
