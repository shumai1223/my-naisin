import Link from 'next/link';
import { ChevronRight } from '@/components/icons';

/**
 * 「保護者の方へ」への軽量な入口。ShindanEntryLink と対で、計算ツールの
 * 静的（計算前）位置に置く前提のサーバー描画リンク。
 */
export function HogoshaEntryLink({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/hogosha"
      className={`flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 transition-colors hover:bg-brand-50 ${className}`}
    >
      <span className="min-w-0">
        <span className="block text-base font-bold text-slate-900">保護者の方へ（無料ガイド）</span>
        <span className="block text-sm text-slate-600">親ができること・塾はいつから・費用の目安をまとめて解説</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-brand-700" />
    </Link>
  );
}
