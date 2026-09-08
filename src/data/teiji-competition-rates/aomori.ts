import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 青森県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 青森県教育委員会「令和8年度青森県立高等学校入学者選抜出願状況等（定時制の課程）」
 * （全1頁・全日制`src/data/competition-rates/aomori.ts`の収集元とはファイル名末尾のみ異なる
 * 兄弟PDF: 全日制は`R8senbatsu_syutsugan-zennitisei.pdf`、定時制は
 * `R8senbatsu_syutsugan-teijisei.pdf`）。
 * https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/R8senbatsu_syutsugan-teijisei.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、全日制収集元PDFのURL末尾
 * `-zennitisei`（全日制）を`-teijisei`（定時制）に置換したURLが200で取得でき、6校11レコード
 * （北斗[午前部/午後部/夜間部]・五所川原・尾上総合[総合Ⅰ・Ⅱがくくり募集/総合Ⅲ]・三沢・
 * 田名部・八戸中央[午前部/午後部/夜間部]）の完全な学校別内訳が存在した。
 *
 * quotaは「募集人員」列、finalApplicantsは「学科（部）別出願者数」列、finalRateは「学科（部）
 * 別倍率」列（印字済み値をそのまま採用）。尾上総合の総合(Ⅰ)・総合(Ⅱ)は「入学者募集人員」
 * 「募集人員」を1つのセルで共有する記載（くくり募集）のため、他県と同じ方式で学科名を
 * 「・」区切りの単一レコードとして収録した。
 *
 * 機械集計（quota480・applicants236、6校11レコード）が「定時制の課程合計」行
 * （quota480・applicants236・倍率0.49）と初回転記で完全一致した（再修正なし）。ToUnicode欠落で
 * pdftotextは数字のみ抽出可能・日本語ラベルは全欠落したため、pdftoppm 200dpiのビジョン解析
 * 1回で全11レコードを判読した。
 */

export const AOMORI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'aomori',
  sources: [
    {
      url: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/R8senbatsu_syutsugan-teijisei.pdf',
      docTitle: '青森県教育委員会 令和8年度青森県立高等学校入学者選抜出願状況等（定時制の課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制の課程'],
    pendingDepartments: [],
    note: '定時制の課程専用PDFの全11レコード（6校）を完全収録。',
  },
  records: [
    { schoolName: '北斗', department: '普通（午前部）', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '北斗', department: '普通（午後部）', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '北斗', department: '普通（夜間部）', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '五所川原', department: '普通', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '尾上総合', department: '総合（Ⅰ）・総合（Ⅱ）', quota: 80, finalApplicants: 32, finalRate: 0.4 },
    { schoolName: '尾上総合', department: '総合（Ⅲ）', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '三沢', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '田名部', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '八戸中央', department: '普通（午前部）', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '八戸中央', department: '普通（午後部）', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '八戸中央', department: '普通（夜間部）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
  ],
  officialSubtotals: [{ label: '定時制の課程合計', quota: 480, finalApplicants: 236, finalRate: 0.49 }],
};
