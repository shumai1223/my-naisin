import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Calculator, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Info,
  ArrowRight
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: `${prefecture.name}の内申点`, url: `https://my-naishin.com/pref/${prefecture.code}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 print:hidden">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">{prefecture.name}の内申点</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg print:hidden">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  {prefecture.name}の内申点計算方法
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {prefecture.region} | 令和{prefecture.fiscalYear || '7'}年度入試対応
                </p>
              </div>
            </div>
            <PrintButton />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 print:hidden">
            このページはA4印刷を想定したレイアウトです。学級通信・進路指導資料としてそのまま配布いただけます（
            <Link href="/for-teachers" className="font-bold text-blue-600 hover:underline">先生・進路指導のご担当者様へ</Link>）。
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* 概要カード */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-blue-500" />
              計算方法の概要
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {prefecture.description}
            </p>
            
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{prefecture.maxScore}点</div>
                <div className="mt-1 text-xs text-blue-600">満点</div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4 text-center">
                <div className="text-2xl font-bold text-indigo-700">
                  中{prefecture.targetGrades.join('・')}
                </div>
                <div className="mt-1 text-xs text-indigo-600">対象学年</div>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                </div>
                <div className="mt-1 text-xs text-purple-600">実技教科</div>
              </div>
            </div>

            {prefecture.note && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                <strong>補足：</strong> {prefecture.note}
              </div>
            )}
          </section>

          {/* 計算式 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-emerald-500" />
              計算式
            </h2>
            <div className="rounded-xl bg-slate-50 p-4">
              <code className="text-lg font-mono font-semibold text-slate-700">
                {getFormulaExplanation(prefecture)} ＝ {prefecture.maxScore}点満点
              </code>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><strong>5教科：</strong>国語・数学・英語・理科・社会（各5点満点）</p>
              <p><strong>実技4教科：</strong>音楽・美術・保健体育・技術家庭（各5点満点{prefecture.practicalMultiplier > 1 ? `、${prefecture.practicalMultiplier}倍で計算` : ''}）</p>
            </div>
          </section>

          {/* 注意点・落とし穴 */}
          <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {pitfalls.title}
            </h2>
            <ul className="space-y-3">
              {pitfalls.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 公式資料リンク */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              公式資料・情報源
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {prefecture.sourceUrl ? (
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {prefecture.sourceTitle || `${prefecture.name}教育委員会`}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500">
                  公式リンク：確認中
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                <Calendar className="h-4 w-4" />
                最終確認: {prefecture.lastVerified || '未確認'}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              ※ 制度は年度によって変更される場合があります。最新情報は上記公式サイトでご確認ください。
            </p>
          </section>

          {/* 個別学校ページへのハブリンク(Λ+3・孤児化防止) */}
          {schoolsSortedByName.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
              <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-800">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                {prefecture.name}の高校別・入試倍率
              </h2>
              <p className="mb-4 text-xs text-slate-500">
                学校ごとの今季入試倍率・募集人員のページです（{schoolsSortedByName.length}校）。
              </p>
              <div className="grid max-h-96 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
                {schoolsSortedByName.map((s) => (
                  <Link
                    key={s.schoolCode}
                    href={`/pref/${prefecture.code}/school/${s.schoolCode}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    <span className="truncate text-slate-700">{s.schoolName}</span>
                    <span className="ml-2 shrink-0 text-slate-400">{s.overallRate}倍</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA - 計算機へ */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white shadow-lg print:hidden">
            <h2 className="text-xl font-bold">
              {prefecture.name}の内申点を計算してみよう！
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              9教科の成績を入力するだけで、あなたの内申点がすぐにわかります
            </p>
            <Link
              href={`/?pref=${prefecture.code}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition-all hover:shadow-lg"
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
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 print:hidden">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/blog/naishin-guide"
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-slate-700">都道府県別の計算方法を比較</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                href="/blog/improve-grades-from-all-3"
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-slate-700">内申点を上げる方法15選</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>

          {/* 印刷時のみ表示する出典（ヘッダー/フッターが print:hidden のため、紙面に出典を残す） */}
          <p className="hidden text-xs text-slate-500 print:block">
            出典: My Naishin（https://my-naishin.com/pref/{prefecture.code}）
          </p>
        </div>
      </div>
    </div>
  );
}
