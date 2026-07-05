import { ShindanEntryLink } from '@/components/ShindanEntryLink';
import { HogoshaEntryLink } from '@/components/HogoshaEntryLink';

/**
 * /juku-shindan・/hogosha への静的（サーバー描画）内部リンク2本組。
 *
 * なぜ必要か：この2ページへのリンクは従来 ResultFlow（計算後にクライアント側で描画）内にしか
 * 無く、Googlebotが計算を実行しない限り不可視だった。計算ツールページの計算前・静的位置に
 * 直接置くことで、初回HTMLの時点でクロール可能にする（/juku-shindanのsitemap漏れ＋
 * 未インデックス問題への対処。src/lib/page-registry.ts と対）。
 */
export function StaticToolEntryLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <ShindanEntryLink />
      <HogoshaEntryLink />
    </div>
  );
}
