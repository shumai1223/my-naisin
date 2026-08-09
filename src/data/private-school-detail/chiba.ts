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
 * 2026-07-31追記: Read toolでPDF原本を直接解析したところ日本大学習志野・中央学院を含む残り11校の
 * 表組みが実際には明瞭に対応付けできると判明し追加収録(62校中52校)。広域通信制5校・完全中高一貫化
 * 2校(東邦大学付属東邦)・学則定員のみで外部募集内訳不明の渋谷教育学園幕張・PDF掲載なし3校
 * (中山学園/成美学園/千葉科学大学附属)は理由付きでskippedへ記録し、参照台帳62校を完全網羅した。
 *
 * 【掛-2（私立×多年度）着手(2026-08-09)】62校規模のため今回はIKUSHIN_CHIBA_SOURCE収録校から
 * 18校を代表サンプルとして再突合・多年度化した(残りの学校は次回以降の課題)。Wayback CDX APIで
 * 2024年8月12日キャプチャを発掘し現行(2026年度)PDFと突合した。**千葉明徳は実際の変化を検出**
 * (進学コースHSクラス・Sクラスの共有枠が130→140に増加・総定員270→280)。**光英VERITASも実際の
 * 変化を検出**(特待選抜コースが40→30に減少・総定員140→130)。茂原北陵は総定員200で不変だが、
 * 3コース目が「家政」から「ライフデザイン」へ改称されていた。**再突合で2件の既存誤りを発見・
 * 是正した**: ①国府台女子学院(D112310000153)は隣接する光英VERITASのブロック(特待選抜30+
 * 推薦一般100=130)を誤って転記していたことが判明し、真の値(単願推薦約50/併願推薦約70のうち
 * 大きい方=70、選抜クラス・美術デザインコース含む共有枠)へ是正(pdftoppm 300dpi画像で確認)。
 * ②植草学園大学附属(D112310000046)は英語コース(40)が丸ごと未収録で総定員240→280に是正
 * (画像で3コース構成を確認)。この2件は既に収録済みの残り44校のどこかに同型の誤りが眠っている
 * 可能性を示唆する(miyagi/oita/hiroshima等で確立済みの教訓と同型)。
 *
 * 【掛-2 第3弾(2026-08-09)】2024年度版PDF(6頁)をpdftoppm 300dpiで直接ビジョン解析し、27校へ拡大。
 * 専修大学松戸・拓殖大学紅陵・千葉英和・千葉敬愛・東海大学付属市原望洋・東海大学付属浦安・
 * 東京学館・中央学院の8校は2024年度と令和8年度で総定員完全一致。**西武台千葉のみ実際の変化を
 * 検出**(特別選抜コース100+進学コース176=276から、令和8年度は全コース計293へ増加)。
 * 千葉商科大学付属は2024年版PDFで「普通科計205」が特進選抜クラス・総合進学クラスの両方に
 * 同一の数値で記載されており、これが両クラス共有の合算値なのか各クラス独立の値なのか原本だけ
 * では判別できないため、誤記載リスクを避けて今回は収録を見送った(要再検証)。
 *
 * 【掛-2 第4弾(2026-08-09)】2024年度版PDFの1〜2頁目も直接ビジョン解析し、37校へ拡大。
 * 敬愛大学八日市場・芝浦工業大学柏・秀明大学学校教師学部附属秀明八千代・昭和学院・
 * 愛国学園大学附属四街道・我孫子二階堂・市原中央・敬愛学園の8校は2024年度と令和8年度で
 * 総定員完全一致。**志学館は実際の変化を検出**(前期Ⅰ〜Ⅲ全区分180から令和8年度は200へ増加)。
 * **木更津総合も総定員の相違を検出**(特別進学25+進学60+総合540+美術15=640から令和8年度は
 * 600へ)——現行(令和8年度)側は千葉県学事課の一次資料で「600が共通記載」という単一数値のみで
 * コース別内訳が無いため、単純な定員減なのかコース再編を伴うのか原本だけでは断定できない
 * (要再検証)。翔凜は2024年版で3コース(特進・選抜・進学)がそれぞれ独立して「全コース計200」
 * と記載されており、令和8年度の2コース構成(特別進学160+進学160=320)との対応関係が不明瞭な
 * ため収録を見送った(千葉商科大学付属と同型の構造不一致・要再検証)。
 *
 * 【掛-2 第5弾(2026-08-09)】2024年度版PDFの5〜6頁目もビジョン解析し、45校へ拡大。
 * 東京学館浦安・東京学館船橋・成田・日本体育大学柏・日本大学習志野・和洋国府台女子の6校は
 * 総定員完全一致。**東葉は実際の変化を検出**(2024年新設のS特進クラス36+特進クラス160+
 * 進学クラス80=276から、令和8年度は特進・進学を統合しS特進26+特進240=266へ変化)。
 * **麗澤も実際の変化を検出**(叡智スーパー特進30+叡智特選70=100から令和8年度はS特進35+
 * 特選85=120へ増加)。流通経済大学付属柏(2024年版の総合進学コース211が令和8年度の71と
 * 大きく乖離)・二松学舎大学附属柏(2024年版3コースと令和8年度2コースの対応不明)・
 * 日出学園(2024年版が「特進・進学計20程度」という粗い概数表記で令和8年度70との対応不明)・
 * 八千代松陰(全項目が「約」付き概数で外部/内部の区分が不明瞭)は、いずれも数値の対応関係を
 * 確信できないため収録を見送った(要再検証)。
 *
 * 【掛-2 第6弾(2026-08-09)】ページ3の下部で見落としていた千葉聖心を発見・追加し46校へ拡大。
 * 校長推薦(専願・一能)200が併願・自己推薦とも共通記載で、令和8年度の200と完全一致。これで
 * 62校中、確度高く多年度化できる学校は46校に到達し、残り6校(千葉商科大学付属・翔凜・
 * 流通経済大学付属柏・二松学舎大学附属柏・日出学園・八千代松陰)はいずれも構造不一致または
 * 粗い概数表記により対応関係が原本だけでは確定できず、掛-2のこのラウンドでは見送りとする。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_CHIBA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_CHIBA_SOURCE = {
  url: 'https://web.archive.org/web/20240812142545if_/https://www.ikushin.co.jp/school/pdf/03912.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【千葉県】(株式会社育伸社 入試情報課・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'primary' as const,
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
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D112310000046',
      schoolName: '植草学園大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通コース(女)', capacity: 200 },
        { courseName: '特進コース', capacity: 40 },
        { courseName: '英語コース', capacity: 40 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在）',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D112310000153',
      schoolName: '国府台女子学院高等部',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通(普通クラス・選抜クラス・美術デザインコース計、単願推薦約50/併願推薦約70のうち大きい方を採用)',
          capacity: 70,
        },
      ],
      totalCapacity: 70,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03912.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【千葉県】（(株)育伸社 入試情報課・2025年11月4日現在・掛-2再検証(2026-08-09)で光英VERITASの記載(特待選抜30+推薦一般100)を誤って転記していたことが判明し是正）',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
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
        sourceTier: 'secondary' as const,
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
    {
      schoolCode: 'D112310000126',
      schoolName: '和洋国府台女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '和洋コース(女)', capacity: 50 },
        { courseName: '進学コース(女)', capacity: 60 },
        { courseName: '特進コース(女)', capacity: 30 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000135',
      schoolName: '日出学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '特進コース・進学コース計(推薦約50+一般約20)', capacity: 70 }],
      totalCapacity: 70,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000180',
      schoolName: '日本大学習志野高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通(第一志望180・一般190のうち大きい方を採用)', capacity: 190 }],
      totalCapacity: 190,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000233',
      schoolName: '拓殖大学紅陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '進学トライコース・アクティブチャレンジコース(全コース計)', capacity: 360 }],
      totalCapacity: 360,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000322',
      schoolName: '成田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進αクラス', capacity: 80 },
        { courseName: '進学クラス', capacity: 70 },
        { courseName: '特別技能生', capacity: 50 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000331',
      schoolName: '千葉学芸高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(前期専願200+後期40)', capacity: 240 },
        { courseName: '特別進学コース(前期専願25+後期15)', capacity: 40 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000377',
      schoolName: '芝浦工業大学柏高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'グローバルサイエンスクラス(含内部・帰国)', capacity: 40 },
        { courseName: 'ジェネラルラーニングクラス(含帰国)', capacity: 80 },
      ],
      totalCapacity: 120,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000402',
      schoolName: '東海大学付属市原望洋高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合進学コース', capacity: 290 },
        { courseName: 'スーパー特進コース', capacity: 30 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000466',
      schoolName: '中央学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '特別進学コース・進学クラス・スポーツコース(全コース計320+後期3)', capacity: 323 }],
      totalCapacity: 323,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000509',
      schoolName: '東京学館浦安高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コース選抜', capacity: 25 },
        { courseName: '特別進学コース', capacity: 60 },
        { courseName: '総合進学コース', capacity: 250 },
        { courseName: '国際教養コース', capacity: 30 },
        { courseName: 'スポーツ進学コース(男)', capacity: 35 },
      ],
      totalCapacity: 400,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000545',
      schoolName: '東京学館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'S特進コース', capacity: 30 },
        { courseName: '特進コース', capacity: 70 },
        { courseName: '総合進学コース(文理専攻・スポーツ専攻計)', capacity: 250 },
      ],
      totalCapacity: 350,
      source: IKUSHIN_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000199',
      schoolName: '千葉日本大学第一高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 120 }],
      totalCapacity: 120,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000224',
      schoolName: '千葉県安房西高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 100 }],
      totalCapacity: 100,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000019',
      schoolName: '千葉経済大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 520 }],
      totalCapacity: 520,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000313',
      schoolName: '千葉萌陽高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 80 }],
      totalCapacity: 80,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000028',
      schoolName: '千葉明徳高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 70 },
        { courseName: '進学コースHSクラス・Sクラス(進学計)', capacity: 130 },
        { courseName: 'アスリート進学コース', capacity: 70 },
      ],
      totalCapacity: 270,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000554',
      schoolName: '千葉黎明高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(生産ビジネス含む)', capacity: 276 }],
      totalCapacity: 276,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000162',
      schoolName: '不二女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦60+一般60)', capacity: 120 }],
      totalCapacity: 120,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000572',
      schoolName: '茂原北陵高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合コース', capacity: 135 },
        { courseName: '特別進学コース', capacity: 25 },
        { courseName: '家政(2026年度「ライフデザイン」に改称・定員は同じ40)', capacity: 40 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000563',
      schoolName: '横芝敬愛高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通', capacity: 190 }],
      totalCapacity: 190,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000117',
      schoolName: '市川高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(単願推薦30+一般90・帰国含む)', capacity: 120 }],
      totalCapacity: 120,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000091',
      schoolName: '桜林高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(A日程推薦140+B日程一般20)', capacity: 160 }],
      totalCapacity: 160,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000475',
      schoolName: '鴨川令徳高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(前期単願90+後期20)', capacity: 110 }],
      totalCapacity: 110,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000242',
      schoolName: '暁星国際高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '特進・進学コース・インターナショナルコース・アストラインターナショナルコース(全コース計)', capacity: 30 }],
      totalCapacity: 30,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000288',
      schoolName: '光英VERITAS高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(特待選抜)', capacity: 40 },
        { courseName: '普通(推薦・一般)', capacity: 100 },
      ],
      totalCapacity: 140,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000064',
      schoolName: '昭和学院秀英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含帰国)', capacity: 80 }],
      totalCapacity: 80,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000331',
      schoolName: '千葉学芸高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(前期専願200+後期40)', capacity: 240 },
        { courseName: '特別進学コース(前期専願25+後期15)', capacity: 40 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000153',
      schoolName: '国府台女子学院高等部',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通(選抜クラス・美術デザインコース含む、単願推薦約50/併願推薦約70のうち大きい方を採用)',
          capacity: 70,
        },
      ],
      totalCapacity: 70,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000046',
      schoolName: '植草学園大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通コース(女)', capacity: 200 },
        { courseName: '特進コース', capacity: 40 },
        { courseName: '英語コース', capacity: 40 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000279',
      schoolName: '専修大学松戸高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'E類型', capacity: 72 },
        { courseName: 'A類型', capacity: 150 },
        { courseName: 'S類型', capacity: 34 },
      ],
      totalCapacity: 256,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000233',
      schoolName: '拓殖大学紅陵高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '進学トライコース・アクティブチャレンジコース(全コース計)', capacity: 360 }],
      totalCapacity: 360,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000420',
      schoolName: '千葉英和高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(総進文理・特進文理・特進選抜計)', capacity: 320 },
        { courseName: '英語科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000518',
      schoolName: '千葉敬愛高等学校',
      fiscalYearLabel: '2024年度',
      courses: [],
      totalCapacity: 406,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000402',
      schoolName: '東海大学付属市原望洋高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合進学コース', capacity: 290 },
        { courseName: 'スーパー特進コース', capacity: 30 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000493',
      schoolName: '東海大学付属浦安高等学校',
      fiscalYearLabel: '2024年度',
      courses: [],
      totalCapacity: 250,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000545',
      schoolName: '東京学館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'S特進コース', capacity: 30 },
        { courseName: '特進コース', capacity: 70 },
        { courseName: '総合進学コース(文理専攻・スポーツ専攻計)', capacity: 250 },
      ],
      totalCapacity: 350,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000466',
      schoolName: '中央学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: 'S特進コース・進学コース・スポーツコース(全コース計320+後期3)', capacity: 323 }],
      totalCapacity: 323,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000297',
      schoolName: '西武台千葉高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別選抜コース(含内部)', capacity: 100 },
        { courseName: '進学コース(含内部)', capacity: 176 },
      ],
      totalCapacity: 276,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000340',
      schoolName: '敬愛大学八日市場高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学コース(前期推薦60+後期20)', capacity: 80 },
        { courseName: '普通コース(前期推薦100+後期20)', capacity: 120 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000251',
      schoolName: '志学館高等部',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(前期Ⅰ〜Ⅲ全区分共通)', capacity: 180 }],
      totalCapacity: 180,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000377',
      schoolName: '芝浦工業大学柏高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'グローバル・サイエンスクラス(含内部・帰国)', capacity: 40 },
        { courseName: 'ジェネラルラーニングクラス(含帰国)', capacity: 80 },
      ],
      totalCapacity: 120,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000448',
      schoolName: '秀明大学学校教師学部附属秀明八千代高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 50 },
        { courseName: '国際英語コース', capacity: 60 },
        { courseName: '文理進学コース', capacity: 100 },
        { courseName: '総合進学コース', capacity: 100 },
      ],
      totalCapacity: 310,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000108',
      schoolName: '昭和学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: 'IA・TA・AA・GA・SAコース(全コース計)', capacity: 176 }],
      totalCapacity: 176,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000527',
      schoolName: '愛国学園大学附属四街道高等学校',
      fiscalYearLabel: '2024年度',
      courses: [],
      totalCapacity: 160,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000457',
      schoolName: '我孫子二階堂高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学コース(推薦50+一般10)', capacity: 60 },
        { courseName: '総合コース(推薦100+一般40)', capacity: 140 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000411',
      schoolName: '市原中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'ハイレベルチャレンジコースⅠ類', capacity: 60 },
        { courseName: 'ハイレベルチャレンジコースⅡ類', capacity: 200 },
        { courseName: 'グローバルリーダーコース', capacity: 20 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000037',
      schoolName: '敬愛学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 160 },
        { courseName: '進学コース', capacity: 160 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000260',
      schoolName: '木更津総合高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 25 },
        { courseName: '進学コース', capacity: 60 },
        { courseName: '総合コース', capacity: 540 },
        { courseName: '美術コース', capacity: 15 },
      ],
      totalCapacity: 640,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000509',
      schoolName: '東京学館浦安高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース選抜', capacity: 25 },
        { courseName: '特別進学コース', capacity: 60 },
        { courseName: '総合進学コース', capacity: 250 },
        { courseName: '国際教養コース', capacity: 30 },
        { courseName: 'スポーツ進学コース(男)', capacity: 35 },
      ],
      totalCapacity: 400,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000206',
      schoolName: '東京学館船橋高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 108 },
        { courseName: '情報ビジネス', capacity: 108 },
        { courseName: '食物調理', capacity: 40 },
        { courseName: '美術工芸', capacity: 36 },
      ],
      totalCapacity: 292,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000322',
      schoolName: '成田高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進αクラス', capacity: 80 },
        { courseName: '進学クラス', capacity: 70 },
        { courseName: '特別技能生', capacity: 50 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000386',
      schoolName: '日本体育大学柏高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'アカデミックフロンティアコース・アドバンストラーニングコース・アスリートコース(全コース計)', capacity: 360 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000180',
      schoolName: '日本大学習志野高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(第一志望180・一般190のうち大きい方を採用)', capacity: 190 }],
      totalCapacity: 190,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000126',
      schoolName: '和洋国府台女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '和洋コース(女)', capacity: 50 },
        { courseName: '進学コース(女)', capacity: 60 },
        { courseName: '特進コース(女)', capacity: 30 },
      ],
      totalCapacity: 140,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000171',
      schoolName: '東葉高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'S特進クラス(2024年新設)', capacity: 36 },
        { courseName: '特進クラス', capacity: 160 },
        { courseName: '進学クラス', capacity: 80 },
      ],
      totalCapacity: 276,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000368',
      schoolName: '麗澤高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '叡智スーパー特進コース(S特進)', capacity: 30 },
        { courseName: '叡智特選コース(特選)', capacity: 70 },
      ],
      totalCapacity: 100,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
    {
      schoolCode: 'D112310000055',
      schoolName: '千葉聖心高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(女子)', capacity: 200 }],
      totalCapacity: 200,
      source: KAKE2_2024_CHIBA_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D112310000215',
      schoolName: '中山学園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D112310000625',
      schoolName: '成美学園高等學校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D112310000634',
      schoolName: '千葉科学大学附属高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
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
