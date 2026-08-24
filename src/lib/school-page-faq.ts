import type { SchoolPageData } from '@/lib/school-page-data';

export interface SchoolFaqItem {
  question: string;
  answer: string;
}

/**
 * S3-4（ops/PROPOSALS.md）: 学校ページの FAQPage 構造化データ用の質問・回答を生成する。
 *
 * 全ての回答は `school`（教育委員会公表の一次データ）から動的に算出し、文字列を手書きしない
 * （[[feedback-verify-source-url-matches-pdf-read]]/都道府県名+数値の手書きプローズの教訓と同源）。
 * 偏差値・合格最低点・口コミ評価は自社に実データが無いため一切言及しない（捏造ゼロ・Y-0憲法）。
 * 過去年度の推移・近隣校リンクは、実際にそのデータを持つ学校のみ質問を追加する（無い学校に
 * 「はい、あります」と答える虚偽を防ぐ）。
 */
export function buildSchoolFaqItems(school: SchoolPageData, prefectureName: string): SchoolFaqItem[] {
  const items: SchoolFaqItem[] = [
    {
      question: `${school.schoolName}の今季の入試倍率は何倍ですか？`,
      answer: `${school.overallRate}倍です（募集人員${school.totalQuota}名に対し応募者数${school.totalApplicants}名。${prefectureName}教育委員会が公表した一次データに基づく数値です）。`,
    },
    {
      question: 'このページに偏差値や合格最低点は掲載されていますか？',
      answer:
        '掲載していません。当サイトでは教育委員会が公表した募集人員・応募者数・倍率の実数のみを掲載しており、偏差値・合格最低点・独自の口コミ評価は扱っていません。',
    },
  ];

  if (school.history.length > 0) {
    items.push({
      question: `${school.schoolName}の過去の倍率の推移も確認できますか？`,
      answer: `はい。${school.schoolName}固有の募集人員・応募者数・倍率の推移を年度別に掲載しており、一意に特定できた年度については出典（教育委員会公表資料）も明記しています。`,
    });
  }

  return items;
}
