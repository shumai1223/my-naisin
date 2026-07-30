/**
 * 千葉県私立高等学校の募集定員データ(Λ-5第二段)。
 * 千葉県(総務部学事課)が公表する「令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項
 * について」PDF(全日制53校・合計12,578人)から、複数の入試方式(推薦/一般/前期/後期)にまたがり
 * 同一の募集人員が繰り返し記載され単一の学校全体定員と確度高く判断できた6校を先に収録。
 * その後、熊本・大分・鹿児島・山形・群馬・茨城・山口・広島・奈良・岩手に続き(株)育伸社
 * (入試情報課)の「2026年度高専・私立高校募集要項【千葉県】」(2025年11月4日現在・6頁53校超)
 * から追加で10校を収録した(既存の千葉敬愛=406・敬愛学園=320・八千代松陰≈439は育伸社データと
 * 独立にクロスチェックが取れている)。千葉県は学校数が非常に多く(参照台帳62校)複数コースの
 * 「単願X・併願Y(X<Y)」という記法が頻出するため、この場合は併願側のより大きい数値を当該コースの
 * 公表総定員として採用する方針とした(Hiroshima崇徳・Ibaraki常総学院で確立した「一般時点の
 * 大きい方を採用」ルールと同一の考え方)。育伸社PDFの3〜6頁はまだ未処理で残っており、次回以降の
 * 継続対象とする。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_CHIBA: PrivateSchoolDetailFile = {
  prefectureCode: 'chiba',
  schools: [
    {
      schoolCode: 'D112310000518',
      schoolName: '千葉敬愛高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 406,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(A推薦/特別活動推薦/一般A/一般Bの全区分で募集人員406が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000037',
      schoolName: '敬愛学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 320,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(推薦/第1回一般/第2回一般/第3回一般の全区分で募集人員320が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000439',
      schoolName: '八千代松陰高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 439,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(第1回/第2回の単願・併願全区分で募集人員439が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000527',
      schoolName: '愛国学園大学附属四街道高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 160,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(前期推薦/前期一般/前期推薦併願の全区分で募集人員160が共通記載・後期は「若干名」と別記のため160には含めない)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000251',
      schoolName: '志学館高等部',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 200,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(前期Ⅰ/Ⅱ/Ⅲの全区分で募集人員200が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000260',
      schoolName: '木更津総合高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 600,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(前期1/2/3の全区分で募集人員600が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000368',
      schoolName: '麗澤高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'S特進コース', capacity: 35 },
        { courseName: '特選コース', capacity: 85 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(第1回・第2回とも各コースで同一の募集人員35/85が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000420',
      schoolName: '千葉英和高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 320 },
        { courseName: '英語科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(第一志望・併願とも各学科で同一の募集人員320/40が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000144',
      schoolName: '千葉商科大学付属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進選抜', capacity: 205 },
        { courseName: '普通科 総合進学', capacity: 280 },
        { courseName: '商業科', capacity: 70 },
      ],
      totalCapacity: 555,
      source: {
        url: 'https://www.pref.chiba.lg.jp/gakuji/press/2025/documents/r8koukou.pdf',
        docTitle: '令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項について｜千葉県総務部学事課(推薦/一般の全区分で各コース205/280/70が共通記載)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D112310000457',
      schoolName: '我孫子二階堂高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学コース(推薦50+一般10)', capacity: 60 },
        { courseName: '総合コース(推薦100+一般40)', capacity: 140 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000117',
      schoolName: '市川高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(単願推薦30+一般90・帰国含む)', capacity: 120 }],
      totalCapacity: 120,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000411',
      schoolName: '市原中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'ハイレベルチャレンジコースⅠ類', capacity: 60 },
        { courseName: 'ハイレベルチャレンジコースⅡ類', capacity: 200 },
        { courseName: 'グローバルリーダーコース', capacity: 20 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000046',
      schoolName: '植草学園大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通コース(女)', capacity: 200 },
        { courseName: '特進コース', capacity: 40 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000091',
      schoolName: '桜林高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(A日程推薦140+B日程一般20)', capacity: 160 }],
      totalCapacity: 160,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000475',
      schoolName: '鴨川令徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(前期単願90+後期20)', capacity: 110 }],
      totalCapacity: 110,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000484',
      schoolName: '翔凜高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 160 },
        { courseName: '進学コース', capacity: 160 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000340',
      schoolName: '敬愛大学八日市場高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '進学コース(前期推薦60+後期20)', capacity: 80 },
        { courseName: '普通コース(前期推薦100+後期20)', capacity: 120 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000448',
      schoolName: '秀明大学学校教師学部附属秀明八千代高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 50 },
        { courseName: '国際英語コース', capacity: 60 },
        { courseName: '文理選抜コース', capacity: 100 },
        { courseName: '総合進学コース', capacity: 100 },
      ],
      totalCapacity: 310,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000153',
      schoolName: '国府台女子学院高等部',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特待選抜', capacity: 30 },
        { courseName: '推薦・一般', capacity: 100 },
      ],
      totalCapacity: 130,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
      },
    },
  ],
  skipped: [],
};
