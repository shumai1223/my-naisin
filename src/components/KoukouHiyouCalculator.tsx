'use client';

import * as React from 'react';
import { School, ArrowRight, RotateCcw } from 'lucide-react';

import { track, funnel } from '@/lib/track';

const yen = (n: number) => '¥' + Math.round(n).toLocaleString('ja-JP');

// 文科省「子供の学習費調査（令和3年度）」学習費総額（年間）＋入学準備費の概算
const PRESETS = {
  kouritsu: { label: '公立高校', annual: 513000, initial: 120000 },
  shiritsu: { label: '私立高校', annual: 1054000, initial: 250000 },
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <span className="block text-sm font-bold text-slate-800">進学先</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(Object.keys(PRESETS) as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => apply(k)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
              kind === k ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
            }`}
          >
            {PRESETS[k].label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="1年間の学習費（授業料・教材・通学費など）" value={annual} onChange={(n) => { markStart(); setAnnual(n); }} />
        <Field label="入学時の準備費（入学金・制服など）" value={initial} onChange={(n) => { markStart(); setInitial(n); }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        ※ 初期値は文科省「子供の学習費調査」の学習費総額（公立 約51万円/年・私立 約105万円/年）。就学支援金で軽減された後の実支出に近い値です。
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95">
          高校3年間の費用を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={() => { apply('kouritsu'); setShow(false); }} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="kh-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-blue-800"><School className="h-4 w-4" />高校3年間でかかる費用</div>
            <div className="mt-1 text-4xl font-black tracking-tight text-blue-700 md:text-5xl">{yen(total)}</div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ResultCard label="1年間の費用" value={yen(annual)} />
            <ResultCard label="入学時の準備費" value={yen(initial)} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            ※ 学校外の塾・習い事費を含む学習費総額ベースの目安です。世帯年収による就学支援金の差や、部活・修学旅行費で変動します。
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-1 flex items-center gap-1">
        <span className="text-slate-400">¥</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={10000}
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight text-slate-900">{value}</div>
    </div>
  );
}
