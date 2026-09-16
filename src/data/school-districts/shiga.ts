// 滋賀県: 県立高校の学区制度は平成18年度（2006年度）入学者選抜から廃止され、現在は「全県一区」
// （居住地に関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 滋賀県教育委員会公式ページ「県立高校通学区域」
// (`pref.shiga.lg.jp/edu/nyuushi/high/305672/305698.html`・2026-09-17 WebFetch確認・
// 「平成18年度入学者選抜から、通学区域を全県一区としています」と明記)。廃止前の学区制度
// （区割りの名称等）はこのページに記載が無く、今回は未確認。
//
// ★滋賀県は学区制度とは別に、県内3校が「全国募集」を実施しており県外居住のまま出願できる特例
// がある（滋賀県教育委員会公式ページ「滋賀県で全国募集を行う高等学校」
// `pref.shiga.lg.jp/edu/nyuushi/high/306051/306076.html`・2026-09-17 WebFetch確認）:
// 信楽高等学校(セラミック系列・デザイン系列、平成26年度から実施)・伊香高等学校(森の探究科、
// 令和8年度から実施)・虎姫高等学校(国際バカロレア・ディプロマ・プログラム、令和8年度から実施)。
// 具体的な募集人数は同ページに明記が無い。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const SHIGA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'shiga',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成18年度（2006年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、居住地に関わらずどの県立高校にも出願可能。廃止前の区割りは未確認。学区制度とは別に、信楽高等学校(セラミック系列・デザイン系列・平成26年度〜)・伊香高等学校(森の探究科・令和8年度〜)・虎姫高等学校(国際バカロレア・ディプロマ・プログラム・令和8年度〜)の3校は「全国募集」を実施しており県外居住のまま出願できる(募集人数は非公開)',
  source: {
    url: 'https://www.pref.shiga.lg.jp/edu/nyuushi/high/305672/305698.html',
    docTitle: '滋賀県教育委員会「県立高校通学区域」',
    lastChecked: '2026-09-17',
  },
  note: '廃止前の学区の名称・区割りは一次資料で確認できず未確認のまま。全国募集3校の詳細は別ページ(pref.shiga.lg.jp/edu/nyuushi/high/306051/306076.html)を参照',
};
