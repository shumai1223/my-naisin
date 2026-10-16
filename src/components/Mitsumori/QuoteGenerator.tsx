'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Printer } from '@/components/icons';

import { BUSINESS_INFO, isBusinessInfoPending } from '@/lib/business-info';
import { QUOTE_PLANS, type QuotePlan } from '@/lib/quote-plans';
import { APP_NAME } from '@/lib/constants';

function yen(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`;
}

/** 発行日・見積番号は印刷のたびに変わってよい表示専用の値。SSRとの不一致を避けるためマウント後にのみ確定する。 */
function useIssuedMeta() {
  const [meta, setMeta] = useState<{ dateLabel: string; quoteNo: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    const serial = Math.floor(Math.random() * 9000 + 1000);
    setMeta({
      dateLabel: `${y}年${m}月${d}日`,
      quoteNo: `Q-${y}${pad(m)}${pad(d)}-${serial}`,
    });
  }, []);
  return meta;
}

export function QuoteGenerator() {
  const [company, setCompany] = useState('');
  const [person, setPerson] = useState('');
  const [planId, setPlanId] = useState<QuotePlan['id']>('business');
  const meta = useIssuedMeta();
  const plan = QUOTE_PLANS.find((p) => p.id === planId) ?? QUOTE_PLANS[0];
  const pending = isBusinessInfoPending();

  return (
    <div>
      {/* 入力フォーム（印刷時は非表示） */}
      <div className="print:hidden mb-8 rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-bold text-slate-900">宛先の会社名</span>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="例）〇〇株式会社"
              className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-bold text-slate-900">ご担当者名（任意）</span>
            <input
              type="text"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="例）〇〇 様"
              className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-bold text-slate-900">プラン</span>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value as QuotePlan['id'])}
              className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900"
            >
              {QUOTE_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}（年額 {yen(p.annualPriceJpy)}）
                </option>
              ))}
            </select>
          </label>
        </div>

        {pending && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-[1.8] text-amber-900">
            <p className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1">
              発行者情報（事業者名・所在地）が未設定のため、この見積書はまだ先方へ送付できる状態ではありません。
              <a href="/tokushoho" className="mx-1 font-bold underline underline-offset-2">
                特定商取引法に基づく表記
              </a>
              の設定後にご利用ください。
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800"
        >
          <Printer className="h-4 w-4" />
          PDFとして保存 / 印刷する
        </button>
        <p className="mt-3 text-sm text-slate-600">
          印刷ダイアログの「送信先」で「PDFに保存」を選ぶとPDFファイルとして保存できます。
        </p>
      </div>

      {/* 見積書本体（印刷対象） */}
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 print:rounded-none print:border-0 print:p-0">
        <h2 className="text-center text-2xl font-bold text-slate-900">御見積書</h2>

        <div className="mt-6 flex items-start justify-between text-sm">
          <div>
            <p className="text-base font-bold text-slate-900">
              {company ? `${company} 御中` : '＿＿＿＿＿＿＿＿＿ 御中'}
            </p>
            {person && <p className="mt-1 text-slate-600">{person} 様</p>}
          </div>
          <div className="text-right text-xs text-slate-600">
            <p>発行日：{meta?.dateLabel ?? '—'}</p>
            <p>見積番号：{meta?.quoteNo ?? '—'}</p>
          </div>
        </div>

        <div className="mt-6 border-y border-slate-200 py-4 text-sm leading-[1.8] text-slate-600">
          <p className="font-bold text-slate-900">発行者</p>
          <p>{APP_NAME}（{BUSINESS_INFO.sellerName}）</p>
          <p>運営統括責任者：{BUSINESS_INFO.responsiblePerson}</p>
          <p>所在地：{BUSINESS_INFO.address}</p>
        </div>

        <table className="mt-6 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-900 text-xs text-slate-600">
              <th scope="col" className="py-2 pr-3 font-bold">品目</th>
              <th scope="col" className="py-2 pr-3 text-center font-bold">数量</th>
              <th scope="col" className="py-2 text-right font-bold">金額（税込・年額）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-3 pr-3 align-top">
                <p className="font-bold text-slate-900">
                  My Naishin 内申点データAPI / データライセンス — {plan.label}
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f}>・{f}</li>
                  ))}
                </ul>
              </td>
              <td className="py-3 pr-3 text-center align-top tabular-nums">1</td>
              <td className="py-3 text-right align-top font-bold tabular-nums text-slate-900">{yen(plan.annualPriceJpy)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-900">
              <td colSpan={2} className="py-3 pr-3 text-right font-bold text-slate-900">
                合計（税込）
              </td>
              <td className="py-3 text-right text-lg font-bold tabular-nums text-brand-700">{yen(plan.annualPriceJpy)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 space-y-1 text-sm leading-[1.8] text-slate-600">
          <p>お支払い条件：契約時に一括でお支払いいただきます（個別契約書に基づく）。</p>
          <p>見積有効期限：発行日より30日間。</p>
          <p>
            提供条件（年次更新・サポート範囲・稼働率・契約主体等）は
            <a href="/terms" className="mx-1 text-brand-700 underline underline-offset-2 hover:text-brand-800">利用規約</a>
            第2条の3をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
