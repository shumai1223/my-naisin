/**
 * AdSense 手動広告ユニットを1か所に集める（T-ADS1・2026-09-24 👤が管理画面で作成済み）。
 *
 * 描画の二重ガード（AdSlot.tsx）: NEXT_PUBLIC_ADSENSE_ENABLED='1' かつ実ユニットID のときだけ出る。
 * env が未点火の間は全枠が何も描画しない（CLSも出ない）。
 *
 * ユニットを4種に分けているのは「どの位置がいくら稼いだか」をAdSense管理画面で分けて見るため
 * （2週間後の配置見直しの材料＝ops/tasks/T-ADS1 §6）。位置を変えたらユニット名との対応が崩れるので、
 * 置き場所の契約は src/lib/__tests__/ad-placement.test.ts で固定している。
 *
 * ⚠️ 管理画面のコードに付いている adsbygoogle.js の <script> はページごとに貼らない（layout.tsx で1回読み込み済み）。
 */
export type AdUnitKind = 'display' | 'in-article' | 'multiplex';

export interface AdUnitSpec {
  /** AdSense の data-ad-slot */
  slot: string;
  /** 管理画面での広告の種類（<ins> に必要な属性がこれで決まる） */
  kind: AdUnitKind;
  /** CLS対策の予約高さ(px) */
  minHeight: number;
}

export const AD_UNITS = {
  /** 計算機の結果＋保護者CTAの直後・答え（表・換算結果）の直後。ディスプレイ（レスポンシブ） `mn-result-below` */
  RESULT_BELOW: { slot: '1489568761', kind: 'display', minHeight: 250 },
  /** 解説・表・推移の途中。ディスプレイ（レスポンシブ） `mn-in-content` */
  IN_CONTENT: { slot: '4472981442', kind: 'display', minHeight: 250 },
  /** ブログ本文の途中。記事内広告（fluid） `mn-in-article` */
  IN_ARTICLE: { slot: '5642592886', kind: 'in-article', minHeight: 280 },
  /** 各ページの最下部（フッターの前）。Multiplex（autorelaxed） `mn-page-bottom` */
  PAGE_BOTTOM: { slot: '3128110186', kind: 'multiplex', minHeight: 300 },
} as const satisfies Record<string, AdUnitSpec>;

export type AdUnitKey = keyof typeof AD_UNITS;

/** 種類ごとの <ins> 属性（管理画面が出したコードどおり。記事内とMultiplexには data-full-width-responsive を付けない）。 */
export function adUnitAttributes(kind: AdUnitKind): {
  format: string;
  layout?: string;
  fullWidthResponsive?: boolean;
} {
  switch (kind) {
    case 'in-article':
      return { format: 'fluid', layout: 'in-article' };
    case 'multiplex':
      return { format: 'autorelaxed' };
    default:
      return { format: 'auto', fullWidthResponsive: true };
  }
}
