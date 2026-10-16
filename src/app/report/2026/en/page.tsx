import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Globe } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import {
  REPORT_2026_ROWS as ROWS,
  REPORT_2026_NO_SKEW_COUNT as NO_SKEW_COUNT,
  REPORT_2026_GRADE3_ONLY as GRADE3_ONLY,
} from '@/lib/report-2026-data';
import { getPrefectureEnName, getRegionEnName } from '@/lib/prefecture-en-names';

/**
 * 内申点白書2026 英語版（X-20 Phase1＋Phase2）。海外の比較教育学研究者・国際教育系メディア向けに、
 * エグゼクティブサマリー・構造的発見トップ5・47都道府県全件比較表を翻訳した完全版。
 * 数値は全て日本語版(/report/2026)と同じsrc/lib/report-2026-data.tsのROWSを共有インポートし、
 * 翻訳時のハードコード転記による数値ドリフトを構造的に防止する。都道府県名・地域名の英訳は
 * src/lib/prefecture-en-names.tsの標準ローマ字表記のみ使用（新規の一次データ・推測値は一切
 * 追加しない＝捏造ゼロ原則）。出典URL・詳細な出典タイトルは日本語版のみに掲載し二重管理を避ける。
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
        title="Naishin Whitepaper 2026 (English Edition)"
        description="English edition of the annual whitepaper comparing Japan's 47-prefecture school grading systems used in high school admissions, including the full 47-prefecture comparison table"
        datePublished="2026-07-23"
        dateModified="2026-07-24"
        author="Shumai"
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">Naishin Whitepaper 2026 (English)</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">Naishin Whitepaper 2026</h1>
            <p className="mt-2 text-sm text-slate-600">
              Published by My Naishin · July 2026 · Covers the 2026 academic-year admissions cycle ·
              Source:{' '}
              <Link
                href="/report/2026#sources"
                className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                each prefecture&apos;s board of education
              </Link>{' '}
              ·{' '}
              <Link
                href="/report/2026"
                className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                日本語版はこちら
              </Link>
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              An English-language summary comparing how Japan&apos;s 47 prefectures each calculate
              &quot;naishin-ten&quot; (internal school assessment scores), based on official data from
              each prefecture&apos;s board of education. Free to cite for journalism and research with
              attribution.
            </p>
          </header>

          <section className="rounded-lg border border-slate-200 bg-brand-50 p-4">
            <p className="flex items-start gap-2 text-sm leading-[1.8] text-slate-900">
              <Globe className="mt-1 h-4 w-4 shrink-0" />
              <span>
                This page includes the full 47-prefecture comparison table. Detailed source citations
                (each prefecture&apos;s official board-of-education document titles) and interactive
                calculators are available on the{' '}
                <Link
                  href="/report/2026"
                  className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  Japanese-language edition
                </Link>{' '}
                and via the{' '}
                <Link
                  href="/developers"
                  className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  public API
                </Link>
                .
              </span>
            </p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">Executive Summary</h2>
            <p className="text-base leading-[1.8] text-slate-900">
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

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Top 5 Structural Findings</h2>
            <ol className="space-y-4 text-base leading-[1.8] text-slate-900">
              <li>
                <strong>
                  1. Kagoshima Prefecture is a national outlier in how much it weights practical subjects.
                </strong>{' '}
                Kagoshima weights the four practical subjects at {TOP_SKEW.practicalSkew}x the five core
                academic subjects — roughly five times higher than the next tier of prefectures (Miyagi,
                Akita, Fukushima, Tokyo, Kyoto, Tottori, Okayama, Tokushima, and others, which use a 2x
                weighting).
              </li>
              <li>
                <strong>
                  2. {GRADE3_ONLY.length} prefectures ({Math.round((GRADE3_ONLY.length / ROWS.length) * 100)}
                  %) base admissions solely on 9th-grade (final-year) performance.
                </strong>{' '}
                In {GRADE3_ONLY.map((r) => r.name).join(', ')}, grades from the 7th and 8th grades carry
                no weight whatsoever in the admissions decision.
              </li>
              <li>
                <strong>
                  3. Maximum possible naishin-ten scores range from {MIN_MAX_SCORE.maxScore} points
                  (e.g. {MIN_MAX_SCORE.name}) to {MAX_MAX_SCORE.maxScore} points ({MAX_MAX_SCORE.name}) —
                  a {Math.round((MAX_MAX_SCORE.maxScore / MIN_MAX_SCORE.maxScore) * 10) / 10}x spread.
                </strong>{' '}
                A larger maximum score does not itself indicate an advantage, but the spread illustrates
                why raw naishin-ten values cannot be meaningfully compared across prefectures.
              </li>
              <li>
                <strong>
                  4. {NO_SKEW_COUNT} of {ROWS.length} prefectures (
                  {Math.round((NO_SKEW_COUNT / ROWS.length) * 100)}%) apply no extra weight to practical
                  subjects at all.
                </strong>{' '}
                How much practical subjects matter for admissions is entirely a matter of prefectural
                policy design, ranging from equal weighting to a 10x multiplier.
              </li>
              <li>
                <strong>
                  5. Kanagawa and Toyama use an unusual two-grade-year design (8th and 9th grade only).
                </strong>{' '}
                Most prefectures use either all three middle-school years or 9th grade alone; starting
                the evaluation window at 8th grade is comparatively rare.
              </li>
            </ol>
            <p className="mt-4 text-sm text-slate-600">
              All figures are derived mechanically from src/lib/prefectures.ts (each prefecture&apos;s
              official board of education publications). No new claims or estimates are introduced.
            </p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">All 47 Prefectures (Full Comparison Table)</h2>
            <p className="mb-4 text-sm text-slate-600">
              Sorted by practical-subject weighting multiplier (descending). For official source
              citations, see the{' '}
              <Link
                href="/report/2026"
                className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Japanese-language edition
              </Link>
              .
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 font-bold">Prefecture</th>
                    <th scope="col" className="py-2 pr-3 font-bold">Region</th>
                    <th scope="col" className="py-2 pr-3 text-right font-bold">Practical-subject weight</th>
                    <th scope="col" className="py-2 pr-3 text-right font-bold">9th-grade weight</th>
                    <th scope="col" className="py-2 pr-3 text-right font-bold">School years counted</th>
                    <th scope="col" className="py-2 text-right font-bold">Max score</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.code} className="border-b border-slate-200 last:border-0">
                      <td className="py-2 pr-3 text-slate-900">
                        {getPrefectureEnName(r.code) ?? r.name}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{getRegionEnName(r.region)}</td>
                      <td className="py-2 pr-3 text-right font-bold tabular-nums text-slate-900">{r.practicalSkew}x</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-slate-900">{r.grade3WeightPct}%</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-slate-900">{r.gradeCount}</td>
                      <td className="py-2 text-right tabular-nums text-slate-900">{r.maxScore} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">Citation &amp; Reuse</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              This summary and the underlying dataset are free to cite in journalism, blog posts, or
              academic work with attribution: &quot;Source: My Naishin
              (https://my-naishin.com/report/2026)&quot;. Please do not use this data to assert
              school-specific admissions cutoffs — this site does not collect or publish that
              information. For questions about the underlying methodology, see the{' '}
              <Link
                href="/report/2026"
                className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Japanese-language edition
              </Link>
              , which includes the full 47-prefecture comparison table and per-prefecture source URLs.
            </p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">FAQ</h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="mb-1 text-[17px] font-bold leading-snug text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
