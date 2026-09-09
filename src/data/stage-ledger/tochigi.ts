import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 栃木県 段階台帳（T-Y11F §5順序#7・3県目・全3頁を完全収録・全日制県立107レコード）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度県立高等学校入学者選抜一般選抜出願・合格
 * 状況（全日制課程）」（全3頁）の1頁目（宇都宮〜小山西・22校39レコード）＋2頁目（小山北桜〜
 * 真岡北陵・19校36レコード）＋3頁目（真岡工業〜さくら清修・17校32レコード）。
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
 *
 * 🔁2頁目追加（小山北桜〜真岡北陵・19校36レコード）: quotaは既存パイプラインと36件すべて
 * 完全一致（1頁目と合わせ計75件）。applicantsConfirmedは1頁目と同型の「本資料≤パイプライン」
 * ドリフトが6件で発生（小山城南170(pipeline171)・栃木翔南164(166)・足利南71(72)・
 * 足利工業機械32(33)・足利清風普通44(45)・真岡140(141)）。累計13件/75件（17%）で
 * ドリフトを確認、いずれも1〜2名以内かつ方向は一貫して本資料が少ない側——1頁目の仮説
 * （試験当日までの志願取消）を再現性をもって裏付けた。栃木農業がR8で2学科（農業科学・
 * 食品科学）に統合済みであることも既存パイプラインの記述どおり確認できた。
 *
 * 🔁3頁目追加（真岡工業〜さくら清修・17校32レコード）＝**これで全3頁107レコードが完結・
 * 既存パイプライン冒頭コメントの「57校107レコード」と完全一致**。quotaは既存パイプラインと
 * 32件すべて完全一致（3頁とも計107件）。applicantsConfirmedのドリフトはこの頁では1件のみ
 * （那須清峰機械システム23(pipeline25)）で累計14件/107件（13%）。**3頁目末尾に本資料
 * 自体の「合計」行**（募集定員10,405/特色選抜内定者数2,854/A海外内定者数25/一般選抜定員
 * 7,259/最終出願人員7,585/受検人員7,566/合格計6,586）が印字されており、107レコード全数の
 * 機械集計がquota7,259・applicantsConfirmed7,585・testTakersConfirmed7,566・
 * finalPassers6,586の4系列すべてと一発で完全一致した——個別レコードの既存パイプライン
 * 突合とは独立した、資料自体からの最上位検算にも一度も外れることなく到達でき、栃木県
 * 「全日制県立」107レコードに収録漏れ・重複が一件も無いことを証明できた。既存パイプライン
 * 自体の合計（一般選抜定員7,259・出願人員7,602）とはapplicantsConfirmedの合計だけが
 * 7,585 vs 7,602で17名差となり、14件のドリフト（1〜2名ずつ）の累積と整合する。
 */

export const TOCHIGI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'tochigi',
  sources: [
    {
      url: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippannsenbatsusyutugangoukakujokyo.pdf',
      docTitle: '栃木県教育委員会 令和8（2026）年度県立高等学校入学者選抜一般選抜出願・合格状況（全日制課程）全3頁（宇都宮〜さくら清修）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '全日制県立（1頁目・宇都宮〜小山西・22校39レコード）',
      '全日制県立（2頁目・小山北桜〜真岡北陵・19校36レコード）',
      '全日制県立（3頁目・真岡工業〜さくら清修・17校32レコード）',
    ],
    pendingDepartments: [],
    note: '全3頁（学校番号1〜58のうち宇都宮東を除く57校・107レコード）を完全収録し既存パイプラインの「57校107レコード」と件数が完全一致。quotaは既存competition-rates/tochigi.tsと全107件で完全一致（一般選抜定員は試験日まで不変であることを確認）。applicantsConfirmedは本資料（3月試験後）が既存パイプライン（2月25日時点）以下になることがある（107件中14件で1〜2名の志願取消による減少を確認・全件が本資料≤パイプラインの方向）。3頁目末尾の「合計」行（quota7,259/applicants7,585/testTakers7,566/final6,586）と107レコード全数の機械集計が4系列とも完全一致。宇都宮東（一般選抜非実施）は既存パイプラインと同じ理由で対象外。',
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
    // --- 2頁目（学校番号23〜41） ---
    { schoolName: '小山北桜', department: '食料環境', quota: 26, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 20 },
    { schoolName: '小山北桜', department: '建築システム', quota: 28, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '小山北桜', department: '総合ビジネス', quota: 29, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '小山北桜', department: '生活文化', quota: 26, applicantsConfirmed: 36, testTakersConfirmed: 34, finalPassers: 26 },
    { schoolName: '小山城南', department: '総合学科', quota: 129, applicantsConfirmed: 170, testTakersConfirmed: 170, finalPassers: 129 },
    { schoolName: '栃木', department: '普通', quota: 180, applicantsConfirmed: 168, testTakersConfirmed: 168, finalPassers: 168 },
    { schoolName: '栃木女子', department: '普通', quota: 180, applicantsConfirmed: 187, testTakersConfirmed: 187, finalPassers: 180 },
    { schoolName: '栃木農業', department: '農業科学', quota: 26, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 26 },
    { schoolName: '栃木農業', department: '食品科学', quota: 26, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 26 },
    { schoolName: '栃木工業', department: '機械', quota: 26, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 26 },
    { schoolName: '栃木工業', department: '電気', quota: 26, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 26 },
    { schoolName: '栃木工業', department: '電子情報', quota: 26, applicantsConfirmed: 23, testTakersConfirmed: 22, finalPassers: 26 },
    { schoolName: '栃木商業', department: '商業', quota: 52, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 47 },
    { schoolName: '栃木商業', department: '情報処理', quota: 29, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '栃木翔南', department: '普通', quota: 150, applicantsConfirmed: 164, testTakersConfirmed: 164, finalPassers: 150 },
    { schoolName: '壬生', department: '普通', quota: 114, applicantsConfirmed: 105, testTakersConfirmed: 105, finalPassers: 105 },
    { schoolName: '佐野', department: '普通', quota: 45, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '佐野東', department: '普通', quota: 160, applicantsConfirmed: 154, testTakersConfirmed: 154, finalPassers: 154 },
    { schoolName: '佐野松桜', department: '情報制御', quota: 26, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 26 },
    { schoolName: '佐野松桜', department: '商業', quota: 26, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '佐野松桜', department: '家政', quota: 26, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '佐野松桜', department: '介護福祉', quota: 20, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '足利', department: '普通', quota: 179, applicantsConfirmed: 215, testTakersConfirmed: 215, finalPassers: 179 },
    { schoolName: '足利南', department: '総合学科', quota: 114, applicantsConfirmed: 71, testTakersConfirmed: 71, finalPassers: 70 },
    { schoolName: '足利工業', department: '機械', quota: 56, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 31 },
    { schoolName: '足利工業', department: '電気システム', quota: 35, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '足利工業', department: '産業デザイン', quota: 27, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '足利清風', department: '普通', quota: 52, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 43 },
    { schoolName: '足利清風', department: '商業', quota: 52, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '真岡', department: '普通', quota: 130, applicantsConfirmed: 140, testTakersConfirmed: 140, finalPassers: 130 },
    { schoolName: '真岡女子', department: '普通', quota: 150, applicantsConfirmed: 119, testTakersConfirmed: 119, finalPassers: 119 },
    { schoolName: '真岡北陵', department: '生物生産', quota: 27, applicantsConfirmed: 18, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '真岡北陵', department: '農業機械', quota: 30, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 16 },
    { schoolName: '真岡北陵', department: '食品科学', quota: 26, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '真岡北陵', department: '総合ビジネス', quota: 13, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '真岡北陵', department: '介護福祉', quota: 13, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    // --- 3頁目（学校番号42〜58） ---
    { schoolName: '真岡工業', department: '機械システム', quota: 26, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '真岡工業', department: '建設', quota: 26, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 21 },
    { schoolName: '真岡工業', department: '電子', quota: 29, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '益子芳星', department: '普通', quota: 78, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 47 },
    { schoolName: '茂木', department: '総合学科', quota: 104, applicantsConfirmed: 104, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '烏山', department: '普通', quota: 104, applicantsConfirmed: 84, testTakersConfirmed: 84, finalPassers: 84 },
    { schoolName: '馬頭', department: '普通', quota: 36, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '馬頭', department: '水産', quota: 17, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '大田原', department: '普通', quota: 150, applicantsConfirmed: 147, testTakersConfirmed: 147, finalPassers: 147 },
    { schoolName: '大田原女子', department: '普通', quota: 150, applicantsConfirmed: 146, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '黒羽', department: '普通', quota: 58, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 54 },
    { schoolName: '那須拓陽', department: '普通', quota: 52, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 49 },
    { schoolName: '那須拓陽', department: '農業経営', quota: 26, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 25 },
    { schoolName: '那須拓陽', department: '生物工学', quota: 26, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 26 },
    { schoolName: '那須拓陽', department: '食品化学', quota: 26, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 26 },
    { schoolName: '那須拓陽', department: '食物文化', quota: 26, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '那須清峰', department: '機械システム', quota: 26, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '那須清峰', department: '電気情報', quota: 26, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '那須清峰', department: '建設工学', quota: 26, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '那須清峰', department: '商業', quota: 28, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '那須', department: '普通', quota: 31, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '那須', department: 'リゾート観光', quota: 27, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '黒磯', department: '普通', quota: 104, applicantsConfirmed: 104, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '黒磯南', department: '総合学科', quota: 104, applicantsConfirmed: 110, testTakersConfirmed: 110, finalPassers: 104 },
    { schoolName: '矢板', department: '農業経営', quota: 26, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '矢板', department: '工業システム', quota: 28, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '矢板', department: '栄養食物', quota: 26, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '矢板', department: '介護福祉', quota: 22, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '矢板東', department: '普通', quota: 69, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '高根沢', department: '普通', quota: 56, applicantsConfirmed: 22, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '高根沢', department: '商業', quota: 64, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: 'さくら清修', department: '総合学科', quota: 130, applicantsConfirmed: 159, testTakersConfirmed: 159, finalPassers: 130 },
  ],
  officialSubtotals: [
    // 3頁目末尾の資料全体「合計」行。
    { label: '合計', quota: 7_259, applicantsConfirmed: 7_585, testTakersConfirmed: 7_566, finalPassers: 6_586 },
  ],
};
