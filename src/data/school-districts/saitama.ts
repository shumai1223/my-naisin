// 埼玉県: 県立高校（全日制課程普通科）の通学区域制度は平成16年度（2004年度）入学者選抜から
// 廃止され、現在は県内どこの公立高校でも受検可能。
//
// 一次ソース: 埼玉県公式PDF「参考 旧通学区域における他通学区域への進学状況」
// (`pref.saitama.lg.jp/documents/20124/487787.pdf`・2026-09-17 WebFetch+pdftoppmで目視確認)
// の（注）欄に「平成１５年度の入学者選抜までは、公立高等学校全日制課程普通科に進学しようと
// する者は、本人が居住する市町村によって定められた通学区域内の学校を選ばなければならなかった。
// 平成１６年度の入学者選抜からは、この制度が廃止され、県内のどこの公立高等学校でも受検する
// ことが可能となった。」と明記されている。同PDFには廃止前（平成15年度）の8通学区域の
// 市町村一覧も掲載されている（歴史的資料として参考）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const SAITAMA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'saitama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成16年度（2004年度）',
  outOfDistrictCondition: '学区制度自体が無いため、県内在住であればどの公立高校にも出願可能',
  source: {
    url: 'https://www.pref.saitama.lg.jp/documents/20124/487787.pdf',
    docTitle: '埼玉県「参考 旧通学区域における他通学区域への進学状況」',
    lastChecked: '2026-09-17',
  },
  note: '廃止前(平成15年度)は8通学区域(第1〜第8通学区域、一部は南部/北部・東部/中部/西部に細分)が設定されていた（同PDFの参考資料より）',
};
