'use client';

import { useState } from 'react';
import { Play, Loader2, Gauge } from '@/components/icons';

/**
 * /developers 用のプレイグラウンド（T-C4）— /api/gakushu-seiseki（学習成績の状況・大学受験の評定平均）。
 * ApiPlayground.tsx（内申点・GET）と同じUX方針だが、こちらはPOST+JSON body。
 * 文部科学省の公式計算例（理科: 物理基礎3・化学基礎3・生物基礎5 → 3.7）をそのまま送信ボディにする
 * （捏造ゼロ・商談でその場で叩ける実演用）。
 */
const SAMPLE_BODY = {
  kamoku: [
    { kyoka: '理科', kamoku: '物理基礎', gakunen: 1, hyotei: 3 },
    { kyoka: '理科', kamoku: '化学基礎', gakunen: 2, hyotei: 3 },
    { kyoka: '理科', kamoku: '生物基礎', gakunen: 1, hyotei: 5 },
  ],
};

export function GakushuSeisekiPlayground() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    try {
      const res = await fetch('/api/gakushu-seiseki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(SAMPLE_BODY),
      });
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
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="mb-3 text-sm text-slate-600">
        送信するリクエストボディ（文部科学省の公式計算例: 理科3科目）：
      </p>
      <pre className="mb-4 overflow-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
        {`POST /api/gakushu-seiseki\n${JSON.stringify(SAMPLE_BODY, null, 2)}`}
      </pre>

      <button
        onClick={run}
        disabled={loading}
        className="inline-flex h-12 items-center gap-2 rounded bg-brand-700 px-5 text-base font-bold text-white transition-colors enabled:hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        実際にAPIを呼び出す
      </button>

      {response && (
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-bold text-slate-700">
              レスポンス {status !== null && <span className={status === 200 ? 'text-brand-700' : 'text-amber-800'}>({status})</span>}
            </span>
            {remaining !== null && (
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <Gauge className="h-4 w-4" />
                残り{remaining}回（この端末からの匿名枠）
              </span>
            )}
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
