'use client';

import { useState } from 'react';
import { Play, Loader2, Gauge } from 'lucide-react';
import { PREFECTURES } from '@/lib/prefectures';

/**
 * /developers 用のAPIプレイグラウンド（W-15）。
 * ブラウザから同一オリジンでREST APIを実際に叩き、生レスポンスJSONをその場で表示する。
 * B2B商談で「その場で動くものをお見せできる」実演用。
 * 呼び出すのは実在するREST GETのみ（生徒の9教科評定→内申点の直接計算はMCP専用で
 * REST GETには存在しないため、ここでは反映しない＝実装と乖離した機能を見せない）。
 */
export function ApiPlayground() {
  const [prefCode, setPrefCode] = useState('tokyo');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<string | null>(null);
  const [requestUrl, setRequestUrl] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    const params = new URLSearchParams();
    if (target.trim()) params.set('target', target.trim());
    if (current.trim() && target.trim()) params.set('current', current.trim());
    const qs = params.toString();
    const url = `/api/naishin/${prefCode}${qs ? `?${qs}` : ''}`;
    setRequestUrl(url);
    try {
      const res = await fetch(url);
      const rateRemaining = res.headers.get('x-ratelimit-remaining');
      setRemaining(rateRemaining);
      setStatus(res.status);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch {
      setResponse(JSON.stringify({ error: 'network_error', message: '通信に失敗しました。時間をおいて再度お試しください。' }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/30 p-6">
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-bold text-slate-600">都道府県</span>
          <select
            value={prefCode}
            onChange={(e) => setPrefCode(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {PREFECTURES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-slate-600">目標の内申点（任意）</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="例: 180"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-slate-600">現在の内申点（任意・目標入力時のみ）</span>
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="例: 140"
            disabled={!target.trim()}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
          />
        </label>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        実際にAPIを呼び出す
      </button>

      {requestUrl && (
        <p className="mt-3 text-xs text-slate-500">
          リクエスト: <code className="rounded bg-slate-100 px-1.5 py-0.5">GET {requestUrl}</code>
        </p>
      )}

      {response && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              レスポンス {status !== null && <span className={status === 200 ? 'text-emerald-600' : 'text-amber-600'}>({status})</span>}
            </span>
            {remaining !== null && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Gauge className="h-3 w-3" />
                残り{remaining}回（この端末からの匿名枠・30回/分）
              </span>
            )}
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
            {response}
          </pre>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        このプレイグラウンドはお使いのブラウザから同一オリジンで実際のAPIを呼び出します（匿名利用枠30回/分の範囲内）。
        大量アクセスや自動テストには
        <a href="#pricing" className="mx-1 font-semibold text-indigo-700 underline">
          APIキー
        </a>
        の発行をご利用ください。
      </p>
    </div>
  );
}
