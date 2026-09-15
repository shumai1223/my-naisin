// 奈良県: 私立高等学校授業料等軽減補助金（県独自の上乗せ制度）。
//
// 一次ソース: 奈良県「私立高等学校授業料等軽減補助金について」ページ
// （`pref.nara.lg.jp/n056/54792.html`・2026-09-16 WebFetch確認）。
//
// 「令和8年度から所得制限を撤廃しました」との記載により所得区分は無く一律。補助限度額は
// 「高等学校等就学支援金等と合わせて」の合算上限額と明記されているため、Y-0（公表値を
// そのまま転記）に従いそのまま転記する。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const NARA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'nara',
  fiscalYear: '令和8年度（2026年度）以降',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校授業料等軽減補助金（奈良県）',
  tiers: [
    {
      label: '所得制限なし（令和8年度から撤廃・全日制・定時制）',
      annualAmountJpy: 630000,
      note: '国の就学支援金等と合わせた補助限度額（年額）。通信制は321,000円。',
    },
  ],
  source: {
    url: 'https://www.pref.nara.lg.jp/n056/54792.html',
    docTitle: '奈良県「私立高等学校へ通う方への補助について」',
    lastChecked: '2026-09-16',
  },
};
