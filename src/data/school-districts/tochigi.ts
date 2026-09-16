// 栃木県: 県立高校の学区制度（「栃木県立高等学校の通学区域に関する規則」）は平成26年
// （2014年）4月1日付けで廃止され、現在は「全県一区」（居住地に関わらずどの県立高校にも
// 出願可能）。
//
// 一次ソース: 栃木県教育委員会「『栃木県立高等学校の通学区域に関する規則』の概要について」PDF
// (`pref.tochigi.lg.jp/m01/education/kyouikuzenpan/keikaku/documents/documents/kyuugakku.pdf`・
// 全3頁・2026-09-17 curl+pdftoppm(200dpi)で目視確認)。冒頭に「平成26年4月1日付けで廃止され
// ました」と明記された、廃止前の旧規則を説明する資料。別表第1・別表第2を全文転記。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const TOCHIGI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'tochigi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成26年度（2014年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は全日制普通科・総合学科(中高一貫型併設校の普通科を除く)のみ7学区制(下記note参照)で、学区外からの受検者は当該学科の募集定員の25%までしか入学できなかった。中高一貫型併設校の普通科・専門学科・定時制課程・通信制課程は廃止前から学区の定めなく県内全域だった',
  source: {
    url: 'https://www.pref.tochigi.lg.jp/m01/education/kyouikuzenpan/keikaku/documents/documents/kyuugakku.pdf',
    docTitle: '栃木県教育委員会「『栃木県立高等学校の通学区域に関する規則』の概要について」',
    lastChecked: '2026-09-17',
  },
  note:
    '廃止前の7学区(別表第1): 宇都宮学区(宇都宮市)・上都賀学区(鹿沼市・日光市)・下都賀学区(栃木市・小山市・下野市・上三川町・壬生町・野木町・岩舟町)・安足学区(足利市・佐野市)・芳賀学区(真岡市・益子町・茂木町・市貝町・芳賀町)・那須学区(大田原市・那須塩原市・那須町)・塩谷南那須学区(矢板市・さくら市・那須烏山市・塩谷町・高根沢町・那珂川町)。別表第2「調整地域」により、宇都宮市在住者は上三川高・壬生高・石橋高・高根沢高・さくら清修高にも学区内扱いで出願可能、さくら市/下野市/上三川町/芳賀町/壬生町/高根沢町在住者は宇都宮高・宇都宮南高・宇都宮北高・宇都宮清陵高・宇都宮女子高・宇都宮中央女子高にも学区内扱いで出願可能という相互乗り入れがあった',
};
