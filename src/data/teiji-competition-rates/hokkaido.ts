import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 北海道 定時制・通信制単位制（T-P1 P1-3・S1-3 A分類・全15地域区分の実機確認が完了）。
 *
 * 一次ソース: 北海道教育委員会「R8入学者選抜状況報告書 §3 学校別受検者数及び合格者数」
 * （既存の全日制`src/data/competition-rates/hokkaido.ts`と同一PDF`05_p9-p22.pdf`・全14頁の
 * うち①1頁目＝資料印字ページ「9」＝空知地区、②3頁目＝資料印字ページ「11」＝石狩地区、
 * ③4頁目＝資料印字ページ「12」＝札幌市、④5頁目＝資料印字ページ「13」＝後志地区、
 * ⑤6頁目＝資料印字ページ「14」＝胆振地区、⑥7頁目＝資料印字ページ「15」＝日高地区、
 * ⑦8頁目＝資料印字ページ「16」＝渡島地区、⑧10頁目＝資料印字ページ「18」＝上川地区・留萌地区、
 * ⑨11頁目＝資料印字ページ「19」＝宗谷地区、⑩12頁目＝資料印字ページ「20」＝オホーツク地区・
 * 十勝地区、⑪13頁目＝資料印字ページ「21」＝釧路地区）。
 * 石狩地区ページには全日制「専門教育を主とする学科及び総合学科」表の直後に「（石狩）定時制」
 * 表、さらにその下に「（石狩）有朋単位制」表（独立した通信制単位制校）が続けて掲載されている。
 * 空知・札幌市・後志・胆振・日高・渡島・上川・留萌・宗谷・オホーツク・十勝・釧路地区ページには
 * 全日制表群の直後にそれぞれの「定時制」表が掲載されている（札幌市は市立札幌大通1校のみ・
 * 午前部/午後部/夜間部の3部制）。**檜山地区（8頁目下段〜9頁目上段の全日制表の直後）と
 * 根室地区（14頁目・全14頁の最終頁）には定時制セクション自体が存在しないことを実機確認済み**
 * （檜山は全日制表の直後にそのまま上川地区の全日制表が始まる・根室は全日制表2種の後そのまま
 * 資料が終わり定時制表が無い）。
 *
 * ⚠️これで北海道が数える15地域区分すべてを実機確認できた（13区分にデータあり・2区分
 * [檜山・根室]は定時制なしと確定）。全日制hokkaido.tsが「掛-1第1〜13弾」の14回に分けて
 * 全管内を完走したのと同型の段階的収集を、本ファイルでも6回のセッションに分けて完走した。
 *
 * ⚠️quota/finalApplicants/finalRateの定義は既存の全日制hokkaido.tsと同じ規律を踏襲した:
 * quota=募集人員、finalApplicants=出願者数（第1次）、finalRate=finalApplicants/quotaを
 * 自前算出し小数点2桁に丸め（原資料の印字倍率は受検者数を分子にしており他県との定義が
 * 異なるため採用しない）。有朋単位制は「募集人員(推薦枠)/出願者数/受検者数/倍率/合格者数/
 * 推薦[受検者数/合格者数]/入学者数」という定時制と同型の列構成のため同じ規律で転記した。
 *
 * ページ内に「計」等の合計行は無いため、officialSubtotalsは空のまま（自己集計値: 空知定時制
 * quota80・applicants14、石狩定時制quota520・applicants184、石狩有朋単位制quota160・
 * applicants36、札幌市定時制quota290・applicants301、後志定時制quota160・applicants43、
 * 胆振定時制quota120・applicants41、日高定時制quota40・applicants15、渡島定時制quota120・
 * applicants61、上川定時制quota280・applicants82、留萌定時制quota40・applicants1、
 * 宗谷定時制quota40・applicants14、オホーツク定時制quota120・applicants23、十勝定時制
 * quota40・applicants26、釧路定時制quota80・applicants30）。
 *
 * ToUnicode欠落でpdftotext不可（数値は`pdftotext -layout`で抽出できるが行の対応が崩れるため
 * 不採用）・`pdftoppm 150〜180dpi`のビジョン解析で全46レコードを判読できた。
 */

export const HOKKAIDO_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'hokkaido',
  sources: [
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle:
        '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（空知地区・定時制[資料印字ページ9]、石狩地区・定時制／有朋単位制[資料印字ページ11]、札幌市・定時制[資料印字ページ12]、後志地区・定時制[資料印字ページ13]、胆振地区・定時制[資料印字ページ14]、日高地区・定時制[資料印字ページ15]、渡島地区・定時制[資料印字ページ16]、上川地区・定時制／留萌地区・定時制[資料印字ページ18]、宗谷地区・定時制[資料印字ページ19]、オホーツク地区・定時制／十勝地区・定時制[資料印字ページ20]、釧路地区・定時制[資料印字ページ21]）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-06',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '空知地区・定時制',
      '石狩地区・定時制',
      '石狩地区・有朋単位制（通信制単位制）',
      '札幌市・定時制（市立札幌大通のみ）',
      '後志地区・定時制',
      '胆振地区・定時制',
      '日高地区・定時制',
      '渡島地区・定時制',
      '上川地区・定時制',
      '留萌地区・定時制',
      '宗谷地区・定時制',
      'オホーツク地区・定時制',
      '十勝地区・定時制',
      '釧路地区・定時制',
      '檜山地区・定時制なし（実機確認済み・データ無し）',
      '根室地区・定時制なし（実機確認済み・データ無し）',
    ],
    pendingDepartments: [],
    note: '全日制hokkaido.tsが数える15地域区分（空知/石狩/札幌市/後志/胆振/日高/渡島/檜山/上川/留萌/宗谷/オホーツク/十勝/釧路/根室）すべてを実機確認済み。13区分にデータがあり、檜山・根室の2区分は定時制セクション自体が存在しないことを確認した（推測ゼロで対象外と整理・存在しないものは収録しようがないためcomplete扱いとする。okinawa.tsのofficialSubtotals空のままcomplete扱いとした前例と同型）。',
  },
  records: [
    // ===== （空知）定時制 =====
    { schoolName: '岩見沢東', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '滝川', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.18 },
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
    // ===== （札幌市）定時制 =====
    { schoolName: '市立札幌大通', department: '普通（午前部）', quota: 110, finalApplicants: 125, finalRate: 1.14 },
    { schoolName: '市立札幌大通', department: '普通（午後部）', quota: 90, finalApplicants: 110, finalRate: 1.22 },
    { schoolName: '市立札幌大通', department: '普通（夜間部）', quota: 90, finalApplicants: 66, finalRate: 0.73 },
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
    // ===== （上川）定時制 =====
    { schoolName: '旭川東', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '旭川北', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '士別東', department: '普通', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '幌加内', department: '農業', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '旭川工業', department: '電気', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '旭川工業', department: '建築・土木', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '旭川商業', department: '商業', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    // ===== （留萌）定時制 =====
    { schoolName: '天売', department: '普通', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    // ===== （宗谷）定時制 =====
    { schoolName: '稚内', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    // ===== （オホーツク）定時制 =====
    { schoolName: '北見北斗', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '網走南ケ丘', department: '普通', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '遠軽', department: '普通', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    // ===== （十勝）定時制 =====
    { schoolName: '帯広柏葉', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    // ===== （釧路）定時制 =====
    { schoolName: '釧路湖陵', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '釧路工業', department: '機械', quota: 40, finalApplicants: 3, finalRate: 0.08 },
  ],
  officialSubtotals: [],
};
