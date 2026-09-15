// 山梨県: 私立高等学校等入学金・入学準備サポート事業給付金（県独自の入学時一時金）。
//
// 一次ソース: 山梨県「私立高等学校等に通学する生徒の支援制度について」ページ
// （2026-09-16 WebFetch確認）。授業料の上乗せではなく、入学金・入学準備費（制服等）を
// 対象とした低所得世帯向けの一時金給付。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const YAMANASHI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'yamanashi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校等入学金・入学準備サポート事業給付金（山梨県）',
  tiers: [
    {
      label: '世帯年収 約270万円未満（目安・入学金サポート）',
      annualAmountJpy: 200000,
      note: '全日制の入学金サポート（一時金）。通信制は100,000円。',
    },
    {
      label: '世帯年収 約270万円未満（目安・入学準備サポート）',
      annualAmountJpy: 50000,
      note: '入学準備費（制服等）のサポート（一時金・一律）。上記の入学金サポートとは別枠。',
    },
  ],
  source: {
    url: 'https://www.pref.yamanashi.jp/shigaku-kgk/shuugaku/koukousei.html',
    docTitle: '山梨県「私立高等学校等に通学する生徒の支援制度について」',
    lastChecked: '2026-09-16',
  },
};
