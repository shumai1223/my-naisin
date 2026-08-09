/**
 * 秋田県私立高等学校の募集定員データ（Λ-5第二段）。
 * schools-private/akita.ts（第一段・機械生成の参照台帳）5校中2校の公式募集要項PDFを
 * 直接WebFetchで確認できた。
 *
 * 【掛-2（私立×多年度）追加】ノースアジア大学明桜高等学校の令和8年度(2026年度)入学試験要項
 * PDFを発見。全日制4コース(特別進学コースα・β/デジタル/文理/総合研究)の合計は令和7年度と
 * 完全に同一(170名)。ただし令和8年度は新たに「人間科学コース（通信制課程・認可申請中）」
 * 40名が追加されており、既存レコードの収録範囲(全日制4コースのみ)に合わせて本レコードも
 * 全日制のみを収録し、通信制の新設はnoteで別記するに留めた（収録範囲を年度間で揃えないと
 * 単純な定員比較が壊れるため）。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_AKITA: PrivateSchoolDetailFile = {
  prefectureCode: 'akita',
  schools: [
    {
      schoolCode: 'D105320159025',
      schoolName: '国学館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 160 },
        { courseName: '調理科', capacity: 40 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.kokugakukan.ed.jp/sys/wp-content/themes/kokugakukan/file/seitobosyu_2026.pdf',
        docTitle: '2026年度（令和8年度）国学館高等学校生徒募集要項（普通科・調理科各コースの選択は2年次から実施のため募集時点ではコース別内訳非公開）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D105320159043',
      schoolName: 'ノースアジア大学明桜高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '特別進学コースα・β', capacity: 40 },
        { courseName: 'デジタルコース', capacity: 20 },
        { courseName: '文理コース', capacity: 40 },
        { courseName: '総合研究コース', capacity: 70 },
      ],
      totalCapacity: 170,
      source: {
        url: 'https://www.meioh.ed.jp/cms/assets/uploads/2024/09/7c58edb27e312f159e70c8d18b9283f5.pdf',
        docTitle: '令和7年度（2025年度）ノースアジア大学明桜高等学校入学試験要項',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D105320159043',
      schoolName: 'ノースアジア大学明桜高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学コースα・β', capacity: 40 },
        { courseName: 'デジタルコース', capacity: 20 },
        { courseName: '文理コース', capacity: 40 },
        { courseName: '総合研究コース', capacity: 70 },
      ],
      totalCapacity: 170,
      source: {
        url: 'https://www.meioh.ed.jp/cms/assets/uploads/2025/10/6a50dae7dce1ed132caa97a31517cf1c.pdf',
        docTitle: '令和8年度（2026年度）ノースアジア大学明桜高等学校入学試験要項「1)募集定員」（掛-2。全日制4コース合計は令和7年度と完全に同一の170名。同年度から新設の「人間科学コース（通信制課程・認可申請中）」40名は収録範囲を令和7年度に揃えるため対象外とした）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D105320159016',
      schoolName: '聖霊女子短期大学付属高等学校',
      reason: '公式サイトに募集要項PDFへの直接リンクを特定できず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D105320159034',
      schoolName: '秋田令和高等学校',
      reason: '公式サイトの募集要項ページが「令和9年度の情報は準備中」のみで令和8年度分の定員が掲載されておらず、確認できなかった',
    },
    {
      schoolCode: 'D105321259068',
      schoolName: '秋田修英高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセス(WebFetch)が失敗し、確度の高い最新年度定員を確認できなかった',
    },
  ],
};
