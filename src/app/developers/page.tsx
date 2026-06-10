import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Code2, Bot, Scale, ArrowLeft, Terminal, Sparkles, ExternalLink } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { DATASET_DISTRIBUTION, DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

export const metadata: Metadata = {
  title: '内申点データAPI / MCP（開発者・AI向け）| My Naishin',
  description:
    '全国47都道府県の内申点（調査書点）計算方式を機械可読JSON・MCPで提供。AIエージェント・開発者が一次データと厳密な内申点計算を呼び出せます。出典明記で無料利用可。',
  alternates: { canonical: `${SITE_URL}/developers` },
  openGraph: {
    title: '内申点データAPI / MCP（開発者・AI向け）| My Naishin',
    description:
      '全国47都道府県の内申点計算方式を機械可読JSON・MCPで提供。AIエージェント・開発者向け。',
    url: `${SITE_URL}/developers`,
    type: 'website',
  },
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
      <code>{children}</code>
    </pre>
  );
}

export default function DevelopersPage() {
  const indexExample = `GET ${SITE_URL}/api/naishin

{
  "meta": {
    "name": "${DATASET_META.name}",
    "version": "${DATASET_META.version}",
    "count": 47,
    "license": { "type": "attribution-required", "attribution": "My Naishin — ${SITE_URL}" },
    "endpoints": { "prefecture": "${SITE_URL}/api/naishin/{code}", "mcp": "${SITE_URL}/api/mcp" }
  },
  "prefectures": [
    { "code": "tokyo", "name": "東京都", "maxScore": 300, "coreMultiplier": 1, "practicalMultiplier": 2, ... }
  ]
}`;

  const detailExample = `GET ${SITE_URL}/api/naishin/tokyo

{
  "code": "tokyo", "name": "東京都", "maxScore": 300,
  "formula": { "summary": "各学年で「主要5教科×1 + 実技4教科×2」…" },
  "examples": [
    { "label": "オール3", "total": 135, "max": 300, "percent": 45 },
    { "label": "オール5", "total": 225, "max": 300, "percent": 75 }
  ],
  "targetSchools": [ { "name": "…", "targetNaishin": 0 } ]
}`;

  const mcpConfig = `{
  "mcpServers": {
    "my-naishin": {
      "url": "${SITE_URL}/api/mcp"
    }
  }
}`;

  const mcpCall = `POST ${SITE_URL}/api/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": {
    "name": "calculate_naishin",
    "arguments": {
      "prefectureCode": "tokyo",
      "scores": { "japanese":4,"math":4,"english":5,"science":3,"social":4,"music":4,"art":3,"pe":4,"tech":3 }
    }
  }
}`;

  const restToolsExample = `# 目標内申から逆算（必要評定平均＋効率の良い教科）
GET ${SITE_URL}/api/naishin/tokyo?target=240

# さらに学習計画（週次マイルストーン）を同梱
GET ${SITE_URL}/api/naishin/tokyo?target=240&current=180&weeks=12

# 複数都道府県を同じ評定で横並び比較
GET ${SITE_URL}/api/naishin/compare?codes=tokyo,osaka,hyogo&grade=4`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '開発者・AI向けデータAPI', url: `${SITE_URL}/developers` },
        ]}
      />
      <DatasetSchema
        name={DATASET_META.name}
        description={DATASET_META.description}
        url={`${SITE_URL}/developers`}
        keywords={['内申点', '調査書点', '高校入試', '47都道府県', 'API', 'MCP', '機械可読データ']}
        dateModified={new Date().toISOString().slice(0, 10)}
        citation="各都道府県教育委員会 入学者選抜要綱"
        distribution={DATASET_DISTRIBUTION}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
            <Database className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">内申点データAPI / MCP</h1>
            <p className="text-sm text-slate-500">開発者・AIエージェント向け 一次データ提供</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
          <p className="text-sm leading-relaxed text-indigo-900">
            全国47都道府県の<strong>公立高校入試における内申点（調査書点）の計算方式</strong>を、
            機械可読のJSON APIと<strong>MCP（Model Context Protocol）互換サーバ</strong>で公開しています。
            AIアシスタント・進路支援ツール・研究での利用を歓迎します。出典を明記いただければ、商用・非商用問わず無料です。
          </p>
        </div>

        {/* REST API */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Code2 className="h-5 w-5 text-indigo-500" />
            REST API（JSON）
          </h2>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">① 全47都道府県の一覧</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/naishin</code>
            — 対象学年・倍率・満点・出典を含む全件。
          </p>
          <CodeBlock>{indexExample}</CodeBlock>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">② 単一都道府県の詳細（厳密な計算例つき）</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/naishin/{'{code}'}</code>
            — 計算式の説明・オール3/4/5の確定値・目安校を含む。
          </p>
          <CodeBlock>{detailExample}</CodeBlock>
          <p className="mt-2 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/naishin/tokyo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/naishin/tokyo <ExternalLink className="h-3 w-3" />
            </a>
            {' / '}
            <a
              href="/api/naishin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/naishin <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">③ OpenAPI 3.1 仕様書</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/openapi</code>
            — GPTs の Actions や各種エージェントにそのままインポートできる機械可読スペック。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/openapi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/openapi <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">④ 逆算・比較・学習計画（クエリで利用）</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">?target=</code> で必要評定平均の逆算、
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">&weeks=</code> で週次の学習計画、
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/compare</code> で複数県比較。
          </p>
          <CodeBlock>{restToolsExample}</CodeBlock>
        </section>

        {/* MCP */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Bot className="h-5 w-5 text-violet-500" />
            MCP（AIエージェント向け）
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            JSON-RPC 2.0 over HTTP の MCP互換エンドポイントです。AIエージェントから
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">list_prefectures</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">get_prefecture</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_naishin</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">compare_prefectures</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">reverse_calc</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">target_to_required_grades</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">build_study_plan</code>
            の7ツールを呼び出せます。さらに <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">resources/list・resources/read</code>（47都道府県を読める一次資料として公開）と
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">prompts/list・prompts/get</code>（内申点を確定値で答え出典を添える定型プロンプト）に対応しています。
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">接続設定</h3>
          <CodeBlock>{mcpConfig}</CodeBlock>

          <h3 className="mb-2 mt-5 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Terminal className="h-4 w-4 text-violet-500" />
            内申点を厳密計算する（概算で終わらせない）
          </h3>
          <CodeBlock>{mcpCall}</CodeBlock>
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-200 bg-violet-50 p-4 text-xs leading-relaxed text-violet-800">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {DATASET_META.aiUsageNote}
            </span>
          </div>
        </section>

        {/* License */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Scale className="h-5 w-5 text-emerald-500" />
            利用条件・出典
          </h2>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-900">
            <p>{DATASET_META.license.summary}</p>
            <p className="mt-3 font-mono text-xs text-emerald-700">
              出典表記例： 出典: My Naishin（{SITE_URL}）
            </p>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            計算方式の一次情報は各都道府県教育委員会の入学者選抜要綱に基づきます。各ページの
            <Link href="/quality" className="mx-1 font-semibold text-indigo-600 underline">
              情報の信頼性への取り組み
            </Link>
            もご覧ください。
          </p>
        </section>

        <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
          運営：
          <Link href="/about/editor-profile" className="mx-1 underline">
            現役中学生エンジニア・しゅうまい
          </Link>
          ／ お問い合わせは
          <Link href="/contact" className="mx-1 underline">
            こちら
          </Link>
        </div>
      </div>
    </div>
  );
}
