import { AlertTriangle, ChevronRight, Home } from '@/components/icons';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

import { APP_NAME } from '@/lib/constants';

export default function DisclaimerPage() {
  const lastUpdated = '2026年4月22日';

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '免責事項', url: 'https://my-naishin.com/disclaimer' }
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">免責事項</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">免責事項・データの信頼性</h1>
          <p className="mt-2 flex flex-wrap gap-x-4 text-sm text-slate-600">
            <span>Disclaimer & Data Reliability</span>
            <span>最終更新日: {lastUpdated}</span>
          </p>
        </header>

        {/* Important Notice Box */}
        <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
          <h2 className="flex items-center gap-1.5 text-base font-bold text-amber-900">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            重要なお知らせ
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-[1.8] text-amber-900">
            <li>計算結果はあくまで<strong>目安（シミュレーション）</strong>です。進路決定は必ず学校の先生にご相談ください</li>
            <li>内申点の計算方法は都道府県・学校・コースによって異なる場合があります</li>
            <li>当サイトは個人運営であり、特定の教育機関・教育委員会と直接的な提携関係にあるものではありません</li>
          </ul>
        </section>

        {/* Content */}
        <div className="space-y-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">

          {/* はじめに */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">1. サービスの目的</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              {APP_NAME}（以下「当サイト」）は、中学生およびその保護者の方々が、高校入試において極めて重要な「内申点」の仕組みを理解し、自己管理することを支援するためのツールです。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              公的な情報を可能な限り分かりやすく整理して提供しておりますが、いかなる法的助言や専門的な教育相談を構成するものではありません。
            </p>
          </section>

          {/* 計算結果について */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">2. 計算結果の正確性について</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              当サイトで提供する内申点の計算結果は、ユーザー様の入力データに基づき、各都道府県の一般的な算出式を用いてシミュレーションしたものです。
            </p>

            <ul className="list-disc space-y-3 pl-5 text-base leading-[1.8] text-slate-900">
              <li><strong>例外的な措置の存在：</strong> 欠席日数の扱い、部活動・ボランティア・資格等の加点、特定教科の重点化などは、学校や募集要項によって個別に設定されるため、当サイトの基本計算ツールでは完全に網羅できない場合があります。</li>
              <li><strong>制度の変更：</strong> 各教育委員会は予告なく入試制度を変更することがあります。当サイトでは定期的な更新を行っておりますが、最新の正確な情報については、必ず各都道府県教育委員会の公式サイトや募集要項PDFをご確認ください。</li>
              <li><strong>調査書の優先：</strong> 合否判定に使われる最終的な内申点は、在籍中学校が作成し高校へ提出される「調査書」の数値です。</li>
            </ul>
          </section>

          {/* 責任の制限 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">3. 責任の制限</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトの利用により生じた損害、または当サイトを利用できなかったことにより生じた損害について、当サイト運営者は、法令に別段の定めがある場合を除き、一切の責任を負いません。
            </p>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              ※当サイトの計算ミスに基づき不適切な志望校選択を行った場合や、データの消失等によって発生した不利益について、当サイトは補償等を行うことはできません。
            </p>
          </section>

          {/* 広告と外部リンク */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">4. 広告と外部リンク</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトでは運営継続のため広告を表示しております。表示される広告内容や、リンク先の外部サイトのコンテンツについては、当サイトが推奨または保証するものではありません。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
