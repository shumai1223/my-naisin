import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, GraduationCap, Users, Code2, Database, ChevronRightSquare, HelpCircle, Printer } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';

const USE_CASES = [
  {
    icon: Users,
    title: '三者面談・進路指導での活用',
    desc: '生徒・保護者が面談前に自分で内申点・偏差値・志望校との差を計算しておくと、面談時間を「数値の確認」でなく「対策の相談」に使えます。面談準備チェックリスト（印刷対応）をそのまま案内できます。',
    href: '/mendan',
    cta: '三者面談準備パックを見る',
  },
  {
    icon: Printer,
    title: '授業・学級通信での配布',
    desc: '47都道府県の内申点の仕組みを解説した記事や、都道府県別の計算ツールへのリンクを、学級通信・進路だよりで紹介できます。無料・登録不要で、生徒がそのままブラウザで使えます。',
    href: '/prefectures',
    cta: '都道府県別の制度ページを見る',
  },
  {
    icon: Code2,
    title: '学校サイト・ブログへの埋め込み',
    desc: '内申点・偏差値・評定平均の計算ツールを、iframeコードのコピペで学校のWebサイトや進路指導ブログに埋め込めます。生徒が学校サイト内でそのまま計算できます。',
    href: '/embed',
    cta: '埋め込みウィジェットを見る',
  },
  {
    icon: Database,
    title: 'データ連携・システム開発（API）',
    desc: '47都道府県の内申点計算ロジックをAPI・MCPで提供しています。校内システムや進路指導ツールに内申点計算機能を組み込みたい場合にご利用いただけます。',
    href: '/developers',
    cta: '開発者向けドキュメントを見る',
  },
];

const FAQS = [
  {
    question: 'My Naishinを生徒に紹介しても問題ありませんか？',
    answer: 'はい。完全無料・会員登録不要で使えるツールです。47都道府県の教育委員会の入学者選抜要綱を一次情報として計算方式を実装しており、出典は各ページに明記しています。学級通信・進路だより・三者面談資料での紹介にご利用いただけます。',
  },
  {
    question: '学校のWebサイトに埋め込むことはできますか？',
    answer: 'できます。/embed ページでiframeの埋め込みコードを発行できます。内申点・評定平均・偏差値の計算ツールをコピペで設置でき、費用はかかりません。',
  },
  {
    question: '内申点の計算方式は都道府県ごとに正しく反映されていますか？',
    answer: '47都道府県それぞれの教育委員会が公表する入学者選抜要綱を一次情報として実装し、出典URLと最終確認日を各都道府県ページに明記しています。制度改定があった場合は一次情報の確認後に反映します。',
  },
  {
    question: '校内システムにデータを組み込みたい場合はどうすればいいですか？',
    answer: '/developers ページでAPI・MCPサーバーの仕様を公開しています。47都道府県の内申点計算・総合得点計算のエンドポイントを提供しており、無料枠から利用を開始できます。',
  },
];

export const metadata: Metadata = {
  title: '学校の先生・進路指導のご担当者様へ | My Naishin',
  description: '内申点・偏差値・評定平均の無料計算ツールを、三者面談準備・授業配布・学校サイトへの埋め込み・校内システムへのデータ連携に活用いただけます。47都道府県の教育委員会一次情報に基づく無料ツール。',
  keywords: ['内申点 計算 学校', '進路指導 ツール', '三者面談 準備 先生', '内申点 計算 埋め込み 学校サイト'],
  alternates: { canonical: 'https://my-naishin.com/for-teachers' },
  openGraph: {
    title: '学校の先生・進路指導のご担当者様へ | My Naishin',
    description: '内申点・偏差値・評定平均の無料計算ツールを、三者面談準備・授業配布・埋め込み・データ連携に活用いただけます。',
    url: 'https://my-naishin.com/for-teachers',
    type: 'website',
  },
};

export default function ForTeachersPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '先生・進路指導のご担当者様へ', url: 'https://my-naishin.com/for-teachers' },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">先生・進路指導のご担当者様へ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">学校の先生・進路指導のご担当者様へ</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              内申点・偏差値・評定平均の無料計算ツールを、<strong>三者面談の準備・授業や学級通信での配布・学校サイトへの埋め込み・校内システムへのデータ連携</strong>に活用いただけます。
              47都道府県の教育委員会が公表する入学者選抜要綱を一次情報として実装しています。
            </p>
          </header>

          <section className="space-y-4">
            {USE_CASES.map((u) => {
              const Icon = u.icon;
              return (
                <div key={u.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></span>
                    {u.title}
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">{u.desc}</p>
                  <Link href={u.href} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                    {u.cta}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/quality" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                情報の信頼性への取り組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/about/editor-profile" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                運営者プロフィール
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/prefectures" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                47都道府県の入試制度ページ
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/partner" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                塾・教育事業者様向けパートナー案内
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              よくある質問
            </h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
