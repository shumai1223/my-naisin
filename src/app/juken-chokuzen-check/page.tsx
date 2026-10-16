import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';
import { resolveSeason, isSeasonalContentLive } from '@/lib/seasonal';

/**
 * 冬リードマグネット（ZZ-8d）：「直前期の内申点最終確認チェックリスト」。
 *
 * 新規の一次データは一切追加しない＝既存の検証済みツール・ページ（/reverse・/[pref]/naishin・
 * /[pref]/total-score・/shutsugan-junbi・/koukou-bairitsu・/juken-schedule・/juken-toujitsu・
 * /goukaku-happyo）を、出願直前期に「やることリスト」として1本にまとめて導線化するだけの
 * 集約ページ（捏造ゼロ・アグリゲーションのみ）。
 *
 * 公開予約：resolveSeason()がwinter（11-12月）/last-minute（1月〜2/15）のときだけ公開する。
 * それ以外の季節はnotFound()＝実質的に非公開（sitemap未登録・page-registry.tsにも未登録）。
 * 季節を待たず先行公開したい場合はFORCE_LIVEをtrueにする（既定false＝旗のデフォルトoffを遵守）。
 * ⚠️ 公開解禁後（11月以降）にpage-registry.tsのSTATIC_PAGESへ本ルートを追加すること
 * （sitemap.xmlに載せるのはそのタイミングでよい・非公開中はsitemapに含めない）。
 */
const FORCE_LIVE = false;

const CHECKLIST_STEPS = [
  {
    title: '内申点をもう一度計算し直す',
    body: '通知表が最終確定した後の評定で、内申点を最新の数値に更新しておきましょう。素点の入力ミス・教科の入れ忘れがないか、この機会に再確認するのがおすすめです。',
    href: '/',
    linkLabel: '内申点計算ツールへ',
  },
  {
    title: '総合得点・当日点のシミュレーションをする',
    body: '確定した内申点をもとに、志望校の総合得点の仕組みで「あと何点で届くか」を逆算しておくと、残り期間の目標が具体的になります。',
    href: '/reverse',
    linkLabel: '逆算シミュレーターへ',
  },
  {
    title: 'オール3でも狙える併願優遇校を確認する',
    body: '内申点がオール3前後でも、併願優遇の基準を満たせば私立高校の選択肢が広がる場合があります。一次情報で確認できる範囲の基準をチェックしておきましょう。',
    href: '/naishin-oru/3',
    linkLabel: 'オール3の併願優遇校へ',
  },
  {
    title: '出願書類・調査書の記載内容を最終チェックする',
    body: '志望理由書・調査書の記入例や注意点を、提出前にもう一度確認しておくと安心です。',
    href: '/shutsugan-junbi',
    linkLabel: '出願準備ガイドへ',
  },
  {
    title: '最新の倍率発表を確認する',
    body: '出願倍率は志望校選びの最後の判断材料になります。倍率の読み方・注意点を確認しておきましょう。',
    href: '/koukou-bairitsu',
    linkLabel: '倍率の読み方へ',
  },
  {
    title: '入試当日までのスケジュール・持ち物を確認する',
    body: '出願から合格発表までの日程、当日の持ち物・タイムラインを事前に把握しておくと、直前の焦りを減らせます。',
    href: '/juken-schedule',
    linkLabel: '入試スケジュールへ',
  },
  {
    title: '合格発表後の流れを予習しておく',
    body: '結果がどうであれ、合格発表後にやること（入学手続き・私立辞退の手続き等）を事前に知っておくと落ち着いて対応できます。',
    href: '/goukaku-happyo',
    linkLabel: '合格発表後の手続きへ',
  },
];

const FAQS = [
  {
    question: 'このチェックリストはいつ使えばいいですか？',
    answer:
      '出願直前〜入試本番までの時期（11月頃の冬期講習検討期から、1〜2月の出願・当日対応期まで）に、やり残しがないかの最終確認として使うことを想定しています。',
  },
  {
    question: '新しい採点基準や合格ボーダーの情報は載っていますか？',
    answer:
      '載せていません。このページは新しい一次情報を提供するものではなく、当サイトの各ツール・解説ページ（内申点計算・総合得点シミュレーション・出願準備ガイド等）を、直前期にやるべき順番でまとめた案内です。',
  },
  {
    question: '全部のステップを順番通りにやらないといけませんか？',
    answer:
      'いいえ、目安の順番です。すでに確認済みのステップは飛ばして構いません。ご自身の状況に合わせて、必要なステップだけ確認してください。',
  },
];

export const metadata: Metadata = {
  title: '入試直前チェックリスト【内申点・出願・当日の最終確認】 | My Naishin',
  description:
    '出願直前〜入試本番までにやることを7ステップでまとめたチェックリスト。内申点の再計算・総合得点シミュレーション・出願書類確認・倍率発表・当日スケジュール・合格発表後の流れまで、既存の検証済みツールへ導線化。',
  keywords: ['入試直前 チェックリスト', '出願前 確認事項', '内申点 最終確認', '受験直前 やること'],
  alternates: { canonical: `${SITE_URL}/juken-chokuzen-check` },
};

export default function JukenChokuzenCheckPage() {
  const season = resolveSeason();
  if (!FORCE_LIVE && !isSeasonalContentLive(season)) {
    notFound();
  }

  const url = `${SITE_URL}/juken-chokuzen-check`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '入試直前チェックリスト', url },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        name="入試直前の最終確認チェックリスト"
        description="出願直前〜入試本番までにやることを7ステップでまとめた確認手順"
        steps={CHECKLIST_STEPS.map((s) => ({ name: s.title, text: s.body }))}
        totalTime="P30D"
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">入試直前チェックリスト</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">入試直前チェックリスト</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              出願直前〜入試本番までにやることを、7つのステップでまとめました。
              すでに確認済みのステップは飛ばして、必要なところだけご活用ください。
            </p>
          </header>

          <section className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-base leading-[1.8] text-amber-900">
              このページは新しい採点基準・合格ボーダー等の情報を追加で提供するものではありません。当サイトの既存ツール・解説ページを、直前期にやるべき順番でまとめた案内です。学校からの正式な指示が最優先です。
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">直前チェックリスト（7ステップ）</h2>
            <ol className="space-y-5">
              {CHECKLIST_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="w-6 shrink-0 text-base font-bold tabular-nums text-brand-700">{i + 1}.</span>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-base leading-[1.8] text-slate-900">{s.body}</p>
                    <Link
                      href={s.href}
                      className="inline-flex min-h-[44px] items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      {s.linkLabel}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
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
                <Link href="/jikosaiten" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">自己採点のやり方</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/heigan-yuugu" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">併願優遇の仕組み</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/chousasho" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">調査書ガイド</span>
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
