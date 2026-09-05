import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 京都府 定時制（昼間定時制・夜間定時制）（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 京都府教育委員会「令和8年度京都府公立高等学校入学者選抜 中期選抜志願者数等
 * 一覧表」（全4頁のうち4頁目が丸ごと「（定時制）」）。
 *
 * ⚠️対象範囲=①昼間定時制・学年制（北桑田美山分校・福知山三和分校の2校）②昼間定時制・単位制
 * （清新1校）③夜間定時制・学年制（綾部東分校・東舞鶴浮島分校の2校）④夜間定時制・単位制
 * （朱雀・鳥羽・桃山[普通/商業の2学科]の3校4レコード）の計8校9レコード。
 *
 * ⚠️quota/finalApplicants/finalRateの定義: 募集定員(中期選抜実施学科)(A)から前期選抜等
 * 合格者数(B)を控除した「中期選抜募集人員(C)=(A-B)」をquotaとして採用（他県の「最終応募人員」
 * に相当）。finalApplicants=志願者数人数(D)、finalRate=印字済み倍率(D/C)をそのまま転記。
 *
 * ⚠️このPDFはpdftoppmが文字破損の警告（Syntax Error）を出すが、画像自体は正常にレンダリング
 * され`pdftoppm 170dpi`のビジョン解析1回で全レコードを判読できた。
 *
 * 機械集計は3段階の自己検算行すべてと完全一致した: ①昼間定時制計106／0／0.00
 * ②夜間定時制計349／85／0.24 ③定時制計（総合計）455／85／0.19。京都府は「小計→計→定時制計」
 * の3段階自己検算に加え「参考:昨年度」の並列比較列もあり、47県中最も充実したソースの一つ。
 */

export const KYOTO_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kyoto',
  sources: [
    {
      url: 'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/05/%E4%BB%A4%E5%92%8C%EF%BC%98%E5%B9%B4%E5%BA%A6%E4%B8%AD%E6%9C%9F%E9%81%B8%E6%8A%9C-%E5%BA%83%E5%A0%B1%E8%B3%87%E6%96%99%EF%BC%88%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%89.pdf',
      docTitle: '京都府教育委員会 令和8年度京都府公立高等学校入学者選抜 中期選抜志願者数等一覧表（定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['昼間定時制・学年制', '昼間定時制・単位制', '夜間定時制・学年制', '夜間定時制・単位制'],
    pendingDepartments: [],
    note: '4頁目「（定時制）」の全9レコードを完全収録。',
  },
  records: [
    { schoolName: '北桑田（美山分校）', department: '農業・家政 [昼間定時制・学年制]', quota: 34, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福知山（三和分校）', department: '農業・家政 [昼間定時制・学年制]', quota: 20, finalApplicants: 0, finalRate: 0 },
    { schoolName: '清新', department: '総合学科 [昼間定時制・単位制]', quota: 52, finalApplicants: 0, finalRate: 0 },
    { schoolName: '綾部（東分校）', department: '普通 [夜間定時制・学年制]', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '東舞鶴（浮島分校）', department: '普通 [夜間定時制・学年制]', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '朱雀', department: '普通 [夜間定時制・単位制]', quota: 90, finalApplicants: 16, finalRate: 0.18 },
    { schoolName: '鳥羽', department: '普通 [夜間定時制・単位制]', quota: 90, finalApplicants: 34, finalRate: 0.38 },
    { schoolName: '桃山', department: '普通 [夜間定時制・単位制]', quota: 59, finalApplicants: 17, finalRate: 0.29 },
    { schoolName: '桃山', department: '商業 [夜間定時制・単位制]', quota: 30, finalApplicants: 6, finalRate: 0.2 },
  ],
  officialSubtotals: [
    { label: '昼間定時制計', quota: 106, finalApplicants: 0, finalRate: 0 },
    { label: '夜間定時制計', quota: 349, finalApplicants: 85, finalRate: 0.24 },
    { label: '定時制計', quota: 455, finalApplicants: 85, finalRate: 0.19 },
  ],
};
