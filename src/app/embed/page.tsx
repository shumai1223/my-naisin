import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { EmbedWidgetPicker } from '@/components/EmbedWidgetPicker';

const PLATFORM_GUIDES = [
  {
    platform: 'WordPress',
    steps: ['投稿・固定ページの編集画面を開く', 'ブロックの追加から「カスタムHTML」ブロックを選ぶ', 'コピーしたコードを貼り付ける', 'プレビューで表示を確認して更新・公開する'],
  },
  {
    platform: 'はてなブログ',
    steps: ['記事編集画面を開く', '編集モードを「見たまま」から「HTML編集」に切り替える', 'コードを貼り付けたい位置に挿入する', 'プレビューで表示を確認して公開する'],
  },
  {
    platform: 'note',
    steps: ['HTML埋め込みに対応したプラン（note pro等）で記事を編集する', '埋め込み機能からカスタムHTMLを選ぶ', 'コードを貼り付けて表示を確認する'],
  },
  {
    platform: 'Google Sites',
    steps: ['ページ編集画面を開く', '「挿入」→「埋め込み」を選ぶ', '「HTMLを埋め込む」タブでコードを貼り付ける', '配置とサイズを調整して公開する'],
  },
  {
    platform: 'その他（HTMLを直接編集できるサイト）',
    steps: ['表示したい位置のHTMLソースを開く', 'コードをそのまま貼り付ける', '表示を確認して保存・公開する'],
  },
];

export const metadata: Metadata = {
  title: { absolute: '無料の内申点・偏差値 計算ウィジェット｜ブログに貼れる埋め込みコード | My Naishin' },
  description:
    '【無料・登録不要】内申点（素内申・評定平均）と偏差値（5教科）を計算できるツールを、あなたのブログ・サイトに埋め込めます。iframeコードをコピーして貼るだけ。塾・教育ブログ・受験情報サイトの読者に便利な計算機を提供できます。',
  keywords: ['内申点 計算 ウィジェット', '偏差値 計算 埋め込み', '評定平均 ツール 埋め込み', '内申点 計算機 ブログ', '受験 ツール iframe'],
  alternates: { canonical: 'https://my-naishin.com/embed' },
  openGraph: {
    title: '無料の内申点・偏差値 計算ウィジェット｜ブログに貼れる埋め込みコード | My Naishin',
    description: '内申点・評定平均・偏差値の計算ツールを、iframeコードのコピペであなたのサイトに設置できます。無料・登録不要。',
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
      <HowToSchema
        id="howto-embed-wordpress"
        name="内申点・偏差値ウィジェットのWordPressへの設置方法"
        description="コピーしたiframeコードをWordPressのカスタムHTMLブロックに貼り付けて設置する手順（はてなブログ・note・Google Sites等の手順はページ内で個別に解説）"
        totalTime="PT3M"
        steps={PLATFORM_GUIDES[0].steps.map((s) => ({ name: s, text: s }))}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">埋め込みウィジェット</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              内申点・偏差値の計算ツールを、あなたのサイトに
            </h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              塾・家庭教師・教育ブログ・受験情報サイトの運営者の方へ。<br />
              読者がその場で「素内申・評定平均」または「偏差値」を計算できるツールを、<strong>無料・登録不要</strong>で設置できます。
            </p>
          </header>

          {/* メリット */}
          <dl className="mb-8 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-3">
              <dt className="text-base font-bold text-slate-900">完全無料</dt>
              <dd className="mt-0.5 text-sm text-slate-600">料金・登録は一切不要</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-base font-bold text-slate-900">コピペで設置</dt>
              <dd className="mt-0.5 text-sm text-slate-600">下のコードを貼るだけ</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-base font-bold text-slate-900">入力は端末内のみ</dt>
              <dd className="mt-0.5 text-sm text-slate-600">成績は外部送信されません</dd>
            </div>
          </dl>

          {/* ライブプレビュー＋埋め込みコード（ウィジェット選択つき） */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              好きなウィジェットを選んで、この2行を貼るだけ
            </h2>
            <EmbedWidgetPicker />
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              WordPress・はてなブログ・note（HTML埋め込み対応プラン）・自作サイトなどに貼り付けてください。
              幅は自動で親要素に合わせて調整されます（最大480px）。高さが足りない場合は <code className="rounded bg-slate-100 px-1">height</code> の数値を増やしてください。
            </p>
            <p className="mt-2 text-sm leading-[1.8] text-slate-600">
              記事に埋め込んだときの見え方は{' '}
              <Link href="/embed/demo" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                埋め込みデモページ
              </Link>{' '}
              で確認できます。
            </p>
          </section>

          {/* プラットフォーム別 設置ガイド（P-4） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              プラットフォーム別 設置ガイド
            </h2>
            <div className="space-y-6">
              {PLATFORM_GUIDES.map((g) => (
                <div key={g.platform}>
                  <h3 className="mb-2 text-[17px] font-bold text-slate-900">{g.platform}</h3>
                  <ol className="space-y-1 text-base leading-[1.8] text-slate-900">
                    {g.steps.map((s, i) => (
                      <li key={s} className="flex gap-2">
                        <span className="w-6 shrink-0 font-bold tabular-nums text-brand-700">{i + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              ※ 上記以外のブログ・CMSでも、HTMLをそのまま挿入できる編集欄（カスタムHTML・埋め込み・コードブロック等）があれば同様の手順で設置できます。
              管理画面の項目名はサービスの仕様変更により変わることがあります。
            </p>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              WordPressをお使いの方は、ショートコード<code className="rounded bg-slate-100 px-1">[my_naishin type=&quot;naishin&quot;]</code>で
              設置できる専用プラグインも配布しています（
              <a
                href="https://github.com/shumai1223/my-naisin/tree/main/wordpress-plugin/my-naishin-calculator"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                プラグインファイルを見る
              </a>
              ）。
            </p>
          </section>

          {/* お願い */}
          <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
            <h2 className="mb-2 text-base font-bold text-amber-900">ご利用にあたってのお願い</h2>
            <ul className="space-y-1.5 text-base leading-[1.8] text-amber-900">
              <li className="flex"><span className="shrink-0">・</span><span>コードに含まれる <strong>「by My Naishin（内申点 計算サイト）」のクレジットリンク</strong>（iframeのすぐ下の行）は、そのまま残してください。無料で提供を続けるための唯一のお願いです。</span></li>
              <li className="flex"><span className="shrink-0">・</span><span>リンクの削除・差し替え・改変はご遠慮ください。枠の色など外側のスタイル調整は自由です。</span></li>
              <li className="flex"><span className="shrink-0">・</span><span>商用・非商用問わず、教育目的の範囲で自由にご利用いただけます。</span></li>
            </ul>
          </section>

          {/* 塾・学校サイト運営者向けパートナー導線（被リンク量産＝堀B。申請はcontact流用） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">塾・学校・教育ブログ運営者の方へ（無料パートナー）</h2>
            <p className="mb-3 text-base leading-[1.8] text-slate-900">
              生徒・保護者がよく使う「内申点・評定平均」「偏差値」の計算ツールを、貴サイトに無料で設置できます。
              読者の役に立つ実用ツールが増え、サイトの滞在時間・信頼性の向上に役立ちます。導入は<strong>iframeコードを貼るだけ</strong>・登録不要です。
            </p>
            <ol className="mb-4 space-y-1.5 text-base leading-[1.8] text-slate-900">
              <li><strong>1.</strong> 上の「コードをコピー」でiframe＋クレジットを取得</li>
              <li><strong>2.</strong> ブログ記事・サイトの好きな場所に貼り付け</li>
              <li><strong>3.</strong> クレジットリンク（by My Naishin）はそのまま残す</li>
            </ol>
            <p className="mb-4 text-sm leading-[1.8] text-slate-600">
              ロゴの差し替え・特定教科への特化・自校カラーへの調整など、提携・カスタム埋め込みのご相談も歓迎です。
              「埋め込みました」のご連絡もお気軽にどうぞ（相互紹介の検討材料にします）。
            </p>
            <Link
              href="/contact?topic=embed"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
            >
              埋め込み・提携について相談する
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>

          {/* 関連 */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">本家サイトのツール</h2>
            <p className="mb-4 text-sm leading-[1.8] text-slate-600">
              ウィジェットは「素内申・評定平均」「偏差値（簡易・標準偏差15固定）」の2種類です。都道府県別の換算内申・標準偏差指定の偏差値・S値などは本家サイトでどうぞ。
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex min-h-[44px] items-center justify-between gap-3 rounded border border-brand-700 bg-white px-4 py-3 text-base font-bold text-brand-700 hover:bg-brand-50">
                内申点を計算する（47都道府県）
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-3 rounded border border-brand-700 bg-white px-4 py-3 text-base font-bold text-brand-700 hover:bg-brand-50">
                偏差値を計算する（5教科）
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
