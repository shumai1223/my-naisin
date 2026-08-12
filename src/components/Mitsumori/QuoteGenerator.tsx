'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Printer } from 'lucide-react';

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
      <div className="print:hidden mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-slate-700">宛先の会社名</span>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="例）〇〇株式会社"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-slate-700">ご担当者名（任意）</span>
            <input
              type="text"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="例）〇〇 様"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-semibold text-slate-700">プラン</span>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value as QuotePlan['id'])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            発行者情報（事業者名・所在地）が未設定のため、この見積書はまだ先方へ送付できる状態ではありません。
            <a href="/tokushoho" className="mx-1 font-semibold underline">
              特定商取引法に基づく表記
            </a>
            の設定後にご利用ください。
          </p>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:shadow-lg"
        >
          <Printer className="h-4 w-4" />
          PDFとして保存 / 印刷する
        </button>
        <p className="mt-2 text-xs text-slate-500">
          印刷ダイアログの「送信先」で「PDFに保存」を選ぶとPDFファイルとして保存できます。
        </p>
      </div>

      {/* 見積書本体（印刷対象） */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <h2 className="text-center text-2xl font-bold tracking-widest text-slate-800">御見積書</h2>

        <div className="mt-6 flex items-start justify-between text-sm">
          <div>
            <p className="text-base font-semibold text-slate-800">
              {company ? `${company} 御中` : '＿＿＿＿＿＿＿＿＿ 御中'}
            </p>
            {person && <p className="mt-1 text-slate-600">{person} 様</p>}
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>発行日：{meta?.dateLabel ?? '—'}</p>
            <p>見積番号：{meta?.quoteNo ?? '—'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          <p className="font-semibold text-slate-700">発行者</p>
          <p>{APP_NAME}（{BUSINESS_INFO.sellerName}）</p>
          <p>運営統括責任者：{BUSINESS_INFO.responsiblePerson}</p>
          <p>所在地：{BUSINESS_INFO.address}</p>
        </div>

        <table className="mt-6 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-slate-300 text-xs text-slate-500">
              <th className="py-2 pr-3 font-semibold">品目</th>
              <th className="py-2 pr-3 text-center font-semibold">数量</th>
              <th className="py-2 text-right font-semibold">金額（税込・年額）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-3 pr-3 align-top">
                <p className="font-semibold text-slate-800">
                  My Naishin 内申点データAPI / データライセンス — {plan.label}
                </p>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-500">
                  {plan.features.map((f) => (
                    <li key={f}>・{f}</li>
                  ))}
                </ul>
              </td>
              <td className="py-3 pr-3 text-center align-top">1</td>
              <td className="py-3 text-right align-top font-semibold text-slate-800">{yen(plan.annualPriceJpy)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300">
              <td colSpan={2} className="py-3 pr-3 text-right font-bold text-slate-800">
                合計（税込）
              </td>
              <td className="py-3 text-right text-lg font-bold text-indigo-700">{yen(plan.annualPriceJpy)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 space-y-1 text-xs leading-relaxed text-slate-500">
          <p>お支払い条件：契約時に一括でお支払いいただきます（個別契約書に基づく）。</p>
          <p>見積有効期限：発行日より30日間。</p>
          <p>
            提供条件（年次更新・サポート範囲・稼働率・契約主体等）は
            <a href="/terms" className="mx-1 underline">利用規約</a>
            第2条の3をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
