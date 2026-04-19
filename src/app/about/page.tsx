import { User, ArrowLeft, Shield, RefreshCw, FileText, Mail, ExternalLink, Calendar, BookOpen, GraduationCap, MapPin, Heart, Code, Search, MessageSquare, Terminal, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

import { APP_NAME } from '@/lib/constants';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '運営者情報・プロフィール | My Naishin - 内申点シミュレーター',
  description: '内申点シミュレーターMy Naishinの運営者情報。現役の中学生エンジニアが、自らの受験経験をもとに全国47都道府県の複雑な内申点計算を正確に可視化。受験生の視点に立ったツール開発を行っています。',
  alternates: {
    canonical: 'https://my-naishin.com/about',
  },
};

export default function AboutPage() {
  const dataLastVerified = '2026年4月16日';
  const featureLastUpdated = '2026年4月16日';
  const version = 'v2026.4.16';

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
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
            <User className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">運営者プロフィール</h1>
            <p className="text-sm text-slate-500">About the Project & Mission</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* 運営者プロフィール (E-E-A-T強化: 実体験重視) */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
              <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
                    <Terminal className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white ring-2 ring-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">My Naishin 開発チーム</h2>
                  <p className="mt-1 text-blue-100">代表：現役中学生エンジニア (中学3年生)</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                    <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium backdrop-blur-sm">当事者目線</span>
                    <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium backdrop-blur-sm">47都道府県PDF解析</span>
                    <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium backdrop-blur-sm">2026年度入試組</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">「中3の自分たちが、今本当に欲しい道具」を作りました。</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  はじめまして。My Naishinを開発している中学3年生のエンジニアです。
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  僕自身、受験生として志望校を考える中で、内申点の計算が都道府県ごとにあまりに複雑で、しかも正確な情報を見つけるのが大変だということに驚きました。
                </p>
                <p className="text-sm leading-relaxed text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border-l-4 border-blue-500">
                  「教育委員会の難しいPDFを読み込まなくても、誰でも一瞬で自分の立ち位置がわかるようにしたい」
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  そんな思いから、プログラミングのスキルを活かして、全国47都道府県の最新募集要項を一つひとつ解析し、このツールを作り上げました。
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  中学生が作っているからといって、精度に妥協はありません。むしろ、<strong>「自分たちの人生がかかっている」</strong>からこそ、1点1点の計算ロジックを公式資料と照らし合わせ、厳格にテストを行っています。
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-blue-800">
                    <Code className="h-4 w-4" />
                    開発のこだわり
                  </h3>
                  <ul className="space-y-1.5 text-xs text-blue-700">
                    <li>• <strong>一次資料の徹底解析：</strong>教育委員会のPDFを直接確認</li>
                    <li>• <strong>当事者UI：</strong>スマホで休み時間にサッと使える操作感</li>
                    <li>• <strong>透明性：</strong>計算の根拠をすべてページ内に明記</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-indigo-800">
                    <Shield className="h-4 w-4" />
                    信頼性への誓い
                  </h3>
                  <ul className="space-y-1.5 text-xs text-indigo-700">
                    <li>• 常に最新（2026年度入試）情報を反映</li>
                    <li>• プロの視点を取り入れるための塾講師へのヒアリング</li>
                    <li>• 誤り報告に対する24時間以内の修正対応</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* サイトの目的 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Target className="h-5 w-5 text-blue-500" />
              My Naishin のミッション
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                「My Naishin」は、受験生が「情報」で不利にならない世界を目指しています。
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>情報の格差をなくす：</strong> 複雑な制度をシンプルに伝え、誰もが同じスタートラインに立てるようにする。</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>不安をエネルギーに変える：</strong> 「あと何点必要か」が見えることで、今日からの勉強に集中できるようにする。</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 品質保証リンクへの誘導 */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
              <Shield className="h-5 w-5 text-emerald-600" />
              計算の正確性について
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              現役の中学生が運営していますが、ツールとしての信頼性はプロレベルを目指しています。具体的な算出根拠や検証プロセス、アップデート履歴については、以下の「品質保証ページ」をご覧ください。
            </p>
            <Link 
              href="/quality"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              <FileText className="h-4 w-4" />
              品質保証と信頼性への取り組み
            </Link>
          </div>

          {/* お問い合わせ */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <MessageSquare className="h-5 w-5 text-violet-500" />
              同じ受験生・保護者の皆様へ
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              「この機能が助かった！」「うちの県でもっと詳しく知りたい」といったお声が、テスト勉強の合間の開発の支えになります。
              また、制度の変更に気づかれた際も、ぜひ教えていただけると嬉しいです。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition-all hover:shadow-lg hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                お問い合わせフォーム
              </Link>
              <a 
                href="https://twitter.com/my_naishin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                公式X (旧Twitter)
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
            <div className="mb-2 flex items-center justify-center gap-2 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              最終更新情報
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-center">
              <div><strong>制度データ:</strong> {dataLastVerified}</div>
              <div><strong>サイト機能:</strong> {featureLastUpdated}</div>
              <div><strong>バージョン:</strong> {version}</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
