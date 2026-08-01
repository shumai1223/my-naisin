#!/usr/bin/env node
/**
 * Λ-21（留守番モード・第1層）実装項目3: デプロイ後スモークチェック。
 *
 * push→Cloudflare Workers自動デプロイの後、本番URL（ホームページ＋/api/status）が
 * 実際に200を返しているかを確認する。失敗時はDISCORD_WEBHOOK_URLが設定されていれば
 * Discordへ即時通知する（未設定ならdaily-brief-health.tsと同じくskipするだけ）。
 *
 * 実行: npx tsx src/scripts/deploy-smoke-check.ts
 *
 * ⚠️現時点では「pushの直後に自動実行する」結線は未実装（それにはloop-start.bat側の
 * 変更が必要でリポジトリ外・無人loop中は見送り＝[[loop-question-note]]参照）。
 * このスクリプト自体は手動実行、または改善モードの周回で随時実行できる状態にしてある。
 * exit codeは1(失敗)/0(成功)を返すため、将来bat側から`if errorlevel 1`で拾うことも可能。
 */
import { buildSmokeCheckMessage, evaluateSmokeCheck, toSmokeCheckResult, DEFAULT_SMOKE_CHECK_TARGETS } from '@/lib/smoke-check';
import { postDiscordWebhook } from '@/lib/discord-notify';

const FETCH_TIMEOUT_MS = 15_000;

async function checkOne(url: string): Promise<{ status: number } | { error: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    return { status: res.status };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const results = await Promise.all(
    DEFAULT_SMOKE_CHECK_TARGETS.map(async (target) => toSmokeCheckResult(target, await checkOne(target.url)))
  );
  const summary = evaluateSmokeCheck(results);
  const timestampLabel = new Date().toISOString();
  const message = buildSmokeCheckMessage(summary, timestampLabel);
  console.log(message);

  if (!summary.allOk) {
    const discordResult = await postDiscordWebhook(process.env.DISCORD_WEBHOOK_URL, message);
    if (discordResult.skipped) {
      console.log('Discord通知: DISCORD_WEBHOOK_URL未設定のためskip');
    } else if (!discordResult.ok) {
      console.error('Discord通知に失敗:', discordResult.error);
    }
  }

  process.exit(summary.allOk ? 0 : 1);
}

main().catch((e) => {
  console.error('deploy-smoke-check failed:', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
