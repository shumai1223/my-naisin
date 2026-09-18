// 鹿児島県: 鹿児島県私立高等学校授業料軽減費補助（県独自・世帯の課税状況別）。
//
// 一次ソース: 鹿児島県総務部学事法制課「私立高等学校に在学する生徒に対する修学支援」ページ
// (`http://www.pref.kagoshima.jp/ab04/kyoiku-bunka/school/shiritu/sigaku.html`・
// 2026-09-19 curlで生HTMLを直接確認)。ページ内「2 鹿児島県私立高等学校授業料軽減費補助（令和8年度）」
// に補助額(上限額)が月額で明記されている。年額は月額×12で算出（授業料が上限に満たない場合は
// 授業料が限度）。同ページ「3 入学金軽減費補助」（非課税/均等割のみ世帯・上限5,650円・1回限り）は
// 授業料でなく入学金のため年額tiersには含めず、noteに記載した。
// 国の就学支援金(38,100円/月)・奨学給付金(授業料以外)とは別建て。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const KAGOSHIMA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'kagoshima',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: '鹿児島県私立高等学校授業料軽減費補助',
  tiers: [
    {
      label: '生活保護世帯',
      annualAmountJpy: 96000,
      note: '月額8,000円(上限額)×12か月。授業料が上限に満たない場合は授業料が限度。全日制課程のみ。',
    },
    {
      label: '道府県民税・市町村民税が非課税の世帯',
      annualAmountJpy: 59400,
      note: '月額4,950円(上限額)×12か月。全日制課程のみ。保護者等が県内在住であること。',
    },
    {
      label: '道府県民税・市町村民税の課税額が均等割のみの世帯',
      annualAmountJpy: 59400,
      note: '月額4,950円(上限額)×12か月。全日制課程のみ。',
    },
  ],
  source: {
    url: 'http://www.pref.kagoshima.jp/ab04/kyoiku-bunka/school/shiritu/sigaku.html',
    docTitle: '鹿児島県／私立高等学校に在学する生徒に対する修学支援（総務部学事法制課）',
    lastChecked: '2026-09-19',
  },
  note: '同ページには養護施設入所生徒の授業料負担者(4,950円/月)・災害罹災世帯(全壊4,950円/月・半壊2,475円/月)・その他特に必要と認められる者(4,950円/月)の区分もある。別制度「入学金軽減費補助」は非課税/均等割のみ/養護施設入所の各世帯で上限5,650円(入学時のみ)。国の就学支援金(全日制38,100円/月)には所得区分の県独自上乗せは無く、当制度は課税状況に応じた授業料の補助である。奨学給付金(授業料以外)は別ページで対象外。',
};
