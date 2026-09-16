// 東京都: 都立高校の学区制度は2003年度（平成15年度）に全廃され、現在は「全都一学区」。
//
// 一次ソース: 東京都教育委員会公式サイトの都立高校一覧・入試案内ページ群（`kyoiku.metro.tokyo.lg.jp`）
// では現行制度として学区の記載自体が無いことを2026-09-17にWebFetchで確認。廃止の経緯・時期に
// ついては都教委の当時の一次資料を発見できなかったため、Wikipedia「東京都立高等学校」の年表
// （2003年「学区を全廃」・出典番号[16]付き）を二次資料として使用（Y-0: 一次資料が見つからない
// 場合の代替として使用した旨を明記）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const TOKYO_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'tokyo',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成15年度（2003年度）',
  outOfDistrictCondition: '学区制度自体が無いため、都内在住であればどの都立高校にも出願可能',
  source: {
    url: 'https://ja.wikipedia.org/wiki/東京都立高等学校',
    docTitle: 'Wikipedia「東京都立高等学校」年表（出典[16]付き・2003年学区全廃の記載）',
    lastChecked: '2026-09-17',
  },
  note: '都教委公式サイトに現行の学区記載が無いことは直接確認済みだが、廃止の一次資料（当時の都教委告示等）は未発見のためWikipediaを出典とする（Y-0: 二次資料使用を明記）',
};
