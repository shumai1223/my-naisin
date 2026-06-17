import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Palette, Music, Dumbbell, Hammer, HelpCircle, Calculator } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '実技4教科の内申点はなぜ重要なのですか？',
    answer:
      '実技4教科（音楽・美術・保健体育・技術家庭）は、多くの都道府県で内申点を計算するときに2倍などに加重されるためです。たとえば実技を2倍する地域では、実技で評定3を続けると、主要5教科を1つ上げるよりも合否への影響が大きくなることがあります。加重の有無・倍率は地域で異なるため、お住まいの都道府県の方式を確認することが大切です。',
  },
  {
    question: '実技教科の評定はどう決まりますか？',
    answer:
      '実技教科は定期テスト（知識・技能）に加えて、作品・実技の出来、提出物、授業への取り組み（主体的に学習に取り組む態度）の比重が大きいのが特徴です。技能そのものが苦手でも、丁寧に課題に取り組み、提出物を期限内に出し、振り返りを具体的に書くことで評定を上げやすい教科です。',
  },
  {
    question: '実技が苦手でも評定5は取れますか？',
    answer:
      '取れる可能性は十分あります。実技教科は「うまさ」だけでなく「取り組む姿勢」「課題の完成度」「提出物」「振り返り」が評価されます。たとえば美術なら下書き・工夫した点のメモ、保健体育なら筆記とレポート、技術家庭なら作品の丁寧さで挽回できます。苦手意識で手を抜くのが一番もったいない失点です。',
  },
  {
    question: '自分の地域は実技が何倍ですか？',
    answer:
      '都道府県によって、実技4教科を2倍にする地域、主要5教科と同じ扱いの地域などさまざまです。当サイトの都道府県別ページで、お住まいの地域の換算方式（実技の倍率を含む）を確認し、内申点計算ツールで実技を変えたときの内申点の変化を試せます。',
  },
];

export const metadata: Metadata = {
  title: '実技4教科の内申点対策｜音楽・美術・体育・技術家庭で評定を上げる方法 | My Naishin',
  description:
    '実技4教科（音楽・美術・保健体育・技術家庭）の内申点対策。多くの都道府県で実技は2倍などに加重されるため、合否への影響が大きい教科です。技能が苦手でも「取り組む姿勢・作品の完成度・提出物・振り返り」で評定を上げる方法と、地域別の倍率の確認方法を解説します。',
  keywords: ['実技教科 内申点', '実技4教科 内申', '副教科 内申点', '実技 評定 上げる', '音楽 美術 体育 技術家庭 内申', '副教科 倍率'],
  alternates: { canonical: `${SITE_URL}/jitsugika` },
  openGraph: {
    title: '実技4教科の内申点対策｜評定を上げる方法と地域別の倍率',
    description: '実技4教科は2倍加重の地域も多く合否影響大。技能が苦手でも評定を上げる方法と倍率の確認方法を解説。',
    url: `${SITE_URL}/jitsugika`,
    type: 'website',
  },
};

const SUBJECTS = [
  { icon: Music, name: '音楽', tips: 'リコーダー/歌のテストは練習量が出る。鑑賞レポート・ワークの提出を完璧に。' },
  { icon: Palette, name: '美術', tips: '完成度より「工夫した点」を言語化。下書き・制作メモ・期限内提出で姿勢を見せる。' },
  { icon: Dumbbell, name: '保健体育', tips: '実技が苦手でも保健の筆記で得点。準備・片付け・声出しなど取り組む姿勢が効く。' },
  { icon: Hammer, name: '技術・家庭', tips: '作品の丁寧さ・レポート・安全への配慮。提出物の質で評定が動きやすい。' },
];

export default function JitsugikaPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '実技4教科の内申点対策', url: `${SITE_URL}/jitsugika` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">実技4教科の内申点対策</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl">
              <Palette className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">実技4教科の内申点対策</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              音楽・美術・保健体育・技術家庭は、多くの地域で内申点が<strong>2倍などに加重</strong>される
              「合否への影響が大きい」教科です。技能が苦手でも評定を上げる方法を整理しました。
            </p>
          </header>

          <AnswerBox question="実技4教科はなぜ内申点で重要？">
            <p>
              実技4教科（音楽・美術・保健体育・技術家庭）は、<strong>多くの都道府県で内申点の計算時に2倍などに加重</strong>されます。
              加重がある地域では、実技で評定3を続けると主要5教科を1つ上げるより合否への影響が大きいことも。
              実技は「うまさ」だけでなく<strong>作品の完成度・提出物・取り組む姿勢</strong>が評価されるため、苦手でも上げやすい教科です。
              倍率は地域で異なるので、お住まいの都道府県の方式を必ず確認しましょう。
            </p>
          </AnswerBox>

          {/* 教科別 */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {SUBJECTS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon className="h-5 w-5" /></span>
                    {s.name}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{s.tips}</p>
                </div>
              );
            })}
          </section>

          {/* 地域別倍率の確認（検証済みデータへ誘導・捏造しない） */}
          <section className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">自分の地域は実技が何倍？を確認する</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              実技の倍率は都道府県で異なります。お住まいの地域の換算方式を確認し、実技の評定を変えると内申点がどう動くかを計算してみましょう。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-rose-700">
                <Calculator className="h-4 w-4" />内申点を計算する（実技の倍率対応）
              </Link>
              <Link href="/prefectures" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50">
                都道府県別の換算方式を見る
              </Link>
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-8">
            <ParentLeadCTA
              placement="result"
              heading="実技を含めた内申アップを、効率よく進めるなら"
              body="実技4教科は提出物・作品・姿勢で評定が動きます。お子さまの弱点に合わせた学習の進め方を、オンライン個別指導の無料体験で確認できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          {/* 深掘り */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">さらに詳しく</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/blog/practical-subjects-all-5-strategy-2026-update', title: '実技4教科でオール5を狙う戦略【2026年】' },
                { href: '/blog/fukukyoka-bairitsu-by-prefecture', title: '都道府県別の副教科倍率まとめ' },
                { href: '/naishin-age-kata', title: '内申点の上げ方（4軸）' },
                { href: '/hyotei-heikin', title: '評定平均を計算する' },
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

          <ToolClusterNav current="naishin" className="mt-8" />
        </div>
      </div>
    </>
  );
}
