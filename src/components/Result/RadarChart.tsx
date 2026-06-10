import { Hexagon } from 'lucide-react';

import type { Scores } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';

export interface RadarChartProps {
  scores: Scores;
  prefectureCode: string;
}

// ── 自前SVGレーダー（recharts依存を排除＝結果ページのバンドル/LCP/INP改善, §12）──
const CX = 120;
const CY = 120;
const R = 80; // データ半径
const LABEL_R = 100; // ラベル配置半径
const LEVELS = [1, 2, 3, 4, 5];

function point(index: number, total: number, radius: number): [number, number] {
  const angle = ((-90 + (360 / total) * index) * Math.PI) / 180;
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function polygon(total: number, radius: number, valueOf: (i: number) => number): string {
  return Array.from({ length: total }, (_, i) => {
    const [x, y] = point(i, total, radius * valueOf(i));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

/**
 * 9教科の評定（1〜5）を見せる教科バランスチャート。
 * 以前は recharts（重いライブラリ）を使っていたが、純SVGに置換してクライアントバンドルから除外。
 * ホバー説明は SVG ネイティブの <title> で代替（JS不要・アクセシブル）。
 */
export function RadarChart({ scores }: RadarChartProps) {
  const subjects = SUBJECTS;
  const n = subjects.length;
  const valueAt = (i: number) => Math.min(5, Math.max(0, scores[subjects[i].key])) / 5;
  const average = (subjects.reduce((sum, s) => sum + scores[s.key], 0) / n).toFixed(1);

  const dataPoints = polygon(n, R, valueAt);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="relative border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
              <Hexagon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">教科バランス</h3>
              <p className="text-xs text-slate-500">Subject Balance Chart</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/80 px-4 py-2 shadow-sm">
            <div className="text-xs text-slate-500">平均</div>
            <div className="text-lg font-bold text-indigo-600">{average}</div>
          </div>
        </div>
      </div>

      {/* Chart（純SVG） */}
      <div className="relative p-4">
        <svg
          viewBox="0 0 240 240"
          className="mx-auto block h-auto w-full max-w-[300px]"
          role="img"
          aria-label={`教科バランスのレーダーチャート（9教科の評定、平均${average}）`}
        >
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* グリッド（同心ポリゴン） */}
          {LEVELS.map((level) => (
            <polygon
              key={level}
              points={polygon(n, R, () => level / 5)}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          ))}

          {/* 軸スポーク＋ラベル */}
          {subjects.map((s, i) => {
            const [ax, ay] = point(i, n, R);
            const [lx, ly] = point(i, n, LABEL_R);
            const anchor = Math.abs(lx - CX) < 8 ? 'middle' : lx > CX ? 'start' : 'end';
            return (
              <g key={s.key}>
                <line x1={CX} y1={CY} x2={ax} y2={ay} stroke="#e2e8f0" strokeWidth={1} />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill="#475569"
                >
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* データポリゴン */}
          <polygon points={dataPoints} fill="url(#radarGradient)" stroke="url(#radarStroke)" strokeWidth={2.5} />

          {/* 頂点ドット（<title>でホバー説明） */}
          {subjects.map((s, i) => {
            const [x, y] = point(i, n, R * valueAt(i));
            return (
              <circle key={s.key} cx={x} cy={y} r={3.5} fill="#6366f1" stroke="#fff" strokeWidth={2}>
                <title>{`${s.label}: ${scores[s.key]}/5`}</title>
              </circle>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <span className="text-xs font-medium text-slate-600">あなたの成績</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full border-2 border-slate-300 bg-white" />
            <span className="text-xs font-medium text-slate-500">満点(5)</span>
          </div>
        </div>
      </div>

      {/* Bottom tip */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
        <p className="text-center text-xs text-slate-500">
          📊 バランスの取れた成績を目指しましょう！苦手科目を克服すると内申点が大きく伸びます
        </p>
      </div>
    </div>
  );
}
