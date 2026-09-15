// 山口県: 山口県私立高校生入学金等減免事業（県独自の上乗せ制度）。
//
// 一次ソース: 山口県「私立学校・入学時納付金等減免」ページ
// （`pref.yamaguchi.lg.jp/soshiki/3/12046.html`・2026-09-16 WebFetch確認）。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const YAMAGUCHI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'yamaguchi',
  fiscalYear: '確認日(2026-09-16)時点（ページ更新日2026年4月1日）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '山口県私立高校生入学金等減免事業',
  tiers: [
    {
      label: '世帯年収350万円未満程度（入学時納付金補助）',
      annualAmountJpy: 70000,
      note: '入学時のみの一時金。',
    },
    {
      label: '生活保護法による被保護者（施設整備費等補助）',
      annualAmountJpy: 19800,
      note: '月額1,650円。入学時納付金補助とは別建て。',
    },
  ],
  source: {
    url: 'https://www.pref.yamaguchi.lg.jp/soshiki/3/12046.html',
    docTitle: '山口県「私立学校・入学時納付金等減免」',
    lastChecked: '2026-09-16',
  },
};
