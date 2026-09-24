import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isNendomatsuPackEnabled } from '@/lib/nendomatsu-pack-flag';
import {
  NENDOMATSU_PACK,
  displayPriceLabel,
  getDeliverablePrefectures,
  isPriceConfirmed,
} from '@/lib/nendomatsu-pack';
import { r9Baseline } from '@/lib/nendomatsu-pack-schedule';

/**
 * T-TD1 TD-8: 令和9年度 倍率速報「年度末パック」の商品ページ（build-not-launch）。
 * NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED='1'（既定off）のときだけ表示する。noindex・sitemap除外・
 * どこからもリンクしない。価格は src/data/nendomatsu-pack-pricing.json の1か所から差し込む
 * （👤の確定待ちの間は「確定待ち」と表示）。点火（env変更）は👤のみ。
 */
export const metadata: Metadata = {
  title: `${NENDOMATSU_PACK.productName} | My Naishin`,
  description: '各県教育委員会が公表する公立高校の出願状況（学校・学科別の募集人員・出願者数・倍率）を、公表後にCSV/JSONで納品する買い切り商品のご案内。',
  robots: { index: false, follow: false },
};

export default function NendomatsuPackPage() {
  if (!isNendomatsuPackEnabled(process.env.NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED)) {
    notFound();
  }

  const deliverables = getDeliverablePrefectures();
  const priceConfirmed = isPriceConfirmed();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">{NENDOMATSU_PACK.productName}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            提供: {NENDOMATSU_PACK.issuer}（契約名義人: {NENDOMATSU_PACK.contractHolder}）
          </p>
          {!priceConfirmed && (
            <p
              data-testid="price-pending-banner"
              className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900"
            >
              価格は確定していません（確定待ち）。このページは内部確認用で、公開されていません。
            </p>
          )}
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-base font-bold text-slate-900">何が、どの作業に置き換わるか</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            毎年2月に、各県教育委員会が公表する公立高校の出願状況（学校・学科ごとの募集人員・出願者数・倍率）のPDFを追って手作業で転記している作業を、
            県の公表後に、Excelで開けるCSVとシステム取り込み用のJSONで納品します。
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            倍率は県の公表値の転記で、こちらで計算し直していません。全行に県教育委員会の公表資料のURL（出典）が付きます。独自の推計・予測は一切含みません。
          </p>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 pb-2">
            <h2 className="text-base font-bold text-slate-900">いつ、どの県が届くか（納品予定表）</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              県教育委員会から「出典を明記すれば掲載してよい」との回答を書面で得ている県のうち、当方の体制で反映できる県のみです（現在 {deliverables.length} 県）。
              この表にない県は納品しません。許諾が確認でき次第、追加をご案内します。
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2">県</th>
                <th className="px-3 py-2">令和9年度の志願変更の締切（県の日程に基づく目安）</th>
                <th className="px-3 py-2">納品の目安（案）</th>
              </tr>
            </thead>
            <tbody>
              {deliverables.map((d) => {
                const base = r9Baseline(d.code);
                return (
                  <tr key={d.code} className="border-t border-slate-100" data-testid="delivery-row">
                    <td className="px-3 py-2 font-medium text-slate-900">{d.name}</td>
                    <td className="px-3 py-2 text-slate-700">{base.date ? `${base.date.replace(/-/g, '/')}（目安）` : 'R9日程の公表待ち'}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {d.deliveryClass === 'A' ? NENDOMATSU_PACK.deliveryPromise.A : NENDOMATSU_PACK.deliveryPromise.B}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="p-4 pt-2 text-xs leading-relaxed text-slate-500">
            納品の目安は県の公表を起点にした営業日ベースの案で、実測前です。県の公表日・公表方法が変わった場合は速やかにご連絡し、日程を再提示します。県が公表しない場合は納品できません。
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-base font-bold text-slate-900">価格・お支払い</h2>
          <dl className="text-sm text-slate-700">
            <div className="flex gap-3 border-b border-slate-100 py-2">
              <dt className="w-24 shrink-0 font-medium text-slate-900">価格</dt>
              <dd data-testid="price-label">{displayPriceLabel()}（買い切り）</dd>
            </div>
            <div className="flex gap-3 border-b border-slate-100 py-2">
              <dt className="w-24 shrink-0 font-medium text-slate-900">お支払い</dt>
              <dd>請求書払い・支払期限 {NENDOMATSU_PACK.paymentDeadline}</dd>
            </div>
            <div className="flex gap-3 py-2">
              <dt className="w-24 shrink-0 font-medium text-slate-900">インボイス</dt>
              <dd>{NENDOMATSU_PACK.invoiceNotice}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-base font-bold text-slate-900">利用条件・正確性</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
            <li>社内利用、および貴社の紙面・模試資料・塾内資料・自社サイトへの掲載は可。出典として各県教育委員会を明記してください。</li>
            <li>データそのものの再販売・第三者への再配布は不可です。</li>
            <li>転記誤りは無償で訂正・再納品します。県が訂正版を公表した場合は、訂正版を反映して再納品します（訂正履歴つき）。</li>
            <li>利用条件は案であり、契約時に双方で確認します。</li>
          </ul>
          <p className="mt-3 text-sm text-slate-700">
            サンプル（令和8年度の確定値・千葉/長野/秋田）と仕様書をご希望の方は、naishin.dev@gmail.com までご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
