import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, TrendingUp, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HyoteiHeikinCalculator } from '@/components/HyoteiHeikin/HyoteiHeikinCalculator';

export const metadata: Metadata = {
  title: '評定平均 自動計算【中学生対応】通知表からワンクリックで算出 | My Naishin',
  description: '中学生の評定平均（通知表の平均値）を自動計算する無料ツール。9教科の評定を入力するだけで、評定平均（4.2など）が瞬時に算出され、高校入試での「内申点」相当の数値も同時に確認できます。推薦入試の基準にもどうぞ。',
  alternates: {
    canonical: 'https://my-naishin.com/hyotei-heikin',
  },
};

export default function HyoteiHeikinPage() {
  return (
    <>
      <WebApplicationSchema
        name="評定平均 自動計算 | My Naishin"
        description="9教科の評定から平均値を瞬時に計算。中学生向け無料ツール。"
        url="https://my-naishin.com/hyotei-heikin"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '評定平均 自動計算', url: 'https://my-naishin.com/hyotei-heikin' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">評定平均 自動計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              評定平均 自動計算【中学生対応】
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              通知表の9教科の評定（5段階）を入力するだけ。<br />
              評定平均値と、高校入試で使う「内申点（素内申）」を同時に算出します。
            </p>
          </header>

          {/* What is 評定平均 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              評定平均とは？
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-800">評定平均</strong>とは、通知表の9教科の評定（1〜5の5段階）を合計して教科数（9）で割った数値です。
              小数点第1位までで表すのが一般的で、たとえば全教科3なら「3.0」、5教科5・4教科3なら「4.0」となります。
            </p>
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <div className="text-xs font-bold text-emerald-800 mb-1">計算式</div>
              <div className="font-mono text-sm text-emerald-900">
                評定平均 = （9教科の評定の合計）÷ 9
              </div>
            </div>
          </section>

          {/* Calculator */}
          <HyoteiHeikinCalculator />

          {/* 評定平均と入試 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              評定平均と高校入試の関係
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="text-2xl font-black text-red-700 w-16 text-center shrink-0">4.5+</div>
                <div className="text-red-800">
                  <div className="font-bold">最難関校レベル</div>
                  <div className="text-xs">トップ進学校・推薦入試で内申基準を確実にクリア</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="text-2xl font-black text-orange-700 w-16 text-center shrink-0">4.0+</div>
                <div className="text-orange-800">
                  <div className="font-bold">上位校レベル</div>
                  <div className="text-xs">多くの公立進学校で推薦基準をクリア</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-2xl font-black text-amber-700 w-16 text-center shrink-0">3.5+</div>
                <div className="text-amber-800">
                  <div className="font-bold">中堅上位レベル</div>
                  <div className="text-xs">多くの公立高校で安定して合格圏内</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-2xl font-black text-emerald-700 w-16 text-center shrink-0">3.0</div>
                <div className="text-emerald-800">
                  <div className="font-bold">平均レベル</div>
                  <div className="text-xs">全教科オール3。多くの中堅公立高校が選択肢</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-2xl font-black text-blue-700 w-16 text-center shrink-0">2.5</div>
                <div className="text-blue-800">
                  <div className="font-bold">中堅下位レベル</div>
                  <div className="text-xs">私立高校や入りやすい公立高校が選択肢に</div>
                </div>
              </div>
            </div>
          </section>

          {/* アフィリエイト */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              評定平均を上げたいあなたへ
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              定期テスト対策で評定を底上げするなら<AffiliateAd id="zkai-text-middle" hideLabel />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="mt-3 text-xs">
              無料の<AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />（PR）で詳細を確認
            </div>
          </section>

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 評定平均と内申点の違いは？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  「評定平均」は1教科あたりの平均値（4.2など）、「内申点（素内申）」は合計値（38など）で表現します。同じ通知表データを別の形で表したものです。当ツールでは両方を同時に確認できます。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 評定平均はいつの通知表を使う？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  推薦入試では、中学3年の1学期または前期の成績を使うのが一般的です。一般入試で使う「内申点」は都道府県により異なり、中3のみ／中1〜3まで幅広く対象になる場合があります。
                  詳しくは<Link href="/prefectures" className="text-blue-600 underline">都道府県別の制度ページ</Link>をご確認ください。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 評定平均は5段階？10段階？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  公立中学校では原則として5段階評価が使われています。一部の私立中学では10段階を使うこともありますが、高校入試の調査書では5段階に換算されます。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                当ツールは9教科すべてを等しい重みで計算する「素内申」ベースです。実技教科を1.3倍・2倍などに加重する「換算内申」については
                <Link href="/" className="text-amber-900 underline font-bold">トップページの内申点計算ツール</Link>をご利用ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">内申点を計算する（換算対応）</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/prefectures" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">都道府県別の内申点制度</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
