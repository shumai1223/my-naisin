import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 福島県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 福島県教育委員会「令和8年度福島県立高等学校入学者選抜後期選抜志願状況
 * （出願先変更後）」（既存の全日制`src/data/competition-rates/fukushima.ts`と同一PDF・全2頁の
 * 2頁目下段「2 定時制」）。画像スキャンPDF（テキスト層なし）のためpdftotextは0バイト。
 * https://www.pref.fukushima.lg.jp/uploaded/attachment/735188.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と全く同一のPDF
 * （2頁目下段）に独立した「2 定時制」セクションがあり、6校8レコード（福島工業[定時]・
 * ふくしま新世・郡山萌世[普通科昼間主コース/普通科夜間主コース]・白河第二・会津第二・
 * いわき翠の杜[普通科昼間主コース/普通科夜間主コース]）の完全な学校別内訳が存在した。
 * 過去のセッションが低いdpiで画像確認を断念した際、1頁目「1 全日制」の存在は把握できても
 * 2頁目末尾の「2 定時制」小テーブルまで到達できなかった可能性が高い。
 *
 * quotaは「後期選抜募集定員」列（募集定員から前期選抜内定者数を控除した実質枠。全日制
 * fukushima.tsと同じ列）、finalApplicantsは「志願者数」列の「出願先変更後」（＝志願変更後の
 * 確定値）を採用。倍率は資料に印字が無いため全日制fukushima.tsと同じ規律で自前算出
 * （finalRate=finalApplicants/quota、小数第2位に四捨五入）。
 *
 * 機械集計（quota200・applicants9、6校8レコード）が「定時制　合計」200/9（出願先変更後列）と
 * 完全一致した（初回転記で一致・再修正なし）。pdftoppm 150dpiのビジョン解析1回で全8レコードを
 * 判読できた（過去セッションの「低解像度で断念」判定は今回も誤りだったと確認）。
 */

export const FUKUSHIMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'fukushima',
  sources: [
    {
      url: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/735188.pdf',
      docTitle: '福島県教育委員会 令和8年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後・定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制（後期選抜）'],
    pendingDepartments: [],
    note: '「2 定時制」セクションの全8レコード（6校）を完全収録。',
  },
  records: [
    { schoolName: '福島工業（定時）', department: '工業科', quota: 37, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: 'ふくしま新世', department: '普通科', quota: 23, finalApplicants: 3, finalRate: 0.13 },
    { schoolName: '郡山萌世', department: '普通科（昼間主コース）', quota: 5, finalApplicants: 1, finalRate: 0.2 },
    { schoolName: '郡山萌世', department: '普通科（夜間主コース）', quota: 26, finalApplicants: 1, finalRate: 0.04 },
    { schoolName: '白河第二', department: '普通科', quota: 19, finalApplicants: 0, finalRate: 0 },
    { schoolName: '会津第二', department: '普通科', quota: 30, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'いわき翠の杜', department: '普通科（昼間主コース）', quota: 23, finalApplicants: 3, finalRate: 0.13 },
    { schoolName: 'いわき翠の杜', department: '普通科（夜間主コース）', quota: 37, finalApplicants: 0, finalRate: 0 },
  ],
  officialSubtotals: [{ label: '定時制　合計', schoolCount: 6, quota: 200, finalApplicants: 9, finalRate: 0.05 }],
};
