import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ChevronRightSquare, BookMarked } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { STATS_METRICS, STATS_MIN_SAMPLE_SIZE, computeAggregate, formatStatValue, type StatsMetric } from '@/lib/stats-aggregation';
import { getStatsValues } from '@/lib/stats-db';
import { REPORT_2026_ROWS as ROWS, REPORT_2026_NO_SKEW_COUNT as NO_SKEW_COUNT, REPORT_2026_GRADE3_ONLY as GRADE3_ONLY } from '@/lib/report-2026-data';
import { REPORT_2026_DIGEST_CODES } from '@/lib/report-2026-digest-content';
import { getPrefectureByCode } from '@/lib/prefectures';

export const dynamic = 'force-dynamic';

/**
 * 内申点白書2026（X-1）。全数値は src/lib/prefectures.ts（各都道府県教育委員会の公式発表に
 * 基づく既存データ）からの派生値、または /stats と同じ実測オプトイン統計の再利用のみ。
 * 新規の一次データ・推測値は一切追加しない（捏造ゼロ原則）。
 *
 * /naishin-kakusa（一般読者向けの平易な解説・上位8県抜粋）とは役割を分けている——
 * このページは「外部の記者・研究者が引用・保存する定本」としての47都道府県全件表＋
 * 出典・引用ガイドラインを備えた文書版（PDF化はPlaywrightがこの実行環境で起動不可のため
 * 後続フェーズ。まずは常に最新の一次データを反映するWeb版を定本とする）。
 * 県別の1ページ版はX-30（/report/2026/[prefecture]）を参照——本ページと同じ
 * src/lib/report-2026-data.tsを共有し数値の食い違いを構造的に防いでいる。
 */
const MAX_SCORE_SORTED = [...ROWS].sort((a, b) => a.maxScore - b.maxScore);
const MIN_MAX_SCORE = MAX_SCORE_SORTED[0];
const MAX_MAX_SCORE = MAX_SCORE_SORTED[MAX_SCORE_SORTED.length - 1];
const TOP_SKEW = ROWS[0]; // 鹿児島(10倍)を想定するが、値は常にROWSから動的算出

const METRIC_LABEL: Record<StatsMetric, string> = {
  naishin: '内申点',
  hensachi: '偏差値',
  'total-score': '総合得点',
};

const FAQS = [
  {
    question: 'この白書のデータはどこから来ていますか？',
    answer:
      '47都道府県すべての教育委員会が公式に発表している入学者選抜実施要項・実施要領を出典とし、本サイトの内申点計算エンジン（src/lib/prefectures.ts）が用いる設定値をそのまま集計しています。新規の推測・断定は行わず、匿名統計セクションのみ利用者の任意オプトインによる実測データ（/statsと同一のソース）を使用しています。',
  },
  {
    question: '記事や研究資料に引用してもよいですか？',
    answer:
      'はい。「出典: My Naishin（https://my-naishin.com/report/2026）」の形でクレジットいただければ、報道・教育目的での引用・転載は自由です。学校名の合否可能性の断定や、個別高校のボーダーラインとして再利用することはお控えください（本サイトはその種のデータを一切保持していません）。',
  },
  {
    question: 'データはどのくらいの頻度で更新されますか？',
    answer:
      '都道府県別の制度データは年度替わり（毎年春）を中心に随時更新し、各都道府県ページの「最終確認日」で確認できます。匿名統計セクションはアクセスのたびにリアルタイムで再集計しています。',
  },
];

async function loadLiveStats() {
  const results = await Promise.all(
    STATS_METRICS.map(async (metric) => {
      const values = await getStatsValues(metric);
      const aggregate = computeAggregate(values);
      const count = aggregate?.count ?? 0;
      const sufficient = count >= STATS_MIN_SAMPLE_SIZE;
      return { metric, aggregate: sufficient ? aggregate : null, count };
    })
  );
  return results;
}

export const metadata: Metadata = {
  title: '内申点白書2026｜47都道府県 制度比較・構造分析【引用・転載自由】 | My Naishin',
  description:
    '47都道府県の内申点算出方式を横断比較した年次白書。実技傾斜配点・学年別重み・満点構造の違いを公式データで分析し、匿名集計統計とあわせて公開。報道・研究目的での引用・転載は出典明記のみで自由。',
  keywords: ['内申点 白書', '内申点 都道府県 比較 データ', '内申点 統計', '教育格差 データ'],
  alternates: {
    canonical: `${SITE_URL}/report/2026`,
    languages: {
      ja: `${SITE_URL}/report/2026`,
      en: `${SITE_URL}/report/2026/en`,
    },
  },
  openGraph: {
    title: '内申点白書2026 | My Naishin',
    description: '47都道府県の内申点制度を公式データで横断比較した年次白書。引用・転載自由。',
    url: `${SITE_URL}/report/2026`,
    type: 'article',
  },
};

export default async function Report2026Page() {
  const url = `${SITE_URL}/report/2026`;
  const liveStats = await loadLiveStats();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点白書2026', url },
        ]}
      />
      <ArticleSchema
        title="内申点白書2026"
        description="47都道府県の内申点算出方式を公式データで横断比較した年次白書"
        datePublished="2026-07-23"
        dateModified="2026-07-23"
        author="しゅうまい"
      />
      <DatasetSchema
        name="内申点白書2026 都道府県別データ"
        description="47都道府県の内申点算出に用いる学年別倍率・実技教科倍率・満点設定と、利用者オプトインによる匿名集計統計"
        url={url}
        variableMeasured={['実技教科倍率', '学年別倍率', '内申点満点', '対象学年数']}
        dateModified="2026-07-23"
        keywords={['内申点', '白書', '都道府県', '入試制度', '教育格差']}
        distribution={[
          {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: `${SITE_URL}/api/naishin`,
            name: '都道府県別内申点データAPI',
          },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点白書2026</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-900 text-white shadow-xl">
              <BookMarked className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">内申点白書2026</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              47都道府県の内申点算出方式を、各教育委員会の公式データに基づいて横断比較した年次白書です。
              報道・研究目的での引用・転載は、出典明記のみで自由に行っていただけます。
            </p>
            <p className="mt-2 text-xs text-slate-400">
              発行: My Naishin ／ 発行日: 2026年7月 ／ 対象年度: 2026年度入試 ／{' '}
              <Link href="/report/2026/en" className="font-semibold text-indigo-700 underline">
                English summary
              </Link>
            </p>
          </header>

          {/* ① エグゼクティブサマリー */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">① エグゼクティブサマリー</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              日本の公立高校入試における「内申点」は、都道府県ごとに教育委員会が独自の算出方式を定めており、
              全国共通の基準は存在しません。同じ「オール5」「オール3」の成績であっても、対象学年・教科の重み付け・
              満点設計の違いにより、入試の合否判定に占める実質的な重みは県ごとに大きく異なります。本白書は、
              47都道府県すべての公式データを機械可読化した本サイトの計算エンジンをもとに、この制度差を構造的に
              可視化するものです。特に、実技教科（音楽・美術・保健体育・技術家庭）の傾斜配点で
              鹿児島県が{TOP_SKEW.practicalSkew}倍という他県から突出した値を示す点、
              {GRADE3_ONLY.length}都道府県が中学3年生の成績のみで合否判定を行う点は、
              保護者・進路指導関係者の間でも十分に知られていない構造的事実です。
            </p>
          </section>

          {/* ③ 構造的発見トップ5（先に提示し、後段の全件表で裏付ける構成） */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">② 構造的発見トップ5</h2>
            <ol className="space-y-4 text-sm leading-relaxed text-slate-600">
              <li>
                <strong className="text-slate-800">1. 鹿児島県の実技傾斜倍率は全国唯一の「ケタ違い」。</strong>
                {' '}実技4教科の倍率が主要5教科の{TOP_SKEW.practicalSkew}倍に設定されており、次点（宮城・秋田・福島・東京・京都・鳥取・岡山・徳島など2倍の県）から5倍の差がある唯一の外れ値です。
              </li>
              <li>
                <strong className="text-slate-800">
                  2. {GRADE3_ONLY.length}都道府県（{Math.round((GRADE3_ONLY.length / ROWS.length) * 100)}%）が中学3年生の成績のみで合否判定。
                </strong>
                {' '}{GRADE3_ONLY.map((r) => r.name).join('・')}では、中1・中2の内申点は入試の合否に一切使われません。
              </li>
              <li>
                <strong className="text-slate-800">
                  3. 内申点の満点設計は{MIN_MAX_SCORE.maxScore}点（{MIN_MAX_SCORE.name}等）〜{MAX_MAX_SCORE.maxScore}点（{MAX_MAX_SCORE.name}）と最大{Math.round((MAX_MAX_SCORE.maxScore / MIN_MAX_SCORE.maxScore) * 10) / 10}倍の開き。
                </strong>
                {' '}満点の大小自体は有利不利を意味しませんが、都道府県間で内申点の素点をそのまま比較することの危険性を示す実例です。
              </li>
              <li>
                <strong className="text-slate-800">
                  4. {NO_SKEW_COUNT}/{ROWS.length}都道府県（{Math.round((NO_SKEW_COUNT / ROWS.length) * 100)}%）は実技教科に重み付けをしていません。
                </strong>
                {' '}実技科目の入試における重要度は、自治体の制度設計次第で「対等」から「10倍」まで大きく揺れ動きます。
              </li>
              <li>
                <strong className="text-slate-800">5. 神奈川県・富山県は中2:中3の2学年制という比較的珍しい設計。</strong>
                {' '}多くの県が中1〜中3の3学年、または中3のみの1学年制を採る中、中2からのみ判定を始める2学年制は少数派です。
              </li>
            </ol>
            <p className="mt-4 text-xs text-slate-400">
              全て src/lib/prefectures.ts（各都道府県教育委員会の公式発表）からの機械的な集計値であり、新規の推測・断定は含みません。
            </p>
          </section>

          {/* ② 47都道府県比較表 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">③ 47都道府県 比較表（全件）</h2>
            <p className="mb-4 text-xs text-slate-500">
              実技傾斜倍率（実技4教科÷主要5教科）の降順。出典URLは各都道府県教育委員会の公式ページです。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                    <th className="py-2 pr-2">都道府県</th>
                    <th className="py-2 pr-2">地域</th>
                    <th className="py-2 pr-2">実技傾斜</th>
                    <th className="py-2 pr-2">中3の重み</th>
                    <th className="py-2 pr-2">対象学年数</th>
                    <th className="py-2 pr-2">満点</th>
                    <th className="py-2">出典</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.code} className="border-b border-slate-100 last:border-0">
                      <td className="py-1.5 pr-2 font-medium text-slate-800">{r.name}</td>
                      <td className="py-1.5 pr-2 text-slate-500">{r.region}</td>
                      <td className="py-1.5 pr-2 font-bold text-indigo-700">{r.practicalSkew}倍</td>
                      <td className="py-1.5 pr-2 text-slate-600">{r.grade3WeightPct}%</td>
                      <td className="py-1.5 pr-2 text-slate-600">{r.gradeCount}学年</td>
                      <td className="py-1.5 pr-2 text-slate-600">{r.maxScore}点</td>
                      <td className="py-1.5">
                        {r.sourceUrl ? (
                          <a
                            href={r.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-indigo-600 underline hover:text-indigo-800"
                          >
                            教委
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ④ 匿名統計サマリー（/statsと同一データソース・n≥30の指標のみ） */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">④ 匿名統計サマリー</h2>
            <p className="mb-4 text-xs text-slate-500">
              各計算機ページで「匿名で統計に協力する」に任意でオプトインした利用者の実測データです（個人を特定できる情報は一切含みません）。
              サンプルサイズが{STATS_MIN_SAMPLE_SIZE}件未満の指標は、個人の値の推測を防ぐため(k-匿名性)非表示にしています。
              このページを開くたびに最新値を再集計します。
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {liveStats.map(({ metric, aggregate, count }) => (
                <div key={metric} className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-500">{METRIC_LABEL[metric]}</div>
                  {aggregate ? (
                    <>
                      <div className="mt-1 text-xl font-black text-indigo-700">平均{aggregate.mean.toFixed(1)}</div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        最小{formatStatValue(aggregate.min)}〜最大{formatStatValue(aggregate.max)}（n={aggregate.count}）
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 text-xs text-slate-400">現在{count}件収集中</div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              詳細な分布・API・CSVダウンロードは<Link href="/stats" className="text-indigo-600 underline">全国統計データページ</Link>をご覧ください。
            </p>
          </section>

          {/* ⑤ 出典・方法論 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">⑤ 出典・方法論</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              都道府県別の制度データは、各都道府県教育委員会が公式に発表する入学者選抜実施要項・実施要領を一次情報源とし、
              本サイトの計算エンジンが用いる設定値（学年別倍率・実技教科倍率・満点）をそのまま集計しています。
              個別の出典URLは上表の「教委」リンク、または各都道府県の内申点計算ページに掲載しています。
              実際の選抜では高校・学科ごとにさらに詳細な傾斜配点が設定される場合があるため、
              個別校の合否判定には必ず志望校・教育委員会の最新発表もあわせてご確認ください。
              匿名統計セクションの方法論は<Link href="/quality" className="text-indigo-600 underline">データの品質・出典について</Link>で公開しています。
            </p>
          </section>

          {/* ⑥ 引用・転載ガイドライン */}
          <section className="mb-8 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800">⑥ 引用・転載ガイドライン</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              本白書のデータ・図表は、「出典: My Naishin（{url}）」の形でクレジットいただければ、
              報道・教育・研究目的での引用・転載を自由に行っていただけます。事前のご連絡は不要です。
              個別高校の合否可能性の断定や、学校別ボーダーラインとしての再利用はお控えください
              （本サイトはその種のデータを保持・提供していません）。データ提供・追加集計軸のご相談は
              <Link href="/contact" className="text-indigo-600 underline">お問い合わせページ</Link>からご連絡ください。
            </p>
          </section>

          {REPORT_2026_DIGEST_CODES.length > 0 && (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-slate-800">都道府県別ダイジェスト版</h2>
              <p className="mb-4 text-xs text-slate-500">
                白書全体でなく、特定の県だけを1ページに凝縮したミニレポートです（執筆済みの県のみ順次公開）。
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {REPORT_2026_DIGEST_CODES.map((code) => {
                  const pref = getPrefectureByCode(code);
                  if (!pref) return null;
                  return (
                    <Link
                      key={code}
                      href={`/report/2026/${code}`}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
                    >
                      {pref.name}版ダイジェスト
                      <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mb-8 grid gap-2 sm:grid-cols-2">
            <Link
              href="/naishin-kakusa"
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              平易な解説版（内申点格差レポート）を読む
              <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
            <Link
              href="/naishin-map"
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              内申点の日本地図で見る
              <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
            <Link
              href="/developers"
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              このデータをAPIで使う
              <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
            <Link
              href="/press"
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              取材・掲載用の媒体資料を見る
              <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
