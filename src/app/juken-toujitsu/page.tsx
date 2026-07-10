import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ClipboardCheck, Clock, AlertTriangle, HelpCircle, ChevronRightSquare, Moon } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

const MOCHIMONO = [
  { item: '受験票', note: '最重要。前日に必ずコピーも取っておくと、当日忘れても再発行の相談がしやすい' },
  { item: '筆記用具（鉛筆・シャープペン・消しゴム）', note: '学校によってボールペン不可・鉛筆指定など細かい指定がある場合あり。受験票の注意事項を確認' },
  { item: '腕時計', note: '通信機能付きスマートウォッチは不可の学校が多い。シンプルなアナログ/デジタル時計を' },
  { item: '上履き・靴袋', note: '指定の有無を必ず確認。屋外開催の体育系種目がある場合は別途必要なことも' },
  { item: '交通系ICカード・現金', note: '交通機関の遅延・振替時にも対応できるよう余裕を持って' },
  { item: '昼食・軽食・飲み物', note: '試験時間が長い場合や午後まで拘束される場合に備えて。眠くなりにくい軽めのものが無難' },
  { item: 'ハンカチ・ティッシュ・マスク', note: '体調管理・感染対策として' },
  { item: '上着・防寒具', note: '会場の空調は年によって差があるため、脱ぎ着しやすい服装で調整できるように' },
  { item: '参考書・要点まとめノート', note: '休み時間の見直し用。新しい問題集より、使い慣れた要点まとめが実用的' },
];

const TIMELINE = [
  { label: '前日の夜', body: '持ち物の最終確認・翌朝の交通手段と所要時間の確認・早めの就寝。前日に根を詰めた勉強をするより、体調を整えることを優先する' },
  { label: '起床〜出発', body: '普段より余裕を持った時間に起床し、朝食を摂る。天候・交通機関の乱れを見込んで、普段より早めに家を出る' },
  { label: '会場到着〜試験開始', body: '受付・案内に従って教室へ。開始直前は焦らず、参考書より深呼吸や軽い見直しに時間を使う受験生が多い' },
  { label: '休み時間', body: '次の科目の要点を軽く見直す・トイレを済ませる・水分補給。前の科目の出来を引きずらず切り替えることを優先する' },
  { label: '試験終了後', body: '結果は考えすぎず、翌日以降の科目・面接がある場合はそちらの準備に切り替える' },
];

const HOWTO_STEPS = TIMELINE.map((t) => ({ name: t.label, text: t.body }));

const FAQS = [
  {
    question: '受験当日の持ち物リストの正式なものはどこで確認できますか？',
    answer:
      '正式な持ち物・注意事項は、必ず受験票に同封される「受験上の注意」や志望校からの案内が最優先です。このページの持ち物リストは一般的に必要とされることが多いものをまとめた目安であり、学校ごとの指定（電卓の可否、時計の種類など）に置き換わる場合があります。',
  },
  {
    question: '当日、電車の遅延などで遅刻しそうな場合はどうすればいいですか？',
    answer:
      '分かった時点ですぐに志望校（受験票に記載の連絡先）へ電話で連絡するのが基本です。多くの学校は交通機関の遅延に対する救済措置（試験時間の繰り下げ等）を用意していますが、対応は学校ごとに異なるため、自己判断で諦めず、まず連絡することが重要です。',
  },
  {
    question: '受験票を忘れた・紛失した場合はどうなりますか？',
    answer:
      '会場に到着してから受付で申し出れば、多くの学校で仮受験票の発行など代替措置を用意しています。慌てず、まずは受付や試験監督に相談してください。事前にスマートフォンで写真を撮っておく、コピーを別に持っておくと当日焦らずに済みます。',
  },
  {
    question: '当日の朝、何を勉強すればいいですか？',
    answer:
      '新しい問題に手を出すより、これまで使ってきたノートや参考書の要点を軽く見直す程度にとどめる受験生が多いです。直前に不安な分野を詰め込もうとすると緊張が高まりやすいため、体調と気持ちを整えることを優先しましょう。',
  },
  {
    question: '緊張して眠れない・体調が心配なときはどうすればいいですか？',
    answer:
      '無理に「絶対眠らなければ」と気負うより、横になって目を閉じているだけでも体力は回復します。体調に不安がある場合は、当日の朝でも構わないので早めに志望校へ連絡し、対応（保健室での受験・追試験の可否など）を相談することをおすすめします。',
  },
];

export const metadata: Metadata = {
  title: '受験当日の持ち物・タイムライン完全チェックリスト【一般選抜対応】 | My Naishin',
  description:
    '高校受験・一般選抜の当日に必要な持ち物リスト、前日から試験終了までの一般的なタイムライン、遅刻・忘れ物などのトラブル対応をまとめました。学校ごとの正式な指示は受験票の注意事項が最優先です。',
  keywords: ['受験当日 持ち物', '受験当日 タイムライン', '高校受験 持ち物リスト', '受験票 忘れた', '受験 遅刻 対応', '受験当日 チェックリスト'],
  alternates: { canonical: `${SITE_URL}/juken-toujitsu` },
  openGraph: {
    title: '受験当日の持ち物・タイムライン完全チェックリスト【一般選抜対応】',
    description: '受験当日の持ち物・前日から終了までの流れ・トラブル対応の一般的なまとめ。',
    url: `${SITE_URL}/juken-toujitsu`,
    type: 'website',
  },
};

export default function JukenToujitsuPage() {
  const url = `${SITE_URL}/juken-toujitsu`;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '受験当日の持ち物・タイムライン', url },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        name="高校受験・当日の一般的な流れ"
        description="前日の夜から試験終了までの一般的な行動の目安"
        steps={HOWTO_STEPS}
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
            <span className="text-slate-700">受験当日の持ち物・タイムライン</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
              一般選抜（当日受験）向け
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">受験当日の持ち物・タイムライン</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校受験の当日に慌てないための、持ち物チェックリストと一般的な流れをまとめました。学校ごとの正式な指示は、受験票に同封される「受験上の注意」が最優先です。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                このページの内容は一般的な目安です。持ち物の指定（時計の種類・電卓の可否等）や当日の流れは学校ごとに異なります。必ず受験票に同封される注意事項・志望校からの案内を最優先で確認してください。
              </p>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-lg font-bold text-slate-800">
              <ClipboardCheck className="h-5 w-5 text-blue-500" />
              持ち物チェックリスト
            </h2>
            <div className="space-y-3">
              {MOCHIMONO.map((m) => (
                <div key={m.item} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-800">□ {m.item}</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{m.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-lg font-bold text-slate-800">
              <Clock className="h-5 w-5 text-blue-500" />
              前日から終了までの一般的な流れ
            </h2>
            <div className="space-y-4">
              {TIMELINE.map((t, i) => (
                <div key={t.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {i + 1}
                    </div>
                    {i < TIMELINE.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-blue-100" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-bold text-slate-800">{t.label}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-l-4 border-rose-400 pl-3 text-lg font-bold text-slate-800">
              <Moon className="h-5 w-5 text-rose-400" />
              トラブル時の考え方
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                <strong className="text-slate-800">遅刻しそうなとき</strong>：分かった時点ですぐに志望校へ電話連絡を。多くの学校は交通機関の遅延に対する救済措置を用意しています。自己判断で諦めないことが大切です。
              </p>
              <p>
                <strong className="text-slate-800">忘れ物に気づいたとき</strong>：会場の受付・試験監督にまず相談を。受験票などは仮発行等の代替措置がある学校が多くあります。
              </p>
              <p>
                <strong className="text-slate-800">体調が悪いとき</strong>：早めに志望校へ連絡し、対応（保健室受験・追試験の可否等）を相談してください。無理をして受験するより、まず連絡することを優先しましょう。
              </p>
            </div>
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
              <Link href="/juken-schedule" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                出願・受験スケジュール一覧
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/jikosaiten" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                自己採点のやり方
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/tarinai-taisaku" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                内申・当日点が足りない冬の対策
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/reverse" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                志望校から逆算（必要な当日点）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/juken-ryou" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50">
                受験料シミュレーター
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
