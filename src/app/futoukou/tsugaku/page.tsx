import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Route, School, Laptop, Building2, HelpCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { FutoukouLeadCTA } from '@/components/FutoukouLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '通信制高校と全日制高校の違いは何ですか？',
    answer:
      '全日制は平日の昼間に毎日登校して3年間で卒業する形態、通信制はレポート（添削課題）・スクーリング（面接指導）・試験で単位を取り、登校日数を抑えながら学べる形態です。通信制は自分のペースで学べるため、不登校や体調・仕事との両立がしやすく、登校の頻度も週数日〜年数回までコースで選べます。卒業に必要な単位数（74単位以上）や高卒資格は全日制と同じです。',
  },
  {
    question: '通信制・定時制・サポート校・フリースクールはどう違いますか？',
    answer:
      '通信制高校と定時制高校は「高校」なので卒業すれば高卒資格が得られます。サポート校は通信制高校での学習を支援する民間施設で、それ単独では卒業資格は出ません（提携する通信制高校に在籍します）。フリースクールは主に小中学生の居場所・学びの場で、在籍校と連携すれば「出席扱い」になる場合があります。目的（高卒資格が要るか・居場所が要るか）で選ぶのがポイントです。',
  },
  {
    question: '通信制高校から大学進学はできますか？',
    answer:
      'できます。通信制高校でも大学・専門学校への進学は可能で、進学コースや個別指導を備えた学校・サポート校も増えています。総合型選抜（旧AO）や学校推薦型選抜は、探究活動や課外活動・自分のペースで積み上げた実績を評価するため、通信制との相性が良いケースもあります。進学を見据えるなら、進学実績やサポート体制を学校選びの軸にしましょう。',
  },
  {
    question: 'フリースクールやオンライン学習は「出席扱い」になりますか？',
    answer:
      '一定の条件を満たせば、フリースクールや自宅でのICT（オンライン）学習が在籍中学校の出席扱いとして認められる場合があります（文部科学省の通知に基づく運用）。認定するのは在籍校の校長のため、学校と連携する仕組みを持つ事業者を選び、事前に担任・校長へ相談することが大切です。出席扱いになると、調査書の出欠の記録の面でも安心材料になります。',
  },
];

export const metadata: Metadata = {
  title: '通信制高校・フリースクールという選択肢｜不登校からの進路の違いと選び方 | My Naishin',
  description:
    '不登校の進路として、通信制高校・定時制高校・サポート校・フリースクールの違いと選び方をわかりやすく解説。登校頻度・高卒資格の有無・大学進学のしやすさ・フリースクールの「出席扱い」の仕組みまで。全日制以外でも進路は広く開かれています。在宅で学べる無料の資料請求・体験も紹介します。',
  keywords: ['通信制高校', '通信制 全日制 違い', 'フリースクール 出席扱い', 'サポート校 通信制 違い', '定時制 通信制 違い', '不登校 進路', '通信制高校 大学進学'],
  alternates: { canonical: `${SITE_URL}/futoukou/tsugaku` },
  openGraph: {
    title: '通信制高校・フリースクールという選択肢｜不登校からの進路の違いと選び方',
    description: '通信制・定時制・サポート校・フリースクールの違いと選び方。登校頻度・高卒資格・大学進学・出席扱いまで解説。',
    url: `${SITE_URL}/futoukou/tsugaku`,
    type: 'website',
  },
};

const OPTIONS = [
  {
    icon: Laptop,
    name: '通信制高校',
    cred: '高卒資格あり',
    body: 'レポート・スクーリング・試験で単位を取得。登校頻度を週数日〜年数回まで選べ、自分のペースで学べる。進学コースや専門コースを持つ学校も増加。',
  },
  {
    icon: School,
    name: '定時制高校',
    cred: '高卒資格あり',
    body: '夜間や昼間の時間帯に通学する高校。少人数で学び直しがしやすい。3年または4年で卒業。働きながら通う生徒も。',
  },
  {
    icon: Building2,
    name: 'サポート校',
    cred: '単独では資格なし',
    body: '通信制高校での学習を支援する民間施設。提携する通信制高校に在籍して卒業資格を得る。手厚いサポートが特長。',
  },
  {
    icon: Route,
    name: 'フリースクール',
    cred: '居場所・学びの場',
    body: '主に小中学生の居場所・学びの場。在籍校と連携すれば「出席扱い」になる場合がある。高校段階の選択肢を考える土台に。',
  },
];

export default function FutoukouTsugakuPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '不登校と内申点', url: `${SITE_URL}/futoukou` },
          { name: '通信制・フリースクール', url: `${SITE_URL}/futoukou/tsugaku` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/futoukou" className="hover:text-blue-600">不登校と内申点</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">通信制・フリースクール</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl">
              <Route className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">通信制高校・フリースクールという選択肢</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              全日制だけが進路ではありません。<strong>通信制・定時制・サポート校・フリースクール</strong>の違いと選び方、
              <strong>出席扱い</strong>の仕組みを整理しました。
            </p>
          </header>

          <AnswerBox question="通信制・定時制・サポート校・フリースクールはどう違う？">
            <p>
              <strong>通信制高校・定時制高校</strong>は「高校」なので卒業すれば<strong>高卒資格</strong>が得られます。通信制はレポート・スクーリング・試験で単位を取り、登校頻度を抑えて自分のペースで学べます。
              <strong>サポート校</strong>は通信制での学習を支援する民間施設で、単独では卒業資格は出ません（提携する通信制高校に在籍）。
              <strong>フリースクール</strong>は主に居場所・学びの場で、在籍校と連携すれば<strong>「出席扱い」</strong>になる場合があります。目的（高卒資格か居場所か）で選びましょう。
            </p>
          </AnswerBox>

          {/* 選択肢の比較 */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {OPTIONS.map((o) => {
              const Icon = o.icon;
              return (
                <div key={o.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon className="h-5 w-5" /></span>
                      {o.name}
                    </div>
                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">{o.cred}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{o.body}</p>
                </div>
              );
            })}
          </section>

          {/* 選び方の軸 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">選ぶときに見るポイント</h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
              <li className="flex gap-2"><span className="text-rose-500">・</span><span><strong>登校頻度</strong>：毎日・週数日・年数回など、いまの体調・気持ちに合うペースを選べるか。</span></li>
              <li className="flex gap-2"><span className="text-rose-500">・</span><span><strong>進学・進路サポート</strong>：大学・専門学校への進学実績、個別指導や進学コースの有無。</span></li>
              <li className="flex gap-2"><span className="text-rose-500">・</span><span><strong>学び直しのしやすさ</strong>：小中学校の内容からの学び直しに対応しているか。</span></li>
              <li className="flex gap-2"><span className="text-rose-500">・</span><span><strong>費用</strong>：通信制も就学支援金（高校無償化）の対象。実質負担を早めに把握しておく。</span></li>
              <li className="flex gap-2"><span className="text-rose-500">・</span><span><strong>出席扱いの連携</strong>：在籍校と連携できる事業者か（中学段階での出席扱いを目指す場合）。</span></li>
            </ul>
          </section>

          {/* 不登校専用の保護者リード（もしも live・在宅/無料） */}
          <FutoukouLeadCTA className="mt-8" />

          {/* 回遊 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ページ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/futoukou', title: '不登校と内申点（高校受験はできる？）' },
                { href: '/chousasho', title: '調査書とは？出欠・評定の記載' },
                { href: '/koukou-hiyou', title: '高校の費用（通信制も就学支援金の対象）' },
                { href: '/shougakukin', title: '高校無償化・就学支援金ガイド' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                  {c.title}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
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

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            ※ 学校・事業者ごとに制度・費用・サポート内容は異なります。出席扱いの認定は在籍校の校長判断です。最新情報は各校・各事業者・教育委員会にご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
