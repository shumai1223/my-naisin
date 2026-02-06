'use client';

import { AlertTriangle, ArrowLeft, Info, CheckCircle, XCircle, Shield, ExternalLink, Database, Mail } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

export default function DisclaimerPage() {
  const lastUpdated = '2026年2月4日';

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
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200">
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">免責事項</h1>
            <p className="text-sm text-slate-500">Disclaimer</p>
          </div>
        </div>

        {/* Important Notice Box */}
        <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            重要なお知らせ
          </h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex gap-2">
              <span className="text-amber-500">⚠</span>
              <span>計算結果はあくまで<strong>目安</strong>です。進路決定は必ず学校の先生にご相談ください</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">⚠</span>
              <span>内申点の計算方法は都道府県・学校によって異なる場合があります</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">⚠</span>
              <span>保存データはブラウザ内のみに保存され、端末変更やキャッシュ削除で消失する可能性があります</span>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          
          {/* はじめに */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">1. はじめに</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {APP_NAME}（以下「当サイト」）をご利用いただく前に、以下の免責事項を注意深くお読みください。
              本免責事項は、当サイトの利用に関する重要な法的情報を含んでいます。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              当サイトにアクセスし、サービスを利用された時点で、ユーザーは本免責事項のすべての条項を
              読み、理解し、同意したものとみなされます。本免責事項に同意いただけない場合は、
              当サイトのご利用をお控えください。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              当サイトは、中学生・高校生およびその保護者の方々に、内申点計算の目安を提供することを
              目的とした無料のWebアプリケーションです。教育目的で提供されており、
              いかなる法的助言や専門的な教育相談を構成するものではありません。
            </p>
          </section>

          {/* 計算結果について */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800">2. 計算結果について</h2>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-amber-800">
                当サイトで提供する内申点の計算結果は、あくまで<strong>参考値・目安</strong>としてご利用ください。
                実際の内申点とは異なる場合があります。
              </p>
            </div>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">2.1 計算方式の違いについて</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              日本の公立高校入試における内申点の計算方法は、都道府県ごとに異なります。
              当サイトでは全国47都道府県の計算方式に対応していますが、
              これらはあくまで代表的な計算方法の例示であり、すべての地域・学校に適用されるものではありません。
            </p>
            
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                内申点の計算方法は、都道府県・地域・学校によって大きく異なる場合があります
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                当サイトの計算結果と、学校から通知される実際の内申点が異なる可能性があります
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                一部の地域では、学年によって重み付けが異なる場合があります
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                特別活動、部活動、出欠状況などが考慮される場合がありますが、当サイトでは対応していません
              </li>
            </ul>
            
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">2.2 進路決定に関するご注意</h3>
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-blue-800">
                <strong>重要：</strong>進路決定の際は、必ず在籍する学校の先生、進路指導担当者、
                または教育委員会にご相談ください。当サイトの計算結果のみを根拠に進路を決定することは
                お控えください。
              </p>
            </div>
          </section>

          {/* 情報の正確性 */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">3. 情報の正確性について</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトに掲載されている情報は、可能な限り正確かつ最新の情報を提供するよう努めておりますが、
              その正確性、完全性、有用性、信頼性を保証するものではありません。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              掲載情報は予告なく変更、修正、または削除される場合があります。
              当サイトの情報に依拠したことにより生じた損害について、当サイトは責任を負いません。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              内申点の計算方法や入試制度は、文部科学省や各都道府県教育委員会の方針変更により
              変更される可能性があります。最新かつ正確な情報については、必ず公式の情報源をご確認ください。
            </p>
          </section>

          {/* 損害について */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-slate-800">4. 損害賠償の制限</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトの利用により生じた損害、または当サイトを利用できなかったことにより生じた損害について、
              当サイト運営者は、法令に別段の定めがある場合を除き、一切の責任を負いません。
              これには以下が含まれますが、これらに限定されません：
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                計算結果に基づく進路決定による直接的・間接的損害
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                サービスの中断、遅延、停止、または終了による損害
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                ブラウザ設定の変更、キャッシュ削除、端末の変更等により、ローカルストレージに保存されたデータ（入力内容・保存履歴・メモ等）が消失することによる損害
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                システム障害、バグ、または不具合による損害
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                第三者からの請求に基づく損害
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">•</span>
                不正アクセス、ウイルス感染等による損害
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs leading-relaxed text-slate-600">
                上記の免責は、当サイト運営者の故意または重大な過失による損害には適用されません。
                また、消費者契約法その他の強行法規に反しない範囲で適用されます。
              </p>
            </div>
          </section>

          {/* データの保存と消失 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">5. データの保存と消失について</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトでは、ユーザーの利便性向上のため、入力データや保存履歴をブラウザのローカルストレージに
              保存する機能を提供しています。これらのデータは以下の場合に消失する可能性があります：
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                ブラウザのキャッシュ・履歴をクリアした場合
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                ブラウザのプライベートモード（シークレットモード）で利用した場合
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                異なる端末やブラウザからアクセスした場合
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                ブラウザのアップデートや設定変更を行った場合
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                ストレージ容量が不足した場合
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>重要：</strong>保存されたデータの消失について、当サイトは一切の責任を負いません。
                重要な情報は、スクリーンショットやメモなど、別の方法で記録しておくことを強くお勧めします。
              </p>
            </div>
          </section>

          {/* 外部リンク */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800">6. 外部リンクについて</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトから外部サイトへのリンクが含まれる場合がありますが、
              リンク先のサイトの内容、正確性、安全性、プライバシーポリシーについて、
              当サイトは一切の責任を負いません。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              外部リンクをクリックする際は、リンク先のサイトの利用規約・プライバシーポリシーを
              ご確認の上、ご自身の責任においてご利用ください。
              リンクの設置は、リンク先のサイトを推奨・支持するものではありません。
            </p>
          </section>

          {/* 広告について */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">7. 広告について</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトでは、運営費用の一部を賄うため、将来的にGoogle AdSenseやAmazonアソシエイト等の
              広告配信サービスを利用する場合があります。
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                広告によって表示される商品やサービスについて、当サイトは品質、安全性、
                適法性を保証するものではありません
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                広告のクリックや商品購入は、ユーザーご自身の責任において行ってください
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                広告に関連する取引上のトラブルについて、当サイトは一切関与いたしません
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              未成年者の方は、広告をクリックする前や商品を購入する前に、
              必ず保護者の方に相談してください。
            </p>
          </section>

          {/* 著作権 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-bold text-slate-800">8. 知的財産権について</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトに掲載されているすべてのコンテンツ（テキスト、画像、グラフィック、
              ロゴ、アイコン、ソフトウェア、ソースコード等）の著作権およびその他の知的財産権は、
              当サイト運営者または正当な権利を有する第三者に帰属します。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              以下の行為は、事前の書面による許可なく禁止されています：
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                コンテンツの複製、転載、改変、再配布
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                商業目的での利用
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                リバースエンジニアリングやソースコードの抽出
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              ただし、SNS等でのシェア機能を通じた共有は歓迎いたします。
              引用の際は、適切な出典表記をお願いいたします。
            </p>
          </section>

          {/* 推奨環境 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">9. 推奨環境</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトは以下の環境での動作を推奨しています。推奨環境以外でのご利用は、
              正常に動作しない可能性があります。
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <h4 className="text-xs font-bold text-emerald-800">推奨ブラウザ</h4>
                <ul className="mt-2 space-y-1 text-xs text-emerald-700">
                  <li>• Google Chrome（最新版）</li>
                  <li>• Safari（最新版）</li>
                  <li>• Firefox（最新版）</li>
                  <li>• Microsoft Edge（最新版）</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <h4 className="text-xs font-bold text-emerald-800">必要な設定</h4>
                <ul className="mt-2 space-y-1 text-xs text-emerald-700">
                  <li>• JavaScript：有効</li>
                  <li>• Cookie：有効</li>
                  <li>• ローカルストレージ：有効</li>
                  <li>• 画面幅：320px以上</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 免責事項の変更 */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">10. 免責事項の変更について</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              当サイトは、法令の改正、サービス内容の変更、その他必要に応じて、
              本免責事項を予告なく変更することがあります。
              変更後の免責事項は、本ページに掲載した時点より効力を生じるものとします。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              重要な変更がある場合は、サイト上での告知等により、ユーザーにお知らせするよう努めます。
              定期的に本ページをご確認いただくことをお勧めいたします。
            </p>
          </section>

          {/* お問い合わせ */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-500" />
              <h2 className="text-lg font-bold text-slate-800">11. お問い合わせ</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              本免責事項に関するご質問、ご意見、苦情は、以下の方法でお問い合わせください：
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
          </section>

          <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
            最終更新日: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}
