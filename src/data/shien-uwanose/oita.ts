// 大分県: 私立高等学校授業料減免支援制度（県独自の上乗せ・令和2年度開始）。
//
// 一次ソース: 大分県「私立高等学校授業料減免支援制度」ページ
// （`pref.oita.jp/soshiki/11830/syugakushienkin.html`・2026-09-16 WebFetch確認）。
// ページに「大分県独自の施策として月10,000円を上乗せ支援する制度を令和2年度より開始しました」
// と明記。現行ページに対象年度の明確な記載は無いため、確認日時点の内容として記録する。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const OITA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'oita',
  fiscalYear: '令和2年度開始・確認日(2026-09-16)時点で継続中',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校授業料減免支援制度（大分県）',
  tiers: [
    {
      label: '世帯年収 約590万円〜910万円未満',
      annualAmountJpy: 120000,
      note: '月額10,000円を国の就学支援金(月額9,900円)に上乗せ。国+県合算で月19,900円(年額238,800円)。',
    },
    {
      label: '世帯年収 約380万円〜590万円',
      annualAmountJpy: 60000,
      note: '月額5,000円を上乗せ。',
    },
    {
      label: '住民税非課税世帯（授業料月額33,000円超）',
      annualAmountJpy: 24000,
      note: '月額2,000円を上乗せ。',
    },
    {
      label: '家計急変世帯',
      annualAmountJpy: 120000,
      note: '月額10,000円を上乗せ（590〜910万円未満世帯と同額）。',
    },
  ],
  source: {
    url: 'https://www.pref.oita.jp/soshiki/11830/syugakushienkin.html',
    docTitle: '大分県「私立高等学校授業料減免支援制度」',
    lastChecked: '2026-09-16',
  },
};
