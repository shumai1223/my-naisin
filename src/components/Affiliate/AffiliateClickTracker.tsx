'use client';

import * as React from 'react';

import { track, type TrackParams } from '@/lib/track';

/** AffiliateAdが付与するdata属性（アンカーのdataset相当）。 */
export interface AffiliateAnchorAttrs {
  affId?: string | null;
  affName?: string | null;
  placement?: string | null;
  pref?: string | null;
  variant?: string | null;
}

/**
 * アンカーのdata属性からaffiliate_clickのtrackパラメータを組み立てる（純粋関数・テスト可能）。
 * placement/pref/variantはAffiliateAd側で未指定なら属性自体が付かないため、値が無いキーは送らない
 * （GA4に空文字列や"undefined"文字列を送り込まないための既存ctxParams()と同じ設計）。
 */
export function buildAffiliateClickParams(attrs: AffiliateAnchorAttrs, page: string): TrackParams {
  return {
    program: attrs.affId ?? 'unknown',
    name: attrs.affName ?? '',
    page,
    ...(attrs.placement ? { placement: attrs.placement } : {}),
    ...(attrs.pref ? { pref: attrs.pref } : {}),
    ...(attrs.variant ? { variant: attrs.variant } : {}),
  };
}

/**
 * アフィリエイトリンクのクリックを GA4 に送る単一のクリック委譲リスナー。
 *
 * 目的：「勝ち案件への集約」を勘でなくデータで決めるための先行指標。
 *  - A8管理画面はプログラム別の成約しか見えず、どのページから押されたかが分からない。
 *  - 同じ案件（例: 森塾）を複数の県ページが共有するため、県別の効きを GA4 で測る必要がある。
 *  - S-6：ParentLeadCTAExperiment経由のoffer/color A/Bはplacement/variantも載せ、
 *    experiment_impressionとのセッション突合に頼らずjudgeWinnerへ直接集計できるようにする。
 *
 * 実装：AffiliateAd が各リンクに付ける data-aff-id / data-aff-name / data-placement / data-pref /
 * data-variant を、document への 1 個のリスナーで拾う（全配置箇所を触らずに計測できる）。
 * 成約（lagging）は A8、クリック（leading）は GA4 で、program × page（× placement/variant）を見る。
 */
export function AffiliateClickTracker() {
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLElement>('[data-aff-id]');
      if (!anchor) return;
      const params = buildAffiliateClickParams(
        {
          affId: anchor.getAttribute('data-aff-id'),
          affName: anchor.getAttribute('data-aff-name'),
          placement: anchor.getAttribute('data-placement'),
          pref: anchor.getAttribute('data-pref'),
          variant: anchor.getAttribute('data-variant'),
        },
        window.location.pathname
      );
      track('affiliate_click', params);
    }
    // capture: ターゲットが新規タブで開く前に確実に拾う
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
