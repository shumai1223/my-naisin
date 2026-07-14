import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';

/**
 * 「結果に合う塾を診断」への軽量な入口（Build 2 ファネルの導線）。
 *
 * 結果ページ（全 ResultFlow）と /tools から /juku-shindan へ送る。県・目標との差は診断側が
 * savedGoal からプレフィルするので、ここでは文脈を渡さず1行リンクに留める（結果面を重くしない）。
 */
export function ShindanEntryLink({ className = '' }: { className?: string }) {
  return (
    // 2026-07-15: 主役CTA埋没対策の階層整理で影と余白を一段軽く（夏期講習需要面につき降格はここまで）
    <Link
      href="/juku-shindan"
      className={`group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 transition-all hover:border-blue-300 hover:bg-white ${className}`}
    >
      <span className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Search className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-800">結果に合う塾を診断する（無料）</span>
          <span className="block text-xs text-slate-500">県・目標との差・希望形態から、条件に合う塾だけを表示</span>
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-blue-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
