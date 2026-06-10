'use client';

import * as React from 'react';

import { track } from '@/lib/track';

/**
 * アフィリエイトリンクのクリックを GA4 に送る単一のクリック委譲リスナー。
 *
 * 目的：「勝ち案件への集約」を勘でなくデータで決めるための先行指標。
 *  - A8管理画面はプログラム別の成約しか見えず、どのページから押されたかが分からない。
 *  - 同じ案件（例: 森塾）を複数の県ページが共有するため、県別の効きを GA4 で測る必要がある。
 *
 * 実装：AffiliateAd が各リンクに付ける data-aff-id / data-aff-name を、
 * document への 1 個のリスナーで拾う（全配置箇所を触らずに計測できる）。
 * 成約（lagging）は A8、クリック（leading）は GA4 で、program × page を見る。
 */
export function AffiliateClickTracker() {
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLElement>('[data-aff-id]');
      if (!anchor) return;
      const program = anchor.getAttribute('data-aff-id') ?? 'unknown';
      const name = anchor.getAttribute('data-aff-name') ?? '';
      track('affiliate_click', {
        program,
        name,
        page: window.location.pathname,
      });
    }
    // capture: ターゲットが新規タブで開く前に確実に拾う
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
