// 群馬県: 私立学校授業料減免事業補助金＋私立高等学校等入学金減免事業補助金（県独自の上乗せ制度）。
//
// 一次ソース: 群馬県ホームページ（私学・青少年課）
// 授業料減免: `pref.gunma.jp/site/hojokin/3562.html`
// 入学金減免: `pref.gunma.jp/page/3558.html`
// （いずれも2026-09-16 WebFetch確認）。2つの制度は対象要件（所得区分の基準）が異なる別建て
// のため、tierを分けて記録する。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const GUNMA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'gunma',
  fiscalYear: '確認日(2026-09-16)時点',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立学校授業料減免事業補助金／私立高等学校等入学金減免事業補助金（群馬県）',
  tiers: [
    {
      label: 'ア区分（生活保護受給世帯・授業料減免）',
      annualAmountJpy: 168000,
      note: '月額14,000円を国の就学支援金に上乗せ。',
    },
    {
      label: 'イ区分（年収400万円未満かつ資産700万円未満・授業料減免）',
      annualAmountJpy: 336000,
      note: '月額28,000円を上乗せ。',
    },
    {
      label: '県民税・市町村民税所得割額の合算が0円（非課税・入学金減免）',
      annualAmountJpy: 60000,
      note: '入学時のみの一時金。授業料減免とは別建て。',
    },
    {
      label: '同合算額100円以上85,500円未満（入学金減免）',
      annualAmountJpy: 30000,
      note: '入学時のみの一時金。',
    },
  ],
  source: {
    url: 'https://www.pref.gunma.jp/site/hojokin/3562.html',
    docTitle: '群馬県「私立学校授業料減免事業補助金」／「私立高等学校等入学金減免事業補助金」',
    lastChecked: '2026-09-16',
  },
};
