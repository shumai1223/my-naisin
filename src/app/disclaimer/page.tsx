import { AlertTriangle, ArrowLeft, Info, CheckCircle, XCircle, Shield, ExternalLink, Database, Mail } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

import { APP_NAME } from '@/lib/constants';

export default function DisclaimerPage() {
  const lastUpdated = '2026年4月16日';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '免責事項', url: 'https://my-naishin.com/disclaimer' }
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200">
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">免責事項・データの信頼性</h1>
            <p className="text-sm text-slate-500">Disclaimer & Data Reliability</p>
          </div>
        </div>

        {/* Important Notice Box */}
        <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            重要なお知らせ
          </h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">⚠</span>
              <span>計算結果はあくまで<strong>目安（シミュレーション）</strong>です。進路決定は必ず学校の先生にご相談ください</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">⚠</span>
              <span>内申点の計算方法は都道府県・学校・コースによって異なる場合があります</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">⚠</span>
              <span>当サイトは個人運営であり、特定の教育機関・教育委員会と直接的な提携関係にあるものではありません</span>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          
          {/* はじめに */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-3">1. サービスの目的</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {APP_NAME}（以下「当サイト」）は、中学生およびその保護者の方々が、高校入試において極めて重要な「内申点」の仕組みを理解し、自己管理することを支援するためのツールです。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              公的な情報を可能な限り分かりやすく整理して提供しておりますが、いかなる法的助言や専門的な教育相談を構成するものではありません。
            </p>
          </section>

          {/* 計算結果について */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">2. 計算結果の正確性について</h2>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 mb-4">
              <p className="text-xs leading-relaxed text-amber-800">
                当サイトで提供する内申点の計算結果は、ユーザー様の入力データに基づき、各都道府県の一般的な算出式を用いてシミュレーションしたものです。
              </p>
            </div>
            
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>例外的な措置の存在：</strong> 欠席日数の扱い、部活動・ボランティア・資格等の加点、特定教科の重点化などは、学校や募集要項によって個別に設定されるため、当サイトの基本計算ツールでは完全に網羅できない場合があります。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>制度の変更：</strong> 各教育委員会は予告なく入試制度を変更することがあります。当サイトでは定期的な更新を行っておりますが、最新の正確な情報については、必ず各都道府県教育委員会の公式サイトや募集要項PDFをご確認ください。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>調査書の優先：</strong> 合否判定に使われる最終的な内申点は、在籍中学校が作成し高校へ提出される「調査書」の数値です。</span>
              </li>
            </ul>
          </section>

          {/* 責任の制限 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-red-500 pl-3">3. 責任の制限</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトの利用により生じた損害、または当サイトを利用できなかったことにより生じた損害について、当サイト運営者は、法令に別段の定めがある場合を除き、一切の責任を負いません。
            </p>
            <p className="mt-4 text-xs text-slate-400">
              ※当サイトの計算ミスに基づき不適切な志望校選択を行った場合や、データの消失等によって発生した不利益について、当サイトは補償等を行うことはできません。
            </p>
          </section>

          {/* 広告と外部リンク */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">4. 広告と外部リンク</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトでは運営継続のため広告を表示しております。表示される広告内容や、リンク先の外部サイトのコンテンツについては、当サイトが推奨または保証するものではありません。
            </p>
          </section>

          <div className="rounded-xl bg-slate-50 p-4 text-center text-[10px] text-slate-400">
            最終更新日: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}
