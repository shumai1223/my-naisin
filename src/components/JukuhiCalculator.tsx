'use client';

import * as React from 'react';
import { GraduationCap, ArrowRight, RotateCcw } from 'lucide-react';

import { track, funnel } from '@/lib/track';

const yen = (n: number) => '¥' + Math.round(n).toLocaleString('ja-JP');

/**
 * 塾代シミュレーター（学費クラスタの核・保護者＝検索者の最大関心＝お金）。
 *
 * 形態（集団/個別/家庭教師）× 学年で「月謝・年間・受験までの総額」を概算する。
 * 数値は一般的な相場の目安（編集可能）で、特定塾の価格を断定しない＝信頼の堀。
 * 計算後は保護者リード（無料体験/FP相談）への送客は呼び出し側ページ（placement='hiyou'）に委ねる。
 */
const TYPE_PRESET = {
  shudan: { label: '集団塾', monthly: 20000, koushuu: 150000, note: '大手・地域密着の集団指導' },
  kobetsu: { label: '個別指導', monthly: 30000, koushuu: 250000, note: '1対1〜1対3の個別指導' },
  katei: { label: '家庭教師', monthly: 28000, koushuu: 80000, note: '訪問・オンラインの家庭教師' },
} as const;

type JukuType = keyof typeof TYPE_PRESET;

// 学年→受験(中3の3月)までの概算通塾年数と、受験学年の費用上昇係数。
const GRADE = {
  1: { label: '中1', years: 3, factor: 1.0 },
  2: { label: '中2', years: 2, factor: 1.1 },
  3: { label: '中3', years: 1, factor: 1.3 },
} as const;

type Grade = keyof typeof GRADE;

export function JukuhiCalculator() {
  const [type, setType] = React.useState<JukuType>('kobetsu');
  const [grade, setGrade] = React.useState<Grade>(3);
  const [monthly, setMonthly] = React.useState<number>(Math.round(TYPE_PRESET.kobetsu.monthly * GRADE[3].factor));
  const [koushuu, setKoushuu] = React.useState<number>(TYPE_PRESET.kobetsu.koushuu);
  const [show, setShow] = React.useState(false);
  const startedRef = React.useRef(false);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'juku-hiyou', placement: 'hiyou' });
    }
  };

  const applyType = (t: JukuType) => {
    markStart();
    setType(t);
    setMonthly(Math.round(TYPE_PRESET[t].monthly * GRADE[grade].factor));
    setKoushuu(TYPE_PRESET[t].koushuu);
  };

  const applyGrade = (g: Grade) => {
    markStart();
    setGrade(g);
    setMonthly(Math.round(TYPE_PRESET[type].monthly * GRADE[g].factor));
  };

  const yearly = monthly * 12 + koushuu;
  const total = yearly * GRADE[grade].years;

  const onCalc = () => {
    setShow(true);
    funnel.calcComplete({ tool: 'juku-hiyou', placement: 'hiyou' }, { total, juku_type: type, grade });
    track('result_view', { source: 'juku-hiyou' });
    requestAnimationFrame(() => document.getElementById('jk-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const reset = () => {
    setType('kobetsu');
    setGrade(3);
    setMonthly(Math.round(TYPE_PRESET.kobetsu.monthly * GRADE[3].factor));
    setKoushuu(TYPE_PRESET.kobetsu.koushuu);
    setShow(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      {/* 形態 */}
      <span className="block text-sm font-bold text-slate-800">塾の形態</span>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(Object.keys(TYPE_PRESET) as JukuType[]).map((t) => (
          <button
            key={t}
            onClick={() => applyType(t)}
            className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${
              type === t ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-200'
            }`}
          >
            {TYPE_PRESET[t].label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{TYPE_PRESET[type].note}</p>

      {/* 学年 */}
      <span className="mt-5 block text-sm font-bold text-slate-800">お子さまの学年</span>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(Object.keys(GRADE).map(Number) as Grade[]).map((g) => (
          <button
            key={g}
            onClick={() => applyGrade(g)}
            className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${
              grade === g ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-200'
            }`}
          >
            {GRADE[g].label}
          </button>
        ))}
      </div>

      {/* 編集可能フィールド */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="毎月の月謝（授業料）" value={monthly} step={1000} onChange={(n) => { markStart(); setMonthly(n); }} />
        <Field label="季節講習など（年間）" value={koushuu} step={10000} onChange={(n) => { markStart(); setKoushuu(n); }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        ※ 初期値は一般的な相場の目安（{TYPE_PRESET[type].label}・{GRADE[grade].label}）。地域・塾・コマ数で大きく変動します。実額に合わせて編集できます。
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-amber-700 active:scale-95">
          塾代の総額を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={reset} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="jk-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-amber-800">
              <GraduationCap className="h-4 w-4" />
              {GRADE[grade].label}から受験（中3）までの塾代の目安
            </div>
            <div className="mt-1 text-4xl font-black tracking-tight text-amber-700 md:text-5xl">{yen(total)}</div>
            <div className="mt-1 text-xs text-amber-700">（{TYPE_PRESET[type].label}・約{GRADE[grade].years}年間の概算）</div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ResultCard label="月あたり" value={yen(monthly)} />
            <ResultCard label="1年あたり（講習費込み）" value={yen(yearly)} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            ※ 入塾金・教材費・模試代は別途かかる場合があります。塾は無料体験・無料の資料請求で月謝とカリキュラムを比較してから決めると、ミスマッチを避けられます。
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, step, onChange }: { label: string; value: number; step: number; onChange: (n: number) => void }) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-1 flex items-center gap-1">
        <span className="text-slate-400">¥</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right font-bold text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
