// 大分県: 県立高校の学区制度は平成20年度（2008年度）入学生から廃止され、現在は「全県一区制」
// （住んでいる地域に関わらず希望する高校を受験可能）。
//
// 一次ソース: 大分県公式ページ「通学区域とは？」(`pref.oita.jp/soshiki/31210/tsuugakukuiki.html`・
// 2026-09-17 WebFetch確認)。同ページには廃止前の旧制度の一例（平成19年度時点）が記載されており、
// 「通学区域外（同色以外）の受入は、入学定員の10％以内」という学区外上限が明記されている
// （旧制度は学区を「色」で区分していたことが読み取れるが、区割りの名称・数はこのページには
// 記載が無い）。導入年度（2008年度）は二次資料のTOSオンライン記事
// (`tosonline.jp/news/20240912/00000009.html`・2024-09-12「全県一区制導入から16年」）で
// 裏付けた（2024-16=2008）。同記事によれば2024年に通学区域制度の検証委員会が発足し、
// 中高生・保護者アンケート等を通じた制度検証が進行中（2024年度末に結果報告予定）とのこと。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const OITA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'oita',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成20年度（2008年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は県内在住であればどの県立高校にも出願可能。廃止前(平成19年度時点の例)は学区を色分けして区分し、通学区域外(同色以外)からの受入は入学定員の10%以内という上限があった',
  source: {
    url: 'https://www.pref.oita.jp/soshiki/31210/tsuugakukuiki.html',
    docTitle: '大分県「通学区域とは？」',
    lastChecked: '2026-09-17',
  },
  note:
    '2024年に通学区域制度の検証委員会が発足し、中高生・保護者アンケート等による制度検証が進行中(2024年度末に結果報告予定・二次資料のTOSオンライン記事で確認)。検証の結果、将来的に制度が変更される可能性がある',
};
