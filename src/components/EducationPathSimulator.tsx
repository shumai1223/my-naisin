'use client';

import * as React from 'react';
import { ArrowRight, RotateCcw } from '@/components/icons';

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

/** 選択肢ボタンの見た目。選択中は「濃い枠線・薄い緑の面・太字」で、色だけに頼らず区別する。 */
const chipClass = (selected: boolean) =>
  `inline-flex min-h-[44px] items-center justify-center rounded border px-3 py-2 text-sm leading-snug transition-colors ${
    selected ? 'border-brand-700 bg-brand-50 font-bold text-brand-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
  }`;

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
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      {/* 高校 */}
      <span className="block text-sm font-bold text-slate-900">① 進学先の高校</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            aria-pressed={highCourse === c}
            onClick={() => { markStart(); setHighCourse(c); }}
            className={chipClass(highCourse === c)}
          >
            {c === 'public' ? '公立高校' : '私立高校'}
          </button>
        ))}
      </div>

      {/* 世帯年収（就学支援金） */}
      <span className="mt-5 block text-sm font-bold text-slate-900">② 世帯年収の目安（就学支援金の判定用）</span>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {INCOME_OPTIONS.map((o) => (
          <button
            key={o.id}
            aria-pressed={incomeBracket === o.id}
            onClick={() => { markStart(); setIncomeBracket(o.id); }}
            className={chipClass(incomeBracket === o.id)}
          >
            {o.short}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm leading-[1.8] text-slate-600">※ 正確な判定は市町村民税の課税標準額で行われます。年収は目安です。</p>

      {/* 大学 */}
      <span className="mt-5 block text-sm font-bold text-slate-900">③ 進学先の大学</span>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {UNIVERSITY_OPTIONS.map((o) => (
          <button
            key={o.id}
            aria-pressed={universityType === o.id}
            onClick={() => { markStart(); setUniversityType(o.id); }}
            className={chipClass(universityType === o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 通学形態（大学進学時のみ意味がある） */}
      {hasUniversity && (
        <>
          <span className="mt-5 block text-sm font-bold text-slate-900">④ 大学の通学形態</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['home', 'away'] as const).map((r) => (
              <button
                key={r}
                aria-pressed={residence === r}
                onClick={() => { markStart(); setResidence(r); }}
                className={chipClass(residence === r)}
              >
                {r === 'home' ? '自宅から通学' : '下宿・一人暮らし'}
              </button>
            ))}
          </div>
          {residence === 'away' && (
            <p className="mt-2 text-sm leading-[1.8] text-slate-600">
              ※ 自宅外は{UNIVERSITY_AWAY_COST.note}を加算（{UNIVERSITY_ESTIMATE.national.label}等の学費とは別）。
            </p>
          )}
        </>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
          高校〜大学の総額を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={reset} className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded border border-brand-700 bg-white px-5 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="path-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
            <div className="text-sm font-bold text-brand-800">高校入学〜大学卒業までの教育費の目安</div>
            <div className="mt-1 text-3xl font-bold tabular-nums text-brand-800 md:text-4xl">{formatYen(result.total)}</div>
            <div className="mt-1 text-sm text-slate-700">
              （{toManYen(result.total)}／{highCourse === 'public' ? '公立' : '私立'}高校・
              {hasUniversity ? `${UNIVERSITY_OPTIONS.find((o) => o.id === universityType)?.label}${residence === 'away' ? '・下宿' : '・自宅'}` : '高卒'}）
            </div>
          </div>

          <dl className="mt-3 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Breakdown
              label="高校3年（就学支援金 控除後）"
              value={formatYen(result.highSchoolReal)}
              sub={result.highSchoolSupport > 0 ? `支援 −${toManYen(result.highSchoolSupport)}` : undefined}
            />
            <Breakdown
              label="大学の学費（4年）"
              value={formatYen(result.universityTuition)}
            />
            <Breakdown
              label="下宿・生活費（4年）"
              value={formatYen(result.universityLiving)}
              sub={result.universityLiving === 0 ? '自宅は0' : undefined}
            />
          </dl>

          <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
            <p className="text-sm font-bold text-slate-900">ポイント</p>
            <p className="mt-1 text-sm leading-[1.8] text-slate-900">
              これは進路を選んだ場合の<strong>概算の目安</strong>です。実際は学校・地域・受講数で変わります。
              「我が家はいくら必要で、どう備えるか」を早めに把握しておくと、進路の選択肢を狭めずに済みます。
              大学費用の詳しい内訳は姉妹サイト「My Shingaku」でも確認できます。
            </p>
          </div>
          <p className="mt-2 text-sm leading-[1.8] text-slate-600">
            ※ 就学支援金の区分：{SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === incomeBracket)?.label}。制度・金額は年度で見直されます。
          </p>
        </div>
      )}
    </div>
  );
}

function Breakdown({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="py-3 sm:px-4 sm:first:pl-0">
      <dt className="text-xs text-slate-600">{label}</dt>
      <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900 md:text-2xl">{value}</dd>
      {sub && <dd className="mt-0.5 text-xs font-bold text-slate-700">{sub}</dd>}
    </div>
  );
}
