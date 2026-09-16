// 茨城県: 県立高校の学区制度は平成18年度（2006年度）入試から廃止され、現在は「全県一区」
// （居住地に関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 廃止年度は複数の二次資料（WebSearch要約複数件が一致・`ksmdi.jpn.org/gk5.html`
// 「関東・甲信越の学区制」）で「2006年度入試から全県1学区制」と確認。廃止前は5学区制だった
// ことも確認したが、区割りの名称・市町村構成は一次資料で見つからず今回は未確認。
//
// ★同資料によれば、福島・茨城・栃木・群馬・埼玉・千葉の6県間（福島-群馬間を除く）で「隣県の
// 隣接学区は隣接県協定により受験可能」という広域協定があったと記載されている。ただし学区制
// 自体が廃止された現在この協定がどう扱われているか（現存するか等）は今回未確認。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const IBARAKI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'ibaraki',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成18年度（2006年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は5学区制だったが、区割りの名称・市町村構成は今回未確認。廃止前は福島・茨城・栃木・群馬・埼玉・千葉の6県間(福島-群馬間を除く)で隣接学区への隣県協定があったとの二次資料の記述があるが、現行制度での扱いは未確認',
  source: {
    url: 'https://ksmdi.jpn.org/gk5.html',
    docTitle: '「関東・甲信越の学区制」(二次資料・複数のWebSearch要約と一致確認済み)',
    lastChecked: '2026-09-17',
  },
  note: '廃止年度・旧学区数(5学区)は複数の独立した二次資料で一致しており信頼度は高いが、県教育委員会自身の一次資料には未到達。旧区割りの名称・隣接県協定の現行での扱いは未確認のまま',
};
