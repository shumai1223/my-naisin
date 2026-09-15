// 福井県: 県の学納金減免制度（県独自の上乗せ制度）。
//
// 一次ソース: 福井県「高等学校等就学支援金制度」ページ
// （`pref.fukui.lg.jp/doc/daishi/syugakusien.html`・2026-09-16 WebFetch確認・
// 最終更新日2026年4月1日・関連PDF名「R8.4〜就学支援金の概要図」＝令和8年度分と推定）。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const FUKUI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'fukui',
  fiscalYear: '令和8年度（2026年度）と推定（関連PDF名「R8.4〜」より）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '県の学納金減免制度（福井県）',
  tiers: [
    {
      label: '世帯年収 約270万円未満',
      annualAmountJpy: 90000,
      note: '月額7,500円を国の就学支援金に上乗せ。',
    },
    {
      label: '世帯年収 約270〜350万円未満',
      annualAmountJpy: 45000,
      note: '月額3,750円を上乗せ。',
    },
    {
      label: '世帯年収 約350〜590万円未満',
      annualAmountJpy: 30000,
      note: '月額2,500円を上乗せ。',
    },
  ],
  source: {
    url: 'https://www.pref.fukui.lg.jp/doc/daishi/syugakusien.html',
    docTitle: '福井県「高等学校等就学支援金制度」',
    lastChecked: '2026-09-16',
  },
};
