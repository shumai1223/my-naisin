import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlarmClockCheck, TrendingUp, FileWarning, HelpCircle, ChevronRightSquare } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '内申点が足りないことに冬になって気づきました。もう挽回できませんか？',
    answer:
      '多くの都道府県で内申点は2学期（または3学期の一部）までの評定でほぼ確定します。過去の学期の評定は基本的に変わりませんが、合否は「内申点＋当日点」の合計で決まる地域がほとんどです。内申の不足分は、残された当日点（学力検査）で挽回することが現実的な戦略になります。まずは志望校の配点比率で「当日何点必要か」を逆算しましょう。',
  },
  {
    question: '入試本番まで1〜2ヶ月で偏差値は上がりますか？',
    answer:
      '短期間でも、苦手分野を絞った対策や、頻出パターンの反復で得点力は伸ばせます。特に暗記系（社会・理科の知識分野、英単語・古文単語など）は直前期でも比較的伸びやすい分野です。全教科を満遍なくではなく、配点が大きく伸びしろのある分野に絞るのが直前期の基本戦略です。',
  },
  {
    question: '当日点だけで内申の不足を完全にカバーできますか？',
    answer:
      '都道府県・志望校の配点比率によります。内申の比重が高い地域（例：内申:当日=7:3など）では当日点だけでの逆転が難しく、逆に当日点の比重が高い地域では挽回の余地が大きくなります。まずは志望校の配点比率を確認し、必要な当日点を逆算した上で、現実的な目標かどうかを判断しましょう。',
  },
  {
    question: '今から併願校を増やす・変更することはできますか？',
    answer:
      '私立高校の併願校は、出願手続きが完了する前であれば選択肢を見直せる場合があります。ただし出願期限は学校ごとに決まっているため、時間の余裕はあまりありません。内申・当日点の見込みと出願締切を早めに確認し、必要であれば三者面談で担任に相談してください。',
  },
];

export const metadata: Metadata = {
  title: '内申点・当日点が足りない冬の緊急対策ハブ｜今からできること | My Naishin',
  description:
    '内申点が足りないと気づいた冬、入試本番まで時間がない当日点の追い込み。今からできる現実的な対策を、内申確定後の当日点逆転戦略・直前期の得点力アップ・併願校の見直しの3方向で整理しました。',
  keywords: ['内申点 足りない 冬', '当日点 足りない', '入試直前 対策', '内申 挽回', '偏差値 直前期', '受験 間に合わない'],
  alternates: { canonical: `${SITE_URL}/tarinai-taisaku` },
  openGraph: {
    title: '内申点・当日点が足りない冬の緊急対策ハブ｜今からできること',
    description: '内申確定後の当日点逆転戦略・直前期の得点力アップ・併願校見直しの3方向で整理した緊急対策。',
    url: `${SITE_URL}/tarinai-taisaku`,
    type: 'website',
  },
};

export default function TarinaiTaisakuPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点・当日点が足りない冬の緊急対策', url: `${SITE_URL}/tarinai-taisaku` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-rose-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点・当日点が足りない冬の緊急対策</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-xl">
              <AlarmClockCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              内申点・当日点が足りない冬の緊急対策
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              「内申が思ったより足りない」「本番まで時間がないのに当日点が伸びていない」——
              冬に焦っても、<strong>今からできることは残っています</strong>。現実的な打ち手を整理しました。
            </p>
          </header>

          <AnswerBox question="内申点が足りないと冬に気づいたら、まず何をすべき？">
            <p>
              多くの地域で内申点はすでに確定または確定間近です。まず<strong>志望校の内申:当日点の配点比率</strong>を確認し、
              <strong>当日何点取れば届くか</strong>を逆算しましょう。逆算した点数が現実的な範囲なら、そこに向けて残り時間を配分するのが最善策です。
            </p>
          </AnswerBox>

          {/* 3方向の対策 */}
          <section className="mt-8 grid gap-4 md:grid-cols-1">
            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-rose-900">
                <FileWarning className="h-5 w-5" />
                ① 内申の不足分を、当日点でいくら埋める必要があるか逆算する
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-rose-900/90">
                内申点はもう動かせない前提で、志望校の配点比率から「当日に何点必要か」を先に数字で出します。
                漠然とした不安のまま焦るより、具体的な目標点があるほうが対策が立てやすくなります。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/reverse" className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700">
                  志望校から当日点を逆算する<ChevronRightSquare className="h-3.5 w-3.5" />
                </Link>
                <Link href="/hensachi/gyakusan" className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-300 hover:bg-rose-50">
                  目標偏差値までの必要点数を逆算する<ChevronRightSquare className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-amber-900">
                <TrendingUp className="h-5 w-5" />
                ② 直前期は「全教科まんべんなく」より「伸びしろが大きい分野」に絞る
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-amber-900/90">
                残り時間が少ないほど、範囲を絞った対策が有効です。社会・理科の知識分野や英単語・古文単語など暗記系は直前でも伸びやすく、
                逆に応用的な思考力を要する分野は短期間での伸びが限定的です。過去問で「できていない分野」を特定し、優先順位をつけましょう。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/hensachi/agekata" className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700">
                  偏差値の上げ方（直前期の対策）<ChevronRightSquare className="h-3.5 w-3.5" />
                </Link>
                <Link href="/hensachi/kyoka-betsu" className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-300 hover:bg-amber-50">
                  教科別に弱点を特定する<ChevronRightSquare className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-blue-900">
                <FileWarning className="h-5 w-5" />
                ③ 併願校・受験プランを現実的に見直す
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-blue-900/90">
                逆算した必要点数が届きそうにない場合は、併願校（私立の併願優遇や公立の第2志望）を含めた受験プラン全体を見直すのも
                有効な選択肢です。出願期限が迫っているため、早めに担任・進路指導の先生に相談しましょう。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/mendan" className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
                  三者面談で相談する準備<ChevronRightSquare className="h-3.5 w-3.5" />
                </Link>
                <Link href="/juken-schedule" className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-700 ring-1 ring-blue-300 hover:bg-blue-50">
                  出願スケジュールを確認する<ChevronRightSquare className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* 関連 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">あわせて確認</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">今の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">今の偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/total-score" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">都道府県別の総合得点の仕組みを見る</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/futoukou" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">出欠が心配な場合の内申点への影響</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-rose-600" />よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
                    <span className="flex items-center justify-between gap-3">{f.question}<ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" /></span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
