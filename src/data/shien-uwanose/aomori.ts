// 青森県: 就学支援費補助金（県独自の入学金補助）。
//
// 一次ソース: 青森県「私立高等学校等の修学支援制度について（就学支援金・奨学のための給付金など）」
// ページ (`https://www.pref.aomori.lg.jp/soshiki/kodomo/kenmin/Aomori_syugakushien.html`・
// 令和8年度実施予定・2026-09-18 curl+grepで生HTMLを直接確認)。
//
// 「就学支援費補助金（県）」は、高等学校等就学支援金（国）の受給資格を持つ私立高校生のうち、
// 年収目安270万円未満(算出額0円)の非課税相当世帯・当該年度の新入生のみを対象に、
// 入学金へ年額50,000円(上限)を補助する制度。学校が受け取り生徒・保護者が直接受け取るものでは
// ないためschool-subsidy型。授業料そのものへの県独自上乗せは本ページに見当たらなかった
// (国の就学支援金・学び直し支援金・専攻科修学支援金の説明のみ)。
//
// ★クロスチェック: 同ページに掲載の「奨学のための給付金」(全日制・定時制)の金額は
// 生業扶助受給世帯52,600円/非課税世帯152,000円/所得割105,500円未満50,670円/
// 105,500円以上182,500円未満38,000円で、`wakayama.ts`・`ehime.ts`と1円単位で完全一致した
// (3県目の一致・国の全国共通基準額である可能性をさらに補強)。この給付金は就学支援費補助金
// (入学金・school-subsidy型)とは受取方式が異なる別制度のため、本レコードのtiersには含めず
// このコメントに記録のみ留める(schemeTypeが1レコード1種類までのため)。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const AOMORI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'aomori',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'school-subsidy',
  schemeName: '青森県就学支援費補助金（入学金補助）',
  tiers: [
    {
      label: '年収目安270万円未満（算出額0円・非課税相当世帯）・当該年度の新入生（入学金補助）',
      annualAmountJpy: 50000,
      note: '国の就学支援金(または学び直しへの支援金)の受給資格を持つ生徒のみ対象。入学時のみの一時金。学校が受け取り入学金に充てる仕組み(school-subsidy)。',
    },
  ],
  source: {
    url: 'https://www.pref.aomori.lg.jp/soshiki/kodomo/kenmin/Aomori_syugakushien.html',
    docTitle: '私立高等学校等の修学支援制度について（就学支援金・奨学のための給付金など）',
    lastChecked: '2026-09-18',
  },
  note: '授業料そのものへの県独自上乗せは本ページに見当たらなかった(国の就学支援金等の説明のみ)。「奨学のための給付金」(授業料以外の教育費支援・非課税世帯152,000円等)も同ページに掲載されているが、wakayama/ehimeと金額が完全一致し国の全国共通基準額である可能性が高いため、受取方式が異なる本レコード(school-subsidy型の入学金補助)のtiersには含めていない。専攻科修学支援金・学び直しへの支援金・家計急変世帯支援は今回対象外。',
};
