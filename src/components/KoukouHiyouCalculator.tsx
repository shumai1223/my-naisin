'use client';

import * as React from 'react';
import { ArrowRight, RotateCcw } from '@/components/icons';

import { track, funnel } from '@/lib/track';
import { LEARNING_COST_ANNUAL, HIGH_SCHOOL_INITIAL_COST } from '@/lib/education-cost/data';
import { toManYen } from '@/lib/education-cost/engine';

const yen = (n: number) => '¥' + Math.round(n).toLocaleString('ja-JP');

// 文科省「子供の学習費調査（令和5年度・令和8年1月16日訂正版）」学習費総額（年間）＋入学準備費の概算
// data.ts（単一ソース）を直接参照し、教育費シミュレーター等と重複した定数を持たない。
const PRESETS = {
  kouritsu: { label: '公立高校', annual: LEARNING_COST_ANNUAL.koukou.public, initial: HIGH_SCHOOL_INITIAL_COST.public },
  shiritsu: { label: '私立高校', annual: LEARNING_COST_ANNUAL.koukou.private, initial: HIGH_SCHOOL_INITIAL_COST.private },
} as const;

type Kind = keyof typeof PRESETS;

export function KoukouHiyouCalculator() {
  const [kind, setKind] = React.useState<Kind>('kouritsu');
  const [annual, setAnnual] = React.useState<number>(PRESETS.kouritsu.annual);
  const [initial, setInitial] = React.useState<number>(PRESETS.kouritsu.initial);
  const [show, setShow] = React.useState(false);
  const startedRef = React.useRef(false);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'koukou-hiyou', placement: 'koukou-hiyou' });
    }
  };

  const apply = (k: Kind) => {
    markStart();
    setKind(k);
    setAnnual(PRESETS[k].annual);
    setInitial(PRESETS[k].initial);
  };

  const total = annual * 3 + initial;

  const onCalc = () => {
    setShow(true);
    funnel.calcComplete({ tool: 'koukou-hiyou', placement: 'koukou-hiyou' }, { total });
    track('result_view', { source: 'koukou-hiyou' });
    requestAnimationFrame(() => document.getElementById('kh-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <span className="block text-sm font-bold text-slate-900">進学先</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(Object.keys(PRESETS) as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => apply(k)}
            aria-pressed={kind === k}
            className={`min-h-[44px] rounded border px-3 py-2 text-sm font-bold transition-colors ${
              kind === k ? 'border-brand-700 bg-brand-50 text-brand-800 ring-1 ring-brand-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {PRESETS[k].label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="1年間の学習費（授業料・教材・通学費など）" value={annual} onChange={(n) => { markStart(); setAnnual(n); }} />
        <Field label="入学時の準備費（入学金・制服など）" value={initial} onChange={(n) => { markStart(); setInitial(n); }} />
      </div>
      <p className="mt-3 text-sm leading-[1.8] text-slate-600">
        ※ 初期値は文科省「子供の学習費調査」の学習費総額（公立 {toManYen(LEARNING_COST_ANNUAL.koukou.public)}/年・私立 {toManYen(LEARNING_COST_ANNUAL.koukou.private)}/年）。就学支援金で軽減された後の実支出に近い値です。
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
          高校3年間の費用を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={() => { apply('kouritsu'); setShow(false); }} className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors hover:bg-brand-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="kh-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 text-center">
            <div className="text-sm font-bold text-slate-900">高校3年間でかかる費用</div>
            <div className="mt-1 text-4xl font-bold tabular-nums text-brand-700">{yen(total)}</div>
          </div>
          <dl className="mt-4 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <ResultCard label="1年間の費用" value={yen(annual)} />
            <ResultCard label="入学時の準備費" value={yen(initial)} />
          </dl>
          <p className="mt-3 text-sm leading-[1.8] text-slate-600">
            ※ 学校外の塾・習い事費を含む学習費総額ベースの目安です。世帯年収による就学支援金の差や、部活・修学旅行費で変動します。
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-slate-600">¥</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={10000}
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-right text-base font-bold tabular-nums text-slate-900"
        />
      </div>
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <dt className="text-xs text-slate-600">{label}</dt>
      <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</dd>
    </div>
  );
}
