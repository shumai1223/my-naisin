import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  ArrowRight
} from '@/components/icons';
import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { PrintButton } from '@/components/PrintButton';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { getPrefectureSchoolPageData } from '@/lib/school-page-lookup';
import { getFormulaExplanation } from '@/lib/prefecture-helpers';
import { PREFECTURE_PITFALLS, DEFAULT_PITFALLS } from '@/lib/prefecture-pitfalls-data';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

interface PageProps {
  params: Promise<{ code: string }>;
}

// 47都道府県すべてをビルド時に静的生成（SSG）。毎リクエストSSRを止め Worker CPU超過（Error 1102）を防ぐ。
// dynamicParams は既定（true）のまま：プリレンダ漏れがあってもオンデマンド描画にフォールバックし、ハード404にしない（安全策）。
export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ code: p.code }));
}

export default async function PrefecturePage({ params }: PageProps) {
  const { code } = await params;
  const prefecture = getPrefectureByCode(code);

  if (!prefecture) {
    notFound();
  }

  const pitfalls = PREFECTURE_PITFALLS[code] || DEFAULT_PITFALLS;

  // Λ+3: 個別学校ページ(Λ-2)への内部リンクハブ。学校ページ自体は品質ゲート③(近隣校リンク)の
  // noindex解除判断が👤裁定待ちのため、ここでは孤児化防止のリンクのみ追加する
  // (このページ自体はindex対象のまま・リンク先が現時点でnoindexでも問題ない)。
  const schoolPageData = getPrefectureSchoolPageData(code);
  const schoolsSortedByName = schoolPageData
    ? [...schoolPageData.schools].sort((a, b) => a.schoolName.localeCompare(b.schoolName, 'ja'))
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: `${prefecture.name}の内申点`, url: `https://my-naishin.com/pref/${prefecture.code}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600 print:hidden">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">{prefecture.name}の内申点</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
                {prefecture.name}の内申点計算方法
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {prefecture.region} ／ {prefecture.fiscalYear || '2026'}年度入試対応
                {prefecture.sourceUrl && (
                  <>
                    {' ／ 出典：'}
                    <a
                      href={prefecture.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      {prefecture.sourceTitle || `${prefecture.name}教育委員会`}
                    </a>
                  </>
                )}
                {' ／ 最終確認：'}
                {prefecture.lastVerified || '未確認'}
              </p>
            </div>
            <PrintButton />
          </div>
          <p className="mt-3 text-sm leading-[1.8] text-slate-600 print:hidden">
            このページはA4印刷を想定したレイアウトです。学級通信・進路指導資料としてそのまま配布いただけます（
            <Link href="/for-teachers" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">先生・進路指導のご担当者様へ</Link>）。
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* 概要カード */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">計算方法の概要</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              {prefecture.description}
            </p>

            <dl className="mt-4 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-4 py-3">
                <dt className="text-xs text-slate-600">満点</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{prefecture.maxScore}点</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-slate-600">対象学年</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                  中{prefecture.targetGrades.join('・')}
                </dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-slate-600">実技教科</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                  {prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                </dd>
              </div>
            </dl>

            {prefecture.note && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-[1.8] text-slate-900">
                <strong>補足：</strong> {prefecture.note}
              </div>
            )}
          </section>

          {/* 計算式 */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">計算式</h2>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <code className="font-mono text-lg font-bold text-slate-900">
                {getFormulaExplanation(prefecture)} ＝ {prefecture.maxScore}点満点
              </code>
            </div>

            <div className="mt-4 space-y-2 text-base leading-[1.8] text-slate-900">
              <p><strong>5教科：</strong>国語・数学・英語・理科・社会（各5点満点）</p>
              <p><strong>実技4教科：</strong>音楽・美術・保健体育・技術家庭（各5点満点{prefecture.practicalMultiplier > 1 ? `、${prefecture.practicalMultiplier}倍で計算` : ''}）</p>
            </div>
          </section>

          {/* 注意点・落とし穴 */}
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-900" />
              {pitfalls.title}
            </h2>
            <ul className="space-y-3">
              {pitfalls.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="min-w-[1.5rem] shrink-0 text-base font-bold leading-[1.8] tabular-nums text-amber-900">
                    {index + 1}.
                  </span>
                  <span className="text-base leading-[1.8] text-slate-900">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 公式資料リンク */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">公式資料・情報源</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {prefecture.sourceUrl ? (
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 text-base text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {prefecture.sourceTitle || `${prefecture.name}教育委員会`}
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              ) : (
                <span className="text-base text-slate-600">
                  公式リンク：確認中
                </span>
              )}
              <span className="text-sm text-slate-600">
                最終確認: {prefecture.lastVerified || '未確認'}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              ※ 制度は年度によって変更される場合があります。最新情報は上記公式サイトでご確認ください。
            </p>
          </section>

          {/* 個別学校ページへのハブリンク(Λ+3・孤児化防止) */}
          {schoolsSortedByName.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 print:hidden">
              <h2 className="mb-1 text-xl font-bold text-slate-900">
                {prefecture.name}の高校別・入試倍率
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                学校ごとの今季入試倍率・募集人員のページです（{schoolsSortedByName.length}校）。
              </p>
              <div className="grid max-h-96 gap-x-6 overflow-y-auto pr-1 sm:grid-cols-2">
                {schoolsSortedByName.map((s) => (
                  <Link
                    key={s.schoolCode}
                    href={`/pref/${prefecture.code}/school/${s.schoolCode}`}
                    className="flex min-h-[44px] items-center justify-between border-b border-slate-200 px-1 py-2 text-sm hover:bg-brand-50"
                  >
                    <span className="truncate text-slate-900">{s.schoolName}</span>
                    <span className="ml-2 shrink-0 tabular-nums text-slate-600">{s.overallRate}倍</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA - 計算機へ */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 print:hidden">
            <h2 className="text-xl font-bold text-slate-900">
              {prefecture.name}の内申点を計算してみましょう
            </h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">
              9教科の成績を入力するだけで、あなたの内申点がすぐにわかります
            </p>
            <Link
              href={`/?pref=${prefecture.code}`}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
            >
              内申点を計算する
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* S3-2（PROPOSALS.md 2026-08-10）: 県別まとめページに換金導線が1つも配線されていなかった
              欠落を是正。既存の県面オファー(lead-config.ts)をplacement="prefecture"で解決するだけの
              最小配線。保護者共有導線がこのページに元々存在しないためG7の押し下げ対象は無い。 */}
          <ParentLeadCTA prefectureCode={prefecture.code} placement="prefecture" className="print:hidden" />

          {/* 関連リンク */}
          <section className="print:hidden">
            <h2 className="mb-4 text-xl font-bold text-slate-900">関連コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/blog/naishin-guide"
                className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50"
              >
                <span className="text-base text-slate-900">都道府県別の計算方法を比較</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
              <Link
                href="/blog/improve-grades-from-all-3"
                className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50"
              >
                <span className="text-base text-slate-900">内申点を上げる方法15選</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
            </div>
          </section>

          {/* 印刷時のみ表示する出典（ヘッダー/フッターが print:hidden のため、紙面に出典を残す） */}
          <p className="hidden text-xs text-slate-600 print:block">
            出典: My Naishin（https://my-naishin.com/pref/{prefecture.code}）
          </p>
        </div>
      </div>
    </div>
  );
}
