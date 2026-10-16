'use client';

import { useState } from 'react';
import { KeyRound, Copy, Check, Loader2, AlertCircle, Info } from '@/components/icons';

/**
 * 無料APIキーの自己発行UI（堀B／課金ゲートの入口）。
 * POST /api/keys を叩き、平文キーを一度だけ表示する。
 * D1未接続時（503 not_enabled）は「匿名ティアでそのまま使える」と案内し、サイレント失敗を避ける。
 */
export function ApiKeyIssuer() {
  const [label, setLabel] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function issue() {
    if (!agreed) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: label || undefined,
          email: email || undefined,
          tosAgreedAt: new Date().toISOString(),
        }),
      });
      const data = (await res.json()) as { apiKey?: string; message?: string; error?: string };
      if (res.ok && data.apiKey) {
        setApiKey(data.apiKey);
      } else if (res.status === 503) {
        setInfo(
          data.message ??
            'キーの自己発行は準備中です。キー無し（匿名ティア）で /api/naishin をそのままご利用いただけます。'
        );
      } else {
        setError(data.message || data.error || '発行に失敗しました。時間をおいて再度お試しください。');
      }
    } catch {
      setError('通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* クリップボード不可環境は無視（手動コピー可） */
    }
  }

  if (apiKey) {
    return (
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-800">
          <Check className="h-4 w-4" /> APIキーを発行しました（この一度きりの表示です）
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900">
            {apiKey}
          </code>
          <button
            type="button"
            onClick={copyKey}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'コピー済' : 'コピー'}
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-900">
          <strong>再表示はできません。</strong>安全に保管してください。リクエストに
          <code className="mx-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs">Authorization: Bearer &lt;key&gt;</code>
          または <code className="mx-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs">x-api-key: &lt;key&gt;</code>
          を付けると Free ティア（高レート＋月次クォータ）で利用できます。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-700">
          用途メモ（任意）
          <input
            type="text"
            value={label}
            maxLength={80}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="例: 進路アプリの内申計算"
            className="mt-1 h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
        <label className="block text-sm text-slate-700">
          連絡先メール（任意・障害時のお知らせ用）
          <input
            type="email"
            value={email}
            maxLength={254}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dev@example.com"
            className="mt-1 h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
      </div>
      <label className="mt-4 flex min-h-11 items-center gap-3 text-sm text-slate-900">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-5 w-5 shrink-0 rounded border-slate-300 accent-brand-700"
        />
        <span>
          <a href="/terms" target="_blank" rel="noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
            利用規約
          </a>
          に同意します
        </span>
      </label>
      <button
        type="button"
        onClick={issue}
        disabled={loading || !agreed}
        className="mt-3 inline-flex h-12 items-center gap-2 rounded bg-brand-700 px-5 text-base font-bold text-white transition-colors enabled:hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        無料APIキーを発行
      </button>
      {info && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-brand-50 p-3 text-sm leading-relaxed text-slate-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
          {info}
        </p>
      )}
      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
