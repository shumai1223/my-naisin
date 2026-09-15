// 広島県: 授業料等軽減補助金（県独自の上乗せ制度）。
//
// 一次ソース: 広島県「私立高等学校等の教育費負担軽減制度の御案内」リーフレット(PDF)
// （`pref.hiroshima.lg.jp/soshiki/44/jugyouryoukeigen.html`からリンクされる
// `/uploaded/attachment/664134.pdf`・2026-09-16 curl+Readツールでビジョン確認）。
//
// 授業料等の支給上限額は「就学支援金との合計」と明記された合算値のため、Y-0（公表値を
// そのまま転記・独自計算はしない）に従いそのまま転記する。入学時納入金補助（一時金）は別tier。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const HIROSHIMA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'hiroshima',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '授業料等軽減補助金（広島県）',
  tiers: [
    {
      label: '生活保護受給世帯・年収目安270万円未満（算定基準額0円）',
      annualAmountJpy: 600000,
      note: '国の就学支援金との合計の上限年額（月額50,000円）。入学時納入金は別途180,000円。',
    },
    {
      label: '年収目安350万円未満（算定基準額51,300円未満）',
      annualAmountJpy: 600000,
      note:
        '国の就学支援金との合計の上限年額（月額50,000円）。入学時納入金は別途180,000円' +
        '（「入学時納入金－5,650円」が18万円未満の場合はその額）。',
    },
    {
      label: '生活保護受給世帯・年収目安350万円未満（入学時納入金補助）',
      annualAmountJpy: 180000,
      note: '入学時のみの一時金。(1)(2)の授業料等軽減とは別建て。',
    },
  ],
  source: {
    url: 'https://www.pref.hiroshima.lg.jp/soshiki/44/jugyouryoukeigen.html',
    docTitle: '広島県「令和8年度 私立高等学校等授業料等の負担軽減について」（リーフレットPDFを含む）',
    lastChecked: '2026-09-16',
  },
};
