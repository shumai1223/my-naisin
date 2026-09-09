import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 栃木県 段階台帳（T-Y11F §5順序#7・3県目・1頁目のみ・全日制県立39レコード）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度県立高等学校入学者選抜一般選抜出願・合格
 * 状況（全日制課程）」（全3頁）の1頁目（宇都宮〜小山西・22校39レコード）。
 * https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippannsenbatsusyutugangoukakujokyo.pdf
 *
 * ⚠️既存の`competition-rates/tochigi.ts`（倍率パイプライン）は**別の一次資料**（「出願変更状況」・
 * 2月25日変更後確定値のPDF）を採用しており、本ファイルが使う「出願・合格状況」PDF（3月・試験後の
 * 最終結果）とは意図的に別物として区別されている（既存ファイル冒頭コメント参照:
 * 「③は『合格倍率』という別定義の列を持つため使用しない」）。列構成は[募集定員/特色選抜内定者数/
 * A海外特別選抜内定者数/一般選抜定員/最終出願人員/受検人員/合格人員(第1志望+2,3志望=計)/
 * 合格倍率/前年合格倍率]で、quota=一般選抜定員・applicantsConfirmed=最終出願人員・
 * testTakersConfirmed=受検人員・finalPassers=合格人員計を採用した。
 *
 * quota（一般選抜定員＝募集定員－特色選抜内定者数－Ａ海外特別選抜内定者数）は出願変更状況PDFの
 * 時点で確定し試験日まで変わらないため、既存パイプラインのquotaと全39件で完全一致することを
 * 確認済み。一方applicantsConfirmed（最終出願人員）は本資料が試験当日直前の実測値であるのに対し
 * 既存パイプラインは2月25日時点の値のため、**試験当日までの志願取消により既存パイプライン以下
 * （同値または1〜2名少ない）になることがある**（39件中7件で確認: 宇都宮南216(pipeline217)・
 * 宇都宮清陵127(128)・宇都宮女子298(299)・宇都宮白楊食品科学58(59)・宇都宮工業機械
 * システム102(103)・宇都宮商業商業167(169)・小山南スポーツ40(41)。全件が「本資料≤
 * パイプライン」の方向で一致しており、転記ミスではなく資料の公表時点差による実際の差と
 * 判断・300dpiビジョン解析で再クロップ確認済み）。
 *
 * 宇都宮東は一般選抜定員0（特色選抜＋Ａ海外特別選抜のみで定員充足・一般選抜非実施）のため既存
 * パイプラインと同じ理由でレコードとして採用しない（quota>0の不変条件を維持）。
 */

export const TOCHIGI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'tochigi',
  sources: [
    {
      url: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippannsenbatsusyutugangoukakujokyo.pdf',
      docTitle: '栃木県教育委員会 令和8（2026）年度県立高等学校入学者選抜一般選抜出願・合格状況（全日制課程）1頁目（宇都宮〜小山西）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制県立（1頁目のみ・宇都宮〜小山西・22校39レコード）'],
    pendingDepartments: ['2〜3頁目の残り学校'],
    note: '1頁目（22校39レコード）のみのパイロット。quotaは既存competition-rates/tochigi.tsと全39件で完全一致（同一の一般選抜定員が試験日まで不変であることを確認）。applicantsConfirmedは本資料（3月試験後）が既存パイプライン（2月25日時点）以下になることがある（39件中7件で1〜2名の志願取消による減少を確認・全件が本資料≤パイプラインの方向）。宇都宮東（一般選抜非実施）は既存パイプラインと同じ理由で対象外。',
  },
  records: [
    { schoolName: '宇都宮', department: '普通', quota: 255, applicantsConfirmed: 308, testTakersConfirmed: 308, finalPassers: 255 },
    { schoolName: '宇都宮南', department: '普通', quota: 185, applicantsConfirmed: 216, testTakersConfirmed: 215, finalPassers: 185 },
    { schoolName: '宇都宮北', department: '普通', quota: 270, applicantsConfirmed: 420, testTakersConfirmed: 419, finalPassers: 271 },
    { schoolName: '宇都宮清陵', department: '普通', quota: 128, applicantsConfirmed: 127, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '宇都宮女子', department: '普通', quota: 250, applicantsConfirmed: 298, testTakersConfirmed: 298, finalPassers: 250 },
    { schoolName: '宇都宮中央', department: '普通', quota: 203, applicantsConfirmed: 326, testTakersConfirmed: 324, finalPassers: 204 },
    { schoolName: '宇都宮中央', department: '総合家庭', quota: 31, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 31 },
    { schoolName: '宇都宮白楊', department: '農業経営', quota: 27, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 28 },
    { schoolName: '宇都宮白楊', department: '生物工学', quota: 28, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 28 },
    { schoolName: '宇都宮白楊', department: '食品科学', quota: 26, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 27 },
    { schoolName: '宇都宮白楊', department: '農業工学', quota: 28, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 29 },
    { schoolName: '宇都宮白楊', department: '情報技術', quota: 26, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 27 },
    { schoolName: '宇都宮白楊', department: '流通経済', quota: 26, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 27 },
    { schoolName: '宇都宮白楊', department: '服飾デザイン', quota: 26, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 26 },
    { schoolName: '宇都宮工業', department: '機械システム', quota: 78, applicantsConfirmed: 102, testTakersConfirmed: 102, finalPassers: 78 },
    { schoolName: '宇都宮工業', department: '電気情報システム', quota: 52, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 52 },
    { schoolName: '宇都宮工業', department: '建築デザイン', quota: 26, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 26 },
    { schoolName: '宇都宮工業', department: '環境建設システム', quota: 52, applicantsConfirmed: 80, testTakersConfirmed: 79, finalPassers: 53 },
    { schoolName: '宇都宮商業', department: '商業', quota: 128, applicantsConfirmed: 167, testTakersConfirmed: 167, finalPassers: 128 },
    { schoolName: '宇都宮商業', department: '情報処理', quota: 55, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 55 },
    { schoolName: '鹿沼', department: '普通', quota: 150, applicantsConfirmed: 184, testTakersConfirmed: 184, finalPassers: 150 },
    { schoolName: '鹿沼東', department: '普通', quota: 104, applicantsConfirmed: 116, testTakersConfirmed: 115, finalPassers: 104 },
    { schoolName: '鹿沼南', department: '食料生産', quota: 29, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '鹿沼南', department: '環境緑地', quota: 31, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '鹿沼南', department: 'ライフデザイン', quota: 27, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 27 },
    { schoolName: '鹿沼商工', department: '情報科学', quota: 30, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 30 },
    { schoolName: '鹿沼商工', department: '商業', quota: 52, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '今市', department: '総合学科', quota: 105, applicantsConfirmed: 98, testTakersConfirmed: 98, finalPassers: 98 },
    { schoolName: '今市工業', department: '機械', quota: 31, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '今市工業', department: '電気', quota: 35, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '今市工業', department: '建設工学', quota: 35, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '日光明峰', department: '普通', quota: 60, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '上三川', department: '普通', quota: 120, applicantsConfirmed: 117, testTakersConfirmed: 117, finalPassers: 117 },
    { schoolName: '石橋', department: '普通', quota: 179, applicantsConfirmed: 254, testTakersConfirmed: 254, finalPassers: 179 },
    { schoolName: '小山', department: '普通', quota: 90, applicantsConfirmed: 97, testTakersConfirmed: 97, finalPassers: 90 },
    { schoolName: '小山', department: '数理科学', quota: 30, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 30 },
    { schoolName: '小山南', department: '普通', quota: 58, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 58 },
    { schoolName: '小山南', department: 'スポーツ', quota: 36, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 36 },
    { schoolName: '小山西', department: '普通', quota: 150, applicantsConfirmed: 169, testTakersConfirmed: 169, finalPassers: 150 },
  ],
};
