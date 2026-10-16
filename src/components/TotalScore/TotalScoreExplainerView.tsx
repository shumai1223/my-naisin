import Link from 'next/link';
import { ChevronRight, Home, AlertCircle } from '@/components/icons';

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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/${e.code}`}
              className="inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              {e.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">総合得点・合否の仕組み</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {e.name}公立高校 総合得点・合否の仕組み
            </h1>
            <p className="mt-2 text-sm leading-[1.7] text-slate-600">
              {METHOD_LABEL[e.method]}・{e.fiscalYear}年度（令和8年度）入試対応 ／ 出典：
              <a
                href={e.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {e.source.docTitle}
              </a>
              {' '}／ 最終確認：{e.source.lastChecked}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              {e.name}の公立高校入試（{e.localTerm}）は、<strong>内申点と当日点を単純に足し算して合否が決まる方式ではありません。</strong>
              <br />
              このページでは、配点と「どう合否が決まるか」を一次情報に基づいて正確に解説します。
            </p>
          </header>

          {/* 制度概要（本文・SEO/GEO） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-base leading-[1.8] text-slate-900">{e.overview}</p>
          </section>

          {/* なぜ計算機が無いか（正直な説明＝信頼の堀） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">なぜ「合計点」で合否が出ないのか</h2>
            <p className="text-base leading-[1.8] text-slate-900">{e.composition}</p>
            <p className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-[1.8] text-slate-900">
              <strong>判定：</strong>
              {e.tier2Reason}
              <br />
              そのため当サイトでは、不正確な合計点で誤解を与えないよう、{e.name}は計算機ではなく仕組みの解説を提供しています。
            </p>
          </section>

          {/* 配点の内訳 */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{e.name}の配点</h2>
            <div className="space-y-5">
              <div>
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">学力検査（当日点）</h3>
                <p className="text-base leading-[1.8] text-slate-900">
                  {e.academic.subjects}教科
                  {e.academic.rawMax ? `・${e.academic.rawMax}点満点` : ''}
                  {e.academic.perSubjectMax ? `（各${e.academic.perSubjectMax}点）` : ''}
                  。{e.academic.weightingNote ?? e.academic.note ?? ''}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">内申点（調査書）</h3>
                <p className="text-base leading-[1.8] text-slate-900">
                  対象：中{e.report.targetGrades.join('・中')}年
                  {e.report.rawMax ? `・${e.report.rawMax}点満点` : ''}。{e.report.note}
                </p>
                <p className="mt-2 text-sm leading-[1.7] text-slate-600">
                  内申点そのものは
                  <Link
                    href={`/${e.code}/naishin`}
                    className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    {e.name}の内申点計算ツール
                  </Link>
                  で正確に算出できます。
                </p>
              </div>
              {e.others && (
                <div>
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">その他の検査</h3>
                  <p className="text-base leading-[1.8] text-slate-900">{e.others}</p>
                </div>
              )}
            </div>
            {e.caveat && (
              <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-[1.8] text-amber-900">
                ※ {e.caveat}
              </p>
            )}
          </section>

          {/* 合否決定の流れ（番号付きフロー＝独自コンテンツ） */}
          {e.flow.length > 0 && (
            <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{e.name}の合否が決まるまでの流れ</h2>
              <ol className="list-decimal space-y-3 pl-6 text-base leading-[1.8] text-slate-900 marker:font-bold marker:text-slate-900">
                {e.flow.map((step, i) => (
                  <li key={i} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 受験生が今できること */}
          {e.whatToDo && e.whatToDo.length > 0 && (
            <section className="mb-8 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">合計点が出せない代わりに、今できること</h2>
              <ul className="list-disc space-y-2 pl-6 text-base leading-[1.8] text-slate-900 marker:text-brand-700">
                {e.whatToDo.map((item, i) => (
                  <li key={i} className="pl-1">
                    {item}
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
            placement="prefecture"
            prefectureCode={e.code}
            heading={offer.heading}
            body={offer.body}
            affiliateId={offer.affiliateId}
            ctaText={offer.ctaText}
            note={offer.note}
          />

          {/* 出典 */}
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-amber-700" />
              <p className="text-sm leading-[1.8] text-amber-900">
                本ページの内容は{e.source.docTitle}に基づきます。比重・配点は学校・学科・年度により異なります。学校別の合格ボーダーは掲載していません。最新の情報は
                <a
                  href={e.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-900 underline underline-offset-2"
                >
                  {e.name}教育委員会の公式情報
                </a>
                でご確認ください（最終確認：{e.source.lastChecked}）。
              </p>
            </div>
          </div>

          {/* よくある質問（FAQ・県固有） */}
          {e.faqs.length > 0 && (
            <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-2 text-xl font-bold text-slate-900">{e.name}の入試 よくある質問</h2>
              <div className="divide-y divide-slate-200">
                {e.faqs.map((f, i) => (
                  <div key={i} className="py-4">
                    <h3 className="mb-2 flex gap-2 text-[17px] font-bold leading-snug text-slate-900">
                      <span className="shrink-0 text-brand-700">Q.</span>
                      {f.q}
                    </h3>
                    <p className="flex gap-2 text-base leading-[1.8] text-slate-900">
                      <span className="shrink-0 font-bold text-brand-700">A.</span>
                      <span>{f.a}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 関連リンク */}
          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="border-t border-slate-200">
              <li>
                <Link
                  href={`/${e.code}/naishin`}
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 px-1 py-2 text-base text-slate-900 hover:bg-brand-50"
                >
                  <span>{e.name}の内申点を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href={`/${e.code}`}
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 px-1 py-2 text-base text-slate-900 hover:bg-brand-50"
                >
                  <span>{e.name}の入試制度ガイド</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/hensachi"
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 px-1 py-2 text-base text-slate-900 hover:bg-brand-50"
                >
                  <span>偏差値を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/hyotei-heikin"
                  className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 px-1 py-2 text-base text-slate-900 hover:bg-brand-50"
                >
                  <span>評定平均を自動計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
