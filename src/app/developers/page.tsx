import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Code2, Bot, Scale, ArrowLeft, Terminal, Sparkles, ExternalLink, KeyRound, Gauge, Play } from 'lucide-react';

import { ApiKeyIssuer } from '@/components/Developers/ApiKeyIssuer';
import { ApiPlayground } from '@/components/Developers/ApiPlayground';
import { UpgradeButton } from '@/components/Developers/UpgradeButton';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { DATASET_DISTRIBUTION, DATASET_META, SITE_URL } from '@/lib/naishin-dataset';
import { TIER_POLICIES, TIER_CAPABILITY_MATRIX, formatTierPrice, type ApiTier } from '@/lib/api-tiers';

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
    { "code": "tokyo", "name": "東京都", "maxScore": 65, "coreMultiplier": 1, "practicalMultiplier": 2, ... }
  ]
}`;

  const detailExample = `GET ${SITE_URL}/api/naishin/tokyo

{
  "code": "tokyo", "name": "東京都", "maxScore": 65,
  "formula": { "summary": "中3のみ「主要5教科×1 + 実技4教科×2」=65点満点…" },
  "examples": [
    { "label": "オール3", "total": 39, "max": 65, "percent": 60 },
    { "label": "オール5", "total": 65, "max": 65, "percent": 100 }
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

  const quickstartExample = `# 1) 全47都道府県の一覧（対象学年・倍率・満点・出典）
curl ${SITE_URL}/api/naishin

# 2) 東京都の詳細（計算式・確定値の計算例つき）
curl ${SITE_URL}/api/naishin/tokyo

# 3) APIが生きているか確認（認証不要）
curl ${SITE_URL}/api/status`;

  // V-10：模試会社・塾管理SaaS向けの組み込み例。
  // calculate_naishin（生徒の評定→内申点）はMCP経由のみ公開（RESTのGETには存在しない）。
  // total-score APIは47都道府県のうち5県（hyogo/kyoto/tochigi/niigata/tottori）のみ対応（他は404）＝
  // 内申点APIの47都道府県対応と範囲が異なる点を明記し、対応外の県で無言でエラーにならないよう404を分岐する。
  const integrationTsExample = `// 生徒の評定（1〜5）から内申点を計算する（全47都道府県対応・MCP経由）
async function calculateNaishin(prefectureCode: string, scores: Record<string, number>) {
  const res = await fetch('${SITE_URL}/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'calculate_naishin', arguments: { prefectureCode, scores } },
    }),
  });
  const rpc = await res.json();
  // MCPのtools/callはcontent[0].textにJSON文字列で結果が入る（JSON-RPC 2.0標準）
  return JSON.parse(rpc.result.content[0].text) as {
    total: number; max: number; percent: number; prefectureCode: string; prefectureName: string;
  };
}

// 内申点×当日点の総合得点まで計算する（対応5県のみ・404は「非対応」として分岐）
async function calculateTotalScoreIfSupported(prefectureCode: string, academicRaw: number, reportRaw: number) {
  const res = await fetch(
    \`${SITE_URL}/api/total-score/\${prefectureCode}?academicRaw=\${academicRaw}&reportRaw=\${reportRaw}\`
  );
  if (res.status === 404) return null; // 総合得点APIは兵庫・京都・栃木・新潟・鳥取の5県のみ対応
  return res.json() as Promise<{ total: number; totalMax: number; academic: number; report: number }>;
}

// 模試の成績帳票に「合否判定材料」として差し込む例
const naishin = await calculateNaishin('hyogo', {
  japanese: 4, math: 4, english: 5, science: 3, social: 4, music: 4, art: 3, pe: 4, tech: 3,
});
const totalScore = await calculateTotalScoreIfSupported('hyogo', /* 学力検査素点 */ 420, /* 内申素点 */ naishin.total);
`;

  const integrationCurlExample = `# 1) 生徒の評定から内申点を計算（MCP・全47都道府県）
curl -X POST ${SITE_URL}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"calculate_naishin","arguments":{"prefectureCode":"hyogo","scores":{"japanese":4,"math":4,"english":5,"science":3,"social":4,"music":4,"art":3,"pe":4,"tech":3}}}}'

# 2) 内申点×当日点の総合得点（対応5県のみ・非対応県は404）
curl "${SITE_URL}/api/total-score/hyogo?academicRaw=420&reportRaw=200"`;

  // ZZ-6b（2026-07-24）：Claude Desktop / Cursor / コードから、の導入別クイックスタート。
  // レスポンス例は本物のエンジン関数(calculateNaishin/calcHensachi)を実行して得た確定値をそのまま貼付
  // （捏造ゼロ・数値は本番と同一ソース）。X-3のサンプルリポジトリ資産（github-repo-samples/）を再利用。
  const claudeDesktopConfigPath = `# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Windows
%APPDATA%\\Claude\\claude_desktop_config.json`;

  const claudeDesktopAskExample = `東京都でオール4なら内申点は何点？`;

  const claudeDesktopResponseExample = `{
  "prefectureCode": "tokyo",
  "prefectureName": "東京都",
  "total": 52,
  "max": 65,
  "percent": 80,
  "scores": { "japanese": 4, "math": 4, "english": 4, "science": 4, "social": 4, "music": 4, "art": 4, "pe": 4, "tech": 4 },
  "validGradeRange": "1〜5",
  "toolUrl": "${SITE_URL}/tokyo/naishin",
  "note": "正確な配点・特例は各都道府県の選抜要綱をご確認ください。出典: My Naishin（${SITE_URL}）"
}`;

  const cursorSettingsNote = `Cursor Settings → MCP → "Add new MCP server"（またはプロジェクト直下に .cursor/mcp.json を作成）。設定形式はClaude Desktopと同じJSON。`;

  const cursorAskExample = `偏差値70・平均60・標準偏差10のとき偏差値はいくつ？calculate_hensachiで計算して`;

  const cursorResponseExample = `{
  "score": 70,
  "average": 60,
  "stdDev": 10,
  "hensachi": 60
}`;

  const quickstartCodeNodeExample = `// Node.js 18以降（fetch組み込み・依存パッケージ不要）
const BASE_URL = '${SITE_URL}';

async function calculateNaishinViaMcp(prefectureCode, scores) {
  const res = await fetch(\`\${BASE_URL}/api/mcp\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: 'calculate_naishin', arguments: { prefectureCode, scores } },
    }),
  });
  const rpc = await res.json();
  return JSON.parse(rpc.result.content[0].text); // MCPはcontent[0].textにJSON文字列で結果が入る
}

const naishin = await calculateNaishinViaMcp('tokyo', {
  japanese: 4, math: 4, english: 4, science: 4, social: 4, music: 4, art: 4, pe: 4, tech: 4,
});
console.log(naishin.total); // -> 52`;

  const quickstartCodePythonExample = `# Python 3.8以降（要 pip install requests）
import requests

BASE_URL = "${SITE_URL}"

def calculate_naishin_via_mcp(prefecture_code, scores):
    res = requests.post(f"{BASE_URL}/api/mcp", json={
        "jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": "calculate_naishin", "arguments": {"prefectureCode": prefecture_code, "scores": scores}},
    })
    rpc = res.json()
    import json
    return json.loads(rpc["result"]["content"][0]["text"])

naishin = calculate_naishin_via_mcp("tokyo", {
    "japanese": 4, "math": 4, "english": 4, "science": 4, "social": 4,
    "music": 4, "art": 4, "pe": 4, "tech": 4,
})
print(naishin["total"])  # -> 52`;

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

        {/* クイックスタート（curl 3行・E-3） */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Terminal className="h-5 w-5 text-indigo-500" />
            クイックスタート（30秒）
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            登録・APIキーなしで、今すぐ試せます。
          </p>
          <CodeBlock>{quickstartExample}</CodeBlock>
        </section>

        {/* APIプレイグラウンド（W-15・その場で動くものをお見せできる実演用） */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Play className="h-5 w-5 text-indigo-500" />
            APIプレイグラウンド
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            都道府県を選んで、実際にAPIを呼び出してみてください。レスポンスはこの場でそのまま表示されます（登録不要）。
          </p>
          <ApiPlayground />
        </section>

        {/* 利用シーン（事例・E-3） */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Sparkles className="h-5 w-5 text-violet-500" />
            どんな用途で使えるか
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-bold text-slate-800">進路相談AIエージェント</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                MCPツール（calculate_naishin・reverse_calc等）を呼び出し、生徒の評定から内申点を厳密計算し、目標までの差を答える。
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-bold text-slate-800">塾・進路支援SaaSの内申自動算出</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                47都道府県ぶんの計算方式を自前実装せず、REST APIから都道府県コードを渡すだけで内申点を算出。
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-bold text-slate-800">受験情報メディア・比較サイト</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                CSV/JSONを定期取得し、都道府県別の入試制度比較表・記事の一次データとして引用（出典明記）。
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-bold text-slate-800">研究・統計利用</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                全国の内申点算出方式の構造化データセットとして、比較研究や教育政策分析に利用。
              </p>
            </div>
          </div>
        </section>

        {/* 組み込みコードサンプル（模試会社・塾管理SaaS向け・V-10） */}
        <section className="mb-10 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Code2 className="h-5 w-5 text-emerald-600" />
            組み込みコードサンプル：模試の合否判定に内申計算を足す
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            模試の成績帳票・塾管理SaaSに、47都道府県それぞれ異なる内申点の計算ロジックを自前実装せずに組み込む例です。
            生徒の評定（1〜5）から内申点を出す<code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_naishin</code>
            はMCP経由のみで提供（REST GETには存在しません）。内申×当日点の総合得点API
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">/api/total-score/{'{code}'}</code>
            は現在<strong>兵庫・京都・栃木・新潟・鳥取の5都道府県のみ</strong>対応（内申点APIの47都道府県対応とは範囲が異なります）。
            対応外の県は404を返すので、下記のように分岐してください。
          </p>
          <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">TypeScript（fetch）</h3>
          <CodeBlock>{integrationTsExample}</CodeBlock>
          <h3 className="mb-2 mt-4 text-sm font-bold text-slate-700">curl</h3>
          <CodeBlock>{integrationCurlExample}</CodeBlock>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            レート制限・商用利用時の出典表記省略は
            <Link href="#pricing" className="mx-1 font-semibold text-emerald-700 underline">Proプラン</Link>
            をご参照ください。データ連携のご相談は
            <Link href="/partner" className="mx-1 font-semibold text-emerald-700 underline">パートナー募集ページ</Link>
            からどうぞ。
          </p>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Scale className="h-5 w-5 text-slate-500" />
            計算ロジックの検証可能性
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            「この計算式は本当に正しいのか」を確認できるよう、実装コードと都道府県教育委員会の一次ソースの
            対応関係をまとめた技術文書をGitHubで公開しています。各県の計算式・出典URL・確認日、および
            計算式の一貫性を検証するテストコードへのポインタを含みます。
          </p>
          <a
            href="https://github.com/shumai1223/my-naisin/blob/main/docs/calculation-verification-2026.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            計算ロジック検証ガイドを見る（GitHub） <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

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

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">④ CSVダウンロード（表計算・データ引用向け）</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/naishin/csv</code>
            — 全47都道府県を1行1県のフラットなCSV（BOM付きUTF-8）で配布。Excel・Googleスプレッドシート・
            データカタログ・研究用途にそのまま読み込めます（JSONと同じ正準ソースから生成）。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            ダウンロード：{' '}
            <a
              href="/api/naishin/csv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/naishin/csv <ExternalLink className="h-3 w-3" />
            </a>
            <span className="ml-2">列：code, name, region, target_grades, grade1〜3_multiplier, core/practical_multiplier, max_score, tool_url, source_url, last_verified ほか</span>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑤ 総合得点方式（内申点＋学力検査の統一エンジン）</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/total-score</code>
            {' / '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/total-score/{'{code}'}</code>
            {' — '}兵庫・京都・栃木・新潟・鳥取の総合得点システム定義と計算式。
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?academicRaw=&reportRaw=</code>
            で総合得点を計算、
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?targetTotal=&reportRaw=</code>
            で必要な学力検査点を逆算できます。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/total-score/hyogo?academicRaw=500&reportRaw=250"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/total-score/hyogo?academicRaw=500&amp;reportRaw=250 <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑥ 偏差値の計算・逆算・順位変換</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/hensachi</code>
            {' — '}
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?score=&average=&stdDev=</code>
            で偏差値を計算、
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?targetHensachi=&average=&stdDev=</code>
            で必要点数を逆算、
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?rank=&population=</code>
            /
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?hensachi=&population=</code>
            で順位⇄偏差値を相互変換できます。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/hensachi?score=70&average=60&stdDev=10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/hensachi?score=70&amp;average=60&amp;stdDev=10 <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑥b 偏差値 対応表（正規分布から算出）</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/hensachi/percentile-table</code>
            — 偏差値→上位%・母集団順位の対応表。
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?values=45,50,55</code>
            で任意の偏差値を指定可能。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/hensachi/percentile-table"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/hensachi/percentile-table <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑦ 教育費シミュレーション</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/education-cost</code>
            {' / '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/education-cost/path-to-university</code>
            {' — '}文部科学省「子供の学習費調査」等に基づく教育費総額・高校〜大学の進路別総額を計算（<code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">/kyouiku-hi</code>・<code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">/shinro-hiyou</code>と同一エンジン）。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/education-cost?currentGrade=1&juniorCourse=public&highCourse=public&jukuType=kobetsu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/education-cost（例） <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑦b 高校入試の倍率計算</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/bairitsu</code>
            {' — '}
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?applicants=&capacity=</code>
            で志願倍率、
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">?testTakers=&passers=</code>
            で実質倍率を計算します（学校別の実データは県教委一次情報のみが正確なため、本APIは比率計算のみを提供）。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/bairitsu?applicants=120&capacity=80"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/bairitsu?applicants=120&amp;capacity=80 <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑧ ステータス確認（認証不要）</h3>
          <p className="mb-2 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/status</code>
            — APIが稼働しているか・データセットのバージョンを軽量に確認（レート制限なし）。
          </p>
          <p className="mt-1 text-xs text-slate-500">
            実際に開く：{' '}
            <a
              href="/api/status"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline"
            >
              /api/status <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            データの最終検証日・一次ソース確認履歴も含めた信頼性の全体像は{' '}
            <Link href="/reliability" className="font-semibold text-indigo-600 underline">
              /reliability
            </Link>{' '}
            にまとめています。
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">⑨ 逆算・比較・学習計画（クエリで利用）</h3>
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
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_hensachi</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">reverse_calc_hensachi</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">hensachi_rank_convert</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">list_total_score_systems</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_total_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">reverse_calc_total_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_bairitsu</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_education_cost</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_path_to_university_cost</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">get_stats_distribution</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_tokyo_total_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_kanagawa_s_value</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_osaka_total_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_aichi_total_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_chiba_k_value</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_saitama_total_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_fukuoka_score</code>
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">calculate_hokkaido_rank</code>
            の25ツールを呼び出せます。さらに <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">resources/list・resources/read</code>（47都道府県を読める一次資料として公開）と
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

        {/* 使う場所別クイックスタート（ZZ-6b・2026-07-24） */}
        <section className="mb-10 rounded-2xl border-2 border-violet-200 bg-violet-50/40 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Bot className="h-5 w-5 text-violet-600" />
            使う場所別クイックスタート（10分）
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600">
            Claude Desktop・Cursor・自前のコードのそれぞれで、内申点データAPI/MCPを実際に呼び出す最短手順です。
            レスポンス例はすべて本物の計算エンジンを実行して得た確定値をそのまま貼付しています。
          </p>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-700">① Claude Desktop</h3>
          <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
            <li>設定ファイルを開く</li>
          </ol>
          <CodeBlock>{claudeDesktopConfigPath}</CodeBlock>
          <ol start={2} className="mb-2 mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
            <li>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">mcpServers</code> に以下を追加して保存
            </li>
          </ol>
          <CodeBlock>{mcpConfig}</CodeBlock>
          <ol start={3} className="mb-2 mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
            <li>Claude Desktopを再起動</li>
            <li>チャットで日本語のまま聞くだけで、Claudeが自動で calculate_naishin ツールを呼び出す</li>
          </ol>
          <p className="mb-2 text-sm text-slate-600">
            入力例：<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{claudeDesktopAskExample}</code>
          </p>
          <p className="mb-2 text-xs font-semibold text-slate-500">実際に返る値（ツール呼び出しの結果）：</p>
          <CodeBlock>{claudeDesktopResponseExample}</CodeBlock>

          <h3 className="mb-2 mt-8 text-sm font-bold text-slate-700">② Cursor</h3>
          <p className="mb-2 text-sm leading-relaxed text-slate-600">{cursorSettingsNote}</p>
          <CodeBlock>{mcpConfig}</CodeBlock>
          <p className="mb-2 mt-3 text-sm text-slate-600">
            入力例：<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{cursorAskExample}</code>
          </p>
          <p className="mb-2 text-xs font-semibold text-slate-500">実際に返る値（ツール呼び出しの結果）：</p>
          <CodeBlock>{cursorResponseExample}</CodeBlock>

          <h3 className="mb-2 mt-8 text-sm font-bold text-slate-700">③ コードから（Node.js / Python）</h3>
          <p className="mb-2 text-sm leading-relaxed text-slate-600">
            AIクライアントを介さず、自前のアプリ・スクリプトからMCPエンドポイントを直接POSTする方法です。
            依存パッケージなしで動くNode.js（fetch組み込み）版と、Python（requests）版を用意しました。
          </p>
          <h4 className="mb-1 mt-3 text-xs font-bold text-slate-600">Node.js（18以降）</h4>
          <CodeBlock>{quickstartCodeNodeExample}</CodeBlock>
          <h4 className="mb-1 mt-3 text-xs font-bold text-slate-600">Python（3.8以降・requests）</h4>
          <CodeBlock>{quickstartCodePythonExample}</CodeBlock>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            上記2言語版＋curlのチートシートをまとめた実行可能サンプル一式は、社内のサンプルリポジトリ資産
            （README・node-fetch-example.mjs・python-requests-example.py・curl-cheatsheet.sh）としても
            管理しています。いずれも本番APIへのライブリクエストで動作検証済みです。
          </p>
        </section>

        {/* 料金プラン・APIキー */}
        <section id="pricing" className="mb-10 scroll-mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Gauge className="h-5 w-5 text-indigo-500" />
            料金プランとレート上限
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            <strong>キー無しでもそのまま利用できます</strong>（匿名ティア・出典明記が条件）。
            継続利用や大量呼び出しには下の<strong>無料APIキー</strong>を発行するとレート上限と月次クォータが上がります。
            本番組み込み（受験アプリ・進路SaaS・塾チェーン）やデータライセンス（CSV/JSONの定期更新）は Pro / Scale をご利用ください。
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs text-slate-500">
                  <th className="py-2 pr-3 font-semibold">プラン</th>
                  <th className="py-2 pr-3 font-semibold">レート/分</th>
                  <th className="py-2 pr-3 font-semibold">月次クォータ</th>
                  <th className="py-2 pr-3 font-semibold">料金</th>
                  <th className="py-2 font-semibold">対象</th>
                </tr>
              </thead>
              <tbody>
                {(['anonymous', 'free', 'pro', 'scale'] as ApiTier[]).map((t) => {
                  const p = TIER_POLICIES[t];
                  return (
                    <tr key={t} className="border-b border-slate-100 align-top">
                      <td className="py-2.5 pr-3 font-semibold text-slate-800">{p.label}</td>
                      <td className="py-2.5 pr-3 text-slate-600">{p.ratePerMinute.toLocaleString('ja-JP')}</td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {p.monthlyQuota > 0 ? p.monthlyQuota.toLocaleString('ja-JP') : '個別 / 計測なし'}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-slate-700">{formatTierPrice(t)}</td>
                      <td className="py-2.5 text-xs text-slate-500">{p.audience}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            ※ レート上限はベストエフォート、月次クォータは発行キー単位で計測します。Pro / Scale・年額データライセンスのお見積りは
            <Link href="/contact" className="mx-1 underline">お問い合わせ</Link>から。
          </p>

          {/* 機能比較（金を払う理由を明示＝フリーミアムの罠回避） */}
          <h3 className="mb-2 mt-6 text-sm font-bold text-slate-700">プラン別にできること</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs text-slate-500">
                  <th className="py-2 pr-3 font-semibold">機能</th>
                  {(['anonymous', 'free', 'pro', 'scale'] as ApiTier[]).map((t) => (
                    <th key={t} className="py-2 pr-3 text-center font-semibold">{TIER_POLICIES[t].label.split('（')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIER_CAPABILITY_MATRIX.map((cap) => (
                  <tr key={cap.label} className="border-b border-slate-100">
                    <td className="py-2 pr-3 text-slate-700">{cap.label}</td>
                    {(['anonymous', 'free', 'pro', 'scale'] as ApiTier[]).map((t) => (
                      <td key={t} className="py-2 pr-3 text-center">
                        {cap.has(TIER_POLICIES[t]) ? (
                          <span className="font-bold text-emerald-600">✓</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-2 mt-6 flex items-center gap-2 text-sm font-bold text-slate-700">
            <KeyRound className="h-4 w-4 text-indigo-500" />
            無料APIキーを今すぐ発行
          </h3>
          <ApiKeyIssuer />
          <p className="mt-2 text-xs text-slate-500">
            キーの有効性確認：<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /api/keys</code>（Authorization: Bearer &lt;key&gt;）。
            発行は <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">POST /api/keys</code>。
          </p>

          {/* B2B：本番組み込みの価値提案＋決済導線 */}
          <div className="mt-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <h3 className="text-base font-bold text-slate-800">本番組み込みなら Pro — 自前実装を省けます</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              47都道府県×全方式（東京1020点・神奈川S値・大阪タイプ・千葉K値・北海道ランク…）の内申点計算を
              自前で実装・毎年保守するのは大きな負担です。Pro なら<strong>高レート・大量クォータ・出典明記なしでの商用利用・SLA</strong>付きで、
              要綱改訂の追従も当方が肩代わりします。受験アプリ・進路SaaS・塾チェーンの内申自動算出にそのまま組み込めます。
            </p>
            <div className="mt-4">
              <UpgradeButton tier="pro" label="Proにアップグレード（月額 ¥9,800〜）" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              塾・学習塾・進路指導の事業者様は、
              <Link href="/partner" className="mx-1 font-semibold text-amber-700 underline">パートナー向けページ</Link>
              で埋め込みウィジェットやデータ提供メニューもご覧いただけます。
            </p>
          </div>

          {/* Enterprise（Scale）：名称・SLA・データ再配布ライセンスを明示（E-6・2026-07-10 👤裁定B＝文言強調のみ・価格は個別見積りのまま） */}
          <div className="mt-6 rounded-2xl border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-indigo-100 p-6">
            <h3 className="text-base font-bold text-slate-800">
              大規模利用・データライセンスなら {TIER_POLICIES.scale.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {TIER_POLICIES.scale.audience}向け。レート上限
              <strong className="mx-1">{TIER_POLICIES.scale.ratePerMinute.toLocaleString('ja-JP')}回/分</strong>
              に加え、<strong>{TIER_POLICIES.scale.sla}</strong>の専用SLAと、
              <strong>データ再配布ライセンス（CSV/JSONの定期更新フィード＋更新通知つき）</strong>が付きます。
              47都道府県全方式の要綱改訂の追従・保守もこちらで引き受けます。
            </p>
            <div className="mt-4">
              <UpgradeButton tier="scale" label="Enterpriseについて相談する" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              価格は利用規模・データライセンス範囲に応じた{formatTierPrice('scale')}。
              <Link href="/contact" className="mx-1 font-semibold text-indigo-700 underline">お問い合わせ</Link>ください。
            </p>
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
