import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, BookMarked, Globe } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import {
  REPORT_2026_ROWS as ROWS,
  REPORT_2026_NO_SKEW_COUNT as NO_SKEW_COUNT,
  REPORT_2026_GRADE3_ONLY as GRADE3_ONLY,
} from '@/lib/report-2026-data';

/**
 * 内申点白書2026 英語版（X-20 Phase1）。海外の比較教育学研究者・国際教育系メディア向けに、
 * エグゼクティブサマリーと構造的発見トップ5のみを翻訳した要約版。47都道府県全件表は
 * 日本語版(/report/2026)とAPI(/api/naishin)を参照する設計とし、翻訳の二重管理・数値ドリフトを
 * 避けるため、動的な数値(TOP_SKEW/GRADE3_ONLY/NO_SKEW_COUNT等)は日本語版と同じ
 * src/lib/report-2026-data.tsを共有する。新規の一次データ・推測値は一切追加しない（捏造ゼロ原則）。
 */
const MAX_SCORE_SORTED = [...ROWS].sort((a, b) => a.maxScore - b.maxScore);
const MIN_MAX_SCORE = MAX_SCORE_SORTED[0];
const MAX_MAX_SCORE = MAX_SCORE_SORTED[MAX_SCORE_SORTED.length - 1];
const TOP_SKEW = ROWS[0];

const FAQS = [
  {
    question: 'Where does the data in this whitepaper come from?',
    answer:
      "All figures are sourced from the official public high school admissions guidelines published by each of Japan's 47 prefectural boards of education, aggregated by My Naishin's calculation engine. No estimates or assumptions are introduced.",
  },
  {
    question: 'Can I cite this in an article or academic paper?',
    answer:
      'Yes. Please attribute it as "Source: My Naishin (https://my-naishin.com/report/2026)". We ask that this data not be used to assert school-specific admissions cutoffs, since this site does not collect or publish that information.',
  },
  {
    question: 'How often is this data updated?',
    answer:
      "Prefecture-level data is reviewed and updated primarily each spring (the start of Japan's academic year). See the Japanese-language edition for each prefecture's last-verified date.",
  },
];

export const metadata: Metadata = {
  title: "Naishin Whitepaper 2026: Japan's 47-Prefecture School Grading System Compared | My Naishin",
  description:
    "An English summary of My Naishin's annual whitepaper comparing how Japan's 47 prefectures each calculate 'naishin-ten' (internal school assessment scores) used in public high school admissions. Free to cite with attribution.",
  keywords: ['Japan high school admissions', 'naishin-ten', 'Japanese education system', 'prefecture comparison'],
  alternates: {
    canonical: `${SITE_URL}/report/2026/en`,
    languages: {
      ja: `${SITE_URL}/report/2026`,
      en: `${SITE_URL}/report/2026/en`,
    },
  },
  openGraph: {
    title: "Naishin Whitepaper 2026 | My Naishin",
    description: "English summary: how Japan's 47 prefectures each calculate internal school assessment scores for high school admissions.",
    url: `${SITE_URL}/report/2026/en`,
    type: 'article',
  },
};

export default function Report2026EnglishPage() {
  const url = `${SITE_URL}/report/2026/en`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Naishin Whitepaper 2026 (English)', url },
        ]}
      />
      <ArticleSchema
        title="Naishin Whitepaper 2026 (English Summary)"
        description="English summary of the annual whitepaper comparing Japan's 47-prefecture school grading systems used in high school admissions"
        datePublished="2026-07-23"
        dateModified="2026-07-23"
        author="Shumai"
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">Naishin Whitepaper 2026 (English)</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-900 text-white shadow-xl">
              <BookMarked className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Naishin Whitepaper 2026</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              An English-language summary comparing how Japan&apos;s 47 prefectures each calculate
              &quot;naishin-ten&quot; (internal school assessment scores), based on official data from
              each prefecture&apos;s board of education. Free to cite for journalism and research with
              attribution.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Published by My Naishin · July 2026 · Covers the 2026 academic-year admissions cycle ·{' '}
              <Link href="/report/2026" className="font-semibold text-indigo-700 underline">
                日本語版はこちら
              </Link>
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-indigo-900">
              <Globe className="mt-0.5 h-4 w-4 shrink-0" />
              This page is an English-language summary. The complete 47-prefecture comparison table,
              source citations, and interactive calculators are available on the{' '}
              <Link href="/report/2026" className="font-bold underline">
                Japanese-language edition
              </Link>{' '}
              and via the{' '}
              <Link href="/developers" className="font-bold underline">
                public API
              </Link>
              .
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">Executive Summary</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              In Japan, public high school admissions use a metric called &quot;naishin-ten&quot;
              (内申点) — a score derived from a student&apos;s in-school grades (5-point scale per
              subject) that factors into the admissions decision alongside the entrance exam. Unlike
              the entrance exam itself, there is no nationwide standard for how naishin-ten is
              calculated: each of Japan&apos;s 47 prefectural boards of education sets its own rules
              for which school years count, how heavily practical/non-academic subjects (music, art,
              P.E., home economics) are weighted relative to the five core academic subjects, and what
              the maximum possible score is. Two students with identical report cards can therefore
              carry very different effective weight in their respective prefecture&apos;s admissions
              formula. This whitepaper makes that structural variation visible using a machine-readable
              dataset built from all 47 prefectures&apos; official admissions guidelines.
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Top 5 Structural Findings</h2>
            <ol className="space-y-4 text-sm leading-relaxed text-slate-600">
              <li>
                <strong className="text-slate-800">
                  1. Kagoshima Prefecture is a national outlier in how much it weights practical subjects.
                </strong>{' '}
                Kagoshima weights the four practical subjects at {TOP_SKEW.practicalSkew}x the five core
                academic subjects — roughly five times higher than the next tier of prefectures (Miyagi,
                Akita, Fukushima, Tokyo, Kyoto, Tottori, Okayama, Tokushima, and others, which use a 2x
                weighting).
              </li>
              <li>
                <strong className="text-slate-800">
                  2. {GRADE3_ONLY.length} prefectures ({Math.round((GRADE3_ONLY.length / ROWS.length) * 100)}
                  %) base admissions solely on 9th-grade (final-year) performance.
                </strong>{' '}
                In {GRADE3_ONLY.map((r) => r.name).join(', ')}, grades from the 7th and 8th grades carry
                no weight whatsoever in the admissions decision.
              </li>
              <li>
                <strong className="text-slate-800">
                  3. Maximum possible naishin-ten scores range from {MIN_MAX_SCORE.maxScore} points
                  (e.g. {MIN_MAX_SCORE.name}) to {MAX_MAX_SCORE.maxScore} points ({MAX_MAX_SCORE.name}) —
                  a {Math.round((MAX_MAX_SCORE.maxScore / MIN_MAX_SCORE.maxScore) * 10) / 10}x spread.
                </strong>{' '}
                A larger maximum score does not itself indicate an advantage, but the spread illustrates
                why raw naishin-ten values cannot be meaningfully compared across prefectures.
              </li>
              <li>
                <strong className="text-slate-800">
                  4. {NO_SKEW_COUNT} of {ROWS.length} prefectures (
                  {Math.round((NO_SKEW_COUNT / ROWS.length) * 100)}%) apply no extra weight to practical
                  subjects at all.
                </strong>{' '}
                How much practical subjects matter for admissions is entirely a matter of prefectural
                policy design, ranging from equal weighting to a 10x multiplier.
              </li>
              <li>
                <strong className="text-slate-800">
                  5. Kanagawa and Toyama use an unusual two-grade-year design (8th and 9th grade only).
                </strong>{' '}
                Most prefectures use either all three middle-school years or 9th grade alone; starting
                the evaluation window at 8th grade is comparatively rare.
              </li>
            </ol>
            <p className="mt-4 text-xs text-slate-400">
              All figures are derived mechanically from src/lib/prefectures.ts (each prefecture&apos;s
              official board of education publications). No new claims or estimates are introduced.
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">Citation &amp; Reuse</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              This summary and the underlying dataset are free to cite in journalism, blog posts, or
              academic work with attribution: &quot;Source: My Naishin
              (https://my-naishin.com/report/2026)&quot;. Please do not use this data to assert
              school-specific admissions cutoffs — this site does not collect or publish that
              information. For questions about the underlying methodology, see the{' '}
              <Link href="/report/2026" className="font-semibold text-indigo-700 underline">
                Japanese-language edition
              </Link>
              , which includes the full 47-prefecture comparison table and per-prefecture source URLs.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">FAQ</h2>
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
