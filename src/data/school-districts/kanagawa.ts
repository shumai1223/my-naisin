// 神奈川県: 県立高校の学区制度は平成17年度（2005年度）に撤廃され、現在は「全県学区」。
// 1950年の19学区制発足から1963・1981・1990年の段階的な学区縮小を経て2005年に全廃という
// 変遷史を持つ。
//
// 一次ソース: Wikipedia「神奈川県高等学校の通学区域」（2026-09-17 WebFetch確認・「2005年
// （平成17年）、県立高校の学区撤廃」と明記）。神奈川県教育委員会の当時の一次告示は発見できな
// かったため二次資料を使用（Y-0: 二次資料使用を明記）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const KANAGAWA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'kanagawa',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成17年度（2005年度）',
  outOfDistrictCondition:
    '県立高校は学区制度自体が無いため、県内在住であればどの県立高校にも出願可能',
  source: {
    url: 'https://ja.wikipedia.org/wiki/神奈川県高等学校の通学区域',
    docTitle: 'Wikipedia「神奈川県高等学校の通学区域」',
    lastChecked: '2026-09-17',
  },
  note: '1950年19学区制発足→1963/1981/1990年に段階的縮小→2005年全廃という変遷。⚠️川崎市立高校は2005年時点で「川崎市内学区」に変更されたとの記載がWikipediaにあるが、令和8年度時点で同様の別扱いが続いているかは今回未確認（osaka/shigaと同型の府省市区別パターンの可能性があるため要再確認・断定しない）',
};
