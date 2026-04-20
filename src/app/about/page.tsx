import { User, ArrowLeft, Shield, RefreshCw, FileText, Mail, ExternalLink, Calendar, BookOpen, GraduationCap, MapPin, Heart, Code, Search, MessageSquare, Terminal, CheckCircle, Scale } from 'lucide-react';
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
  const dataLastVerified = '2026年4月20日';
  const featureLastUpdated = '2026年4月20日';
  const version = 'v2026.4.20';

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '運営者情報', url: 'https://my-naishin.com/about' }
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
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
          
          {/* 運営者プロフィール (E-E-A-T強化: 徹底した検証プロセス) */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 text-white">
              <div className="flex flex-col items-center gap-6 md:flex-row md:text-left">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10 bg-white/10 shadow-xl backdrop-blur-sm">
                    <Terminal className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-1.5 text-white ring-2 ring-slate-900">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">My Naishin 開発プロジェクト</h2>
                  <p className="mt-1 text-slate-300">代表：中学3年生エンジニア (2026年度受験生)</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                    <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-medium text-blue-300 border border-blue-500/30">一次資料徹底解析</span>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/30">教育委員会PDF完全準拠</span>
                    <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/30">塾講師アドバイザー協力</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">開発の背景：情報の不透明性を解消するために</h3>
                <p className="text-slate-600 leading-relaxed">
                  高校受験において、内申点は「当日の試験」と同じか、それ以上に重要な要素です。しかし、その計算方法は都道府県ごとに驚くほど複雑で、教育委員会の一次資料（PDF）を読み解くには多大な労力を要します。
                </p>
                <p className="text-slate-600 leading-relaxed">
                  私自身、2026年度に受験を控える当事者として、「自分たちが最も信頼でき、最も使いやすいツールが欲しい」と考え、このプロジェクトを立ち上げました。
                </p>

                <h3 className="mt-8 text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">情報の正確性を担保する3つの「徹底」</h3>
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

          {/* サイトの専門性 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Shield className="h-6 w-6 text-blue-600" />
              コンテンツ制作ガイドライン
            </h2>
            <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
              <p>
                「My Naishin」のコンテンツは、以下のポリシーに基づいて制作されています。
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border-l-2 border-emerald-500 pl-4">
                  <h4 className="font-bold text-slate-800">正確性の追求</h4>
                  <p className="mt-1">計算結果の誤差をゼロにするため、各県の満点数、傾斜配点、端数処理のルール（切り捨て・切り上げ・四捨五入）まで詳細にプログラムしています。</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-bold text-slate-800">中立性の保持</h4>
                  <p className="mt-1">特定の塾やサービスへ誘導することを目的とせず、受験生が自分に最適な戦略を立てるための「客観的な数値データ」を提供することに徹しています。</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-4">
                  <h4 className="font-bold text-slate-800">最新情報の提供</h4>
                  <p className="mt-1">「令和8年度（2026年度）入試」に対応していることを明記し、過去の制度と混同しないよう配慮しています。</p>
                </div>
                <div className="border-l-2 border-violet-500 pl-4">
                  <h4 className="font-bold text-slate-800">UX/アクセシビリティ</h4>
                  <p className="mt-1">中学生がスマホ1つで、休み時間や通学中にストレスなく計算できるよう、広告配置や操作性を最適化しています。</p>
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
