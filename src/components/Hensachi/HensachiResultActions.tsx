'use client';

import Link from 'next/link';
import { MessageCircle, Target, Bookmark } from 'lucide-react';

import { lineAddUrl } from '@/lib/line';
import { track } from '@/lib/track';

/**
 * 偏差値の結果ボックス直下（＝最高エンゲージ位置）に出す結果連動CTA。
 *
 * なぜ（GA4実測）：/hensachi は全流入の約41%だが、結果を見た瞬間の“次の一手”が無く、
 * cta_view→line/lead 転換がほぼ0だった。偏差値が出た瞬間に「LINEで志望校相談（名簿）」
 * 「狙える高校を見る（回遊）」「保存（互恵）」を最短距離で出し、生徒トラフィックを資産化する。
 * すべて外部ASP非依存＝承認待ちに左右されず今すぐ効かせられる導線。
 */
export function HensachiResultActions({ value }: { value: number | null }) {
  const LINE = lineAddUrl('student');
  const v = typeof value === 'number' ? value.toFixed(1) : '';

  const scrollToSave = () => {
    if (typeof document === 'undefined') return;
    document.getElementById('save-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="mt-5 space-y-2">
      {LINE && (
        <a
          href={LINE}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('line_friend_click', { source: 'hensachi', placement: 'hensachi-result' })}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#06C755] px-5 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          {v ? `偏差値${v}で狙える高校をLINEで無料相談` : 'LINEで志望校を無料相談'}
        </a>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href="/hensachi/shiboukou"
          onClick={() => track('click', { source: 'hensachi', placement: 'hensachi-result', to: 'shiboukou' })}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-purple-200 bg-white px-4 py-2.5 text-sm font-bold text-purple-700 transition-all hover:border-purple-400 hover:bg-purple-50"
        >
          <Target className="h-4 w-4" />
          この偏差値で狙える高校を見る
        </Link>
        <button
          type="button"
          onClick={scrollToSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-700 transition-all hover:border-sky-400 hover:bg-sky-50"
        >
          <Bookmark className="h-4 w-4" />
          結果を保存・記録する
        </button>
      </div>
    </div>
  );
}
