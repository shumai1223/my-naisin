// 山形県: 山形県私立高等学校就学支援金制度（県独自の授業料軽減補助・上乗せ制度）。
//
// 一次ソース: 山形県公式ページ「山形県私立高等学校就学支援金制度について」
// (`https://www.pref.yamagata.jp/020023/syuugakusienkin.html`・2026-09-18 curl+grepで
// 生HTML確認)。
//
// 本制度は「国の就学支援金と合わせた月額支給額のうち一部が山形県独自の授業料軽減補助」という
// 制度設計。ページの表記は月額のため annualAmountJpy は月額×12で年額換算し、県単独の上乗せ分
// （国の支給額との差額）のみを転記する(shizuoka/mie/hokkaidoと同型の「県単独分のみ記録」方式)。
// 第3区分(算出額≧304,200円)は「予定」表記で「詳細は国で決まり次第学校を通してお知らせ」と
// あり、令和8年度時点でも確定額でないため注記に明記した(上乗せ自体は無い区分)。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const YAMAGATA_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'yamagata',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'school-subsidy',
  schemeName: '山形県私立高等学校就学支援金制度（県独自の授業料軽減補助分）',
  tiers: [
    {
      label: '算定式による算出額（市町村民税課税標準額×6%－調整控除額）＜154,500円',
      annualAmountJpy: 12000,
      note: '月額1,000円の県単上乗せ(月額34,000円のうち1,000円が山形県独自の授業料軽減補助・残り33,000円は国の就学支援金)。',
    },
    {
      label: '算定式による算出額＜304,200円（かつ154,500円以上）',
      annualAmountJpy: 145200,
      note: '月額12,100円の県単上乗せ(月額22,000円のうち12,100円が山形県独自の授業料軽減補助・残り9,900円は国の就学支援金)。',
    },
    {
      label: '算定式による算出額≧304,200円',
      annualAmountJpy: 0,
      note: '県単上乗せなし。月額9,900円(国の就学支援金のみ)で「予定」表記(詳細は国の制度確定後に学校を通じて案内)。',
    },
  ],
  source: {
    url: 'https://www.pref.yamagata.jp/020023/syuugakusienkin.html',
    docTitle: '山形県私立高等学校就学支援金制度について（山形県公式ページ）',
    lastChecked: '2026-09-18',
  },
  note: '判定基準は世帯年収の目安ではなく「市町村民税の課税標準額×6%－市町村民税の調整控除の額」で算定される額そのもの(ページに年収目安の換算表記は無いためY-0に従い年収目安への変換はしない)。公立高校向けの就学支援金制度は別ページ(`pref.yamagata.jp/700001/kenkyoiku02/shugakusien.html`)で扱われており、私立高校向けの本制度とは別建て。',
};
