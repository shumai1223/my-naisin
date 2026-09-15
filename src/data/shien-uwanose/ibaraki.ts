// 茨城県: 私立高等学校等入学金減免事業（県独自の上乗せ制度）。
//
// 一次ソース: 茨城県教育委員会「私立学校向けの軽減制度」ページ
// （`kyoiku.pref.ibaraki.jp/gakko/private-schools/school-attendance-support/reduction/`・
// 2026-09-16 WebFetch確認）。⚠️ページ本文に「令和7年度において上記の補助対象学校に入学した
// 生徒」との記載があり、令和8年度時点での改定有無は未確認。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const IBARAKI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'ibaraki',
  fiscalYear: '令和7年度（ページ記載時点・令和8年度の改定有無は未確認）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校等入学金減免事業（茨城県）',
  tiers: [
    {
      label: '年収約350万円未満世帯（全日制・入学金減免）',
      annualAmountJpy: 96000,
      note: '入学時のみの一時金。専修学校高等課程は76,000円。',
    },
    {
      label: '年収約590万円未満世帯（全日制・入学金減免）',
      annualAmountJpy: 48000,
      note: '入学時のみの一時金。専修学校高等課程は38,000円。',
    },
  ],
  source: {
    url: 'https://kyoiku.pref.ibaraki.jp/gakko/private-schools/school-attendance-support/reduction/',
    docTitle: '茨城県教育委員会「私立学校向けの軽減制度」',
    lastChecked: '2026-09-16',
  },
};
