// 高知県: 県立高校の学区制度は平成24年度（2012年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース(廃止前の区割り): 高知県公式PDF「東部学区 高知学区 高吾学区 幡多学区」
// (`pref.kochi.lg.jp/doc/saihen1/file_contents/2009122500113_www_pref_kochi_lg_jp_uploaded_
// attachment_21509.pdf`・2026-09-17 WebSearchで確認)。廃止前は東部・高知・高吾・幡多の4学区制
// だったことを示す。
//
// 廃止年度の確認: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H24 高知」と明記されている。高知県教育委員会「県立高等学校教育問題
// 検討委員会」報告書(`kochinet.ed.jp/sinnkoukihonn4/siryou4-4.pdf`)にも通学区域見直しの検討
// 経緯が記録されているが、こちらはPDF解析不能(WebFetch自己申告)のため本文までは確認していない。
//
// ⚠️岩手県資料の「実施年度」表記が、廃止の決定年度か、廃止後最初の入試が実施された年度か
// （他県の年度表記との整合。例: yamaguchiは「2016年度(平成28年度)入試から」という入学年度
// 基準の表現との差異が生じうる）は厳密には未確認。本DBでは同資料の表記をそのまま転記する。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const KOCHI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'kochi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成24年度（2012年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は東部学区・高知学区・高吾学区・幡多学区の4学区制だった(学区外就学条件の詳細な比率等は未確認)',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '廃止前の4学区(東部・高知・高吾・幡多)の区割りは高知県公式PDF(pref.kochi.lg.jp)で確認。廃止年度自体は岩手県の比較資料による間接確認で、高知県教育委員会の検討委員会報告書本文までは今回未確認',
};
