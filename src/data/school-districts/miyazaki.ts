// 宮崎県: 県立高校の学区制度は平成20年度（2008年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H20　新潟、静岡、島根、大分、宮崎」と明記(niigata実装時に同じ行で
// 既に目視確認済み)。WebSearchの二次資料でも「2008年(平成20年)4月1日に宮崎県立普通科高校の
// 学区制が廃止され全県一学区となった」という一致した記述を確認した。
//
// ⚠️廃止前の学区数・名称・区割りは今回一次資料・二次資料とも見つけられなかった。推測で埋めず
// 「未確認」として記録する（Y-0）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const MIYAZAKI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'miyazaki',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成20年度（2008年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前の学区数・名称・区割りは今回一次資料・二次資料とも見つけられず未確認',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '廃止年度は同一PDF行(H20・新潟/静岡/島根/大分/宮崎)でniigata実装時に一次確認済み。廃止理由等の詳細は宮崎県教育委員会の一次資料には到達できず、WebSearchの二次資料要約のみで確認',
};
