import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Newspaper, Mail, ImageIcon, User, ShieldAlert } from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">プレスキット</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-xl">
              <Newspaper className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">プレスキット</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              取材・記事化を検討されるメディア関係者の方向けの資料です。運営者ストーリー・実績数値・素材・取材窓口をまとめています。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <User className="h-5 w-5 text-indigo-600" />
              運営者ストーリー
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              現役の中学生エンジニア（ハンドルネーム「しゅうまい」）が、自身の高校受験（2026年度・令和8年度入試）
              に向けて「自分の内申点が何点なのか正確に知りたい」という個人的な動機からツールを開発したのが出発点です。
              47都道府県すべての教育委員会が公表する入学者選抜要綱（1県あたり平均50ページ超のPDF）を自ら読み解き、
              計算ロジックをコードに落とし込んで公開しています。詳しい開発経緯は
              <Link href="/about/editor-profile" className="mx-1 font-bold text-indigo-700 underline">
                開発者プロフィール
              </Link>
              でもご覧いただけます。
            </p>
            <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-xs leading-relaxed text-amber-800">
                <strong>取材上の配慮事項</strong>: 未成年の個人情報保護のため、実名・在籍校名・具体的な居住地域は一切開示していません。
                記事化の際は「現役中学生エンジニア」「ハンドルネーム：しゅうまい」の範囲にとどめていただくようお願いいたします。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">検証可能な実績数値</h2>
            <p className="mb-4 text-xs text-slate-500">
              コードのレジストリまたはGoogle Search Consoleから直接集計した実測値です。手打ちで古くなる数字は使用していません。
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl bg-slate-50 p-4 text-center">
                  <div className="text-xl font-black text-slate-800">{s.value}</div>
                  <div className="mt-1 text-[11px] font-medium text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              直近28日の検索クリック数は7,889クリック（表示回数199,364・平均掲載順位6.1位、Google Search Console実測・2026年6月15日〜7月13日）。
              最新の数値が必要な場合はお問い合わせください。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              素材（アセット）
            </h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                ファビコン/ロゴアイコン:{' '}
                <a href="/favicon.svg" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-700 underline">
                  favicon.svg
                </a>
              </p>
              <p>
                OGP画像:{' '}
                <a href="/og-image.png" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-700 underline">
                  og-image.png
                </a>
              </p>
              <p className="text-xs text-slate-500">
                スクリーンショット・追加素材は取材内容に応じて別途提供可能です。下記の窓口までご連絡ください。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800">取材可能なトピック例</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
              <li>現役中学生が自身の受験のために47都道府県の行政資料を解析してサービス化した経緯</li>
              <li>
                「内申点の県による格差」の実データ分析（
                <Link href="/naishin-kakusa" className="font-bold text-indigo-700 underline">
                  都道府県別 内申点格差レポート
                </Link>
                ）
              </li>
              <li>生成AI時代の受験情報サイトが取るデータ構造化戦略（llms.txt・Dataset構造化・MCP公開）</li>
            </ul>
          </section>

          <section className="rounded-2xl border-2 border-indigo-600 bg-indigo-50 p-6 shadow-md">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-indigo-900">
              <Mail className="h-5 w-5 text-indigo-600" />
              取材窓口
            </h2>
            <p className="text-sm leading-relaxed text-indigo-800">
              取材・記事化のご相談は下記までメールでご連絡ください。運営者本人が確認の上、対応いたします
              （返信まで数日いただく場合があります）。
            </p>
            <p className="mt-3 text-sm font-bold text-indigo-900">naishin.dev@gmail.com</p>
            <div className="mt-4">
              <Link href="/about" className="text-sm font-bold text-indigo-700 underline">
                運営者情報・信頼性への取り組みを見る
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
