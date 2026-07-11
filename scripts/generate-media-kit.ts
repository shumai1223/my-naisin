/**
 * 媒体資料（メディアキット）自動生成＝直接契約(D-1/D-2)・API B2B向け営業資料の土台（T-3）。
 *
 *   npx tsx scripts/generate-media-kit.ts --out=media-kit-2026-08.md
 *   # 月次トラフィック実測を載せる場合（任意・未指定なら「非公開」表示＝捏造回避）：
 *   npx tsx scripts/generate-media-kit.ts --month=2026年8月 --clicks=12345 --sessions=6789
 *
 * 思想（[[fable5-loop-protocol]]の捏造ゼロ原則）：
 *   県別カバレッジ・APIツール数・公開ページ数はいずれもコードの実データ（レジストリ・ファイル数）
 *   から実測する＝手打ちで古くなる数字を出さない。トラフィック実数（クリック/セッション）は
 *   このスクリプトの中に持たない一次情報（GSC/GA4）なので、CLI引数で渡された時だけ載せ、
 *   未指定なら「非公開（要問い合わせ）」と明示する（generate-sales-report.tsと同じ規約）。
 *
 * generate-sales-report.ts（送客実績＝クリック実績ベースの月次レポート）とは対象読者が異なる：
 *   media-kit = 初回接触時に送る「会社紹介＋対応可能な範囲」の一枚もの（D-1/D-2・E-1向け）
 *   sales-report = 既に送客実績のあるASPプログラムとの特単交渉に使う実績レポート
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { PREFECTURES } from '@/lib/prefectures';
import { HUB_CALCULATORS, HUB_EXPLAINERS } from '@/lib/total-score/hub';
import { STATIC_PAGES } from '@/lib/page-registry';
import { SITE_URL } from '@/lib/naishin-dataset';

const __dirname = dirname(fileURLToPath(import.meta.url));

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

/**
 * MCPツール数を /api/mcp/route.ts の TOOLS 配列から実カウントする（手打ち定数を持たない＝古くならない）。
 * route.ts は Next.js のルートファイルで GET/POST/OPTIONS 以外の export を増やしたくないため、
 * import ではなくソースを読んで TOOLS 配列の範囲内の `name: '...'` エントリ数を数える。
 */
function countMcpTools(): number {
  const routePath = join(__dirname, '..', 'src', 'app', 'api', 'mcp', 'route.ts');
  const src = readFileSync(routePath, 'utf8');
  const start = src.indexOf('const TOOLS = [');
  if (start === -1) return 0;
  const end = src.indexOf('] as const;', start);
  const body = end === -1 ? src.slice(start) : src.slice(start, end);
  return (body.match(/\n\s*name: '/g) ?? []).length;
}

function main() {
  const monthLabel = arg('month') ?? new Date().toISOString().slice(0, 7);
  const out = arg('out');
  const clicks = arg('clicks');
  const sessions = arg('sessions');

  const prefectureCount = PREFECTURES.length;
  const calculatorCount = HUB_CALCULATORS.length;
  const explainerCount = HUB_EXPLAINERS.length;
  const mcpToolCount = countMcpTools();
  const pageCount = STATIC_PAGES.length;

  const trafficSection =
    clicks || sessions
      ? `- 月間クリック数（実測・${monthLabel}）: **${clicks ? Number(clicks).toLocaleString('ja-JP') : '非公開（要問い合わせ）'}**
- 月間セッション数（実測・${monthLabel}）: **${sessions ? Number(sessions).toLocaleString('ja-JP') : '非公開（要問い合わせ）'}**`
      : `- 月間トラフィック実測値: 非公開（要問い合わせ・お打ち合わせ時に開示可能）`;

  const md = `# My Naishin — 媒体資料（${monthLabel}）

> My Naishin（${SITE_URL}）は、全国の公立高校入試における内申点・偏差値・総合得点の計算方式を
> 都道府県の教育委員会が公表する入学者選抜要綱（一次情報）に基づいて機械可読データ化した、
> 中学生・保護者向けの受験対策サイトです。

## サイト規模（実測・コードのレジストリから自動集計）

- 内申点計算に対応する都道府県: **${prefectureCount}/47**（全都道府県）
- 総合得点・合否判定の計算機を提供する都道府県: **${calculatorCount}県**（残る県は制度解説のみ・計算確証待ちは計算機を公開しない方針）
- 総合得点の制度解説を提供する都道府県: **${explainerCount}県**
- 公開ページ数: **${pageCount}ページ**
- 公開API/MCPツール数: **${mcpToolCount}ツール**（REST + MCP（AIエージェント向けJSON-RPC）両対応）

${trafficSection}

## データの一次情報性

すべての計算方式・配点は、各都道府県教育委員会が公表する入学者選抜要綱を一次情報として確認したもので、
学校別の合格ボーダーのような未検証の情報は掲載していません（[[prefecture-exam-systems-verified]]）。
入試制度の変更は継続的に一次情報から追従・更新しています。

## 提供できるもの

1. **API/MCPデータ連携**（E-1）— 内申点・偏差値・総合得点の計算エンジンをREST/MCPで提供。貴社サービスへの組み込みで
   「都道府県ごとに異なる計算方式」の実装・保守負担を肩代わりできます。デモ: [docs/api-demo.md](../docs/api-demo.md)
2. **保護者向け送客連携**（D-1/D-2）— 内申点・偏差値を計算した直後の高インテントな保護者・生徒トラフィックへの
   資料請求・無料体験導線。実績は月次で[送客実績レポート](./generate-sales-report.ts)として提示可能です。
3. **一次データの引用・埋め込み**（E-1のC区分）— 教育メディア・受験情報サイト向けに、都道府県別の内申点計算方式を
   一次情報として引用・埋め込みウィジェット化できます。

## 連絡先・次のステップ

まずは15分程度のオンラインお打ち合わせで、貴社のユースケースに合わせたご提案をさせていただきます。
[${SITE_URL}/developers](${SITE_URL}/developers) から実際のAPI/MCPの動作をご確認いただけます。

---
生成日時: ${new Date().toISOString()}（このファイルは \`npx tsx scripts/generate-media-kit.ts\` で再生成できます）
`;

  if (out) {
    writeFileSync(out, md, 'utf8');
    console.log(`✓ 媒体資料を書き出しました: ${out}`);
  } else {
    process.stdout.write(md);
  }
}

main();
