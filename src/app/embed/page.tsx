import type { Metadata } from 'next';
import Link from 'next/link';
import { Code2, Check, Zap, Gift, ShieldCheck, ChevronRight, Home } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { EmbedCodeBox } from '@/components/EmbedCodeBox';

export const metadata: Metadata = {
  title: { absolute: '無料の内申点・評定平均 計算ウィジェット｜ブログに貼れる埋め込みコード | My Naishin' },
  description:
    '【無料・登録不要】内申点（素内申）と評定平均を計算できるツールを、あなたのブログ・サイトに埋め込めます。iframeコードをコピーして貼るだけ。塾・教育ブログ・受験情報サイトの読者に便利な計算機を提供できます。',
  keywords: ['内申点 計算 ウィジェット', '評定平均 ツール 埋め込み', '内申点 計算機 ブログ', '受験 ツール iframe'],
  alternates: { canonical: 'https://my-naishin.com/embed' },
  openGraph: {
    title: '無料の内申点・評定平均 計算ウィジェット｜ブログに貼れる埋め込みコード | My Naishin',
    description: '内申点・評定平均の計算ツールを、iframeコードのコピペであなたのサイトに設置できます。無料・登録不要。',
    url: 'https://my-naishin.com/embed',
    type: 'website',
  },
};

export default function EmbedPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '埋め込みウィジェット', url: 'https://my-naishin.com/embed' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">埋め込みウィジェット</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <Code2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              内申点・評定平均の計算ツールを、あなたのサイトに
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              塾・家庭教師・教育ブログ・受験情報サイトの運営者の方へ。<br />
              読者がその場で「素内申」と「評定平均」を計算できるツールを、<strong>無料・登録不要</strong>で設置できます。
            </p>
          </header>

          {/* メリット */}
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Gift className="mx-auto mb-2 h-6 w-6 text-blue-600" />
              <div className="text-sm font-bold text-slate-800">完全無料</div>
              <div className="text-xs text-slate-500">料金・登録は一切不要</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Zap className="mx-auto mb-2 h-6 w-6 text-amber-500" />
              <div className="text-sm font-bold text-slate-800">コピペで設置</div>
              <div className="text-xs text-slate-500">下のコードを貼るだけ</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
              <div className="text-sm font-bold text-slate-800">入力は端末内のみ</div>
              <div className="text-xs text-slate-500">成績は外部送信されません</div>
            </div>
          </div>

          {/* ライブプレビュー */}
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Check className="h-5 w-5 text-emerald-600" />
              プレビュー（実際に動きます）
            </h2>
            <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <iframe
                src="/embed/naishin"
                width="100%"
                height={520}
                style={{ border: '1px solid #e5e7eb', borderRadius: 16, maxWidth: 480, background: '#fff' }}
                title="内申点・評定平均 計算ツール｜My Naishin"
                loading="lazy"
              />
            </div>
          </section>

          {/* 埋め込みコード */}
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Code2 className="h-5 w-5 text-blue-600" />
              この2行を貼るだけ
            </h2>
            <EmbedCodeBox />
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              WordPress・はてなブログ・note（HTML埋め込み対応プラン）・自作サイトなどに貼り付けてください。
              幅は自動で親要素に合わせて調整されます（最大480px）。高さが足りない場合は <code className="rounded bg-slate-100 px-1">height</code> の数値を増やしてください。
            </p>
          </section>

          {/* お願い */}
          <section className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <h2 className="mb-2 text-sm font-bold text-amber-900">ご利用にあたってのお願い</h2>
            <ul className="space-y-1.5 text-xs leading-relaxed text-amber-800">
              <li>・コードに含まれる <strong>「by My Naishin（内申点 計算サイト）」のクレジットリンク</strong>（iframeのすぐ下の行）は、そのまま残してください。無料で提供を続けるための唯一のお願いです。</li>
              <li>・リンクの削除・差し替え・改変はご遠慮ください。枠の色など外側のスタイル調整は自由です。</li>
              <li>・商用・非商用問わず、教育目的の範囲で自由にご利用いただけます。</li>
            </ul>
          </section>

          {/* 関連 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-slate-800">本家サイトのツール</h2>
            <p className="mb-4 text-xs text-slate-500">
              ウィジェットは「素内申・評定平均」専用です。都道府県別の換算内申・偏差値・S値などは本家サイトでどうぞ。
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                内申点を計算する（47都道府県）
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                偏差値を計算する（5教科）
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
