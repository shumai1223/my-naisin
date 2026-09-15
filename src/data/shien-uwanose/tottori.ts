// 鳥取県: 鳥取県私立高等学校等総合支援金（県独自の上乗せ制度）。
//
// 一次ソース: 鳥取県「鳥取県私立高等学校等総合支援金」リーフレット(PDF・令和8年6月発行)
// （`pref.tottori.lg.jp/309270.htm`からリンクされる`/secure/1312397/R8sougousienkin.pdf`・
// 2026-09-16 curl+Readツールでビジョン確認）。
//
// 「国の就学支援金に上乗せして支援金を支給する鳥取県独自の制度」と明記。年収目安270万円以上は
// 支給されない（対象外）。支給額は「各校で定める額のいずれか低い額」との上限付き。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const TOTTORI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'tottori',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '鳥取県私立高等学校等総合支援金',
  tiers: [
    {
      label: '年収目安270万円未満（算定額100円未満）',
      annualAmountJpy: 43200,
      note: '月額3,600円を国の就学支援金に上乗せ。ただし各校で定める額の方が低い場合はそちらを支給。年収270万円以上は支給対象外。',
    },
    {
      label: '生活保護受給世帯',
      annualAmountJpy: 86400,
      note: '月額7,200円を上乗せ。ただし各校で定める額の方が低い場合はそちらを支給。',
    },
  ],
  source: {
    url: 'https://www.pref.tottori.lg.jp/309270.htm',
    docTitle: '鳥取県「鳥取県私立高等学校等総合支援金」（リーフレットPDFを含む）',
    lastChecked: '2026-09-16',
  },
};
