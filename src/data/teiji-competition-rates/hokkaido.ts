import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 北海道 定時制・通信制単位制（T-P1 P1-3・S1-3 A分類・coverage='partial'）。
 *
 * 一次ソース: 北海道教育委員会「R8入学者選抜状況報告書 §3 学校別受検者数及び合格者数」
 * （既存の全日制`src/data/competition-rates/hokkaido.ts`と同一PDF`05_p9-p22.pdf`・全14頁の
 * うち①3頁目＝資料印字ページ「11」＝石狩地区、②5頁目＝資料印字ページ「13」＝後志地区、
 * ③6頁目＝資料印字ページ「14」＝胆振地区、④7頁目＝資料印字ページ「15」＝日高地区、
 * ⑤8頁目＝資料印字ページ「16」＝渡島地区）。石狩地区ページには全日制「専門教育を主とする
 * 学科及び総合学科」表の直後に「（石狩）定時制」表、さらにその下に「（石狩）有朋単位制」表
 * （独立した通信制単位制校）が続けて掲載されている。後志・胆振・日高・渡島地区ページには
 * 全日制表群の直後にそれぞれ「（後志）定時制」「（胆振）定時制」「（日高）定時制」
 * 「（渡島）定時制」表が掲載されている。
 *
 * ⚠️coverage.status='partial'とした理由: **北海道は14管内すべてが同一PDF内に分散しており、
 * 定時制セクションが各管内ページに存在するかどうかは1管内ずつ実機確認が必要**（全日制の
 * hokkaido.tsも「掛-1第1〜13弾」の14回に分けて全管内を完走した前例と同型）。今回は石狩地区
 * （3頁目）・後志地区（5頁目）・胆振地区（6頁目）・日高地区（7頁目）・渡島地区（8頁目）のみ
 * 着手し、残り10区分（全日制hokkaido.tsが数える15地域区分-石狩-後志-胆振-日高-渡島）は
 * 次回以降に持ち越す。
 *
 * ⚠️quota/finalApplicants/finalRateの定義は既存の全日制hokkaido.tsと同じ規律を踏襲した:
 * quota=募集人員、finalApplicants=出願者数（第1次）、finalRate=finalApplicants/quotaを
 * 自前算出し小数点2桁に丸め（原資料の印字倍率は受検者数を分子にしており他県との定義が
 * 異なるため採用しない）。有朋単位制は「募集人員(推薦枠)/出願者数/受検者数/倍率/合格者数/
 * 推薦[受検者数/合格者数]/入学者数」という定時制と同型の列構成のため同じ規律で転記した。
 *
 * ページ内に「計」等の合計行は無いため、officialSubtotalsは空のまま（自己集計値: 石狩定時制
 * quota520・applicants184、石狩有朋単位制quota160・applicants36、後志定時制quota160・
 * applicants43、胆振定時制quota120・applicants41、日高定時制quota40・applicants15、
 * 渡島定時制quota120・applicants61）。
 *
 * ToUnicode欠落でpdftotext不可（数値は`pdftotext -layout`で抽出できるが行の対応が崩れるため
 * 不採用）・`pdftoppm 150〜180dpi`のビジョン解析で全26レコードを判読できた。
 */

export const HOKKAIDO_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'hokkaido',
  sources: [
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle:
        '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（石狩地区・定時制／有朋単位制[資料印字ページ11]、後志地区・定時制[資料印字ページ13]、胆振地区・定時制[資料印字ページ14]、日高地区・定時制[資料印字ページ15]、渡島地区・定時制[資料印字ページ16]）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-06',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '石狩地区・定時制',
      '石狩地区・有朋単位制（通信制単位制）',
      '後志地区・定時制',
      '胆振地区・定時制',
      '日高地区・定時制',
      '渡島地区・定時制',
    ],
    pendingDepartments: [
      '空知地区・定時制（未確認・次回着手）',
      '檜山地区・定時制（未確認・次回着手）',
      '上川地区・定時制（未確認・次回着手）',
      '留萌地区・定時制（未確認・次回着手）',
      '宗谷地区・定時制（未確認・次回着手）',
      'オホーツク地区・定時制（未確認・次回着手）',
      '十勝地区・定時制（未確認・次回着手）',
      '釧路地区・定時制（未確認・次回着手）',
      '根室地区・定時制（未確認・次回着手）',
      '札幌市・定時制（市立高校。未確認・次回着手）',
    ],
    note: '全日制hokkaido.tsが数える15地域区分（空知/石狩/札幌市/後志/胆振/日高/渡島/檜山/上川/留萌/宗谷/オホーツク/十勝/釧路/根室）のうち、石狩地区（資料印字ページ11・pdftoppm 3頁目）・後志地区（資料印字ページ13・pdftoppm 5頁目）・胆振地区（資料印字ページ14・pdftoppm 6頁目）・日高地区（資料印字ページ15・pdftoppm 7頁目）・渡島地区（資料印字ページ16・pdftoppm 8頁目）が着手完了。残り10区分は同一PDF内の別頁に定時制セクションが存在するか未確認のため、全日制hokkaido.tsと同じく区分ごとに実機確認しながら段階的に追加する。',
  },
  records: [
    // ===== （石狩）定時制 =====
    { schoolName: '札幌東', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '札幌西', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '札幌南', department: '普通', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '札幌北', department: '普通', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '札幌月寒', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '江別', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '千歳', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '恵庭南', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '札幌工業', department: '機械', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '札幌工業', department: '電気', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '札幌工業', department: '建築', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '札幌琴似工業', department: '電子機械', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '札幌琴似工業', department: '電気', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    // ===== （石狩）有朋単位制（通信制単位制） =====
    { schoolName: '有朋', department: '普通（有朋単位制・通信制）', quota: 80, finalApplicants: 28, finalRate: 0.35 },
    { schoolName: '有朋', department: '事務情報（有朋単位制・通信制）', quota: 80, finalApplicants: 8, finalRate: 0.1 },
    // ===== （後志）定時制 =====
    { schoolName: '小樽潮陵', department: '普通', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '真狩', department: '農芸科学', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '留寿都', department: '農業福祉', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '小樽未来創造', department: '電気・建築', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    // ===== （胆振）定時制 =====
    { schoolName: '室蘭栄', department: '普通', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '苫小牧東', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '苫小牧工業', department: '工業技術', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    // ===== （日高）定時制 =====
    { schoolName: '日高', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    // ===== （渡島）定時制 =====
    { schoolName: '函館中部', department: '普通', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '函館工業', department: '電子機械', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '函館商業', department: '事務情報', quota: 40, finalApplicants: 12, finalRate: 0.3 },
  ],
  officialSubtotals: [],
};
