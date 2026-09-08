import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 福岡県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ・coverage='partial'）。
 *
 * 一次ソース: 福岡県教育委員会「（定時制）高等学校入学定員・志願者数・志願率（公立）」
 * （全1頁・全日制`src/data/competition-rates/fukuoka.ts`の収集元ハブページ
 * `https://www.pref.fukuoka.lg.jp/site/kyouiku/nyushi8.html`に掲載された兄弟PDF）。
 * https://www.pref.fukuoka.lg.jp/uploaded/life/806459_62802782_misc.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、同じハブページに定時制専用PDFが
 * 別途公開されていた。16校16レコード（京都・小倉南・若松・八幡中央・福岡工業[工業技術科]・
 * 筑紫中央・糸島・明善・大川樟風・三池工業[機械・電気科]・福島・浮羽工業・朝倉・嘉穂東・
 * ※嘉穂総合[生活情報科・市立分校]・鞍手）の完全な学校別内訳が存在した。
 *
 * quotaは「入学定員(a)」列、finalApplicantsは「確定数」列の「志願者数(c)」（変更前(b)ではなく
 * 志願変更後の確定値を採用・他県と同じ規律）、finalRateは「確定数」列の「c/a」を採用。
 * 「県立計」680/272/0.40・「市立計」40/28/0.70（※嘉穂総合1校のみ）・「合計」720/300/0.42の
 * 3段階すべてが機械集計と完全一致した（初回転記で一致・再修正なし）。
 *
 * ⚠️coverage.status='partial'とした理由（Y-0憲法③捏造ゼロ）: このPDFの注記②に「単位制課程を
 * 除く」と明記されており、単位制の定時制課程（別PDF「定時制単位制課程２期入学試験入学志願状況」
 * https://www.pref.fukuoka.lg.jp/uploaded/life/806459_62802783_misc.pdf・全2頁）は対象外。
 * この別PDFは1期・2期に分かれた複数の小規模校（学科名・校名ラベルが表内で判読困難な複雑な
 * レイアウト）を含み、本タスクの時間内で正確な学校名対応が取れなかったため、無理に転記せず
 * pendingDepartmentsに正直に記録した（存在は確認済み・未収録）。
 *
 * pdftotextでは数字は抽出可能だが日本語ラベルは全欠落（罫線内の位置がズレて誤読の危険がある
 * ため）、pdftoppm 200dpiのビジョン解析1回で全16レコードを判読した。
 */

export const FUKUOKA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'fukuoka',
  sources: [
    {
      url: 'https://www.pref.fukuoka.lg.jp/uploaded/life/806459_62802782_misc.pdf',
      docTitle: '福岡県教育委員会（定時制）高等学校入学定員・志願者数・志願率（公立）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['定時制（単位制課程を除く）'],
    pendingDepartments: ['定時制単位制課程（2期入学試験含む・複雑なレイアウトのため今回は未収録）'],
    note: '「単位制課程を除く」定時制16校16レコードを完全収録。単位制課程は別PDFの存在のみ確認し未収録（正直にpendingDepartments記録）。',
  },
  records: [
    { schoolName: '京都', department: '普通科', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '小倉南', department: '普通科', quota: 120, finalApplicants: 47, finalRate: 0.39 },
    { schoolName: '若松', department: '普通科', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '八幡中央', department: '普通科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '福岡工業', department: '工業技術科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '筑紫中央', department: '普通科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '糸島', department: '普通科', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '明善', department: '普通科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '大川樟風', department: '普通科', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '三池工業', department: '機械・電気科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '福島', department: '普通科', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '浮羽工業', department: '普通科', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '朝倉', department: '普通科', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '嘉穂東', department: '普通科', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '嘉穂総合（市立分校）', department: '生活情報科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '鞍手', department: '普通科', quota: 40, finalApplicants: 19, finalRate: 0.48 },
  ],
  officialSubtotals: [
    { label: '県立計', schoolCount: 15, quota: 680, finalApplicants: 272, finalRate: 0.4 },
    { label: '市立計', schoolCount: 1, quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { label: '合計', schoolCount: 16, quota: 720, finalApplicants: 300, finalRate: 0.42 },
  ],
};
