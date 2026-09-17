// 秋田県: 県立高校の学区制度は平成17年度（2005年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H17　青森、秋田、茨城、神奈川、石川、奈良」と明記。
//
// ★廃止前は3学区制だったこと、学区外への出願枠(調整枠)が無かったこと、理数科等の専門学科も
// 普通科と同じく学区の対象だったこと(他県では専門学科は学区の定めなく県内全域とする例が多く、
// これは珍しい設計)を二次資料(`ksmdi.jpn.org/gk4.html`「北海道・東北の学区制」)で確認したが、
// 学区の名称・区割りまでは同資料にも記載が無く未確認のまま記録する(Y-0)。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const AKITA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'akita',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成17年度（2005年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は3学区制で、学区外への出願枠(調整枠)は設けられておらず、理数科等の専門学科も普通科と同様に学区の対象だった(専門学科を学区の定めなく県内全域とする他県とは異なる設計)。学区の名称・区割りは今回未確認',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '廃止前3学区・学区外枠なし・専門学科も学区対象、という詳細は二次資料(ksmdi.jpn.org「北海道・東北の学区制」)のみで確認でき、秋田県教育委員会の一次資料には到達できなかった。学区の名称は同資料にも記載が無く未確認',
};
