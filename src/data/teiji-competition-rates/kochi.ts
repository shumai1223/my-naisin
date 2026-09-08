import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 高知県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ・coverage='partial'）。
 *
 * 一次ソース: 高知県教育委員会「令和8年度高知県公立高等学校Ａ日程等志願先変更後の志願者等の状況
 * （学校別）」（既存の全日制`src/data/competition-rates/kochi.ts`と同一PDF・全2頁の2頁目下段
 * 「多部制単位制」セクション）。
 * https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_henkougo0205.pdf
 *
 * ⚠️高知県は「定時制」という名称の代わりに「多部制単位制」という呼称を使うため、S1-3台帳の
 * 定型文grepでは所在不明（C分類）と判定されていた。WebSearchで裏取りしたところ、この区分に
 * 属する2校（中芸・高知北）はいずれも全国統計上の定時制（高知北は「定時制昼間部・定時制夜間部・
 * 通信制」の単位制3課程を持つ学校とWikipediaで確認）であり、当PDFの「多部制単位制」表に記載の
 * 学科（中芸「普通(昼)」・高知北「普通(昼)」）は定時制の**昼間部（A日程で選抜する課程）のみ**。
 *
 * quotaは「募集定員」列、finalApplicantsは「第1志望者数（学校計）」列、finalRateは「志願率」列
 * （＝第1志望者数÷募集定員・印字済み値をそのまま採用）。機械集計（quota120・applicants61、
 * 2校2レコード）が「合計」120/61/0.51と完全一致した（初回転記で一致・再修正なし）。
 *
 * ⚠️coverage.status='partial'とした理由（Y-0憲法③捏造ゼロ）: このA日程PDFは「多部制単位制
 * 昼間部」のみを対象とし、同じ2校が持つはずの夜間部・通信制課程（高知県教育委員会サイトの
 * ページ一覧にB日程等・こうちフロンティア募集等の別PDF群があるが、夜間部・通信制単体の学校別
 * 志願者数PDFは今回のタスク時間内で特定できなかった）は対象外。無理に推測せずpendingDepartments
 * に正直に記録した。
 *
 * pdftotextでは日本語ラベルが全欠落（罫線・数字は明瞭）のため、pdftoppm 150dpiのビジョン解析
 * 1回で全2レコードを判読した。
 */

export const KOCHI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kochi',
  sources: [
    {
      url: 'https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_henkougo0205.pdf',
      docTitle: '高知県教育委員会 令和8年度高知県公立高等学校Ａ日程等志願先変更後の志願者等の状況（多部制単位制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['多部制単位制（定時制昼間部・A日程分のみ）'],
    pendingDepartments: ['定時制夜間部（高知北等）', '通信制（高知北等）'],
    note: 'A日程「多部制単位制」表の全2レコード（2校・定時制昼間部相当）を収録。同じ学校が持つ夜間部・通信制課程は別選抜日程/別PDFの可能性が高く今回は未特定のため正直にpendingDepartments記録。',
  },
  records: [
    { schoolName: '中芸', department: '普通（昼）', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '高知北', department: '普通（昼）', quota: 80, finalApplicants: 55, finalRate: 0.69 },
  ],
  officialSubtotals: [{ label: '合計', schoolCount: 2, quota: 120, finalApplicants: 61, finalRate: 0.51 }],
};
