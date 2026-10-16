import Link from 'next/link';
import { ChevronRight } from '@/components/icons';

/**
 * 「結果に合う塾を診断」への軽量な入口（Build 2 ファネルの導線）。
 *
 * 結果ページ（全 ResultFlow）と /tools から /juku-shindan へ送る。県・目標との差は診断側が
 * savedGoal からプレフィルするので、ここでは文脈を渡さず1行リンクに留める（結果面を重くしない）。
 */
export function ShindanEntryLink({ className = '' }: { className?: string }) {
  return (
    // 2026-07-15: 主役CTA埋没対策の階層整理で余白を軽くした面（夏期講習需要面につき降格はここまで）。
    // 白＋罫線のカード・アイコンの箱なし。対の HogoshaEntryLink と見た目を揃えること。
    <Link
      href="/juku-shindan"
      className={`flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 transition-colors hover:bg-brand-50 ${className}`}
    >
      <span className="min-w-0">
        <span className="block text-base font-bold text-slate-900">結果に合う塾を診断する（無料）</span>
        <span className="block text-sm text-slate-600">県・目標との差・希望形態から、条件に合う塾だけを表示</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-brand-700" />
    </Link>
  );
}
