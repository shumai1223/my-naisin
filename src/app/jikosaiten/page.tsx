import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, PenLine, ListChecks, HelpCircle, AlertTriangle, ChevronRightSquare, Calculator } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

const STEPS = [
  {
    title: '試験中に解答を控えておく',
    body: '問題用紙の余白や解答用紙の下書き欄に、選んだ選択肢・書いた解答を書き写しておきます。時間に余裕がない場合は、最低限マークした選択肢番号だけでもメモしておくと後で役立ちます。',
  },
  {
    title: '公式解答が公表されるのを待つ',
    body: '多くの都道府県では、学力検査の翌日以降に教育委員会や新聞社が模範解答を公表します。公式解答が出るまでは、記憶だけで採点しても誤差が大きくなりがちです。',
  },
  {
    title: '教科ごとに答え合わせをする',
    body: '控えておいた解答と模範解答を1問ずつ照合します。マークミス（ずれてマークしていないか）がないか、記述式は部分点の可能性がある表現になっていないかも確認します。',
  },
  {
    title: '配点を掛けて合計する',
    body: '正解した問題の配点を合計し、教科ごとの得点を出します。記述式で部分点が予想される問題は、幅を持たせて「最低点」「期待点」の2パターンで見積もっておくと安心です。',
  },
  {
    title: '内申点と合わせて総合得点を確認する',
    body: '自己採点した学力検査の得点と、事前に計算しておいた内申点を、志望校の総合得点の計算方法に当てはめて確認します。当サイトの都道府県別ツールに両方の数字を入力すると、その場で計算できます。',
  },
];

const FAQS = [
  {
    question: '自己採点はなぜ大切なのですか？',
    answer:
      '公立高校入試の多くは、学力検査の得点と内申点を合わせた総合得点で合否が決まります。自己採点をすることで、合格発表を待つ前に「今回の総合得点がどのくらいになりそうか」を把握でき、私立の追加出願や進路の相談を早めに始める判断材料になります。',
  },
  {
    question: '記述式の問題はどうやって自己採点すればいいですか？',
    answer:
      '模範解答と完全に一致していれば正解として数えられますが、部分点がつく可能性がある記述式は正確な自己採点が困難です。「模範解答と一致（満点が期待できる）」「方向性は合っているが表現が違う（部分点の可能性）」「大きく外れている（0点の可能性が高い）」の3段階で幅を持たせて見積もることをおすすめします。',
  },
  {
    question: '自己採点の結果はどのくらい正確ですか？',
    answer:
      'マークシート形式の問題は比較的正確に自己採点できますが、記述式・部分点がある問題は誤差が出やすく、実際の得点と数点〜十数点程度のズレが生じることがあります。あくまで目安として捉え、断定的に合否を判断しないようにしましょう。',
  },
  {
    question: '自己採点で目標に届いていなかった場合はどうすればいいですか？',
    answer:
      'まずは記述式の採点に幅を持たせて、最低点と期待点の両方で総合得点を再確認しましょう。それでも厳しい場合は、私立の追加出願や併願校の状況を早めに確認し、担任の先生に相談することをおすすめします。',
  },
];

export const metadata: Metadata = {
  title: '高校受験の自己採点のやり方【自己採点から総合得点の目安まで】 | My Naishin',
  description:
    '高校受験・学力検査の自己採点のやり方を5ステップで解説。記述式の部分点の考え方、自己採点した得点を内申点と合わせて総合得点の目安を確認する方法まで。',
  keywords: ['自己採点 やり方', '高校受験 自己採点', '自己採点 総合得点', '学力検査 自己採点', '公立高校入試 自己採点'],
  alternates: { canonical: `${SITE_URL}/jikosaiten` },
  openGraph: {
    title: '高校受験の自己採点のやり方【自己採点から総合得点の目安まで】',
    description: '自己採点の5ステップと、自己採点後に総合得点の目安を確認する方法。',
    url: `${SITE_URL}/jikosaiten`,
    type: 'website',
  },
};

export default function JikosaitenPage() {
  const url = `${SITE_URL}/jikosaiten`;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '自己採点のやり方', url },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        name="高校受験の自己採点のやり方"
        description="試験中の解答控えから、自己採点後に総合得点の目安を確認するまでの一般的な手順"
        steps={STEPS.map((s) => ({ name: s.title, text: s.body }))}
        totalTime="P1D"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">自己採点のやり方</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
              学力検査 当日〜合格発表まで
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校受験の自己採点のやり方</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              学力検査が終わったら、合格発表を待つ前に自己採点で「今回の総合得点がどのくらいになりそうか」を確認できます。試験中の準備から、採点後に総合得点の目安を出すところまでの一般的な流れをまとめました。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                自己採点はあくまで目安です。記述式の部分点や採点基準の詳細は公表されないことが多く、実際の得点とズレが生じることがあります。断定的に合否を判断せず、参考情報として活用してください。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-lg font-bold text-slate-800">
              <ListChecks className="h-5 w-5 text-blue-500" />
              自己採点の5ステップ
            </h2>
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {i + 1}
                    </div>
                    {i < STEPS.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-blue-100" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-bold text-slate-800">{s.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 text-center shadow-sm">
            <div className="mb-3 flex items-center justify-center gap-2 text-slate-800">
              <PenLine className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold">自己採点したら、総合得点の目安を確認</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              自己採点で出した学力検査の得点と、内申点を合わせると、志望校の総合得点方式での目安がその場で分かります。目標点を入力すれば「あと何点」も表示されます。
            </p>
            <Link
              href="/total-score"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Calculator className="h-4 w-4" />
              都道府県別の総合得点を計算する
            </Link>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 flex items-start gap-1.5 text-sm font-bold text-slate-800">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    Q. {f.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/juken-toujitsu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                受験当日の持ち物・タイムライン
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/reverse" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                志望校から逆算（必要な当日点）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/tarinai-taisaku" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                内申・当日点が足りない冬の対策
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/koukou-bairitsu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                高校入試の倍率計算
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/goukaku-happyo" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                合格発表後の手続き
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
