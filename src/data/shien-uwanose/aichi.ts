// 愛知県: 入学納付金補助（県独自の上乗せ制度）。
//
// 一次ソース: 愛知県「私立高等学校等の授業料・入学金補助の内容について（令和8年度予算）」
// ページ（`pref.aichi.jp/soshiki/shigaku/koukoujugyouryoutou-oshirase.html`・
// 2026-09-16 WebFetch確認）。
//
// ⚠️ページの授業料補助上限額(457,200円)は国の就学支援金の上限額と完全に一致し、ページ本文でも
// 授業料の行にだけは「本県独自に」という文言が無い（入学納付金の行にのみ「本県独自に実質無償化
// します」と明記）。授業料分について愛知県独自の上乗せ額が別枠であるとは確認できなかったため、
// Y-0（推測で埋めない）に従い授業料分はレコード化せず、明確に「本県独自」と書かれている
// 入学納付金補助のみを記録する。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const AICHI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'aichi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校等入学納付金補助（愛知県）',
  tiers: [
    {
      label: '全日制（所得制限なし・入学納付金補助）',
      annualAmountJpy: 200000,
      note:
        '「入学納付金も所得制限を廃止し、本県独自に実質無償化します」と明記。実際の入学納付金額が' +
        'この上限額より低い場合は実費が補助額となる。通信制は34,000円、専修学校高等課程は170,000円。',
    },
  ],
  source: {
    url: 'https://www.pref.aichi.jp/soshiki/shigaku/koukoujugyouryoutou-oshirase.html',
    docTitle: '愛知県「私立高等学校等の授業料・入学金補助の内容について（令和8年度予算）」',
    lastChecked: '2026-09-16',
  },
};
