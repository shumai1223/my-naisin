/**
 * 北海道 公立高等学校 倍率パイプラインα（Y-6・coverage='partial'・空知地区+石狩地区（全日制普通科）のみ）。
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
 * 学科」（31レコード、資料p10掲載）を収録。石狩地区の「専門教育を主とする学科及び総合学科」
 * （資料p11上表・26レコード）は学校名セルが複数学科行にまたがる結合セル形式で列ズレ誤読リスクが
 * 高いため今回は見送り、pendingDepartmentsに記録した。残り13地区（後志/胆振/日高/渡島/檜山/上川/
 * 留萌/宗谷/オホーツク/十勝/釧路/根室/札幌市）は次回以降のセッションで地区単位に追加していく
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
    ],
    pendingDepartments: [
      '石狩地区・全日制「専門教育を主とする学科及び総合学科」（学校名が複数学科行にまたがる結合セルのため今回は見送り・26レコード分）',
      '後志地区・胆振地区・日高地区・渡島地区・檜山地区・上川地区・留萌地区・宗谷地区・オホーツク地区・十勝地区・釧路地区・根室地区・札幌市（いずれも未着手）',
      '空知地区・滝川西高校「情報マネジメント科」（検算式で数値の対応関係を特定できず見送り）',
      '定時制課程・有朋単位制（他県のY-6と同じ理由でスコープ外）',
    ],
    note:
      '空知地区の全日制29レコードは各行「受検者数÷募集人員≒印字済み倍率」の検算で全件一致を確認済み。' +
      '石狩地区・全日制普通科の31レコードもRead toolのビジョン解析(資料p10の表)とpdftotext -layout' +
      '(同頁の数値列)を独立に突合し全件一致を確認した(学校名セルが1行1校で結合セルが無いため空知' +
      'と同水準の確度)。pdftotext -layoutで数値を正確抽出し、学校名・学科名はRead toolのビジョン' +
      '解析で行順突合した。',
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
  ],
};
