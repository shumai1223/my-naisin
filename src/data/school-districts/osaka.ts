// 大阪府: 府立高校の学区制度は2014年度に全廃。大阪市立・堺市立・岸和田市立・東大阪市立の
// 高校も、2022年4月に大阪府へ移管されたことで同一制度（学区なし）に統合されている。
//
// 一次ソース: 大阪市教育委員会公式ページ「大阪市立高等学校の大阪府への移管について」
// (`city.osaka.lg.jp/kyoiku/page/0000556616.html`・2026-09-17 WebFetch確認・「大阪市立の
// 高等学校等は、令和4年4月に大阪府へ移管されました」と明記)で市立高校の移管時期を確認。
// 府立高校の学区廃止自体（2012年知事指示・2014年度実施）はWebSearchの複数の独立した情報源
// （日本経済新聞記事・Wikipedia「大阪府高等学校の通学区域」）で一致したが、府教委の当時の
// 一次告示は未発見のため、市立高校移管の一次資料と組み合わせて総合判断した。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const OSAKA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'osaka',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成26年度（2014年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、府内在住であればどの公立高校（元市立含む）にも出願可能',
  source: {
    url: 'https://www.city.osaka.lg.jp/kyoiku/page/0000556616.html',
    docTitle: '大阪市教育委員会「大阪市立高等学校の大阪府への移管について」',
    lastChecked: '2026-09-17',
  },
  note: '2013年度以前は大阪市立高校が府立と別の学区運用だった可能性があるが、2022年4月の府への移管で現在は解消済み。府立側の2014年度学区全廃の一次告示は未発見でWebSearchの複数独立情報源に基づく（Y-0: 出典の限界を明記）',
};
