import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, Building2, Code2, ShieldCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { isPartnerDemoEnabled } from '@/lib/partner-demo/flag';
import { SITE_URL } from '@/lib/naishin-dataset';
import { TIER_POLICIES } from '@/lib/api-tiers';

/**
 * パートナー統合デモ（AA-2・build-not-launch）。
 * NEXT_PUBLIC_PARTNER_DEMO_ENABLED='1'（既定off）のときだけ公開する内部確認用デモ。
 * 商標配慮のため実ブランド名・ロゴは一切使わず「御社名」のプレースホルダのみで構成する
 * （[[fable5-fullaccel-backlog-2026-07]] AA-2「実ブランド名/ロゴは使わない」制約）。
 * 数値は全て src/lib/api-tiers.ts の正本テーブルから参照し、ここでハードコードしない
 * （TIER_POLICIESが変われば自動的に追従＝ドリフト防止）。
 */
export const metadata: Metadata = {
  title: 'パートナー統合デモ（内部確認用） | My Naishin',
  description: '内申点計算エンジンの画面組み込み・API連携イメージを示す内部確認用デモ（プレースホルダ表示・実在企業のブランドは使用しません）。',
  robots: { index: false, follow: false },
};

const pro = TIER_POLICIES.pro;

const API_SAMPLE_REQUEST = `curl -X POST https://my-naishin.com/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <APIキー>" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "calculate_naishin",
      "arguments": {
        "prefectureCode": "tokyo",
        "scores": {
          "japanese": 4, "math": 4, "english": 4,
          "science": 4, "social": 4, "music": 4,
          "art": 4, "pe": 4, "tech": 4
        }
      }
    }
  }'`;

// 2026-07-24に calculateNaishin({prefectureCode:'tokyo', scores: オール4}) を実行して得た実測値
// （src/lib/naishin-dataset.ts のcalculateNaishinをそのまま呼び出し・捏造なし）。
const API_SAMPLE_RESPONSE = `{
  "prefectureCode": "tokyo",
  "prefectureName": "東京都",
  "total": 52,
  "max": 65,
  "percent": 80,
  "validGradeRange": "1〜5",
  "toolUrl": "https://my-naishin.com/tokyo/naishin",
  "note": "正確な配点・特例は各都道府県の選抜要綱をご確認ください。出典: My Naishin（https://my-naishin.com）"
}`;

export default function PartnerDemoPage() {
  if (!isPartnerDemoEnabled(process.env.NEXT_PUBLIC_PARTNER_DEMO_ENABLED)) {
    notFound();
  }

  const url = `${SITE_URL}/partner-demo`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'パートナー統合デモ', url },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">パートナー統合デモ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-xl">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">パートナー統合デモ（内部確認用）</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              「内申点を直接計算する手段がない」という課題に対する2つの統合イメージです。
              実在企業のブランド・ロゴは使用せず、すべて「御社名」のプレースホルダで表示しています。
              技術統合の詳細は
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">docs/partner-integration-onepager-2026-07.md</code>
              を参照してください。
            </p>
          </header>

          {/* パターン①: 画面組み込み型 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Building2 className="h-5 w-5 text-slate-600" />
              パターン① 画面組み込み型（iframe埋め込み）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              生徒・保護者向け画面に、貴社サービスの世界観のまま計算ツールを埋め込むイメージです（下の枠は貴社サービスの画面を模したプレースホルダ）。
            </p>
            <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-300">
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5 text-white">
                <div className="h-5 w-5 rounded bg-slate-400" aria-hidden />
                <span className="text-sm font-bold">御社名 保護者向けサービス（イメージ）</span>
              </div>
              <div className="bg-slate-50 p-4">
                <iframe
                  src="/embed/naishin"
                  width="100%"
                  height="560"
                  style={{ border: '1px solid #e5e7eb', borderRadius: 12, maxWidth: 480, margin: '0 auto', display: 'block' }}
                  title="内申点計算ウィジェット（御社名向けデモ）"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              実際の埋め込みでは、貴社のCSSに合わせた見た目調整・ロゴ差し替え等のカスタム化も相談可能です（クレジット表記の扱いは商談で個別調整）。
            </p>
          </section>

          {/* パターン②: バックエンド連携型 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Code2 className="h-5 w-5 text-slate-600" />
              パターン② バックエンド連携型（模試判定システム等からのAPI呼び出し）
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              貴社の既存システム（例: 模試判定システム）から裏側で内申点計算エンジンを呼び出す例です。
              リクエスト・レスポンスとも実際に稼働しているエンジンで検証した実値です（本デモページ用に別途作成した値ではありません）。
            </p>
            <div className="mb-3">
              <div className="mb-1 text-xs font-bold text-slate-500">リクエスト例（東京都・9教科オール4）</div>
              <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{API_SAMPLE_REQUEST}</pre>
            </div>
            <div>
              <div className="mb-1 text-xs font-bold text-slate-500">レスポンス例（2026-07-24実測）</div>
              <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{API_SAMPLE_RESPONSE}</pre>
            </div>
          </section>

          {/* レート/SLA要約 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
              本番組込み向け（Proティア）の目安
            </h2>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-slate-500">レート上限</dt>
                <dd className="font-bold text-slate-800">{pro.ratePerMinute.toLocaleString()}req/分</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-slate-500">月次クォータ</dt>
                <dd className="font-bold text-slate-800">{pro.monthlyQuota.toLocaleString()}/月</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-slate-500">SLA目安</dt>
                <dd className="font-bold text-slate-800">{pro.sla}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs text-slate-500">月額目安</dt>
                <dd className="font-bold text-slate-800">¥{pro.monthlyPriceJpy.toLocaleString()}〜</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              大規模利用・データライセンス（年額）は個別見積り（Scale/Enterpriseティア）。詳細は
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">docs/partner-integration-onepager-2026-07.md</code>
              参照。
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
