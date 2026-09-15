// 京都府: あんしん修学支援事業（国の就学支援金に府独自の上乗せを行う制度）。
//
// 一次ソース: 京都府「私立高等学校に通学される場合の支援制度について」ページ
// （2026-09-16 WebFetch確認）。⚠️ページ自体に「令和7年度のものです。令和8年度は準備中」と
// 明記されており、令和8年度の詳細額は本レコード作成時点で未確定。
//
// ⚠️京都府の公表値は「国の就学支援金＋府独自の上乗せ」の合算後の年額であり、東京都のように
// 府独自分だけを単純に分離できる形では公表されていない。独自に差額を計算せず、公表されている
// 合算値をそのまま転記する（Y-0：公表値をそのまま転記・独自計算はしない）。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const KYOTO_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'kyoto',
  fiscalYear: '令和7年度（2025年度・令和8年度は本レコード作成時点で準備中との記載あり）',
  status: 'confirmed-yes',
  schemeType: 'household',
  schemeName: 'あんしん修学支援事業（京都府）',
  tiers: [
    {
      label: '生活保護世帯',
      annualAmountJpy: 980000,
      note: '国の就学支援金と府独自の上乗せを合算した年額（府独自分のみの内訳は非公表）。',
    },
    {
      label: '世帯年収 約590万円未満',
      annualAmountJpy: 650000,
      note: '国+府合算の年額。',
    },
    {
      label: '世帯年収 約590万円以上・兄弟姉妹同時在学世帯',
      annualAmountJpy: 559000,
      note:
        '国+府合算の年額。兄弟姉妹が公立高校または大学に通う場合は最大支援額が508,100円に' +
        '変わるなど、世帯構成によって金額が細分化されている（詳細は一次資料参照）。',
    },
  ],
  source: {
    url: 'https://www.pref.kyoto.jp/bunkyo/1335331059139.html',
    docTitle: '京都府「私立高等学校に通学される場合の支援制度について」',
    lastChecked: '2026-09-16',
  },
};
