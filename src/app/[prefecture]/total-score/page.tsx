import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, ExternalLink, ListOrdered, HelpCircle, TableProperties } from 'lucide-react';

import { getTotalScoreSystem } from '@/lib/total-score/registry';
import { getExplainer } from '@/lib/total-score/explainers';
import { computeTotalScore } from '@/lib/total-score/engine';
import type { TotalScoreSystem } from '@/lib/total-score/types';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { TotalScoreCalculator } from '@/components/TotalScore/TotalScoreCalculator';
import { TotalScoreExplainerView } from '@/components/TotalScore/TotalScoreExplainerView';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { HensachiPromo } from '@/components/HensachiPromo';

/** 早見表：既定の比率オプションで、得点率の組合せ→総合得点を engine で算出する。 */
function buildQuickTable(system: TotalScoreSystem) {
  const levels = [0.6, 0.7, 0.8, 0.9, 1.0];
  const option = system.ratioOptions[0];
  return levels.map((reportPct) => ({
    reportPct,
    reportRaw: Math.round(system.report.rawMax * reportPct),
    cells: levels.map((academicPct) => {
      const r = computeTotalScore(system, {
        academicRaw: system.academic.rawMax * academicPct,
        reportRaw: system.report.rawMax * reportPct,
        ratioOptionId: option.id,
      });
      return { academicPct, academicRaw: Math.round(system.academic.rawMax * academicPct), total: r.total };
    }),
  }));
}

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

const BASE = 'https://my-naishin.com';

/** 全オプションの満点が一致するなら満点値、ばらつくなら null（タイトル等に使う）。 */
function stableTotalMax(system: TotalScoreSystem): number | null {
  const totals = system.ratioOptions.map((o) => o.academicMax + o.reportMax);
  return totals.every((t) => t === totals[0]) ? totals[0] : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefecture } = await params;
  const system = getTotalScoreSystem(prefecture);
  if (!system) {
    const e = getExplainer(prefecture);
    if (!e) return { title: '総合得点 計算 | My Naishin' };
    return {
      title: `${e.name}公立高校 総合得点・合否の仕組み【${e.localTerm}】内申点と当日点の使われ方 | My Naishin`,
      description: `${e.name}の公立高校入試（${e.localTerm}）は内申点と当日点を単純に足して合否が決まる方式ではありません。配点と「どう合否が決まるか」を${e.fiscalYear}年度（令和8年度）入試対応で一次情報に基づき正確に解説。${e.source.docTitle}準拠。`,
      alternates: { canonical: `${BASE}/${e.code}/total-score` },
    };
  }

  const total = stableTotalMax(system);
  const mantenLabel = total ? `【${total}点満点】` : '';
  const title = `${system.name}公立高校 総合得点 計算サイト${mantenLabel}内申点＋当日点 合否の目安 | My Naishin`;
  const description = `${system.name}の公立高校入試（${system.localTerm}）の総合得点を自動計算する無料サイト。学力検査（${system.academic.rawMax}点）と内申点（調査書点${system.report.rawMax}点）${
    system.ratioOptions.length > 1 ? 'を志望校の内申:学力の比率で合算し' : 'を合算し'
  }、合格ラインまでの距離を瞬時に算出。${system.fiscalYear}年度（令和8年度）入試対応・${system.source.docTitle}に準拠。`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${system.code}/total-score` },
  };
}

export default async function PrefectureTotalScorePage({ params }: PageProps) {
  const { prefecture } = await params;
  const system = getTotalScoreSystem(prefecture);
  if (!system) {
    const explainer = getExplainer(prefecture);
    if (!explainer) notFound();
    return <TotalScoreExplainerView explainer={explainer} />;
  }

  const total = stableTotalMax(system);
  const offer = selectLeadOffer({ prefectureCode: system.code, placement: 'prefecture' });
  const url = `${BASE}/${system.code}/total-score`;
  const quickTable = buildQuickTable(system);

  return (
    <>
      <WebApplicationSchema
        name={`${system.name}公立高校 総合得点 計算サイト | My Naishin`}
        description={`${system.name}の公立高校入試の総合得点を自動計算。学力検査と内申点（調査書点）から合計点を算出。`}
        url={url}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${BASE}/` },
          { name: system.name, url: `${BASE}/${system.code}` },
          { name: '総合得点計算', url },
        ]}
      />
      {system.faqs.length > 0 && (
        <FAQPageSchema faqItems={system.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
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
            <Link href={`/${system.code}`} className="hover:text-blue-600">
              {system.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">総合得点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {system.name}公立高校 総合得点 計算サイト
            </h1>
            <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {system.localTerm}・{total ? `${total}点満点・` : ''}
              {system.fiscalYear}年度（令和8年度）入試対応
            </div>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              {system.name}の公立高校入試（{system.localTerm}）の総合得点を瞬時に算出。
              <br />
              学力検査と内申点（調査書点）を入力するだけで、合格ラインまでの距離を確認できます。
            </p>
          </header>

          {/* 制度概要（本文・SEO/GEO） */}
          <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
            <p className="leading-loose text-slate-700">{system.overview}</p>
          </section>

          {/* 満点の内訳 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {system.name}の総合得点の仕組み
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
                <div className="mb-1 text-xs font-bold text-blue-600">学力検査（当日点）</div>
                <div className="text-3xl font-black text-blue-700">
                  {system.academic.rawMax}
                  <span className="text-base font-bold">点</span>
                </div>
                <div className="mt-1 text-xs text-blue-600">
                  {system.academic.subjects}教科 × {system.academic.perSubjectMax}点
                </div>
              </div>
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center">
                <div className="mb-1 text-xs font-bold text-emerald-600">内申点（調査書点）</div>
                <div className="text-3xl font-black text-emerald-700">
                  {system.report.rawMax}
                  <span className="text-base font-bold">点</span>
                </div>
                <div className="mt-1 text-xs text-emerald-600">
                  対象：中{system.report.targetGrades.join('・中')}年
                </div>
              </div>
            </div>
            {system.ratioOptions.length > 1 && (
              <p className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-center text-sm text-slate-600">
                ※ {system.name}は<strong>高校・学科ごとに「内申：学力」の比率</strong>が異なります。下の計算機で志望校の比率を選んでください。
              </p>
            )}
          </section>

          {/* Calculator */}
          <TotalScoreCalculator system={system} />

          {/* 結果保存・名簿化（堀A） */}
          <ParentCostBridge prefectureName={system.name} className="mb-6" />

          <SaveResultCTA
            source="prefecture"
            prefectureCode={system.code}
            prefectureName={system.name}
            className="mt-6"
            heading="この総合得点と「あと何点」を、忘れないうちに受け取りませんか？"
            body="総合得点アップのコツ・志望校の最新動向・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

          {/* 計算の手順（番号付き） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ListOrdered className="h-5 w-5 text-blue-500" />
              {system.name}の総合得点が決まるまで（{system.computeSteps.length}ステップ）
            </h2>
            <ol className="space-y-3">
              {system.computeSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 得点率→総合得点 早見表（engine算出） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800">
              <TableProperties className="h-5 w-5 text-blue-500" />
              {system.name} 総合得点 早見表
            </h2>
            <p className="mb-4 text-xs text-slate-500">
              {system.ratioOptions.length > 1
                ? `※ ${system.ratioOptions[0].label}の場合の目安。比率が違う場合は上の計算機を使ってください。`
                : '※ 内申点・学力検査の得点率の組合せごとの総合得点の目安です。'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center text-sm">
                <thead>
                  <tr>
                    <th className="border border-slate-200 bg-slate-100 px-2 py-2 text-xs font-bold text-slate-600">
                      内申＼学力
                    </th>
                    {quickTable[0].cells.map((c) => (
                      <th key={c.academicPct} className="border border-slate-200 bg-blue-50 px-2 py-2 text-xs font-bold text-blue-700">
                        {Math.round(c.academicPct * 100)}%
                        <span className="block text-[10px] font-normal text-blue-500">{c.academicRaw}点</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quickTable.map((row) => (
                    <tr key={row.reportPct}>
                      <th className="border border-slate-200 bg-emerald-50 px-2 py-2 text-xs font-bold text-emerald-700">
                        {Math.round(row.reportPct * 100)}%
                        <span className="block text-[10px] font-normal text-emerald-500">{row.reportRaw}点</span>
                      </th>
                      {row.cells.map((c) => (
                        <td key={c.academicPct} className="border border-slate-200 px-2 py-2 font-bold text-slate-700">
                          {c.total}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              縦＝内申点の得点率、横＝学力検査の得点率。セルの数字が総合得点（{quickTable[0].cells.length > 0 ? `${system.ratioOptions[0].academicMax + system.ratioOptions[0].reportMax}点満点` : ''}）の目安です。
            </p>
          </section>

          {/* 計算例（engine算出・捏造ゼロ） */}
          {system.examples && system.examples.length > 0 && (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Calculator className="h-5 w-5 text-blue-500" />
                {system.name}の総合得点 計算例
              </h2>
              <div className="space-y-3">
                {system.examples.map((ex, i) => {
                  const r = computeTotalScore(system, {
                    academicRaw: ex.academicRaw,
                    reportRaw: ex.reportRaw,
                    ratioOptionId: ex.ratioOptionId,
                  });
                  return (
                    <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-2 text-sm font-bold text-slate-700">{ex.label}</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span>学力 <strong className="text-blue-700">{r.academic}点</strong>/{r.option.academicMax}</span>
                        <span className="text-slate-300">＋</span>
                        <span>内申 <strong className="text-emerald-700">{r.report}点</strong>/{r.option.reportMax}</span>
                        <span className="text-slate-300">＝</span>
                        <span className="text-base">総合 <strong className="text-indigo-700">{r.total}点</strong>/{r.totalMax}（{((r.total / r.totalMax) * 100).toFixed(1)}%）</span>
                      </div>
                      {ex.note && <p className="mt-1 text-xs text-slate-400">{ex.note}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 計算式の解説 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-blue-500" />
              {system.name}の総合得点の計算方法
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="mb-2 font-bold text-slate-800">内申点（調査書点）</h3>
                <p className="leading-relaxed text-slate-700">{system.report.note ?? `中${system.report.targetGrades.join('・中')}年の評定をもとに算出します。`}</p>
                <p className="mt-2 text-xs text-slate-500">
                  内申点が分からない場合は
                  <Link href={`/${system.code}/naishin`} className="font-bold text-blue-600 underline">
                    {system.name}の内申点計算ツール
                  </Link>
                  で先に算出できます。
                </p>
              </div>
              {system.academic.weightingNote && (
                <div>
                  <h3 className="mb-2 font-bold text-slate-800">学力検査の傾斜配点</h3>
                  <p className="leading-relaxed text-slate-700">{system.academic.weightingNote}</p>
                </div>
              )}
              {system.ratioOptions.length > 1 && (
                <div>
                  <h3 className="mb-2 font-bold text-slate-800">内申：学力の比率（高校別）</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-left">
                          <th className="border border-slate-200 px-3 py-2 font-bold">比率</th>
                          <th className="border border-slate-200 px-3 py-2 text-right font-bold">内申の満点</th>
                          <th className="border border-slate-200 px-3 py-2 text-right font-bold">学力の満点</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        {system.ratioOptions.map((o) => (
                          <tr key={o.id} className="odd:bg-white even:bg-slate-50">
                            <td className="border border-slate-200 px-3 py-2 font-bold">{o.label}</td>
                            <td className="border border-slate-200 px-3 py-2 text-right">{o.reportMax}点</td>
                            <td className="border border-slate-200 px-3 py-2 text-right">{o.academicMax}点</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>

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
                本ツールの計算結果は{system.source.docTitle}に基づく目安です。学校・学科・年度により配点や比率が異なる場合があります。学校別の合格ボーダーは掲載していません。最新の情報は
                <a href={system.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-amber-900 underline">
                  {system.name}教育委員会の公式情報
                  <ExternalLink className="h-3 w-3" />
                </a>
                でご確認ください（最終確認：{system.source.lastChecked}）。
              </p>
            </div>
          </div>

          {/* よくある質問（FAQ・県固有） */}
          {system.faqs.length > 0 && (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <HelpCircle className="h-5 w-5 text-blue-500" />
                {system.name}の総合得点 よくある質問
              </h2>
              <div className="space-y-4">
                {system.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="mb-2 flex gap-2 text-sm font-bold text-slate-800">
                      <span className="text-blue-600">Q.</span>
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
              <Link href={`/${system.code}/naishin`} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">{system.name}の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href={`/${system.code}`} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">{system.name}の入試制度ガイド</span>
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
