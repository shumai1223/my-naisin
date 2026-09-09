import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 北海道 段階台帳（T-Y11F §5順序#7・28県目・全日制coverage='partial'・空知地区29レコード＋
 * 石狩地区57レコード＝86レコードで着手・全14管内中の2管内目）。
 *
 * 一次ソース: 北海道教育委員会「R8入学者選抜状況報告書 §3 学校別受検者数及び合格者数」
 * （令和8年度＝2026年度入学者選抜・全14頁・管内ごとに1頁）。
 * https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf
 *
 * ⚠️既存パイプライン`competition-rates/hokkaido.ts`が典拠とする資料と**同一PDF**（両者とも
 * このURL）。既存パイプラインはquota（募集人員）・finalApplicants（第1次出願者数）の2列のみを
 * 転記していたが、この資料は実際には「第1次受検者数」「第2次受検者数・合格者数」「入学者数」
 * 「推薦受検者数・合格者数」列も持つ表であり、段階台帳が必要とする4フィールドすべてを含む
 * ことをT-Y11F本タスクで新たに確認した。quota・applicantsConfirmedは既存パイプラインの
 * 空知地区29レコードをそのまま再利用し、testTakersConfirmed・finalPassersを新規に転記した。
 *
 * ⚠️北海道は「推薦」（募集人員の欄外に「(N)」で併記される別枠）と「一般」が完全に独立した
 * 別クオータの選抜であり（推薦落選者が一般に自動転入する秋田型の構造とは異なる）、本ファイルは
 * 一般枠（第1次・第2次）のみをスコープとし推薦枠は含めない（既存パイプラインのquota・
 * applicantsConfirmedも同じく一般枠のみを対象とする資料設計のため、スコープが一致する）。
 * testTakersConfirmed=第1次受検者数+第2次受検者数（第2次募集を実施した学科のみ加算）、
 * finalPassers=入学者数（資料本文の脚注により「第1次合格者数（入学意思のない者を除き追加合格
 * 者を加えた確定値）＋第2次合格者数」と定義される列をそのまま採用）。
 *
 * ⚠️1行（滝川西「情報マネジメント」quota120・出願93）は既存パイプラインのヘッダコメントに
 * 「検算（受検者数÷募集人員≒印字済み倍率）で数値の対応関係を特定できず見送った」と明記されて
 * おり、本ファイルも既存パイプラインに合わせて同じ理由でスコープ外とした（独自に転記して
 * 水増しすることはしない）。
 *
 * ⚠️既知の例外（5件・いずれも小差でtestTakersConfirmed>applicantsConfirmedまたは
 * finalPassers>testTakersConfirmed）: 月形「普通」・夕張「普通」・岩見沢農業「食品科学」・
 * 滝川工業「電気」の4件は第2次募集で新規に応募した受検者が第1次出願者数に含まれないため
 * testTakersConfirmedがapplicantsConfirmedを+1上回る（第2次募集は新規応募者を受け付ける
 * 制度のため構造的に発生し得る）。岩見沢緑陵「普通」1件のみ第2次募集が無いにもかかわらず
 * finalPassers(157)がtestTakersConfirmed(156)を+1上回るが、資料脚注の「追加合格者」調整に
 * よるものと推測される（Y-0につき断定はしない）。
 *
 * 北海道は14管内（空知/石狩/後志/胆振/日高/渡島/檜山/上川/留萌/宗谷/オホーツク/十勝/釧路/
 * 根室/札幌市）に分かれる大規模資料のため、既存パイプラインと同じく1管内ずつ段階的に追加する
 * 方針を継承する（coverage.status='partial'）。定時制課程は他県と同じ理由でスコープ外。
 *
 * ⚠️石狩地区追加分（57レコード）で新たに確認した例外パターン: 千歳「国際教養」（合格37>受検34）・
 * 札幌東商業「会計ビジネス」（合格80>受検74）・千歳「国際流通」（合格80>受検76）の3件は、
 * いずれも第2次募集が実施されていない（空欄）にもかかわらずfinalPassersがtestTakersConfirmedを
 * 上回る（既存の岩見沢緑陵「普通」と同型）。倍率300dpiの高解像度再確認でも同じ数値だったため
 * 誤読ではなく、資料脚注の「第1次の合格者数は、合格発表時の合格者数から入学意思のない者の数を
 * 引き、追加合格者の数を加えたもの」という調整ロジックが、受検者数を上回る規模で作用する
 * ケースがあると確認できた。野幌「普通」・当別「普通」・札幌琴似工業「電気」・当別「家政」の
 * 4件は空知と同型の第2次募集による新規応募者分（+1〜+4の小差）。
 */
export const HOKKAIDO_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'hokkaido',
  sources: [
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.9・空知地区）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.10-11・石狩地区〈道立高校のみ・市立札幌は別区分〉）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '全日制・空知地区（普通教育を主とする学科12レコード＋専門教育を主とする学科及び総合学科17レコード＝29レコード）',
      '全日制・石狩地区・道立高校のみ（普通教育を主とする学科31レコード＋専門教育を主とする学科及び総合学科26レコード＝57レコード）',
    ],
    pendingDepartments: [
      '全日制・石狩地区の市立札幌（道立高校とは別管理者のため報告書上も独立区分・8校9レコード規模）',
      '全日制・後志地区',
      '全日制・胆振地区',
      '全日制・日高地区',
      '全日制・渡島地区',
      '全日制・檜山地区',
      '全日制・上川地区',
      '全日制・留萌地区',
      '全日制・宗谷地区',
      '全日制・オホーツク地区',
      '全日制・十勝地区',
      '全日制・釧路地区',
      '全日制・根室地区',
      '滝川西「情報マネジメント」（既存パイプラインが検算不能のため見送った1行・本ファイルも同じ理由でスコープ外）',
      '定時制課程（他県と同じ理由で恒久的にスコープ外）',
    ],
    note: '全14管内のうち空知地区（29レコード）＋石狩地区・道立高校のみ（57レコード）＝86レコードに着手。quota・applicantsConfirmedは既存パイプライン`competition-rates/hokkaido.ts`の該当レコードをそのまま再利用し、testTakersConfirmed（第1次受検者数＋第2次受検者数）・finalPassers（入学者数＝第1次合格者数＋第2次合格者数）を「§3学校別受検者数及び合格者数」p.9-11から新規転記した。推薦枠は一般枠と完全に独立したクオータ（秋田のような推薦落選者の一般転入は無い）のためスコープ外。既知の例外10件（第2次募集による新規応募者分でtestTakersConfirmedがapplicantsConfirmedを上回る7件、追加合格者と推測されるfinalPassers>testTakersConfirmed3件）はいずれも小差（最大+6）。市立札幌（8校）は道立高校とは別管理者で報告書上も独立区分のため次回以降に別途追加する。本資料はさらに12管内分（全260レコード規模）を残しており、既存パイプラインと同じく1管内ずつ段階的に追加する。',
  },
  records: [
    { schoolName: '岩見沢東', department: '普通', quota: 160, applicantsConfirmed: 134, testTakersConfirmed: 130, finalPassers: 128 },
    { schoolName: '岩見沢東', department: '文理探究', quota: 80, applicantsConfirmed: 79, testTakersConfirmed: 77, finalPassers: 74 },
    { schoolName: '月形', department: '普通', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '夕張', department: '普通', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '長沼', department: '普通', quota: 80, applicantsConfirmed: 35, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '栗山', department: '普通', quota: 80, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '岩見沢緑陵', department: '普通', quota: 160, applicantsConfirmed: 161, testTakersConfirmed: 156, finalPassers: 157 },
    { schoolName: '滝川', department: '普通', quota: 160, applicantsConfirmed: 168, testTakersConfirmed: 162, finalPassers: 160 },
    { schoolName: '砂川', department: '普通', quota: 80, applicantsConfirmed: 70, testTakersConfirmed: 70, finalPassers: 70 },
    { schoolName: '芦別', department: '普通', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '深川西', department: '普通', quota: 80, applicantsConfirmed: 53, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '滝川西', department: '普通', quota: 120, applicantsConfirmed: 126, testTakersConfirmed: 122, finalPassers: 120 },
    { schoolName: '滝川', department: '理数', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '岩見沢農業', department: '酪農科学', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '岩見沢農業', department: '畜産科学', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '岩見沢農業', department: '食品科学', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '岩見沢農業', department: '農業土木工学', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '岩見沢農業', department: '環境造園科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '岩見沢農業', department: '森林科学科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '岩見沢農業', department: '生活科学', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '深川東', department: '生産科学', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '新十津川農業', department: '農業・生活', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '滝川工業', department: '電子機械', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '滝川工業', department: '電気', quota: 40, applicantsConfirmed: 8, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '岩見沢緑陵', department: 'みらい設計', quota: 80, applicantsConfirmed: 84, testTakersConfirmed: 83, finalPassers: 80 },
    { schoolName: '三笠', department: '調理師', quota: 20, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 20 },
    { schoolName: '三笠', department: '製菓', quota: 20, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 20 },
    { schoolName: '美唄聖華', department: '衛生看護', quota: 80, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 44 },
    { schoolName: '美唄尚栄', department: '総合', quota: 80, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 36 },
    { schoolName: '札幌東', department: '普通', quota: 320, applicantsConfirmed: 416, testTakersConfirmed: 409, finalPassers: 320 },
    { schoolName: '札幌西', department: '普通', quota: 320, applicantsConfirmed: 454, testTakersConfirmed: 448, finalPassers: 320 },
    { schoolName: '札幌南', department: '普通', quota: 320, applicantsConfirmed: 412, testTakersConfirmed: 409, finalPassers: 320 },
    { schoolName: '札幌北', department: '普通', quota: 320, applicantsConfirmed: 391, testTakersConfirmed: 390, finalPassers: 320 },
    { schoolName: '札幌月寒', department: '普通', quota: 320, applicantsConfirmed: 414, testTakersConfirmed: 392, finalPassers: 320 },
    { schoolName: '札幌啓成', department: '普通', quota: 280, applicantsConfirmed: 317, testTakersConfirmed: 295, finalPassers: 280 },
    { schoolName: '札幌北陵', department: '普通', quota: 320, applicantsConfirmed: 364, testTakersConfirmed: 341, finalPassers: 320 },
    { schoolName: '札幌手稲', department: '普通', quota: 320, applicantsConfirmed: 340, testTakersConfirmed: 333, finalPassers: 315 },
    { schoolName: '札幌丘珠', department: '普通', quota: 280, applicantsConfirmed: 235, testTakersConfirmed: 229, finalPassers: 213 },
    { schoolName: '札幌西陵', department: '普通', quota: 240, applicantsConfirmed: 194, testTakersConfirmed: 188, finalPassers: 174 },
    { schoolName: '札幌白石', department: '普通', quota: 280, applicantsConfirmed: 360, testTakersConfirmed: 340, finalPassers: 280 },
    { schoolName: '札幌東陵', department: '普通', quota: 280, applicantsConfirmed: 329, testTakersConfirmed: 297, finalPassers: 279 },
    { schoolName: '札幌南陵', department: '普通', quota: 80, applicantsConfirmed: 64, testTakersConfirmed: 59, finalPassers: 52 },
    { schoolName: '札幌東豊', department: '普通', quota: 80, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 63 },
    { schoolName: '札幌真栄', department: '普通', quota: 200, applicantsConfirmed: 162, testTakersConfirmed: 154, finalPassers: 148 },
    { schoolName: '札幌あすかぜ', department: '普通', quota: 80, applicantsConfirmed: 59, testTakersConfirmed: 56, finalPassers: 53 },
    { schoolName: '札幌稲雲', department: '普通', quota: 280, applicantsConfirmed: 313, testTakersConfirmed: 284, finalPassers: 250 },
    { schoolName: '札幌英藍', department: '普通', quota: 280, applicantsConfirmed: 261, testTakersConfirmed: 246, finalPassers: 230 },
    { schoolName: '札幌平岡', department: '普通', quota: 240, applicantsConfirmed: 315, testTakersConfirmed: 289, finalPassers: 240 },
    { schoolName: '札幌白陵', department: '普通', quota: 80, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 37 },
    { schoolName: '札幌国際情報', department: '普通', quota: 80, applicantsConfirmed: 118, testTakersConfirmed: 115, finalPassers: 80 },
    { schoolName: '江別', department: '普通', quota: 200, applicantsConfirmed: 225, testTakersConfirmed: 218, finalPassers: 200 },
    { schoolName: '野幌', department: '普通', quota: 120, applicantsConfirmed: 68, testTakersConfirmed: 72, finalPassers: 70 },
    { schoolName: '大麻', department: '普通', quota: 280, applicantsConfirmed: 274, testTakersConfirmed: 264, finalPassers: 247 },
    { schoolName: '千歳', department: '普通', quota: 200, applicantsConfirmed: 254, testTakersConfirmed: 222, finalPassers: 200 },
    { schoolName: '北広島', department: '普通', quota: 280, applicantsConfirmed: 317, testTakersConfirmed: 294, finalPassers: 280 },
    { schoolName: '北広島西', department: '普通', quota: 160, applicantsConfirmed: 88, testTakersConfirmed: 86, finalPassers: 80 },
    { schoolName: '石狩南', department: '普通', quota: 280, applicantsConfirmed: 319, testTakersConfirmed: 303, finalPassers: 271 },
    { schoolName: '当別', department: '普通', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '恵庭南', department: '普通', quota: 200, applicantsConfirmed: 130, testTakersConfirmed: 128, finalPassers: 127 },
    { schoolName: '恵庭北', department: '普通', quota: 240, applicantsConfirmed: 204, testTakersConfirmed: 188, finalPassers: 186 },
    { schoolName: '札幌啓成', department: '理数', quota: 40, applicantsConfirmed: 69, testTakersConfirmed: 63, finalPassers: 40 },
    { schoolName: '恵庭南', department: '体育', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 72, finalPassers: 71 },
    { schoolName: '札幌国際情報', department: '国際文化', quota: 80, applicantsConfirmed: 95, testTakersConfirmed: 91, finalPassers: 80 },
    { schoolName: '千歳', department: '国際教養', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 34, finalPassers: 37 },
    { schoolName: '当別', department: '園芸デザイン', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 22 },
    { schoolName: '札幌工業', department: '機械', quota: 80, applicantsConfirmed: 87, testTakersConfirmed: 84, finalPassers: 78 },
    { schoolName: '札幌工業', department: '電気', quota: 80, applicantsConfirmed: 86, testTakersConfirmed: 83, finalPassers: 80 },
    { schoolName: '札幌工業', department: '建築', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 74, finalPassers: 72 },
    { schoolName: '札幌工業', department: '土木', quota: 80, applicantsConfirmed: 58, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: '札幌琴似工業', department: '電子機械', quota: 80, applicantsConfirmed: 83, testTakersConfirmed: 81, finalPassers: 80 },
    { schoolName: '札幌琴似工業', department: '電気', quota: 80, applicantsConfirmed: 72, testTakersConfirmed: 73, finalPassers: 71 },
    { schoolName: '札幌琴似工業', department: '情報技術', quota: 80, applicantsConfirmed: 67, testTakersConfirmed: 64, finalPassers: 61 },
    { schoolName: '札幌琴似工業', department: '環境化学', quota: 80, applicantsConfirmed: 57, testTakersConfirmed: 56, finalPassers: 56 },
    { schoolName: '札幌国際情報', department: '理数工学', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '札幌東商業', department: '流通経済', quota: 80, applicantsConfirmed: 102, testTakersConfirmed: 98, finalPassers: 80 },
    { schoolName: '札幌東商業', department: '国際経済', quota: 80, applicantsConfirmed: 89, testTakersConfirmed: 85, finalPassers: 80 },
    { schoolName: '札幌東商業', department: '会計ビジネス', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 74, finalPassers: 80 },
    { schoolName: '札幌東商業', department: '情報処理', quota: 80, applicantsConfirmed: 94, testTakersConfirmed: 90, finalPassers: 80 },
    { schoolName: '札幌国際情報', department: 'グローバルビジネス', quota: 120, applicantsConfirmed: 137, testTakersConfirmed: 134, finalPassers: 120 },
    { schoolName: '江別', department: '事務情報', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '千歳', department: '国際流通', quota: 80, applicantsConfirmed: 83, testTakersConfirmed: 76, finalPassers: 80 },
    { schoolName: '江別', department: '生活デザイン', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '当別', department: '家政', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '石狩翔陽', department: '総合', quota: 320, applicantsConfirmed: 348, testTakersConfirmed: 337, finalPassers: 320 },
    { schoolName: '札幌厚別', department: '総合', quota: 280, applicantsConfirmed: 293, testTakersConfirmed: 280, finalPassers: 270 },
    { schoolName: '千歳北陽', department: '総合', quota: 160, applicantsConfirmed: 121, testTakersConfirmed: 119, finalPassers: 115 },
  ],
};
