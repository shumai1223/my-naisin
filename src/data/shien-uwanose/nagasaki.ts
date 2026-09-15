// 長崎県: 長崎県私立高等学校授業料軽減補助金（県独自の上乗せ・3つの制度のうち2つめ）。
//
// 一次ソース: 長崎県総務部学事振興課の資料「長崎県の私立高校における授業料・校納金に対する
// 負担軽減について」（2026-09-16 WebFetch+pdftoppm目視確認）。表形式で年収区分別の金額が
// 明確に印字されており読み取り精度が高い。ただし資料自体に「※令和2年度7月以降の内容です」
// と明記されており、令和8年度時点で金額が改定されている可能性がある（要再確認）。
// 国の就学支援金とは別に「長崎県私立高等学校等奨学給付金」（授業料以外の負担軽減）も別建てで
// 存在するが、本レコードは授業料軽減補助金（県）のみを対象とする。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const NAGASAKI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'nagasaki',
  fiscalYear: '令和2年度7月以降（掲載資料の記載どおり・令和8年度時点での改定有無は要再確認）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '長崎県私立高等学校授業料軽減補助金',
  tiers: [
    {
      label: '世帯年収 590万円以上720万円未満',
      annualAmountJpy: 79200,
      note: '全日制の場合。通信制は29,700円。',
    },
    {
      label: '世帯年収 270万円未満（通信制のみ）',
      annualAmountJpy: 63000,
      note: '全日制はこの区分の県補助が印字されていない（0円扱い）。通信制のみ対象。',
    },
    {
      label: '生活保護世帯等',
      annualAmountJpy: 63600,
      note: '全日制・通信制とも63,600円。',
    },
  ],
  source: {
    url: 'https://www.kokoromirai.ed.jp/mirai-wp/wp-content/themes/astra-child/pdf/support-other.pdf',
    docTitle: '長崎県総務部学事振興課「長崎県の私立高校における授業料・校納金に対する負担軽減について」',
    lastChecked: '2026-09-16',
  },
};
