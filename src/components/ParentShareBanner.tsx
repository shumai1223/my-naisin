'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Inbox, Target, PartyPopper } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { parseParentShare } from '@/lib/share';

/**
 * 橋②バトンの受け手側（決裁者＝保護者の着地ヒーロー）。
 *
 * 生徒が結果ページから共有した文脈付きリンク（/hogosha?from=share&...）で保護者が着地したとき、
 * 「お子さまの結果が届きました」を保護者の言葉で提示し、直下の保護者向けオファー（資料請求/無料体験）へ橋渡しする。
 * マウント時に parent_landing_view を一度だけ送り、ファネル（share_to_parent → parent_landing_view → affiliate_click → lead_submit）を閉じる。
 *
 * useSearchParams をこのコンポーネント内に閉じ込め、/hogosha は静的（SSG）のまま維持する。
 * 呼び出し側で <Suspense fallback={null}> に包むこと（Next 15 の要件）。
 */
export function ParentShareBanner() {
  const sp = useSearchParams();

  const share = React.useMemo(() => {
    const raw: Record<string, string> = {};
    sp.forEach((value, key) => {
      raw[key] = value;
    });
    return parseParentShare(raw);
  }, [sp]);

  React.useEffect(() => {
    if (!share.isShare) return;
    track(EVENTS.PARENT_LANDING_VIEW, {
      pref: share.prefectureCode ?? 'none',
      metric: share.metricLabel ?? '内申点',
      has_target: typeof share.target === 'number',
      ...(typeof share.gap === 'number' ? { gap: share.gap } : {}),
    });
    // 着地時点で一度だけ。share は query 由来で実質不変なので二重発火しない。
  }, [share]);

  if (!share.isShare) return null;

  const { prefectureName, score, max, target, gap, label, grade } = share;
  const hasScore = typeof score === 'number';
  const hasGap = typeof gap === 'number';
  const met = hasGap && (gap as number) <= 0;
  const targetWord = label || '目標';
  const metric = share.metricLabel || '内申点';
  const gradeLead = typeof grade === 'number' ? `中${grade}の今からなら、まだ十分に間に合います。` : '';

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/70 to-white p-6 shadow-sm md:p-7">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
        <Inbox className="h-3.5 w-3.5" />
        お子さまから成績レポートが届きました
      </div>

      <h2 className="mb-2 text-xl font-bold leading-snug text-slate-900 md:text-2xl">
        {prefectureName ? `${prefectureName}の` : ''}{metric}の成績レポートが届きました
      </h2>

      {hasScore && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <div className="text-[11px] font-bold text-slate-500">現在の{metric}</div>
            <div className="text-2xl font-black tracking-tight text-slate-800">
              {score}
              {typeof max === 'number' && <span className="text-base font-semibold text-slate-400">/{max}</span>}
            </div>
          </div>

          {typeof target === 'number' && (
            <div
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 ${
                met ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800' : 'border-amber-200 bg-amber-50/70 text-amber-800'
              }`}
            >
              {met ? <PartyPopper className="h-5 w-5" /> : <Target className="h-5 w-5" />}
              <div>
                <div className="text-[11px] font-bold opacity-80">{targetWord}（{target}）まで</div>
                <div className="text-lg font-black">
                  {met ? `目標を ${Math.abs(gap as number)}点 達成` : `あと ${gap}点`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-sm leading-relaxed text-slate-700">
        {met
          ? 'お子さまは目標ラインに到達しています。この力をキープし、さらに伸ばすために、ご家庭でできる対策を無料の資料で確認できます。'
          : `${gradeLead}ここから内申点・偏差値は「今からの伸ばし方」で大きく変わります。お子さまに合った対策を、まずは無料の資料・体験でご確認ください（費用はかかりません）。`}
      </p>
    </section>
  );
}
