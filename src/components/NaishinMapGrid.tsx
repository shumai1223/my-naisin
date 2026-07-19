'use client';

import { useMemo, useState } from 'react';

import {
  GRID_COLS,
  GRID_ROWS,
  SEQUENTIAL_SCALE,
  SEQUENTIAL_SCALE_TEXT,
  MAP_METRICS,
  buildMapCells,
  type MapMetricId,
  type MapCellDatum,
} from '@/lib/naishin-map-data';

const TILE = 34;
const GAP = 3;
const PAD = 6;

function tileX(col: number) {
  return PAD + col * TILE;
}
function tileY(row: number) {
  return PAD + row * TILE;
}

interface TooltipState {
  cell: MapCellDatum;
  x: number;
  y: number;
}

export function NaishinMapGrid() {
  const [metricId, setMetricId] = useState<MapMetricId>('practical-skew');
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [showTable, setShowTable] = useState(false);

  const metric = MAP_METRICS.find((m) => m.id === metricId)!;
  const cells = useMemo(() => buildMapCells(metricId), [metricId]);
  const sortedByValue = useMemo(() => [...cells].sort((a, b) => b.value - a.value), [cells]);
  const minCell = sortedByValue[sortedByValue.length - 1];
  const maxCell = sortedByValue[0];

  const width = PAD * 2 + GRID_COLS * TILE;
  const height = PAD * 2 + GRID_ROWS * TILE;

  return (
    <div>
      {/* 指標切替（セグメント型） */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="表示する指標">
        {MAP_METRICS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === metricId}
            onClick={() => {
              setMetricId(m.id);
              setTooltip(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              m.id === metricId
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {m.shortLabel}
          </button>
        ))}
      </div>

      <p className="mb-1 text-sm font-bold text-slate-800">{metric.label}</p>
      <p className="mb-3 text-xs leading-relaxed text-slate-500">{metric.description}</p>
      {metric.caveat && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          ⚠️ {metric.caveat}
        </p>
      )}

      {/* 凡例（シーケンシャル5段階・色だけに頼らずmin/maxの実数値も併記） */}
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
        <span>{minCell.formatted}</span>
        <div className="flex overflow-hidden rounded" aria-hidden="true">
          {SEQUENTIAL_SCALE.map((c) => (
            <span key={c} className="h-3 w-6" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span>{maxCell.formatted}</span>
        <span className="ml-1 text-slate-400">（左が低い・右が高い）</span>
      </div>

      {/* タイルグリッド地図本体（簡略化した模式図・実際の県境SVGパスではない） */}
      <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`都道府県別「${metric.shortLabel}」タイルマップ`}
          className="mx-auto w-full max-w-xl"
          onMouseLeave={() => setTooltip(null)}
        >
          {cells.map((cell) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              key={cell.code}
              href={`/${cell.code}/naishin-omomi`}
              aria-label={`${cell.name}: ${metric.shortLabel} ${cell.formatted}（詳しく見る）`}
              onMouseEnter={(e) =>
                setTooltip({ cell, x: e.clientX, y: e.clientY })
              }
              onMouseMove={(e) => setTooltip({ cell, x: e.clientX, y: e.clientY })}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ cell, x: rect.left + rect.width / 2, y: rect.top });
              }}
              onBlur={() => setTooltip(null)}
            >
              <rect
                x={tileX(cell.col)}
                y={tileY(cell.row)}
                width={TILE - GAP}
                height={TILE - GAP}
                rx={5}
                fill={SEQUENTIAL_SCALE[cell.bucket]}
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
              <text
                x={tileX(cell.col) + (TILE - GAP) / 2}
                y={tileY(cell.row) + (TILE - GAP) / 2 + 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={SEQUENTIAL_SCALE_TEXT[cell.bucket]}
                className="pointer-events-none select-none"
              >
                {cell.name.slice(0, 2)}
              </text>
              <title>
                {cell.name}: {metric.shortLabel} {cell.formatted}
              </title>
            </a>
          ))}
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            <div className="font-bold">{tooltip.cell.name}</div>
            <div>
              {metric.shortLabel}: <span className="font-bold">{tooltip.cell.formatted}</span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        ※このマップは都道府県の位置関係を保った簡略化した模式図です。実際の県境の形状とは異なります。タップ/クリックで各県の内申点の重み解説へ移動できます。
      </p>

      {/* テーブル表示（色だけに頼らず全件を数値で確認できるアクセシブルな代替表示） */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-sm font-bold text-indigo-700 hover:underline"
        >
          {showTable ? '▲ 表を閉じる' : '▼ 47都道府県すべてを表で見る'}
        </button>
        {showTable && (
          <div className="mt-3 max-h-96 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr className="text-xs text-slate-500">
                  <th className="px-3 py-2">順位</th>
                  <th className="px-3 py-2">都道府県</th>
                  <th className="px-3 py-2">地方</th>
                  <th className="px-3 py-2">{metric.shortLabel}</th>
                </tr>
              </thead>
              <tbody>
                {sortedByValue.map((cell, i) => (
                  <tr key={cell.code} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 text-slate-400">{i + 1}</td>
                    <td className="px-3 py-1.5 font-medium text-slate-800">
                      <a href={`/${cell.code}/naishin-omomi`} className="hover:text-indigo-700 hover:underline">
                        {cell.name}
                      </a>
                    </td>
                    <td className="px-3 py-1.5 text-slate-500">{cell.region}</td>
                    <td className="px-3 py-1.5 font-bold text-indigo-700">{cell.formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
