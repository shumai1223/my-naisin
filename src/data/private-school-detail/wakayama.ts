/**
 * 和歌山県私立高等学校の募集定員データ（Λ-5第二段）。
 * schools-private/wakayama.ts（第一段・機械生成の参照台帳）10校中2校の公式募集要項を
 * 直接WebSearch/WebFetchで確認できた。県庁/協会の一覧PDFは見当たらなかったため個別調査。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_WAKAYAMA: PrivateSchoolDetailFile = {
  prefectureCode: 'wakayama',
  schools: [
    {
      schoolCode: 'D130310000017',
      schoolName: '和歌山信愛高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特進コース', capacity: 60 },
        { courseName: '学際コース', capacity: 70 },
      ],
      totalCapacity: 130,
      source: {
        url: 'https://www.shin-ai.ac.jp/',
        docTitle: '和歌山信愛中学校・高等学校 高校生募集要項（令和8年度・全日制課程普通科）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D130310000026',
      schoolName: '開智高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 300,
      source: {
        url: 'https://www.kaichi.ed.jp/exam/s_exam/s_guideline.html',
        docTitle: '開智中学校・高等学校 高等学校募集要項（令和8年度・内部進学者約140名を含む総定員300名。SI類約40名+I類約120名は外部募集分の内訳のため総定員のみ収録）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D130310000035',
      schoolName: '高野山高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D130310000044',
      schoolName: '近畿大学附属新宮高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D130310000053',
      schoolName: '智辯学園和歌山高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D130310000062',
      schoolName: '近畿大学附属和歌山高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D130310000071',
      schoolName: '和歌山南陵高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D130310000080',
      schoolName: '初芝橋本高等学校',
      reason: '2027年度以降の生徒募集停止が決定され令和8年度が最終募集年度だが、具体的な募集人員(数値)を公式サイトから確認できなかった',
    },
    {
      schoolCode: 'D130310000099',
      schoolName: 'りら創造芸術高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
    {
      schoolCode: 'D130310000106',
      schoolName: '慶風高等学校',
      reason: '公式サイトの募集要項ページへの直接アクセスに至らず、確度の高い最新年度定員を確認できなかった',
    },
  ],
};
