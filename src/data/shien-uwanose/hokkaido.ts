// 北海道: 私立高等学校等授業料軽減制度（北海道独自の上乗せ制度）。
//
// 一次ソース: 北海道「私立高等学校等授業料軽減制度（北海道の制度）」ページ
// （`pref.hokkaido.lg.jp/sm/gkj/260022.html`・2026-09-16 WebFetch確認）。
// 補助は道から学校設置者に対して行われ授業料に充てられる（家庭が直接受け取る形ではない）。
// ⚠️所得判定基準の詳細な対応表は画像形式で掲載されており、590万円未満の1区分のみを
// 高い確信度で確認できた。それ以外の区分（多子世帯加算等）の有無は未確認。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const HOKKAIDO_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'hokkaido',
  fiscalYear: '2025年8月21日時点のページ記載（令和8年度の改定有無は未確認）',
  status: 'confirmed-yes',
  schemeType: 'school-subsidy',
  schemeName: '私立高等学校等授業料軽減制度（北海道）',
  tiers: [
    {
      label: '世帯年収 約590万円未満',
      annualAmountJpy: 24000,
      note: '最大月額2,000円(年額24,000円)。国の就学支援金に上乗せして道から学校設置者へ支給。',
    },
  ],
  source: {
    url: 'https://www.pref.hokkaido.lg.jp/sm/gkj/260022.html',
    docTitle: '北海道「私立高等学校等授業料軽減制度（北海道の制度）」',
    lastChecked: '2026-09-16',
  },
};
