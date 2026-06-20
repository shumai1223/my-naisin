'use client';

import { useState } from 'react';

export interface TrendPoint {
  /** ツールチップ/軸に出すラベル（'YYYY-MM-DD' or 'YYYY-MM-DD HH'）。 */
  label: string;
  value: number;
}

/**
 * クリック推移の折れ線グラフ（ホバーで該当の日/時間と件数を表示）。
 * サーバー読みのD1データを props で受け、クライアントでマウス追従ツールチップを描く。
 */
export function TrendChart({ points, granularity }: { points: TrendPoint[]; granularity: 'day' | 'hour' }) {
  const [hover, setHover] = useState<number | null>(null);

  if (points.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">期間内にクリックがありません。</p>;
  }

  const W = 720, H = 190, pl = 34, pr = 14, pt = 18, pb = 26;
  const iw = W - pl - pr, ih = H - pt - pb;
  const n = points.length;
  const max = Math.max(1, ...points.map((p) => p.value));
  const x = (i: number) => (n === 1 ? pl + iw / 2 : pl + (i * iw) / (n - 1));
  const y = (v: number) => pt + ih - (v / max) * ih;

  const line = points.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${pl},${(pt + ih).toFixed(1)} ${line} ${x(n - 1).toFixed(1)},${(pt + ih).toFixed(1)}`;

  // ラベル整形：'2026-06-20' → '06-20'、'2026-06-20 09' → '06-20 09時'
  const fmt = (l: string) => (granularity === 'hour' ? `${l.slice(5, 10)} ${l.slice(11, 13)}時` : l.slice(5));

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W; // viewBox座標に換算
    let idx = n === 1 ? 0 : Math.round(((px - pl) / iw) * (n - 1));
    idx = Math.max(0, Math.min(n - 1, idx));
    setHover(idx);
  }

  const hp = hover != null ? points[hover] : null;
  const hx = hover != null ? x(hover) : 0;

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: 230 }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* グリッド */}
        <line x1={pl} y1={pt} x2={W - pr} y2={pt} className="stroke-slate-100" strokeWidth={1} />
        <line x1={pl} y1={pt + ih / 2} x2={W - pr} y2={pt + ih / 2} className="stroke-slate-100" strokeWidth={1} />
        <line x1={pl} y1={pt + ih} x2={W - pr} y2={pt + ih} className="stroke-slate-200" strokeWidth={1} />

        {/* 面・線 */}
        <polygon points={area} className="fill-emerald-100/70" />
        <polyline points={line} className="fill-none stroke-emerald-500" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* 点（多すぎる時は省略） */}
        {n <= 70 && points.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.value)} r={2.2} className="fill-emerald-600" />)}

        {/* ホバーのガイド線＋強調点 */}
        {hp && (
          <>
            <line x1={hx} y1={pt} x2={hx} y2={pt + ih} className="stroke-slate-300" strokeDasharray="3 3" strokeWidth={1} />
            <circle cx={hx} cy={y(hp.value)} r={4.5} className="fill-emerald-600 stroke-white" strokeWidth={2} />
          </>
        )}

        {/* 軸ラベル */}
        <text x={4} y={pt + 4} className="fill-slate-400 text-[9px]">{max}</text>
        <text x={4} y={pt + ih} className="fill-slate-400 text-[9px]">0</text>
        <text x={pl} y={H - 5} className="fill-slate-400 text-[9px]">{fmt(points[0].label)}</text>
        <text x={W - pr} y={H - 5} textAnchor="end" className="fill-slate-400 text-[9px]">{fmt(points[n - 1].label)}</text>
      </svg>

      {/* ツールチップ（マウス追従・該当の日/時間と件数） */}
      {hp && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-lg"
          style={{ left: `${(hx / W) * 100}%` }}
        >
          {fmt(hp.label)}
          <span className="ml-1.5 text-emerald-300">{hp.value}クリック</span>
        </div>
      )}
    </div>
  );
}
