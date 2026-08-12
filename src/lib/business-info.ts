/**
 * 事業者情報の単一ソース（特定商取引法の表記・見積書等で共通利用）。
 *
 * 事業者名・所在地・連絡先はPII（個人情報）であり、未成年運営のため契約主体は
 * 親権者名義とする方針が確定している（2026-08-11 👤裁定）。実際の値はloopが記録せず、
 * 👤が入力する（C7）。それまでは全ての利用箇所でこの「準備中」文言を単一のソースとして
 * 参照し、ページごとに表記がずれることを防ぐ。
 */
export const BUSINESS_INFO = {
  sellerName: '準備中（親権者名義で表記予定）',
  responsiblePerson: '準備中',
  address: '準備中（ご請求があれば遅滞なく開示いたします）',
  phone: '準備中',
} as const;

/** 事業者情報がまだ実値化されていないか（見積書等で警告表示の要否判定に使う）。 */
export function isBusinessInfoPending(): boolean {
  return BUSINESS_INFO.sellerName.startsWith('準備中');
}
