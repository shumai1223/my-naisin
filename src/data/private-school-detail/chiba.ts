/**
 * 千葉県私立高等学校の募集定員データ(Λ-5第二段)。
 * 千葉県(総務部学事課)が公表する「令和8年度千葉県私立小・中・中等教育・高等学校生徒募集要項
 * について」PDF(全日制53校・合計12,578人)から、複数の入試方式(推薦/一般/前期/後期)にまたがり
 * 同一の募集人員が繰り返し記載され単一の学校全体定員と確度高く判断できた6校のみを収録。
 * 前期/後期または推薦/一般で異なる数字が別々に記載されている学校(加算可能か原資料だけでは
 * 判別できない)は、誤帰属リスクを避けて今回は見送り、次回以降に各校公式サイトでの裏取りを
 * 前提に再訪する。栃木県庁PDFと異なり本資料には学校ごとの「計」欄が無く合計は県全体のみの
 * ため、courses は空(単一定員)として記録している。
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
  ],
  skipped: [],
};
