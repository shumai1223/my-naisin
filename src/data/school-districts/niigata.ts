// 新潟県: 県立高校の学区制度は平成20年度（2008年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H20　新潟、静岡、島根、大分、宮崎」と明記。WebSearchの二次資料要約
// (学習塾サイト等)でも「学校選択の偏り是正等を理由に平成20年度から通学区域制度を廃止し全県
// 一学区とした」という一致した記述を確認した。
//
// ⚠️廃止前の学区数・名称・区割りは今回一次資料・二次資料とも見つけられなかった。推測で埋めず
// 「未確認」として記録する（Y-0）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const NIIGATA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'niigata',
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
  note: '廃止理由(学校選択の偏り是正等)はWebSearchの二次資料要約でのみ確認でき、新潟県教育委員会の一次資料には到達できなかった',
};
