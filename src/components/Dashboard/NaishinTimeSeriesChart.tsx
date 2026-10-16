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

// グラフの色は ブランド色 と 緑みの灰 だけ（DESIGN-SYSTEM.md §2）。
const BRAND = '#17543e';
const INK_SUB = '#4f6158';
const RULE = '#cddad3';

const H = 240;
// 文字は画面上の実寸（px）。幅を測って描くので、viewBox が縮んで12px未満になることはない。
const FONT = 12;
const PAD = { top: 16, right: 24, bottom: 40, left: 56 };

// y軸の目盛りは 0・1/2・満点。半端な値（2.5 など）は丸めずに小数で出す。
function formatTick(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
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
  // 描画領域の幅に合わせて描く（固定幅の viewBox を縮めると、スマホで文字が小さくなりすぎる）。
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(560);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setWidth(Math.max(240, w));
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerW = width - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = points.length;
  const safeMax = yMax > 0 ? yMax : 1;

  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => PAD.top + innerH - (Math.min(safeMax, Math.max(0, v)) / safeMax) * innerH;

  const linePts = points.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');

  // y軸の目盛り（0・1/2・満点）
  const yTicks = [0, safeMax / 2, safeMax];

  // x軸ラベルは、文字が重ならない間隔（1つ約56px）で間引く。最新の点のラベルは必ず出す。
  const slot = n <= 1 ? innerW : innerW / (n - 1);
  const labelEvery = Math.max(1, Math.ceil(56 / slot));

  return (
    <div ref={wrapRef} className="w-full">
      <svg
        viewBox={`0 0 ${width} ${H}`}
        width="100%"
        height={H}
        className="block"
        role="img"
        aria-label={`${yLabel}の推移グラフ`}
      >
        {/* y軸グリッド + 目盛り */}
        {yTicks.map((t, i) => {
          const yy = y(t);
          return (
            <g key={i}>
              <line x1={PAD.left} y1={yy} x2={PAD.left + innerW} y2={yy} stroke={RULE} strokeWidth={1} />
              <text x={PAD.left - 8} y={yy + 4} textAnchor="end" fill={INK_SUB} fontSize={FONT} className="tabular-nums">
                {formatTick(t)}
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
              stroke={INK_SUB}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text x={PAD.left + innerW} y={y(targetValue) - 6} textAnchor="end" fill={INK_SUB} fontSize={FONT} fontWeight={700}>
              {targetLabel ?? `目標 ${Math.round(targetValue)}`}
            </text>
          </g>
        )}

        {/* 折れ線 */}
        {n >= 2 && (
          <polyline
            points={linePts}
            fill="none"
            stroke={BRAND}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* 点 + x軸ラベル */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r={4.5} fill={BRAND}>
              <title>{p.caption ?? `${p.label}: ${p.value}`}</title>
            </circle>
            {(n - 1 - i) % labelEvery === 0 && (
              <text x={x(i)} y={H - PAD.bottom + 18} textAnchor="middle" fill={INK_SUB} fontSize={FONT}>
                {p.label}
              </text>
            )}
          </g>
        ))}

        {/* y軸タイトル */}
        <text
          x={14}
          y={PAD.top + innerH / 2}
          textAnchor="middle"
          fill={INK_SUB}
          fontSize={FONT}
          transform={`rotate(-90 14 ${PAD.top + innerH / 2})`}
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}
