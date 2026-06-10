/**
 * 自作 A/Bテスト基盤（ライブラリ0・依存0）。
 *
 * 設計：
 *  - 端末ごとに安定したクライアントID（cookie + localStorage）を一度だけ発行。
 *  - 実験ID×クライアントIDの決定論的ハッシュでバケットを割り当てる
 *    （= リロードしても同じ人は同じ群。サーバー/クライアントで同じ結果＝SSRでもズレない）。
 *  - 割当が決まったら GA4 へ experiment_impression（experiment_id × variant）を一度だけ送出し、
 *    既存のファネルイベント（cta_view / affiliate_click / lead_submit）と GA4 上で突合する。
 *
 * 純粋関数（hash / assignVariant）は window 非依存でユニットテスト可能。
 * 実利用は src/components/ab/useExperiment.ts（'use client'）のフック経由。
 */

import { EVENTS, track } from '@/lib/track';

/** cyrb53：高速・低衝突の文字列ハッシュ（暗号用途ではない）。決定論的バケットに使う。 */
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export interface Variant<T extends string = string> {
  id: T;
  /** 重み（既定1）。例: [{id:'a',weight:1},{id:'b',weight:1}] で50/50。 */
  weight?: number;
}

/**
 * 実験ID×クライアントIDから決定論的にバリアントを割り当てる（純粋関数）。
 * 重み付き。clientId が空でも安定（その場合は実験IDのみで割り当て）。
 */
export function assignVariant<T extends string>(
  experimentId: string,
  clientId: string,
  variants: Variant<T>[]
): T {
  if (variants.length === 0) {
    throw new Error('assignVariant: variants must not be empty');
  }
  const totalWeight = variants.reduce((s, v) => s + (v.weight ?? 1), 0);
  // 0..1 の安定した位置を得る
  const position = (cyrb53(`${experimentId}:${clientId}`) % 100000) / 100000;
  let cursor = position * totalWeight;
  for (const v of variants) {
    cursor -= v.weight ?? 1;
    if (cursor < 0) return v.id;
  }
  return variants[variants.length - 1].id;
}

const CLIENT_ID_KEY = 'mn_ab_cid';
const CLIENT_ID_MAX_AGE = 60 * 60 * 24 * 365; // 1年

/** 安定したクライアントIDを生成（衝突しにくいランダム）。 */
function generateClientId(): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return rand.replace(/-/g, '').slice(0, 24);
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * 端末のクライアントIDを取得（無ければ発行して cookie + localStorage に保存）。
 * SSR（window非依存）では空文字を返す＝サーバーでは全員同一群にせず、初回クライアントで確定。
 */
export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const fromCookie = readCookie(CLIENT_ID_KEY);
    if (fromCookie) return fromCookie;
    const fromLs = window.localStorage.getItem(CLIENT_ID_KEY);
    if (fromLs) {
      document.cookie = `${CLIENT_ID_KEY}=${fromLs}; path=/; max-age=${CLIENT_ID_MAX_AGE}; SameSite=Lax`;
      return fromLs;
    }
    const id = generateClientId();
    window.localStorage.setItem(CLIENT_ID_KEY, id);
    document.cookie = `${CLIENT_ID_KEY}=${id}; path=/; max-age=${CLIENT_ID_MAX_AGE}; SameSite=Lax`;
    return id;
  } catch {
    // localStorage/cookie が使えない環境（プライベートモード等）はセッション限りのIDで継続
    return generateClientId();
  }
}

/** experiment_impression を GA4 に送る（割当確定時に一度）。 */
export function trackExperimentImpression(experimentId: string, variant: string): void {
  track(EVENTS.EXPERIMENT_IMPRESSION, { experiment_id: experimentId, variant });
}
