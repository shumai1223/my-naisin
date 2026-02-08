'use client';

import { User, ArrowLeft, Shield, RefreshCw, FileText, Mail, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

export default function AboutPage() {
  const dataLastVerified = '2026年1月30日';
  const featureLastUpdated = '2026年2月4日';
  const version = 'v2026.1+20260204';

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
          
          {/* 運営者プロフィール */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <User className="h-5 w-5 text-blue-500" />
              運営者プロフィール
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200">
                <h3 className="mb-2 font-bold text-blue-800">👋 私は誰か</h3>
                <p><strong>ハンドルネーム：</strong>My Naishin運営者（中学生開発者）</p>
                <p><strong>立場：</strong>現在高校受験を経験した中学生。同じく受験を控える仲間のために、自分が困った経験を活かしてツールを開発。</p>
                <p><strong>開発動機：</strong>「内申点の計算って県ごとに違うし、何が必要か分かりにくい」という自分の経験から、もっと分かりやすいツールがあればいいのにと思ったのがきっかけ。</p>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-200">
                <h3 className="mb-2 font-bold text-green-800">💪 できること</h3>
                <ul className="space-y-1">
                  <li>• <strong>実装・開発：</strong>Webアプリケーションの設計・コーディング</li>
                  <li>• <strong>データ検証：</strong>各都道府県の公式資料を確認し、計算ロジックを実装</li>
                  <li>• <strong>情報収集：</strong>教育委員会の最新情報を追跡・反映</li>
                  <li>• <strong>ユーザーサポート：</strong>不具合報告・質問への対応（48時間以内）</li>
                </ul>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 border border-amber-200">
                <h3 className="mb-2 font-bold text-amber-800">⚠️ できないこと（明確化）</h3>
                <ul className="space-y-1">
                  <li>• <strong>進路相談：</strong>具体的な志望校選択や合格判定はできません</li>
                  <li>• <strong>学習指導：</strong>教科の勉強方法や個別指導は行いません</li>
                  <li>• <strong>公式手続き：</strong>出願手続きや学校への問い合わせ代行はできません</li>
                  <li>• <strong>保証：</strong>計算結果の絶対的な正確性や合格保証はできません</li>
                </ul>
                <p className="mt-2 text-xs text-amber-700"><strong>理由：</strong>私は開発者であり、教育の専門家ではありません。進路に関する最終決定は、保護者の方や学校の先生と相談してください。</p>
              </div>
            </div>
          </div>

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
            <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
              <div className="text-xs text-slate-500">
                <span className="font-medium">バージョン:</span> {version}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <div>
                  <span className="font-medium">制度データ最終確認日:</span> {dataLastVerified}
                </div>
                <div>
                  <span className="font-medium">サイト機能最終更新日:</span> {featureLastUpdated}
                </div>
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
                  <span><strong>毎年6〜8月：</strong>47都道府県の入学者選抜実施要綱を一斉点検し、変更があった県は即座に反映</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>随時：</strong>教育委員会の公式発表や制度改正があった場合は都度確認・更新</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>差分記録：</strong>変更があった県はトップページの更新履歴に記録し、透明性を確保</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>ユーザー報告：</strong>お問い合わせフォームから情報の誤りをご指摘いただいた場合、原則48時間以内に確認・修正</span>
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

          {/* 検証のやり方 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Shield className="h-5 w-5 text-emerald-500" />
              検証のやり方
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-bold text-slate-700">参照資料の種類</h3>
                <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <div>
                      <strong>入学者選抜実施要綱</strong> - 各都道府県教育委員会が毎年発行
                      <div className="mt-1 text-xs text-slate-400">例：東京都「令和8年度東京都立高等学校入学者選抜実施要綱」第3章第2節「調査書の取扱い」</div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <div>
                      <strong>配点表・内申点算出方法</strong> - 要綱別表や付録資料
                      <div className="mt-1 text-xs text-slate-400">例：神奈川県「中学校の評定平均値の算出方法」PDF第2ページ「評定平均値の算出式」</div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <div>
                      <strong>年度情報</strong> - 2026年度入試（令和8年度）対応
                      <div className="mt-1 text-xs text-slate-400">URL：各県教育委員会公式サイトの入試情報ページ（例：https://www.kyoiku.metro.tokyo.lg.jp/admission/）</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold text-slate-700">反映ルール</h3>
                <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <strong>毎年6〜8月：</strong>47都道府県の要綱を一斉チェック。変更があった県は即座に反映
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <strong>随時更新：</strong>教育委員会の公式発表や制度改正があった場合は48時間以内に確認・反映
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    <strong>バージョン管理：</strong>変更履歴をトップページに記録し、透明性を確保
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold text-slate-700">誤り報告→修正のフロー</h3>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <ol className="space-y-2 text-sm leading-relaxed text-blue-800">
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>ユーザーからお問い合わせフォームで誤り報告（具体的なPDF名・ページ番号・数値を記載）</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>運営者が24時間以内に該当公式資料を確認（PDFダウンロード・該当ページ照合）</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>誤りが確認された場合、48時間以内にサイトデータを修正</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">4.</span>
                      <span>修正内容をトップページの更新履歴に記録し、報告者に回答</span>
                    </li>
                  </ol>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  具体例：「大阪府の内申点満点が450点ではなく440点になっている」との報告→「令和8年度大阪府立高等学校入学者選抜要綱」第5章別表第2を確認→修正
                </div>
              </div>
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

          <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
            <div className="mb-2 flex items-center justify-center gap-2 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              最終更新情報
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <div>制度データ: {dataLastVerified}</div>
              <div>サイト機能: {featureLastUpdated}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
