import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CalendarClock, ClipboardList, ChevronRightSquare, HelpCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

const TIMELINE = [
  {
    period: '高1',
    title: '評定平均の土台づくり',
    desc: '学校推薦型・総合型で使う評定平均は高1の1学期から算入されます。定期テスト・提出物・授業態度を意識し、部活動や委員会、検定などの活動記録を残す習慣をつけておくと、後の志望理由書・活動報告書の材料になります。',
  },
  {
    period: '高2',
    title: '探究活動・課外活動を本格化',
    desc: '興味のある分野の探究活動やオープンキャンパス参加を進め、志望大学・学部の絞り込みを始める時期。評定平均も引き続き積み上がっていくため、苦手教科を残さない意識が重要です。',
  },
  {
    period: '高3・1学期',
    title: '評定平均が概ね確定・書類の準備開始',
    desc: '学校推薦型で使う「学習成績の状況」（高1〜高3・1学期の5学期分）がこの時点でほぼ確定します。志望理由書の下書き、活動報告書の整理を始める時期です。',
  },
  {
    period: '高3・夏',
    title: '出願書類の作成・小論文/面接対策',
    desc: 'オープンキャンパスへの参加、志望理由書の完成、小論文・面接対策を本格化させる時期。学校の担任・進路指導の先生への相談もこの時期に集中します。',
  },
  {
    period: '高3・9月〜',
    title: '総合型選抜の出願開始（大学による）',
    desc: '総合型選抜（旧AO）の出願は9月以降に始まる大学が多くあります。正確な日程は志望大学の募集要項で必ず確認してください。',
  },
  {
    period: '高3・11月〜',
    title: '学校推薦型選抜の出願開始（大学による）',
    desc: '指定校推薦・公募推薦などの学校推薦型選抜は11月以降が中心。学校長の推薦が必要な方式では、校内選考のスケジュールにも注意が必要です。',
  },
];

const DOCUMENT_CHECKLIST = [
  { item: '調査書', note: '学校に発行を依頼する書類。発行までに数週間かかることがあるため早めに申請を。' },
  { item: '志望理由書', note: 'なぜその大学・学部を志望するかをまとめる書類。下書き→添削→清書に時間がかかる。' },
  { item: '活動報告書・活動実績証明書', note: '部活動・生徒会・探究活動・資格などの実績をまとめる。高1からの記録が材料になる。' },
  { item: '推薦書', note: '学校推薦型では学校長の推薦書が必要。校内選考の締切を確認する。' },
  { item: '小論文・自己推薦書', note: '大学・学部によって形式が異なる。事前提出型と当日実施型がある。' },
  { item: '面接シート・エントリーシート', note: '面接前に提出する事前アンケート形式の書類がある大学も。' },
  { item: '資格・検定の証明書コピー', note: '英検・TOEIC等の外部試験結果を評価に使う大学がある。' },
  { item: '健康診断書', note: '出願書類の一部として求められることがある。学校の健康診断の結果を確認しておく。' },
];

const FAQS = [
  {
    question: '出願準備はいつから始めればいいですか？',
    answer: '評定平均は高1の1学期から算入されるため、実質的な準備は高校入学時から始まっています。書類の準備（志望理由書・活動報告書など）は高3の1学期〜夏に本格化させるのが一般的ですが、材料になる活動記録は早い学年からの積み上げが有利です。',
  },
  {
    question: '調査書はいつ学校に依頼すればいいですか？',
    answer: '調査書は学校側での発行に数週間かかることがあるため、出願の1〜2ヶ月前には余裕をもって担任・進路指導の先生に依頼するのが安全です。学校ごとに依頼の流れが決まっている場合が多いので、早めに確認してください。',
  },
  {
    question: '志望理由書は何を書けばいいですか？',
    answer: '一般的には「なぜその大学・学部を志望するか」「高校までにどんな活動・学びをしてきたか」「入学後に何を学び、将来どう活かしたいか」の3点を軸に構成されます。大学ごとにテーマや文字数の指定が異なるため、必ず募集要項を確認してください。',
  },
  {
    question: '推薦・総合型に落ちたら一般入試は受けられますか？',
    answer: '多くの公募推薦・総合型選抜は不合格でも一般入試に再挑戦できます（指定校推薦の専願など、合格後の辞退ができない方式を除く）。推薦の対策と並行して、一般入試（当日点）の準備も進めておくと安心です。',
  },
];

export const metadata: Metadata = {
  title: '学校推薦型・総合型選抜の出願準備チェックリスト【一般的な準備タイムライン】 | My Naishin',
  description: '学校推薦型選抜・総合型選抜の出願準備を、高1からの一般的な準備タイムラインと必要書類チェックリストでまとめて確認。大学個別の基準は書かず、制度の一般論のみを解説。登録不要。',
  keywords: ['出願準備 チェックリスト', '学校推薦型選抜 準備', '総合型選抜 準備 タイムライン', '推薦入試 必要書類', '志望理由書 いつから'],
  alternates: { canonical: `${SITE_URL}/shutsugan-junbi` },
  openGraph: {
    title: '学校推薦型・総合型選抜の出願準備チェックリスト | My Naishin',
    description: '出願までの一般的な準備タイムラインと必要書類チェックリスト。大学個別の基準は書かず制度の一般論のみを解説。',
    url: `${SITE_URL}/shutsugan-junbi`,
    type: 'article',
  },
};

export default function ShutsuganJunbiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '出願準備チェックリスト', url: `${SITE_URL}/shutsugan-junbi` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-shutsugan-junbi"
        name="学校推薦型・総合型選抜の出願準備タイムライン"
        description="高1から出願までの一般的な準備の流れ（大学個別の基準は含まない）"
        totalTime="P2Y6M"
        steps={TIMELINE.map((t) => ({ name: `${t.period}：${t.title}`, text: t.desc }))}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-violet-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">出願準備チェックリスト</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">学校推薦型・総合型選抜の出願準備チェックリスト</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              出願までにやることを、<strong>一般的な準備タイムライン</strong>と<strong>必要書類チェックリスト</strong>でまとめました。
              大学・学部ごとの個別基準は書かず、制度の一般論のみを解説します。必ず志望大学の最新の募集要項で確認してください。
            </p>
          </header>

          {/* タイムライン */}
          <section className="rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <CalendarClock className="h-5 w-5 text-violet-600" />
              準備タイムライン（一般的な目安）
            </h2>
            <ol className="space-y-4">
              {TIMELINE.map((t) => (
                <li key={t.period} className="flex gap-4 border-l-4 border-violet-200 pl-4">
                  <div className="w-20 shrink-0 pt-0.5 text-sm font-black text-violet-700">{t.period}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{t.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 書類チェックリスト */}
          <section className="mt-8 rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ClipboardList className="h-5 w-5 text-violet-600" />
              必要書類チェックリスト（一般的な一覧）
            </h2>
            <ul className="space-y-3">
              {DOCUMENT_CHECKLIST.map((d) => (
                <li key={d.item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <input type="checkbox" aria-label={`${d.item}の準備チェック`} className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-violet-600" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{d.item}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{d.note}</div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              ※ 必要書類は大学・学部・入試方式によって異なります。上記は一般的に求められることが多い書類の一覧であり、
              志望大学の募集要項に記載の必要書類を必ず確認してください。
            </p>
          </section>

          {/* 保護者リード */}
          <div className="mt-8">
            <ParentLeadCTA placement="suisen" />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/suisen-nyuushi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                推薦入試の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/sougou-gata-senbatsu" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                総合型選抜の仕組み
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin/suisen-kijun" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50/50">
                推薦・併願優遇の評定平均ガイド
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
