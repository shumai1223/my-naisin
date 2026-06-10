'use client';

import * as React from 'react';

import { funnel } from '@/lib/track';

interface CtaViewTrackerProps {
  /** 設置面（result / hensachi / prefecture など）。 */
  placement?: string;
  /** 都道府県コード。 */
  pref?: string;
  /** 送客先プログラム（cta_view を program 別に見たいとき）。 */
  program?: string;
}

/**
 * 換金CTAが視界に入ったら cta_view を一度だけ GA4 に送る計装。
 *
 * 設計：サーバーコンポーネント（ParentLeadCTA）の中に置ける軽量クライアント子。
 * 不可視センチネルを自分自身で監視し、交差したら発火→自動で監視解除。
 * これで「affiliate_click ÷ cta_view」=面ごとの換金率（CTR）が GA4 で取れる。
 */
export function CtaViewTracker({ placement, pref, program }: CtaViewTrackerProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            funnel.ctaView(
              { placement, pref },
              { page: window.location.pathname, ...(program ? { program } : {}) }
            );
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [placement, pref, program]);

  return <span ref={ref} aria-hidden="true" style={{ display: 'block', width: 0, height: 0 }} />;
}
