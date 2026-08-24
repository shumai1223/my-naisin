/**
 * 北海道 多年度アーカイブ（Λ-4）。
 *
 * **2026-08-06判明: 北海道は他タスク(Y-6・Λ-4以前の複数セッション)で「教委公式サイトの
 * 該当URL(dokyoi.pref.hokkaido.lg.jp/hk/gks/177706.html)が恒久的に404」として恒久ブロック
 * 扱いだったが、これは「令和8年度【再出願後の出願状況】」という特定の速報ページのみが
 * リンク切れなのであって、教委サイト自体は生きており、同じ教委の別ページ「R7入学者選抜
 * 状況報告書」(hk/gks/117975.html)は正常にアクセスできると判明した。このページはPDF3分割
 * （出願者の概要／出願者の状況／学校別受検者数及び合格者数）で構成され、「出願者の状況」PDF
 * の第1表に学科区分別（普通/農業/工業/商業/水産/家庭/看護/福祉/理数/体育/外国語/工芸/
 * 数理データサイエンス/総合）の出願者数・定員・倍率が完備されている。北海道は他県のような
 * 「全日制計」の単一集計ではなく学科区分別の内訳を持つため、tokyo/hiroshima/saitamaと同じ
 * granularity='category-detail'で収録できる（Λ-2 department-category対応表の対象県が
 * 4県目に増える）。
 *
 * 一次ソース: 北海道教育委員会「R7入学者選抜状況報告書」(令和7年度＝2025年度入学者選抜)
 * https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/117975.html
 * PDF(出願者の概要): https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/0/5/0/3/1/7/_/p01_syutugansyagaiyo.pdf
 * PDF(出願者の状況・第1表): https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/0/5/0/3/1/8/_/p02-06_syutugansyanozyoukyou.pdf
 *
 * 全日制の「第１次」出願者数（第2次募集分・定時制は含まない）を採用。この報告書自体の
 * 「出願者の概要」(1頁)でも全日制出願者数(本年3月中学校卒業者28,296＋過年度卒業者30＝
 * 28,326)・募集人員(全日制+定時制合計31,336から定時制1,970を引いた29,366)として同じ
 * 全日制のみの区分が独立して示されており、内部整合性を確認済み。学科区分14種の
 * quota/applicants合計はそれぞれ29,366／28,326と1件ずつ完全一致（sumCategories突合済み・
 * __tests__/hokkaido.test.ts参照）。倍率は原資料の「倍率A/B」（A=受検者数、B=定員）ではなく、
 * 他県との一貫性のためapplicants/quotaで自前算出し直した（他県のΛ-4方針を踏襲）。
 *
 * 定時制課程・第２次募集はY-6・他県と同じ理由でスコープ外。過年度中学校卒業者分は「本年3月
 * 中学校卒業者」の出願者数に合算済み（区分別の内訳PDFでは合算済みの数値のみが区分ごとに
 * 印字されており、過年度卒業者を区分別に分離することはできない）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 当初「R5入学者選抜状況報告書」としてWebSearchでヒットしたURL
 * (hk/gks/156952.html)を開いたところ、実際のページタイトルは「R8入学者選抜状況報告書」で
 * あり検索結果のタイトルが古い/誤っていたと判明(令和2年度当時のURLをR8年度分が再利用して
 * いる可能性)。R5は収録できなかったが、代わりに最新のR8年度分を新規収録できた。学科区分14種の
 * 合計はquota=29,116・applicants=27,126で全日制「合計」行と完全一致（sumCategories突合済み）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/6/0/_/03_p2-p6.pdf',
  sourceTitle: '北海道教育委員会 R8入学者選抜状況報告書「§1 出願者の状況 第1表 課程・学科別出願者の状況」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通', quota: 19490, applicants: 19014, rate: 0.98 },
    { label: '農業', quota: 1440, applicants: 983, rate: 0.68 },
    { label: '工業', quota: 2280, applicants: 1941, rate: 0.85 },
    { label: '商業', quota: 2600, applicants: 2235, rate: 0.86 },
    { label: '水産', quota: 320, applicants: 261, rate: 0.82 },
    { label: '家庭', quota: 120, applicants: 112, rate: 0.93 },
    { label: '看護', quota: 120, applicants: 59, rate: 0.49 },
    { label: '福祉', quota: 40, applicants: 25, rate: 0.63 },
    { label: '理数', quota: 320, applicants: 347, rate: 1.08 },
    { label: '体育', quota: 80, applicants: 76, rate: 0.95 },
    { label: '外国語', quota: 120, applicants: 131, rate: 1.09 },
    { label: '工芸', quota: 40, applicants: 37, rate: 0.93 },
    { label: '数理データサイエンス', quota: 80, applicants: 90, rate: 1.13 },
    { label: '総合', quota: 2066, applicants: 1815, rate: 0.88 },
  ],
  grandTotal: { label: '全日制計（第１次出願者数）', quota: 29116, applicants: 27126, rate: 0.93 },
};

/**
 * 令和6年度（2024年度）: R6版報告書(hk/gks/193247.html「R6入学者選抜状況報告書（全体版）」・
 * 令和7年7月29日訂正版)の同一シリーズ「出願者の状況」PDF(第1表)から令和7年度と同じ方法で
 * 収録。学科区分14種の合計はquota=29,730・applicants=28,756で全日制「合計」行と完全一致
 * （sumCategories突合済み）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/0/0/0/0/8/9/_/p02-06_syutugansyanozyoukyou(%E4%BF%AE%E6%AD%A3%E7%89%88).pdf',
  sourceTitle: '北海道教育委員会 R6入学者選抜状況報告書「§1 出願者の状況 第1表 課程・学科別出願者の状況」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通', quota: 19930, applicants: 19973, rate: 1.0 },
    { label: '農業', quota: 1440, applicants: 964, rate: 0.67 },
    { label: '工業', quota: 2320, applicants: 2033, rate: 0.88 },
    { label: '商業', quota: 2720, applicants: 2620, rate: 0.96 },
    { label: '水産', quota: 360, applicants: 277, rate: 0.77 },
    { label: '家庭', quota: 120, applicants: 103, rate: 0.86 },
    { label: '看護', quota: 120, applicants: 58, rate: 0.48 },
    { label: '福祉', quota: 40, applicants: 9, rate: 0.23 },
    { label: '理数', quota: 320, applicants: 365, rate: 1.14 },
    { label: '体育', quota: 80, applicants: 103, rate: 1.29 },
    { label: '外国語', quota: 120, applicants: 143, rate: 1.19 },
    { label: '工芸', quota: 40, applicants: 40, rate: 1.0 },
    { label: '数理データサイエンス', quota: 80, applicants: 82, rate: 1.02 },
    { label: '総合', quota: 2040, applicants: 1986, rate: 0.97 },
  ],
  grandTotal: { label: '全日制計（第１次出願者数）', quota: 29730, applicants: 28756, rate: 0.97 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/0/5/0/3/1/8/_/p02-06_syutugansyanozyoukyou.pdf',
  sourceTitle: '北海道教育委員会 R7入学者選抜状況報告書「§1 出願者の状況 第1表 課程・学科別出願者の状況」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通', quota: 19730, applicants: 19926, rate: 1.01 },
    { label: '農業', quota: 1440, applicants: 973, rate: 0.68 },
    { label: '工業', quota: 2280, applicants: 2106, rate: 0.92 },
    { label: '商業', quota: 2640, applicants: 2371, rate: 0.9 },
    { label: '水産', quota: 360, applicants: 251, rate: 0.7 },
    { label: '家庭', quota: 120, applicants: 101, rate: 0.84 },
    { label: '看護', quota: 120, applicants: 67, rate: 0.56 },
    { label: '福祉', quota: 40, applicants: 14, rate: 0.35 },
    { label: '理数', quota: 320, applicants: 389, rate: 1.22 },
    { label: '体育', quota: 80, applicants: 80, rate: 1.0 },
    { label: '外国語', quota: 120, applicants: 130, rate: 1.08 },
    { label: '工芸', quota: 40, applicants: 53, rate: 1.32 },
    { label: '数理データサイエンス', quota: 80, applicants: 70, rate: 0.88 },
    { label: '総合', quota: 1996, applicants: 1795, rate: 0.9 },
  ],
  grandTotal: { label: '全日制計（第１次出願者数）', quota: 29366, applicants: 28326, rate: 0.96 },
};

/**
 * ⚠️2026-08-24追記(R5以前は恒久的に取得不可・再調査不要): 本ファイルが依拠する「入学者選抜状況
 * 報告書」シリーズについて、同日別タスク(Y-6・掛-1系列・src/data/competition-rates/hokkaido.ts)
 * で教委サイトの一覧ページ(hk/gks/koukounyuusenn.html)を直接WebFetchで精読し、**この報告書
 * シリーズは常にR6/R7/R8の直近3年度分のみを公開するローリングウィンドウ方式**であり、R5版への
 * リンクは一覧ページに存在しないことを確認済み(詳細はcompetition-rates/hokkaido.tsのcoverage.note
 * 追記14〜16を参照)。**したがって本ファイルのR6/R7/R8=3年度分は、このシリーズを一次ソースと
 * する限り実質的な上限であり、R5以前の追加調査は不要**（新しい年度が公表されるたびに最古の年度が
 * 既に非公開化されている可能性が高く、過去に遡って取得する経路が無いため）。
 */
export const HOKKAIDO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'hokkaido',
  years: [REIWA_8, REIWA_7, REIWA_6],
};
