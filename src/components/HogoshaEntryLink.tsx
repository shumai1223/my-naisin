import Link from 'next/link';
import { HeartHandshake, ChevronRight } from 'lucide-react';

/**
 * 「保護者の方へ」への軽量な入口。ShindanEntryLink と対で、計算ツールの
 * 静的（計算前）位置に置く前提のサーバー描画リンク。
 */
export function HogoshaEntryLink({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/hogosha"
      className={`group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md ${className}`}
    >
      <span className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          <HeartHandshake className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-800">保護者の方へ（無料ガイド）</span>
          <span className="block text-xs text-slate-500">親ができること・塾はいつから・費用の目安をまとめて解説</span>
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
