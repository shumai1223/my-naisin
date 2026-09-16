// 岡山県: 私立高等学校納付金減免補助金（県独自の上乗せ制度）。
//
// 一次ソース: 岡山県「私立高等学校納付金減免補助金」ページ
// （`pref.okayama.jp/page/detail-81814.html`・2026-09-16 WebFetch確認）。
// ⚠️ページ更新日が2022年5月9日と古く、令和8年度時点での改定有無は未確認。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const OKAYAMA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'okayama',
  fiscalYear: 'ページ更新日2022年5月9日時点（令和8年度の改定有無は未確認）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校納付金減免補助金（岡山県）',
  tiers: [
    {
      label: '年収270万円未満程度',
      annualAmountJpy: 60000,
      note: '年額60,000円以内。',
    },
    {
      label: '年収270〜350万円未満程度',
      annualAmountJpy: 48000,
      note: '年額48,000円以内。',
    },
    {
      label: '年収350〜590万円未満',
      annualAmountJpy: 24000,
      note: '年額24,000円以内。',
    },
  ],
  source: {
    url: 'https://www.pref.okayama.jp/page/detail-81814.html',
    docTitle: '岡山県「私立高等学校納付金減免補助金」',
    lastChecked: '2026-09-16',
  },
};
