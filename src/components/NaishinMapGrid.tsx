'use client';

import { useMemo, useState, type MouseEvent, type FocusEvent } from 'react';

import { AlertTriangle, ChevronDown, ChevronUp } from '@/components/icons';
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
  onEnter: (e: MouseEvent<HTMLAnchorElement>, cell: MapCellDatum) => void;
  onMove: (e: MouseEvent<HTMLAnchorElement>, cell: MapCellDatum) => void;
  onFocus: (e: FocusEvent<HTMLAnchorElement>, cell: MapCellDatum) => void;
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

  const showTooltipFromFocus = (e: FocusEvent<HTMLAnchorElement>, cell: MapCellDatum) => {
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
            className={`min-h-[44px] rounded border px-4 py-2 text-sm font-bold transition-colors ${
              m.id === metricId
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
            }`}
          >
            {m.shortLabel}
          </button>
        ))}
      </div>

      <p className="mb-1 text-base font-bold text-slate-900">{metric.label}</p>
      <p className="mb-3 text-sm leading-[1.8] text-slate-600">{metric.description}</p>
      {metric.caveat && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-[1.8] text-amber-900">
          <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
          <p>
            <strong>注意：</strong>
            {metric.caveat}
          </p>
        </div>
      )}

      {/* 凡例（シーケンシャル5段階・色だけに頼らずmin/maxの実数値も併記） */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="tabular-nums">{minCell.formatted}</span>
        <div className="flex overflow-hidden rounded" aria-hidden="true">
          {SEQUENTIAL_SCALE.map((c) => (
            <span key={c} className="h-3 w-6" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span className="tabular-nums">{maxCell.formatted}</span>
        <span className="ml-1">（左が低い・右が高い）</span>
      </div>

      {/* 地図本体（実際の都道府県境の形をしたSVGパス。沖縄県は距離が離れているため別枠表示） */}
      <div
        className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
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
        <div className="absolute bottom-3 left-3 w-[15%] min-w-[48px] max-w-[72px] rounded border border-slate-300 bg-white p-1">
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
          <p className="mt-0.5 text-center text-xs leading-tight text-slate-600">沖縄（別枠）</p>
        </div>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            <div className="font-bold">{tooltip.cell.name}</div>
            <div>
              {metric.shortLabel}: <span className="font-bold">{tooltip.cell.formatted}</span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm leading-[1.8] text-slate-600">
        ※このマップは都道府県境の形状を簡略化したSVG地図です。縮尺・詳細な境界線は実際の地図と異なる場合があります。タップ/クリックで各県の内申点の重み解説へ移動できます。
      </p>

      {/* テーブル表示（色だけに頼らず全件を数値で確認できるアクセシブルな代替表示） */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          {showTable ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showTable ? '表を閉じる' : '47都道府県すべてを表で見る'}
        </button>
        {showTable && (
          <div className="mt-3 max-h-96 overflow-y-auto overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs text-slate-600">
                  <th className="border-b border-slate-900 bg-white px-3 py-2">順位</th>
                  <th className="border-b border-slate-900 bg-white px-3 py-2">都道府県</th>
                  <th className="border-b border-slate-900 bg-white px-3 py-2">地方</th>
                  <th className="border-b border-slate-900 bg-white px-3 py-2 text-right">{metric.shortLabel}</th>
                </tr>
              </thead>
              <tbody>
                {sortedByValue.map((cell, i) => (
                  <tr key={cell.code}>
                    <td className="border-b border-slate-200 px-3 py-3 tabular-nums text-slate-600">{i + 1}</td>
                    <td className="border-b border-slate-200 p-0 text-slate-900">
                      <a
                        href={`/${cell.code}/naishin-omomi`}
                        className="block px-3 py-3 text-brand-700 underline underline-offset-2 hover:text-brand-800"
                      >
                        {cell.name}
                      </a>
                    </td>
                    <td className="border-b border-slate-200 px-3 py-3 text-slate-600">{cell.region}</td>
                    <td className="border-b border-slate-200 px-3 py-3 text-right font-bold tabular-nums text-brand-700">{cell.formatted}</td>
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
