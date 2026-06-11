'use client';

import * as React from 'react';

export interface TimeSeriesPoint {
  /** x軸ラベル（日付 or 学期名） */
  label: string;
  /** y値 */
  value: number;
  /** 点の補足（ツールチップ表示。例「45点 / 中3-2学期」） */
  caption?: string;
}

interface NaishinTimeSeriesChartProps {
  points: TimeSeriesPoint[];
  /** y軸の最大値（内申点の満点 or 100） */
  yMax: number;
  /** y軸の単位ラベル */
  yLabel: string;
  /** 目標ライン（あれば点線で描画） */
  targetValue?: number;
  targetLabel?: string;
}

/**
 * 中1→中3の内申点（または達成率）の推移を見せる自前SVG折れ線グラフ。
 * recharts非依存（§12：バンドル削減方針）。軸・グリッド・目標ライン付き。
 */
export function NaishinTimeSeriesChart({
  points,
  yMax,
  yLabel,
  targetValue,
  targetLabel,
}: NaishinTimeSeriesChartProps) {
  const W = 560;
  const H = 240;
  const PAD = { top: 16, right: 16, bottom: 38, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = points.length;
  const safeMax = yMax > 0 ? yMax : 1;

  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => PAD.top + innerH - (Math.min(safeMax, Math.max(0, v)) / safeMax) * innerH;

  const linePts = points.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const areaPts = `${PAD.left},${PAD.top + innerH} ${linePts} ${PAD.left + innerW},${PAD.top + innerH}`;

  // y軸の目盛り（0・1/2・満点）
  const yTicks = [0, safeMax / 2, safeMax];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`${yLabel}の推移グラフ`}
    >
      <defs>
        <linearGradient id="tsArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* y軸グリッド + 目盛り */}
      {yTicks.map((t, i) => {
        const yy = y(t);
        return (
          <g key={i}>
            <line x1={PAD.left} y1={yy} x2={PAD.left + innerW} y2={yy} stroke="#e2e8f0" strokeWidth={1} />
            <text x={PAD.left - 6} y={yy + 3} textAnchor="end" className="fill-slate-400" fontSize={10}>
              {Math.round(t)}
            </text>
          </g>
        );
      })}

      {/* 目標ライン（点線） */}
      {typeof targetValue === 'number' && targetValue > 0 && targetValue <= safeMax && (
        <g>
          <line
            x1={PAD.left}
            y1={y(targetValue)}
            x2={PAD.left + innerW}
            y2={y(targetValue)}
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text x={PAD.left + innerW} y={y(targetValue) - 4} textAnchor="end" className="fill-emerald-600" fontSize={10} fontWeight={700}>
            {targetLabel ?? `目標 ${Math.round(targetValue)}`}
          </text>
        </g>
      )}

      {/* 面 + 折れ線 */}
      {n >= 2 && <polygon points={areaPts} fill="url(#tsArea)" />}
      {n >= 2 && (
        <polyline
          points={linePts}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* 点 + x軸ラベル */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r={3.5} fill="#3b82f6" stroke="#fff" strokeWidth={1.5}>
            <title>{p.caption ?? `${p.label}: ${p.value}`}</title>
          </circle>
          <text
            x={x(i)}
            y={H - PAD.bottom + 16}
            textAnchor="middle"
            className="fill-slate-500"
            fontSize={10}
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* y軸タイトル */}
      <text
        x={12}
        y={PAD.top + innerH / 2}
        textAnchor="middle"
        className="fill-slate-400"
        fontSize={10}
        transform={`rotate(-90 12 ${PAD.top + innerH / 2})`}
      >
        {yLabel}
      </text>
    </svg>
  );
}
