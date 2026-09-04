import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 宮城県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 宮城県教育庁高校教育課「令和8年度宮城県公立高等学校入学者選抜に係る第一次募集
 * 出願状況について（学校・学科別出願状況）」（令和8年2月13日発表・全8頁）
 * https://www.pref.miyagi.jp/documents/63612/0213_r8kouritukoukou_nyuugakusyasenbatsu_gakuryokukensa.pdf
 * （既存の全日制`src/data/competition-rates/miyagi.ts`と同一PDFの6頁目「≪定時制課程≫」）。
 *
 * ⚠️対象範囲=定時制課程12校20レコード（複数の部・時間帯を持つ学校は部ごとに別レコード）。
 * 同一PDF内の「≪連携型選抜≫」（南三陸・過疎地域向けの別選抜方式）と「≪全国募集選抜≫」
 * （中新田・南三陸の島留学枠）は定時制・通信制のいずれでもない別制度のため対象外。
 *
 * 機械集計（quota960・applicants370・倍率0.39）は頁末尾の印字済み「定時制合計」960/370/0.39と
 * 完全一致した。仙台大志・仙台工は資料上「※市立高等学校」の注記があるが学校名はそのまま採用
 * （他県の市立高校表記と同型）。ToUnicode欠落は無く`pdftoppm 150dpi`のビジョン解析1回で
 * 全20レコードを判読できた。
 */

export const MIYAGI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'miyagi',
  sources: [
    {
      url: 'https://www.pref.miyagi.jp/documents/63612/0213_r8kouritukoukou_nyuugakusyasenbatsu_gakuryokukensa.pdf',
      docTitle: '宮城県教育庁高校教育課 令和8年度宮城県公立高等学校入学者選抜 第一次募集 学校・学科別出願状況（定時制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程'],
    pendingDepartments: [],
    note: '6頁目「≪定時制課程≫」の全20レコードを完全収録。連携型選抜・全国募集選抜は別制度のため対象外。',
  },
  records: [
    { schoolName: '白石七ヶ宿', department: '普通科／昼', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '宮城二工', department: '電子機械科／夜', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '宮城二工', department: '電気科／夜', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '名取', department: '普通科／夜', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '貞山', department: '普通科／昼', quota: 120, finalApplicants: 66, finalRate: 0.55 },
    { schoolName: '貞山', department: '普通科／夜', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '古川工', department: '機械科／夜', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '古川工', department: '電気科／夜', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '田尻さくら', department: '普通科／Ⅰ部（午前）', quota: 80, finalApplicants: 57, finalRate: 0.71 },
    { schoolName: '田尻さくら', department: '普通科／Ⅱ部（午後夕間）', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '佐沼', department: '普通科／夜', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '東松島', department: '普通科／Ⅰ部（午前）', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '東松島', department: '普通科／Ⅱ部（午後）', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '東松島', department: '普通科／Ⅲ部（夜間）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '石巻北飯野川', department: '普通科／昼', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '気仙沼', department: '普通科／夜', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '仙台大志', department: '普通科／Ⅰ部（午前午後）', quota: 90, finalApplicants: 80, finalRate: 0.89 },
    { schoolName: '仙台大志', department: '普通科／Ⅱ部（午後夜間）', quota: 30, finalApplicants: 10, finalRate: 0.33 },
    { schoolName: '仙台工', department: '建築土木科／夜', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '仙台工', department: '機械システム科／夜', quota: 40, finalApplicants: 6, finalRate: 0.15 },
  ],
  officialSubtotals: [{ label: '定時制合計', quota: 960, finalApplicants: 370, finalRate: 0.39 }],
};
