'use client';

import * as React from 'react';
import { Wallet, ArrowRight, RotateCcw, GraduationCap, School, Home as HomeIcon, ShieldCheck } from 'lucide-react';

import { track, funnel } from '@/lib/track';
import { simulateHighToUniversity, formatYen, toManYen } from '@/lib/education-cost/engine';
import { SHUGAKU_SHIEN_TIERS, UNIVERSITY_ESTIMATE, UNIVERSITY_AWAY_COST } from '@/lib/education-cost/data';
import type { CourseType, IncomeBracket, Residence, UniversityType } from '@/lib/education-cost/types';

/**
 * 進路別「高校〜大学卒業」教育費総額シミュレーター（保護者＝検索者＝決裁者・最高単価面）。
 *
 * 高校(公立/私立)×世帯年収(就学支援金)×大学(国公立/私立文系/私立理系)×通学(自宅/自宅外) から、
 * 卒業までの総額を内訳つきで概算する。数値は engine（文科省 子供の学習費調査＋就学支援金＋
 * 日本政策金融公庫の自宅外費用）の一次情報のみ＝捏造ゼロ。
 *
 * 計算後の保護者リード（FP無料相談 CPA¥13,800 等）への送客は呼び出し側ページ（placement='hiyou'）に委ねる。
 * = 「数百万円かかると分かった直後の保護者」を最高インテントで教育資金FP相談へ自然に橋渡しする着地面。
 */

const UNIVERSITY_OPTIONS: { id: UniversityType; label: string }[] = [
  { id: 'none', label: '進学しない（高卒）' },
  { id: 'national', label: '国公立大学' },
  { id: 'privateHumanities', label: '私立（文系）' },
  { id: 'privateScience', label: '私立（理系）' },
];

const INCOME_OPTIONS: { id: IncomeBracket; short: string }[] = [
  { id: 'under590', short: '〜590万円' },
  { id: 'under910', short: '590〜910万円' },
  { id: 'over910', short: '910万円〜' },
];

export function EducationPathSimulator() {
  const [highCourse, setHighCourse] = React.useState<CourseType>('public');
  const [incomeBracket, setIncomeBracket] = React.useState<IncomeBracket>('under910');
  const [universityType, setUniversityType] = React.useState<UniversityType>('national');
  const [residence, setResidence] = React.useState<Residence>('home');
  const [show, setShow] = React.useState(false);
  const startedRef = React.useRef(false);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'shinro-hiyou', placement: 'hiyou' });
    }
  };

  const result = simulateHighToUniversity({ highCourse, incomeBracket, universityType, residence });
  const hasUniversity = universityType !== 'none';

  const onCalc = () => {
    setShow(true);
    funnel.calcComplete(
      { tool: 'shinro-hiyou', placement: 'hiyou' },
      { total: result.total, high_course: highCourse, university: universityType, residence }
    );
    track('result_view', { source: 'shinro-hiyou' });
    requestAnimationFrame(() => document.getElementById('path-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const reset = () => {
    markStart();
    setHighCourse('public');
    setIncomeBracket('under910');
    setUniversityType('national');
    setResidence('home');
    setShow(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      {/* 高校 */}
      <span className="block text-sm font-bold text-slate-800">① 進学先の高校</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            onClick={() => { markStart(); setHighCourse(c); }}
            className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
              highCourse === c ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {c === 'public' ? '公立高校' : '私立高校'}
          </button>
        ))}
      </div>

      {/* 世帯年収（就学支援金） */}
      <span className="mt-5 block text-sm font-bold text-slate-800">② 世帯年収の目安（就学支援金の判定用）</span>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {INCOME_OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => { markStart(); setIncomeBracket(o.id); }}
            className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${
              incomeBracket === o.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {o.short}
          </button>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-slate-400">※ 正確な判定は市町村民税の課税標準額で行われます。年収は目安です。</p>

      {/* 大学 */}
      <span className="mt-5 block text-sm font-bold text-slate-800">③ 進学先の大学</span>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {UNIVERSITY_OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => { markStart(); setUniversityType(o.id); }}
            className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition-all sm:text-sm ${
              universityType === o.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 通学形態（大学進学時のみ意味がある） */}
      {hasUniversity && (
        <>
          <span className="mt-5 block text-sm font-bold text-slate-800">④ 大学の通学形態</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['home', 'away'] as const).map((r) => (
              <button
                key={r}
                onClick={() => { markStart(); setResidence(r); }}
                className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                  residence === r ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
                }`}
              >
                {r === 'home' ? '自宅から通学' : '下宿・一人暮らし'}
              </button>
            ))}
          </div>
          {residence === 'away' && (
            <p className="mt-1 text-[11px] text-slate-400">
              ※ 自宅外は{UNIVERSITY_AWAY_COST.note}を加算（{UNIVERSITY_ESTIMATE.national.label}等の学費とは別）。
            </p>
          )}
        </>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-95">
          高校〜大学の総額を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={reset} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="path-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-indigo-800">
              <Wallet className="h-4 w-4" />
              高校入学〜大学卒業までの教育費の目安
            </div>
            <div className="mt-1 text-4xl font-black tracking-tight text-indigo-700 md:text-5xl">{formatYen(result.total)}</div>
            <div className="mt-1 text-xs text-indigo-700">
              （{toManYen(result.total)}／{highCourse === 'public' ? '公立' : '私立'}高校・
              {hasUniversity ? `${UNIVERSITY_OPTIONS.find((o) => o.id === universityType)?.label}${residence === 'away' ? '・下宿' : '・自宅'}` : '高卒'}）
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Breakdown
              icon={<School className="h-4 w-4" />}
              label="高校3年（就学支援金 控除後）"
              value={formatYen(result.highSchoolReal)}
              sub={result.highSchoolSupport > 0 ? `支援 −${toManYen(result.highSchoolSupport)}` : undefined}
            />
            <Breakdown
              icon={<GraduationCap className="h-4 w-4" />}
              label="大学の学費（4年）"
              value={formatYen(result.universityTuition)}
            />
            <Breakdown
              icon={<HomeIcon className="h-4 w-4" />}
              label="下宿・生活費（4年）"
              value={formatYen(result.universityLiving)}
              sub={result.universityLiving === 0 ? '自宅は0' : undefined}
            />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="text-xs leading-relaxed text-emerald-900">
              これは進路を選んだ場合の<strong>概算の目安</strong>です。実際は学校・地域・受講数で変わります。
              「我が家はいくら必要で、どう備えるか」を早めに把握しておくと、進路の選択肢を狭めずに済みます。
              大学費用の詳しい内訳は姉妹サイト「My Shingaku」でも確認できます。
            </p>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            ※ 就学支援金の区分：{SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === incomeBracket)?.label}。制度・金額は年度で見直されます。
          </p>
        </div>
      )}
    </div>
  );
}

function Breakdown({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-xl font-black tracking-tight text-slate-900">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] font-semibold text-emerald-600">{sub}</div>}
    </div>
  );
}
