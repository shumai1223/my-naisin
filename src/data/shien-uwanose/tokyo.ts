// 東京都: 私立高等学校等授業料軽減助成金（都独自の上乗せ制度）。
//
// 一次ソース: 東京都私学財団「私立高等学校等授業料軽減助成金（都の制度）」ページ
// （2026-09-16 WebFetch確認）。国の就学支援金（年額45万7,200円）に、都独自の授業料軽減
// 助成金（年額4万3,800円）を上乗せし、都内私立高校平均授業料相当額（合計最大50万1,000円）
// までを支援する。所得制限なし（授業料軽減助成金のみの申請の場合）。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const TOKYO_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'tokyo',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校等授業料軽減助成金（東京都）',
  tiers: [
    {
      label: '所得制限なし（一律）',
      annualAmountJpy: 43800,
      note:
        '国の就学支援金（年額457,200円）に都独自の軽減助成金（年額43,800円）を上乗せし、' +
        '都内私立高校平均授業料相当額（合計最大501,000円）まで支援。授業料軽減助成金のみの' +
        '申請であれば所得制限なし（奨学給付金を同時申請する場合は別途所得要件あり）。',
    },
  ],
  source: {
    url: 'https://www.shigaku-tokyo.or.jp/parents_index/pa_jugyoryo/',
    docTitle: '東京都私学財団「私立高等学校等授業料軽減助成金（都の制度）」',
    lastChecked: '2026-09-16',
  },
};
