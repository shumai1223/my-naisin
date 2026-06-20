'use client';

import { useEffect } from 'react';

/**
 * AdSense 広告枠（手動配置ユニット）。
 *
 * 重要: `NEXT_PUBLIC_ADSENSE_ENABLED === '1'` のときだけ描画する。
 * → AdSense審査中は何も出さず（休眠）、承認後に環境変数を1にした瞬間に全枠が点火する。
 *
 * 使い方（承認後）:
 *   1) AdSenseコンソールで広告ユニットを作成し data-ad-slot のIDを取得
 *   2) <AdSlot slot="1234567890" /> を本文中の高エンゲージ位置に設置
 *   3) 本番環境変数 NEXT_PUBLIC_ADSENSE_ENABLED=1 を設定して再デプロイ
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
  /** AdSenseコンソールで発行される data-ad-slot のID（承認後に取得） */
  slot: string;
  /** 'auto'（レスポンシブ）/ 'fluid'（記事内）など */
  format?: string;
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

export function AdSlot({ slot, format = 'auto', responsive = true, className = '', style, minHeight = 250 }: AdSlotProps) {
  // 二重ガード：env で点火していても、スロットIDが未差し替え（'0000000000'等）なら描画しない。
  // → 承認後に「envだけ先に1にしてID差し替えを忘れる」事故で、本番に空/壊れ広告が出るのを防ぐ。
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
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...(minHeight > 0 ? { minHeight } : {}), ...style }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
