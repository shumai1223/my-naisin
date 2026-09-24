/**
 * T-TD1: 令和9年度 倍率速報「年度末パック」の売り込み一式が共有する定数・純関数。
 *
 * 価格は `src/data/nendomatsu-pack-pricing.json` の1か所だけ（C7ゲート: 確定は👤）。
 * ONE-PAGER・見積書/請求書ひな形・商品ページ・メール下書き({{PRICE}})はここ経由で差し込む。
 * 納品対象県(coverage)は、実データ(再配布許諾台帳・パーサ登録・公表ハブ台帳)から導出する
 * （`scripts/td1-delivery-ledger.ts` の A/B/C 定義と同じ。手で県名を書かない）。
 */
import pricing from '@/data/nendomatsu-pack-pricing.json';
import { DATA_LICENSE_LEDGER } from '@/lib/data-license-ledger';
import { PREFECTURE_PARSER_REGISTRY } from '@/lib/bairitsu-ingest/registry';
import { PUBLICATION_HUBS } from '@/data/publication-hubs';
import { PREFECTURES } from '@/lib/prefectures';

export const NENDOMATSU_PACK = {
  productName: '令和9年度 公立高校 倍率速報データ 年度末パック',
  issuer: 'My Naishin 運営',
  contractHolder: '國井',
  /** 請求書払いの支払期限。 */
  paymentDeadline: '2027年3月31日',
  /** 当方は適格請求書発行事業者ではない（インボイス）。税込表示。隠すと経理で止まるので必ず書く。 */
  invoiceNotice: '当方は適格請求書発行事業者ではありません。表示金額はすべて税込です。',
  /** 納品時期の約束(案)。TD-9で実測が入るまで「案」。👤が確定する。 */
  deliveryPromise: {
    status: 'proposed' as const,
    A: '県の公表の翌営業日中',
    B: '県の公表から3営業日以内',
  },
} as const;

export type PriceStatus = 'pending' | 'confirmed';

export interface NendomatsuPricing {
  status: PriceStatus;
  provisionalRangeYenTaxIncluded: [number, number];
  confirmedYenTaxIncluded: number | null;
  /** 同時注文の2県目以降・1県あたりの価格（税込）。未設定なら1式の単一価格として扱う。 */
  additionalPrefectureYenTaxIncluded?: number | null;
}

const PRICING: NendomatsuPricing = pricing as unknown as NendomatsuPricing;

export function formatYen(n: number): string {
  return `¥${n.toLocaleString('en-US')}`;
}

/** 価格が確定済みか。status==='confirmed' かつ整数の金額があるときだけtrue（片方だけでは確定と扱わない）。 */
export function isPriceConfirmed(p: NendomatsuPricing = PRICING): boolean {
  return p.status === 'confirmed' && typeof p.confirmedYenTaxIncluded === 'number' && Number.isInteger(p.confirmedYenTaxIncluded) && p.confirmedYenTaxIncluded > 0;
}

/** 確定価格の表示文字列(税込)。未確定なら null（メール下書きへは絶対に差し込まない）。 */
export function confirmedPriceLabel(p: NendomatsuPricing = PRICING): string | null {
  if (!isPriceConfirmed(p)) return null;
  const first = `${formatYen(p.confirmedYenTaxIncluded as number)}（税込）`;
  const add = p.additionalPrefectureYenTaxIncluded;
  if (typeof add === 'number' && Number.isInteger(add) && add > 0) {
    return `1県 ${first}／同時にご注文の2県目以降は1県あたり ${formatYen(add)}（税込）`;
  }
  return first;
}

/** n県を同時に注文したときの合計（税込）。価格未確定なら null。 */
export function totalPriceForPrefectures(n: number, p: NendomatsuPricing = PRICING): number | null {
  if (!isPriceConfirmed(p) || !Number.isInteger(n) || n < 1) return null;
  const add = p.additionalPrefectureYenTaxIncluded;
  const per = typeof add === 'number' && Number.isInteger(add) && add > 0 ? add : (p.confirmedYenTaxIncluded as number);
  return (p.confirmedYenTaxIncluded as number) + per * (n - 1);
}

/** 内部資料・非公開ページ用の表示。未確定のときは「確定待ち」を明示して仮の幅を出す。 */
export function displayPriceLabel(p: NendomatsuPricing = PRICING): string {
  const c = confirmedPriceLabel(p);
  if (c) return c;
  const [lo, hi] = p.provisionalRangeYenTaxIncluded;
  return `価格は確定待ち（仮置き ${formatYen(lo)}〜${formatYen(hi)}・税込）`;
}

export function getPricing(): NendomatsuPricing {
  return PRICING;
}

export type DeliveryClass = 'A' | 'B' | 'C';

export interface CoverageRow {
  code: string;
  name: string;
  deliveryClass: DeliveryClass;
  license: 'ok' | 'ng' | 'unknown';
}

/** 47県の A/B/C と再配布許諾。A=確定パーサ＋R9掲載位置(ハブ)判明 / B=確定パーサのみ / C=それ以外。 */
export function getCoverage(): CoverageRow[] {
  const hubKnown = new Set(PUBLICATION_HUBS.filter((h) => h.r9Url).map((h) => h.prefecture));
  return PREFECTURES.map((p) => {
    const hasParser = !!PREFECTURE_PARSER_REGISTRY[p.code];
    const deliveryClass: DeliveryClass = hasParser ? (hubKnown.has(p.code) ? 'A' : 'B') : 'C';
    return { code: p.code, name: p.name, deliveryClass, license: DATA_LICENSE_LEDGER[p.code]?.redistribution ?? 'unknown' };
  });
}

/** 納品対象＝A+B かつ 再配布許諾ok（fail-closed: unknown/ngは含めない）。 */
export function getDeliverablePrefectures(): CoverageRow[] {
  return getCoverage().filter((r) => r.deliveryClass !== 'C' && r.license === 'ok');
}

/** メール下書き等の {{PRICE}} を置換する。価格未確定なら例外（呼び出し側で何もせず終了させる）。 */
export function fillPricePlaceholders(text: string, p: NendomatsuPricing = PRICING): string {
  const label = confirmedPriceLabel(p);
  if (!label) throw new Error('価格が確定していません（status!=="confirmed"）。置換しません。');
  return text.split('{{PRICE}}').join(label);
}
