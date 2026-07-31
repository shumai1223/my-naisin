/**
 * 岩手県私立高等学校の募集定員データ(Λ-5第二段)。
 * 個別学校サイト調査で先に確認していた2校(花巻東・盛岡大学附属)に加え、
 * 熊本・大分・鹿児島・山形・群馬・茨城・山口・広島・奈良に続き(株)育伸社
 * (入試情報課)の「2026年度高専・私立高校募集要項【岩手県】」(2025年11月4日
 * 現在)から残り11校を取得し、参照台帳13校を完全収録した(花巻東=240・
 * 盛岡大学附属=150は個別サイト調査時の数値と育伸社データが完全一致し
 * クロスチェックが取れている)。岩手高等学校の総合進学・特別進学コース、
 * 盛岡白百合学園のスーパー特進・特進・進学アクティブコース、盛岡中央の
 * 5コース、一関学院・一関修紅の各3コースのように複数コースが「普通科計X」
 * と注記され同一数値を共有している場合は合算せず1つの共有コースとして
 * 統合記録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03903.pdf',
  docTitle: '2026年度 高専・私立高校 募集要項【岩手県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_IWATE: PrivateSchoolDetailFile = {
  prefectureCode: 'iwate',
  schools: [
    {
      schoolCode: 'D103310000010',
      schoolName: '岩手高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(総合進学コース・特別進学コース計・男)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000029',
      schoolName: '岩手女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(女)', capacity: 120 },
        { courseName: '看護(女・内推薦45程度)', capacity: 60 },
        { courseName: '福祉教養(女)', capacity: 40 },
      ],
      totalCapacity: 220,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000038',
      schoolName: '盛岡白百合学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(スーパー特進コース・特進コース・進学アクティブコース計・2026年度より共学化)', capacity: 240 }],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000047',
      schoolName: '江南義塾盛岡高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通', capacity: 90 }],
      totalCapacity: 90,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000056',
      schoolName: '盛岡誠桜高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '全科(一括)', capacity: 225 }],
      totalCapacity: 225,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000065',
      schoolName: '盛岡大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・高大連携進学コース・進学コース計)', capacity: 150 }],
      totalCapacity: 150,
      source: {
        url: 'https://www.morifu.jp/exam/examination/',
        docTitle: '入試要項ページ｜盛岡大学附属高等学校公式サイト(「全日制普通科で計150名(男女共学)」・育伸社募集要項PDFの普通科計150と完全一致確認)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D103310000074',
      schoolName: '盛岡スコーレ高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '総合(自己推薦)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000083',
      schoolName: '盛岡中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進選抜SZコース・特進Zコース・国際Rコース・進学選抜Aコース・進学総合Bコース計)', capacity: 240 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000092',
      schoolName: '花巻東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・進学コース・スポーツコース計)', capacity: 240 }],
      totalCapacity: 240,
      source: {
        url: 'https://www.hanamakihigashi-h.jp/',
        docTitle: '令和8年度募集要項(WebSearch要約2経路で「普通科全体の募集人員は男女計240名」と独立一致確認・育伸社募集要項PDFの普通科計240と完全一致確認)',
        fetchedAt: '2026-07-30',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D103310000109',
      schoolName: '専修大学北上高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(Ⅰ期185)', capacity: 185 },
        { courseName: 'グローカルビジネス', capacity: 80 },
        { courseName: 'メカニックエンジニアリング', capacity: 35 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000118',
      schoolName: '協和学院水沢第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通(Ⅰ期105)', capacity: 105 },
        { courseName: '調理', capacity: 35 },
      ],
      totalCapacity: 140,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000127',
      schoolName: '一関学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(特別進学コース・普通・美容コース計)', capacity: 280 }],
      totalCapacity: 280,
      source: IKUSHIN_SOURCE,
    },
    {
      schoolCode: 'D103310000136',
      schoolName: '一関修紅高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(進学探究コース・キャリア探究コース・ライフデザインコース計)', capacity: 240 }],
      totalCapacity: 240,
      source: IKUSHIN_SOURCE,
    },
  ],
  skipped: [],
};
