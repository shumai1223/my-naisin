import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ShieldAlert } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { PREFECTURES } from '@/lib/prefectures';
import { HUB_CALCULATORS, HUB_EXPLAINERS } from '@/lib/total-score/hub';
import { STATIC_PAGES } from '@/lib/page-registry';
import { SITE_URL } from '@/lib/naishin-dataset';

// 実績数値はすべてコードのレジストリから実測（捏造ゼロ）。手打ちの固定値は持たない。
const STATS = [
  { label: '内申点計算 対応都道府県', value: `${PREFECTURES.length}/47`, note: '全都道府県対応' },
  { label: '総合得点 自動計算対応', value: `${HUB_CALCULATORS.length}県`, note: '解説のみの県は34県' },
  { label: '総合得点 制度解説', value: `${HUB_EXPLAINERS.length}県`, note: '計算確証が取れない県は解説に留める方針' },
  { label: '公開ページ数', value: `${STATIC_PAGES.length}ページ`, note: '静的ページ登録簿ベース(動的ルート除く)' },
];

export const metadata: Metadata = {
  title: 'プレスキット・取材のお問い合わせ | My Naishin',
  description:
    'My Naishin(マイ内申)の運営者ストーリー・検証可能な実績数値・素材・取材窓口をまとめたプレスキットページ。現役中学生エンジニアが47都道府県の教育委員会一次資料を解析して開発した内申点計算サイトです。',
  alternates: { canonical: `${SITE_URL}/press` },
  openGraph: {
    title: 'プレスキット・取材のお問い合わせ | My Naishin',
    description: '現役中学生エンジニアが開発した内申点計算サイトのプレスキット。',
    url: `${SITE_URL}/press`,
    type: 'article',
  },
};

export default function PressPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'プレスキット', url: `${SITE_URL}/press` },
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
            <span className="text-slate-900">プレスキット</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">プレスキット</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              取材・記事化を検討されるメディア関係者の方向けの資料です。運営者ストーリー・実績数値・素材・取材窓口をまとめています。
            </p>
          </header>

          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">運営者ストーリー</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              現役の中学生エンジニア（ハンドルネーム「ないしんパンダ」）が、自身の高校受験（2026年度・令和8年度入試）
              に向けて「自分の内申点が何点なのか正確に知りたい」という個人的な動機からツールを開発したのが出発点です。
              47都道府県すべての教育委員会が公表する入学者選抜要綱（1県あたり平均50ページ超のPDF）を自ら読み解き、
              計算ロジックをコードに落とし込んで公開しています。詳しい開発経緯は
              <Link href="/about/editor-profile" className="mx-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                開発者プロフィール
              </Link>
              でもご覧いただけます。
            </p>
            <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-sm leading-[1.8] text-amber-900">
                <strong>取材上の配慮事項</strong>: 未成年の個人情報保護のため、実名・在籍校名・具体的な居住地域は一切開示していません。
                記事化の際は「現役中学生エンジニア」「ハンドルネーム：ないしんパンダ」の範囲にとどめていただくようお願いいたします。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">検証可能な実績数値</h2>
            <p className="mb-4 text-sm leading-[1.8] text-slate-600">
              コードのレジストリまたはGoogle Search Consoleから直接集計した実測値です。手打ちで古くなる数字は使用していません。
            </p>
            <dl className="grid grid-cols-2 gap-px border-y border-slate-200 bg-slate-200 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white px-4 py-3">
                  <dt className="break-keep text-xs text-slate-600">{s.label}</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              直近28日の検索クリック数は5,634クリック（表示回数233,266・平均掲載順位7.36位、Google Search Console実測・2026年7月30日〜8月27日）。
              最新の数値が必要な場合はお問い合わせください。
            </p>
          </section>

          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">素材（アセット）</h2>
            <div className="space-y-2 text-base leading-[1.8] text-slate-900">
              <p>
                ファビコン/ロゴアイコン:{' '}
                <a href="/favicon.svg" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  favicon.svg
                </a>
              </p>
              <p>
                OGP画像:{' '}
                <a href="/og-image.png" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  og-image.png
                </a>
              </p>
              <p className="text-sm text-slate-600">
                スクリーンショット・追加素材は取材内容に応じて別途提供可能です。下記の窓口までご連絡ください。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">取材可能なトピック例</h2>
            <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
              <li>現役中学生が自身の受験のために47都道府県の行政資料を解析してサービス化した経緯</li>
              <li>
                「内申点の県による格差」の実データ分析（
                <Link href="/naishin-kakusa" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  都道府県別 内申点格差レポート
                </Link>
                ）
              </li>
              <li>生成AI時代の受験情報サイトが取るデータ構造化戦略（llms.txt・Dataset構造化・MCP公開）</li>
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">取材窓口</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              取材・記事化のご相談は下記までメールでご連絡ください。運営者本人が確認の上、対応いたします
              （返信まで数日いただく場合があります）。
            </p>
            <p className="mt-3 text-base font-bold text-slate-900">naishin.dev@gmail.com</p>
            <div className="mt-2">
              <Link href="/about" className="inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                運営者情報・信頼性への取り組みを見る
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
