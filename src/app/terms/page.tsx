import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

export default function TermsPage() {
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
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">利用規約</h1>
            <p className="text-sm text-slate-500">Terms of Service</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第1条（適用）</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              本規約は、{APP_NAME}（以下「本サービス」）の利用に関する条件を定めるものです。
              ユーザーは本規約に同意した上で本サービスをご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第2条（サービス内容）</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              本サービスは、中高生の内申点を計算し、目標設定や学習サポートを提供するWebアプリケーションです。
              一般利用者向けの機能は無料で提供します。計算結果はあくまで目安であり、実際の内申点は学校・地域によって異なる場合があります。
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              このほか、法人・開発者向けにAPI・データの有償プラン（
              <Link href="/developers" className="mx-1 font-semibold text-blue-600 underline">
                Developers
              </Link>
              ページ参照）を提供しています。有償プランの価格・支払方法・提供時期・解約条件等は
              <Link href="/tokushoho" className="mx-1 font-semibold text-blue-600 underline">
                特定商取引法に基づく表記
              </Link>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第2条の2（端末内への保存）</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              本サービスでは、利便性向上のため、入力内容や設定、ならびにユーザーが保存機能をONにした場合の成績履歴（保存日時・任意のメモ）を、
              お使いの端末のブラウザ内（ローカルストレージ等）に保存することがあります。
              これらのデータは当サイトのサーバーに送信されることはありません。
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              端末内に保存されたデータは、ブラウザ設定の変更やキャッシュ削除等により消失する場合があります。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第2条の3（有償プランの提供条件）</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              法人・開発者向け有償プラン（Pro・Business・Enterprise）については、以下の条件で提供します。
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">年次更新：</strong>
                  各都道府県教育委員会が翌年度の入学者選抜実施要項を公表してから60日以内に、本サービスのデータへ反映します。
                  反映の対象は教育委員会が公表した資料に基づく変更のみとし、非公表の運用や学校ごとの内規は対象としません。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">サポート：</strong>
                  お問い合わせには原則として平日2営業日以内にメールで回答します。電話サポート・オンサイト対応は行っておりません。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">稼働率：</strong>
                  稼働率について契約上の保証（SLA）は行いません。過去の稼働実績は別途公開する運用とし、
                  数値の保証・違約金の対象とはしません。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">障害発生時の対応：</strong>
                  障害等によりサービスが停止した場合、返金・減額は行わず、停止時間分だけ契約期間を延長する対応を基本とします。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">データの正確性：</strong>
                  提供するデータには出典（都道府県教育委員会等の公表資料）のURLを付与し、第三者が検証できる状態を維持します。
                  誤りが確認された場合は、報告を受けてから5営業日以内の訂正に努めます。ただし誤りが皆無であることを保証するものではありません。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">Proプランでの商用利用：</strong>
                  Proプラン（月額¥9,800）は非商用利用を前提としています。第三者への提供等の商用利用が判明した場合、
                  Businessプラン相当額を遡って請求する場合があります。
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong className="text-slate-700">契約主体：</strong>
                  年額プラン（Business・Enterprise）の契約主体は、運営者（未成年）の親権者名義とします。
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第3条（免責事項）</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                本サービスの計算結果に基づく進路決定について、当方は一切の責任を負いません。
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                サービスの中断・終了により生じた損害について責任を負いません。
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                実際の進路相談は、学校の先生や専門家にご相談ください。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第4条（禁止事項）</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                本サービスの不正利用や、他のユーザーへの迷惑行為
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                サーバーへの過度なアクセスや攻撃行為
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                その他、運営が不適切と判断する行為
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">第5条（規約の変更）</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              本規約は予告なく変更される場合があります。
              変更後の規約は、本ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
            最終更新日: 2026-08-13
          </div>
        </div>
      </div>
    </div>
  );
}
