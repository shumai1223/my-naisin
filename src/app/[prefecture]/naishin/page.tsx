import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calculator, 
  ChevronRight, 
  GraduationCap,
  BookOpen,
  Info,
  Sparkles,
} from 'lucide-react';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getPrefectureGuide, generateDynamicFAQ } from '@/lib/prefecture-guides';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ErrorReportForm } from '@/components/ErrorReportForm';
import { PrefectureUniqueElements } from '@/components/PrefectureUniqueElements';
import { PrefectureMinimumContent } from '@/components/PrefectureMinimumContent';
import { ToolGuide } from '@/components/ToolGuide';
import { EvidenceSummary } from '@/components/EvidenceSummary';
import { PrefectureSearchIntent } from '@/components/PrefectureSearchIntent';
import { PrefectureFAQ } from '@/components/PrefectureFAQ';
import { BlogRelatedArticles } from '@/components/BlogRelatedArticles';
import InteractiveCalculator from '@/components/Calculator/InteractiveCalculatorWrapper';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

function getFormulaExplanation(prefecture: { targetGrades: number[]; gradeMultipliers: Record<number, number>; practicalMultiplier: number; maxScore: number }) {
  const parts: string[] = [];
  prefecture.targetGrades.forEach(grade => {
    const multiplier = prefecture.gradeMultipliers[grade];
    if (multiplier > 0) {
      parts.push(`中${grade}${multiplier > 1 ? `×${multiplier}` : ''}`);
    }
  });
  let formula = parts.join(' ＋ ');
  if (prefecture.practicalMultiplier > 1) {
    formula += `（実技${prefecture.practicalMultiplier > 1 ? '倍' : ''}）`;
  }
  return formula;
}

export default async function PrefectureNaishinPage({ params }: PageProps) {
  const { prefecture: prefectureCode } = await params;
  const prefecture = getPrefectureByCode(prefectureCode);

  if (!prefecture) {
    notFound();
  }

  const formulaText = getFormulaExplanation(prefecture);

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' },
          { name: `${prefecture.name}の内申点計算`, url: `https://my-naishin.com/${prefectureCode}/naishin` }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/prefectures" className="hover:text-blue-600">都道府県一覧</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{prefecture.name}の内申点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  {prefecture.name}の内申点計算ツール
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {prefecture.region} | 2026年度入試対応（令和8年度入学者選抜）
                </p>
              </div>
            </div>
            
            {/* メインページへの誘導バナー */}
            <div className="mt-6 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    <strong>より詳細な分析をご希望の方は</strong>、メインページで成績推移グラフ・教科別分析・目標設定などの機能をご利用いただけます
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex-shrink-0 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  メインページへ
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="space-y-6">
            {/* 概要カード */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Info className="h-5 w-5 text-blue-500" />
                {prefecture.name}の計算方法
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

            {/* 埋め込み計算ツール（クライアントコンポーネント） */}
            <InteractiveCalculator
              prefectureCode={prefectureCode}
              prefectureName={prefecture.name}
              maxScore={prefecture.maxScore}
            />

            {/* 関連ブログ記事 - 計算ツールの直下に配置して回遊性を高める */}
            <BlogRelatedArticles prefectureCode={prefectureCode} limit={3} />

            {/* 根拠サマリー */}
            <section className="mt-8">
              <EvidenceSummary prefectureCode={prefectureCode} />
            </section>

            {/* ツールガイド */}
            <ToolGuide 
              prefectureName={prefecture.name}
              targetGrades={prefecture.targetGrades}
              maxScore={prefecture.maxScore}
              practicalMultiplier={prefecture.practicalMultiplier}
            />

            {/* 計算式（SSR - Googlebotに確実に見える） */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Calculator className="h-5 w-5 text-emerald-500" />
                計算式
              </h2>
              <div className="rounded-xl bg-slate-50 p-4">
                <code className="text-lg font-mono font-semibold text-slate-700">
                  {formulaText} ＝ {prefecture.maxScore}点満点
                </code>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><strong>5教科：</strong>国語・数学・英語・理科・社会（各5点満点）</p>
                <p><strong>実技4教科：</strong>音楽・美術・保健体育・技術家庭（各5点満点{prefecture.practicalMultiplier > 1 ? `、${prefecture.practicalMultiplier}倍で計算` : ''}）</p>
              </div>
            </section>

            {/* その県だけの詳細情報（SSR - Googlebotに確実に見える） */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <BookOpen className="h-5 w-5 text-blue-500" />
                {prefecture.name}ならではの内申ポイント
              </h2>

              {/* 3行要約 */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200">
                <h3 className="mb-3 font-bold text-blue-800 flex items-center gap-2">
                  {prefecture.name}の内申ポイント3行要約
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span><strong>対象学年：</strong>中{prefecture.targetGrades.join('・')}が対象{prefecture.targetGrades.length === 1 ? '（注：集中対策が必要）' : '（早めの対策が有利）'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span><strong>実技倍率：</strong>{prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍（実技得意な人有利）` : '等倍（バランス型が有利）'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span><strong>満点：</strong>{prefecture.maxScore}点{prefecture.maxScore >= 200 ? '（高得点戦略が必要）' : '（効率的な得点アップが可能）'}</span>
                  </div>
                </div>
              </div>

              {/* 公式資料情報 */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 border border-amber-200">
                <h3 className="mb-3 font-bold text-amber-800 flex items-center gap-2">
                  公式資料の確認ポイント
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <span><strong>資料名：</strong>{prefecture.name}教育委員会「令和8年度入学者選抜要項」</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span><strong>確認ページ：</strong>「調査書点の算出方法」または「内申点の取扱い」の項目</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span><strong>チェック項目：</strong>満点数・実技倍率・対象学年・学校ごとの注意事項</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span><strong>注意：</strong>学校・コースによって計算方法が異なる場合があります</span>
                  </div>
                </div>
              </div>
              
              {/* 都道府県固有要素（学年比率チャート等） */}
              <PrefectureUniqueElements prefectureCode={prefectureCode} />

              {/* 詳細解説テキスト */}
              <div className="mt-8 space-y-4 text-sm text-slate-700">
                {prefectureCode === 'tokyo' && (
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-800">東京都の内申ポイント</h4>
                    <p className="text-slate-600 leading-relaxed">
                      東京都の内申は、まず「素内申（9教科の合計＝45点満点）」と、一般入試で使う「換算内申」を分けて考えるのがコツです。換算内申は、学力検査を行う教科の評定を1倍、学力検査を行わない教科の評定を2倍として合計します。都立の一般的な5教科入試では満点が65点（＝5教科25点＋実技4教科40点）になり、実技4教科の影響が大きくなります。
                    </p>
                  </div>
                )}
                {/* 他の県の条件分岐も同様に配置... */}
              </div>
            </section>

            {/* 都道府県最低ラインコンテンツ（注意点・FAQ・根拠を統一） */}
            <PrefectureMinimumContent prefectureCode={prefectureCode} />

            {/* 検索意図コンテンツ */}
            <PrefectureSearchIntent prefectureCode={prefectureCode} />

            {/* 都道府県別FAQ */}
            <PrefectureFAQ prefectureCode={prefectureCode} />

            {/* 関連リンク */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-800">関連ページ</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  href="/reverse"
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Calculator className="h-4 w-4 flex-shrink-0" />
                  志望校逆算ツール
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  最新の受験戦略コラム
                </Link>
              </div>

              {/* 同じ地域の都道府県リンク */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">{prefecture.region}の他の都道府県</h4>
                <div className="flex flex-wrap gap-2">
                  {PREFECTURES
                    .filter(p => p.region === prefecture.region && p.code !== prefectureCode)
                    .slice(0, 8)
                    .map(p => (
                      <Link
                        key={p.code}
                        href={`/${p.code}/naishin`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {p.name}
                      </Link>
                    ))}
                </div>
              </div>
            </section>

            {/* 誤り報告フォーム */}
            <ErrorReportForm 
              prefectureCode={prefectureCode}
              prefectureName={prefecture.name}
            />
          </div>
        </div>
      </div>
    </>
  );
}
