'use client';

import * as React from 'react';
import { Bell, BellRing, Check, X } from 'lucide-react';

import { track } from '@/lib/track';

/**
 * Web Push 購読のオプトイン（H-NEW）。出願締切・通知表リマインドの再訪チャネルを点ける。
 *
 * 設計：
 *  - NEXT_PUBLIC_VAPID_PUBLIC_KEY 未設定／プッシュ非対応なら何も描画しない（env が揃うまで休眠）。
 *  - 許可はユーザー操作（ボタン）起点でのみ要求（ブラウザ仕様）。
 *  - 購読は /api/push/subscribe に保存（D1）。失敗してもUIは静かに復帰。
 *  - 県・対象（生徒/保護者）を任意で付与し、配信の出し分けに使う。
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

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
    <section className={`rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
          {state === 'subscribed' ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800">{heading}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>

          {state === 'subscribed' ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
              <Check className="h-4 w-4" />通知をオンにしました。出願・通知表の時期にお知らせします。
            </p>
          ) : state === 'denied' ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
              <X className="h-4 w-4" />通知がブロックされています。ブラウザの設定から許可すると受け取れます。
            </p>
          ) : (
            <button
              type="button"
              onClick={subscribe}
              disabled={state === 'working'}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Bell className="h-4 w-4" />
              {state === 'working' ? '設定中…' : '通知を受け取る（無料）'}
            </button>
          )}
          {state === 'error' && (
            <p className="mt-2 text-xs text-rose-600">設定に失敗しました。時間をおいて再度お試しください。</p>
          )}
        </div>
      </div>
    </section>
  );
}
