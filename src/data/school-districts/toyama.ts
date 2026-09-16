// 富山県: 県立高校の学区制度は令和6年度（2024年度）入学生から廃止され、現在は「県下一円」。
// 廃止前は新川学区・富山学区・高岡学区・砺波学区の4学区制だった。専門学科・定時制課程・
// 音楽コース/体育コースは従来から学区の定めなし（県下一円）。
//
// 一次ソース: 富山県公式ページ「県立高校の通学区域（学区）について」
// (`pref.toyama.jp/3003/tsugakukuiki.html`・2026-09-17 WebFetch確認・「令和６年度入学生から、
// 富山県立高校の通学区域が県下一円になります」と明記)。廃止前の4学区（新川学区5校・富山学区
// 8校・高岡学区6校・砺波学区4校）の校名・対応市町村一覧も同ページに掲載されている。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const TOYAMA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'toyama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '令和6年度（2024年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、県内在住であればどの県立高校にも出願可能。専門学科・定時制課程・全日制課程普通科の音楽コース/体育コースは制度変更前から学区の定めなし（県下一円）',
  source: {
    url: 'https://www.pref.toyama.jp/3003/tsugakukuiki.html',
    docTitle: '富山県「県立高校の通学区域（学区）について」',
    lastChecked: '2026-09-17',
  },
  note: '廃止前は新川学区(5校)・富山学区(8校)・高岡学区(6校)・砺波学区(4校)の4学区制だった',
};
