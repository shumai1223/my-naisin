import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CalendarDays, HelpCircle, Target, Sparkles } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SITE_URL } from '@/lib/naishin-dataset';

type Month = {
  month: string;
  phase: string;
  todo: string;
  /** 関連する内部リンク（任意） */
  link?: { href: string; label: string };
};

// 中3の年間スケジュール（一般的な流れ。具体的な入試日程は都道府県・年度で異なるため断定しない）。
const SCHEDULE: Month[] = [
  { month: '4月', phase: '新学期・基礎固め', todo: '中3の内申は多くの地域で最重視。1学期の最初の提出物・授業態度から評価が始まる。生活リズムと学習習慣を立て直す。', link: { href: '/blog/april-naishin-recovery-plan', label: '4月の内申リカバリープラン' } },
  { month: '5月', phase: '中間テスト', todo: '1学期中間テストで好スタートを切る。内申点・偏差値の「現在地」を計算して把握しておく。', link: { href: '/', label: '内申点を計算する' } },
  { month: '6月', phase: '志望校の情報収集', todo: '学校説明会・文化祭の日程を確認し始める。志望校の偏差値・内申の目安と自分の差を見える化。', link: { href: '/hensachi/shiboukou', label: '偏差値から行ける高校レンジを見る' } },
  { month: '7月', phase: '期末テスト・三者面談', todo: '1学期期末テスト。三者面談で先生に「今の評定・志望校との差・あと何が必要か」を具体的に確認する。', link: { href: '/mendan', label: '三者面談の準備チェックリスト' } },
  { month: '8月', phase: '夏休み（天王山）', todo: '中1・中2の総復習を一気に進める好機。夏期講習を使うなら費用とコマ数を先に把握する。', link: { href: '/blog/summer-vacation-review-preview-golden-ratio', label: '夏休みの復習・予習の黄金比' } },
  { month: '9月', phase: '2学期・実力テスト', todo: '2学期は内申に直結する重要学期。実力テスト・模試で偏差値の推移を確認し、弱点教科を特定する。', link: { href: '/hensachi', label: '5教科の偏差値を計算する' } },
  { month: '10月', phase: '志望校の絞り込み', todo: '説明会に参加し、志望校を実力相応・チャレンジ・安全圏で整理。私立併願校の検討も始める。', link: { href: '/blog/how-to-choose-high-school-2026', label: '志望校の選び方（2026年版）' } },
  { month: '11月', phase: '2学期中間〜過去問', todo: '内申が固まる時期。過去問演習を開始し、志望校の合格ラインから必要な当日点を逆算する。', link: { href: '/reverse', label: '志望校から必要な当日点を逆算する' } },
  { month: '12月', phase: '2学期末・最終面談', todo: '2学期の評定で多くの地域の内申がほぼ確定。三者面談で受験校（私立併願・公立第一志望）を最終決定する。', link: { href: '/mendan', label: '三者面談で受験校を決める準備' } },
  { month: '1月', phase: '私立出願・入試開始', todo: '私立高校の出願・入試が始まる（地域差あり）。願書・調査書など出願書類を期限内にそろえる。', link: { href: '/hiyou', label: '受験・進学にかかるお金を確認' } },
  { month: '2月', phase: '私立入試・公立出願', todo: '私立入試の本番、公立高校の出願。体調管理を最優先に、過去問の総仕上げを行う。', link: { href: '/blog/toritsu-nyushi-2026-kanzen-guide', label: '公立入試の完全ガイド' } },
  { month: '3月', phase: '公立入試・合格発表', todo: '公立高校の学力検査・合格発表（地域差あり）。最後まで当日点で内申の差は取り返せる。', link: { href: '/total-score', label: '都道府県別の総合得点の仕組み' } },
];

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
