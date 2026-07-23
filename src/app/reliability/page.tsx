import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ShieldCheck, RefreshCw, Activity, Archive, ExternalLink } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';
import { PREFECTURES } from '@/lib/prefectures';
import { VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';
import { getAllSourceHistories } from '@/lib/source-history';

/**
 * 信頼性ページ(ZZ-6d・Ω-4実行層)。/quality(人間・E-E-A-T向けの検証プロセス説明)、
 * /genten-archive(47県の一次ソース確認履歴)、/api/status(稼働ステータスJSON)は
 * それぞれ既存だが、AIエージェント・開発者が「このデータは今も新鮮か・検証されているか・
 * APIは動いているか」を1ページで機械可読に把握できる集約面が無かった。
 * 数値は全てprefectures.ts/source-history.tsから動的算出し、手書きの都道府県数・日付は
 * 一切含めない(ドリフト防止・[[fable5-loop-protocol]]の教訓に準拠)。
 */

const verifiedPrefectures = PREFECTURES.filter((p) => p.sourceUrl && p.lastVerified);
const latestVerifiedDate = verifiedPrefectures
  .map((p) => p.lastVerified as string)
  .sort()
  .at(-1);

const histories = getAllSourceHistories();
const totalHistoryEntries = histories.reduce((sum, h) => sum + h.history.length, 0);
const latestHistoryDate = histories
  .flatMap((h) => h.history.map((s) => s.date))
  .sort()
  .at(-1);

const FAQS = [
  {
    question: 'このデータはいつ更新されましたか？',
    answer: `47都道府県のうち${verifiedPrefectures.length}県で教育委員会の一次ソースURLと最終確認日を記録しており、直近の確認日は${latestVerifiedDate ?? '未確認'}です。データセットのバージョンは${DATASET_META.version}(${DATASET_META.fiscalYear})です。`,
  },
  {
    question: 'データの正確性はどのように検証されていますか？',
    answer:
      '各都道府県の計算方式は教育委員会の入学者選抜要綱を主たる根拠とし、自動テストで手計算との一致を検証しています。一次ソースをいつ確認したかの履歴は/genten-archiveで公開しています。詳しい検証プロセスは/qualityを参照してください。',
  },
  {
    question: 'APIやMCPサーバーは今動いていますか？',
    answer:
      '/api/statusで稼働状況・データセットバージョンをリアルタイムに確認できます(認証不要・レート制限なし)。全ての公開エンドポイントの仕様は/api/openapi(OpenAPI 3.1)にも機械可読で記載しています。',
  },
];

export const metadata: Metadata = {
  title: 'データの信頼性・鮮度・稼働状況 | My Naishin',
  description:
    '47都道府県の内申点データの最終検証日・一次ソース確認履歴・API稼働状況を1ページで確認できます。AIエージェント・開発者向けの信頼性サマリー。',
  keywords: ['内申点 データ 信頼性', 'API 稼働状況', 'データセット 鮮度', '一次ソース 検証履歴'],
  alternates: { canonical: `${SITE_URL}/reliability` },
  openGraph: {
    title: 'データの信頼性・鮮度・稼働状況 | My Naishin',
    description: '47都道府県の内申点データの最終検証日・検証履歴・API稼働状況のサマリー。',
    url: `${SITE_URL}/reliability`,
    type: 'website',
  },
};

export default function ReliabilityPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '信頼性・データ鮮度', url: `${SITE_URL}/reliability` },
        ]}
      />
      <ArticleSchema
        title="データの信頼性・鮮度・稼働状況"
        description="47都道府県の内申点データの最終検証日・一次ソース確認履歴・API稼働状況のサマリー"
        datePublished="2026-07-24"
        dateModified={latestVerifiedDate ?? '2026-07-24'}
        author="しゅうまい"
      />
      <DatasetSchema
        name={DATASET_META.name}
        description={DATASET_META.description}
        url={`${SITE_URL}/reliability`}
        variableMeasured={['都道府県', '一次ソースURL', '最終確認日', 'API稼働状況']}
        dateModified={latestVerifiedDate ?? '2026-07-24'}
        keywords={['データ鮮度', '検証履歴', 'API稼働状況', '内申点']}
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
            <span className="text-slate-700">信頼性・データ鮮度</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              データの信頼性・鮮度・稼働状況
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              AIエージェント・開発者の方が「このデータは今も新鮮か・検証されているか・APIは動いているか」を
              1ページで確認できるサマリーです。数値は全て本番データから動的に算出しています。
            </p>
          </header>

          {/* データ鮮度 */}
          <section className="mb-8 rounded-2xl border-2 border-blue-100 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">データ鮮度</h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
              <li>
                データセットバージョン: <span className="font-mono font-semibold text-slate-800">{DATASET_META.version}</span>
                {' '}（対象: {DATASET_META.fiscalYear}）
              </li>
              <li>
                内申点計算方式: 47都道府県中 <span className="font-semibold text-slate-800">{verifiedPrefectures.length}県</span> で
                教育委員会一次ソースURL・最終確認日を記録済み
              </li>
              <li>
                直近の一次ソース確認日: <span className="font-mono font-semibold text-slate-800">{latestVerifiedDate ?? '未確認'}</span>
              </li>
              <li>
                総合得点方式（学力検査点＋内申点）の統一エンジン対応:{' '}
                <span className="font-semibold text-slate-800">{VERIFIED_TOTAL_SCORE_CODES.length}県</span>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <a href="/api/naishin" className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 hover:bg-blue-100">
                /api/naishin(JSON) <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
              <a href="/api/naishin/csv" className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 hover:bg-blue-100">
                /api/naishin/csv <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          </section>

          {/* 検証履歴 */}
          <section className="mb-8 rounded-2xl border-2 border-emerald-100 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Archive className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-800">一次ソース検証履歴</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              各都道府県教育委員会の一次ソースを「いつ・どのURLで確認したか」の履歴を継続的に蓄積しています。
              現在 <span className="font-semibold text-slate-800">{histories.length}都道府県ぶん・計{totalHistoryEntries}件</span> の
              確認記録があり、最終更新は <span className="font-mono font-semibold text-slate-800">{latestHistoryDate ?? '未記録'}</span> です。
            </p>
            <Link
              href="/genten-archive"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:underline"
            >
              全都道府県の確認履歴を見る →
            </Link>
          </section>

          {/* 稼働状況 */}
          <section className="mb-8 rounded-2xl border-2 border-slate-200 bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-800">稼働状況</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              公開API・MCPサーバーはCloudflareのグローバルエッジ上で稼働しています。稼働状況とデータセットの
              バージョンは認証不要・レート制限なしの軽量エンドポイントでリアルタイムに確認できます。
              全エンドポイントの仕様はOpenAPI 3.1形式でも機械可読に公開しており、コード変更のたびに
              自動テストで契約(レスポンス構造・応答時間)を検証しています。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <a href="/api/status" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100">
                /api/status(稼働確認) <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
              <a href="/api/openapi" className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100">
                /api/openapi(仕様書) <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/quality" className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                品質保証と検証プロセス
              </Link>
              <Link href="/genten-archive" className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                一次ソース確認履歴
              </Link>
              <Link href="/developers" className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                API / MCPドキュメント
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
