import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Handshake, Users, Target, BarChart3, MapPin, Code2, Mail, CheckCircle2 } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

export const metadata: Metadata = {
  title: '塾・個別指導の集客パートナー募集｜内申点計算サイトからの送客 | My Naishin',
  description:
    '全国47都道府県の中学生・保護者が使う内申点・偏差値の計算サイト「My Naishin」から、貴塾・貴教室へ受験意欲の高い見込み客を送客します。地域・面を指定した送客、無料体験への動線、ウィジェット提供まで。資料請求・無料体験のCPA提携、または直接送客契約をご相談ください。',
  keywords: ['塾 集客', '塾 送客', '個別指導 集客', '塾 提携', '教育 アフィリエイト 塾', '塾 リード獲得'],
  alternates: { canonical: `${SITE_URL}/partner` },
  openGraph: {
    title: '塾・個別指導の集客パートナー募集｜内申点計算サイトからの送客 | My Naishin',
    description: '受験意欲の高い中学生・保護者を、地域・面を指定して貴塾へ送客。CPA提携／直接送客契約をご相談ください。',
    url: `${SITE_URL}/partner`,
    type: 'website',
  },
};

const VALUE = [
  {
    icon: Target,
    title: '受験意欲の高い見込み客',
    body: '内申点・偏差値・志望校との差を「自分で計算しに来る」生徒・保護者。今まさに対策を探している層なので、無料体験・資料請求への転換が見込めます。',
  },
  {
    icon: MapPin,
    title: '地域・面を指定した送客',
    body: '都道府県別・ページ種別（計算結果・偏差値・学費など）で出し分け可能。貴塾の商圏に絞った送客や、保護者向け／生徒向けの出し分けに対応します。',
  },
  {
    icon: BarChart3,
    title: '一次データに基づく実績レポート',
    body: 'クリックは自社ドメインの計測（/go・D1）で記録するため、欠測の少ない実数で「どの地域・面から何クリック送ったか」を月次レポートでご提示できます。',
  },
  {
    icon: Code2,
    title: '無料ウィジェットの提供',
    body: '内申点・評定平均の計算ツールを貴塾サイトに無料で埋め込めます。コンテンツSEOの強化と、自然な無料体験への導線づくりに使えます。',
  },
];

const STEPS = [
  { n: '1', t: 'お問い合わせ', d: '下のフォームから、塾名・対応地域・希望（CPA提携／直接送客／ウィジェット）をお知らせください。' },
  { n: '2', t: '送客プランのご相談', d: '商圏（都道府県）・出し分ける面・成果地点（無料体験／資料請求／入塾）をすり合わせます。' },
  { n: '3', t: '計測して送客開始', d: '専用の計測リンクを設定し、地域・面別のクリック実数を記録。月次でレポートをご提供します。' },
  { n: '4', t: '実績で最適化', d: '効いた地域・面に送客を寄せ、CPA・条件を実績ベースで見直します。' },
];

export default function PartnerPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '塾・個別指導の集客パートナー募集', url: `${SITE_URL}/partner` },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="flex items-center gap-1 hover:text-white"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-200">集客パートナー募集</span>
          </nav>

          <header className="mb-10 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-xl">
              <Handshake className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">受験意欲の高い中学生・保護者を、貴塾へ。</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300">
              「My Naishin」は、全国47都道府県の中学生・保護者が<strong className="text-white">内申点・偏差値・志望校との差</strong>を計算しに来るサイトです。
              いままさに受験対策を探している層を、<strong className="text-white">地域・面を指定して</strong>貴塾・貴教室へ送客します。
            </p>
          </header>

          {/* 信頼の数値（捏造しない・定性表現） */}
          <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: '対応エリア', v: '全国47都道府県' },
              { k: '主な利用者', v: '中学生・保護者' },
              { k: '送客の成果地点', v: '無料体験・資料請求' },
              { k: '計測', v: '一次データ（実数）' },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-xs text-slate-400">{s.k}</div>
                <div className="mt-1 text-sm font-bold text-white">{s.v}</div>
              </div>
            ))}
          </section>

          {/* 価値 */}
          <section className="mb-10 grid gap-4 sm:grid-cols-2">
            {VALUE.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-2 flex items-center gap-2 font-bold text-white">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300"><Icon className="h-5 w-5" /></span>
                    {v.title}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
                </div>
              );
            })}
          </section>

          {/* 提携の形 */}
          <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white"><Users className="h-5 w-5 text-emerald-300" />提携の形</h2>
            <ul className="space-y-2.5 text-sm leading-relaxed text-slate-300">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span><strong className="text-white">CPA提携</strong>：無料体験・資料請求などの成果1件ごとの成果報酬。ASP経由でも、直接でも可。</span></li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span><strong className="text-white">直接送客契約</strong>：商圏（都道府県）を指定した独占的な送客。実績に応じてCPA・条件を設計。</span></li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span><strong className="text-white">ウィジェット提供</strong>：内申点・評定平均の計算ツールを貴塾サイトへ無料で埋め込み（SEO・回遊強化）。</span></li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span><strong className="text-white">掲載枠スポンサー（県×面）</strong>：都道府県・ページ種別を指定した月額固定の掲載枠。成果報酬ではなく定額でのご出稿をご希望の場合はこちらをご相談ください（「広告」表記込み・商圏の独占可）。</span></li>
            </ul>
          </section>

          {/* 流れ */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-white">提携までの流れ</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-sm font-black text-white">{s.n}</div>
                  <div className="text-sm font-bold text-white">{s.t}</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center shadow-xl">
            <h2 className="text-xl font-bold text-white md:text-2xl">まずはお気軽にご相談ください</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-emerald-50">
              塾名・対応地域・ご希望（CPA提携／直接送客／ウィジェット）をお書き添えのうえ、お問い合わせフォームよりご連絡ください。担当より折り返しご連絡します。
            </p>
            <div className="mt-5 flex flex-col items-stretch justify-center gap-2 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-700 shadow-md transition-all hover:-translate-y-0.5">
                <Mail className="h-4 w-4" />お問い合わせフォームへ
              </Link>
              <Link href="/embed" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700/40 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/30 transition-colors hover:bg-emerald-700/60">
                <Code2 className="h-4 w-4" />ウィジェットを見る
              </Link>
            </div>
          </section>

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
            ※ 送客実績はクリック実数（一次データ）でご提示します。成果の確定・報酬条件は提携形態により異なります。
          </p>
          <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
            学校・進路指導のご担当者様は<Link href="/for-teachers" className="font-bold text-emerald-700 hover:underline">先生・進路指導のご担当者様へ</Link>のページもご覧ください。
          </p>
        </div>
      </div>
    </>
  );
}
