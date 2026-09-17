// 富山県: 高等学校等就学支援金制度における県独自の上乗せ（授業料助成・入学時納付金助成）。
//
// 一次ソース: 富山県「高等学校等就学支援金制度」リーフレット(令和6年11月配付版)PDF
// (`https://www.pref.toyama.jp/documents/8829/r6-11.pdf`・全2頁・2026-09-18 curl+pdftoppmで
// 目視確認)。入学時納付金助成の金額は掲載元ページ
// `https://www.pref.toyama.jp/1119/kurashi/kyouiku/gakkou/shuugakushien/kj00015295.html`
// (WebFetchで確認)。
//
// リーフレットの「3.支給額」図では、算定基準額154,500円(年収目安590万円)〜304,200円
// (年収目安910万円)の範囲でのみ「県支援」という緑色の上乗せ区間が明示されている。
// 590万円未満は国の支援のみで396,000円に既に達しており、910万円以上は上乗せなし
// (118,800円のみ)。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const TOYAMA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'toyama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '富山県高等学校等就学支援金制度（県支援・授業料助成分）',
  tiers: [
    {
      label: '算定基準額154,500円以上304,200円未満（年収目安590万円以上910万円未満）・多子(3人以上)またはひとり親世帯以外',
      annualAmountJpy: 79200,
      note: '国の就学支援金に対する富山県独自の上乗せ分(「県支援」)。この所得区分でのみ発生し、590万円未満は既に国のみで上限(396,000円)に達しているため上乗せなし、910万円以上は上乗せなし(118,800円のみ)。',
    },
    {
      label: '算定基準額154,500円以上304,200円未満（年収目安590万円以上910万円未満）・多子(3人以上)またはひとり親世帯',
      annualAmountJpy: 277200,
      note: '国の就学支援金に対する富山県独自の上乗せ分。多子・ひとり親世帯向けの拡充額。',
    },
    {
      label: '入学時納付金助成（年収目安270万円未満[住民税所得割非課税世帯]、または年収目安910万円未満の多子・ひとり親世帯）',
      annualAmountJpy: 124350,
      note: '入学時のみの一時金。失職等の家計急変事由が生じた世帯も対象となる場合がある。',
    },
  ],
  source: {
    url: 'https://www.pref.toyama.jp/documents/8829/r6-11.pdf',
    docTitle: '富山県「高等学校等就学支援金制度」リーフレット（令和6年11月配付版）',
    lastChecked: '2026-09-18',
  },
  note: '年収目安は両親・高校生・中学生の4人家族で両親の一方が働いている場合の目安であり、実際の判定基準は算定基準額(市町村民税の課税標準額×6%－市町村民税の調整控除の額)で行われる。入学時納付金助成の金額・対象条件は`https://www.pref.toyama.jp/1119/kurashi/kyouiku/gakkou/shuugakushien/kj00015295.html`のWebFetch確認による(このリーフレットPDF本体には記載なし)。',
};
