'use client';

import { User, ArrowLeft, Shield, RefreshCw, FileText, Mail, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

export default function AboutPage() {
  const lastUpdated = '2026年1月30日';
  const version = 'v2026.1';

  return (
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
            <h1 className="text-2xl font-bold text-slate-800">運営者情報</h1>
            <p className="text-sm text-slate-500">About / Operator Information</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* サイト概要 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              サイト概要
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                <strong>{APP_NAME}</strong>は、中学生とその保護者の方に向けた内申点計算ツールです。
                全国47都道府県の計算方式に対応し、各地域の入試制度に合わせた正確な内申点を計算できます。
              </p>
              <p>
                当サイトは、高校受験に向けて頑張る中学生が、自分の現在地を把握し、
                目標に向かって効率的に学習を進められることを目的として運営しています。
              </p>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-3">
              <div className="text-xs text-slate-500">
                <span className="font-medium">バージョン:</span> {version}
              </div>
              <div className="text-xs text-slate-500">
                <span className="font-medium">最終更新:</span> {lastUpdated}
              </div>
            </div>
          </div>

          {/* 運営目的 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Shield className="h-5 w-5 text-emerald-500" />
              運営目的・方針
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                <span><strong>正確性：</strong>各都道府県の教育委員会が公開する公式資料に基づいて計算ロジックを実装</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                <span><strong>透明性：</strong>計算根拠・参照元を可能な限り明示</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                <span><strong>プライバシー：</strong>入力データはユーザーの端末内のみに保存し、サーバーには送信しない</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                <span><strong>無料提供：</strong>すべての機能を無料で利用可能（広告収入により運営）</span>
              </li>
            </ul>
          </div>

          {/* 情報更新方針 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              情報更新方針
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                内申点の計算方法や入試制度は、年度によって変更されることがあります。
                当サイトでは以下の方針で情報を更新しています：
              </p>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>各都道府県の教育委員会が公開する入学者選抜実施要綱を参照</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>年度切替時（毎年4月頃）に主要都道府県の情報を優先的に確認・更新</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>ユーザーからの指摘があった場合は速やかに確認・修正</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs leading-relaxed text-amber-800">
                <strong>免責事項：</strong>当サイトの計算結果は参考値です。
                実際の入試における内申点は、在籍中学校が作成する調査書に基づきます。
                最新の正確な情報については、各都道府県の教育委員会または在籍校にご確認ください。
              </p>
            </div>
          </div>

          {/* 参考資料 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <FileText className="h-5 w-5 text-indigo-500" />
              参考資料・情報源
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              <p>当サイトでは、以下の公式資料を参照しています：</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <div>
                    <span>各都道府県教育委員会の入学者選抜実施要綱</span>
                    <div className="mt-1 text-xs text-slate-400">（例：東京都教育委員会「令和8年度東京都立高等学校入学者選抜実施要綱」）</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <div>
                    <span>文部科学省の学習指導要領関連資料</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-slate-600">主要参照リンク：</p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200"
                >
                  東京都教育委員会
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200"
                >
                  神奈川県教育委員会
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://www.pref.saitama.lg.jp/f2208/nyuushi.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200"
                >
                  埼玉県教育委員会
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* 監修について */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <User className="h-5 w-5 text-blue-500" />
              コンテンツ監修について
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                当サイトの一部コンテンツ（内申点アップのコツ、学習アドバイス等）は、
                教育現場での指導経験を持つ協力者の監修を受けています。
              </p>
              <div className="rounded-xl bg-white/70 p-4">
                <div className="text-xs font-medium text-slate-700">監修者プロフィール</div>
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  <li>• 公立中学校での指導経験あり</li>
                  <li>• 高校受験指導歴10年以上</li>
                </ul>
                <p className="mt-2 text-xs text-slate-500">
                  ※プライバシー保護のため、詳細な個人情報は非公開としています
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-white/50 p-3">
                <p className="text-xs text-blue-800">
                  <strong>監修範囲：</strong>学習アドバイス・勉強法に関するコンテンツの内容確認<br />
                  <strong>免責：</strong>計算ロジックや制度解説は公式資料に基づき運営者が作成
                </p>
              </div>
            </div>
          </div>

          {/* お問い合わせ */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Mail className="h-5 w-5 text-violet-500" />
              お問い合わせ
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              サイトに関するご質問、不具合報告、情報の誤りに関するご指摘は、
              お問い合わせフォームよりご連絡ください。
            </p>
            <div className="mt-4">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition-all hover:shadow-lg"
              >
                <Mail className="h-4 w-4" />
                お問い合わせフォーム
              </Link>
            </div>
          </div>

          {/* 関連リンク */}
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              <Shield className="h-4 w-4" />
              プライバシーポリシー
            </Link>
            <Link 
              href="/terms"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              <FileText className="h-4 w-4" />
              利用規約
            </Link>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              最終更新日: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
