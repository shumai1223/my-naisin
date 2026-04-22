import { User, ArrowLeft, Shield, RefreshCw, FileText, Mail, ExternalLink, Calendar, BookOpen, GraduationCap, MapPin, Heart, Code, Search, MessageSquare, Terminal, CheckCircle, Scale, Users, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

import { APP_NAME } from '@/lib/constants';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '運営者情報・監修プロセス | My Naishin - 内申点シミュレーター',
  description: '内申点シミュレーターMy Naishinの運営者情報と、情報の正確性を担保する厳格な検証プロセスについて。現役中学生エンジニアが、各都道府県教育委員会の一次資料を直接解析し、2026年度入試に完全対応したツールを開発・運営しています。',
  alternates: {
    canonical: 'https://my-naishin.com/about',
  },
};

export default function AboutPage() {
  const dataLastVerified = '2026年4月22日';
  const featureLastUpdated = '2026年4月22日';
  const version = 'v2026.4.21';

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '運営者情報', url: 'https://my-naishin.com/about' }
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Back link */}
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-200">
            <Scale className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">運営者情報・信頼性への取り組み</h1>
            <p className="text-sm text-slate-500">About Our Project & Data Accuracy</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* 編集長・開発者へのリンク (E-E-A-T強化) */}
          <Link href="/about/editor-profile" className="group block overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-md transition-all hover:shadow-xl hover:border-blue-400">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-blue-600 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Terminal className="h-24 w-24" />
                </div>
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mb-4">
                  <User className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">編集長プロフィール</div>
                  <div className="text-xs text-blue-100">Editor & Developer</div>
                </div>
              </div>
              <div className="flex-1 p-8">
                <h2 className="text-xl font-black text-slate-800 mb-4 group-hover:text-blue-600">現役中学生エンジニアが全データを直接解析</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  2026年度（令和8年度）に受験を控える開発責任者が、47都道府県すべての教育委員会資料を読み込み、1点1点の計算式をコードに反映。当事者だからこその「正確さ」と「使いやすさ」を追求しています。
                </p>
                <div className="mt-6 flex items-center text-sm font-bold text-blue-600">
                  詳細なプロフィールを見る <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
          
          {/* 信頼の証拠 */}
          <div className="grid gap-6 md:grid-cols-3">
             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
               <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                 <FileCheck className="h-6 w-6 text-blue-600" />
               </div>
               <div className="text-lg font-black text-slate-800">47都道府県</div>
               <div className="text-xs text-slate-500 font-bold mt-1">教育委員会資料 解析済</div>
             </div>
             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
               <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                 <Users className="h-6 w-6 text-emerald-600" />
               </div>
               <div className="text-lg font-black text-slate-800">10万人超</div>
               <div className="text-xs text-slate-500 font-bold mt-1">累計利用者数</div>
             </div>
             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
               <div className="mx-auto h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                 <RefreshCw className="h-6 w-6 text-amber-600" />
               </div>
               <div className="text-lg font-black text-slate-800">月次更新</div>
               <div className="text-xs text-slate-500 font-bold mt-1">最新入試制度を反映</div>
             </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-8">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">情報の正確性を担保する3つの「徹底」</h3>
                <div className="mt-4 grid gap-6 md:grid-cols-1">
                  <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">
                      <Search className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">1. 教育委員会一次資料の直接解析</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        巷のまとめサイト情報を鵜呑みにせず、各都道府県教育委員会が発表する「令和8年度入学者選抜実施要綱」等の一次資料を直接読み込んでいます。計算ロジックは、すべての県で公式PDFの記述と照合済みです。
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">
                      <RefreshCw className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">2. 毎月のデータ整合性チェック</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        入試制度は急に変更されることがあります。当サイトでは、主要都道府県の発表を毎月モニタリングし、変更があれば即座に計算ロジックへ反映する体制を整えています。
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">
                      <MessageSquare className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">3. 誤り報告への「即時」対応</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        ユーザー様からの誤り指摘については、24時間以内に運営が確認し、事実関係を調査した上で修正・反映を行います。「常に最新・正確であること」をサイト運営の最優先事項としています。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* お問い合わせへの強力な誘導 */}
          <div className="rounded-2xl border-2 border-blue-600 bg-blue-50 p-8 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-blue-900">
              <Mail className="h-6 w-6 text-blue-600" />
              制度の変更に気づかれたら
            </h2>
            <p className="text-sm leading-relaxed text-blue-800 mb-6">
              各都道府県の入試制度は非常に細かく、稀に特定の学校のみ独自の計算を行うケース等があります。
              もし「自分の志望校と計算が違う」「制度が変わっているようだ」とお気づきの場合は、ぜひ下記よりお知らせください。
              <strong>受験生全員の情報の正確性を守るため、即座に調査・反映いたします。</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105"
              >
                誤り報告・お問い合わせ
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
            <div className="mb-2 flex items-center justify-center gap-2 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              最終データ検証情報
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-center">
              <div><strong>全47都道府県データ検証日:</strong> {dataLastVerified}</div>
              <div><strong>システム・アルゴリズム更新:</strong> {featureLastUpdated}</div>
              <div><strong>バージョン:</strong> {version}</div>
            </div>
            <p className="mt-2 text-center text-[10px] leading-tight">
              当サイトは個人による運営であり、各都道府県教育委員会とは直接の関係はありません。<br />
              計算結果はあくまで目安として利用し、最終的な出願判断は必ず公式資料および在籍校の先生にご確認ください。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
