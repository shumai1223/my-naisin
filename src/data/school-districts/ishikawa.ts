// 石川県: 県立高校の学区制度は平成17年度（2005年度）に廃止され、現在は「全県一区」（居住地に
// 関わらず県内全域の県立高校に出願可能）。
//
// 一次ソース: 石川県公式サイト「公立高等学校への入学は」ページ
// (`pref.ishikawa.lg.jp/kyoiku/gakkou/k-gakkou/gakkoushidou_02.html`・2026-09-17 WebFetchで
// 確認)に「平成17年度より通学区域の制限が廃止され、すべての学校・学科について、県内全域から
// 入学することができます。」と明記されている。県教委公式サイトによる一次資料での確認であり、
// 岩手県比較資料（H17）とも一致する。
//
// ⚠️廃止前の3学区（第1学区=加賀地区、第2学区=金沢地区、第3学区=能登地区、との複数の二次資料
// による記述あり）は、今回一次資料上でこの区割りの明記を確認できなかった。推測で埋めず「二次
// 資料による記述」であることを明示して記録する（Y-0）。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const ISHIKAWA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'ishikawa',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'abolished',
  abolishedFiscalYear: '平成17年度（2005年度）',
  outOfDistrictCondition:
    '学区制度自体が無いため、現在は居住地に関わらず県内全域の県立高校に出願可能(すべての学校・学科が対象)。廃止前は3学区制(第1学区=加賀地区、第2学区=金沢地区、第3学区=能登地区)だったとする複数の二次資料があるが、この区割りの一次資料での明記は今回確認できなかった',
  source: {
    url: 'https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/k-gakkou/gakkoushidou_02.html',
    docTitle: '石川県公式サイト「公立高等学校への入学は」',
    lastChecked: '2026-09-17',
  },
  note: '県教委公式サイトの一次資料で平成17年度廃止を直接確認済み(岩手県比較資料のH17推定とも整合)。廃止前の3学区(加賀/金沢/能登)の区割りは二次資料のみで一次資料未確認のまま記録',
};
