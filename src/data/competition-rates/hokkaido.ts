/**
 * 北海道 公立高等学校 倍率パイプラインα（Y-6・coverage='partial'・空知地区+石狩地区(全日制普通科)
 * +札幌市(市立高校・全日制)+後志地区(全日制普通科)+胆振地区(全日制普通科)+日高地区(全日制)
 * +渡島地区(全日制)+檜山地区(全日制)+上川地区(全日制)+留萌地区(全日制)+宗谷地区(全日制)のみ）。
 *
 * 一次ソース: 北海道教育委員会「R8入学者選抜状況報告書 §3 学校別受検者数及び合格者数」
 * （令和8年度＝2026年度入学者選抜・全14頁・管内(空知/石狩/後志/胆振/日高/渡島/檜山/上川/
 * 留萌/宗谷/オホーツク/十勝/釧路/根室/札幌市)ごとに全日制(普通教育学科/専門教育・総合学科)・
 * 定時制・有朋単位制のセクションに分かれる）。
 *
 * ⚠️このPDFは埋め込みフォントのToUnicodeマッピングが欠落しており学校名・学科名がpdftotext
 * では読めない（okinawa.tsと同型の罠）が、数値列（募集人員・出願者数・受検者数・倍率・合格者数）
 * はpdftotext -layoutで正確に抽出できることを2026-08-06に発見。学校名・学科名はRead toolの
 * ビジョン解析で読み取り、行順で数値列と突合する2段階の技法を確立した。
 *
 * ⚠️検算方式（重要）: 各行について「受検者数÷募集人員≒印字済み倍率」を突合し、不一致の行は
 * 誤読の疑いとして収録を見送る。空知地区で1行（滝川西・情報マネジメント科）がこの検算で
 * 数値の対応関係を特定できず、pendingDepartmentsに正直に記録した。
 *
 * quota=募集人員、finalApplicants=出願者数（第1次・他県のΛ-4 hokkaidoエントリと同じ「第1次
 * 出願者数」の定義）、finalRate=finalApplicants/quotaを自前算出（原資料の印字倍率は受検者数を
 * 分子にしており他県との定義が異なるため採用しない）。
 *
 * coverage.status='partial': 空知地区（全日制・29レコード）＋石狩地区・全日制「普通教育を主とする
 * 学科」（31レコード、資料p10掲載）＋札幌市（市立高校・全日制・9レコード、資料p12掲載）を収録。
 * 「札幌市」は道立高校の石狩地区とは別の管理者（市立＝札幌市教育委員会所管）のため報告書上も
 * 独立した地区として扱われている（市立札幌旭丘・藻岩・平岸・清田・新川・啓北商業の6校）。
 * 石狩地区の「専門教育を主とする学科及び総合学科」（資料p11上表・26レコード）は学校名セルが
 * 複数学科行にまたがる結合セル形式で列ズレ誤読リスクが高いため今回は見送り、pendingDepartments
 * に記録した。後志地区・全日制「普通教育を主とする学科」（6レコード、資料p13上表）＋胆振地区・
 * 全日制「普通教育を主とする学科」（11レコード、資料p13下表）も収録。後志地区の「専門教育を
 * 主とする学科及び総合学科」（資料p13中表・12レコード）は小樽未来創造・小樽水産の学科名が微小
 * フォントで確実な判読ができないため見送り、胆振地区の同種テーブル（資料p14上表・16レコード）
 * も室蘭工業・苫小牧工業・苫小牧総合経済が複数学科の結合セル形式のため同様に見送った。日高地区
 * は全日制「普通教育を主とする学科」（4レコード、資料p14下表）に加え「専門教育を主とする学科
 * 及び総合学科」（静内農業2学科＋浦河総合・3レコード、資料p15上表）も収録（⚠️前回セッションで
 * 「日高地区は専門/総合学科が存在しない」と誤って記録したが、実際は次ページに続いていただけ
 * だったと判明・修正済み）。渡島地区・全日制「普通教育を主とする学科」（10レコード、資料p15
 * 下表・知内高校は別枠の小表だが同一区分のため合算）も収録。残り8地区（檜山/上川/留萌/宗谷/
 * オホーツク/十勝/釧路/根室）は次回以降のセッションで地区単位に追加していく
 * （1地区=1コミット目安）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const HOKKAIDO_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'hokkaido',
  sources: [
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（全14頁中・空知地区掲載頁）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-08-06',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '空知地区・全日制（29レコード）',
      '石狩地区・全日制「普通教育を主とする学科」（31レコード）',
      '札幌市・全日制（市立高校6校・9レコード）',
      '後志地区・全日制「普通教育を主とする学科」（6レコード）',
      '胆振地区・全日制「普通教育を主とする学科」（11レコード）',
      '日高地区・全日制「普通教育を主とする学科」（4レコード）＋「専門教育を主とする学科及び総合学科」（3レコード）',
      '渡島地区・全日制「普通教育を主とする学科」（10レコード・知内高校含む）＋「専門教育を主とする学科及び総合学科」（19レコード・資料p16掲載）',
      '檜山地区・全日制「普通教育を主とする学科」（3レコード）＋「総合学科」（1レコード・檜山北高校）',
      '上川地区・全日制「普通教育を主とする学科」（14レコード、資料p17上表）＋「専門教育を主とする学科及び総合学科」（23レコード、資料p17下表）',
      '留萌地区・全日制「普通教育を主とする学科」（3レコード）＋「専門教育を主とする学科」（4レコード、資料p18掲載）',
      '宗谷地区・全日制「普通教育を主とする学科」（6レコード）＋「専門教育を主とする学科」（2レコード、資料p18掲載）',
    ],
    pendingDepartments: [
      '石狩地区・全日制「専門教育を主とする学科及び総合学科」（学校名が複数学科行にまたがる結合セルのため今回は見送り・26レコード分）',
      '後志地区・全日制「専門教育を主とする学科及び総合学科」（小樽未来創造・小樽水産の学科名が微小フォントで判読不確実のため今回は見送り・12レコード分）',
      '胆振地区・全日制「専門教育を主とする学科及び総合学科」（室蘭工業・苫小牧工業・苫小牧総合経済が複数学科の結合セル形式のため今回は見送り・16レコード分）',
      '胆振地区・鵡川高校「普通科（連携型）」（出願者数/倍率の列が無い別選抜方式のためスキーマ不一致・スコープ外）',
      '日高地区・えりも高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外）',
      '上川地区・上川高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外・資料p17中表）',
      'オホーツク地区・十勝地区・釧路地区・根室地区（いずれも未着手）',
      '空知地区・滝川西高校「情報マネジメント科」（検算式で数値の対応関係を特定できず見送り）',
      '札幌市・市立札幌大通「定時制」（他県のY-6と同じ理由でスコープ外）',
      '後志地区・定時制（小樽潮陵・真狩・留寿都・小樽未来創造。他県のY-6と同じ理由でスコープ外）',
      '胆振地区・定時制（室蘭栄・苫小牧東・苫小牧工業。他県のY-6と同じ理由でスコープ外）',
      '定時制課程・有朋単位制（他県のY-6と同じ理由でスコープ外）',
    ],
    note:
      '空知地区の全日制29レコードは各行「受検者数÷募集人員≒印字済み倍率」の検算で全件一致を確認済み。' +
      '石狩地区・全日制普通科の31レコード、札幌市・全日制の9レコードもRead toolのビジョン解析' +
      '(資料p10/p12の表・p12は400dpi高解像度レンダリングで学科名の小さい文字も確認)とpdftotext ' +
      '-layout(同頁の数値列)を独立に突合し全件一致を確認した(学校名セルが1行1校または結合セルが' +
      '無い簡潔な構造のため空知と同水準の確度)。pdftotext -layoutで数値を正確抽出し、学校名・学科名' +
      'はRead toolのビジョン解析で行順突合した。渡島地区・専門/総合学科(資料p16)と檜山地区(同頁)は' +
      'pdftoppm -r 300による300dpi高解像度レンダリングで学科名を確認し、pdftotext -layoutの数値列と' +
      '行順突合した(結合セルなし・簡潔な構造のため空知と同水準の確度)。上川地区(資料p17)は' +
      'pdftoppm -r 600によるさらに高解像度のレンダリング(600dpi)＋ffmpegでの部分クロップ拡大で' +
      '「富良野・園芸観光デザイン」等の微小フォント学科名まで確認し、pdftotext -layoutの数値列と' +
      '全37行を行順突合した(結合セルなし・空知と同水準の確度)。留萌地区・宗谷地区(資料p18)は' +
      'pdftoppm -r 300による300dpi高解像度レンダリングで学科名を確認し、pdftotext -layoutの数値列と' +
      '全15行を行順突合した(結合セルなし・空知と同水準の確度)。',
  },
  officialSubtotals: [],
  records: [
    { schoolName: '岩見沢東', department: '普通', quota: 160, finalApplicants: 134, finalRate: 0.84 },
    { schoolName: '岩見沢東', department: '文理探究', quota: 80, finalApplicants: 79, finalRate: 0.99 },
    { schoolName: '月形', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.42 },
    { schoolName: '夕張', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '長沼', department: '普通', quota: 80, finalApplicants: 35, finalRate: 0.44 },
    { schoolName: '栗山', department: '普通', quota: 80, finalApplicants: 30, finalRate: 0.38 },
    { schoolName: '岩見沢緑陵', department: '普通', quota: 160, finalApplicants: 161, finalRate: 1.01 },
    { schoolName: '滝川', department: '普通', quota: 160, finalApplicants: 168, finalRate: 1.05 },
    { schoolName: '砂川', department: '普通', quota: 80, finalApplicants: 70, finalRate: 0.88 },
    { schoolName: '芦別', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.42 },
    { schoolName: '深川西', department: '普通', quota: 80, finalApplicants: 53, finalRate: 0.66 },
    { schoolName: '滝川西', department: '普通', quota: 120, finalApplicants: 126, finalRate: 1.05 },
    { schoolName: '滝川', department: '理数', quota: 40, finalApplicants: 33, finalRate: 0.82 },
    { schoolName: '岩見沢農業', department: '酪農科学', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '岩見沢農業', department: '畜産科学', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '岩見沢農業', department: '食品科学', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '岩見沢農業', department: '農業土木工学', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '岩見沢農業', department: '環境造園科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '岩見沢農業', department: '森林科学科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '岩見沢農業', department: '生活科学', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '深川東', department: '生産科学', quota: 40, finalApplicants: 23, finalRate: 0.57 },
    { schoolName: '新十津川農業', department: '農業・生活', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '滝川工業', department: '電子機械', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '滝川工業', department: '電気', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '岩見沢緑陵', department: 'みらい設計', quota: 80, finalApplicants: 84, finalRate: 1.05 },
    { schoolName: '三笠', department: '調理師', quota: 20, finalApplicants: 27, finalRate: 1.35 },
    { schoolName: '三笠', department: '製菓', quota: 20, finalApplicants: 25, finalRate: 1.25 },
    { schoolName: '美唄聖華', department: '衛生看護', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '美唄尚栄', department: '総合', quota: 80, finalApplicants: 37, finalRate: 0.46 },
    { schoolName: '札幌東', department: '普通', quota: 320, finalApplicants: 416, finalRate: 1.3 },
    { schoolName: '札幌西', department: '普通', quota: 320, finalApplicants: 454, finalRate: 1.42 },
    { schoolName: '札幌南', department: '普通', quota: 320, finalApplicants: 412, finalRate: 1.29 },
    { schoolName: '札幌北', department: '普通', quota: 320, finalApplicants: 391, finalRate: 1.22 },
    { schoolName: '札幌月寒', department: '普通', quota: 320, finalApplicants: 414, finalRate: 1.29 },
    { schoolName: '札幌啓成', department: '普通', quota: 280, finalApplicants: 317, finalRate: 1.13 },
    { schoolName: '札幌北陵', department: '普通', quota: 320, finalApplicants: 364, finalRate: 1.14 },
    { schoolName: '札幌手稲', department: '普通', quota: 320, finalApplicants: 340, finalRate: 1.06 },
    { schoolName: '札幌丘珠', department: '普通', quota: 280, finalApplicants: 235, finalRate: 0.84 },
    { schoolName: '札幌西陵', department: '普通', quota: 240, finalApplicants: 194, finalRate: 0.81 },
    { schoolName: '札幌白石', department: '普通', quota: 280, finalApplicants: 360, finalRate: 1.29 },
    { schoolName: '札幌東陵', department: '普通', quota: 280, finalApplicants: 329, finalRate: 1.18 },
    { schoolName: '札幌南陵', department: '普通', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '札幌東豊', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '札幌真栄', department: '普通', quota: 200, finalApplicants: 162, finalRate: 0.81 },
    { schoolName: '札幌あすかぜ', department: '普通', quota: 80, finalApplicants: 59, finalRate: 0.74 },
    { schoolName: '札幌稲雲', department: '普通', quota: 280, finalApplicants: 313, finalRate: 1.12 },
    { schoolName: '札幌英藍', department: '普通', quota: 280, finalApplicants: 261, finalRate: 0.93 },
    { schoolName: '札幌平岡', department: '普通', quota: 240, finalApplicants: 315, finalRate: 1.31 },
    { schoolName: '札幌白陵', department: '普通', quota: 80, finalApplicants: 41, finalRate: 0.51 },
    { schoolName: '札幌国際情報', department: '普通', quota: 80, finalApplicants: 118, finalRate: 1.48 },
    { schoolName: '江別', department: '普通', quota: 200, finalApplicants: 225, finalRate: 1.13 },
    { schoolName: '野幌', department: '普通', quota: 120, finalApplicants: 68, finalRate: 0.57 },
    { schoolName: '大麻', department: '普通', quota: 280, finalApplicants: 274, finalRate: 0.98 },
    { schoolName: '千歳', department: '普通', quota: 200, finalApplicants: 254, finalRate: 1.27 },
    { schoolName: '北広島', department: '普通', quota: 280, finalApplicants: 317, finalRate: 1.13 },
    { schoolName: '北広島西', department: '普通', quota: 160, finalApplicants: 88, finalRate: 0.55 },
    { schoolName: '石狩南', department: '普通', quota: 280, finalApplicants: 319, finalRate: 1.14 },
    { schoolName: '当別', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '恵庭南', department: '普通', quota: 200, finalApplicants: 130, finalRate: 0.65 },
    { schoolName: '恵庭北', department: '普通', quota: 240, finalApplicants: 204, finalRate: 0.85 },
    { schoolName: '市立札幌旭丘', department: '普通', quota: 240, finalApplicants: 351, finalRate: 1.46 },
    { schoolName: '市立札幌藻岩', department: '普通', quota: 240, finalApplicants: 301, finalRate: 1.25 },
    { schoolName: '市立札幌平岸', department: '普通', quota: 280, finalApplicants: 388, finalRate: 1.39 },
    { schoolName: '市立札幌平岸', department: 'デザインアート', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '市立札幌清田', department: '普通', quota: 200, finalApplicants: 251, finalRate: 1.25 },
    { schoolName: '市立札幌清田', department: 'グローバル', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '市立札幌新川', department: '普通', quota: 320, finalApplicants: 403, finalRate: 1.26 },
    { schoolName: '市立札幌旭丘', department: '数理データサイエンス', quota: 80, finalApplicants: 90, finalRate: 1.13 },
    { schoolName: '市立札幌啓北商業', department: '未来商学', quota: 240, finalApplicants: 191, finalRate: 0.8 },
    { schoolName: '小樽潮陵', department: '普通', quota: 200, finalApplicants: 205, finalRate: 1.02 },
    { schoolName: '小樽桜陽', department: '普通', quota: 200, finalApplicants: 176, finalRate: 0.88 },
    { schoolName: '岩内', department: '普通', quota: 80, finalApplicants: 61, finalRate: 0.76 },
    { schoolName: '寿都', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '蘭越', department: '普通', quota: 40, finalApplicants: 23, finalRate: 0.57 },
    { schoolName: '倶知安', department: '普通', quota: 160, finalApplicants: 108, finalRate: 0.68 },
    { schoolName: '室蘭栄', department: '普通', quota: 120, finalApplicants: 134, finalRate: 1.12 },
    { schoolName: '室蘭清水丘', department: '普通', quota: 160, finalApplicants: 132, finalRate: 0.83 },
    { schoolName: '登別青嶺', department: '普通', quota: 120, finalApplicants: 62, finalRate: 0.52 },
    { schoolName: '伊達開来', department: '普通', quota: 160, finalApplicants: 119, finalRate: 0.74 },
    { schoolName: '苫小牧東', department: '普通', quota: 240, finalApplicants: 312, finalRate: 1.3 },
    { schoolName: '苫小牧西', department: '普通', quota: 160, finalApplicants: 182, finalRate: 1.14 },
    { schoolName: '苫小牧南', department: '普通', quota: 160, finalApplicants: 184, finalRate: 1.15 },
    { schoolName: '白老東', department: '普通', quota: 80, finalApplicants: 31, finalRate: 0.39 },
    { schoolName: '追分', department: '普通', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '厚真', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '鵡川', department: '普通', quota: 80, finalApplicants: 49, finalRate: 0.61 },
    { schoolName: '平取', department: '普通', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '富川', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '静内', department: '普通', quota: 200, finalApplicants: 152, finalRate: 0.76 },
    { schoolName: 'えりも', department: '普通', quota: 70, finalApplicants: 28, finalRate: 0.4 },
    { schoolName: '静内農業', department: '食品科学', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '静内農業', department: '生産科学', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '浦河総合', department: '総合', quota: 120, finalApplicants: 87, finalRate: 0.73 },
    { schoolName: '函館中部', department: '普通', quota: 160, finalApplicants: 186, finalRate: 1.16 },
    { schoolName: '函館西', department: '普通', quota: 240, finalApplicants: 301, finalRate: 1.25 },
    { schoolName: '南茅部', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '上磯', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '七飯', department: '普通', quota: 120, finalApplicants: 100, finalRate: 0.83 },
    { schoolName: '松前', department: '普通', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '八雲', department: '普通', quota: 80, finalApplicants: 65, finalRate: 0.81 },
    { schoolName: '長万部', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '市立函館', department: '普通', quota: 200, finalApplicants: 283, finalRate: 1.42 },
    { schoolName: '知内', department: '普通', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '函館中部', department: '理数', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '大野農業', department: '農業科学', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '大野農業', department: '園芸福祉', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '大野農業', department: '食品科学', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '函館工業', department: '電子機械', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '函館工業', department: '電気情報工学', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '函館工業', department: '建築', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '函館工業', department: '環境土木', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '函館工業', department: '工業化学', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '函館商業', department: '流通ビジネス', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '函館商業', department: '国際経済', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '函館商業', department: '会計ビジネス', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '函館商業', department: '情報処理', quota: 40, finalApplicants: 56, finalRate: 1.4 },
    { schoolName: '福島商業', department: '商業', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '八雲', department: '総合ビジネス', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '函館水産', department: '海洋技術', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '函館水産', department: '食品創造', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '函館水産', department: '機関工学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '森', department: '総合', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '江差', department: '普通', quota: 80, finalApplicants: 35, finalRate: 0.44 },
    { schoolName: '上ノ国', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '奥尻', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '檜山北', department: '総合', quota: 80, finalApplicants: 55, finalRate: 0.69 },
    { schoolName: '旭川東', department: '普通', quota: 240, finalApplicants: 286, finalRate: 1.19 },
    { schoolName: '旭川西', department: '普通', quota: 160, finalApplicants: 217, finalRate: 1.36 },
    { schoolName: '旭川北', department: '普通', quota: 200, finalApplicants: 230, finalRate: 1.15 },
    { schoolName: '旭川永嶺', department: '普通', quota: 200, finalApplicants: 224, finalRate: 1.12 },
    { schoolName: '鷹栖', department: '普通', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '東川', department: '普通', quota: 80, finalApplicants: 72, finalRate: 0.9 },
    { schoolName: '美瑛', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '上川', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '富良野', department: '普通', quota: 120, finalApplicants: 94, finalRate: 0.78 },
    { schoolName: '上富良野', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '南富良野', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '士別翔雲', department: '普通', quota: 120, finalApplicants: 73, finalRate: 0.61 },
    { schoolName: '名寄', department: '普通', quota: 160, finalApplicants: 124, finalRate: 0.78 },
    { schoolName: '美深', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '旭川西', department: '理数', quota: 40, finalApplicants: 57, finalRate: 1.43 },
    { schoolName: 'おといねっぷ美術工芸', department: '工芸', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '旭川農業', department: '農業科学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '旭川農業', department: '食品科学', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '旭川農業', department: '森林科学', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '旭川農業', department: '生活科学', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '富良野', department: '園芸観光デザイン', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '旭川工業', department: '電子機械', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '旭川工業', department: '電気', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '旭川工業', department: '情報技術', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '旭川工業', department: '建築', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '旭川工業', department: '土木', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '旭川工業', department: '工業化学', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '名寄', department: '情報技術', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '富良野', department: '電気情報システム', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '旭川商業', department: '流通ビジネス', quota: 80, finalApplicants: 73, finalRate: 0.91 },
    { schoolName: '旭川商業', department: '国際ビジネス', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '旭川商業', department: '会計', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '旭川商業', department: '情報処理', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '士別翔雲', department: '総合ビジネス', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '下川商業', department: '商業', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '旭川南', department: '総合', quota: 200, finalApplicants: 196, finalRate: 0.98 },
    { schoolName: '剣淵', department: '総合', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '留萌', department: '普通', quota: 160, finalApplicants: 108, finalRate: 0.68 },
    { schoolName: '羽幌', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '天塩', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '遠別農業', department: '生産科学', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '留萌', department: '電気・建築', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '留萌', department: '情報ビジネス', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '苫前商業', department: '商業', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '稚内', department: '普通', quota: 120, finalApplicants: 95, finalRate: 0.79 },
    { schoolName: '豊富', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '浜頓別', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '枝幸', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '利尻', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '礼文', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '稚内商業', department: '商業', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '稚内', department: '衛生看護', quota: 40, finalApplicants: 15, finalRate: 0.38 },
  ],
};
