import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 岩手県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 岩手県教育委員会「令和8年度岩手県立高等学校入学者選抜 志願者数一覧表（調整後）」
 * ＜定時制＞（既存の全日制`src/data/competition-rates/iwate.ts`と同一PDFの4頁目・全日制は
 * 1〜3頁目）。全日制側のヘッダコメントは「全3ページ」としていたが実際は全4ページで、4頁目に
 * 独立した＜定時制＞セクションが存在した。
 * https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/094/015/r8_sigansya_tyouseigo.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、9校12レコード（杜陵[1・2部/3部]・
 * 杜陵奥州[昼間部/夜間部]・盛岡工業[工業科(定)]・一関第一[普通科(定)]・大船渡[普通科(定)]・
 * 釜石[普通科(定)]・宮古[普通科(定)]・久慈長内[昼間部/夜間部]・福岡[普通科(定)]）の完全な
 * 学校別内訳が存在した。全日制と同じ列構成（募集定員/志願者数/志願倍率）で、いわて留学合格者数・
 * 連携型志願者数はいずれも全レコードで「−」（該当なし）のため定員＝募集定員が一致する。
 *
 * quotaは「一次募集　募集定員」列、finalApplicantsは「一次募集　志願者数」列、finalRateは
 * 「一次募集　志願倍率」列（印字済み値をそのまま採用）。機械集計（quota480・applicants109、
 * 9校12レコード）が「合計　9校　12学科(学系)」480/109/0.23と完全一致した（初回転記で一致・
 * 再修正なし）。pdftotextでは日本語ラベルが全欠落（罫線・数字は明瞭）のため、pdftoppm 200dpiの
 * ビジョン解析1回で全12レコードを判読した。
 */

export const IWATE_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'iwate',
  sources: [
    {
      url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/094/015/r8_sigansya_tyouseigo.pdf',
      docTitle: '岩手県教育委員会 令和8年度岩手県立高等学校入学者選抜 志願者数一覧表（調整後）＜定時制＞',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制（一次募集）'],
    pendingDepartments: [],
    note: '定時制セクションの全12レコード（9校）を完全収録。',
  },
  records: [
    { schoolName: '杜陵', department: '普通（1・2部）', quota: 80, finalApplicants: 29, finalRate: 0.36 },
    { schoolName: '杜陵', department: '普通（3部）', quota: 20, finalApplicants: 0, finalRate: 0 },
    { schoolName: '杜陵奥州', department: '普通（昼間部）', quota: 30, finalApplicants: 10, finalRate: 0.33 },
    { schoolName: '杜陵奥州', department: '普通（夜間部）', quota: 30, finalApplicants: 2, finalRate: 0.07 },
    { schoolName: '盛岡工業', department: '工業科（定）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '一関第一', department: '普通科（定）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '大船渡', department: '普通科（定）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '釜石', department: '普通科（定）', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '宮古', department: '普通科（定）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '久慈長内', department: '普通（昼間部）', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '久慈長内', department: '普通（夜間部）', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '福岡', department: '普通科（定）', quota: 40, finalApplicants: 8, finalRate: 0.2 },
  ],
  officialSubtotals: [{ label: '合計', schoolCount: 9, quota: 480, finalApplicants: 109, finalRate: 0.23 }],
};
