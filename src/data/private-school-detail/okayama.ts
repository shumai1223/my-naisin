/**
 * 岡山県私立高等学校の募集定員データ(Λ-5第二段)。
 * 岡山県私学協会(oka-shigaku.gr.jp)が公表する「令和8年度岡山県私立高等学校(全日制)入試要項
 * 一覧」PDF(定員合計5,560人)から、コース区分が単一で誤帰属リスクの無い3校のみを収録。
 * 大半の学校は複数コースが視覚的な括弧グルーピングで表現されており(関西高校・就実高校等)、
 * どのコースがどの数値に対応するか慎重な個別確認が必要なため今回は見送り、次回以降に
 * 1校ずつ丁寧に再訪する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

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
  ],
  skipped: [],
};
