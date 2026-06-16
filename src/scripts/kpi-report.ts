#!/usr/bin/env node

/**
 * 週次「運用ダイジェスト」生成（P6-1）。
 *
 * 目的（[[fable5-master-plan-2026-06]]）：日曜60分運用の入口を自動化し「どこを見るか」に悩まない状態を作る。
 * gsc-weekly-report.ts が SEO の機会検出を担うのに対し、本スクリプトは**換金の本線**をまとめる：
 *   換金ファネル（GA4）／ファーストパーティ・クリック（/go・D1）／走っている実験と勝者判定／名簿velocity。
 *
 * 設計：ライブAPIに依存せず常に有効なMarkdownを出す（実験レジストリは静的・チェックリストは常に有用）。
 * 各データ源（GA4 / D1）は接続済みなら手順どおり差し込み、未接続なら「未接続＋点火手順」を表示。
 *
 * 実行: npx tsx src/scripts/kpi-report.ts
 * 運用: .github/workflows/kpi-weekly.yml が週1で実行し Issue を起票。
 */

import fs from 'node:fs';

import { runningExperiments } from '@/lib/experiments';

const GA4_PROPERTY = 'G-VRVSVK1X5Z';

function ymd(daysAgo = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function buildReport(): string {
  const today = ymd(0);
  const weekAgo = ymd(7);

  const experimentsBlock = runningExperiments()
    .map(
      (e) =>
        `- **${e.id}**（${e.placement ?? '—'} / 主要指標: \`${e.primaryMetric}\`）\n` +
        `  - 仮説: ${e.hypothesis}\n` +
        `  - アーム: ${e.arms.map((a) => `\`${a.id}\`（${a.label}）`).join(' vs ')}\n` +
        `  - 判定: GA4 で \`experiment_impression\`×\`${e.primaryMetric}\` をアーム別に集計→ \`judgeWinner()\` に投入。有意なら勝者を lead-config / コピーへ昇格。`
    )
    .join('\n');

  return `# 📈 週次 運用ダイジェスト（換金の本線）: ${today}

対象期間の目安：${weekAgo} 〜 ${today}（GSCの機会検出は別Issue「GSC週次レポート」を参照）

## 1. 換金ファネル（GA4 \`${GA4_PROPERTY}\`）
\`npm run ga4:weekly\` を実行し、WoW で各段の歩留まりを確認する。
\`\`\`
tool_start → calc_complete → result_view → cta_view → affiliate_click → lead_submit
\`\`\`
- 見るポイント：どの段で最も落ちているか（＝次に直す場所）。\`placement\`/\`program\`/\`pref\` 別の内訳（カスタムディメンション登録済みなら）。
- cta_view÷result_view（換金CTAの到達率）、affiliate_click÷cta_view（面ごとのCTR）。

## 2. ファーストパーティ・クリック（/go ・ D1）
GA4 \`affiliate_click\` は ITP/広告ブロッカーで最大3割欠測する。/go の D1 \`clicks\` で実数を補完する。
\`\`\`
wrangler d1 execute my-naishin-leads --remote --json \\
  --command "SELECT affiliate_id, placement, prefecture, COUNT(*) c FROM clicks \\
             WHERE created_at >= datetime('now','-7 days') GROUP BY 1,2,3 ORDER BY c DESC LIMIT 30"
\`\`\`
- 見るポイント：program×面×県で最も押されているオファー＝lead-config の勝者候補。
- ※ D1 未バインドなら 0 件。wrangler.jsonc の LEADS_DB を有効化＋ migrations/0002 を適用すると点灯。

## 3. 成約（lagging・A8 / もしも）
各ASP管理画面で「発生」「確定」を確認（クリックは leading＝上の1・2、成約は lagging）。
- もしも：審査なし提携の無料体験/FP相談（fp-soudan / moshimo-*）の発生件数。
- A8：通信教育/塾の資料請求・無料体験の発生件数。
- 勝った\`program×面\`を lead-config（PLACEMENT/PREFECTURE_PLACEMENT_LEAD_OVERRIDES）に固定。

## 4. 走っている実験（registry → judgeWinner）
${experimentsBlock || '- （現在 running の実験はありません）'}

## 5. 名簿velocity（堀A）
- 今週の \`lead_submit\`（GA4）と、D1 \`leads\`（unsubscribed=0）の累計。
\`\`\`
wrangler d1 execute my-naishin-leads --remote \\
  --command "SELECT COUNT(*) total, SUM(CASE WHEN created_at>=datetime('now','-7 days') THEN 1 ELSE 0 END) last7 FROM leads WHERE unsubscribed=0"
\`\`\`
- 母数が貯まったら \`npm run newsletter --trigger=<季節> --recipients=...\` で月1配信。

## 今週の一手（テンプレ）
1. ファネルの最大の詰まりを1つ特定（上の1）。
2. /go と GA4 のズレ＝欠測補正で勝者候補を更新（上の2）。
3. 有意になった実験があれば lead-config へ昇格（上の4）。
4. それ以外は触らない（受験期は set-and-forget）。
`;
}

function main() {
  const report = buildReport();
  fs.writeFileSync('kpi-weekly-report.md', report, 'utf8');
  process.stdout.write(report + '\n');
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report_date=${ymd(0)}\n`);
  }
}

main();
