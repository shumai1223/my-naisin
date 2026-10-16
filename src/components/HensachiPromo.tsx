import Link from 'next/link';
import { ArrowRight } from '@/components/icons';

/**
 * /hensachi（偏差値計算サイト 5教科）への文脈内部リンク・ブロック。
 * 稼ぎ頭ページ（pos5.7→3狙い）に評価を集約するため、全blog（BlogRelatedLinks経由）と
 * total-scoreクラスタから「偏差値計算サイト（5教科）」の文脈アンカーで束ねる。
 * 1ページ1回・関連性のある面のみに置く（過剰リンク回避）。
 */
export function HensachiPromo({ className = '' }: { className?: string }) {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white p-5 md:p-6 ${className}`}
    >
      <div className="mb-2 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
        内申点と一緒に確認
      </div>
      <h3 className="mb-2 text-[17px] font-bold text-slate-900">
        当日点・学力の立ち位置は「偏差値」で確認
      </h3>
      <p className="mb-4 text-base leading-[1.8] text-slate-900">
        合否は内申点と当日点（学力）の合計で決まります。学力の立ち位置を測るなら
        <Link
          href="/hensachi"
          className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          偏差値計算サイト（5教科）
        </Link>
        が便利。点数と平均点を入れるだけで5教科の偏差値と上位％を30秒で自動算出できます（中学生・高校生対応・無料・登録不要）。
      </p>
      <Link
        href="/hensachi"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
      >
        5教科の偏差値を計算する
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
