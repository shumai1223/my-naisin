import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, BarChart3, ShieldCheck, HelpCircle, Info } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import {
  STATS_METRICS,
  STATS_MIN_SAMPLE_SIZE,
  computeAggregate,
  buildPrefectureAggregates,
  formatStatValue,
  type StatsMetric,
} from '@/lib/stats-aggregation';
import { getStatsValues, getStatsValuesByPrefecture } from '@/lib/stats-db';
import { getPrefectureByCode } from '@/lib/prefectures';
import { SITE_URL } from '@/lib/naishin-dataset';

export const dynamic = 'force-dynamic';

const METRIC_META: Record<StatsMetric, { label: string; unit: string; note: string }> = {
  naishin: {
    label: '内申点',
    unit: '点',
    note: '内申点の満点は都道府県によって異なります（45点満点の県から135点満点の県まで）。全国集計は満点の異なる値が混在する参考値です。',
  },
  hensachi: {
    label: '偏差値',
    unit: '',
    note: '5教科または3教科など、入力する教科数によって偏差値の意味合いが変わります。全国集計は入力条件が混在する参考値です。',
  },
  'total-score': {
    label: '総合得点',
    unit: '点',
    note: '総合得点の満点は都道府県・学校によって異なります（450点満点の県から1020点満点の県まで）。全国集計は満点の異なる値が混在する参考値です。',
  },
};

const FAQS = [
  {
    question: 'この統計データはどこから集まっていますか？',
    answer:
      '各計算機ページ（内申点・偏差値・総合得点）で「匿名で統計に協力する」に任意でオプトインした利用者の計算結果のみを集計しています。氏名・メールアドレス・IPアドレスなど個人を特定できる情報は一切収集していません。',
  },
  {
    question: 'なぜ一部の統計が表示されていないのですか？',
    answer:
      `サンプルサイズが${STATS_MIN_SAMPLE_SIZE}件未満の項目は、個人の値が推測されるリスクを避けるため（k-匿名性）、集計値を表示せず「現在n件収集中」とだけ表示します。件数が閾値を超えると自動的に集計値が表示されます。`,
  },
  {
    question: '自分の結果も統計に含めるにはどうすればいいですか？',
    answer:
      '内申点・偏差値・総合得点の各計算機ページで計算後、「匿名で統計に協力する（任意）」にチェックを入れてください。この同意はいつでも撤回できます。',
  },
  {
    question: 'このデータをAPIで取得できますか？',
    answer:
      'はい。/api/stats/distribution エンドポイント（GET）で同じ集計データをJSON形式で取得できます。詳しい仕様は開発者向けページをご確認ください。',
  },
  {
    question: 'CSVで一括ダウンロードできますか？',
    answer:
      'はい。/api/stats/csv エンドポイント（GET）で、内申点・偏差値・総合得点の全国集計を1行1指標のCSV（表計算ソフトでそのまま開けます）でダウンロードできます。サンプルサイズが不足する指標はinsufficient_data列で明示し、平均・最小・最大は空欄のまま返します。',
  },
  {
    question: '都道府県別のデータも見られますか？',
    answer:
      `はい。各都道府県で${STATS_MIN_SAMPLE_SIZE}件以上のデータが集まり次第、その都道府県の平均値をこのページに追加表示します。全国集計と同じくk-匿名性を適用しているため、件数が閾値未満の都道府県はまだ表示されません（投稿が増えると自動的に追加されます）。`,
  },
];

async function loadStats() {
  const results = await Promise.all(
    STATS_METRICS.map(async (metric) => {
      const [values, valuesByPrefecture] = await Promise.all([getStatsValues(metric), getStatsValuesByPrefecture(metric)]);
      const aggregate = computeAggregate(values);
      const count = aggregate?.count ?? 0;
      const sufficient = count >= STATS_MIN_SAMPLE_SIZE;
      const prefectureCells = buildPrefectureAggregates(valuesByPrefecture)
        .filter((cell) => cell.aggregate !== null)
        .sort((a, b) => b.aggregate!.count - a.aggregate!.count);
      return { metric, aggregate: sufficient ? aggregate : null, count, prefectureCells };
    })
  );
  return results;
}

export const metadata: Metadata = {
  title: '全国 内申点・偏差値・総合得点 統計データ（利用者オプトイン集計） | My Naishin',
  description:
    '内申点・偏差値・総合得点の全国分布を、計算機利用者の任意オプトインによる匿名データから集計。個人を特定できる情報は一切含みません。サンプルサイズが少ない項目は「収集中」と誠実に表示します。',
  keywords: ['内申点 平均', '偏差値 分布', '総合得点 統計', '内申点 全国平均'],
  alternates: { canonical: `${SITE_URL}/stats` },
  openGraph: {
    title: '全国 内申点・偏差値・総合得点 統計データ',
    description: '計算機利用者の任意オプトインによる匿名データから集計した全国分布。',
    url: `${SITE_URL}/stats`,
    type: 'website',
  },
};

export default async function StatsPage() {
  const url = `${SITE_URL}/stats`;
  const stats = await loadStats();
  // このページはforce-dynamicで毎リクエスト時にD1から再集計している＝キャッシュされた古い数値を
  // 表示することはない（N-6：鮮度表示。バッチ更新パイプラインは不要＝常に集計時点が「今」）。
  const generatedAt = new Date();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '全国統計データ', url },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <DatasetSchema
        name="全国 内申点・偏差値・総合得点 統計データ"
        description="My Naishinの計算機利用者が任意でオプトインした匿名の計算結果を集計した全国分布データ。個人を特定できる情報は含まない。サンプルサイズが閾値未満のセグメントは非公開（k-匿名性）。"
        url={url}
        variableMeasured={['内申点', '偏差値', '総合得点']}
        keywords={['内申点', '偏差値', '総合得点', '統計', '全国分布']}
        distribution={[
          {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: `${SITE_URL}/api/stats/distribution?metric=naishin`,
            name: '内申点 分布データ（JSON）',
          },
          {
            '@type': 'DataDownload',
            encodingFormat: 'text/csv',
            contentUrl: `${SITE_URL}/api/stats/csv`,
            name: '全国集計データ（CSV・全指標）',
          },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">全国統計データ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">全国統計データ</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              内申点・偏差値・総合得点の計算機を使った方が任意でオプトインした匿名データを集計しています。個人を特定できる情報は一切含みません。
            </p>
            <p className="mt-2 text-xs text-slate-400">
              集計日時：{generatedAt.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}（このページは表示のたびに最新データを集計します）
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <p className="text-sm leading-relaxed text-emerald-900">
                このデータは各計算機ページで「匿名で統計に協力する」に同意した方の結果のみを集計したものです。氏名・メールアドレス・IPアドレス等は一切収集していません。サンプルサイズが{STATS_MIN_SAMPLE_SIZE}件未満の項目は、個人の値が推測されるのを防ぐため（k-匿名性）、件数のみ表示し集計値は表示しません。
              </p>
            </div>
          </section>

          <section className="mb-8 grid gap-4">
            {stats.map(({ metric, aggregate, count, prefectureCells }) => {
              const meta = METRIC_META[metric];
              return (
                <div key={metric} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-3 text-lg font-bold text-slate-800">{meta.label}の全国分布</h2>
                  {aggregate ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-[11px] font-bold text-slate-500">平均</div>
                          <div className="text-2xl font-black text-emerald-700">
                            {aggregate.mean.toFixed(1)}
                            {meta.unit}
                          </div>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-[11px] font-bold text-slate-500">最小</div>
                          <div className="text-2xl font-black text-slate-700">
                            {formatStatValue(aggregate.min)}
                            {meta.unit}
                          </div>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-[11px] font-bold text-slate-500">最大</div>
                          <div className="text-2xl font-black text-slate-700">
                            {formatStatValue(aggregate.max)}
                            {meta.unit}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-slate-400">サンプルサイズ：{aggregate.count}件</p>
                    </>
                  ) : (
                    <div
                      className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500"
                      role="status"
                    >
                      現在{count}件収集中（{STATS_MIN_SAMPLE_SIZE}件で表示開始）
                    </div>
                  )}
                  <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    {meta.note}
                  </p>

                  {prefectureCells.length > 0 ? (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <h3 className="mb-2 text-xs font-bold text-slate-600">
                        都道府県別（{STATS_MIN_SAMPLE_SIZE}件以上のみ表示・{prefectureCells.length}県）
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {prefectureCells.map((cell) => {
                          const pref = getPrefectureByCode(cell.prefectureCode);
                          return (
                            <div key={cell.prefectureCode} className="rounded-lg bg-slate-50 px-3 py-2 text-xs">
                              <span className="font-bold text-slate-700">{pref?.name ?? cell.prefectureCode}</span>
                              <span className="ml-2 text-slate-500">
                                平均{formatStatValue(cell.aggregate!.mean)}
                                {meta.unit}（n={cell.aggregate!.count}）
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] leading-relaxed text-slate-400">
                      都道府県別の内訳は、{STATS_MIN_SAMPLE_SIZE}件以上のデータが集まった都道府県からk-匿名性を保ちつつ順次表示します（現時点で条件を満たす都道府県はまだありません）。
                    </p>
                  )}
                </div>
              );
            })}
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 flex items-start gap-1.5 text-sm font-bold text-slate-800">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    Q. {f.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/hensachi" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                偏差値を計算する
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                内申点を計算する
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/total-score" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                総合得点の仕組みを見る
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/quality" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                データの品質・出典について
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link href="/report/2026" className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50">
                内申点白書2026（47都道府県データ）
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
