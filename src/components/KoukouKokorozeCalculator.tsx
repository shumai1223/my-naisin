'use client';

import * as React from 'react';
import { Info } from '@/components/icons';

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
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-slate-900">公立 vs 私立 3年間の実質負担シミュレーター</h2>

      {/* 世帯年収区分 */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-900">世帯年収の区分（就学支援金の判定の目安）</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {SHUGAKU_SHIEN_TIERS.map((t) => (
            <button
              key={t.bracket}
              type="button"
              onClick={() => onPick(t.bracket)}
              aria-pressed={bracket === t.bracket}
              className={`min-h-[44px] rounded border px-3 py-2 text-left text-sm font-bold transition-colors ${
                bracket === t.bracket
                  ? 'border-brand-700 bg-brand-50 text-brand-800 ring-1 ring-brand-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tier && <p className="mt-2 text-sm leading-[1.8] text-slate-600">{tier.note}</p>}
      </div>

      {/* 比較結果 */}
      <div className="mt-6 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {/* 公立 */}
        <div className="py-5 sm:pr-5">
          <div className="mb-2 text-sm font-bold text-slate-900">公立高校（3年間）</div>
          <div className="text-3xl font-bold tabular-nums text-slate-900">{formatYen(r.publicReal)}</div>
          <div className="text-sm font-bold text-slate-600">実質負担（{toManYen(r.publicReal)}）</div>
          <dl className="mt-3 divide-y divide-slate-200 border-t border-slate-200 text-sm text-slate-600">
            <div className="flex justify-between py-2"><dt>学習費総額（3年）</dt><dd className="tabular-nums">{formatYen(r.publicTotal)}</dd></div>
            <div className="flex justify-between py-2"><dt>就学支援金 軽減</dt><dd className="tabular-nums text-brand-700">-{formatYen(r.publicSupport)}</dd></div>
          </dl>
        </div>

        {/* 私立 */}
        <div className="py-5 sm:pl-5">
          <div className="mb-2 text-sm font-bold text-slate-900">私立高校（3年間）</div>
          <div className="text-3xl font-bold tabular-nums text-slate-900">{formatYen(r.privateReal)}</div>
          <div className="text-sm font-bold text-slate-600">実質負担（{toManYen(r.privateReal)}）</div>
          <dl className="mt-3 divide-y divide-slate-200 border-t border-slate-200 text-sm text-slate-600">
            <div className="flex justify-between py-2"><dt>学習費総額（3年）</dt><dd className="tabular-nums">{formatYen(r.privateTotal)}</dd></div>
            <div className="flex justify-between py-2"><dt>就学支援金 軽減</dt><dd className="tabular-nums text-brand-700">-{formatYen(r.privateSupport)}</dd></div>
          </dl>
        </div>
      </div>

      {/* 差額 */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-5">
        <div className="text-sm font-bold text-slate-900">公立と私立の実質負担の差（3年間）</div>
        <div className="text-2xl font-bold tabular-nums text-slate-900">
          約 {toManYen(Math.abs(r.diff))} <span className="text-sm font-bold text-slate-600">私立が{r.diff >= 0 ? '高い' : '安い'}</span>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm leading-[1.8] text-slate-600">
        <Info className="mt-1 h-4 w-4 shrink-0" />
        学習費総額は文部科学省「令和5年度 子供の学習費調査」（令和8年1月16日訂正版・授業料・教材費・通学費・学校外活動費等を含む全日制1年あたり）×3年＋入学準備費の概算です。就学支援金は授業料部分が対象のため軽減は目安。世帯年収の区分は概算で、正確には市町村民税の課税標準額等で判定します。塾代・部活費・地域差は含みません。
      </p>
    </section>
  );
}
