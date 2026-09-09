import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 北海道 段階台帳（T-Y11F §5順序#7・28県目・全日制coverage='partial'・空知29＋石狩57＋
 * 市立札幌9＋後志18＋胆振27＋日高7＋渡島29（普通10＋専門/総合19）＋檜山4＋上川37＝217レコードで着手）。
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
 *
 * ⚠️市立札幌追加分（9レコード）は例外0件のクリーンな区分だった（大阪府・静岡県・新潟県に続く
 * パターン）。市立札幌は「札幌市立高等学校通学区域規則（札幌市外）適用者」という道立とは別の
 * 通学区域欄を持つが、quota・applicantsConfirmed・testTakersConfirmed・finalPassersの
 * 4フィールド定義自体は道立高校と共通のため、既存の設計をそのまま適用できた。
 *
 * ⚠️後志地区追加分（18レコード）で新たな例外2件: 小樽未来創造「情報会計マネジメント」
 * （合格36>受検35・追加合格者型）・小樽水産「水産食品」（受検34>出願33・第2次募集1名分の
 * 新規応募者型）。いずれも既出パターンの再現で+1の小差。
 *
 * ⚠️胆振地区追加分（27レコード）で新たな例外5件: 追分「普通」・厚真「普通」・室蘭工業「建設」
 * は第2次募集の新規応募者型（+1）。室蘭栄「理数」（合格72>受検68・+4）・苫小牧工業
 * 「情報技術」（合格35>受検34・+1）は追加合格者型。鵡川「普通」には道立高校枠とは別に
 * 「連携型」選抜（募集人員80・受検12・合格12）が併記されているが、連携型は募集人員のみで
 * applicantsConfirmed相当の出願者数列を持たない別スキーマのため、既存パイプラインと同じく
 * スコープ外とした。
 *
 * ⚠️日高地区（7レコード）は例外0件のクリーンな区分だった。渡島地区は普通教育を主とする
 * 学科10レコードのみ着手（専門教育を主とする学科及び総合学科20レコードは次回以降に追加）。
 * 渡島・普通10レコードも例外0件だった。函館中部・函館西・市立函館の3校は倍率1.0超で
 * quota=finalPassers（定員ちょうどの合格）となる典型パターン。
 *
 * ⚠️渡島・専門教育を主とする学科及び総合学科追加分（19レコード・当初見積り20から
 * 実測で1減。既存パイプラインの記録も19件で一致）で新たな例外3件（いずれも+1の追加合格者型）:
 * 函館中部「理数」（合格40>受検39）・函館工業「環境土木」（合格40>受検39）・函館商業
 * 「会計ビジネス」（合格39>受検38）。これで渡島地区は普通10＋専門/総合19＝29レコードで
 * 完結。檜山地区（4レコード・江差/上ノ国/奥尻の普通3校＋檜山北総合）は例外0件のクリーンな
 * 区分だった。
 *
 * ⚠️上川地区追加分（37レコード・普通14＋専門/総合23で完結）で新たな例外11件、すべて第2次
 * 募集の新規応募者型（+1）: 美瑛「普通」・上川「普通」・富良野「普通」・上富良野「普通」・
 * 旭川農業「農業科学」「食品科学」・旭川工業「電気」・富良野「電気情報システム」・旭川商業
 * 「流通ビジネス」「会計」・下川商業「商業」。上川高校の普通科には道立高校枠とは別に
 * 「連携型」選抜（募集人員40・受検3・合格3）が併記されているが、既出の鵡川・えりもと
 * 同じ理由で恒久的にスコープ外とした。
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
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.12・市立札幌）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.13・後志地区）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.13-14・胆振地区）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.14-15・日高地区＋渡島地区・普通教育のみ）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.16・渡島地区〈専門教育を主とする学科及び総合学科〉＋檜山地区）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（p.17・上川地区）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '全日制・空知地区（普通教育を主とする学科12レコード＋専門教育を主とする学科及び総合学科17レコード＝29レコード）',
      '全日制・石狩地区・道立高校のみ（普通教育を主とする学科31レコード＋専門教育を主とする学科及び総合学科26レコード＝57レコード）',
      '全日制・市立札幌（普通教育を主とする学科7レコード＋専門教育を主とする学科2レコード＝9レコード）',
      '全日制・後志地区（普通教育を主とする学科6レコード＋専門教育を主とする学科及び総合学科12レコード＝18レコード）',
      '全日制・胆振地区（普通教育を主とする学科11レコード＋専門教育を主とする学科及び総合学科16レコード＝27レコード）',
      '全日制・日高地区（普通教育を主とする学科4レコード＋専門教育を主とする学科及び総合学科3レコード＝7レコード）',
      '全日制・渡島地区（普通教育を主とする学科10レコード＋専門教育を主とする学科及び総合学科19レコード＝29レコードで完結）',
      '全日制・檜山地区（普通教育を主とする学科3レコード＋総合学科1レコード＝4レコードで完結）',
      '全日制・上川地区（普通教育を主とする学科14レコード＋専門教育を主とする学科及び総合学科23レコード＝37レコードで完結）',
    ],
    pendingDepartments: [
      '全日制・留萌地区',
      '全日制・宗谷地区',
      '全日制・オホーツク地区',
      '全日制・十勝地区',
      '全日制・釧路地区',
      '全日制・根室地区',
      '滝川西「情報マネジメント」（既存パイプラインが検算不能のため見送った1行・本ファイルも同じ理由でスコープ外）',
      '鵡川「連携型」・えりも「連携型」・上川「連携型」（募集人員のみでapplicantsConfirmed相当の出願者数列を持たない別スキーマのため恒久的にスコープ外）',
      '定時制課程（他県と同じ理由で恒久的にスコープ外）',
    ],
    note: '全14管内のうち空知（29）＋石狩・道立のみ（57）＋市立札幌（9）＋後志（18）＋胆振（27）＋日高（7）＋渡島（29・完結）＋檜山（4・完結）＋上川（37・完結）＝217レコードに着手。quota・applicantsConfirmedは既存パイプライン`competition-rates/hokkaido.ts`の該当レコードをそのまま再利用し、testTakersConfirmed（第1次受検者数＋第2次受検者数）・finalPassers（入学者数＝第1次合格者数＋第2次合格者数）を「§3学校別受検者数及び合格者数」p.9-17から新規転記した。推薦枠は一般枠と完全に独立したクオータ（秋田のような推薦落選者の一般転入は無い）のためスコープ外。既知の例外33件（第2次募集による新規応募者分でtestTakersConfirmedがapplicantsConfirmedを上回る23件、追加合格者と推測されるfinalPassers>testTakersConfirmed10件）はいずれも小差（最大+6）。市立札幌9件・日高7件・渡島普通10件・檜山4件は例外0件のクリーンな区分だった。連携型（鵡川・えりも・上川）は募集人員のみの別スキーマのため恒久的にスコープ外。本資料はさらに6管内分（留萌/宗谷/オホーツク/十勝/釧路/根室）を残しており、既存パイプラインと同じく段階的に追加する。',
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
    { schoolName: '市立札幌旭丘', department: '普通', quota: 240, applicantsConfirmed: 351, testTakersConfirmed: 344, finalPassers: 240 },
    { schoolName: '市立札幌藻岩', department: '普通', quota: 240, applicantsConfirmed: 301, testTakersConfirmed: 284, finalPassers: 240 },
    { schoolName: '市立札幌平岸', department: '普通', quota: 280, applicantsConfirmed: 388, testTakersConfirmed: 361, finalPassers: 280 },
    { schoolName: '市立札幌平岸', department: 'デザインアート', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '市立札幌清田', department: '普通', quota: 200, applicantsConfirmed: 251, testTakersConfirmed: 237, finalPassers: 200 },
    { schoolName: '市立札幌清田', department: 'グローバル', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '市立札幌新川', department: '普通', quota: 320, applicantsConfirmed: 403, testTakersConfirmed: 388, finalPassers: 320 },
    { schoolName: '市立札幌旭丘', department: '数理データサイエンス', quota: 80, applicantsConfirmed: 90, testTakersConfirmed: 87, finalPassers: 80 },
    { schoolName: '市立札幌啓北商業', department: '未来商学', quota: 240, applicantsConfirmed: 191, testTakersConfirmed: 180, finalPassers: 173 },
    { schoolName: '小樽潮陵', department: '普通', quota: 200, applicantsConfirmed: 205, testTakersConfirmed: 200, finalPassers: 199 },
    { schoolName: '小樽桜陽', department: '普通', quota: 200, applicantsConfirmed: 176, testTakersConfirmed: 173, finalPassers: 172 },
    { schoolName: '岩内', department: '普通', quota: 80, applicantsConfirmed: 61, testTakersConfirmed: 61, finalPassers: 61 },
    { schoolName: '寿都', department: '普通', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '蘭越', department: '普通', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '倶知安', department: '普通', quota: 160, applicantsConfirmed: 108, testTakersConfirmed: 104, finalPassers: 104 },
    { schoolName: '倶知安農業', department: '生産科学', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '小樽未来創造', department: '機械電気システム', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 27 },
    { schoolName: '小樽未来創造', department: '建設システム', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '小樽未来創造', department: '流通マネジメント', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '小樽未来創造', department: '情報会計マネジメント', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 35, finalPassers: 36 },
    { schoolName: '岩内', department: '地域産業ビジネス', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '小樽水産', department: '海洋漁業', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '小樽水産', department: '水産食品', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 34, finalPassers: 33 },
    { schoolName: '小樽水産', department: '栽培漁業', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '小樽水産', department: '情報通信', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '余市紅志', department: '総合', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 27 },
    { schoolName: 'ニセコ国際', department: '総合', quota: 70, applicantsConfirmed: 59, testTakersConfirmed: 58, finalPassers: 56 },
    { schoolName: '室蘭栄', department: '普通', quota: 120, applicantsConfirmed: 134, testTakersConfirmed: 131, finalPassers: 120 },
    { schoolName: '室蘭清水丘', department: '普通', quota: 160, applicantsConfirmed: 132, testTakersConfirmed: 128, finalPassers: 127 },
    { schoolName: '登別青嶺', department: '普通', quota: 120, applicantsConfirmed: 62, testTakersConfirmed: 59, finalPassers: 58 },
    { schoolName: '伊達開来', department: '普通', quota: 160, applicantsConfirmed: 119, testTakersConfirmed: 118, finalPassers: 118 },
    { schoolName: '苫小牧東', department: '普通', quota: 240, applicantsConfirmed: 312, testTakersConfirmed: 266, finalPassers: 240 },
    { schoolName: '苫小牧西', department: '普通', quota: 160, applicantsConfirmed: 182, testTakersConfirmed: 170, finalPassers: 160 },
    { schoolName: '苫小牧南', department: '普通', quota: 160, applicantsConfirmed: 184, testTakersConfirmed: 161, finalPassers: 157 },
    { schoolName: '白老東', department: '普通', quota: 80, applicantsConfirmed: 31, testTakersConfirmed: 27, finalPassers: 26 },
    { schoolName: '追分', department: '普通', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 34, finalPassers: 33 },
    { schoolName: '厚真', department: '普通', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '鵡川', department: '普通', quota: 80, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 49 },
    { schoolName: '室蘭栄', department: '理数', quota: 80, applicantsConfirmed: 69, testTakersConfirmed: 68, finalPassers: 72 },
    { schoolName: '壮瞥', department: '地域農業', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 22 },
    { schoolName: '室蘭工業', department: '電子機械', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '室蘭工業', department: '電気', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '室蘭工業', department: '建設', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 32, finalPassers: 31 },
    { schoolName: '苫小牧工業', department: '電子機械', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '苫小牧工業', department: '電気', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '苫小牧工業', department: '情報技術', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 34, finalPassers: 35 },
    { schoolName: '苫小牧工業', department: '建築', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '苫小牧工業', department: '土木', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '苫小牧工業', department: '環境化学', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '虻田', department: '事務情報', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '苫小牧総合経済', department: '流通経済', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '苫小牧総合経済', department: '国際経済', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '苫小牧総合経済', department: '情報処理', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '室蘭東翔', department: '総合', quota: 160, applicantsConfirmed: 155, testTakersConfirmed: 155, finalPassers: 154 },
    { schoolName: '平取', department: '普通', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '富川', department: '普通', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '静内', department: '普通', quota: 200, applicantsConfirmed: 152, testTakersConfirmed: 144, finalPassers: 144 },
    { schoolName: 'えりも', department: '普通', quota: 70, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '静内農業', department: '食品科学', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 31 },
    { schoolName: '静内農業', department: '生産科学', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40 },
    { schoolName: '浦河総合', department: '総合', quota: 120, applicantsConfirmed: 87, testTakersConfirmed: 85, finalPassers: 85 },
    { schoolName: '函館中部', department: '普通', quota: 160, applicantsConfirmed: 186, testTakersConfirmed: 175, finalPassers: 160 },
    { schoolName: '函館西', department: '普通', quota: 240, applicantsConfirmed: 301, testTakersConfirmed: 251, finalPassers: 240 },
    { schoolName: '南茅部', department: '普通', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '上磯', department: '普通', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 16, finalPassers: 14 },
    { schoolName: '七飯', department: '普通', quota: 120, applicantsConfirmed: 100, testTakersConfirmed: 74, finalPassers: 69 },
    { schoolName: '松前', department: '普通', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '八雲', department: '普通', quota: 80, applicantsConfirmed: 65, testTakersConfirmed: 61, finalPassers: 60 },
    { schoolName: '長万部', department: '普通', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '市立函館', department: '普通', quota: 200, applicantsConfirmed: 283, testTakersConfirmed: 231, finalPassers: 200 },
    { schoolName: '知内', department: '普通', quota: 80, applicantsConfirmed: 71, testTakersConfirmed: 71, finalPassers: 71 },
    { schoolName: '函館中部', department: '理数', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 40 },
    { schoolName: '大野農業', department: '農業科学', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '大野農業', department: '園芸福祉', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '大野農業', department: '食品科学', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '函館工業', department: '電子機械', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '函館工業', department: '電気情報工学', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '函館工業', department: '建築', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '函館工業', department: '環境土木', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 39, finalPassers: 40 },
    { schoolName: '函館工業', department: '工業化学', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '函館商業', department: '流通ビジネス', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '函館商業', department: '国際経済', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '函館商業', department: '会計ビジネス', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 38, finalPassers: 39 },
    { schoolName: '函館商業', department: '情報処理', quota: 40, applicantsConfirmed: 56, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '福島商業', department: '商業', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '八雲', department: '総合ビジネス', quota: 40, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '函館水産', department: '海洋技術', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '函館水産', department: '食品創造', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 20, finalPassers: 19 },
    { schoolName: '函館水産', department: '機関工学', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '森', department: '総合', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '江差', department: '普通', quota: 80, applicantsConfirmed: 35, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '上ノ国', department: '普通', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '奥尻', department: '普通', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '檜山北', department: '総合', quota: 80, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 54 },
    { schoolName: '旭川東', department: '普通', quota: 240, applicantsConfirmed: 286, testTakersConfirmed: 283, finalPassers: 240 },
    { schoolName: '旭川西', department: '普通', quota: 160, applicantsConfirmed: 217, testTakersConfirmed: 206, finalPassers: 160 },
    { schoolName: '旭川北', department: '普通', quota: 200, applicantsConfirmed: 230, testTakersConfirmed: 220, finalPassers: 200 },
    { schoolName: '旭川永嶺', department: '普通', quota: 200, applicantsConfirmed: 224, testTakersConfirmed: 212, finalPassers: 200 },
    { schoolName: '鷹栖', department: '普通', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '東川', department: '普通', quota: 80, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 70 },
    { schoolName: '美瑛', department: '普通', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 15, finalPassers: 14 },
    { schoolName: '上川', department: '普通', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '富良野', department: '普通', quota: 120, applicantsConfirmed: 94, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '上富良野', department: '普通', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '南富良野', department: '普通', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 21 },
    { schoolName: '士別翔雲', department: '普通', quota: 120, applicantsConfirmed: 73, testTakersConfirmed: 71, finalPassers: 71 },
    { schoolName: '名寄', department: '普通', quota: 160, applicantsConfirmed: 124, testTakersConfirmed: 122, finalPassers: 120 },
    { schoolName: '美深', department: '普通', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '旭川西', department: '理数', quota: 40, applicantsConfirmed: 57, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: 'おといねっぷ美術工芸', department: '工芸', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '旭川農業', department: '農業科学', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 39, finalPassers: 38 },
    { schoolName: '旭川農業', department: '食品科学', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '旭川農業', department: '森林科学', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '旭川農業', department: '生活科学', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '富良野', department: '園芸観光デザイン', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '旭川工業', department: '電子機械', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '旭川工業', department: '電気', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '旭川工業', department: '情報技術', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '旭川工業', department: '建築', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '旭川工業', department: '土木', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '旭川工業', department: '工業化学', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '名寄', department: '情報技術', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '富良野', department: '電気情報システム', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '旭川商業', department: '流通ビジネス', quota: 80, applicantsConfirmed: 73, testTakersConfirmed: 74, finalPassers: 73 },
    { schoolName: '旭川商業', department: '国際ビジネス', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '旭川商業', department: '会計', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '旭川商業', department: '情報処理', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 36 },
    { schoolName: '士別翔雲', department: '総合ビジネス', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '下川商業', department: '商業', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '旭川南', department: '総合', quota: 200, applicantsConfirmed: 196, testTakersConfirmed: 191, finalPassers: 189 },
    { schoolName: '剣淵', department: '総合', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
  ],
};
