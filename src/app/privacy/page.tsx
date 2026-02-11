'use client';

import { Shield, ArrowLeft, Cookie, Eye, BarChart3, ExternalLink, Users, Database, Lock, Mail, Bell, FileCheck } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
  const lastUpdated = '2026年1月28日';

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
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">プライバシーポリシー</h1>
            <p className="text-sm text-slate-500">Privacy Policy</p>
          </div>
        </div>

        {/* Summary Box */}
        <div className="mb-8 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-emerald-800">
            <FileCheck className="h-5 w-5" />
            プライバシーポリシーの要約
          </h3>
          <ul className="space-y-2 text-sm text-emerald-700">
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>ツール利用時：</strong>個人情報を収集しません（端末内のみ保存）</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>お問い合わせ時：</strong>返信のためメールアドレス等を取得します</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>広告配信：</strong>第三者Cookieを使用してパーソナライズ広告を配信します</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <span><strong>データ利用：</strong>Google等のサービスが利用データを収集・分析します</span>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          
          {/* はじめに */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">1. はじめに</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {APP_NAME}（以下「当サイト」）は、ユーザーのプライバシーを最大限に尊重し、
              個人情報の保護に全力で努めています。本プライバシーポリシーでは、当サイトが取得する情報、
              その取り扱い方法、ユーザーの権利、およびデータ保護に関する当サイトの取り組みについて
              詳細に説明いたします。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              当サイトをご利用になる前に、本プライバシーポリシーを注意深くお読みください。
              当サイトを利用された場合は、本ポリシーに記載されたすべての条項に同意いただいたものとみなされます。
              本ポリシーに同意いただけない場合は、当サイトのご利用をお控えください。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              当サイトは、日本国内の法令および国際的なプライバシー保護の基準に準拠し、
              透明性のある情報管理を行うことをお約束いたします。
            </p>
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-blue-800">
                <strong>対象：</strong>中学生・高校生（主に13歳以上）
              </p>
              <p className="mt-1 text-xs text-blue-700">
                13歳未満の方は保護者の同意のもとご利用ください。
              </p>
            </div>
          </section>

          {/* 収集する情報 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">2. 収集する情報</h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">
                ✓ ツール利用時は個人情報を収集しません（端末内のみ保存）
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                ※ お問い合わせ時のみ、返信のためメールアドレス等を取得します（詳細は2.2参照）
              </p>
            </div>
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">2.1 ツール利用時の情報</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              内申点計算ツールをご利用の際、入力された成績データはお使いのブラウザの
              ローカルストレージにのみ保存され、当サイトのサーバーに送信されることは一切ありません。
              個人を特定できる情報（氏名、住所、電話番号等）を収集することはありません。
            </p>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">2.2 お問い合わせ時の情報</h3>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>お問い合わせフォームをご利用の場合：</strong>返信のためにメールアドレス等の個人情報を取得します。
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>• <strong>取得項目：</strong>お名前（ニックネーム可）、メールアドレス、お問い合わせ内容</li>
                <li>• <strong>利用目的：</strong>お問い合わせへの回答・対応のみ</li>
                <li>• <strong>保管期間：</strong>対応完了後6ヶ月間（法的要請がある場合を除く）</li>
                <li>• <strong>削除方法：</strong>削除をご希望の場合はお問い合わせください</li>
              </ul>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              ユーザーが「記録を保存」機能をONにした場合、成績の履歴（保存日時・任意のメモ）も
              同様にお使いの端末内にのみ保存されます。この履歴データは最大30件まで保存され、
              古いデータから自動的に削除されます。
            </p>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">2.3 自動的に収集される情報</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトでは、サービス向上のために以下の情報を自動的に収集する場合があります：
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                ブラウザの種類およびバージョン
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                オペレーティングシステムの種類
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                アクセス日時およびページ閲覧履歴
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                リファラー（参照元URL）
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                IPアドレス（匿名化処理を行います）
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              これらの情報は、アクセス解析ツール（Google Analytics等）を通じて収集され、
              サイトの改善およびユーザー体験の向上のためにのみ使用されます。
              個人を特定するために使用されることはありません。
            </p>
          </section>

          {/* ローカルストレージ */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800">3. ローカルストレージの使用</h2>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              当サイトでは、ユーザーの利便性向上のためにブラウザのローカルストレージ機能を使用しています。
              ローカルストレージとは、お使いのブラウザにデータを保存する技術であり、
              保存されたデータは当サイトのサーバーに送信されることはありません。
            </p>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">3.1 保存される情報の種類</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <strong>成績データ：</strong>入力した各教科の評定値（ページを閉じても復元可能）
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <strong>都道府県選択：</strong>選択した都道府県の計算方式（全国47都道府県対応）
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <strong>成績履歴：</strong>保存機能ONの場合、過去の計算結果（保存日時・任意のメモを含む、最大30件）
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <strong>Cookie同意状態：</strong>Cookie使用への同意有無
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <strong>保存機能の設定：</strong>記録保存機能のON/OFF状態
              </li>
            </ul>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">3.2 データの保持期間</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              ローカルストレージに保存されたデータは、ユーザーがブラウザのデータを削除するか、
              当サイトの設定からデータを削除するまで保持されます。成績履歴は最大30件まで保存され、
              それを超える場合は古いデータから自動的に削除されます。
            </p>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">3.3 データの削除方法</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              ローカルストレージに保存されたデータは、以下の方法で削除できます：
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                ブラウザの設定から「閲覧履歴データの削除」を実行
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                ブラウザの開発者ツールからローカルストレージを手動で削除
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                当サイトの「記録を保存」機能をOFFにする（履歴のみ削除対象外）
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>ご注意：</strong>ブラウザの設定変更、キャッシュのクリア、プライベートブラウジングモードの使用、
                または端末の変更により、保存されたデータが消失する場合があります。
                重要なデータは別途記録しておくことをお勧めいたします。
              </p>
            </div>
          </section>

          {/* Cookieの使用 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">4. Cookie（クッキー）の使用について</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Cookie（クッキー）とは、ウェブサイトがお使いのブラウザに保存する小さなテキストファイルです。
              当サイトでは、サービスの提供・改善のために必要なCookieと、任意の分析Cookieのみを使用しています。
            </p>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">4.1 使用するCookieの種類</h3>
            
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800">
                  <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] text-white">必須</span>
                  必須Cookie（ファーストパーティ）
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-blue-700">
                  サイトの基本機能に必要なCookieです。Cookie同意の設定状態や、記録保存機能のON/OFF状態を
                  記憶するために使用します。これらのCookieを無効にすると、サイトが正常に動作しない場合があります。
                </p>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="rounded bg-slate-400 px-1.5 py-0.5 text-[10px] text-white">任意</span>
                  分析Cookie（サードパーティ）
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Google Analytics等のアクセス解析ツールが使用するCookieです。サイトの利用状況を匿名で収集し、
                  サービス改善に役立てます。収集されるデータには、ページビュー数、滞在時間、参照元などが含まれます。
                </p>
              </div>
            </div>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">4.2 Cookieの管理方法</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              ユーザーは以下の方法でCookieを管理できます：
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <strong>当サイトのCookie設定：</strong>サイト初回訪問時に表示されるCookie同意画面で設定を選択
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <strong>ブラウザ設定：</strong>各ブラウザの設定画面からCookieの受け入れ・拒否を設定
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <strong>オプトアウト：</strong>各サービス提供元のオプトアウトページを利用
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>ご注意：</strong>必須Cookie以外を無効にしても、当サイトの基本機能はご利用いただけます。
                ただし、一部の機能や表示が制限される場合があります。
              </p>
            </div>
          </section>

          {/* 将来的に導入予定の広告サービス（現在は未使用） */}
          {/* 広告配信と第三者Cookie */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-bold text-slate-800">5. 広告配信と第三者Cookieについて</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトでは、サービス運営費の一部を補填するため、Google AdSense や Amazon アソシエイト 等の第三者広告配信事業者を通じて広告を掲載する場合があります。
            </p>
            <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <h4 className="text-sm font-bold text-orange-800">広告Cookieとパーソナライズ広告</h4>
              <p className="mt-2 text-xs leading-relaxed text-orange-700">
                • Google 等の第三者配信事業者が Cookie を利用して、過去のアクセス情報に基づきパーソナライズ広告を配信する場合があります。<br/>
                • これにより、ユーザーに関連性の高い広告が表示されることがありますが、個人を特定する情報は収集しません。<br/>
                • 広告配信事業者のプライバシーポリシーおよび利用規約が適用されます。
              </p>
            </div>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">5.1 広告Cookieの管理</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              広告Cookieを管理する方法：
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-orange-500">•</span>
                <strong>Cookie同意画面：</strong>広告Cookieの使用を拒否することができます
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500">•</span>
                <strong>Google広告設定：</strong><a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://adssettings.google.com</a>でパーソナライズ広告を管理
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500">•</span>
                ブラウザの設定で「サードパーティCookie」を無効にする
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>ご注意：</strong>広告Cookieを無効にしても、当サイトの基本機能はご利用いただけます。
                ただし、広告の関連性が低下する場合があります。
              </p>
            </div>

            {/* 子ども向け扱いに関する注意 */}
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <h4 className="text-sm font-bold text-red-800 flex items-center gap-2">
                <Users className="h-4 w-4" />
                13歳未満のユーザーに関する特別な配慮
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-red-700">
                当サイトは中学生・高校生を主な利用者として想定していますが、Googleのポリシーでは13歳未満のユーザーに対するパーソナライズ広告は特に注意が必要です。
              </p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-red-700">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <strong>非パーソナライズ広告を基本：</strong>広告を導入する場合、いきなり強いパーソナライズ広告を狙わず、年齢に関わらない一般的な広告を基本とします
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <strong>年齢を特定する情報を取得しない：</strong>氏名、学校名、学年、生年月日などの個人情報は一切収集しません
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <strong>保護者同意の注意喚起：</strong>13歳未満のお子様がご利用される場合は、保護者の方の同意と監督をお願いします
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <strong>Google AdSenseの制限：</strong>Google AdSenseでは13歳未満向けのパーソナライズ広告は禁止されており、技術的に制限されています
                </li>
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-red-600 bg-red-100 rounded p-2">
                <strong>運営者の姿勢：</strong>個人運営として、子どものプライバシー保護を最優先し、安全性を高く設定して運営します。
              </p>
            </div>
          </section>

          {/* アクセス解析 */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">6. アクセス解析ツールについて</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトでは、サービス向上およびユーザー体験の改善を目的として、
              Googleアナリティクス等のアクセス解析ツールを使用しています。
              これらのツールはトラフィックデータを収集するためにCookieを使用しますが、
              このデータは匿名で収集され、個人を特定するものではありません。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              収集される情報には、ページビュー数、セッション時間、使用デバイス、地理的位置（国・地域レベル）、
              参照元URLなどが含まれます。これらの情報は、サイトのコンテンツ改善、
              ユーザビリティの向上、およびサービス品質の維持に活用されます。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Googleアナリティクスのデータ収集を無効にするには、
              <a 
                href="https://tools.google.com/dlpage/gaoptout" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 underline hover:text-blue-700"
              >
                Googleアナリティクス オプトアウト アドオン
                <ExternalLink className="h-3 w-3" />
              </a>
              をブラウザにインストールしてください。
            </p>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs leading-relaxed text-amber-800">
                <strong>広告について：</strong>現在、広告は掲載しておりません。将来的に Google AdSense や Amazon アソシエイト 等の広告配信サービスを導入する場合があります。
              </p>
            </div>
          </section>

          {/* 未成年者のプライバシー */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-bold text-slate-800">6. 未成年者のプライバシーについて</h2>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-purple-800">
                当サイトは主に中学生・高校生を対象としたサービスです。
                18歳未満の方は、保護者の同意を得た上でご利用ください。
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              当サイトは、未成年者のプライバシー保護を特に重視しています。
              13歳未満のお子様から意図的に個人情報を収集することはありません。
              当サイトは個人を特定できる情報を直接収集しませんが、アクセス解析において
              Cookieが使用される場合があります。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              保護者の方へ：お子様が当サイトを利用する際は、本プライバシーポリシーの内容を
              ご確認いただき、Cookieの使用について適切にご判断ください。
              ご不明な点やご懸念がございましたら、お問い合わせページよりご連絡ください。
            </p>
          </section>

          {/* ユーザーの権利 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">7. ユーザーの権利</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              ユーザーは、ご自身のデータに関して以下の権利を有しています：
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                <strong>アクセス権：</strong>お使いの端末に保存されているデータを確認する権利
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                <strong>削除権：</strong>ブラウザ設定からローカルストレージのデータを削除する権利
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                <strong>オプトアウト権：</strong>Cookie同意画面で「必須のみ許可」を選択し、分析Cookieを拒否する権利
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                <strong>情報提供を受ける権利：</strong>データの取り扱いについて説明を求める権利
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              これらの権利の行使に関するご質問は、お問い合わせページよりご連絡ください。
            </p>
          </section>

          {/* プライバシーポリシーの変更 */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">8. プライバシーポリシーの変更について</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトは、法令の改正、サービス内容の変更、その他の理由により、
              必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のポリシーは、本ページに掲載した時点より効力を生じるものとします。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              重要な変更がある場合は、サイト上での告知等により、ユーザーにお知らせするよう努めます。
              定期的に本ページをご確認いただくことをお勧めいたします。
            </p>
            
            {/* 子ども向けポリシーの変更について */}
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <Users className="h-4 w-4" />
                子ども向けポリシーの優先的な変更
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-blue-700">
                子どものプライバシー保護に関する法律やガイドラインが変更された場合、
                その他の変更に優先して本ポリシーを更新し、速やかに告知いたします。
              </p>
            </div>
          </section>

          {/* お問い合わせ */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-500" />
              <h2 className="text-lg font-bold text-slate-800">9. お問い合わせ</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              本プライバシーポリシーに関するご質問、ご意見、苦情、またはデータに関するリクエストは、
              以下の方法でお問い合わせください：
            </p>
            <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm leading-relaxed text-teal-800">
                <strong>お問い合わせフォーム：</strong>
                <Link href="/contact" className="ml-1 text-teal-700 underline hover:text-teal-900">
                  お問い合わせページ
                </Link>
              </p>
              <p className="mt-2 text-xs text-teal-700">
                ※ お問い合わせへの回答には、通常3〜5営業日程度お時間をいただく場合がございます。
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              プライバシーに関するお問い合わせの際は、具体的な内容と、可能であれば関連する状況を
              詳しくお知らせください。迅速かつ適切に対応させていただきます。
            </p>
          </section>

          <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
            最終更新日: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}
