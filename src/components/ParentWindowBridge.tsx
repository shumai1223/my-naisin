'use client';

import * as React from 'react';
import Link from 'next/link';
import { Users, MessageCircle, ChevronRight } from '@/components/icons';

import {
  activeParentWindow,
  parentWindowCopy,
  isEndOfTermSpikeDay,
  END_OF_TERM_SPIKE_DAY_NOTE,
  type ParentWindowId,
} from '@/lib/parent-window';
import { lineAddUrl } from '@/lib/line';
import { track } from '@/lib/track';
import { beaconParentFunnelEvent } from '@/lib/parent-funnel-beacon';
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
  /** 見出しのレベル（既定 h3）。置かれるページの見出し階層に合わせて呼び出し側が選ぶ。 */
  headingLevel?: 'h2' | 'h3' | 'h4';
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
  headingLevel = 'h3',
}: ParentWindowBridgeProps) {
  const [windowId, setWindowId] = React.useState<ParentWindowId | null>(null);
  const [isSpikeDay, setIsSpikeDay] = React.useState(false);

  React.useEffect(() => {
    const now = new Date();
    setWindowId(activeParentWindow(now));
    // S7-1: 終業式デー（12/24〜12/25）だけ既存コピーへ時宜性の一文を追加する。
    setIsSpikeDay(isEndOfTermSpikeDay(now));
  }, []);

  if (!windowId) return null;

  const copy = parentWindowCopy(windowId);
  const hasScore = isNum(score);
  const hasCard = isNum(score) && isNum(max);
  const gapAhead = isNum(gap) && gap > 0 ? Math.round(gap) : null;

  function onLineClick() {
    track('line_friend_click', { source: PLACEMENT, pref: prefectureCode ?? 'none', gap: gap ?? 0 });
  }

  // S2-3: /mendanリンクは従来onClickが無く計測ゼロだった（LINEボタンと並ぶ本コンポーネントのもう一方の主要CTA）。
  function onMendanLinkClick() {
    track('mendan_bridge_link_click', { source: PLACEMENT, pref: prefectureCode ?? 'none', gap: gap ?? 0 });
    beaconParentFunnelEvent('mendan_bridge_click', { prefectureCode });
  }

  // 見出しのレベルは呼び出し側が選ぶ（既定 h3）。見た目はレベルに依らず設計書の h2 / h3 の型。
  const Heading = headingLevel;
  const headingSize = headingLevel === 'h2' ? 'text-xl' : 'text-[17px]';

  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white p-5 md:p-6 ${className}`}
    >
      <CtaViewTracker placement={PLACEMENT} pref={prefectureCode} />

      <div className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
        {copy.badge}
      </div>

      <Heading className={`mb-2 ${headingSize} font-bold leading-snug text-slate-900`}>{copy.heading}</Heading>
      <p className="mb-4 text-base leading-[1.8] text-slate-900">
        {copy.intro}
        {isSpikeDay && <span className="mt-1 block font-bold text-brand-700">{END_OF_TERM_SPIKE_DAY_NOTE}</span>}
      </p>

      {/* ① 現在地サマリ（結果値入り）。数値が無い面では見出しだけの現在地カードにフォールバック。 */}
      {hasScore && (
        <div className="mb-4 border-y border-slate-200 py-3">
          <div className="text-xs text-slate-600">面談に持って行く「現在地」</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm text-slate-600">
              {prefectureName ? `${prefectureName}・` : ''}
              いまの{metricLabel}
            </span>
            <span className="text-2xl font-bold tabular-nums text-brand-700">
              {Math.round(score as number)}
              {isNum(max) && <span className="ml-0.5 text-sm font-bold text-slate-600">/{Math.round(max)}</span>}
            </span>
            {gapAhead !== null && (
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-900">
                目標まであと{gapAhead}点
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {/* ② 三者面談の準備へ（/mendan＝面談面。ここに家庭教師の無料体験が結線済み） */}
        <Link
          href="/mendan"
          onClick={onMendanLinkClick}
          className="flex min-h-[44px] items-center justify-between gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800"
        >
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5 shrink-0" />
            三者面談の準備をする
          </span>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </Link>

        {/* ③ 保護者向けLINE（分離アカウント）。友だち追加で面談・出願の情報を保護者に直接届ける。
            LINEボタンだけは LINE公式の緑（設計書の例外）。形は主ボタンと同じ。 */}
        <a
          href={lineAddUrl('parent')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLineClick}
          className="flex min-h-[44px] items-center justify-between gap-2 rounded bg-[#06C755] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#05b34c]"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 shrink-0" />
            保護者にLINEで届ける
          </span>
          <span className="rounded bg-white px-2 py-0.5 text-xs font-bold text-slate-900">無料</span>
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
