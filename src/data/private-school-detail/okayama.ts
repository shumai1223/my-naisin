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
  ],
  skipped: [],
};
