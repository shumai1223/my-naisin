// 栃木県: 私立高等学校等入学料減免事業（県独自の上乗せ制度）。
//
// 一次ソース: 栃木県「私立高等学校等入学料減免事業」ページ
// （`pref.tochigi.lg.jp/b05/education/nyugakuryo/r8.html`・2026-09-16 WebFetch確認・
// 更新日2026年4月1日＝令和8年度分）。全日制・中等教育学校の金額を採用する
// （通信制・専修学校高等課程は別額: 非課税50,000円/25万7,500円未満25,000円）。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const TOCHIGI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'tochigi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校等入学料減免事業（栃木県）',
  tiers: [
    {
      label: '住民税非課税世帯（全日制・入学料減免）',
      annualAmountJpy: 70000,
      note: '入学時のみの一時金。通信制・専修学校高等課程は50,000円。',
    },
    {
      label: '算定基準額25万7,500円未満（非課税除く・全日制・入学料減免）',
      annualAmountJpy: 35000,
      note: '入学時のみの一時金。通信制・専修学校高等課程は25,000円。',
    },
  ],
  source: {
    url: 'https://www.pref.tochigi.lg.jp/b05/education/nyugakuryo/r8.html',
    docTitle: '栃木県「私立高等学校等入学料減免事業」',
    lastChecked: '2026-09-16',
  },
};
