import Link from 'next/link';
import { ChevronRight, Home, BookOpen, AlertCircle, ExternalLink, Info, Network, ListOrdered, HelpCircle, CheckCircle2 } from 'lucide-react';

import type { TotalScoreExplainer } from '@/lib/total-score/types';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { HensachiPromo } from '@/components/HensachiPromo';

const BASE = 'https://my-naishin.com';

const METHOD_LABEL: Record<TotalScoreExplainer['method'], string> = {
  相関図: '相関図方式',
  相関表: '相関表方式',
  割合方式: '割合（比重）方式',
  段階選抜: '段階選抜方式',
  校別比重: '学校別比重方式',
  総合判断: '総合判断方式',
};

/**
 * 第2層県の解説ページ（計算機なし）。
 * 「なぜ単純な合計点で合否が出ないか」を正直に解説する＝独自コンテンツ＝信頼の堀。
 */
export function TotalScoreExplainerView({ explainer: e }: { explainer: TotalScoreExplainer }) {
  const offer = selectLeadOffer({ prefectureCode: e.code, placement: 'prefecture' });
  const url = `${BASE}/${e.code}/total-score`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${BASE}/` },
          { name: e.name, url: `${BASE}/${e.code}` },
          { name: '総合得点・合否の仕組み', url },
        ]}
      />
      {e.faqs.length > 0 && (
        <FAQPageSchema faqItems={e.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      )}

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${e.code}`} className="hover:text-blue-600">
              {e.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">総合得点・合否の仕組み</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl">
              <Network className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {e.name}公立高校 総合得点・合否の仕組み
            </h1>
            <div className="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
              {METHOD_LABEL[e.method]}・{e.fiscalYear}年度（令和8年度）入試対応
            </div>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              {e.name}の公立高校入試（{e.localTerm}）は、内申点と当日点を単純に足し算して合否が決まる方式ではありません。
              <br />
              このページでは、配点と「どう合否が決まるか」を一次情報に基づいて正確に解説します。
            </p>
          </header>

          {/* 制度概要（本文・SEO/GEO） */}
          <section className="mb-8 rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
            <p className="leading-loose text-slate-700">{e.overview}</p>
          </section>

          {/* なぜ計算機が無いか（正直な説明＝信頼の堀） */}
          <section className="mb-8 rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-violet-500" />
              なぜ「合計点」で合否が出ないのか
            </h2>
            <p className="leading-relaxed text-slate-700">{e.composition}</p>
            <p className="mt-3 rounded-lg border border-violet-100 bg-white p-3 text-sm text-slate-600">
              <strong className="text-violet-700">判定：</strong>
              {e.tier2Reason}
              <br />
              そのため当サイトでは、不正確な合計点で誤解を与えないよう、{e.name}は計算機ではなく仕組みの解説を提供しています。
            </p>
          </section>

          {/* 配点の内訳 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {e.name}の配点
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="mb-1 font-bold text-slate-800">学力検査（当日点）</h3>
                <p className="leading-relaxed text-slate-700">
                  {e.academic.subjects}教科
                  {e.academic.rawMax ? `・${e.academic.rawMax}点満点` : ''}
                  {e.academic.perSubjectMax ? `（各${e.academic.perSubjectMax}点）` : ''}
                  。{e.academic.weightingNote ?? e.academic.note ?? ''}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-bold text-slate-800">内申点（調査書）</h3>
                <p className="leading-relaxed text-slate-700">
                  対象：中{e.report.targetGrades.join('・中')}年
                  {e.report.rawMax ? `・${e.report.rawMax}点満点` : ''}。{e.report.note}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  内申点そのものは
                  <Link href={`/${e.code}/naishin`} className="font-bold text-blue-600 underline">
                    {e.name}の内申点計算ツール
                  </Link>
                  で正確に算出できます。
                </p>
              </div>
              {e.others && (
                <div>
                  <h3 className="mb-1 font-bold text-slate-800">その他の検査</h3>
                  <p className="leading-relaxed text-slate-700">{e.others}</p>
                </div>
              )}
            </div>
            {e.caveat && (
              <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
                ※ {e.caveat}
              </p>
            )}
          </section>

          {/* 合否決定の流れ（番号付きフロー＝独自コンテンツ） */}
          {e.flow.length > 0 && (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <ListOrdered className="h-5 w-5 text-violet-500" />
                {e.name}の合否が決まるまでの流れ
              </h2>
              <ol className="space-y-3">
                {e.flow.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 受験生が今できること */}
          {e.whatToDo && e.whatToDo.length > 0 && (
            <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                合計点が出せない代わりに、今できること
              </h2>
              <ul className="space-y-2">
                {e.whatToDo.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 結果保存・名簿化（堀A） */}
          <SaveResultCTA
            source="prefecture"
            prefectureCode={e.code}
            prefectureName={e.name}
            className="mt-6"
            heading={`${e.name}の入試情報を、受験本番まで受け取りませんか？`}
            body="出願スケジュール・内申点アップのコツ・志望校の動向を無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

          {/* 偏差値クラスタへ評価を集約（稼ぎ頭 /hensachi の文脈内部リンク） */}
          <HensachiPromo className="mt-8" />

          {/* 保護者向けリード（換金の本命） */}
          <ParentLeadCTA
            className="mt-8"
            heading={offer.heading}
            body={offer.body}
            affiliateId={offer.affiliateId}
            ctaText={offer.ctaText}
            note={offer.note}
          />

          {/* 出典 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-800">
                本ページの内容は{e.source.docTitle}に基づきます。比重・配点は学校・学科・年度により異なります。学校別の合格ボーダーは掲載していません。最新の情報は
                <a href={e.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-amber-900 underline">
                  {e.name}教育委員会の公式情報
                  <ExternalLink className="h-3 w-3" />
                </a>
                でご確認ください（最終確認：{e.source.lastChecked}）。
              </p>
            </div>
          </div>

          {/* よくある質問（FAQ・県固有） */}
          {e.faqs.length > 0 && (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <HelpCircle className="h-5 w-5 text-violet-500" />
                {e.name}の入試 よくある質問
              </h2>
              <div className="space-y-4">
                {e.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="mb-2 flex gap-2 text-sm font-bold text-slate-800">
                      <span className="text-violet-600">Q.</span>
                      {f.q}
                    </h3>
                    <p className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <span className="font-bold text-emerald-600">A.</span>
                      <span>{f.a}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={`/${e.code}/naishin`} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">{e.name}の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href={`/${e.code}`} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">{e.name}の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">評定平均を自動計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
