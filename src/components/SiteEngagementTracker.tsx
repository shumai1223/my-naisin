'use client';

import * as React from 'react';

import { classifyAiReferrer, EVENTS, installScrollDepthTracking, track } from '@/lib/track';

/**
 * サイト全体の行動計装（GA4）。layout に1つだけ置く。
 *  - スクロール深度（25/50/75/100）を一度ずつ。
 *  - rage click（短時間に同一付近を連打＝フラストレーションの兆候）。UX/CVRの目詰まり検知。
 *
 * 計測のみで描画なし。GA4未設定なら track() が no-op なので無害。
 */
export function SiteEngagementTracker() {
  React.useEffect(() => {
    // ── AI送客（GEO）計装：ChatGPT/Perplexity/Copilot 等からの着地をセッション一度だけ送る ──
    try {
      const src = classifyAiReferrer(document.referrer || '', window.location.search || '');
      if (src && !sessionStorage.getItem('mn_ai_ref')) {
        sessionStorage.setItem('mn_ai_ref', src);
        track(EVENTS.AI_REFERRAL, { source: src, page: window.location.pathname });
      }
    } catch {
      /* sessionStorage 不可環境でも本処理に影響させない */
    }

    const removeScroll = installScrollDepthTracking();

    // ── rage click 検知 ──
    const WINDOW_MS = 1000;
    const RADIUS = 32; // px
    const THRESHOLD = 3; // 連打回数
    let clicks: { x: number; y: number; t: number; el: Element | null }[] = [];

    /** 連打先の「操作可能な祖先要素」を返す（±ボタン・ページャ等の同一要素連打を識別するため）。 */
    function closestInteractive(target: EventTarget | null): Element | null {
      return target instanceof Element
        ? target.closest('a,button,[role="button"],input,label,summary,[onclick]')
        : null;
    }

    /**
     * 連打された要素を「次データで犯人特定できる」最小情報に要約する。
     * GA4のparam長制限に収まるよう各値を短く切り詰める。個人情報は載せない（テキストは40字まで）。
     */
    function describeTarget(target: EventTarget | null): Record<string, string> {
      const el = target instanceof Element ? (target.closest('a,button,[role="button"],input,label,summary,[onclick]') ?? target) : null;
      if (!el) return { el_tag: 'unknown' };
      const tag = el.tagName.toLowerCase();
      const cls = (el.getAttribute('class') ?? '').trim().split(/\s+/).slice(0, 4).join(' ').slice(0, 60);
      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40);
      const href = el.getAttribute('href') ?? '';
      const role = el.getAttribute('role') ?? '';
      const aria = el.getAttribute('aria-label') ?? '';
      // 連打先が「実際に押せる要素か（a/button等）」か「ただの装飾divか」を判別できるようにする
      const interactive = /^(a|button|input|label|summary)$/.test(tag) || role === 'button' || el.hasAttribute('onclick');
      return {
        el_tag: tag,
        ...(el.id ? { el_id: el.id.slice(0, 40) } : {}),
        ...(cls ? { el_class: cls } : {}),
        ...(text ? { el_text: text } : {}),
        ...(aria ? { el_aria: aria.slice(0, 40) } : {}),
        ...(href ? { el_href: href.slice(0, 80) } : {}),
        el_interactive: interactive ? 'yes' : 'no',
      };
    }

    function onClick(e: MouseEvent) {
      // 計算機のステッパー（±ボタン）等、連打が“正当な操作”の要素は rage_click から除外（偽陽性を弾く）。
      // SubjectSlider 等が data-no-rage を付与。range/number 入力も意図的な微調整なので対象外。
      const t = e.target;
      if (
        t instanceof Element &&
        t.closest('[data-no-rage],input[type="range"],input[type="number"]')
      ) {
        return;
      }
      const now = Date.now();
      const el = closestInteractive(t);
      clicks = clicks.filter((c) => now - c.t < WINDOW_MS);
      clicks.push({ x: e.clientX, y: e.clientY, t: now, el });
      const near = clicks.filter(
        (c) => Math.abs(c.x - e.clientX) < RADIUS && Math.abs(c.y - e.clientY) < RADIUS
      );
      if (near.length >= THRESHOLD) {
        // 同一の操作可能要素（±ステッパー・ページャ・数量インクリメンタ等）への連打は
        // フラストレーションではなく“正当な反復操作”。同じ interactive 要素への連打は rage とみなさない。
        // これで data-no-rage の付け漏れがあってもステッパー偽陽性を全面的に弾ける。
        const sameInteractiveRepeat = el !== null && near.every((c) => c.el === el);
        if (!sameInteractiveRepeat) {
          track(EVENTS.RAGE_CLICK, {
            page: window.location.pathname,
            count: near.length,
            ...describeTarget(e.target),
          });
        }
        clicks = []; // 多重発火を防ぐ（rage判定の有無に関わらずリセット）
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
