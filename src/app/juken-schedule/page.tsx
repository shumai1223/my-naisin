import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CalendarDays, HelpCircle, Target, Sparkles, CalendarPlus } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { JukenIcsButton } from '@/components/JukenIcsButton';
import { WebPushOptIn } from '@/components/WebPushOptIn';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SITE_URL } from '@/lib/naishin-dataset';
import { JUKEN_SCHEDULE as SCHEDULE } from '@/lib/juken-schedule';

const FAQS = [
  {
    question: '高校受験は中3のいつから本格的に準備すればいいですか？',
    answer:
      '内申点は多くの地域で中3の成績が最重視されるため、4月の新学期から「提出物・授業態度・定期テスト」を意識することが実質的なスタートです。受験勉強そのものは夏休み（8月）が大きな山場で、中1・中2の総復習をここで一気に進めると、9月以降の伸びが変わります。志望校は10〜12月にかけて絞り込み、12月の三者面談で受験校を最終決定するのが一般的な流れです。',
  },
  {
    question: '三者面談はいつありますか？何を聞けばいいですか？',
    answer:
      '高校受験に関わる三者面談は、7月（1学期末）と12月（2学期末）が中心です。特に12月の面談で受験校（私立併願校・公立第一志望）を最終決定する地域が多くあります。面談では「今の評定で志望校に届くか」「あと何の評定・当日点が必要か」「併願校の組み方」を具体的に聞くと、限られた時間を有効に使えます。事前に内申点・偏差値・志望校との差を数値で把握しておきましょう。',
  },
  {
    question: '入試の日程は全国で同じですか？',
    answer:
      '同じではありません。私立高校の入試はおおむね1〜2月、公立高校の入試は2〜3月が中心ですが、具体的な日程は都道府県・学校によって異なります。推薦・前期・一般（後期）など複数の選抜方式があり、出願時期も分かれます。正確な日程は必ず志望校・都道府県教育委員会の募集要項で確認してください。',
  },
  {
    question: '内申点はいつ確定しますか？',
    answer:
      '多くの地域では中3の2学期末（12月）の評定で入試に使う内申点がほぼ確定します（中3の学年末まで見る地域もあります）。そのため、2学期の定期テストと提出物が内申点アップの最後の勝負どころです。内申が確定したあとは、当日の学力検査で取り返す戦略に切り替えましょう。',
  },
];

export const metadata: Metadata = {
  title: '高校受験の年間スケジュール｜中3の4月〜3月にやることを月別解説【2026年】| My Naishin',
  description:
    '高校受験に向けて中3が4月から3月まで月別に「いつ何をするか」を一覧で解説。内申が決まる時期、三者面談（7月・12月）、夏期講習、志望校の絞り込み、私立・公立の出願・入試の流れまで、受験の全体像がひと目で分かります。中1・中2の過ごし方も。',
  keywords: ['高校受験 スケジュール', '中3 受験 流れ', '高校受験 いつから', '受験 年間スケジュール', '内申 いつ確定', '三者面談 いつ'],
  alternates: { canonical: `${SITE_URL}/juken-schedule` },
  openGraph: {
    title: '高校受験の年間スケジュール｜中3の4月〜3月にやること【2026年】| My Naishin',
    description: '内申が決まる時期・三者面談・夏期講習・出願まで、中3の受験の流れを月別に解説。',
    url: `${SITE_URL}/juken-schedule`,
    type: 'website',
  },
};

export default function JukenSchedulePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '高校受験の年間スケジュール', url: `${SITE_URL}/juken-schedule` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">高校受験の年間スケジュール</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">高校受験の年間スケジュール（中3）</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              中3の<strong>4月から3月まで</strong>、いつ何をするかを月別にまとめました。
              内申が決まる時期・三者面談・夏期講習・志望校の絞り込み・出願の流れを、ひと目で把握できます。
            </p>
          </header>

          {/* 月別スケジュール */}
          <section className="mb-10">
            <div className="space-y-3">
              {SCHEDULE.map((m) => (
                <div key={m.month} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-sky-50 py-2 text-sky-700">
                    <span className="text-lg font-black">{m.month}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                      {m.phase}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{m.todo}</p>
                    {m.link && (
                      <Link href={m.link.href} className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                        {m.link.label}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 一般的な流れの目安です。私立はおおむね1〜2月、公立は2〜3月に入試が行われますが、具体的な日程・選抜方式は都道府県・学校で異なります。必ず募集要項で確認してください。
            </p>

            {/* 名簿の“商品”：月別の準備ToDoをカレンダーに取り込めるICS（公式日程ではなく準備リマインダー）。 */}
            <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50/50 p-5 text-center">
              <div className="text-sm font-bold text-slate-800">この準備スケジュールをカレンダーに入れておく</div>
              <p className="text-xs leading-relaxed text-slate-600">
                各月の「やること」を終日リマインダーとして、Googleカレンダー・Appleカレンダーに取り込めます（公式の入試日ではなく準備の目安です）。
              </p>
              <JukenIcsButton />
              {/* 購読（自動更新）: webcal:// でカレンダーアプリに登録すると毎年の準備ToDoが届き続ける＝Google非依存の再訪チャネル */}
              <a
                href="webcal://my-naishin.com/api/calendar"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-sky-200 bg-white px-5 py-2.5 text-sm font-bold text-sky-700 transition-colors hover:border-sky-300 hover:bg-sky-50"
              >
                <CalendarPlus className="h-4 w-4" />
                カレンダーに「購読」（自動更新）
              </a>
              <p className="text-[11px] leading-relaxed text-slate-500">
                購読がうまくいかない場合は、カレンダーの「URLで追加」に <span className="font-mono text-slate-600">https://my-naishin.com/api/calendar</span> を貼り付けてください。
              </p>
            </div>

            {/* Web Push：出願・通知表のリマインド（カレンダー購読と並ぶGoogle非依存の再訪チャネル） */}
            <WebPushOptIn className="mt-5" />
          </section>

          {/* 保護者リード */}
          <ParentLeadCTA placement="parent-lp" className="mb-10" />

          {/* 中1・中2の過ごし方 */}
          <section className="mb-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
              <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-blue-900">
                <Target className="h-4 w-4 text-blue-600" />中1の過ごし方
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                内申点が中1から対象になる地域では、1年生の成績がそのまま入試に影響します。定期テストと提出物の習慣を早く作るほど後が楽になります。お住まいの地域の対象学年を確認しましょう。
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
              <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-blue-900">
                <Target className="h-4 w-4 text-blue-600" />中2の過ごし方
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                中だるみしやすい時期。中2の内申を対象にする地域も多く、ここでの取りこぼしは中3で取り返しにくくなります。苦手教科を放置せず、偏差値で立ち位置を定点観測しておきましょう。
              </p>
            </div>
          </section>

          {/* 名簿化（受験期の保護者・生徒を保持） */}
          <div className="mb-10">
            <SaveResultCTA
              source="home"
              heading="受験スケジュールと対策情報を、無料で受け取りませんか？"
              body="提出物・三者面談・出願の時期のリマインドや、内申の上げ方・志望校選びのコツを、LINEまたはメールでお届けします。いつでも解除できます。"
            />
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-sky-600" />よくある質問
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-slate-800 marker:content-none">
                    <span className="flex items-center justify-between gap-3">
                      {f.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedToolsSection
            links={[
              { href: '/plan', title: '内申点アップの学習計画ジェネレータ', desc: '目標まであと何点・週次プランを自動作成' },
              { href: '/reverse', title: '志望校から逆算する', desc: '目標校から必要な内申点・当日点を逆算' },
              { href: '/mendan', title: '三者面談の準備チェックリスト', desc: '先生に聞くこと・面談前に確認する数値' },
              { href: '/juku-hiyou', title: '塾代シミュレーター', desc: '夏期講習・通塾の費用を先に把握' },
              { href: '/hiyou', title: 'お金・費用まとめ', desc: '教育費・学費・塾代・高校無償化を一括で確認' },
              { href: '/hogosha', title: '保護者の方へ', desc: '受験期に親ができるサポート' },
            ]}
          />
        </div>
      </div>
    </>
  );
}
