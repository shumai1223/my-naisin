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

export const HOKKAIDO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'hokkaido',
  years: [REIWA_7],
};
