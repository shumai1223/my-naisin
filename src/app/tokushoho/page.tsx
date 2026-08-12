import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';
import { TIER_POLICIES, formatTierPrice } from '@/lib/api-tiers';
import { BUSINESS_INFO } from '@/lib/business-info';

/**
 * 特定商取引法に基づく表記（T-S13A A-0-1）。
 *
 * 本番`/developers`が既に有償プラン（Pro ¥9,800/月〜）を配信しているにもかかわらず、
 * この法定表記が一件も存在しなかった欠落を是正する（`ops/tasks/T-S13A-databank-product.md` A-0-1）。
 * ⚠️事業者名・所在地・連絡先はPII（個人情報）のため、loopはプレースホルダで枠だけを作る。
 * 実際の値（親権者名義・住所等・2026-08-11 👤裁定）は👤が入れること（C7）。
 */
export default function TokushohoPage() {
  const lastUpdated = '2026年8月12日';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
            <Scale className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">特定商取引法に基づく表記</h1>
            <p className="text-sm text-slate-500">
              {APP_NAME} Developers（
              <Link href="/developers" className="underline">
                API・データプラン
              </Link>
              ）の有償サービスに関する表記です。
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700">
          事業者名・所在地・連絡先（電話番号等）は準備中です。お問い合わせは
          <Link href="/contact" className="mx-1 font-semibold underline">
            お問い合わせフォーム
          </Link>
          からお願いいたします。
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <dl className="divide-y divide-slate-100 text-sm">
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">販売事業者</dt>
              <dd className="text-slate-600 sm:col-span-2">{BUSINESS_INFO.sellerName}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">運営統括責任者</dt>
              <dd className="text-slate-600 sm:col-span-2">{BUSINESS_INFO.responsiblePerson}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">所在地</dt>
              <dd className="text-slate-600 sm:col-span-2">{BUSINESS_INFO.address}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">連絡先</dt>
              <dd className="text-slate-600 sm:col-span-2">
                <Link href="/contact" className="font-semibold text-blue-600 underline">
                  お問い合わせフォーム
                </Link>
                よりご連絡ください（電話番号は準備中）。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">販売価格</dt>
              <dd className="text-slate-600 sm:col-span-2">
                <ul className="space-y-1">
                  <li>{TIER_POLICIES.pro.label}: {formatTierPrice('pro')}（税込・月額・サブスクリプション・非商用）</li>
                  <li>{TIER_POLICIES.business.label}: {formatTierPrice('business')}（税込・年額契約・商用可）</li>
                  <li>{TIER_POLICIES.scale.label}: {formatTierPrice('scale')}（データライセンス・年額契約・オプション加算あり）</li>
                </ul>
                詳細は
                <Link href="/developers" className="mx-1 font-semibold text-blue-600 underline">
                  Developers
                </Link>
                ページの料金表をご確認ください。Business・Enterpriseの
                <Link href="/mitsumori" className="mx-1 font-semibold text-blue-600 underline">
                  見積書
                </Link>
                もその場で作成できます。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">商品代金以外の必要料金</dt>
              <dd className="text-slate-600 sm:col-span-2">
                なし（消費税は表示価格に含みます）。決済手数料等の追加費用はありません。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">お支払い方法</dt>
              <dd className="text-slate-600 sm:col-span-2">
                クレジットカード決済（Stripe）。法人のお客様向けの請求書払い・銀行振込については
                <Link href="/contact" className="mx-1 font-semibold text-blue-600 underline">
                  お問い合わせ
                </Link>
                ください。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">お支払い時期</dt>
              <dd className="text-slate-600 sm:col-span-2">
                月額プラン（Pro）はクレジットカード決済の場合、お申し込み時点で初回課金し、以後は毎月同日に自動課金されます。
                年額プラン（Business・Enterprise）は個別契約書に基づき、契約時に一括でお支払いいただきます。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">サービス提供時期</dt>
              <dd className="text-slate-600 sm:col-span-2">
                決済完了後、直ちにAPIキーを自動発行しご利用いただけます（メール通知あり）。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">解約・返金について</dt>
              <dd className="text-slate-600 sm:col-span-2">
                月額プランはいつでも解約可能で、解約後は次回請求が発生しません（日割り返金は行いません）。
                サービスの性質上、お支払い済みの当月分の返金には対応いたしかねます。
                年額データライセンス契約の解約条件は個別契約書に定めます。
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-slate-700">動作環境</dt>
              <dd className="text-slate-600 sm:col-span-2">
                インターネット接続環境。APIはHTTPS経由でご利用のシステムから直接呼び出してください。
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
          最終更新日: {lastUpdated}
        </div>
      </div>
    </div>
  );
}
