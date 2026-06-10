'use client';

import * as React from 'react';

import { EVENTS, installScrollDepthTracking, track } from '@/lib/track';

/**
 * サイト全体の行動計装（GA4）。layout に1つだけ置く。
 *  - スクロール深度（25/50/75/100）を一度ずつ。
 *  - rage click（短時間に同一付近を連打＝フラストレーションの兆候）。UX/CVRの目詰まり検知。
 *
 * 計測のみで描画なし。GA4未設定なら track() が no-op なので無害。
 */
export function SiteEngagementTracker() {
  React.useEffect(() => {
    const removeScroll = installScrollDepthTracking();

    // ── rage click 検知 ──
    const WINDOW_MS = 1000;
    const RADIUS = 32; // px
    const THRESHOLD = 3; // 連打回数
    let clicks: { x: number; y: number; t: number }[] = [];

    function onClick(e: MouseEvent) {
      const now = Date.now();
      clicks = clicks.filter((c) => now - c.t < WINDOW_MS);
      clicks.push({ x: e.clientX, y: e.clientY, t: now });
      const near = clicks.filter(
        (c) => Math.abs(c.x - e.clientX) < RADIUS && Math.abs(c.y - e.clientY) < RADIUS
      );
      if (near.length >= THRESHOLD) {
        track(EVENTS.RAGE_CLICK, {
          page: window.location.pathname,
          count: near.length,
        });
        clicks = []; // 多重発火を防ぐ
      }
    }

    document.addEventListener('click', onClick);
    return () => {
      removeScroll();
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
