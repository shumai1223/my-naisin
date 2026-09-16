// 広島県: 県立高校の学区制度は平成18年度（2006年度）入学者選抜からすべて廃止され、現在は
// 「全県一円」（居住地に関わらずどの県立高校にも出願可能）。定時制課程・通信制課程は廃止前から
// 既に全県対応だった。
//
// 一次ソース: 広島県教育委員会公式ページ「県立高等学校の通学区域全県一円化について」
// (`pref.hiroshima.lg.jp/site/kyouiku/06senior-plan-tsuugakukuiki-index.html`・2026-09-17
// WebFetch確認・「平成18年度入学者選抜からすべての県立高校の通学区域を全県一円とします」と
// 明記)。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const HIROSHIMA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'hiroshima',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成18年度（2006年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は全日制普通科のみ6学区制で、他学区からの入学限度枠(調整率)は定員の30%だった。全県一円化と同時にこの入学限度枠自体も廃止された。総合選択制・コース設置校・専門学科・総合学科、及び定時制課程・通信制課程は廃止前から既に全県対応だった',
  source: {
    url: 'https://www.pref.hiroshima.lg.jp/site/kyouiku/06senior-plan-tsuugakukuiki-index.html',
    docTitle: '広島県教育委員会「県立高等学校の通学区域全県一円化について」',
    lastChecked: '2026-09-17',
  },
  note: '廃止前の6学区の名称・区割りは今回のページには記載が無く未確認のまま',
};
