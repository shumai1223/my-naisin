'use client';

import { useState } from 'react';
import { Play, Loader2, Gauge } from 'lucide-react';

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
    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 p-6">
      <p className="mb-3 text-xs text-slate-600">
        送信するリクエストボディ（文部科学省の公式計算例: 理科3科目）：
      </p>
      <pre className="mb-4 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
        {`POST /api/gakushu-seiseki\n${JSON.stringify(SAMPLE_BODY, null, 2)}`}
      </pre>

      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        実際にAPIを呼び出す
      </button>

      {response && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              レスポンス {status !== null && <span className={status === 200 ? 'text-emerald-600' : 'text-amber-600'}>({status})</span>}
            </span>
            {remaining !== null && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Gauge className="h-3 w-3" />
                残り{remaining}回（この端末からの匿名枠）
              </span>
            )}
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
