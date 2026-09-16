// 宮城県: 県立高校の通学区域制度は平成22年度（2010年度）の入学者選抜から全日制課程普通科を
// 含む全課程・全学科で撤廃され、現在は「全県一学区」。
//
// 一次ソース: 宮城県公式サイト「県立高校の全県一学区化について」
// (`pref.miyagi.jp/soshiki/souzou/gakku.html`・2026-09-17 WebFetch確認・「平成22年度の入学者
// 選抜から、全日制課程普通科についても...現在の通学区域を撤廃し、全県一学区とすることとしました」
// と明記)。決定までの経緯（平成17年7月審議会諮問→平成18年11月答申（撤廃決定）→平成19年4月27日
// 規則改正・公布）も同ページに記載されている。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const MIYAGI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'miyagi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成22年度（2010年度）',
  outOfDistrictCondition: '学区制度自体が無いため、県内在住であればどの県立高校にも出願可能',
  source: {
    url: 'https://www.pref.miyagi.jp/soshiki/souzou/gakku.html',
    docTitle: '宮城県「県立高校の全県一学区化について」',
    lastChecked: '2026-09-17',
  },
  note: '決定までの経緯: 平成17年7月に審議会へ諮問→平成18年3月中間報告（3%枠拡大案と撤廃案の両論併記）→平成18年11月答申（撤廃決定）→平成19年4月27日「県立高等学校の通学区域に関する規則」改正・公布',
};
