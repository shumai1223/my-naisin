import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, FileText, ChevronRightSquare, HelpCircle, ListChecks } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const STRUCTURE = [
  { label: 'きっかけ・動機', desc: 'その大学・学部に興味を持ったきっかけとなる出来事や体験を具体的に書く。抽象的な憧れだけでなく、自分の経験と結びつける。' },
  { label: '学びたいこと・関心のあるテーマ', desc: '大学で何を学びたいか、どんな研究テーマに関心があるかを、その大学・学部の特色と関連づけて書く。' },
  { label: '高校までの実績・経験との接続', desc: '部活動・探究活動・資格・課外活動など、高校までの経験がその学びとどうつながっているかを説明する。' },
  { label: '大学でどう学ぶか・将来像', desc: '入学後にどう学び、卒業後にどう活かしたいかという将来像を示す。具体性があるほど説得力が増す。' },
  { label: 'まとめ', desc: '志望動機・学びたいこと・将来像を簡潔に振り返り、入学への意欲を改めて示す。' },
];

const STEPS = [
  { name: 'テーマ（軸）を決める', text: '「なぜその大学・学部か」「何を学びたいか」という中心テーマを最初に1つに絞る。テーマが複数だと文章がぶれやすい。' },
  { name: '構成メモを作る', text: 'きっかけ・学びたいこと・実績との接続・将来像・まとめの5要素を、それぞれ1〜2行の箇条書きでメモする。' },
  { name: '下書きを書く', text: '構成メモをもとに、文字数指定に合わせて文章化する。最初から完璧を目指さず、まず最後まで書き切る。' },
  { name: '添削してもらう', text: '学校の先生や家族に読んでもらい、分かりにくい部分・説得力が弱い部分を指摘してもらう。' },
  { name: '清書する', text: '添削内容を反映し、誤字脱字・文字数制限・募集要項の指定形式を最終確認して清書する。' },
];

const FAQS = [
  {
    question: '志望理由書は何を書けばいいですか？',
    answer: '一般的には「①きっかけ・動機 → ②学びたいこと・関心のあるテーマ → ③高校までの実績・経験との接続 → ④大学でどう学ぶか・将来像 → ⑤まとめ」の5要素で構成されます。大学・学部によってテーマや文字数の指定が異なるため、必ず募集要項を確認してください。',
  },
  {
    question: '志望理由書はいつから書き始めればいいですか？',
    answer: '出願直前に書き始めると、テーマ決め・下書き・添削・清書の時間が足りなくなりがちです。高3の1学期〜夏にかけて構成メモを作り始め、余裕を持って複数回の添削を受けられるようにするのが安全です。',
  },
  {
    question: '志望理由書でよくある失敗は？',
    answer: '「大学のブランド・偏差値だけを理由にする」「抽象的な憧れだけで具体的なエピソードがない」「テーマが複数あって焦点がぼやける」「大学・学部の特色に触れていない（どの大学にも当てはまる内容になっている）」が代表的な失敗パターンです。自分の経験と、その大学・学部ならではの特色を結びつけることが重要です。',
  },
  {
    question: '文字数や形式に決まりはありますか？',
    answer: '大学・学部・入試方式によって文字数指定（例：600字、800字、1000字以内）や形式（手書き・Web入力・様式指定）が異なります。必ず志望大学の最新の募集要項を確認し、指定に従ってください。',
  },
];

export const metadata: Metadata = {
  title: '志望理由書の書き方・構成【学校推薦型・総合型選抜】 | My Naishin',
  description: '志望理由書の一般的な構成（きっかけ→学びたいこと→実績との接続→将来像→まとめ）と、テーマ決めから清書までの書き方の手順を解説。大学個別の評価基準は書かず、構成の一般論のみ。登録不要。',
  keywords: ['志望理由書 書き方', '志望理由書 構成', '志望理由書 例', '総合型選抜 志望理由書', '学校推薦型選抜 志望理由書'],
  alternates: { canonical: `${SITE_URL}/shutsugan-junbi/shibou-riyuusho` },
  openGraph: {
    title: '志望理由書の書き方・構成【学校推薦型・総合型選抜】 | My Naishin',
    description: '志望理由書の一般的な構成と、テーマ決めから清書までの書き方の手順を解説。',
    url: `${SITE_URL}/shutsugan-junbi/shibou-riyuusho`,
    type: 'article',
  },
};

export default function ShibouRiyuushoPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '出願準備チェックリスト', url: `${SITE_URL}/shutsugan-junbi` },
          { name: '志望理由書の書き方', url: `${SITE_URL}/shutsugan-junbi/shibou-riyuusho` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-shibou-riyuusho"
        name="志望理由書の書き方"
        description="テーマ決めから清書までの一般的な志望理由書の書き方の手順"
        totalTime="P2W"
        steps={STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-violet-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/shutsugan-junbi" className="hover:text-violet-600">出願準備チェックリスト</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">志望理由書の書き方</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">志望理由書の書き方・構成</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              学校推薦型・総合型選抜で使う志望理由書の<strong>一般的な構成</strong>と、
              <strong>テーマ決めから清書までの書き方の手順</strong>をまとめました。大学個別の評価基準は書かず、構成の一般論のみを解説します。
            </p>
          </header>

          {/* 構成5要素 */}
          <section className="rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ListChecks className="h-5 w-5 text-violet-600" />
              一般的な構成（5要素）
            </h2>
            <ol className="space-y-4">
              {STRUCTURE.map((s, i) => (
                <li key={s.label} className="flex gap-4 border-l-4 border-violet-200 pl-4">
                  <div className="w-8 shrink-0 pt-0.5 text-lg font-black text-violet-700">{i + 1}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{s.label}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 書き方STEP */}
          <section className="mt-8 rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <FileText className="h-5 w-5 text-violet-600" />
              書き方の手順（5STEP）
            </h2>
            <ol className="space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.name} className="flex gap-4 border-l-4 border-indigo-200 pl-4">
                  <div className="w-8 shrink-0 pt-0.5 text-lg font-black text-indigo-700">{i + 1}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{s.name}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 保護者リード */}
          <div className="mt-8">
            <ParentLeadCTA placement="suisen" />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/shutsugan-junbi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                出願準備チェックリスト（タイムライン・書類）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/suisen-nyuushi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                推薦入試の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/sougou-gata-senbatsu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                総合型選抜の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin/gyakusan" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                残りで必要な評定平均を逆算する
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-violet-600" />
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
