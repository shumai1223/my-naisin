import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calculator, 
  ChevronRight, 
  Target, 
  BookOpen, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Award,
  Search,
  MessageSquare,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';

import { getPrefectureByCode, PREFECTURES } from '@/lib/prefectures';
import { getPrefectureGuide } from '@/lib/prefecture-guides';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { BlogRelatedArticles } from '@/components/BlogRelatedArticles';
import { PrefecturePillarLinks } from '@/components/PrefecturePillarLinks';
import { HighSchoolBorderlineTable } from '@/components/HighSchoolBorderlineTable';

interface PrefecturePageProps {
  params: Promise<{
    prefecture: string;
  }>;
}

export async function generateMetadata({ params }: PrefecturePageProps) {
  const { prefecture: code } = await params;
  const pref = getPrefectureByCode(code);
  if (!pref) return {};

  return {
    title: `${pref.name}公立高校入試の内申点対策・計算ガイド【2026年最新】`,
    description: `${pref.name}の高校入試における内申点の計算方法、換算内申、実技教科の倍率、対象学年を徹底解説。${pref.description}。志望校合格に向けた内申点アップの戦略も掲載。`,
    alternates: {
      canonical: `https://my-naishin.com/${code}`,
    },
  };
}

export default async function PrefecturePage({ params }: PrefecturePageProps) {
  const { prefecture: code } = await params;
  const pref = getPrefectureByCode(code);

  if (!pref) {
    notFound();
  }

  const guide = getPrefectureGuide(code);

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' },
          { name: pref.name, url: `https://my-naishin.com/${code}` }
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 py-12 text-white md:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold backdrop-blur-md ring-1 ring-white/20">
              <MapPin className="h-4 w-4 text-blue-300" />
              {pref.region}エリア
            </div>
            <h1 className="mb-6 text-3xl font-black tracking-tight md:text-5xl lg:text-6xl">
              {pref.name}公立高校入試<br className="md:hidden" />
              <span className="text-blue-300">内申点完全攻略ガイド</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100/90 md:text-xl font-bold">
              令和8年度（2026年度）入学者選抜に完全対応。
            </p>
            <p className="mx-auto max-w-2xl mt-2 text-blue-100/80">
              {pref.name}特有の計算ルール、実技倍率、合否判定における内申の重みを徹底解析しました。
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${code}/naishin`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-900 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
              >
                <Calculator className="h-6 w-6" />
                内申点を今すぐ計算
              </Link>
              <Link
                href={`/reverse?pref=${code}`}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600/30 px-8 py-4 text-lg font-bold text-white shadow-lg backdrop-blur-md ring-1 ring-white/30 transition-all hover:bg-blue-600/50 hover:-translate-y-1"
              >
                <Target className="h-6 w-6" />
                合格目標から逆算
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              
              {/* 3つのポイント */}
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-slate-800">
                  <Award className="h-7 w-7 text-amber-500" />
                  {pref.name}入試の要点まとめ
                </h2>
                <div className="grid gap-6 sm:grid-cols-1">
                   <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                     <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 font-bold text-white shadow-lg">1</div>
                     <div>
                       <h3 className="font-bold text-slate-800 text-lg">対象学年と配点</h3>
                       <p className="mt-2 text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.target }} />
                     </div>
                   </div>
                   <div className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                     <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-600 font-bold text-white shadow-lg">2</div>
                     <div>
                       <h3 className="font-bold text-slate-800 text-lg">実技教科の重要度</h3>
                       <p className="mt-2 text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.practical }} />
                     </div>
                   </div>
                   <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                     <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 font-bold text-white shadow-lg">3</div>
                     <div>
                       <h3 className="font-bold text-slate-800 text-lg">合計満点と換算方式</h3>
                       <p className="mt-2 text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.maxScore }} />
                     </div>
                   </div>
                </div>
              </section>

              {/* 高校別ボーダーライン一覧（最重要データ） */}
              <HighSchoolBorderlineTable prefectureCode={code} prefectureName={pref.name} />

              {/* 関連ナビゲーション */}
              <section className="grid gap-4 sm:grid-cols-2">
                <Link href={`/${code}/naishin`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{pref.name}用計算ツール</h3>
                  <p className="mt-2 text-sm text-slate-500">あなたの今の内申点が何点になるか瞬時に算出します。</p>
                  <div className="mt-4 flex items-center font-bold text-blue-600 group-hover:underline">
                    ツールを開く <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <Link href={`/reverse?pref=${code}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">合格点シミュレーター</h3>
                  <p className="mt-2 text-sm text-slate-500">志望校合格に必要な当日点と内申点の比率を逆算します。</p>
                  <div className="mt-4 flex items-center font-bold text-indigo-600 group-hover:underline">
                    シミュレーションする <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </section>

              {/* 関連コラム */}
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    {pref.name}の受験お役立ち情報
                  </h2>
                  <Link href="/blog" className="text-sm font-bold text-blue-600 hover:underline">
                    一覧を見る
                  </Link>
                </div>
                <BlogRelatedArticles prefectureCode={code} limit={6} />
              </section>

              {/* 信頼性と根拠 */}
              <section className="rounded-3xl bg-slate-800 p-8 text-white shadow-xl">
                 <div className="flex items-start gap-4">
                   <div className="rounded-xl bg-blue-500 p-3 shadow-lg shadow-blue-500/20">
                     <ShieldCheck className="h-8 w-8" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold">情報の信頼性について</h2>
                     <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                       当サイトの情報は、{pref.name}教育委員会が公式に発表している「令和8年度（2026年度）入学者選抜実施要綱」等の一次資料を元に、現役のエンジニアと受験専門チームが1点1点の計算ロジックを検証しています。
                     </p>
                     <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-blue-300">
                       <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><Calendar className="h-3 w-3" /> 2026年4月最終更新済</span>
                       <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><Search className="h-3 w-3" /> 一次資料検証済</span>
                       <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><Sparkles className="h-3 w-3" /> 2026年度入試結果反映</span>
                     </div>
                   </div>
                 </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* 地域別リンク */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  近隣の都道府県
                </h3>
                <div className="grid gap-2">
                  {PREFECTURES
                    .filter(p => p.region === pref.region && p.code !== code)
                    .map(p => (
                      <Link
                        key={p.code}
                        href={`/${p.code}`}
                        className="flex items-center justify-between rounded-xl border border-slate-50 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100"
                      >
                        {p.name}の対策
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    ))}
                </div>
              </div>

              {/* お問い合わせ */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h3 className="font-bold text-blue-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  相談・誤り報告
                </h3>
                <p className="mt-2 text-xs text-blue-700 leading-relaxed">
                  {pref.name}の入試制度変更や、計算結果の相違にお気づきの場合は、こちらからお知らせください。
                </p>
                <Link
                  href="/contact"
                  className="mt-4 block rounded-xl bg-blue-600 px-4 py-2 text-center text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700"
                >
                  報告・連絡する
                </Link>
              </div>

              {/* 内部リンクピラー */}
              <PrefecturePillarLinks prefectureCode={code} prefectureName={pref.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
