// 三重県: 私立高等学校等教育費負担軽減制度（県独自の上乗せ・2種類の別建て補助）。
//
// 一次ソース: 三重県「私立高等学校等教育費負担軽減制度について（高等学校等就学支援金等）」
// ページ（2026-09-16 WebFetch確認・入学金補助分）＋補足検索（授業料上乗せ分）。
// 三重県独自の上乗せは2種類あり、対象要件が異なるため別々のtierとして記録する:
//  (1) 授業料上乗せ: 世帯年収目安590〜910万円未満の世帯に年額12,000円
//  (2) 入学金補助: 道府県民税・市町村民税所得割の合算額が85,500円未満の世帯に、
//      入学金の1/2（上限25,000円・一時金）

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const MIE_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'mie',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '私立高等学校等教育費負担軽減制度（三重県）',
  tiers: [
    {
      label: '世帯年収 約590〜910万円未満（目安・授業料上乗せ）',
      annualAmountJpy: 12000,
      note: '国の就学支援金に三重県独自で年額12,000円を上乗せ（授業料分）。',
    },
    {
      label: '道府県民税・市町村民税所得割合算8万5,500円未満（入学金補助）',
      annualAmountJpy: 25000,
      note:
        '入学金の1/2（上限25,000円）を補助。年額の継続給付ではなく入学時のみの一時金。' +
        '(1)の授業料上乗せとは別建ての制度で、対象要件（所得判定方法）も異なる。',
    },
  ],
  source: {
    url: 'https://www.pref.mie.lg.jp/SIGAKU/HP/shigaku/83230021363_00003.htm',
    docTitle: '三重県「私立高等学校等教育費負担軽減制度について（高等学校等就学支援金等）」',
    lastChecked: '2026-09-16',
  },
};
