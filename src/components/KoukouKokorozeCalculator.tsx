'use client';

import * as React from 'react';
import { Calculator, School, Info, TrendingDown } from 'lucide-react';

import {
  highSchoolTotal,
  highSchoolSupportOver3Years,
  highSchoolRealCost,
  formatYen,
  toManYen,
} from '@/lib/education-cost/engine';
import { SHUGAKU_SHIEN_TIERS } from '@/lib/education-cost/data';
import type { IncomeBracket } from '@/lib/education-cost/types';
import { funnel, EVENTS, track } from '@/lib/track';

/**
 * 公立 vs 私立 高校3年間の「実質負担」比較（就学支援金＝高校無償化を世帯年収で反映）。
 *
 * 保護者＝検索者＝決裁者のお金面。education-cost-engine の検証済み一次データ（文科省）だけを使い、
 * 「私立は無償化後いくらか・公立とどれだけ違うか」を所得区分で出す。捏造ゼロ。
 */
export function KoukouKokorozeCalculator() {
  const [bracket, setBracket] = React.useState<IncomeBracket>('under590');
  const startedRef = React.useRef(false);

  const onPick = React.useCallback((b: IncomeBracket) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'kokoroze', placement: 'hiyou' });
    }
    setBracket(b);
  }, []);

  const r = React.useMemo(() => {
    const publicTotal = highSchoolTotal('public');
    const privateTotal = highSchoolTotal('private');
    const publicSupport = highSchoolSupportOver3Years('public', bracket);
    const privateSupport = highSchoolSupportOver3Years('private', bracket);
    const publicReal = highSchoolRealCost('public', bracket);
    const privateReal = highSchoolRealCost('private', bracket);
    return {
      publicTotal,
      privateTotal,
      publicSupport,
      privateSupport,
      publicReal,
      privateReal,
      diff: privateReal - publicReal,
    };
  }, [bracket]);

  React.useEffect(() => {
    if (!startedRef.current) return;
    funnel.calcComplete({ tool: 'kokoroze', placement: 'hiyou' }, { bracket });
    track(EVENTS.RESULT_VIEW, { tool: 'kokoroze', placement: 'hiyou' });
  }, [bracket, r.diff]);

  const tier = SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === bracket);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
        <Calculator className="h-5 w-5 text-emerald-600" />
        公立 vs 私立 3年間の実質負担シミュレーター
      </h2>

      {/* 世帯年収区分 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">世帯年収の区分（就学支援金の判定の目安）</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {SHUGAKU_SHIEN_TIERS.map((t) => (
            <button
              key={t.bracket}
              type="button"
              onClick={() => onPick(t.bracket)}
              className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                bracket === t.bracket
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tier && <p className="mt-2 text-xs leading-relaxed text-slate-500">{tier.note}</p>}
      </div>

      {/* 比較結果 */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* 公立 */}
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/60 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-sky-800">
            <School className="h-4 w-4" />
            公立高校（3年間）
          </div>
          <div className="text-3xl font-black tracking-tight text-slate-900">{formatYen(r.publicReal)}</div>
          <div className="text-xs font-bold text-sky-700">実質負担（{toManYen(r.publicReal)}）</div>
          <dl className="mt-3 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between"><dt>学習費総額（3年）</dt><dd className="font-mono">{formatYen(r.publicTotal)}</dd></div>
            <div className="flex justify-between"><dt>就学支援金 軽減</dt><dd className="font-mono text-emerald-700">-{formatYen(r.publicSupport)}</dd></div>
          </dl>
        </div>

        {/* 私立 */}
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-800">
            <School className="h-4 w-4" />
            私立高校（3年間）
          </div>
          <div className="text-3xl font-black tracking-tight text-slate-900">{formatYen(r.privateReal)}</div>
          <div className="text-xs font-bold text-rose-700">実質負担（{toManYen(r.privateReal)}）</div>
          <dl className="mt-3 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between"><dt>学習費総額（3年）</dt><dd className="font-mono">{formatYen(r.privateTotal)}</dd></div>
            <div className="flex justify-between"><dt>就学支援金 軽減</dt><dd className="font-mono text-emerald-700">-{formatYen(r.privateSupport)}</dd></div>
          </dl>
        </div>
      </div>

      {/* 差額 */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <TrendingDown className="h-6 w-6 shrink-0 text-emerald-600" />
        <div>
          <div className="text-sm font-bold text-emerald-800">公立と私立の実質負担の差（3年間）</div>
          <div className="text-2xl font-black text-slate-900">
            約 {toManYen(Math.abs(r.diff))} <span className="text-sm font-bold text-slate-500">私立が{r.diff >= 0 ? '高い' : '安い'}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        学習費総額は文部科学省「令和3年度 子供の学習費調査」（授業料・教材費・通学費・学校外活動費等を含む全日制1年あたり）×3年＋入学準備費の概算です。就学支援金は授業料部分が対象のため軽減は目安。世帯年収の区分は概算で、正確には市町村民税の課税標準額等で判定します。塾代・部活費・地域差は含みません。
      </p>
    </section>
  );
}
