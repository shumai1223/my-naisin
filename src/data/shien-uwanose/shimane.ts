// 島根県: 私立高等学校の授業料減免制度（県独自・差額補填型）。
//
// 一次ソース: 島根県「私立中学校・高等学校の授業料減免制度」ページ
// (`https://www.pref.shimane.lg.jp/education/kyoiku/shiritu/shiritu/shigakugenmen.html`・
// 2026-09-18 curl+grepで生HTMLを直接確認)。
//
// ★制度設計(chiba/fukushimaと同型の「差額補填型」だが固定上限が無い点が異なる):
// 世帯年収目安270万円未満程度(生活保護受給、または市町村民税の算定基準額が0円となる場合)の
// 世帯に対し、「月額授業料 － 高等学校等就学支援金の認定月額(38,100円)」を月額で減免する。
// 学校ごとの実際の授業料額によって減免額が変動し、資料上に固定の上限額(annualAmountJpy)は
// 明記されていない。★annualAmountJpyには唯一資料に明記された具体的な数値である就学支援金
// 認定月額の年換算(38,100円×12=457,200円・国の支給上限と同額)を計算式の基準点として記録した
// (chibaの経過措置と同型の扱い)。これは「補助額そのもの」ではなく、実際の補助額は
// 学校の授業料実費からこの額を差し引いた金額であり上限は無い(推測で固定額を作らずY-0に従う)。
// 家計急変の場合(要件は同一・270万円未満程度)も同型の差額補填のため別tierとせず同一に扱う。
// WebSearchの二次情報にあった「年収590〜910万円未満で年3万円補助」という記述は、このページと
// 関連ページ(syuugakushienkin-shiritsu.html)のいずれにも見当たらず、Y-0に従い転記しなかった。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const SHIMANE_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'shimane',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-yes',
  schemeType: 'school-subsidy',
  schemeName: '島根県私立高等学校の授業料減免制度（差額補填型）',
  tiers: [
    {
      label: '世帯年収目安270万円未満程度（生活保護受給、または算定基準額0円）（差額補填・上限の定めなし）',
      annualAmountJpy: 457200,
      note: '★このannualAmountJpyは「補助額そのもの」ではなく、資料に明記された就学支援金認定月額(38,100円)の年換算(=国の支給上限と同額)。実際の補助額は「学校の授業料実費 − この額」であり、学校ごとに異なり上限は資料に明記されていない(Y-0: 実際の差額を推測で確定しない)。家計急変により同等の状況になった世帯も同型の差額補填を受けられる(算定基準額の判定方法のみ異なる)。',
    },
  ],
  source: {
    url: 'https://www.pref.shimane.lg.jp/education/kyoiku/shiritu/shiritu/shigakugenmen.html',
    docTitle: '私立中学校・高等学校の授業料減免制度（島根県）',
    lastChecked: '2026-09-18',
  },
  note: '入学金への県独自補助は本ページに見当たらなかった(授業料の差額補填のみ)。「奨学のための給付金」(授業料以外の教育費支援)は別ページ(shiritsu_shogaku_kyufukin.html)に掲載されているが、wakayama/ehime/aomoriと同型の全国共通基準額の可能性が高い制度のため今回は転記対象としなかった(重複記録を避ける運用を継続)。',
};
