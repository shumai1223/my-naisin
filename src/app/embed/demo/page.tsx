import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * T-C7: 埋め込みウィジェットのデモページ（提案書からリンクできるURL）。
 *
 * 「学校・進路情報サイトの記事内に埋め込んだらこう見える」を汎用のモックで示す。
 * ★特定企業（旺文社・パスナビ for School 等）のロゴ・実際の画面レイアウト・商標は
 * 一切複製しない。あくまで一般的な「学校向け情報サイト」の想定モックとして構成する。
 */
export const metadata: Metadata = {
  title: { absolute: '埋め込みウィジェット デモ｜学校・教育情報サイト向け | My Naishin' },
  description:
    '学習成績の状況（大学受験の評定平均）計算ツールを、学校・進路情報サイトの記事に埋め込んだ場合のイメージを確認できるデモページです。',
  alternates: { canonical: `${SITE_URL}/embed/demo` },
  robots: { index: false, follow: true },
};

export default function EmbedDemoPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '埋め込みウィジェット', url: `${SITE_URL}/embed` },
          { name: 'デモ', url: `${SITE_URL}/embed/demo` },
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/embed" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">埋め込みウィジェット</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">デモ</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              埋め込みデモ：学校・進路情報サイトの記事内に貼った場合
            </h1>
          </header>

          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-base leading-[1.8] text-amber-900">
              以下は<strong>一般的な学校向け情報サイトを想定した汎用モック</strong>です。
              特定の企業・サービスの実際の画面やロゴを再現したものではありません。
              記事本文にウィジェットを1つ埋め込むと、実際にはこのように動きます（下のiframeは本物のウィジェットです）。
            </p>
          </div>

          {/* 汎用モック: 学校向け進路情報サイトの記事ページ風レイアウト */}
          <div className="overflow-hidden rounded-lg border border-slate-300">
            {/* ブラウザ風の枠（実在サイトのUIは再現しない） */}
            <div className="flex items-center gap-1.5 border-b border-slate-300 bg-slate-100 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="ml-3 text-xs text-slate-600">〇〇学習情報サイト（イメージ）／記事ページ</span>
            </div>

            <div className="bg-white p-5 md:p-6">
              {/* 汎用サイトヘッダー */}
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="text-sm font-bold text-slate-900">〇〇進路情報サイト</div>
                <div className="flex gap-3 text-xs text-slate-600">
                  <span>大学受験</span>
                  <span>進路指導</span>
                  <span>お知らせ</span>
                </div>
              </div>

              {/* 記事タイトル・本文（汎用） */}
              <h2 className="mb-2 text-lg font-bold text-slate-900">
                総合型選抜・学校推薦型選抜で重要な「学習成績の状況」とは？
              </h2>
              <p className="mb-1 text-xs text-slate-600">2026年〇月〇日 更新</p>
              <p className="mb-4 text-base leading-[1.8] text-slate-900">
                大学入学者選抜の調査書に記載される「学習成績の状況」（通称：評定平均）は、
                総合型選抜・学校推薦型選抜の出願条件になることが多く、早めに仕組みを理解しておくことが大切です。
                下のツールで実際に計算しながら確認してみましょう。
              </p>

              {/* 実際のウィジェット（本物） */}
              <div className="my-5 flex justify-center rounded-lg border border-dashed border-brand-300 bg-brand-50 p-3">
                <iframe
                  src="/embed/gakushu-seiseki"
                  width="100%"
                  height={640}
                  style={{ border: '1px solid #cddad3', borderRadius: 8, maxWidth: 480, background: '#fff' }}
                  title="学習成績の状況 計算ツール｜My Naishin"
                  loading="lazy"
                />
              </div>

              <p className="text-base leading-[1.8] text-slate-900">
                計算方法は文部科学省の公式な定義に基づいています。詳しい仕組みや教科別の計算、
                調査書のシミュレーションは提供元サイトでも確認できます。
              </p>

              {/* 汎用サイトフッター */}
              <div className="mt-6 border-t border-slate-200 pt-3 text-center text-xs text-slate-600">
                〇〇進路情報サイト（イメージ）
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              このウィジェットを自分のサイトに設置する方法は、埋め込みウィジェットページでコードをコピーできます。
            </p>
            <Link
              href="/embed"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
            >
              埋め込みコードを取得する
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
