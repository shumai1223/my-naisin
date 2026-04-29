import { 
  User, 
  ArrowLeft, 
  ShieldCheck, 
  GraduationCap, 
  Code, 
  Search, 
  FileText, 
  ExternalLink, 
  Mail, 
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Github,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '編集長・開発者プロフィール | My Naishin',
  description: 'My Naishin（マイ内申）の編集長兼開発者、現役中学生エンジニアのプロフィール。47都道府県の教育委員会資料を自ら解析し、正確な内申点計算ツールの開発・運営を行っています。',
};

export default function EditorProfilePage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '運営者情報', url: 'https://my-naishin.com/about' },
          { name: '開発者プロフィール', url: 'https://my-naishin.com/about/editor-profile' }
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Back link */}
          <Link 
            href="/about" 
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            運営者情報に戻る
          </Link>

          {/* Profile Header */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-200 md:p-12">
            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50" />
            
            <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-xl">
                  <div className="h-full w-full rounded-xl bg-white flex items-center justify-center">
                    <User className="h-16 w-16 text-slate-300" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-full bg-emerald-500 p-2 text-white ring-4 ring-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-900">My Naishin 開発責任者</h1>
                <p className="mt-2 text-xl font-bold text-blue-600">現役中学生エンジニア (2026年度受験生)</p>
                
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                    <Code className="h-3 w-3" /> TypeScript / Next.js
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                    <Search className="h-3 w-3" /> 資料解析スペシャリスト
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
                    <CheckCircle2 className="h-3 w-3" /> 2026年度入試対応済
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-black text-slate-800">47</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">都道府県解析</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-black text-slate-800">100%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">一次資料準拠</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-black text-slate-800">継続改善中</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">月間ユーザー</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-black text-slate-800">2026</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">最新対応年度</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Sidebar info */}
            <div className="space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">経歴・資格</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <GraduationCap className="h-5 w-5 text-blue-500 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">都内私立中 3年</div>
                      <div className="text-xs text-slate-500">（在学中・2026年度受験生）</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Award className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">数検2級 / 英検準1級</div>
                      <div className="text-xs text-slate-500">高い学習能力と分析力を保持</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Code className="h-5 w-5 text-indigo-500 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">フルスタック開発</div>
                      <div className="text-xs text-slate-500">Next.js / Cloudflare Workers等</div>
                    </div>
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl bg-slate-900 p-6 shadow-lg text-white">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">検証プロセス</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> 公式PDF直接ダウンロード
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> 数値アルゴリズムの自動テスト
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> 塾講師へのヒアリング
                  </div>
                  <div className="mt-4 text-[10px] text-slate-400 leading-relaxed">
                    「My Naishin」のデータは、各教育委員会が発行するPDF（1県あたり平均50ページ超）を全て読み込み、計算ルールを抽出しています。
                  </div>
                </div>
              </section>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-8">
              <section className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-black text-slate-900 border-b-2 border-blue-600 pb-2 inline-block">開発への想い</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  「自分の本当の内申点は何点なんだろう？」<br />
                  中学生にとって、高校受験のシステムはあまりにも複雑です。教育委員会のサイトを開いても、難解な言葉と巨大なPDFが並び、結局自分の立ち位置がわからないまま不安だけが募る。私自身がそうでした。
                </p>
                <p className="text-slate-600 leading-relaxed">
                  「それなら、自分が完璧なツールを作ればいい」<br />
                  そう考えて、47都道府県すべての入試要綱（令和8年度最新版）を読み解き、1点1点の計算ロジックをプログラムに落とし込みました。
                </p>
                <div className="my-8 rounded-2xl bg-blue-50 p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900 mt-0">My Naishinの使命</h3>
                  <p className="text-sm text-blue-800 mb-0">
                    単なる計算機ではなく、受験生が「あと何点取ればいいか」を正確に把握し、前向きに学習に取り組める環境を作ること。同じ受験生だからこそわかる「使いやすさ」と「情報の正確さ」に、妥協はありません。
                  </p>
                </div>

                <h2 className="text-2xl font-black text-slate-900 border-b-2 border-emerald-600 pb-2 inline-block">実績と信頼への取り組み</h2>
                <ul className="mt-6 space-y-4 list-none p-0">
                  <li className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                    <Search className="h-6 w-6 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-800 m-0">47都道府県の資料を完全解析</h4>
                      <p className="text-sm text-slate-600 m-0 mt-1">
                        各教育委員会の一次情報を毎月巡回。制度変更や微細な計算ルールの変更（端数処理の桁数など）まで、すべてコードに反映させています。
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                    <FileText className="h-6 w-6 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-800 m-0">継続的な改善</h4>
                      <p className="text-sm text-slate-600 m-0 mt-1">
                        公開から数ヶ月で多くの受験生・保護者・学校関係者にご利用いただいています。日々のフィードバックを元に、毎週のアップデートを継続しています。
                      </p>
                    </div>
                  </li>
                </ul>
              </section>

              {/* Action */}
              <div className="flex flex-wrap gap-4 items-center p-8 rounded-3xl bg-gradient-to-br from-slate-100 to-white border-2 border-blue-600 shadow-xl">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">正確な内申点を知ることから始めましょう</h3>
                  <p className="text-sm text-slate-600 mt-2">私が作成したアルゴリズムで、あなたの都道府県の正確な内申点を算出します。</p>
                </div>
                <Link 
                  href="/prefectures"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105"
                >
                  計算ツール一覧へ
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
