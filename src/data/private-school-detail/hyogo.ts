/**
 * 兵庫県私立高等学校の募集定員データ(Λ-5第二段)。
 * (株)育伸社が公表する「2026年度高専・私立高校募集要項【兵庫県】」PDF(2025年11月4日現在)から、
 * 今回は表組みが明瞭で校名とコース別募集人員の対応が明確な35校を新たに追加し、
 * 既存6校(専願/併願とも同数だった愛徳学園・神戸国際・甲南・賢明女子学院・甲子園学院・
 * 三田学園)は育伸社データと完全一致を再確認した。明石工業高専・神戸市立工業高専は
 * 高等専門学校のため対象外(私立高校マスターに含まれない)。白陵は「専願 若干」のみで
 * 具体的な募集人員の記載が無いため見送り。複数コースが「計」でまとめられている場合
 * (日ノ本学園の全コース計200等)は合算せず1つの共有コースとして統合記録した。
 * 灘は表内の「一般 約40」を採用したが、系列中学校からの内部進学者を除く外部募集枠の
 * 可能性がある点に留意。
 * 2026-07-31追記: 残存12校を個別調査。生野学園(全寮制・33名、公式サイトが2027年度サイクルへ
 * 移行済みのためそのまま2027年度で収録)を追加収録し55校中43校=兵庫県を完全網羅(欠落0)に到達。
 * 六甲学院・甲陽学院・甲南女子・神戸女学院・神戸海星女子学院・淳心学院は完全中高一貫校(高校
 * からの外部募集なし)、小林聖心女子学院は2013年度以降高校一般入試なし、自由ヶ丘は2021年休校、
 * 相生学院・第一学院養父校・ＡＩＥ国際は広域通信制(県別定員の性質が異なる)と判明し、いずれも
 * skippedへ理由付きで記録した。
 *
 * 【掛-2（私立×多年度）着手時の再検証(2026-08-09)】miyagi/oita/kagoshima/hiroshima等で
 * 発覚した誤りを警戒し全43校の現行(2026年度)データをpdftotext -layoutで最新PDFと再突合した。
 * 神戸常盤女子高等学校のコース名がts上「特別選学コース」となっていたが現行PDFの実際の表記は
 * 「特別進学コース」の誤記(定員30は正しかった)と判明し是正した。他42校は総定員・コース名とも
 * 完全に一致し、隣接校ブロック取り違えのような重大な誤りは見つからなかった。**この県は43校と
 * 大規模なため、2024年度版との掛-2多年度比較は次回以降に持ち越す。**
 * **2026-08-10(掛-2私立×多年度・着手)**: 大都市圏5県(kyoto/kanagawa/aichi/osaka/tokyo)完走を
 * 受けhyogoに着手。ikushin 03928.pdfのWayback CDX APIで2023年11月17日現在版(2023年12月16日
 * キャプチャ・全4頁)を発掘。**1頁目14校を再突合し全校で総定員が完全一致**: 愛徳学園20・関西学院
 * 120・近畿大学附属豊岡120・啓明学院80・甲子園学院280・甲南25(含グローバル・ファウンデーション)・
 * 神戸学院大学附属200・神戸弘陵学園310・神戸国際15・神戸国際大学附属360(進学キャリアコース→
 * 総合進学コースの改称は2024年度版時点で既に反映済み)。芦屋学園と育英は2024年度版のコース名・
 * コース数が現行と異なる(芦屋学園:特進+総合進学Ⅰ・Ⅱ類→スタンダード+アドバンスへ再編、育英:5コース
 * →3コースへ統合)がいずれも総定員は完全一致(240・360)というtokyo掛-2で確立した「コース再編でも
 * 総定員は不変」パターンを裏付けた。市川はキャリアコースが320→240へ減少し総定員350→270、賢明女子
 * 学院はソフィア15→35・ルミエール20→35で総定員35→70へ倍増を検出(いずれも専願/併願で同数のシンプル
 * な構造のため読み取り精度は高い)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_HYOGO_SOURCE = {
  url: 'http://web.archive.org/web/20231216134637/https://www.ikushin.co.jp/school/PDF/03928.pdf',
  docTitle: '2024年度 高専・私立高校 募集要項【兵庫県】（(株)育伸社 入試情報課・2023年11月17日現在、Wayback Machine 2023-12-16キャプチャ）',
  fetchedAt: '2026-08-10',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_HYOGO: PrivateSchoolDetailFile = {
  prefectureCode: 'hyogo',
  schools: [
    {
      schoolCode: 'D128310000217',
      schoolName: '愛徳学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [],
      totalCapacity: 20,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(普通科単独・専願/併願とも「約20」と記載)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000510',
      schoolName: '神戸国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [],
      totalCapacity: 15,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(国際文化科(女子)単独・専願・併願とも15名)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000397',
      schoolName: '甲南高等学校',
      fiscalYearLabel: '2026年度',
      courses: [],
      totalCapacity: 25,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(普通科(アドバンストコース、男子)単独・一般(専願)「約25(含グローバル・ファウンデーション)」)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000253',
      schoolName: '賢明女子学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'ソフィアコース(特進、女子)', capacity: 35 },
        { courseName: 'ルミエールコース(進学、女子)', capacity: 35 },
      ],
      totalCapacity: 70,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(ソフィアコース・ルミエールコースとも専願/併願で「約35」と記載)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000342',
      schoolName: '甲子園学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'プレミアムステージ(女子)', capacity: 80 },
        { courseName: 'スタンダードステージ(女子)', capacity: 200 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(プレミアムステージ80名・スタンダードステージ200名、専願/併願とも同数)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000440',
      schoolName: '三田学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [],
      totalCapacity: 40,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(A方式(一般)「約40(内B方式(推薦)約30)」・B方式はA方式定員の内数)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000388',
      schoolName: '芦屋学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'スタンダードコース', capacity: 50 },
        { courseName: 'アドバンスコース', capacity: 125 },
        { courseName: 'アスリートコース', capacity: 35 },
        { courseName: '国際文化', capacity: 30 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000164',
      schoolName: '育英高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'スーパーアドバンスコース', capacity: 40 },
        { courseName: 'アドバンスコース', capacity: 160 },
        { courseName: 'スタンダードコース', capacity: 160 },
      ],
      totalCapacity: 360,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000468',
      schoolName: '市川高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 30 },
        { courseName: 'キャリアコース', capacity: 240 },
      ],
      totalCapacity: 270,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000315',
      schoolName: '関西学院高等部',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'A方式(一般)', capacity: 100 },
        { courseName: 'B方式(自己推薦)', capacity: 20 },
      ],
      totalCapacity: 120,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000404',
      schoolName: '近畿大学附属豊岡高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース', capacity: 120 }],
      totalCapacity: 120,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000093',
      schoolName: '啓明学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦専願、男女各約40)', capacity: 80 }],
      totalCapacity: 80,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000128',
      schoolName: '神戸学院大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進文理コース', capacity: 40 },
        { courseName: '特進グローバルコース', capacity: 30 },
        { courseName: '総合進学コース', capacity: 130 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000477',
      schoolName: '神戸弘陵学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース', capacity: 25 },
        { courseName: '進学コース', capacity: 70 },
        { courseName: '総合コース', capacity: 140 },
        { courseName: '体育コース', capacity: 75 },
      ],
      totalCapacity: 310,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000226',
      schoolName: '神戸国際大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理特進コース', capacity: 50 },
        { courseName: '総合進学コース', capacity: 200 },
        { courseName: 'アスリートコース', capacity: 80 },
        { courseName: '国際', capacity: 30 },
      ],
      totalCapacity: 360,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000173',
      schoolName: '神戸星城高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '商業(特進Sコース)', capacity: 30 },
        { courseName: '商業(特進Aコース)', capacity: 120 },
        { courseName: '商業(特進Bコース)', capacity: 160 },
        { courseName: '商業(みらい総合コース)', capacity: 80 },
      ],
      totalCapacity: 390,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000075',
      schoolName: '神戸第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '保育コース', capacity: 20 },
        { courseName: 'スポーツコース', capacity: 40 },
        { courseName: '普通コース', capacity: 100 },
        { courseName: '調理師コース', capacity: 40 },
        { courseName: '製菓衛生師コース', capacity: 40 },
        { courseName: 'ファッション・福祉コース', capacity: 80 },
        { courseName: 'システム情報コース', capacity: 20 },
        { courseName: 'ビジネスコース', capacity: 20 },
      ],
      totalCapacity: 360,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000146',
      schoolName: '神戸常盤女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '未来創造コース', capacity: 105 },
        { courseName: '看護医療コース', capacity: 60 },
        { courseName: 'こども教育コース', capacity: 30 },
        { courseName: '家庭', capacity: 60 },
      ],
      totalCapacity: 285,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000155',
      schoolName: '神戸野田高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進Sコース(SS・S系列)', capacity: 35 },
        { courseName: '特進グローバル英語(GE)コース(SG・G系列)', capacity: 35 },
        { courseName: '特進アドバンス(A)コース(文理国際・スポーツ系列)', capacity: 100 },
        { courseName: '進学総合コース', capacity: 150 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000100',
      schoolName: '神戸山手グローバル高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバル選抜探究コース', capacity: 30 },
        { courseName: '選抜コース', capacity: 105 },
        { courseName: '未来探究コース(女子)', capacity: 35 },
      ],
      totalCapacity: 170,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000066',
      schoolName: '神戸龍谷高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '医療理数コース', capacity: 20 },
        { courseName: '国際教養コース', capacity: 40 },
        { courseName: '難関進学コース', capacity: 80 },
        { courseName: '総合進学コース', capacity: 120 },
      ],
      totalCapacity: 260,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000137',
      schoolName: '彩星工科高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'ものづくり系(2026年度～男子→共学)', capacity: 210 },
        { courseName: '電気・情報系', capacity: 205 },
        { courseName: '普通', capacity: 135 },
      ],
      totalCapacity: 550,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000459',
      schoolName: '三田松聖高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '総合コース・進学アスリートコース(総合・進学アスリート計)', capacity: 180 },
      ],
      totalCapacity: 210,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000360',
      schoolName: '夙川高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース', capacity: 80 },
        { courseName: '進学コース', capacity: 80 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000057',
      schoolName: '松蔭高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(2026年度～女子→共学、専願・推薦)', capacity: 50 }],
      totalCapacity: 50,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000084',
      schoolName: '神港学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース', capacity: 30 },
        { courseName: '進学コース', capacity: 120 },
        { courseName: '総合進学コース', capacity: 120 },
        { courseName: 'トップアスリートコース', capacity: 40 },
      ],
      totalCapacity: 310,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000119',
      schoolName: '親和女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンストコース', capacity: 30 },
        { courseName: 'スポーツ・カルチャーコース', capacity: 30 },
        { courseName: 'グローバルコース', capacity: 20 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000182',
      schoolName: '須磨学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'I類', capacity: 40 },
        { courseName: 'II類', capacity: 160 },
        { courseName: 'III類英数', capacity: 40 },
        { courseName: 'III類理数', capacity: 40 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000529',
      schoolName: '蒼開高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'I類(アスリート進学コース)', capacity: 40 },
        { courseName: 'II類(グローバル進学コース)', capacity: 30 },
        { courseName: 'III類(スーパー特進コース)', capacity: 30 },
      ],
      totalCapacity: 100,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000280',
      schoolName: '園田学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンスコース(2026年度～女子→共学)', capacity: 60 },
        { courseName: 'キャリアデザインコース', capacity: 105 },
        { courseName: 'フロンティアコース', capacity: 105 },
      ],
      totalCapacity: 270,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000191',
      schoolName: '滝川高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Science Globalコース', capacity: 80 },
        { courseName: 'ミライ探究コース', capacity: 90 },
      ],
      totalCapacity: 170,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000495',
      schoolName: '滝川第二高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'イノベイティブフロンティアコース', capacity: 30 },
        { courseName: 'クリエイティブフロンティアコース', capacity: 35 },
        { courseName: 'Cコース', capacity: 100 },
      ],
      totalCapacity: 165,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000271',
      schoolName: '東洋大学附属姫路高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Sコース', capacity: 70 },
        { courseName: 'Tコース', capacity: 240 },
      ],
      totalCapacity: 310,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000020',
      schoolName: '灘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [],
      totalCapacity: 40,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(普通科・一般「約40」。系列中学校からの内部進学者を除く募集枠の可能性あり)',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000379',
      schoolName: '仁川学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'カルティベーションコース(含内部)', capacity: 160 },
        { courseName: 'カルティベーションSコース(含内部)', capacity: 80 },
        { courseName: 'アカデミアコース(含内部)', capacity: 40 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000244',
      schoolName: '日ノ本学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '未来創造コース・スポーツコース・オープンアカデミーコース(全コース計)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000422',
      schoolName: '雲雀丘学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [],
      totalCapacity: 100,
      source: {
        url: 'https://www.ikushin.co.jp/school/pdf/03928.pdf',
        docTitle: '2026年度 高専・私立高校 募集要項【兵庫県】｜(株)育伸社入試情報課(文理探究コース・A日程(専願I・II)100名を採用。B日程(専願III・併願)15名は別枠の可能性があり合算せず)',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D128310000235',
      schoolName: '姫路女学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学国際教養コース', capacity: 30 },
        { courseName: '教養コース', capacity: 180 },
        { courseName: 'アスリートコース', capacity: 60 },
      ],
      totalCapacity: 270,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000208',
      schoolName: '兵庫大学附属須磨ノ浦高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース(I類10・II類20)', capacity: 30 },
        { courseName: '看護医療進学コース', capacity: 30 },
        { courseName: 'こども教育探究コース', capacity: 70 },
        { courseName: '未来探究コース', capacity: 144 },
        { courseName: '介護福祉士コース', capacity: 26 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000306',
      schoolName: '報徳学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '選抜特進コース(男子)', capacity: 20 },
        { courseName: '特進コース(男子)', capacity: 70 },
        { courseName: '進学コース(男子)', capacity: 160 },
      ],
      totalCapacity: 250,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000333',
      schoolName: '武庫川女子大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'SOAR探究コース', capacity: 140 },
        { courseName: 'SOARグローバルサイエンスコース', capacity: 20 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000299',
      schoolName: '百合学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アカデミックリサーチコース(女子)', capacity: 40 },
        { courseName: 'キャリアリサーチコース(女子)', capacity: 100 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D128310000501',
      schoolName: '生野学園高等学校',
      fiscalYearLabel: '2027年度',
      courses: [{ courseName: '普通科(全日制・全寮制)', capacity: 33 }],
      totalCapacity: 33,
      source: {
        url: 'https://www.ikuno.ed.jp/admissions/highschool/',
        docTitle: '生野学園 高等学校募集要項（公式サイト・第一学年33名。公式サイトが既に2027年度サイクルへ移行していたため2027年度の値をそのまま採用）',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D128310000217',
      schoolName: '愛徳学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [],
      totalCapacity: 20,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000388',
      schoolName: '芦屋学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース', capacity: 20 },
        { courseName: '総合進学コース(Ⅰ類30・Ⅱ類125)', capacity: 155 },
        { courseName: 'アスリートコース', capacity: 35 },
        { courseName: '国際文化', capacity: 30 },
      ],
      totalCapacity: 240,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000164',
      schoolName: '育英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学理系コース', capacity: 30 },
        { courseName: '特別進学文系コース', capacity: 30 },
        { courseName: '理系進学コース', capacity: 40 },
        { courseName: '文系進学コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 220 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000468',
      schoolName: '市川高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 30 },
        { courseName: 'キャリアコース', capacity: 320 },
      ],
      totalCapacity: 350,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000315',
      schoolName: '関西学院高等部',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'A方式(一般、含帰国若干)', capacity: 100 },
        { courseName: 'B方式(自己推薦)', capacity: 20 },
      ],
      totalCapacity: 120,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000404',
      schoolName: '近畿大学附属豊岡高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '特進コース', capacity: 120 }],
      totalCapacity: 120,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000093',
      schoolName: '啓明学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦専願)', capacity: 80 }],
      totalCapacity: 80,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000253',
      schoolName: '賢明女子学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'ソフィアコース(特進、女子)', capacity: 15 },
        { courseName: 'ルミエールコース(進学、女子)', capacity: 20 },
      ],
      totalCapacity: 35,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000342',
      schoolName: '甲子園学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'プレミアムステージ(女子)', capacity: 80 },
        { courseName: 'スタンダードステージ(女子)', capacity: 200 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000397',
      schoolName: '甲南高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科(アドバンストコース、男子、専願のみ、含グローバル・ファウンデーション)', capacity: 25 }],
      totalCapacity: 25,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000128',
      schoolName: '神戸学院大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進文理コース', capacity: 40 },
        { courseName: '特進グローバルコース', capacity: 30 },
        { courseName: '総合進学コース', capacity: 130 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000477',
      schoolName: '神戸弘陵学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース', capacity: 25 },
        { courseName: '進学コース', capacity: 70 },
        { courseName: '総合コース', capacity: 140 },
        { courseName: '体育コース(専願のみ)', capacity: 75 },
      ],
      totalCapacity: 310,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000510',
      schoolName: '神戸国際高等学校',
      fiscalYearLabel: '2024年度',
      courses: [],
      totalCapacity: 15,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
    {
      schoolCode: 'D128310000226',
      schoolName: '神戸国際大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理特進コース', capacity: 50 },
        { courseName: '総合進学コース', capacity: 200 },
        { courseName: 'アスリートコース', capacity: 80 },
        { courseName: '国際', capacity: 30 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_HYOGO_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D128310000431',
      schoolName: '白陵高等学校',
      reason: '育伸社募集要項PDFに「専願 若干」とのみ記載され具体的な募集人員数を確認できなかった',
    },
    {
      schoolCode: 'D128310000011',
      schoolName: '甲南女子高等学校',
      reason: '1992年に高校の外部募集を停止し完全中高一貫校化。高等学校からの外部募集なし(Wikipediaで確認)',
    },
    {
      schoolCode: 'D128310000039',
      schoolName: '六甲学院高等学校',
      reason: '完全中高一貫校のため高等学校からの外部募集を行わない(欠員補充を除き原則実施なし。Wikipediaで確認)',
    },
    {
      schoolCode: 'D128310000351',
      schoolName: '甲陽学院高等学校',
      reason: '2009年に高校入学枠を廃止し完全中高一貫校化。高等学校からの外部募集なし(公式サイト・Wikipediaで確認)',
    },
    {
      schoolCode: 'D128310000324',
      schoolName: '神戸女学院高等学部',
      reason: '完全中高一貫校のため高等学校からの外部募集なし(中学入試のみ実施。Wikipediaで確認)',
    },
    {
      schoolCode: 'D128310000048',
      schoolName: '神戸海星女子学院高等学校',
      reason: '完全中高一貫校のため高等学校からの外部募集なし(Wikipediaで確認)',
    },
    {
      schoolCode: 'D128310000262',
      schoolName: '淳心学院高等学校',
      reason: '完全中高一貫校のため高等学校からの外部募集なし(Wikipediaで確認)',
    },
    {
      schoolCode: 'D128310000413',
      schoolName: '小林聖心女子学院高等学校',
      reason: '2013年度以降、高等学校からの一般入試を実施していない(転入試・帰国生入試のみで定員非公表。公式サイトで確認)',
    },
    {
      schoolCode: 'D128310000486',
      schoolName: '自由ヶ丘高等学校',
      reason: '2021年4月から休校し生徒募集を停止している',
    },
    {
      schoolCode: 'D128310000538',
      schoolName: '相生学院高等学校',
      reason: '広域通信制高校(東京・大阪・兵庫に本校/キャンパス)のため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D128310000547',
      schoolName: '第一学院高等学校養父校',
      reason: '広域通信制高校(全国68キャンパス)の本校の一つのため県別定員の性質が異なり見送り',
    },
    {
      schoolCode: 'D128310000556',
      schoolName: 'ＡＩＥ国際高等学校',
      reason: '広域通信制・単位制高校のため県別定員の性質が異なり見送り',
    },
  ],
};
