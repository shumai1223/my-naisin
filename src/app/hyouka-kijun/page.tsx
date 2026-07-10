import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ClipboardList, Brain, Lightbulb, HeartHandshake, HelpCircle, Calculator } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { KantenHyokaOfficial } from '@/components/KantenHyokaOfficial';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '観点別評価の3観点とは何ですか？',
    answer:
      '2017・2018年改訂の学習指導要領にもとづき、すべての教科は「①知識・技能」「②思考・判断・表現」「③主体的に学習に取り組む態度」の3つの観点で評価されます。①は基礎事項の理解と活用、②は知識を使って課題を解決し説明・記述する力、③は粘り強く取り組み自分の学習を調整しようとする姿勢を見るものです。各観点はA・B・Cの3段階で評価され、それらを総括して通知表の評定（5〜1）が決まります。',
  },
  {
    question: '3観点すべてAなら評定は必ず5になりますか？',
    answer:
      'なるとは限りません。観点別評価（A・B・C）から評定（5〜1）への換算方法に全国統一のルールはなく、各学校・各教育委員会が定めた基準で総括されます。一般には「AAAなら5、AABやABBで4」のように扱う学校が多いものの、評価の重みづけや境界は学校によって異なります。だからこそ、テスト（知識・技能／思考・判断・表現）だけでなく提出物・授業態度（主体的に取り組む態度）まで含めた総合的な対策が評定アップの近道です。',
  },
  {
    question: '「主体的に学習に取り組む態度」はどうやって評価されますか？',
    answer:
      '挙手の回数や性格のよさではなく、「粘り強く取り組もうとしているか」「自分の学習を振り返って調整しようとしているか」を、振り返りシート・ノート・提出物・授業での取り組みなどから評価します。たとえば、間違えた問題をやり直した記録や、振り返りに具体的な次の行動を書くことが評価につながります。提出物の期限内提出と中身の丁寧さが、この観点に最も直結します。',
  },
  {
    question: '実技4教科も同じ3観点で評価されますか？',
    answer:
      'はい、音楽・美術・保健体育・技術家庭などの実技4教科も同じ3観点で評価されます。実技教科は「思考・判断・表現」や「主体的に取り組む態度」で作品・実技・提出物・振り返りの比重が大きいため、技能そのものが苦手でも姿勢と提出物で評定を上げやすいのが特徴です。多くの都道府県で実技は内申点が加重されるため、観点を意識した取り組みが合否に効きます。',
  },
  {
    question: 'テストの点が良いのに評定が上がらないのはなぜですか？',
    answer:
      'テストは主に「知識・技能」と「思考・判断・表現」の一部を測るもので、評定はそこに「主体的に学習に取り組む態度」を加えた3観点の総括だからです。テストが高得点でも、提出物の遅れ・空欄、振り返りの不足で態度の観点がBやCになると、評定が4や3にとどまることがあります。3観点をバランスよく満たすことが、評定を5に近づける条件です。',
  },
  {
    question: '評定5・評定4は何点から取れますか？',
    answer:
      '「◯点以上なら評定5」という全国共通の点数ラインは存在しません。評定はテストの点数だけでなく、提出物・授業態度・振り返りを含む3観点（知識・技能／思考・判断・表現／主体的に学習に取り組む態度）を学校・教員が総括して決めるため、同じ点数でも学校や教科によって評定は変わります。目安を知りたい場合は、通っている学校の評価基準（学校だよりや保護者会での説明、担当の先生への確認）を見るのが最も確実です。テストの点数を伸ばすことに加えて提出物・授業態度を整えることが、評定を上げる再現性の高い方法です。',
  },
];

export const metadata: Metadata = {
  title: '観点別評価の仕組み｜3観点（知識・技能／思考・判断・表現／主体的に取り組む態度）を解説 | My Naishin',
  description:
    '通知表の評定（内申点の土台）がどう決まるかを、観点別評価の3観点「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」から文部科学省の一次情報にもとづき解説。各観点で何が評価されるか、A・B・Cから評定への総括、実技・授業態度が響く理由まで、評定アップにつながる見方がわかります。',
  keywords: ['観点別評価', '3観点 評価', '知識 技能 思考 判断 表現 主体的', '観点別評価 評定 関係', '主体的に学習に取り組む態度', '通知表 評価 仕組み', '学習指導要領 評価', '評定5 何点から', '評定4 何点から', '評定 何点から'],
  alternates: { canonical: `${SITE_URL}/hyouka-kijun` },
  openGraph: {
    title: '観点別評価の仕組み｜3観点と評定の関係をわかりやすく解説',
    description: '3観点（知識・技能／思考・判断・表現／主体的に取り組む態度）で何が評価されるか、評定への総括、実技・態度が響く理由を解説。',
    url: `${SITE_URL}/hyouka-kijun`,
    type: 'website',
  },
};

const VIEWPOINTS = [
  {
    icon: Brain,
    name: '① 知識・技能',
    whatGood: ['用語・公式・基礎事項を正しく理解し、説明できる', '基礎〜標準問題を確実に解ける', '計算・実技などの技能が身についている'],
    measured: '定期テストの基礎〜標準問題・小テスト・実技テスト',
  },
  {
    icon: Lightbulb,
    name: '② 思考・判断・表現',
    whatGood: ['知識を活用して課題を解決できる', '根拠を示して説明・記述できる', '資料を読み取り、自分の考えを表現できる'],
    measured: '応用・記述問題・レポート・発表・作品',
  },
  {
    icon: HeartHandshake,
    name: '③ 主体的に学習に取り組む態度',
    whatGood: ['粘り強く取り組もうとしている', '自分の学習を振り返り、調整しようとしている', '提出物を期限内に・丁寧に出している'],
    measured: '振り返りシート・ノート・提出物・授業での取り組み',
  },
];

export default function HyoukaKijunPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '観点別評価の仕組み', url: `${SITE_URL}/hyouka-kijun` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">観点別評価の仕組み</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">観点別評価の仕組み</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              通知表の評定（＝内申点の土台）は、<strong>3つの観点</strong>で評価した結果を総括して決まります。
              各観点で「何が評価されるか」を知ると、評定アップの打ち手が具体的になります。
            </p>
          </header>

          <AnswerBox question="観点別評価の3観点とは？評定とどう関係する？">
            <p>
              すべての教科は<strong>「①知識・技能」「②思考・判断・表現」「③主体的に学習に取り組む態度」</strong>の3観点で評価されます（2017・2018年改訂の学習指導要領）。
              各観点をA・B・Cで評価し、それを総括して通知表の<strong>評定（5〜1）</strong>が決まります。
              A・B・Cから評定への<strong>換算に全国統一ルールはなく</strong>、学校・教育委員会が基準を定めるため「3観点すべてA＝必ず5」とは限りません。
              テスト（①②）に加え、提出物・振り返り（③）まで満たすことが評定アップの条件です。
            </p>
          </AnswerBox>

          {/* 文科省一次情報の権威コンポーネント */}
          <div className="mt-8">
            <KantenHyokaOfficial />
          </div>

          {/* 観点別「何が評価されるか」 */}
          <section className="mt-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">観点別に「何が評価されるか」</h2>
            {VIEWPOINTS.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Icon className="h-5 w-5" /></span>
                    {v.name}
                  </h3>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
                    {v.whatGood.map((g) => (
                      <li key={g} className="flex gap-2"><span className="text-emerald-500">✓</span><span>{g}</span></li>
                    ))}
                  </ul>
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500"><strong className="text-slate-600">主に測られる場面：</strong>{v.measured}</p>
                </div>
              );
            })}
          </section>

          {/* 実技・授業態度が響く理由 → /jitsugika 送客 */}
          <section className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">実技・授業態度が「響く」理由</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              実技4教科は「思考・判断・表現」「主体的に取り組む態度」の比重が大きく、技能が苦手でも作品・提出物・振り返りで評定を上げやすい教科です。
              さらに多くの都道府県で実技は内申点が加重されるため、観点を意識した取り組みが合否に直結します。
            </p>
            <Link href="/jitsugika" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-rose-700">
              実技4教科の内申点対策を見る<ChevronRight className="h-4 w-4" />
            </Link>
          </section>

          {/* 現状把握ツール */}
          <section className="mt-8 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">3観点を意識して上げた評定が、内申点で何点になるか</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">評定を1上げると内申点・合否がどう動くか、お住まいの都道府県の方式で確認できます。</p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700">
                <Calculator className="h-4 w-4" />内申点を計算する（47都道府県）
              </Link>
              <Link href="/naishin-age-kata" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50">
                内申点の上げ方（4軸）を見る
              </Link>
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-8">
            <ParentLeadCTA
              placement="result"
              heading="3観点の対策、家庭だけで続けられるか不安なら"
              body="観点別評価は「正しいやり方を継続できるか」で差がつきます。お子さまに必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-emerald-600" />よくある質問</h2>
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

          <ToolClusterNav current="naishin" className="mt-8" />
        </div>
      </div>
    </>
  );
}
