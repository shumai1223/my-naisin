'use client';

import { useState } from 'react';
import { KeyRound, Copy, Check, Loader2, AlertCircle } from 'lucide-react';

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

  async function issue() {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label || undefined, email: email || undefined }),
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
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-800">
          <Check className="h-4 w-4" /> APIキーを発行しました（この一度きりの表示です）
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-slate-800">
            {apiKey}
          </code>
          <button
            type="button"
            onClick={copyKey}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'コピー済' : 'コピー'}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-emerald-900">
          <strong>再表示はできません。</strong>安全に保管してください。リクエストに
          <code className="mx-1 rounded bg-white px-1.5 py-0.5">Authorization: Bearer &lt;key&gt;</code>
          または <code className="mx-1 rounded bg-white px-1.5 py-0.5">x-api-key: &lt;key&gt;</code>
          を付けると Free ティア（高レート＋月次クォータ）で利用できます。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-600">
          用途メモ（任意）
          <input
            type="text"
            value={label}
            maxLength={80}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="例: 進路アプリの内申計算"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
          />
        </label>
        <label className="text-xs font-medium text-slate-600">
          連絡先メール（任意・障害時のお知らせ用）
          <input
            type="email"
            value={email}
            maxLength={254}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dev@example.com"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={issue}
        disabled={loading}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:shadow-lg disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        無料APIキーを発行
      </button>
      {info && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          {info}
        </p>
      )}
      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs leading-relaxed text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
