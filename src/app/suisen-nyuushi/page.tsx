import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Award, Scale, FileText, Percent, Sigma, CalendarClock, HelpCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '推薦入試に調査書は必ず必要ですか？',
    answer:
      '高校受験・大学受験とも、推薦入試では調査書（内申点・評定平均）の提出がほぼ必須です。学校推薦型選抜（指定校・公募）は「学校長の推薦」と評定平均の基準が前提で、調査書が出願の中心になります。総合型選抜（旧AO）は自己推薦で評定基準を設けない大学もありますが、それでも調査書の提出は求められるのが一般的です。つまり「推薦＝調査書（評定）で勝負する入試」と考えてよいでしょう。',
  },
  {
    question: '指定校推薦・公募推薦・総合型選抜の違いは何ですか？',
    answer:
      '指定校推薦は、大学が特定の高校に枠を与える方式で、校内選考を通れば合格率が非常に高い反面、専願（合格したら必ず入学）が原則です。公募推薦（学校推薦型）は学校長の推薦があれば誰でも出願でき、評定基準＋小論文・面接で選抜します。総合型選抜（旧AO）は学校長の推薦が不要な自己推薦で、志望理由書・面接・小論文・活動実績などを総合評価します。評定の比重は「指定校・公募＞総合型」の順に大きいのが一般的です。',
  },
  {
    question: '推薦に必要な評定平均はどれくらいですか？',
    answer:
      '高校受験の推薦は、上位校で4.0〜4.5以上、中堅校で3.3〜3.8前後、私立の併願優遇は3.0〜3.5以上が一つの目安です。大学の指定校推薦は中堅私大3.3〜3.8／MARCH・関関同立3.8〜4.3／早慶クラス4.0〜4.5が目安。いずれも学校・学部・年度で変わるため、必ず募集要項で確認してください。評定平均は計算ツールで今すぐ確認できます。',
  },
  {
    question: '推薦入試の準備はいつから始めればいいですか？',
    answer:
      '評定平均（内申）は積み上げで決まるため、準備は実質「入学した最初の学期」から始まっています。高校受験の推薦なら中1〜中3、大学の推薦なら高1の1学期から評定が算入されます。さらに志望理由書や活動実績は短期間では作れないので、早い段階で「枠」「基準」「探究・部活・資格」を意識しておくほど有利です。出願は秋（9〜12月）に集中するため、夏までに評定と書類の準備を進めましょう。',
  },
  {
    question: '推薦がだめでも一般入試は受けられますか？',
    answer:
      '受けられます（指定校推薦の専願など、合格後の辞退ができない方式を除く）。多くの公募推薦・総合型選抜は不合格でも一般入試に再挑戦できます。ただし推薦の出願・対策と一般入試の学習を両立する必要があるため、推薦に出すなら早めに評定・書類を固め、当日点（学力）の準備も並行しておくのが安全です。',
  },
];

export const metadata: Metadata = {
  title: '推薦入試とは？指定校・公募・総合型選抜の違いと評定平均・調査書の準備【2026年】 | My Naishin',
  description:
    '推薦入試（高校受験・大学受験）を一気に整理。指定校推薦・公募推薦（学校推薦型）・総合型選抜（旧AO）の違い、必要な評定平均の目安、調査書の準備、合否の計算まで。評定平均は計算ツールで即確認、調査書の中身、当日点との合算まで、推薦の全体像と次にやることがわかります。',
  keywords: ['推薦入試', '推薦入試とは', '指定校推薦 総合型 違い', '学校推薦型選抜', '公募推薦', '推薦 評定平均', '推薦 調査書', '推薦入試 いつから'],
  alternates: { canonical: `${SITE_URL}/suisen-nyuushi` },
  openGraph: {
    title: '推薦入試とは？指定校・公募・総合型選抜の違いと評定平均・調査書の準備【2026年】',
    description: '推薦入試の種類の違い・必要な評定平均・調査書の準備・合否計算までを一気に整理。次にやることがわかる統合ページ。',
    url: `${SITE_URL}/suisen-nyuushi`,
    type: 'website',
  },
};

const TYPES = [
  { name: '指定校推薦', tag: '専願・合格率高', desc: '大学が特定の高校に枠を配分。校内選考を通れば合格率は非常に高いが、合格後の辞退ができない専願が原則。', emphasis: '評定の比重：最大' },
  { name: '公募推薦（学校推薦型）', tag: '学校長の推薦', desc: '学校長の推薦があれば出願でき、評定基準＋小論文・面接で選抜。併願可の大学もある。', emphasis: '評定の比重：大' },
  { name: '総合型選抜（旧AO）', tag: '自己推薦', desc: '学校長の推薦は不要。志望理由書・面接・小論文・活動実績などを総合評価。評定不問〜4.0と幅がある。', emphasis: '評定の比重：中（書類・面接が主軸）' },
];

const STEPS = [
  {
    icon: Percent,
    title: 'STEP1　評定平均を確認する',
    body: '推薦の出願資格は評定平均で決まります。まず今の評定平均を計算し、志望校・志望大学の基準に届いているかを把握しましょう。',
    href: '/hyotei-heikin',
    cta: '評定平均を計算する',
    sub: { href: '/hyotei-heikin/suisen-kijun', label: '推薦に必要な評定平均の早見表を見る' },
  },
  {
    icon: FileText,
    title: 'STEP2　調査書を準備する',
    body: '推薦は調査書（評定＋活動の記録）が中心。何が書かれるか、いつ誰に依頼するかを把握し、部活・検定などの実績は早めに担任へ伝えておきます。',
    href: '/chousasho',
    cta: '調査書とは？を確認する',
    sub: { href: '/chousasho/kakikata', label: '調査書の書き方・発行の流れを見る' },
  },
  {
    icon: Sigma,
    title: 'STEP3　一般入試の合否も逆算しておく',
    body: '推薦がだめでも一般入試で勝負できるよう、当日点との合算（総合得点）で志望校に届くかを確認。推薦と一般の二段構えが安全です。',
    href: '/total-score',
    cta: '都道府県別の総合得点を見る',
    sub: { href: '/reverse', label: '志望校から必要な当日点を逆算する' },
  },
];

export default function SuisenNyuushiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '推薦入試とは', url: `${SITE_URL}/suisen-nyuushi` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">推薦入試とは</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
              <Award className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">推薦入試とは？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              指定校推薦・公募推薦・総合型選抜の<strong>違い</strong>、必要な<strong>評定平均</strong>、<strong>調査書</strong>の準備までを一気に整理。
              「推薦＝評定（調査書）で勝負する入試」の全体像と、いま何をすべきかがわかります。
            </p>
          </header>

          <AnswerBox question="推薦入試に調査書は必ず必要？評定平均は何点いる？">
            <p>
              推薦入試は<strong>調査書（内申点・評定平均）がほぼ必須</strong>で、「評定で勝負する入試」です。
              <strong>指定校推薦</strong>（専願・合格率高）と<strong>公募推薦／学校推薦型</strong>は学校長の推薦＋評定基準が前提、
              <strong>総合型選抜（旧AO）</strong>は自己推薦で評定不問の大学もありますが調査書の提出は求められます。
              必要な評定平均は、高校受験で上位校4.0〜4.5・中堅3.3〜3.8、大学の指定校でMARCH・関関同立3.8〜4.3が目安（学校・年度で変動）。
              まず<strong>評定平均を計算</strong>し、基準に届くかを確認しましょう。
            </p>
          </AnswerBox>

          {/* 3種類の違い */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Scale className="h-5 w-5 text-amber-600" />
              指定校推薦・公募推薦・総合型選抜の違い
            </h2>
            <div className="space-y-3">
              {TYPES.map((t) => (
                <div key={t.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{t.name}</span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">{t.tag}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{t.desc}</p>
                  <p className="mt-1 text-xs font-bold text-amber-700">{t.emphasis}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 高校受験では「単願（専願）推薦」「併願優遇」「特色化選抜」など地域独自の呼び方があります。詳細な評定基準は
              <Link href="/hyotei-heikin/suisen-kijun" className="font-bold text-amber-600 hover:underline">推薦の評定基準ページ</Link>で確認できます。
            </p>
          </section>

          {/* 準備3STEP（3ピラーの合流点＝送客の中心） */}
          <section className="mt-8 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              推薦に向けて、いまやること（3STEP）
            </h2>
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600"><Icon className="h-5 w-5" /></span>
                    {s.title}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">{s.body}</p>
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <Link href={s.href} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-amber-700 sm:w-auto">
                      {s.cta}<ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link href={s.sub.href} className="inline-flex items-center justify-center gap-1 text-xs font-bold text-amber-700 hover:underline">
                      {s.sub.label}
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>

          {/* 保護者リード（推薦＝大学進学→教育費。FP無料相談＝live・権限ズレ0） */}
          <div className="mt-8">
            <ParentLeadCTA placement="suisen" />
          </div>

          {/* 大学受験の推薦・総合型は姉妹サイトへ */}
          <section className="mt-8 overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-violet-50/60 to-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">大学の推薦・総合型選抜を詳しく知りたい方へ</h2>
            <p className="mb-5 text-sm leading-relaxed text-slate-700">
              大学進学者の半数以上が推薦・総合型で進む時代。評定平均で出願できる大学のレンジ、学費・奨学金の目安は、大学受験専門の姉妹サイトでまとめて調べられます。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
              <Link href="/sougou-gata-senbatsu" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto">
                総合型選抜とは？評定の目安・準備時期<ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/shutsugan-junbi" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-700 ring-1 ring-violet-200 transition-colors hover:bg-violet-50 sm:w-auto">
                出願準備チェックリストを見る
              </Link>
              <a href="https://my-shingaku.com/sougou-suisen" target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-50 sm:w-auto">
                大学の総合型選抜・学校推薦型選抜を見る（My Shingaku）
              </a>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-amber-600" />よくある質問</h2>
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

          <ToolClusterNav current="hyotei-heikin" className="mt-8" />
        </div>
      </div>
    </>
  );
}
