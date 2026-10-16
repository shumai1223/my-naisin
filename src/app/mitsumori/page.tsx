import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from '@/components/icons';

import { QuoteGenerator } from '@/components/Mitsumori/QuoteGenerator';

/**
 * 見積書の自動発行（ops/PRICING_OPTIONS.md「商談ゼロで売るために必要な7点」#3）。
 * 社名・宛名・プランを入力するとBusiness/Enterpriseの見積書PDF（ブラウザの印刷機能でPDF保存）を作成できる。
 * D1書き込み・メール送信は行わない（入力内容はブラウザ内のみ・PIIを記録しない）。
 * 商談を経ずに買える経路（T-S13A A-6）の一部のため、noindexのまま/developersからリンクする。
 */
export const metadata: Metadata = {
  title: '見積書の作成 | My Naishin Developers',
  robots: { index: false, follow: false },
};

export default function MitsumoriPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/developers#pricing"
          className="print:hidden mb-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          料金プランに戻る
        </Link>

        <header className="print:hidden mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">見積書の作成</h1>
          <p className="mt-3 text-base leading-[1.8] text-slate-900">Business / Enterprise プランの見積書をその場で作成できます</p>
        </header>

        <QuoteGenerator />
      </div>
    </div>
  );
}
