// 山梨県: 県立高校の学区制度は平成19年度（2007年度）に廃止され、現在は「全県一区」（居住地に
// 関わらずどの県立高校にも出願可能）。同時に「総合選抜制」（複数校が合同で選抜し、合格者を
// 各校へ配分する仕組み）も廃止された。
//
// 一次ソース: 岩手県「高等学校の学区見直しにおける全国都道府県の状況」資料
// (`pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/
// shiryou2_7gakkuminaoshijoukyou.pdf`・岩手県財政課調べの47都道府県横断比較表・2026-09-17
// pdftoppmで目視確認)に「H19　群馬、山梨、鳥取」と明記。二次資料（WebSearch要約・Wikipedia
// 「山梨県高等学校一覧」）でも「2007年度入試から全県一学区制が導入され、総合選抜制は廃止と
// なった」という一致した記述を確認した。
//
// ★T-Y14(学校別評価方法DB)では既にyamanashi(前期募集選抜方法等一覧)を別データとして実装済み
// だが、本レコード(T-Y15学区DB)は「学区の有無」という別の観点を扱うため重複ではない。
//
// ⚠️廃止前の学区数・名称・区割り、総合選抜制の具体的な運用(対象校・グルーピング方法)は今回
// 一次資料・二次資料とも見つけられなかった。推測で埋めず「未確認」として記録する（Y-0）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const YAMANASHI_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'yamanashi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成19年度（2007年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらずどの県立高校にも出願可能。学区廃止と同時に「総合選抜制」(複数校が合同で選抜し合格者を各校へ配分する仕組み)も廃止された。廃止前の学区数・名称・区割り、総合選抜制の対象校やグルーピング方法は今回未確認',
  source: {
    url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/059/502/shiryou2_7gakkuminaoshijoukyou.pdf',
    docTitle: '岩手県「高等学校の学区見直しにおける全国都道府県の状況」(岩手県財政課調べ・47都道府県比較表)',
    lastChecked: '2026-09-17',
  },
  note: '「総合選抜制」の廃止はWikipedia「山梨県高等学校一覧」等の二次資料でのみ確認でき、山梨県教育委員会の一次資料には到達できなかった。T-Y14で実装済みのyamanashi(前期募集選抜方法等一覧)とは別データ(学区の有無を扱うT-Y15固有のレコード)',
};
