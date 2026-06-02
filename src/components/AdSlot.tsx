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
}

export function AdSlot({ slot, format = 'auto', responsive = true, className = '', style }: AdSlotProps) {
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === '1';

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* 重複pushやブロッカーは無視 */
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
