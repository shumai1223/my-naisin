'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarClock, Users, MessageCircle, ChevronRight } from 'lucide-react';

import { activeParentWindow, parentWindowCopy, type ParentWindowId } from '@/lib/parent-window';
import { lineAddUrl } from '@/lib/line';
import { track } from '@/lib/track';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';
import { ParentShareLinkButton } from '@/components/ParentShareLinkButton';

interface ParentWindowBridgeProps {
  /** 指標ラベル（偏差値/評定平均/内申点/総合得点）。現在地サマリの見出しに使う。 */
  metricLabel: string;
  /** 実測値（あれば現在地サマリに数値を表示）。 */
  score?: number | null;
  /** 満点（score と揃うと成績カード＝保護者バトンを点灯できる）。 */
  max?: number | null;
  /** 目標値・目標までの差（あれば「あと◯点」を出す）。 */
  target?: number | null;
  gap?: number | null;
  /** 学年（1/2/3）。成績カード・共有の文脈に使う。 */
  grade?: number | null;
  prefectureCode?: string;
  prefectureName?: string;
  className?: string;
}

const PLACEMENT = 'mendan-bridge';

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * 結果直下の「三者面談の前に、現在地を持って行く」ブリッジ（Build 1／保護者ウィンドウ）。
 *
 * 保護者が必ず関与する三者面談・出願の窓（7月／11〜12月）だけ点灯し、
 *  ① 結果値入りの現在地サマリ（成績カードを保護者へ渡せる面はそのまま再利用）
 *  ② 三者面談の準備ページ /mendan への導線（面談面に高EVの家庭教師無料体験が結線済み）
 *  ③ 保護者向けLINE（lineAddUrl('parent')＝分離アカウント）への友だち追加
 * を出して、桁レバー C_p（保護者起点クリック）を、最も立ちやすいタイミングで拾う。
 *
 * 窓の判定は SSG のビルド時刻ではなく“閲覧者の現在時刻”で行う必要があるため、マウント後に評価する
 * （初期SSR/ハイドレーション時は非表示→クライアントで窓内なら表示。ハイドレーション不一致は起きない）。
 */
export function ParentWindowBridge({
  metricLabel,
  score,
  max,
  target,
  gap,
  grade,
  prefectureCode,
  prefectureName,
  className = '',
}: ParentWindowBridgeProps) {
  const [windowId, setWindowId] = React.useState<ParentWindowId | null>(null);

  React.useEffect(() => {
    setWindowId(activeParentWindow(new Date()));
  }, []);

  if (!windowId) return null;

  const copy = parentWindowCopy(windowId);
  const hasScore = isNum(score);
  const hasCard = isNum(score) && isNum(max);
  const gapAhead = isNum(gap) && gap > 0 ? Math.round(gap) : null;

  function onLineClick() {
    track('line_friend_click', { source: PLACEMENT, pref: prefectureCode ?? 'none', gap: gap ?? 0 });
  }

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}
    >
      <CtaViewTracker placement={PLACEMENT} pref={prefectureCode} />

      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
        <CalendarClock className="h-3.5 w-3.5" />
        {copy.badge}
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">{copy.heading}</h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-700">{copy.intro}</p>

      {/* ① 現在地サマリ（結果値入り）。数値が無い面では見出しだけの現在地カードにフォールバック。 */}
      {hasScore && (
        <div className="mb-4 rounded-xl border border-indigo-100 bg-white/80 p-4">
          <div className="text-xs font-bold text-slate-500">面談に持って行く「現在地」</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm text-slate-600">
              {prefectureName ? `${prefectureName}・` : ''}
              いまの{metricLabel}
            </span>
            <span className="text-2xl font-black tabular-nums text-indigo-700">
              {Math.round(score as number)}
              {isNum(max) && <span className="ml-0.5 text-sm font-bold text-slate-400">/{Math.round(max)}</span>}
            </span>
            {gapAhead !== null && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                目標まであと{gapAhead}点
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {/* ② 三者面談の準備へ（/mendan＝面談面。ここに家庭教師の無料体験が結線済み） */}
        <Link
          href="/mendan"
          className="group flex items-center justify-between gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-[0.99]"
        >
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            三者面談の準備をする
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* ③ 保護者向けLINE（分離アカウント）。友だち追加で面談・出願の情報を保護者に直接届ける。 */}
        <a
          href={lineAddUrl('parent')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLineClick}
          className="flex items-center justify-between gap-2 rounded-xl border-2 border-[#06C755] bg-[#06C755] px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            保護者にLINEで届ける
          </span>
          <span className="rounded-lg bg-white/20 px-2 py-0.5 text-xs font-bold">無料</span>
        </a>
      </div>

      {/* 成績カードを渡せる面（score＋max）は、保護者バトン（画像つき共有）をそのまま再利用。 */}
      {hasCard && (
        <div className="mt-3">
          <ParentShareLinkButton
            tool="mendan-bridge"
            label="現在地を保護者に送る（成績カード）"
            ctx={{
              score: score as number,
              max: max as number,
              target: isNum(target) ? target : undefined,
              gap: isNum(gap) ? gap : undefined,
              grade: isNum(grade) ? grade : undefined,
              prefectureCode,
              prefectureName,
              metricLabel,
            }}
          />
        </div>
      )}
    </section>
  );
}
