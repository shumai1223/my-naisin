// 神奈川県: 学費補助金（県独自の上乗せ制度）。
//
// 一次ソース: 神奈川県「私立高等学校等の学費支援」令和8年度リーフレット(PDF)
// （`pref.kanagawa.jp/docs/v3e/jyosei/gakuhisien/gakuhihojyo.html` からリンクされる
// `r8leaflet.pdf`・2026-09-16 curl+Readツールでビジョン確認）。
//
// 授業料上乗せ額は生活保護世帯・住民税非課税世帯・年収270〜750万円未満の3区分とも同額
// （22,800円）。年収750万円以上は学費補助金（県制度）の対象外。入学金補助のみ所得区分で
// 金額が分かれる（212,000円 / 100,000円）ため、tierを分けて記録する。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const KANAGAWA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'kanagawa',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '学費補助金（神奈川県）',
  tiers: [
    {
      label: '年収750万円未満（目安・授業料上乗せ）',
      annualAmountJpy: 22800,
      note:
        '国の就学支援金に神奈川県独自で年額22,800円を上乗せ（通信制は142,800円）。' +
        '生活保護世帯・住民税非課税世帯・年収270〜750万円未満の3区分とも同額。',
    },
    {
      label: '生活保護世帯・住民税非課税世帯（入学金補助）',
      annualAmountJpy: 212000,
      note: '入学年度の1回のみの一時金。(1)の授業料上乗せとは別建て。',
    },
    {
      label: '年収270万円〜750万円未満（入学金補助）',
      annualAmountJpy: 100000,
      note: '入学年度の1回のみの一時金。年収750万円以上は入学金補助の対象外。',
    },
  ],
  source: {
    url: 'https://www.pref.kanagawa.jp/docs/v3e/jyosei/gakuhisien/gakuhihojyo.html',
    docTitle: '神奈川県「学費補助金について」（令和8年度リーフレットPDFを含む）',
    lastChecked: '2026-09-16',
  },
};
