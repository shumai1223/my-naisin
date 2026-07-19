import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, HandHeart, AlertCircle, ChevronRightSquare, ExternalLink } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * 併願優遇の内申基準（9教科合計）を「学校の公式募集要項PDF」で個別に確認できた学校のみ掲載。
 * 民間塾の集計サイト（相場観・非公式集計）は根拠として採用しない（捏造ゼロ）。
 * 基準は年度ごとに変わるため、都度「確認日」と「対象年度」を明記し、必ず学校公式サイトへのリンクを添える。
 */
const VERIFIED_SCHOOLS = [
  {
    name: '科学技術学園高等学校',
    course: '普通科 総合コース',
    gender: '男子校',
    fiscalYear: '2026年度（令和8年度）',
    criteria: '9教科合計 22以上',
    note: '欠席日数10日以内・10月以降の学校説明会等での個別相談が必要。実績や検定で最大+2加点あり。',
    sourceUrl: 'https://hs.kagiko.ed.jp/examinfo/info/',
    sourceLabel: '科学技術学園高等学校 公式サイト「入試情報」',
    verifiedOn: '2026-07-19',
  },
  {
    name: '日本体育大学桜華高等学校',
    course: '総合進学コース・総合スポーツコース',
    gender: '女子校',
    fiscalYear: '2026年度（令和8年度）',
    criteria: '9教科合計 22以上（または3科8以上・5科12以上のいずれか）',
    note: '評定に「1」がないこと。基準を満たさない場合は学科試験の点数で合否が決まる「一般フリー受験」も選べる。',
    sourceUrl: 'https://ohka.ed.jp/senior/guideline-sh',
    sourceLabel: '日本体育大学桜華高等学校 公式サイト「高校入試関係」',
    verifiedOn: '2026-07-19',
  },
] as const;

const FAQS = [
  {
    question: '「オール3」は東京都の私立高校の併願優遇基準を満たしますか？',
    answer:
      '9教科すべてが評定3の場合、素内申（9教科の単純合計）は27点になります。このページで公式に確認できた2校の併願優遇基準（いずれも9教科22以上）は27点を下回るため、内申点の面では基準を満たします。ただし欠席日数・個別相談への参加など内申点以外の条件もあるため、実際に出願する際は必ず学校説明会・個別相談で確認してください。',
  },
  {
    question: 'このページに載っている学校がすべてですか？',
    answer:
      'いいえ。東京都には併願優遇制度がある私立高校が数多くありますが、内申基準を学校の公式サイト・公式PDFで個別に確認できた学校のみを掲載しています（2026年7月時点で2校）。基準を公式サイトで明示していない学校も多く、そうした学校は「基準非公表」として掲載を見送っています。掲載校以外にも、オール3程度で併願優遇が使える学校は他にも存在する可能性があります。',
  },
  {
    question: 'なぜ塾サイトの「内申基準早見表」を参考にしないのですか？',
    answer:
      '多くの内申基準早見表は、学習塾が学校との事前相談（入試相談）の実績から集計した「相談ラインの目安」であり、学校が公式に発表した基準そのものではない場合が大半です。当サイトは捏造ゼロを方針としており、学校の公式サイト・公式募集要項で直接確認できた基準のみを一次情報として掲載しています。',
  },
  {
    question: '内申点（素内申）はどう計算しますか？',
    answer:
      '併願優遇の基準で使われる内申点は、多くの場合「9教科の評定をそのまま合計した素内申」（45点満点）です。都立高校の入試で使う換算内申（実技教科を1.3倍する等の計算式）とは別の数字なので注意してください。素内申は下の内申点計算ツールですぐに確認できます。',
  },
];

export const metadata: Metadata = {
  title: 'オール3で行ける私立高校【東京都】併願優遇の内申基準を公式サイトで確認 | My Naishin',
  description:
    '東京都の私立高校の併願優遇（内申基準9教科22以上等）を、学校の公式募集要項PDFで個別に確認。オール3（素内申27点）で基準を満たす学校を、根拠となる公式ソースつきで紹介します。',
  keywords: ['オール3 私立高校 東京', '併願優遇 内申基準 東京都', 'オール3 併願優遇', '内申27 私立高校'],
  alternates: { canonical: `${SITE_URL}/heigan-yuugu/tokyo` },
  openGraph: {
    title: 'オール3で行ける私立高校【東京都】併願優遇の内申基準を公式サイトで確認',
    description: '東京都の私立高校の併願優遇の内申基準を、学校公式の募集要項PDFで個別確認して紹介。',
    url: `${SITE_URL}/heigan-yuugu/tokyo`,
    type: 'article',
  },
};

export default function HeiganYuuguTokyoPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '併願優遇・併願校の制度解説', url: `${SITE_URL}/heigan-yuugu` },
          { name: 'オール3で行ける私立高校（東京都）', url: `${SITE_URL}/heigan-yuugu/tokyo` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <DatasetSchema
        name="東京都私立高校 併願優遇 内申基準（公式確認済み一覧）"
        description="東京都の私立高校の併願優遇制度について、学校の公式サイト・公式募集要項PDFで内申基準（9教科合計等）を個別に確認できた学校の一覧"
        url={`${SITE_URL}/heigan-yuugu/tokyo`}
        variableMeasured={['9教科内申基準', '3科内申基準', '5科内申基準', '性別（共学/男子校/女子校）']}
        dateModified="2026-07-19"
        keywords={['併願優遇', '内申基準', '東京都', '私立高校']}
        citation="各校公式サイト・公式募集要項PDF（ページ内に個別リンクあり）"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-teal-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/heigan-yuugu" className="hover:text-teal-600">
              併願優遇・併願校の制度解説
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">オール3で行ける私立高校（東京都）</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-xl">
              <HandHeart className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              オール3で行ける私立高校（東京都）
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              東京都の私立高校の併願優遇制度について、内申基準（9教科合計）を学校の公式サイト・公式募集要項PDFで
              個別に確認できた学校のみを、根拠となる出典つきで紹介します。
            </p>
          </header>

          <AnswerBox question="オール3（素内申27点）で併願優遇が使える学校はありますか？">
            <p>
              はい。2026年7月時点で、内申基準を学校の公式サイトで確認できた東京都の私立高校のうち、
              <strong>科学技術学園高等学校</strong>と<strong>日本体育大学桜華高等学校</strong>は
              いずれも「9教科合計22以上」を併願優遇の基準としており、オール3（9教科合計27点）はこれを上回ります。
              内申点以外にも欠席日数や個別相談参加などの条件があるため、詳しくは下の一覧と各校公式サイトで確認してください。
            </p>
          </AnswerBox>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              公式に内申基準を確認できた学校（2026年7月時点）
            </h2>
            <div className="space-y-4">
              {VERIFIED_SCHOOLS.map((s) => (
                <div key={s.name} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-800">{s.name}</h3>
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                      {s.gender}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{s.course}｜{s.fiscalYear}入試</p>
                  <p className="mt-2 text-lg font-black text-teal-700">{s.criteria}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.note}</p>
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    出典: {s.sourceLabel}
                  </a>
                  <p className="mt-1 text-[11px] text-slate-400">確認日: {s.verifiedOn}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertCircle className="h-4 w-4" />
              このページの限界（正直に書きます）
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-amber-900">
              <li>
                ・掲載しているのは、学校の公式サイト・公式PDFで内申基準を直接確認できた学校<strong>のみ</strong>です。
                現時点では男子校・女子校が1校ずつで、共学校はまだ確認できていません。
              </li>
              <li>・基準は年度ごとに変わります。次年度以降に出願する場合は、必ず最新の公式情報を確認してください。</li>
              <li>・内申基準を満たしても、欠席日数や個別相談などの条件を満たさなければ併願優遇は使えません。</li>
              <li>・上記以外にも、オール3程度で併願優遇が使える学校は他にも存在する可能性が高いです。新たに公式ソースを確認できた学校は今後追加していきます。</li>
            </ul>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">まず自分の内申点（素内申）を確認する</h2>
            <p className="mb-4 text-xs text-slate-500">
              9教科の評定を入れるだけで、素内申（9教科合計）と評定平均をすぐに計算できます。
            </p>
            <Link
              href="/hyotei-heikin"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-teal-700"
            >
              素内申・評定平均を計算する
              <ChevronRightSquare className="h-4 w-4" />
            </Link>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">あわせて確認</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/heigan-yuugu" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:shadow-md">
                併願優遇とは？（制度の基本を解説）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/naishin-oru/3" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:shadow-md">
                オール3の内申点は何点？（47都道府県）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/koukou-hiyou" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:shadow-md">
                私立高校の費用シミュレーター
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/tokyo/total-score" className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:shadow-md">
                都立高校 総合得点計算（1020点満点）
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
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
        </div>
      </div>
    </>
  );
}
