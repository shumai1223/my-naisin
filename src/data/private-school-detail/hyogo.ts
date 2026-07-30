/**
 * 兵庫県私立高等学校の募集定員データ(Λ-5第二段)。
 * (株)育伸社が公表する「2026年度高専・私立高校募集要項【兵庫県】」PDFから、単一コースで
 * 専願・併願とも同一の募集人員が記載され誤帰属リスクの無い3校のみを収録。大半の学校は
 * 複数コースが「↓」記号(上の入試区分と同一の意)を挟んで連続する構造で、かつ学校ごとの
 * 「計」欄が無いため今回は見送り、次回以降に1校ずつ丁寧に再訪する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

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
      },
    },
  ],
  skipped: [],
};
