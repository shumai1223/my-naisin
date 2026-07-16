import Link from 'next/link';
import { Sparkles, Star, TrendingUp, Shield, Zap, Award, Clock, BookOpen } from 'lucide-react';

import { APP_NAME, APP_NAME_JA } from '@/lib/constants';

/**
 * サイト名ロゴの見出しレベル。
 * GlobalHeaderBridge によりHeaderは「/」「/blog」以外の全ページにも表示されるため、
 * 既定は非見出し（p）にして各ページ本文の<h1>と重複しないようにする。
 * ホームページ（HomeClient）はこのロゴが唯一の<h1>になるため明示的に'h1'を渡す。
 * （2026-07-17判明: Playwright e2eをCI化した際にツール面で<h1>が2つ存在し
 *   page.locator('h1').first()が本文見出しでなくロゴを拾う不具合として顕在化した）
 */
export function Header({ titleTag = 'p' }: { titleTag?: 'h1' | 'p' } = {}) {
  const TitleTag = titleTag;
  return (
    <header className="overflow-hidden print:hidden">
      <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 px-4 py-8 md:px-6 md:py-10 pb-12">
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 md:h-16 md:w-16">
                <Sparkles className="h-7 w-7 text-white md:h-8 md:w-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                2026
              </div>
            </div>
            <div>
              <TitleTag className="text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">
                {APP_NAME}
                <span className="mx-2 text-white/40">|</span>
                <span className="text-blue-100">{APP_NAME_JA}</span>
              </TitleTag>
              <p className="mt-1.5 text-sm leading-relaxed text-blue-100/90 md:text-base">
                内申点をサクッと計算 • 目標設定 • 分析 • シェア
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <BookOpen className="h-4 w-4" />
              コラム
            </Link>
            <div className="flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              中高生応援
            </div>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <Zap className="h-3 w-3 text-yellow-300" />
            完全無料
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <Shield className="h-3 w-3 text-emerald-300" />
            データ安全
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <TrendingUp className="h-3 w-3 text-blue-300" />
            目標達成サポート
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <Award className="h-3 w-3 text-amber-300" />
            バッジ獲得
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 sm:flex">
            <Clock className="h-3 w-3 text-rose-300" />
            30秒で診断
          </div>
        </div>
      </div>
    </header>
  );
}
