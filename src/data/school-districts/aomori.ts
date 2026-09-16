// 青森県: 県立高校の学区制度は平成17年度（2005年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H17 青森」と明記。二次資料（`ksmdi.jpn.org/gk4.html`「北海道・東北の
// 学区制」・WebSearch要約による複数の教育情報サイト）でも「2005年以前は6学区、2005年春から
// 学区制廃止が決定」という一致した記述を確認した。
//
// ⚠️廃止前の6学区の具体的な名称・区割りは今回一次資料で確認できなかった（複数の二次資料も
// 「6学区あった」という事実のみで名称までは記載していない）。推測で埋めず「未確認」として
// 記録する（Y-0）。
//
// 特記事項: 青森県は「県境隣接地域協定」により、県境近くに住む生徒が秋田県・岩手県の特定の
// 県立高校（1校まで）に出願できる制度がある（二次資料による・詳細な対象地域・対象校は未確認）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const AOMORI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'aomori',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成17年度（2005年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。廃止前は6学区制だったが、区割りの名称・区域は今回未確認。「県境隣接地域協定」により、県境近くの生徒は秋田県・岩手県の特定の県立高校(1校まで)にも出願できる制度がある(対象地域・対象校は未確認)',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '廃止前は6学区制だったことは複数の二次資料で一致確認できたが、学区の名称・市町村別の区割りまでは一次資料が見つからず未確認のまま',
};
