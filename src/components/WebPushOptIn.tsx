'use client';

import * as React from 'react';
import { Bell, Check, X } from '@/components/icons';

import { track } from '@/lib/track';
import { VAPID_PUBLIC_KEY } from '@/lib/push-config';

/**
 * Web Push 購読のオプトイン（H-NEW）。出願締切・通知表リマインドの再訪チャネルを点ける。
 *
 * 設計：
 *  - NEXT_PUBLIC_VAPID_PUBLIC_KEY 未設定／プッシュ非対応なら何も描画しない（env が揃うまで休眠）。
 *  - 許可はユーザー操作（ボタン）起点でのみ要求（ブラウザ仕様）。
 *  - 購読は /api/push/subscribe に保存（D1）。失敗してもUIは静かに復帰。
 *  - 県・対象（生徒/保護者）を任意で付与し、配信の出し分けに使う。
 */

type State = 'idle' | 'working' | 'subscribed' | 'denied' | 'error' | 'unsupported';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  // ArrayBuffer 裏付けで確保（applicationServerKey の BufferSource 型に整合）。
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function WebPushOptIn({
  prefectureCode,
  audience,
  className = '',
  heading = '出願・通知表の時期にリマインドを受け取る',
  body = '出願の締切前や通知表が出るタイミングに、スマホへ通知でお知らせします（無料・いつでも解除可）。',
}: {
  prefectureCode?: string;
  audience?: 'student' | 'parent';
  className?: string;
  heading?: string;
  body?: string;
}) {
  const [state, setState] = React.useState<State>('idle');

  // 対応状況の確認（SSR/初回は出さない＝ハイドレーション不一致回避）。
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      Boolean(VAPID_PUBLIC_KEY);
    setSupported(ok);
    if (ok && Notification.permission === 'denied') setState('denied');
  }, []);

  const subscribe = React.useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) return;
    setState('working');
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'idle');
        track('push_optin', { result: permission });
        return;
      }

      const existing = await reg.pushManager.getSubscription();
      const subscription =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }));

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON(), prefecture: prefectureCode, audience }),
      });

      if (res.ok) {
        setState('subscribed');
        track('push_subscribe', { pref: prefectureCode ?? 'none', audience: audience ?? 'none' });
      } else {
        setState('error');
      }
    } catch (err) {
      console.error('push subscribe failed:', err);
      setState('error');
    }
  }, [prefectureCode, audience]);

  if (!supported) return null;

  return (
    <section className={`rounded-lg border border-slate-200 bg-brand-50 p-5 ${className}`}>
      <h3 className="text-base font-bold text-slate-900">{heading}</h3>
      <p className="mt-1 text-sm leading-[1.7] text-slate-600">{body}</p>

      {state === 'subscribed' ? (
        <p className="mt-3 flex items-start gap-1.5 text-sm font-bold text-brand-700">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          通知をオンにしました。出願・通知表の時期にお知らせします。
        </p>
      ) : state === 'denied' ? (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          通知がブロックされています。ブラウザの設定から許可すると受け取れます。
        </p>
      ) : (
        <button
          type="button"
          onClick={subscribe}
          disabled={state === 'working'}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Bell className="h-4 w-4" />
          {state === 'working' ? '設定中…' : '通知を受け取る（無料）'}
        </button>
      )}
      {state === 'error' && (
        <p className="mt-2 text-sm text-red-800">設定に失敗しました。時間をおいて再度お試しください。</p>
      )}
    </section>
  );
}
