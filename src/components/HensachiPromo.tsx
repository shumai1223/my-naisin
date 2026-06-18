import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

/**
 * /hensachi（偏差値計算サイト 5教科）への文脈内部リンク・ブロック。
 * 稼ぎ頭ページ（pos5.7→3狙い）に評価を集約するため、全blog（BlogRelatedLinks経由）と
 * total-scoreクラスタから「偏差値計算サイト（5教科）」の文脈アンカーで束ねる。
 * 1ページ1回・関連性のある面のみに置く（過剰リンク回避）。
 */
export function HensachiPromo({ className = '' }: { className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-white p-5 md:p-6 ${className}`}
    >
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
        <TrendingUp className="h-3 w-3" />
        内申点と一緒に確認
      </div>
      <h3 className="mb-1.5 text-lg font-bold text-slate-900">
        当日点・学力の立ち位置は「偏差値」で確認
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-700">
        合否は内申点と当日点（学力）の合計で決まります。学力の立ち位置を測るなら
        <Link
          href="/hensachi"
          className="font-bold text-purple-700 underline decoration-purple-300 underline-offset-2 hover:text-purple-800"
        >
          偏差値計算サイト（5教科）
        </Link>
        が便利。点数と平均点を入れるだけで5教科の偏差値と上位％を30秒で自動算出できます（中学生・高校生対応・無料・登録不要）。
      </p>
      <Link
        href="/hensachi"
        className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg"
      >
        5教科の偏差値を計算する
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
