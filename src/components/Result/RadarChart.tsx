import type { Scores } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';

export interface RadarChartProps {
  scores: Scores;
  prefectureCode: string;
}

// ── 自前SVGレーダー（recharts依存を排除＝結果ページのバンドル/LCP/INP改善, §12）──
// 色はブランド色と緑みの灰だけ（DESIGN-SYSTEM.md）。
const BRAND = '#17543e';
const GRID = '#cddad3';
const LABEL = '#4f6158';

const VIEW_W = 280;
const VIEW_H = 240;
const CX = 140;
const CY = 120;
const R = 78; // データ半径
const LABEL_R = 92; // ラベル配置半径
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
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">教科バランス</h3>
          <p className="mt-1 text-sm text-slate-600">9教科の評定（1〜5）</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-slate-600">平均</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900">{average}</div>
        </div>
      </div>

      {/* Chart（純SVG） */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mx-auto mt-2 block h-auto w-full max-w-[300px]"
        role="img"
        aria-label={`教科バランスのレーダーチャート（9教科の評定、平均${average}）`}
      >
        {/* グリッド（同心ポリゴン。満点の5だけ濃い線） */}
        {LEVELS.map((level) => (
          <polygon
            key={level}
            points={polygon(n, R, () => level / 5)}
            fill="none"
            stroke={level === 5 ? LABEL : GRID}
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
              <line x1={CX} y1={CY} x2={ax} y2={ay} stroke={GRID} strokeWidth={1} />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={700}
                fill={LABEL}
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* データポリゴン */}
        <polygon
          points={dataPoints}
          fill={BRAND}
          fillOpacity={0.15}
          stroke={BRAND}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* 頂点ドット（<title>でホバー説明） */}
        {subjects.map((s, i) => {
          const [x, y] = point(i, n, R * valueAt(i));
          return (
            <circle key={s.key} cx={x} cy={y} r={4} fill={BRAND}>
              <title>{`${s.label}: ${scores[s.key]}/5`}</title>
            </circle>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-brand-700" />
          <span className="text-xs text-slate-600">あなたの成績</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-slate-600 bg-white" />
          <span className="text-xs text-slate-600">満点(5)</span>
        </div>
      </div>

      {/* Bottom tip */}
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        バランスの取れた成績を目指しましょう。苦手科目を克服すると内申点が上がります。
      </p>
    </div>
  );
}
