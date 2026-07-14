import Link from 'next/link';
import { Wallet, ChevronRight } from 'lucide-react';

interface ParentCostBridgeProps {
  className?: string;
  /** 県名があれば文面に差し込む（例：「兵庫県の高校」）。 */
  prefectureName?: string;
}

/**
 * 計算結果の直後に置く「生徒→保護者」の同スケール導線。
 *
 * 収益化が換金0だった主因は権限ズレ（計算するのは生徒＝決裁者でない）。
 * 結果直後に“購入を迫る保護者CTA”を出してもCVR≈0になる。代わりに、
 * 生徒にも自然な「学費・塾代」という同スケールの情報導線を出し、決裁者（保護者）が
 * 自然に関与する費用ページ（高単価リードが正しく載っている面）へ送る。
 * 取引化は費用ページ側に任せ、この面では“purchase ask”を一切しない。
 */
export function ParentCostBridge({ className = '', prefectureName }: ParentCostBridgeProps) {
  const where = prefectureName ? `${prefectureName}の高校` : '高校';
  // 2026-07-15: 結果直下のカード渋滞で主役CTA(名簿/解放ゲート)が埋没するため、
  // 情報導線のこの面は「細い1行+テキストリンク」に格下げ（機能は3リンクとも維持）。
  return (
    <section className={`rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 ${className}`}>
      <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
        <Wallet className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        次は「お金」——{where}の費用（公立と私立で3年総額は数百万円差）を保護者の方と確認
      </p>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { href: '/koukou-hiyou/kokoroze', label: '公立 vs 私立 3年総額' },
          { href: '/juku-hiyou', label: '塾・個別指導の費用' },
          { href: '/hiyou', label: 'お金・無償化まとめ' },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            {c.label}
            <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
