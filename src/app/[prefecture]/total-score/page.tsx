import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

import { getTotalScoreSystem } from '@/lib/total-score/registry';
import { getExplainer } from '@/lib/total-score/explainers';
import type { TotalScoreSystem } from '@/lib/total-score/types';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { TotalScoreCalculator } from '@/components/TotalScore/TotalScoreCalculator';
import { TotalScoreExplainerView } from '@/components/TotalScore/TotalScoreExplainerView';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

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
          <SaveResultCTA
            source="prefecture"
            prefectureCode={system.code}
            prefectureName={system.name}
            className="mt-6"
            heading="この総合得点と「あと何点」を、忘れないうちに受け取りませんか？"
            body="総合得点アップのコツ・志望校の最新動向・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

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
