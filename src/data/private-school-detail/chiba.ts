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
 * 大きい方を採用」ルールと同一の考え方)。**続き**: 育伸社PDFの3〜6頁を処理し確度の高い22校を
 * 追加(木更津工業高専は高専のため対象外)。「推薦X+一般Y」のように同一コースが入試方式別の
 * 数値を持つ場合は合算する方針(我孫子二階堂で先例)を踏襲した。日本大学習志野・中央学院等、
 * 複数の校名ブロックが密集し数値の対応関係を確信できなかった学校は誤帰属リスクを避け見送った。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_CHIBA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

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
    {
      schoolCode: 'D112310000242',
      schoolName: '暁星国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '特進・進学コース・グローバルスタディーズコース・インターナショナルコース(全コース計)', capacity: 30 }],
      totalCapacity: 30,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000288',
      schoolName: '光英VERITAS高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(特待選抜)', capacity: 30 },
        { courseName: '普通(推薦・一般)', capacity: 100 },
      ],
      totalCapacity: 130,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000297',
      schoolName: '西武台千葉高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '特別選抜コース・進学コース(全コース計)', capacity: 293 }],
      totalCapacity: 293,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000279',
      schoolName: '専修大学松戸高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'E類型', capacity: 72 },
        { courseName: 'A類型', capacity: 150 },
        { courseName: 'S類型', capacity: 34 },
      ],
      totalCapacity: 256,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000108',
      schoolName: '昭和学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: 'IA・TA・AA・GA・SAコース(全コース計)', capacity: 176 }],
      totalCapacity: 176,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000064',
      schoolName: '昭和学院秀英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(含帰国)', capacity: 80 }],
      totalCapacity: 80,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000493',
      schoolName: '東海大学付属浦安高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 250,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000206',
      schoolName: '東京学館船橋高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通', capacity: 108 },
        { courseName: '情報ビジネス', capacity: 108 },
        { courseName: '食物調理', capacity: 40 },
        { courseName: '美術工芸', capacity: 36 },
      ],
      totalCapacity: 292,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000171',
      schoolName: '東葉高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'S特進クラス', capacity: 26 },
        { courseName: '特進クラス', capacity: 240 },
      ],
      totalCapacity: 266,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000055',
      schoolName: '千葉聖心高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(女子)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000199',
      schoolName: '千葉日本大学第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進クラス', capacity: 40 },
        { courseName: '進学クラス', capacity: 80 },
      ],
      totalCapacity: 120,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000224',
      schoolName: '千葉県安房西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 100,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】｜(株)育伸社入試情報課(単願推薦60・単願/併願/併願特待100の2区分を確認、より大きい100を採用)',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D112310000019',
      schoolName: '千葉経済大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通・特進コース(普通科計)', capacity: 300 },
        { courseName: '商業', capacity: 110 },
        { courseName: '情報処理', capacity: 110 },
      ],
      totalCapacity: 520,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000313',
      schoolName: '千葉萌陽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(女子)', capacity: 80 }],
      totalCapacity: 80,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000028',
      schoolName: '千葉明徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース', capacity: 70 },
        { courseName: '進学コースHSクラス・Sクラス(進学計)', capacity: 140 },
        { courseName: 'アスリート進学コース', capacity: 70 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000554',
      schoolName: '千葉黎明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 46 },
        { courseName: '進学コース', capacity: 190 },
        { courseName: '生産ビジネス', capacity: 40 },
      ],
      totalCapacity: 276,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000162',
      schoolName: '不二女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(女子、推薦60+一般60)', capacity: 120 }],
      totalCapacity: 120,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000572',
      schoolName: '茂原北陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合コース', capacity: 135 },
        { courseName: '特別進学コース', capacity: 25 },
        { courseName: 'ライフデザイン', capacity: 40 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000563',
      schoolName: '横芝敬愛高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 190,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000395',
      schoolName: '流通経済大学付属柏高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合進学コース', capacity: 71 },
        { courseName: 'スポーツ進学コース', capacity: 60 },
        { courseName: '特別進学コース', capacity: 60 },
      ],
      totalCapacity: 191,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000536',
      schoolName: '二松学舎大学附属柏高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'スーパー特別進学コース', capacity: 65 },
        { courseName: '特別進学コース', capacity: 100 },
      ],
      totalCapacity: 165,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000386',
      schoolName: '日本体育大学柏高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: 'オーセンティックラーニングコース・アスリートコース(全コース計)', capacity: 360 }],
      totalCapacity: 360,
      source: IKUSHIN_CHIBA_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D112310000082',
      schoolName: '明聖高等学校',
      reason: '広域通信制高校(平成27年4月認可・全国47都道府県より入学可能)のため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D112310000304',
      schoolName: 'あずさ第一高等学校',
      reason: '東京・神奈川・千葉にキャンパスを持つ広域通信制高校のため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D112310000359',
      schoolName: '東邦大学付属東邦高等学校',
      reason: '2017年に高等学校からの生徒募集を停止し完全中高一貫校化(Wikipediaで確認)',
    },
    {
      schoolCode: 'D112310000581',
      schoolName: 'わせがく高等学校',
      reason: '単位制の通信制高校(本校のほか柏・西船橋・勝田台・稲毛海岸にキャンパス)のため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D112310000590',
      schoolName: '中央国際高等学校',
      reason: '広域通信制高校(首都圏に多数の学習センター)のため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D112310000616',
      schoolName: 'ヒューマンキャンパスのぞみ高等学校',
      reason: '通学型の広域通信制高校(全国45箇所に学習センター)のため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D112310000073',
      schoolName: '渋谷教育学園幕張高等学校',
      reason: '公式募集要項の学則定員295名は中学からの内部進学者を含む合算値のみが公表され、高校からの外部募集人員の内訳が原資料に明記されていないため確認できず(報道では従来約55名→2026年度以降約35名への削減が伝えられるが未確認)',
    },
  ],
};
