/**
 * 岩手県私立高等学校の募集定員データ(Λ-5第二段)。
 * schools-private/iwate.ts(第一段・機械生成の参照台帳)13校のうち、確度高く確認できた
 * 2校を収録。岩手県私学協会サイトはSocket closedで直接フェッチ不可(既知の制約)のため、
 * 学校ごとの個別調査(公式サイト・WebSearch要約の複数経路クロスチェック)で進めている。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_IWATE: PrivateSchoolDetailFile = {
  prefectureCode: 'iwate',
  schools: [
    {
      schoolCode: 'D103310000092',
      schoolName: '花巻東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 240,
      source: {
        url: 'https://www.hanamakihigashi-h.jp/',
        docTitle: '令和8年度募集要項(WebSearch要約2経路で「普通科全体の募集人員は男女計240名」と独立一致確認・特別進学/進学/スポーツの3コース制だがコース別内訳は非公開)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D103310000065',
      schoolName: '盛岡大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 150,
      source: {
        url: 'https://www.morifu.jp/exam/examination/',
        docTitle: '入試要項ページ｜盛岡大学附属高等学校公式サイト(「全日制普通科で計150名(男女共学)」・特別進学/高大連携進学/進学の3コース制だがコース別内訳は非公開)',
        fetchedAt: '2026-07-30',
      },
    },
  ],
  skipped: [],
};
