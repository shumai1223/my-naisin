/**
 * 北海道 公立高等学校 倍率パイプラインα（Y-6・coverage='partial'・空知地区のみ）。
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
 * coverage.status='partial': 空知地区（全日制のみ・定時制は他県と同じ理由でスコープ外）の
 * 29レコードのみ収録。残り13地区（石狩/後志/胆振/日高/渡島/檜山/上川/留萌/宗谷/オホーツク/
 * 十勝/釧路/根室/札幌市）は次回以降のセッションで地区単位に追加していく（1地区=1コミット目安）。
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
    includedDepartments: ['空知地区・全日制（29レコード）'],
    pendingDepartments: [
      '石狩地区・後志地区・胆振地区・日高地区・渡島地区・檜山地区・上川地区・留萌地区・宗谷地区・オホーツク地区・十勝地区・釧路地区・根室地区・札幌市（いずれも未着手）',
      '空知地区・滝川西高校「情報マネジメント科」（検算式で数値の対応関係を特定できず見送り）',
      '定時制課程・有朋単位制（他県のY-6と同じ理由でスコープ外）',
    ],
    note:
      '空知地区の全日制29レコードは各行「受検者数÷募集人員≒印字済み倍率」の検算で全件一致を確認済み。' +
      'pdftotext -layoutで数値を正確抽出し、学校名・学科名はRead toolのビジョン解析で行順突合した。',
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
  ],
};
