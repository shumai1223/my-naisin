import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">自己採点のやり方</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">高校受験の自己採点のやり方</h1>
            <p className="mt-2 text-sm text-slate-600">学力検査 当日〜合格発表まで</p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              学力検査が終わったら、合格発表を待つ前に自己採点で「今回の総合得点がどのくらいになりそうか」を確認できます。試験中の準備から、採点後に総合得点の目安を出すところまでの一般的な流れをまとめました。
            </p>
          </header>

          <section className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-base leading-[1.8] text-amber-900">
              自己採点はあくまで目安です。記述式の部分点や採点基準の詳細は公表されないことが多く、実際の得点とズレが生じることがあります。断定的に合否を判断せず、参考情報として活用してください。
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">自己採点の5ステップ</h2>
            <ol className="space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="w-6 shrink-0 text-base font-bold tabular-nums text-brand-700">{i + 1}.</span>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-base leading-[1.8] text-slate-900">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">自己採点したら、総合得点の目安を確認</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              自己採点で出した学力検査の得点と、内申点を合わせると、志望校の総合得点方式での目安がその場で分かります。目標点を入力すれば「あと何点」も表示されます。
            </p>
            <Link
              href="/total-score"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
            >
              都道府県別の総合得点を計算する
            </Link>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              内申点と当日点、どちらが重い？ 県によって違う「配点比率」
            </h2>
            <p className="mb-3 text-base leading-[1.8] text-slate-900">
              自己採点した当日点が、総合得点にどれだけ効いてくるかは都道府県・学校によって大きく異なります。
              一部の都道府県は比率が制度として明確に決まっています。
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
              <li>
                <strong>東京都</strong>: 内申点70：学力検査30の比率が制度として定められています（ESAT-Jスピーキングテストの得点を含む）。
              </li>
              <li>
                <strong>大阪府</strong>: 「タイプⅠ〜Ⅴ」の5段階があり、学校・学科ごとに内申点の比重が30%〜70%の範囲で公式に決まっています。
              </li>
              <li>
                <strong>埼玉県</strong>: 学年ごとの内申点の重み（中1:中2:中3）は1:1:2が標準ですが、学校によって1:1:3など異なるモデルを採用する場合があります。
              </li>
            </ul>
            <p className="text-base leading-[1.8] text-slate-900">
              上記以外の多くの都道府県では、内申点と当日点の比率は志望校・学科ごとの募集要項で個別に定められており、
              全県共通の公式比率は公表されていません。当サイトの
              <Link href="/total-score" className="mx-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                都道府県別の総合得点計算
              </Link>
              では、比率が公式に確認できない県について目安の初期値（多くの県で内申4:当日6）を設定していますが、
              これはあくまで調整可能な目安です。<strong>実際の比率は必ず志望校の募集要項でご確認ください</strong>。
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">
                    Q. {f.question}
                  </h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-10">
            <ParentLeadCTA placement="home" />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">あわせて確認</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href="/juken-toujitsu" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">受験当日の持ち物・タイムライン</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/reverse" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">志望校から逆算（必要な当日点）</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/tarinai-taisaku" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">内申・当日点が足りない冬の対策</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/koukou-bairitsu" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">高校入試の倍率計算</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/goukaku-happyo" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">合格発表後の手続き</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
