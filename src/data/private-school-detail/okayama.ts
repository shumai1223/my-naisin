/**
 * 岡山県私立高等学校の募集定員データ(Λ-5第二段)。
 * 岡山県私学協会(oka-shigaku.gr.jp)が公表する「令和8年度岡山県私立高等学校(全日制)入試要項
 * 一覧」PDFに加え、大半の学校で個別の学校公式サイトが公表する募集要項PDFを直接ソースとして
 * 採用し、24校(参照台帳の大半)を収録した(2026-08-04時点)。
 *
 * 【掛-2(私立×多年度)追加・2026-08-10】県私学協会の一括PDFは前年度版(highschool2025.pdf)も
 * URLの年数部分を単純に置換するだけで削除されずlive公開されたままだったため、直接取得できた。
 * このPDFを一次ソースとする10校(岡山白陵/吉備高原学園/岡山県共生/倉敷翠松/岡山龍谷/方谷學舎/
 * 明誠学院/金光学園/岡山高等学校/岡山商科大学附属)を令和8年度データと再突合し、**実際の変化を
 * 2件発見**: ①明誠学院高等学校は「進学総合」75+「保育・福祉」30の2区分が令和8年度は
 * 「進創エクシードコース」105へ統合(校計370は不変) ②岡山商科大学附属高等学校はITデザイン
 * (10→15)・工業技術(75→40)・健康スポーツ(20→45)・情報コース/ビジネス(45→50)の4区分間で
 * 定員が再配分(校計270は不変)。他8校は完全一致。個別学校サイトを一次ソースとする残り14校は
 * 学校ごとに別途の過去年度探索が必要なため今回は対象外。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const KAKE2_2025_SOURCE = {
  url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
  docTitle: '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会',
  fetchedAt: '2026-08-10',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_OKAYAMA: PrivateSchoolDetailFile = {
  prefectureCode: 'okayama',
  schools: [
    {
      schoolCode: 'D133310000210',
      schoolName: '岡山白陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 160,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(普通科単独160名・1期/2期とも同一定員)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000238',
      schoolName: '吉備高原学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 100,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(普通科単独100名・専願/併願/奨学制度の全区分で同一定員)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000201',
      schoolName: '岡山県共生高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 80,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(普通科の普通コース/メディア情報コース/生活アレンジコース計80名・コース別内訳は非公開)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000078',
      schoolName: '倉敷高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        {
          courseName: '普通科（特進国大(S)コース・特進アドバンス(A)コース・進学チャレンジコース・総合探究コースの4コース合算）',
          capacity: 260,
        },
        { courseName: '商業科', capacity: 70 },
      ],
      totalCapacity: 330,
      source: {
        url: 'https://www.kurashiki.ac.jp/pdf/r8/R8bosyuyoukou.pdf',
        docTitle: '生徒募集要項 令和8年度（2026年度）入試（倉敷高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000130',
      schoolName: '岡山学芸館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科（清秀高等部・医進サイエンスコース・スーパーVコース・特別進学コース・進学コースの5区分合算・内訳は非公開）',
          capacity: 400,
        },
        { courseName: '英語科', capacity: 25 },
      ],
      totalCapacity: 425,
      source: {
        url: 'https://www.gakugeikan.ed.jp/up_load_files/freetext/prospective_pamphlet/file/bosyuyoukouR8.pdf',
        docTitle: '令和8年度 生徒募集要項（全日制課程）（岡山学芸館高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000149',
      schoolName: '興譲館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 進学チャレンジコース', capacity: 25 },
        { courseName: '普通科 キャリアコース（商業系・工業系）', capacity: 40 },
        { courseName: '普通科 アスリートコース', capacity: 25 },
      ],
      totalCapacity: 90,
      source: {
        url: 'https://kojokan-h.ed.jp/wp-content/uploads/2025/10/令和8年度募集要項.pdf',
        docTitle: '令和8年度 生徒募集要項（興譲館高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000176',
      schoolName: 'おかやま山陽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科（特別進学・総合進学・公務員・ビューティ・IT・音楽・スポーツの7コース合算）',
          capacity: 160,
        },
        { courseName: '専門科 機械科', capacity: 40 },
        { courseName: '専門科 自動車科', capacity: 40 },
        { courseName: '専門科 調理科', capacity: 45 },
        { courseName: '専門科 製菓科', capacity: 40 },
      ],
      totalCapacity: 325,
      source: {
        url: 'https://www.okayama-sanyo-hs.ed.jp/wp/wp-content/uploads/2025/09/54636e2610780a2511f3d659e3571788.pdf',
        docTitle: '生徒募集要項（おかやま山陽高等学校）「1.募集定員 325名[男女共学]」',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000167',
      schoolName: '清心女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '普通科 特別進学コース（難関系・国公立系・文理総合系・国際系の4系合算）',
          capacity: 95,
        },
        { courseName: '普通科 生命科学コース', capacity: 25 },
        { courseName: '普通科 NDSU進学コース', capacity: 40 },
      ],
      totalCapacity: 160,
      source: {
        url: 'https://www.nd-seishin.ac.jp/assets/file/entrance/pdf/r8/2026_highschool_entrance_detail.pdf',
        docTitle: '生徒募集要項 詳細（ネット出願）「1.募集学科・定員」（清心女子高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000194',
      schoolName: '川崎医科大学附属高等学校',
      fiscalYearLabel: '令和9年度（2027年度）',
      courses: [
        { courseName: '普通科 専願入試（総合判定型・学科試験型合算・約）', capacity: 25 },
        { courseName: '普通科 一般入試（約）', capacity: 10 },
      ],
      totalCapacity: 35,
      source: {
        url: 'https://s.kawasaki-m.ac.jp/exam/youkou.pdf',
        docTitle: '令和9年度 生徒募集要項「募集人員・出願」（川崎医科大学附属高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000112',
      schoolName: '作陽学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 Proudコース', capacity: 50 },
        { courseName: '普通科 Progressコース', capacity: 110 },
        { courseName: '普通科 Professionalコース', capacity: 80 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.sakuyo-h.ed.jp/wp-content/uploads/2025/09/R8_bosyuyoko_HP.pdf',
        docTitle: '令和8年度 生徒募集要項（作陽学園高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000087',
      schoolName: '岡山理科大学附属高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        { courseName: '普通科 グローバルサイエンスコース 特別進学（医・獣・薬）クラス', capacity: 20 },
        { courseName: '普通科 グローバルサイエンスコース 進学（文・理）クラス', capacity: 80 },
        { courseName: '普通科 総合進学コース', capacity: 200 },
        { courseName: '普通科 スポーツサイエンスコース', capacity: 80 },
        { courseName: '普通科 国際バカロレアコース', capacity: 20 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://okayama.ridaifu.net/wp/wp-content/themes/ridaifu/assets/pdf/boshu2026.pdf',
        docTitle: '生徒募集要項 2026年（令和8年度）（岡山理科大学附属高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000032',
      schoolName: '山陽学園高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        {
          courseName: '普通科 特別進学コース(選抜/発展/標準プログラム)・進学コース計',
          capacity: 115,
        },
        {
          courseName: '普通科 Musicコース(音楽実技系/ミュージカル系/吹奏楽系/幼児教育系計)',
          capacity: 135,
        },
      ],
      totalCapacity: 250,
      source: {
        url: 'https://www.sanyogakuen.ed.jp/sg/wp-content/uploads/2025/09/senior_highschool_application_guidelines.pdf',
        docTitle: '2026年度(令和8年度) 生徒募集要項（山陽学園高等学校）募集定員とコースの概要',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000041',
      schoolName: '就実高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        { courseName: '特別進学コース(男女共学) ハイグレードクラス', capacity: 20 },
        { courseName: '特別進学コース(男女共学) アドバンスクラス', capacity: 130 },
        { courseName: '特別進学チャレンジコース(男女共学)', capacity: 200 },
        { courseName: '総合進学コース(女子)', capacity: 100 },
      ],
      totalCapacity: 450,
      source: {
        url: 'https://www.shujitsu-h.ed.jp/admin/wp-content/uploads/2025/11/bosyuuyoukou.pdf',
        docTitle: '令和8年度 就実高等学校 生徒募集要項',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000096',
      schoolName: '倉敷翠松高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(特別進学コース・創学コース・進学コースの3コース計)',
          capacity: 160,
        },
        { courseName: '商業科', capacity: 80 },
        { courseName: '生活科学科', capacity: 60 },
        { courseName: '看護科', capacity: 35 },
      ],
      totalCapacity: 335,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(倉敷翠松：普通科160・商業科80・生活科学科60・看護科35)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000103',
      schoolName: '岡山県美作高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'ハイグレードコース', capacity: 30 },
        { courseName: '進学コース(美作大学コース・アドバンスコース)', capacity: 60 },
        {
          courseName: '探究コース(アドバンスコース・ITスペシャリストコース・クリエイトコース)',
          capacity: 110,
        },
        { courseName: '福祉医療コース', capacity: 30 },
        { courseName: 'アスリートコース', capacity: 20 },
        { courseName: 'Bloomコース(不登校特例校・程度)', capacity: 20 },
      ],
      totalCapacity: 270,
      source: {
        url: 'https://www.mimasaka.ed.jp/img/pdf/R8boshuyoukou.pdf',
        docTitle: '生徒募集要項(全日制課程)（岡山県美作高等学校）令和8年度',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000121',
      schoolName: '岡山龍谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科 特別進学コース(Ⅲ類・Ⅱ類・探究の3区分計)',
          capacity: 20,
        },
        { courseName: '普通科 選択選抜コース', capacity: 50 },
        { courseName: '普通科 進学教養コース', capacity: 80 },
        { courseName: '情報科 情報コース', capacity: 50 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(岡山龍谷：特別進学コース20・選択選抜コース50・進学教養コース80・情報科50)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000158',
      schoolName: '方谷學舎高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        {
          courseName: '普通科(日本文化コース・進学コース(特別進学系/総合進学系)・アスリートコース・美容コース計)',
          capacity: 80,
        },
      ],
      totalCapacity: 80,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(方谷學舎：普通科計80)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000069',
      schoolName: '明誠学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別進学コースⅢ類', capacity: 20 },
        { courseName: '普通科 特別進学コースⅠ類', capacity: 70 },
        { courseName: '普通科 進創エクシードコース', capacity: 105 },
        { courseName: '普通科 特別進学コースⅡ類', capacity: 70 },
        { courseName: '普通科 特別芸術コース', capacity: 30 },
        { courseName: '普通科 新情報コース', capacity: 75 },
      ],
      totalCapacity: 370,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(明誠学院：特別進学Ⅲ類20/Ⅰ類70/進創エクシード105/Ⅱ類70/特別芸術30/新情報75)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000185',
      schoolName: '金光学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別進学クラス', capacity: 40 },
        { courseName: '普通科 総合進学クラス', capacity: 140 },
      ],
      totalCapacity: 180,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(金光学園：特別進学クラス40・総合進学クラス140)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000229',
      schoolName: '岡山高等学校',
      fiscalYearLabel: '令和8年度（岡山中学校からの内部進学者を含む）',
      courses: [
        {
          courseName: '普通科 東大・国立医学部コース・難関大コース(メディカル系・探究系)の外部募集計',
          capacity: 160,
        },
      ],
      totalCapacity: 160,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(岡山：東大国立医学部コース・難関大コース計160)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000014',
      schoolName: '関西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 国立進学コース', capacity: 15 },
        { courseName: '普通科 サイエンスフロンティアコース', capacity: 15 },
        { courseName: '普通科 アドバンスコース(スタンダード系・ハイグレード系計)', capacity: 110 },
        { courseName: '普通科 体育進学コース', capacity: 80 },
        { courseName: 'ITビジネス科(ビジネスコース・アドバンスコース計)', capacity: 100 },
        {
          courseName: 'EIエンジニア科(システムコース・ICTクリエイターコース・アスリートコース計)',
          capacity: 100,
        },
      ],
      totalCapacity: 420,
      source: {
        url: 'https://kanzei.ac.jp/wp-content/uploads/2025/08/R8-2026-kanzei-hs-bosyuyoukou.pdf',
        docTitle: '令和8年度 募集要項（関西高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000050',
      schoolName: '創志学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（男女共学）',
      courses: [
        {
          courseName: '普通科 理数特別コース・選抜特進コース・特別進学コースの3コース計',
          capacity: 110,
        },
        { courseName: '普通科 創造進学コース(人文・社会系・スポーツ系計)', capacity: 60 },
        { courseName: '看護科', capacity: 40 },
      ],
      totalCapacity: 210,
      source: {
        url: 'https://soshigakuen.ed.jp/wp-content/uploads/2025/08/8a5ba830ab9a79d2c39c45c6283511d7.pdf',
        docTitle: '令和8年度 生徒募集要項（創志学園高等学校）募集定員(男女共学210名)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000023',
      schoolName: '岡山商科大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合学科 進学系列 総合進学コース', capacity: 45 },
        { courseName: '総合学科 進学系列 ITデザインコース', capacity: 15 },
        { courseName: '総合学科 情報・ビジネス系列 商大コース', capacity: 20 },
        { courseName: '総合学科 工業系列 工業技術コース', capacity: 40 },
        { courseName: '総合学科 進学系列 特別進学コース', capacity: 15 },
        { courseName: '総合学科 健康スポーツコース', capacity: 45 },
        {
          courseName: '総合学科 情報・ビジネス系列 情報コース・ビジネスコース',
          capacity: 50,
        },
        { courseName: '自動車科', capacity: 40 },
      ],
      totalCapacity: 270,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2026.pdf',
        docTitle: '令和8年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(岡山商科大学附属：総合学科7コース+自動車科)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000210',
      schoolName: '岡山白陵高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [],
      totalCapacity: 160,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D133310000238',
      schoolName: '吉備高原学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [],
      totalCapacity: 100,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D133310000201',
      schoolName: '岡山県共生高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科(普通コース・メディア情報コース・生活アレンジコース・スポーツ科学コース計)',
          capacity: 80,
        },
      ],
      totalCapacity: 80,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度資料は「スポーツ科学コース」への言及がなく3コース計と案内。校計80は同一)',
      },
    },
    {
      schoolCode: 'D133310000078',
      schoolName: '倉敷高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科（特進国大(S)コース・進学チャレンジコース・特進アドバンス(A)コース・総合探究コースの4コース合算）',
          capacity: 260,
        },
        { courseName: '商業科', capacity: 70 },
      ],
      totalCapacity: 330,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle: '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(倉敷：令和8年度と完全に同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000130',
      schoolName: '岡山学芸館高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科（清秀高等部・スーパーV・進学・医進サイエンス・特別進学の5区分合算・内訳は非公開）',
          capacity: 400,
        },
        { courseName: '英語科', capacity: 25 },
      ],
      totalCapacity: 425,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle: '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(岡山学芸館：令和8年度と完全に同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000149',
      schoolName: '興譲館高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 総合進学', capacity: 40 },
        { courseName: '普通科 キャリアデザイン', capacity: 50 },
        { courseName: '普通科 スポーツ', capacity: 30 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle:
          '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(興譲館：令和8年度は進学チャレンジ25・キャリアコース40・アスリート25=計90に再編され120から30減少)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000176',
      schoolName: 'おかやま山陽高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科（特別進学・総合進学・公務員・ビューティ・IT・音楽・スポーツの7コース合算）',
          capacity: 160,
        },
        { courseName: '専門科 機械科', capacity: 40 },
        { courseName: '専門科 自動車科', capacity: 40 },
        { courseName: '専門科 調理科', capacity: 45 },
        { courseName: '専門科 製菓科', capacity: 40 },
      ],
      totalCapacity: 325,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle: '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(おかやま山陽：令和8年度と完全に同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000112',
      schoolName: '作陽学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 Proud(特進プレミア・特進アドバンス計)', capacity: 30 },
        { courseName: '普通科 Progress(進学チャレンジ・進学スタンダード計)', capacity: 130 },
        { courseName: '普通科 Professional(スポーツ・ミュージック計)', capacity: 80 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle:
          '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(作陽学園：令和8年度はProud50・Progress110・Professional80に再配分。校計240は同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000041',
      schoolName: '就実高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '特別進学コース アドバンスクラス', capacity: 130 },
        { courseName: '特別進学コース ハイグレードクラス', capacity: 20 },
        { courseName: '特別進学チャレンジコース', capacity: 200 },
        { courseName: '総合進学コース(女子)', capacity: 100 },
      ],
      totalCapacity: 450,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle: '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(就実：令和8年度と完全に同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000096',
      schoolName: '倉敷翠松高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科(特別進学コース・創学コース・進学コースの3コース計)',
          capacity: 160,
        },
        { courseName: '商業科', capacity: 80 },
        { courseName: '生活科学科', capacity: 60 },
        { courseName: '看護科', capacity: 35 },
      ],
      totalCapacity: 335,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(倉敷翠松：令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D133310000103',
      schoolName: '岡山県美作高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: 'ハイグレードコース', capacity: 30 },
        { courseName: '進学コース(美作大学コース・アドバンスコース)', capacity: 60 },
        {
          courseName: '探究コース(アドバンスコース・ITスペシャリストコース・クリエイトコース)',
          capacity: 110,
        },
        { courseName: '福祉医療コース', capacity: 30 },
        { courseName: 'アスリートコース', capacity: 20 },
        { courseName: 'Bloomコース(不登校特例校・程度)', capacity: 20 },
      ],
      totalCapacity: 270,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle: '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(岡山県美作：令和8年度と完全に同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000121',
      schoolName: '岡山龍谷高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科 特別進学コース(Ⅲ類・Ⅱ類・探究の3区分計)',
          capacity: 20,
        },
        { courseName: '普通科 選択選抜コース', capacity: 50 },
        { courseName: '普通科 進学教養コース', capacity: 80 },
        { courseName: '情報科 情報コース', capacity: 50 },
      ],
      totalCapacity: 200,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(岡山龍谷：令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D133310000158',
      schoolName: '方谷學舎高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科(普通コース・スポーツコース・美容コース計)', capacity: 80 },
      ],
      totalCapacity: 80,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(方谷學舎：令和8年度はコース名を日本文化・進学(特別進学系/総合進学系)・アスリート・美容に再編。校計80は同一)',
      },
    },
    {
      schoolCode: 'D133310000069',
      schoolName: '明誠学院高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特別進学コースⅢ類', capacity: 20 },
        { courseName: '普通科 特別進学コースⅠ類', capacity: 70 },
        { courseName: '普通科 進学総合', capacity: 75 },
        { courseName: '普通科 保育・福祉', capacity: 30 },
        { courseName: '普通科 特別進学コースⅡ類', capacity: 70 },
        { courseName: '普通科 特別芸術コース', capacity: 30 },
        { courseName: '普通科 新情報コース', capacity: 75 },
      ],
      totalCapacity: 370,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(明誠学院：令和8年度は「進学総合」75+「保育・福祉」30を「進創エクシードコース」105へ統合。校計370は同一)',
      },
    },
    {
      schoolCode: 'D133310000185',
      schoolName: '金光学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特別進学クラス', capacity: 40 },
        { courseName: '普通科 総合進学クラス', capacity: 140 },
      ],
      totalCapacity: 180,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(金光学園：令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D133310000229',
      schoolName: '岡山高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        {
          courseName: '普通科 東大・国立医学部コース・難関大コースの外部募集計',
          capacity: 160,
        },
      ],
      totalCapacity: 160,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(岡山：令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D133310000014',
      schoolName: '関西高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 サイエンスフロンティア', capacity: 30 },
        { courseName: '普通科 国立進学', capacity: 20 },
        { courseName: '普通科 アドバンス(スタンダード系・ハイグレード系計)', capacity: 100 },
        { courseName: '普通科 体育進学', capacity: 70 },
        { courseName: 'ITビジネス科(ビジネス・アドバンス系・アスリート系計)', capacity: 100 },
        { courseName: 'EIエンジニア科(Eシステム・ICTクリエイター系・アスリート系計)', capacity: 100 },
      ],
      totalCapacity: 420,
      source: {
        url: 'https://www.oka-shigaku.gr.jp/pdf/examguide/highschool2025.pdf',
        docTitle:
          '令和7年度岡山県私立高等学校(全日制)入試要項一覧｜岡山県私学協会(関西：令和8年度はサイエンスフロンティア30→15・国立進学20→15・アドバンス100→110・体育進学70→80に再配分。校計420は同一)',
        fetchedAt: '2026-08-10',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D133310000023',
      schoolName: '岡山商科大学附属高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '総合学科 進学系列 総合進学コース', capacity: 45 },
        { courseName: '総合学科 進学系列 ITデザインコース', capacity: 10 },
        { courseName: '総合学科 情報・ビジネス系列 商大コース', capacity: 20 },
        { courseName: '総合学科 工業系列 工業技術コース', capacity: 75 },
        { courseName: '総合学科 進学系列 特別進学コース', capacity: 15 },
        { courseName: '総合学科 健康スポーツコース', capacity: 20 },
        {
          courseName: '総合学科 情報・ビジネス系列 情報コース・ビジネスコース',
          capacity: 45,
        },
        { courseName: '自動車科', capacity: 40 },
      ],
      totalCapacity: 270,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(岡山商科大学附属：令和8年度はITデザイン10→15・工業技術75→40・健康スポーツ20→45・情報/ビジネス45→50に再配分。校計270は同一)',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D133310000274',
      schoolName: '創志学園高等学校',
      reason: '本校(D133310000050)とは別に登録された分校(branch)扱いのエントリで、公式サイト・私学協会PDFいずれも本校とまとめた単一の募集定員(210名)のみを掲載しており分校単独の定員が確認できないため見送り',
    },
    {
      schoolCode: 'D133310000247',
      schoolName: '鹿島朝日高等学校',
      reason: '広域通信制高校で公式サイト(入学案内・生徒募集要項ページとも)に「定員」の記載自体が無く、二次情報源の「1440名」も収容定員(在籍総数)か募集定員(当該年度新規入学枠)か判別できないため見送り',
    },
    {
      schoolCode: 'D133310000256',
      schoolName: '滋慶学園高等学校',
      reason: '広域通信制高校。学校教育法に基づく情報公開PDFに「定員900」の記載はあるが、同一書類内の在籍者数217・入学者数72(R5.4.1〜R5.5.1)との比較から900は収容定員(在籍できる総人数の上限)であり募集定員(当該年度の新規入学枠)ではないと判断できるため見送り',
    },
    {
      schoolCode: 'D133310000265',
      schoolName: 'ワオ高等学校',
      reason: '広域通信制高校(オンライン中心)で公式サイトの新入学案内ページに「定員」の記載自体が無く、二次情報源の「1200名」も他の広域通信制校と同様に収容定員(在籍総数)の可能性が高く募集定員と判別できないため見送り',
    },
  ],
};
