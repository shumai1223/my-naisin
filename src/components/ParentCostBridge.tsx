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
  return (
    <section
      className={`rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white p-5 md:p-6 ${className}`}
    >
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
        <Wallet className="h-3 w-3" />
        計算できたら、次は「お金」
      </div>
      <h3 className="mb-1.5 text-lg font-bold text-slate-900">
        志望校が見えてきたら、おうちの人と費用も確認
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-700">
        {where}3年間にかかるお金は、公立と私立で<strong>数百万円</strong>変わります。内申点・志望校が固まってきたいま、保護者の方と「学費・塾代」を同じ目線で確認しておくと、進路選びがぐっと現実的になります。
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { href: '/koukou-hiyou/kokoroze', label: '公立 vs 私立 3年総額', sub: '実質負担で比較' },
          { href: '/juku-hiyou', label: '塾・個別指導の費用', sub: '月謝の相場と総額' },
          { href: '/hiyou', label: 'お金・無償化まとめ', sub: '就学支援金も確認' },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-100 transition-all hover:-translate-y-0.5 hover:ring-emerald-300 hover:shadow-sm"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800">{c.label}</span>
              <span className="block text-xs text-slate-500">{c.sub}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-emerald-400 transition-colors group-hover:text-emerald-600" />
          </Link>
        ))}
      </div>
    </section>
  );
}
