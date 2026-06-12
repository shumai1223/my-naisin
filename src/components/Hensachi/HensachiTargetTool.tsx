'use client';

import * as React from 'react';
import Link from 'next/link';
import { Target, RotateCcw, ChevronRight, ShieldCheck, Flame, Crosshair } from 'lucide-react';

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

const TIER_COLOR: Record<string, { bg: string; border: string; text: string; chip: string }> = {
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', chip: 'bg-red-100 text-red-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', chip: 'bg-orange-100 text-orange-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', chip: 'bg-amber-100 text-amber-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', chip: 'bg-emerald-100 text-emerald-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', chip: 'bg-teal-100 text-teal-700' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', chip: 'bg-sky-100 text-sky-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', chip: 'bg-blue-100 text-blue-700' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', chip: 'bg-slate-100 text-slate-700' },
};

function tierColor(tier: HighSchoolTier) {
  return TIER_COLOR[tier.colorClass] ?? TIER_COLOR.slate;
}

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
    <div className="rounded-3xl border-2 border-purple-200 bg-white p-5 shadow-lg md:p-7">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md">
          <Target className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">偏差値から「届く高校レンジ」を逆引き</h2>
          <p className="text-xs text-slate-500">模試の偏差値を入れるだけ。安全圏・実力相応・チャレンジの3段階で表示</p>
        </div>
      </div>

      <label htmlFor="hensachi-target-input" className="mb-1 block text-sm font-bold text-slate-700">
        いまの偏差値（5教科の目安）
      </label>
      <div className="flex items-center gap-3">
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
          className="w-32 rounded-xl border-2 border-slate-200 px-4 py-3 text-2xl font-black text-slate-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
        />
        <span className="text-sm text-slate-500">の偏差値で届く高校は？</span>
        {raw !== '' && (
          <button
            type="button"
            onClick={() => setRaw('')}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
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
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 transition-colors hover:bg-purple-100 hover:text-purple-700"
          >
            偏差値{p}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* サマリー */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4 text-center">
            <div className="text-xs font-bold text-purple-600">偏差値 {result.hensachi} の立ち位置</div>
            <div className="mt-1 text-sm text-slate-700">
              上位 <strong className="text-xl text-purple-700">{result.upperPercent.toFixed(1)}%</strong>
              <span className="mx-2 text-slate-300">/</span>
              300人なら <strong className="text-purple-700">約{result.rank300}位</strong>
            </div>
          </div>

          {/* 3レンジ */}
          <div className="grid gap-3 sm:grid-cols-3">
            <RangeCard icon={ShieldCheck} kicker="安全圏" sub="合格可能性が高い目安" tier={result.bands.safe} />
            <RangeCard icon={Crosshair} kicker="実力相応" sub="ちょうど狙えるレベル" tier={result.bands.match} highlight />
            <RangeCard icon={Flame} kicker="チャレンジ" sub="+5前後で挑戦できる" tier={result.bands.challenge} />
          </div>

          {/* 偏差値↔内申 並置 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-1 text-sm font-bold text-slate-800">この偏差値と一緒に見られやすい内申点（並置）</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              偏差値 {result.hensachi} 前後の高校を志望する人の内申点は、<strong className="text-slate-800">{result.naishin.label}（45点満点で約{result.naishin.naishin45}）</strong>が目安です。
              <span className="mt-1 block text-[11px] text-slate-500">
                ※ 偏差値と内申点は別々の物差しで、換算式はありません。合否は「内申点＋当日点の合計」と各都道府県の制度で決まります。あくまで同じレベル帯でよく見られる組み合わせの目安です。
              </span>
            </p>
          </div>

          {/* 次の一手 */}
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/reverse"
              className="group flex items-center justify-between rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50"
            >
              志望校に必要な当日点を逆算する
              <ChevronRight className="h-4 w-4 text-purple-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/"
              className="group flex items-center justify-between rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50"
            >
              自分の内申点も計算する（47都道府県）
              <ChevronRight className="h-4 w-4 text-blue-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function RangeCard({
  icon: Icon,
  kicker,
  sub,
  tier,
  highlight,
}: {
  icon: typeof Target;
  kicker: string;
  sub: string;
  tier: HighSchoolTier;
  highlight?: boolean;
}) {
  const c = tierColor(tier);
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 ${highlight ? 'ring-2 ring-purple-300' : ''}`}>
      <div className="flex items-center gap-1.5">
        <Icon className={`h-4 w-4 ${c.text}`} />
        <span className={`text-xs font-black ${c.text}`}>{kicker}</span>
      </div>
      <div className="mt-2 text-sm font-bold text-slate-900">{tier.label}</div>
      <div className="mt-1 text-[11px] text-slate-500">{sub}</div>
      <div className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${c.chip}`}>
        内申{tier.naishin45}
      </div>
    </div>
  );
}
