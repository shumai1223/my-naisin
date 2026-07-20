'use client';

import { useMemo, useState, type MouseEvent, type FocusEvent } from 'react';

import {
  MAP_VIEWBOX,
  OKINAWA_VIEWBOX,
  SEQUENTIAL_SCALE,
  MAP_METRICS,
  buildMapCells,
  type MapMetricId,
  type MapCellDatum,
} from '@/lib/naishin-map-data';

interface TooltipState {
  cell: MapCellDatum;
  x: number;
  y: number;
}

function PrefPath({
  cell,
  fill,
  onEnter,
  onMove,
  onFocus,
  onLeave,
}: {
  cell: MapCellDatum;
  fill: string;
  onEnter: (e: MouseEvent<SVGAElement>, cell: MapCellDatum) => void;
  onMove: (e: MouseEvent<SVGAElement>, cell: MapCellDatum) => void;
  onFocus: (e: FocusEvent<SVGAElement>, cell: MapCellDatum) => void;
  onLeave: () => void;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href={`/${cell.code}/naishin-omomi`}
      aria-label={`${cell.name}（詳しく見る）`}
      onMouseEnter={(e) => onEnter(e, cell)}
      onMouseMove={(e) => onMove(e, cell)}
      onFocus={(e) => onFocus(e, cell)}
      onBlur={onLeave}
    >
      <path
        d={cell.path}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={0.9}
        strokeLinejoin="round"
        className="cursor-pointer transition-opacity hover:opacity-80"
      />
      <title>{cell.name}</title>
    </a>
  );
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

  const okinawaCell = cells.find((c) => c.code === 'okinawa')!;
  const mainCells = cells.filter((c) => c.code !== 'okinawa');

  const showTooltip = (
    e: { clientX: number; clientY: number },
    cell: MapCellDatum,
  ) => setTooltip({ cell, x: e.clientX, y: e.clientY });

  const showTooltipFromFocus = (e: FocusEvent<SVGAElement>, cell: MapCellDatum) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ cell, x: rect.left + rect.width / 2, y: rect.top });
  };

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

      {/* 地図本体（実際の都道府県境の形をしたSVGパス。沖縄県は距離が離れているため別枠表示） */}
      <div
        className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4"
        onMouseLeave={() => setTooltip(null)}
      >
        <svg
          viewBox={`${MAP_VIEWBOX.x} ${MAP_VIEWBOX.y} ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          role="img"
          aria-label={`都道府県別「${metric.shortLabel}」日本地図`}
          className="mx-auto block w-full max-w-md"
        >
          {mainCells.map((cell) => (
            <PrefPath
              key={cell.code}
              cell={cell}
              fill={SEQUENTIAL_SCALE[cell.bucket]}
              onEnter={showTooltip}
              onMove={showTooltip}
              onFocus={showTooltipFromFocus}
              onLeave={() => setTooltip(null)}
            />
          ))}
        </svg>

        {/* 沖縄インセット（本州から離れた実際の位置のまま表示すると地図全体が縦長になりすぎるため、
            一般的な日本地図の慣習に倣い左下に別枠で表示） */}
        <div className="absolute bottom-3 left-3 w-[15%] min-w-[48px] max-w-[72px] rounded-md border border-slate-300 bg-white/80 p-1 shadow-sm">
          <svg
            viewBox={`${OKINAWA_VIEWBOX.x} ${OKINAWA_VIEWBOX.y} ${OKINAWA_VIEWBOX.width} ${OKINAWA_VIEWBOX.height}`}
            role="img"
            aria-label={`沖縄県: ${metric.shortLabel} ${okinawaCell.formatted}`}
            className="block w-full"
          >
            <PrefPath
              cell={okinawaCell}
              fill={SEQUENTIAL_SCALE[okinawaCell.bucket]}
              onEnter={showTooltip}
              onMove={showTooltip}
              onFocus={showTooltipFromFocus}
              onLeave={() => setTooltip(null)}
            />
          </svg>
          <p className="mt-0.5 text-center text-[9px] leading-none text-slate-400">沖縄（別枠）</p>
        </div>

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
        ※このマップは都道府県境の形状を簡略化したSVG地図です。縮尺・詳細な境界線は実際の地図と異なる場合があります。タップ/クリックで各県の内申点の重み解説へ移動できます。
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
