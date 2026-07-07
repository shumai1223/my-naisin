import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, NotebookPen, MessageCircleHeart, ListTodo, HelpCircle, AlertCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '活動報告書・自己申告書はどう書けばいいですか？',
    answer:
      '「いつ・何を・どのくらいの期間、どんな役割で取り組んだか」を具体的に書くのが基本です。「頑張りました」だけでなく、期間（例：1年生から3年間）・役職（例：部長・副部長）・成果（例：県大会出場、検定2級取得）など、数字や固有名詞を入れると先生が調査書に反映しやすくなります。',
  },
  {
    question: '先生に調査書の発行をお願いするとき、どう伝えればいいですか？',
    answer:
      '「調査書の発行についてご相談したいのですが、お時間よろしいでしょうか」のように、まず相談の時間をもらう一言から始めるとスムーズです。出願校数・私立併願の有無・希望する時期を先に整理してから伝えると、先生も準備しやすくなります。',
  },
  {
    question: '調査書の依頼は何日前までにすればいいですか？',
    answer:
      '学校によって締切や必要日数（数日〜1週間程度）が異なるため一概には言えませんが、一般的には出願校が固まる中3の11〜12月には依頼を済ませておくのが安心です。私立の併願校を含めた必要枚数を早めに学校へ伝えましょう。正確な締切は在籍校の進路指導の案内で必ず確認してください。',
  },
  {
    question: '部活動を途中でやめた場合、活動報告書はどう書けばいいですか？',
    answer:
      '在籍していた期間・取り組んだ内容は正直に書いて問題ありません。やめた理由を長々と書く必要はなく、「〇年間所属し、△△に取り組んだ」という事実ベースの記述で十分です。やめた後に取り組んだこと（委員会・検定・ボランティアなど）があれば、それも合わせて書くとバランスが良くなります。',
  },
];

const REIBUN_CATEGORIES = [
  {
    title: '部活動',
    example: '陸上競技部に3年間所属し、2年生からは副部長を務めました。〇〇大会（地区大会）に出場し、自己ベストを更新しました。',
    points: ['所属期間', '役職（部長・副部長など）', '大会名・大会規模', '具体的な成果や記録'],
  },
  {
    title: '生徒会・委員会活動',
    example: '3年生で図書委員長を務め、月1回の読書イベントの企画・運営を担当しました。',
    points: ['委員会名・役職', '活動頻度', '担当した具体的な仕事内容'],
  },
  {
    title: '検定・資格',
    example: '英語検定2級、漢字検定準2級を取得しました。',
    points: ['検定名', '級・スコア', '取得時期（複数ある場合は新しい順）'],
  },
  {
    title: 'ボランティア・地域活動',
    example: '地域の清掃活動に月1回、1年間継続して参加しました。',
    points: ['活動内容', '頻度・継続期間', '主催団体（分かれば）'],
  },
  {
    title: '欠席が多かった場合',
    example: '中1の秋に体調を崩し2週間ほど欠席しましたが、その後は皆勤で出席しています。',
    points: ['理由（病気・通院など、話せる範囲で可）', 'その後の出席状況', '正直に・簡潔に書く'],
  },
];

const MANNER_TIPS = [
  { title: '相談の時間をもらう一言から始める', text: '「調査書の発行についてご相談したいのですが、お時間よろしいでしょうか」のように、いきなり要件から入らず一言添えると丁寧です。' },
  { title: '出願校数・時期を先に整理しておく', text: '公立・私立併願の校数と、希望する発行時期を自分の中で整理してから伝えると、先生が必要枚数・スケジュールを把握しやすくなります。' },
  { title: '活動実績はメモにして渡す', text: '口頭だけでなく、部活動・検定・委員会などの実績を簡単なメモ（学校指定の様式があればそちら）にまとめて渡すと、記載漏れを防げます。' },
  { title: '締切に余裕を持って依頼する', text: '発行には数日〜1週間かかることがあります。ギリギリの依頼は先生の負担にもなるため、早めの相談を心がけましょう。' },
];

const CHECKLIST = [
  '出願する高校（公立・私立併願）の校数が決まっている',
  '各高校の調査書の締切・必要書類を募集要項で確認した',
  '部活動・委員会・検定・ボランティアなどの実績を整理した',
  '学校（担任）に調査書発行の相談・依頼をした',
  '発行にかかる日数を確認し、締切に間に合うスケジュールを立てた',
  '調査書とあわせて提出する願書・写真などの準備状況を確認した',
];

export const metadata: Metadata = {
  title: '調査書・活動報告書の書き方【例文つき】依頼マナー・期限チェックリスト | My Naishin',
  description:
    '高校受験の調査書に関わる活動報告書・自己申告書の書き方を部活動/委員会/検定/ボランティア別の例文で解説。先生への発行依頼マナー・出願前の期限チェックリストつき。2026年度入試対応。',
  keywords: ['調査書 例文', '活動報告書 書き方 例文', '自己申告書 例文', '調査書 依頼 マナー', '調査書 先生 お願い', '調査書 チェックリスト'],
  alternates: { canonical: `${SITE_URL}/chousasho/reibun` },
  openGraph: {
    title: '調査書・活動報告書の書き方【例文つき】依頼マナー・期限チェックリスト',
    description: '部活動/委員会/検定/ボランティア別の活動報告書 例文と、先生への依頼マナー・期限チェックリスト。',
    url: `${SITE_URL}/chousasho/reibun`,
    type: 'website',
  },
};

export default function ChousashoReibunPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '調査書とは', url: `${SITE_URL}/chousasho` },
          { name: '書き方例文・依頼マナー・チェックリスト', url: `${SITE_URL}/chousasho/reibun` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/chousasho" className="hover:text-blue-600">調査書とは</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">書き方例文・依頼マナー・チェックリスト</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <NotebookPen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              調査書・活動報告書の書き方【例文つき】
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              自己申告書・活動報告書の書き方例文、先生への依頼マナー、出願前の期限チェックリストをまとめました。
            </p>
          </header>

          <AnswerBox question="活動報告書はどう書けばいい？">
            <p>
              <strong>「いつ・何を・どのくらいの期間、どんな役割で」</strong>を具体的に書くのが基本です。
              数字や固有名詞（大会名・役職・検定の級など）を入れることで、先生が調査書に反映しやすくなります。
            </p>
          </AnswerBox>

          {/* 例文集 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <NotebookPen className="h-5 w-5 text-blue-600" />
              活動報告書・自己申告書の書き方例文
            </h2>
            <div className="space-y-4">
              {REIBUN_CATEGORIES.map((c) => (
                <div key={c.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h3 className="mb-2 text-sm font-bold text-blue-800">{c.title}</h3>
                  <p className="mb-2 rounded-lg bg-white p-3 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-100">
                    「{c.example}」
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.points.map((p) => (
                      <span key={p} className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              ※ 例文はあくまで書き方の参考です。実際の様式・記入項目は学校指定のものに従ってください。
            </p>
          </section>

          {/* 依頼マナー */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <MessageCircleHeart className="h-5 w-5 text-rose-500" />
              先生への依頼マナー
            </h2>
            <div className="space-y-3">
              {MANNER_TIPS.map((t) => (
                <div key={t.title} className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                  <h3 className="mb-1 text-sm font-bold text-rose-900">{t.title}</h3>
                  <p className="text-sm leading-relaxed text-rose-900/90">{t.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* チェックリスト */}
          <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ListTodo className="h-5 w-5 text-emerald-600" />
              出願前の期限チェックリスト
            </h2>
            <ul className="space-y-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-lg bg-white p-3 text-sm text-slate-700 shadow-sm ring-1 ring-emerald-100">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-emerald-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-emerald-800">
              ※ 具体的な締切日は学校・志望校により異なります。必ず在籍校の進路指導と各高校の募集要項でご確認ください。
            </p>
          </section>

          {/* 注意 */}
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertCircle className="h-4 w-4" />
              書くときの注意点
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-amber-900">
              <li>・誇張せず事実を書く（数字・期間は正確に）。</li>
              <li>・「頑張った」だけの抽象的な表現は避け、具体的な行動・成果を書く。</li>
              <li>・学校指定の様式・文字数制限がある場合はそれに従う。</li>
              <li>・不安な内容は自己判断せず、担任・進路指導の先生に相談する。</li>
            </ul>
          </section>

          {/* 回遊 */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/chousasho', title: '調査書とは？（記載内容・内申点との違い）' },
              { href: '/chousasho/kakikata', title: '調査書の発行〜出願までの流れ' },
              { href: '/mendan', title: '三者面談の準備（先生に聞くこと）' },
              { href: '/juken-schedule', title: '受験スケジュール・出願時期' },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:shadow-md">
                {c.title}
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800"><HelpCircle className="h-5 w-5 text-blue-600" />よくある質問</h2>
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
        </div>
      </div>
    </>
  );
}
