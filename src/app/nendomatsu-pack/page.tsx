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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">{NENDOMATSU_PACK.productName}</h1>
          <p className="mt-2 text-sm text-slate-600">
            提供: {NENDOMATSU_PACK.issuer}（契約名義人: {NENDOMATSU_PACK.contractHolder}）
          </p>
          {!priceConfirmed && (
            <p
              data-testid="price-pending-banner"
              className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-[1.8] text-amber-900"
            >
              価格は確定していません（確定待ち）。このページは内部確認用で、公開されていません。
            </p>
          )}
        </header>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold text-slate-900">何が、どの作業に置き換わるか</h2>
          <p className="text-base leading-[1.8] text-slate-900">
            毎年2月に、各県教育委員会が公表する公立高校の出願状況（学校・学科ごとの募集人員・出願者数・倍率）のPDFを追って手作業で転記している作業を、
            県の公表後に、Excelで開けるCSVとシステム取り込み用のJSONで納品します。
          </p>
          <p className="mt-3 text-base leading-[1.8] text-slate-900">
            倍率は県の公表値の転記で、こちらで計算し直していません。全行に県教育委員会の公表資料のURL（出典）が付きます。独自の推計・予測は一切含みません。
          </p>
        </section>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white">
          <div className="p-5 pb-3">
            <h2 className="text-xl font-bold text-slate-900">いつ、どの県が届くか（納品予定表）</h2>
            <p className="mt-2 text-sm leading-[1.8] text-slate-600">
              県教育委員会から「出典を明記すれば掲載してよい」との回答を書面で得ている県のうち、当方の体制で反映できる県のみです（現在 {deliverables.length} 県）。
              この表にない県は納品しません。許諾が確認でき次第、追加をご案内します。
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                  <th className="py-2 pl-5 pr-3">県</th>
                  <th className="px-3 py-2">令和9年度の志願変更の締切（県の日程に基づく目安）</th>
                  <th className="py-2 pl-3 pr-5">納品の目安（案）</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map((d) => {
                  const base = r9Baseline(d.code);
                  return (
                    <tr key={d.code} className="border-b border-slate-200 last:border-b-0" data-testid="delivery-row">
                      <td className="py-2 pl-5 pr-3 text-slate-900">{d.name}</td>
                      <td className="px-3 py-2 tabular-nums text-slate-900">{base.date ? `${base.date.replace(/-/g, '/')}（目安）` : 'R9日程の公表待ち'}</td>
                      <td className="py-2 pl-3 pr-5 text-slate-900">
                        {d.deliveryClass === 'A' ? NENDOMATSU_PACK.deliveryPromise.A : NENDOMATSU_PACK.deliveryPromise.B}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-200 p-5 text-sm leading-[1.8] text-slate-600">
            納品の目安は県の公表を起点にした営業日ベースの案で、実測前です。県の公表日・公表方法が変わった場合は速やかにご連絡し、日程を再提示します。県が公表しない場合は納品できません。
          </p>
        </section>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold text-slate-900">価格・お支払い</h2>
          <dl className="text-base text-slate-900">
            <div className="flex gap-3 border-b border-slate-200 py-2">
              <dt className="w-24 shrink-0 font-bold">価格</dt>
              <dd data-testid="price-label">{displayPriceLabel()}（買い切り）</dd>
            </div>
            <div className="flex gap-3 border-b border-slate-200 py-2">
              <dt className="w-24 shrink-0 font-bold">お支払い</dt>
              <dd>請求書払い・支払期限 {NENDOMATSU_PACK.paymentDeadline}</dd>
            </div>
            <div className="flex gap-3 py-2">
              <dt className="w-24 shrink-0 font-bold">インボイス</dt>
              <dd>{NENDOMATSU_PACK.invoiceNotice}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold text-slate-900">利用条件・正確性</h2>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
            <li>社内利用、および貴社の紙面・模試資料・塾内資料・自社サイトへの掲載は可。出典として各県教育委員会を明記してください。</li>
            <li>データそのものの再販売・第三者への再配布は不可です。</li>
            <li>転記誤りは無償で訂正・再納品します。県が訂正版を公表した場合は、訂正版を反映して再納品します（訂正履歴つき）。</li>
            <li>利用条件は案であり、契約時に双方で確認します。</li>
          </ul>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            サンプル（令和8年度の確定値・千葉/長野/秋田）と仕様書をご希望の方は、naishin.dev@gmail.com までご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
