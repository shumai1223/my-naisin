// 福井県: 県立高校の学区制度は平成16年度（2004年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H16　埼玉、福井」と明記。
//
// ★福井県は学区の廃止と同時に「藤島・高志学校群選抜入試制度」(東京都のかつての学校群制度に
// 類似する、特定の2校をまとめて選抜する仕組み)も廃止されたという二次資料の記述(WebSearch要約
// による学習塾・教育系記事)を確認したが、一次資料での裏取りはできていない。学区の数・名称・
// 区割りも今回一次資料・二次資料とも見つけられなかった。推測で埋めず「未確認」として記録する
// （Y-0）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const FUKUI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'fukui',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成16年度（2004年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。学区廃止と同時に「藤島・高志学校群選抜入試制度」(特定校をまとめて選抜する仕組み)も廃止されたと二次資料にあるが一次資料未確認。学区の数・名称・区割りも今回未確認',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '「藤島・高志学校群選抜入試制度」の廃止は二次資料(学習塾・教育系記事のWebSearch要約)のみで確認でき、福井県教育委員会の一次資料には到達できなかった',
};
