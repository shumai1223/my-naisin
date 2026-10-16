import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, ExternalLink } from '@/components/icons';

import { getTotalScoreSystem, VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';
import { getExplainer, EXPLAINER_CODES } from '@/lib/total-score/explainers';
import { computeTotalScore } from '@/lib/total-score/engine';
import type { TotalScoreSystem } from '@/lib/total-score/types';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { TotalScoreResultFlow } from '@/components/TotalScore/TotalScoreResultFlow';
import { TotalScoreReverseCalculator } from '@/components/TotalScore/TotalScoreReverseCalculator';
import { TotalScoreExplainerView } from '@/components/TotalScore/TotalScoreExplainerView';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { HensachiPromo } from '@/components/HensachiPromo';
import { AdUnit } from '@/components/AdSlot';

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

// 計算機（registry 5県）＋解説（explainers 34県）＝39県をビルド時に静的生成（SSG）。残り8県(tokyo等)は専用ページで別途存在。
// これがないと毎リクエストでフルSSRが走り、Worker のCPU/メモリ上限超過（Error 1102）の主因になる。
// dynamicParams は既定（true）のまま：プリレンダ漏れがあってもオンデマンド描画にフォールバックし、ハード404にしない（解説34県の取りこぼし防止）。
export function generateStaticParams() {
  const codes = Array.from(new Set([...VERIFIED_TOTAL_SCORE_CODES, ...EXPLAINER_CODES]));
  return codes.map((code) => ({ prefecture: code }));
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${system.code}`} className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              {system.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">総合得点計算</span>
          </nav>

          {/* 頭: h1 → メタ行（方式・年度・出典・最終確認）→ 結論の段落 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {system.name}公立高校 総合得点 計算サイト
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>
                {system.localTerm}・{total ? `${total}点満点・` : ''}
                {system.fiscalYear}年度（令和8年度）入試対応
              </span>
              <span>
                出典：
                <a
                  href={system.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {system.source.docTitle}
                </a>
              </span>
              <span>最終確認 {system.source.lastChecked}</span>
            </p>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-slate-900">
              {system.name}の公立高校入試（{system.localTerm}）の総合得点を瞬時に算出。
              <br />
              学力検査と内申点（調査書点）を入力するだけで、合格ラインまでの距離を確認できます。
            </p>
          </header>

          {/* 制度概要（本文・SEO/GEO） */}
          <section className="mt-8 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <p className="text-base leading-[1.8] text-slate-900">{system.overview}</p>
          </section>

          {/* 満点の内訳 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {system.name}の総合得点の仕組み
            </h2>
            <dl className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="py-4 sm:pr-4">
                <dt className="text-xs text-slate-600">学力検査（当日点）</dt>
                <dd className="mt-1">
                  <span className="text-2xl font-bold tabular-nums text-slate-900">{system.academic.rawMax}</span>
                  <span className="text-base font-bold text-slate-900">点</span>
                  <span className="mt-1 block text-xs text-slate-600">
                    {system.academic.subjects}教科 × {system.academic.perSubjectMax}点
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:pl-4">
                <dt className="text-xs text-slate-600">内申点（調査書点）</dt>
                <dd className="mt-1">
                  <span className="text-2xl font-bold tabular-nums text-slate-900">{system.report.rawMax}</span>
                  <span className="text-base font-bold text-slate-900">点</span>
                  <span className="mt-1 block text-xs text-slate-600">
                    対象：中{system.report.targetGrades.join('・中')}年
                  </span>
                </dd>
              </div>
            </dl>
            {system.ratioOptions.length > 1 && (
              <p className="mt-4 text-sm leading-[1.8] text-slate-600">
                ※ {system.name}は<strong className="text-slate-900">高校・学科ごとに「内申：学力」の比率</strong>が異なります。下の計算機で志望校の比率を選んでください。
              </p>
            )}
          </section>

          {/* Calculator＋結果連動の名簿/送客導線（総合得点の実測値をCTAへ配線＝成績カード/保護者バトン点灯） */}
          <div className="mt-10">
            <TotalScoreResultFlow
              system={system}
              saveHeading="この総合得点と「あと何点」を、忘れないうちに受け取りませんか？"
              saveBody="総合得点アップのコツ・志望校の最新動向・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
            />
          </div>

          {/* B-2: 目標総合得点から必要な学力検査点を逆算（reverseエンジンのtotal-score展開） */}
          <div className="mt-6">
            <TotalScoreReverseCalculator system={system} />
          </div>

          {/* 計算の手順（番号付き） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {system.name}の総合得点が決まるまで（{system.computeSteps.length}ステップ）
            </h2>
            <ol className="space-y-3">
              {system.computeSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 shrink-0 text-base font-bold leading-[1.8] tabular-nums text-slate-900">{i + 1}.</span>
                  <span className="text-base leading-[1.8] text-slate-900">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 得点率→総合得点 早見表（engine算出） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              {system.name} 総合得点 早見表
            </h2>
            <p className="mb-4 text-sm leading-[1.8] text-slate-600">
              {system.ratioOptions.length > 1
                ? `※ ${system.ratioOptions[0].label}の場合の目安。比率が違う場合は上の計算機を使ってください。`
                : '※ 内申点・学力検査の得点率の組合せごとの総合得点の目安です。'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-slate-900 text-xs text-slate-600">
                    <th scope="col" className="px-2 py-2 text-left font-bold">
                      内申＼学力
                    </th>
                    {quickTable[0].cells.map((c) => (
                      <th key={c.academicPct} scope="col" className="px-2 py-2 text-right font-bold">
                        {Math.round(c.academicPct * 100)}%
                        <span className="block text-xs font-normal text-slate-600">{c.academicRaw}点</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quickTable.map((row) => (
                    <tr key={row.reportPct} className="border-b border-slate-200">
                      <th scope="row" className="px-2 py-2 text-left text-xs font-bold text-slate-600">
                        {Math.round(row.reportPct * 100)}%
                        <span className="block text-xs font-normal text-slate-600">{row.reportRaw}点</span>
                      </th>
                      {row.cells.map((c) => (
                        <td key={c.academicPct} className="px-2 py-2 text-right font-bold text-slate-900">
                          {c.total}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-[1.8] text-slate-600">
              縦＝内申点の得点率、横＝学力検査の得点率。セルの数字が総合得点（{quickTable[0].cells.length > 0 ? `${system.ratioOptions[0].academicMax + system.ratioOptions[0].reportMax}点満点` : ''}）の目安です。
            </p>
          </section>

          {/* 計算例（engine算出・捏造ゼロ） */}
          {system.examples && system.examples.length > 0 && (
            <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-2 text-xl font-bold text-slate-900">
                {system.name}の総合得点 計算例
              </h2>
              <div className="divide-y divide-slate-200">
                {system.examples.map((ex, i) => {
                  const r = computeTotalScore(system, {
                    academicRaw: ex.academicRaw,
                    reportRaw: ex.reportRaw,
                    ratioOptionId: ex.ratioOptionId,
                  });
                  return (
                    <div key={i} className="py-4">
                      <h3 className="mb-2 text-[17px] font-bold text-slate-900">{ex.label}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span>学力 <strong className="tabular-nums text-brand-700">{r.academic}点</strong>/{r.option.academicMax}</span>
                        <span className="text-slate-600">＋</span>
                        <span>内申 <strong className="tabular-nums text-brand-700">{r.report}点</strong>/{r.option.reportMax}</span>
                        <span className="text-slate-600">＝</span>
                        <span className="text-base">総合 <strong className="tabular-nums text-brand-700">{r.total}点</strong>/{r.totalMax}（{((r.total / r.totalMax) * 100).toFixed(1)}%）</span>
                      </div>
                      {ex.note && <p className="mt-1 text-xs text-slate-600">{ex.note}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 計算式の解説 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {system.name}の総合得点の計算方法
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">内申点（調査書点）</h3>
                <p className="text-base leading-[1.8] text-slate-900">{system.report.note ?? `中${system.report.targetGrades.join('・中')}年の評定をもとに算出します。`}</p>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  内申点が分からない場合は
                  <Link href={`/${system.code}/naishin`} className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    {system.name}の内申点計算ツール
                  </Link>
                  で先に算出できます。
                </p>
              </div>
              {system.academic.weightingNote && (
                <div>
                  <h3 className="mb-2 text-[17px] font-bold text-slate-900">学力検査の傾斜配点</h3>
                  <p className="text-base leading-[1.8] text-slate-900">{system.academic.weightingNote}</p>
                </div>
              )}
              {system.ratioOptions.length > 1 && (
                <div>
                  <h3 className="mb-2 text-[17px] font-bold text-slate-900">内申：学力の比率（高校別）</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                          <th scope="col" className="py-2 pr-3 font-bold">比率</th>
                          <th scope="col" className="px-3 py-2 text-right font-bold">内申の満点</th>
                          <th scope="col" className="py-2 pl-3 text-right font-bold">学力の満点</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-900">
                        {system.ratioOptions.map((o) => (
                          <tr key={o.id} className="border-b border-slate-200">
                            <td className="py-3 pr-3 font-bold">{o.label}</td>
                            <td className="px-3 py-3 text-right tabular-nums">{o.reportMax}点</td>
                            <td className="py-3 pl-3 text-right tabular-nums">{o.academicMax}点</td>
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
          <HensachiPromo className="mt-10" />

          {/* 保護者向けリード（換金の本命） */}
          <ParentLeadCTA
            className="mt-10"
            placement="prefecture"
            prefectureCode={system.code}
            heading={offer.heading}
            body={offer.body}
            affiliateId={offer.affiliateId}
            ctaText={offer.ctaText}
            note={offer.note}
          />

          {/* T-ADS1 AdSense IN_CONTENT: 保護者リードCTAの後ろ（CTAを押し下げない）。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="IN_CONTENT" />

          {/* 出典 */}
          <div className="mt-10 rounded-lg border border-slate-200 bg-brand-50 p-4">
            <p className="text-sm font-bold text-slate-900">出典</p>
            <p className="mt-1 text-sm leading-[1.8] text-slate-900">
              本ツールの計算結果は{system.source.docTitle}に基づく目安です。学校・学科・年度により配点や比率が異なる場合があります。学校別の合格ボーダーは掲載していません。最新の情報は
              <a href={system.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                {system.name}教育委員会の公式情報
                <ExternalLink className="h-4 w-4" />
              </a>
              でご確認ください（最終確認：{system.source.lastChecked}）。
            </p>
          </div>

          {/* よくある質問（FAQ・県固有） */}
          {system.faqs.length > 0 && (
            <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-2 text-xl font-bold text-slate-900">
                {system.name}の総合得点 よくある質問
              </h2>
              <div className="divide-y divide-slate-200">
                {system.faqs.map((f, i) => (
                  <div key={i} className="py-4 last:pb-0">
                    <h3 className="mb-2 flex gap-2 text-[17px] font-bold text-slate-900">
                      <span className="text-brand-700">Q.</span>
                      {f.q}
                    </h3>
                    <p className="flex gap-2 text-base leading-[1.8] text-slate-900">
                      <span className="font-bold text-brand-700">A.</span>
                      <span>{f.a}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 関連リンク */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href={`/${system.code}/naishin`} className="flex min-h-[44px] items-center justify-between gap-2 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800 hover:underline">
                  <span>{system.name}の内申点を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href={`/${system.code}`} className="flex min-h-[44px] items-center justify-between gap-2 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800 hover:underline">
                  <span>{system.name}の入試制度ガイド</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-2 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800 hover:underline">
                  <span>偏差値を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-2 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800 hover:underline">
                  <span>評定平均を自動計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/chousasho/hyoutei" className="flex min-h-[44px] items-center justify-between gap-2 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800 hover:underline">
                  <span>調査書点と内申点・評定平均の関係</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
            </ul>
          </section>

          {/* T-ADS1 AdSense PAGE_BOTTOM: ページ最下部（フッターの前）。保護者リードCTAより後ろ。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </>
  );
}
