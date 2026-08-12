import type { Metadata } from 'next';
import Link from 'next/link';
import { FileSpreadsheet, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/developers#pricing"
          className="print:hidden mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          料金プランに戻る
        </Link>

        <div className="print:hidden mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-200">
            <FileSpreadsheet className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">見積書の作成</h1>
            <p className="text-sm text-slate-500">Business / Enterprise プランの見積書をその場で作成できます</p>
          </div>
        </div>

        <QuoteGenerator />
      </div>
    </div>
  );
}
