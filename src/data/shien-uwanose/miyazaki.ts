// 宮崎県: 高等学校等就学支援金（私立高等学校等）について（県独自の授業料上乗せは確認できず）。
//
// 一次ソース: 宮崎県「高等学校等就学支援金（私立高等学校等）について」ページ
// (`https://www.pref.miyazaki.lg.jp/miyazaki-bunkashinko/kyoikukosodate/kyoiku/20230815143411.html`・
// 2026-09-18 curl+grepで生HTMLを直接確認)。
//
// ページ本文は「高等学校等就学支援金制度は、家庭の状況にかかわらず...国の費用により...支給し」
// と明記しており、支給額(全日制38,100円/月＝年額457,200円・通信制28,100円/月)も国の基準額
// そのもの。宮崎県独自の追加上乗せに関する記述は見当たらなかった。入学金補助等の別制度も
// 探索したが該当する一次資料は見当たらなかった(「私立高等学校専攻科に通う生徒への授業料支援」
// は専攻科[高校卒業後の課程]向けで対象外、「宮崎県私立高等学校等奨学給付金」はwakayama等と
// 同型の授業料以外の教育費支援のため対象外)。

import type { PrefectureShienUwanose } from '@/lib/education-cost/shien-uwanose';

export const MIYAZAKI_SHIEN_UWANOSE: PrefectureShienUwanose = {
  prefectureCode: 'miyazaki',
  fiscalYear: '令和8年度（2026年度）',
  status: 'confirmed-none',
  source: {
    url: 'https://www.pref.miyazaki.lg.jp/miyazaki-bunkashinko/kyoikukosodate/kyoiku/20230815143411.html',
    docTitle: '高等学校等就学支援金（私立高等学校等）について（宮崎県みやざき文化振興課）',
    lastChecked: '2026-09-18',
  },
  note: '一次資料を確認した結果、授業料そのものへの宮崎県独自の上乗せは確認できなかった。ページ本文が「国の費用により...支給」と明記し、支給額(全日制38,100円/月=年額457,200円)も国基準額そのもの。関連リンクの「私立高等学校専攻科に通う生徒への授業料支援」は専攻科(高校卒業後の課程)向けで高校生本体は対象外、「宮崎県私立高等学校等奨学給付金」は授業料以外の教育費支援(wakayama/ehime/aomori/tokushima/kochiと同型の可能性が高い全国共通基準額)のため今回は探索対象外とした。T-Y14(学校・学科別選抜方法DB)のmiyazakiとは別ドメインのデータであり混同しないこと。',
};
