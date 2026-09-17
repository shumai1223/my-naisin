// 島根県: 島根県教育委員会は県立高校の通学区域を定めていない(=学区制度なし)。
// ただし松江市・出雲市の一部の普通科高校には、当該市外からの合格者数に上限を設ける
// 「地域外入学制限」という別建ての制度が現在も存在する。
//
// 一次ソース: 島根県公式ページ「通学区域」(`pref.shimane.lg.jp/education/kyoiku/koukou/saihen/
// tuugaku.html`・学校企画課・2026-09-17 curl -k+HTML解析で本文確認)。
//
// ★令和3年度(2021年度)より前は、松江市内の普通科3校(松江北・松江南・松江東)に限り
// 「小学区制度」という別の仕組みがあったが、これは令和3年度に撤廃済み。この小学区制度が
// 具体的にどの区域を対象にしていたかは本ページに記載が無く未確認(Y-0)。撤廃後の現在も
// 「地域外入学制限」(市外からの合格者数の上限)自体は残っている点に注意(小学区制度と
// 地域外入学制限は別の制度)。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const SHIMANE_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'shimane',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '令和3年度（2021年度）※松江市内普通科3校の「小学区制度」のみ。県全体としての学区制度が過去に存在したかどうかは本ページに記載が無く未確認',
  outOfDistrictCondition:
    '学区制度自体が無いため、県内在住であればどの県立高校にも出願可能。ただし別建ての「地域外入学制限」として、松江北高校・松江南高校・松江東高校の普通科は松江市外からの合格者を定員の10%以内に、出雲高校の普通科は出雲市外からの合格者を定員の5%以内に、それぞれ制限している(この制限は令和3年度の小学区制度撤廃後も現在まで継続)',
  source: {
    url: 'https://www.pref.shimane.lg.jp/education/kyoiku/koukou/saihen/tuugaku.html',
    docTitle: '島根県公式ページ「通学区域」(学校企画課)',
    lastChecked: '2026-09-17',
  },
  note: '「小学区制度の撤廃」と「地域外入学制限」は別の制度。前者は令和3年度に廃止済みだが、後者(4校限定の市外合格者数上限)は現在も有効。県全体としての学区制度の歴史(そもそも存在したか)は本ページからは確認できないため、県全体分はabolishedFiscalYearに含めず正直に「未確認」と明記した(Y-0)',
};
