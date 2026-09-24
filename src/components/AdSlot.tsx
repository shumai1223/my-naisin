'use client';

import { useEffect } from 'react';
import { AD_UNITS, adUnitAttributes, type AdUnitKey } from '@/lib/ad-units';

/**
 * AdSense 広告枠（手動配置ユニット）。
 *
 * 重要: `NEXT_PUBLIC_ADSENSE_ENABLED === '1'` のときだけ描画する。
 * → 点火前は何も出さず（休眠・CLSも出ない）、環境変数を1にした瞬間に全枠が点火する。
 *
 * ⚠️ このコンポーネントは client なので NEXT_PUBLIC_* は **ビルド時に埋め込まれる**。
 *   wrangler.jsonc の vars（実行時）には効かない。点火は Cloudflare Workers Builds の
 *   「ビルド変数」に NEXT_PUBLIC_ADSENSE_ENABLED=1 を入れて再ビルド（＝push）する。
 *
 * 使い方: 置く側は <AdUnit unit="RESULT_BELOW" /> のようにキーで指定する
 * （ユニットIDと種類は src/lib/ad-units.ts に一元化・置き場所の契約は ad-placement.test.ts）。
 * 描画時は「スポンサーリンク」ラベルと上下余白を付ける（広告と分かる表示・誤クリックを誘わない余白）。
 *
 * スクリプト本体（adsbygoogle.js）は layout.tsx で読み込み済み。
 */

const AD_CLIENT = 'ca-pub-7817682248719138';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** AdSenseコンソールで発行される data-ad-slot のID */
  slot: string;
  /** 'auto'（レスポンシブ）/ 'fluid'（記事内）/ 'autorelaxed'（Multiplex）など */
  format?: string;
  /** 記事内広告は 'in-article'（管理画面のコードどおり data-ad-layout を出す） */
  layout?: string;
  /** false で data-full-width-responsive を出さない（記事内・Multiplexの管理画面コードに無いため） */
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** CLS対策の予約高さ(px)。既定250。0で予約しない（高さ完全可変の枠用）。 */
  minHeight?: number;
}

/** プレースホルダ（未差し替え）のスロットIDか。'0000000000' / 空 / 数字以外を弾く。 */
export function isPlaceholderSlot(slot: string): boolean {
  const s = slot.trim();
  return s === '' || /^0+$/.test(s) || !/^\d+$/.test(s);
}

/** env と スロットIDの両ガードを通って実際に描画するか（純粋・テスト可能）。 */
export function isAdSlotEnabled(slot: string, envEnabled: string | undefined): boolean {
  return envEnabled === '1' && !isPlaceholderSlot(slot);
}

export function AdSlot({
  slot,
  format = 'auto',
  layout,
  responsive = true,
  className = '',
  style,
  minHeight = 250,
}: AdSlotProps) {
  // 二重ガード：env で点火していても、スロットIDが未差し替え（'0000000000'等）なら描画しない。
  // → 「envだけ先に1にしてID差し替えを忘れる」事故で、本番に空/壊れ広告が出るのを防ぐ。
  const enabled = isAdSlotEnabled(slot, process.env.NEXT_PUBLIC_ADSENSE_ENABLED);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* 重複pushやブロッカーは無視 */
    }
  }, [enabled]);

  if (!enabled) return null;

  // CLS対策（B3）：広告が遅れて充填される前に高さを予約し、レイアウトシフトを0にする。
  // minHeight=0 を渡せば予約しない（高さ完全可変の枠用）。広告は予約高さを超えて伸びる分には問題ない。
  return (
    <aside aria-label="広告" className="my-6 print:hidden">
      <p className="mb-1 text-[10px] leading-none text-slate-400">スポンサーリンク</p>
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: 'block', ...(minHeight > 0 ? { minHeight } : {}), ...style }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </aside>
  );
}

/**
 * ユニット名（RESULT_BELOW 等）で置く。ID・種類（記事内/Multiplex）・予約高さは ad-units.ts が決める。
 */
export function AdUnit({ unit }: { unit: AdUnitKey }) {
  const spec = AD_UNITS[unit];
  const attrs = adUnitAttributes(spec.kind);
  return (
    <AdSlot
      slot={spec.slot}
      format={attrs.format}
      layout={attrs.layout}
      responsive={attrs.fullWidthResponsive === true}
      minHeight={spec.minHeight}
      style={spec.kind === 'in-article' ? { textAlign: 'center' } : undefined}
    />
  );
}
