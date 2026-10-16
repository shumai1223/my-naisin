'use client';

import * as React from 'react';
import Link from 'next/link';
import { RotateCcw, ChevronRight } from '@/components/icons';

import {
  hensachiToUpperPercent,
  hensachiToRank,
  tierForHensachi,
  reachBandsForHensachi,
  naishinToHensachiGuide,
  NAISHIN_REFERENCES,
  type HighSchoolTier,
} from '@/lib/hensachi';
import { funnel, track, EVENTS } from '@/lib/track';

const PRESETS = [45, 50, 55, 60, 65, 70];

export function HensachiTargetTool() {
  const [raw, setRaw] = React.useState('');
  const startedRef = React.useRef(false);

  const value = React.useMemo(() => {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : null;
  }, [raw]);

  const result = React.useMemo(() => {
    if (value === null) return null;
    const clamped = Math.min(80, Math.max(25, value));
    return {
      hensachi: clamped,
      upperPercent: hensachiToUpperPercent(clamped),
      rank300: hensachiToRank(clamped, 300),
      tier: tierForHensachi(clamped),
      bands: reachBandsForHensachi(clamped),
      naishin: naishinToHensachiGuide(
        // 偏差値の代表バンドに最も近い内申代表点を逆に拾う（並置の相手側）
        NAISHIN_REFERENCES.reduce((best, cur) => {
          const center = parseInt(cur.hensachiGuide, 10) || 50;
          const bestCenter = parseInt(best.hensachiGuide, 10) || 50;
          return Math.abs(center - clamped) < Math.abs(bestCenter - clamped) ? cur : best;
        }, NAISHIN_REFERENCES[0]).naishin45,
      ),
    };
  }, [value]);

  function handleChange(next: string) {
    setRaw(next);
    if (!startedRef.current && next !== '') {
      startedRef.current = true;
      funnel.toolStart({ tool: 'hensachi-target', placement: 'hensachi-shiboukou' });
    }
  }

  React.useEffect(() => {
    if (result) {
      funnel.calcComplete({ tool: 'hensachi-target', placement: 'hensachi-shiboukou' }, { hensachi: result.hensachi });
      track(EVENTS.REVERSE_CALC_USE, { tool: 'hensachi-target', hensachi: result.hensachi });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.hensachi]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">偏差値から「届く高校レンジ」を逆引き</h2>
        <p className="mt-1 text-sm text-slate-600">模試の偏差値を入れるだけ。安全圏・実力相応・チャレンジの3段階で表示</p>
      </div>

      <label htmlFor="hensachi-target-input" className="mb-1 block text-sm font-bold text-slate-900">
        いまの偏差値（5教科の目安）
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id="hensachi-target-input"
          type="number"
          inputMode="decimal"
          min={25}
          max={80}
          step={0.5}
          value={raw}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="例：58"
          className="w-32 rounded border border-slate-300 bg-white px-4 py-3 text-2xl font-bold tabular-nums text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-700"
        />
        <span className="text-sm text-slate-600">の偏差値で届く高校は？</span>
        {raw !== '' && (
          <button
            type="button"
            onClick={() => setRaw('')}
            className="ml-auto inline-flex min-h-[44px] items-center gap-1.5 rounded px-3 text-sm text-slate-600 hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4" />
            クリア
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleChange(String(p))}
            className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-3 text-sm font-bold tabular-nums text-slate-700 transition-colors hover:bg-brand-50"
          >
            偏差値{p}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* サマリー */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <div className="text-sm text-slate-600">偏差値 {result.hensachi} の立ち位置</div>
            <div className="mt-1 text-base text-slate-900">
              上位 <strong className="text-xl tabular-nums">{result.upperPercent.toFixed(1)}%</strong>
              <span className="mx-2 text-slate-600" aria-hidden="true">/</span>
              300人なら <strong className="tabular-nums">約{result.rank300}位</strong>
            </div>
          </div>

          {/* 3レンジ */}
          <div className="grid gap-3 sm:grid-cols-3">
            <RangeCard kicker="安全圏" sub="合格可能性が高い目安" tier={result.bands.safe} />
            <RangeCard kicker="実力相応" sub="ちょうど狙えるレベル" tier={result.bands.match} highlight />
            <RangeCard kicker="チャレンジ" sub="+5前後で挑戦できる" tier={result.bands.challenge} />
          </div>

          {/* 偏差値↔内申 並置 */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-1 text-[17px] font-bold text-slate-900">この偏差値と一緒に見られやすい内申点（並置）</h3>
            <p className="text-sm leading-[1.8] text-slate-900">
              偏差値 {result.hensachi} 前後の高校を志望する人の内申点は、<strong>{result.naishin.label}（45点満点で約{result.naishin.naishin45}）</strong>が目安です。
              <span className="mt-1 block text-xs text-slate-600">
                ※ 偏差値と内申点は別々の物差しで、換算式はありません。合否は「内申点＋当日点の合計」と各都道府県の制度で決まります。あくまで同じレベル帯でよく見られる組み合わせの目安です。
              </span>
            </p>
          </div>

          {/* 次の一手 */}
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/reverse"
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-brand-50"
            >
              志望校に必要な当日点を逆算する
              <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
            </Link>
            <Link
              href="/"
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-brand-50"
            >
              自分の内申点も計算する（47都道府県）
              <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function RangeCard({
  kicker,
  sub,
  tier,
  highlight,
}: {
  kicker: string;
  sub: string;
  tier: HighSchoolTier;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-slate-200 p-4 ${highlight ? 'bg-brand-50' : 'bg-white'}`}>
      <div className="text-sm text-slate-600">{kicker}</div>
      <div className="mt-1 text-base font-bold text-slate-900">{tier.label}</div>
      <div className="mt-1 text-sm text-slate-600">{sub}</div>
      <div className="mt-2 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
        内申{tier.naishin45}
      </div>
    </div>
  );
}
