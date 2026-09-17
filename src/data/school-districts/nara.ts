// 奈良県: 県立高校の学区制度は平成17年度（2005年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 岩手県「第7回持続可能で希望ある岩手を実現する行財政研究会」資料2「高等学校の
// 学区見直しにおける全国都道府県の状況」(`pref.iwate.jp/_res/projects/default_project/
// _page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断
// 比較表・2026-09-17 curl+pdftoppm(150dpi)でビジョン確認)の「通学区域廃止都道府県」表に
// 「H17　青森、秋田、茨城、神奈川、石川、奈良」と明記されている。
//
// ★廃止前は「北部学区」「南部学区」の2学区制だったことをWikipedia「奈良県高等学校一覧」
// (2026-09-17 WebFetchで確認)・WebSearch要約の複数の二次資料で一致確認した。南部学区は
// 吉野郡十津川村・野迫川村と旧大塔村（現五條市の一部）のみで構成され、所属校は十津川高等学校
// 1校のみという極端な小学区制だったとされるが、この区割りの詳細自体は今回一次資料で確認できて
// いない（Y-0）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const NARA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'nara',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成17年度（2005年度）',
  outOfDistrictCondition:
    '学区制度が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は「北部学区」「南部学区」の2学区制で、南部学区は吉野郡十津川村・野迫川村と旧大塔村(現五條市の一部)のみで構成され所属校は十津川高等学校1校のみという小学区制だったと二次資料で確認できるが、区割りの詳細は今回未確認',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: 'baseline調査時に見つかった「通学区域の設定を各高校を所管する教育委員会の判断に委ねる」という規制緩和方針の記述は、今回の一次資料・二次資料のいずれでも再確認できなかった（情報源の質が低いとbaselineに記録されていた通り、誤りだった可能性がある）ため転記しなかった',
};
