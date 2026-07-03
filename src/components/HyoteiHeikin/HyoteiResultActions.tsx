'use client';

import Link from 'next/link';
import { MessageCircle, Award, Bookmark } from 'lucide-react';

import { lineAddUrl } from '@/lib/line';
import { track } from '@/lib/track';

/**
 * 評定平均の結果ボックス直下（最高エンゲージ位置）に出す結果連動CTA。
 * 評定は推薦・私立併願優遇の“出願可否”を決める＝保護者の意思決定に直結。結果が出た瞬間に
 * 「推薦基準をLINE無料相談（名簿）」「基準を見る（回遊）」「保存（互恵）」を最短距離で出す。
 */
export function HyoteiResultActions({ value }: { value: number | null }) {
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
          onClick={() => track('line_friend_click', { source: 'hyotei', placement: 'hyotei-result' })}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#06C755] px-5 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          {v ? `評定平均${v}で狙える推薦・私立をLINEで無料相談` : 'LINEで推薦・併願優遇を無料相談'}
        </a>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href="/hyotei-heikin/suisen-kijun"
          onClick={() => track('click', { source: 'hyotei', placement: 'hyotei-result', to: 'suisen-kijun' })}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:border-emerald-400 hover:bg-emerald-50"
        >
          <Award className="h-4 w-4" />
          推薦・併願優遇の評定基準を見る
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
