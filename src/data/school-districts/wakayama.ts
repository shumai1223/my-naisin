// 和歌山県: 県立高校の学区制度は平成15年度（2003年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。全国で東京都と並び最も早い時期に学区制を撤廃した県の一つ。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H15 東京、和歌山」と明記。二次資料（複数のWebSearch要約）も
// 「和歌山県は2003年度に全国で初めて学区撤廃に踏み切った」と一致して記述している。県教育委員会
// 公式ページ(`pref.wakayama.lg.jp/prefg/500100/gakkouichiran/gakkouichiran.html`)自体には
// 学区制度に関する直接の記述が無く、2026-09-17時点でも一次資料での直接確認はできていない。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const WAKAYAMA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'wakayama',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成15年度（2003年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、居住地に関わらずどの県立高校にも出願可能。廃止前の区割りは未確認。東京都と並び全国で最も早い時期(2003年度)に学区制を撤廃した県の一つ',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '廃止年度は岩手県比較資料と複数の独立した二次資料が一致しており信頼度は高いが、和歌山県教育委員会自身の一次資料には未到達。廃止前の区割りの名称は未確認のまま',
};
