/**
 * Web Push 配信スクリプト（出願締切・通知表リマインド＝H-NEW）。
 *
 *   # 0) 初回だけ：VAPID鍵を生成して env に設定（NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT）
 *   npx tsx scripts/push-send.ts --gen-keys
 *
 *   # 1) D1 から購読をエクスポート（revoked=0 のみ。created_atはrecalc-reminderシナリオの絞り込みに使う）
 *   wrangler d1 execute my-naishin-leads --remote --json \
 *     --command "SELECT endpoint, p256dh, auth, prefecture, audience, created_at FROM push_subscriptions WHERE revoked=0" \
 *     > subs.json
 *
 *   # 2) ドライラン（送らない）→ 本送信（--send）。文面は手打ちでも、--scenario指定でも可。
 *   npx tsx scripts/push-send.ts --subs=subs.json --title="出願はお済みですか？" --body="出願締切が近づいています" --url="/juken-schedule"
 *   npx tsx scripts/push-send.ts --subs=subs.json --title="..." --body="..." --url="/total-score" --send
 *
 *   # 2') シナリオ配信（C-3）：文面はpush-scenarios.tsの単一ソースから自動決定。
 *   #    recalc-reminder は --recalc-days（既定30・許容±--recalc-tolerance既定1日）で
 *   #    createdAtが「約N日前」の購読だけに絞る（日次実行を想定・全件への誤爆を防ぐ）。
 *   npx tsx scripts/push-send.ts --subs=subs.json --scenario=recalc-reminder --send
 *   npx tsx scripts/push-send.ts --subs=subs.json --scenario=parent-window-eve --send   # 窓前日のみ自動選択、窓前日でなければ送信0件
 *
 * 思想（[[fable5-master-plan-2026-06]] / [[north-star-vision-2026-06]]）：
 *   名簿＋プッシュは Google 非依存の再訪チャネル。1,000人購読すれば「1プッシュで数万円」が動く装置になる。
 *
 * 安全：
 *  - 既定は dry-run（送らない）。本送信は --send。
 *  - web-push はこのスクリプト専用の依存（本体ビルドには不要なので package.json には入れない）。
 *    初回だけ `npm i web-push` を実行してから使う。未インストールでも tsc/CI/本番ビルドは壊れない（動的import）。
 *  - VAPID鍵が無ければ中止。404/410 の endpoint は「revoke候補」として一覧出力（D1で revoked=1 に）。
 */

import { readFileSync, writeFileSync } from 'node:fs';

import { VAPID_PUBLIC_KEY } from '@/lib/push-config';
import { PUSH_SCENARIOS, activeParentWindowEveScenario, isAroundDaysAgo, type PushScenarioId } from '@/lib/push-scenarios';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}
function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

// 動的import（非リテラル指定子）＝tscにモジュール解決させない（未インストールでもCIを壊さない）。
const WEBPUSH_SPECIFIER: string = 'web-push';

interface SubRow {
  endpoint: string;
  p256dh: string;
  auth: string;
  prefecture?: string | null;
  audience?: string | null;
  created_at?: string | null;
}

function loadSubs(path: string): SubRow[] {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const rows: unknown[] = Array.isArray(raw) && raw.length && Array.isArray(raw[0]?.results)
    ? raw[0].results
    : Array.isArray(raw?.results)
    ? raw.results
    : Array.isArray(raw)
    ? raw
    : [];
  return rows
    .map((r) => r as SubRow)
    .filter((r) => r && typeof r.endpoint === 'string' && r.p256dh && r.auth);
}

async function loadWebPush(): Promise<any> {
  try {
    const mod = await import(WEBPUSH_SPECIFIER);
    return mod.default ?? mod;
  } catch {
    console.error('✗ web-push が見つかりません。`npm i web-push` を実行してください。');
    process.exit(1);
  }
}

async function main() {
  const webpush = await loadWebPush();

  // VAPID鍵生成モード
  if (flag('gen-keys')) {
    const keys = webpush.generateVAPIDKeys();
    console.log('生成したVAPID鍵を env に設定してください：\n');
    console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
    console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
    console.log(`VAPID_SUBJECT=mailto:naishin.dev@gmail.com`);
    return;
  }

  const publicKey = VAPID_PUBLIC_KEY; // 公開鍵は push-config の定数（env override 可）
  const privateKey = process.env.VAPID_PRIVATE_KEY; // 秘密鍵はローカルのシェルenvから（コミット禁止）
  const subject = process.env.VAPID_SUBJECT || 'mailto:naishin.dev@gmail.com';
  if (!privateKey) {
    console.error('✗ VAPID_PRIVATE_KEY が未設定です。送信前に環境変数で渡してください（例: $env:VAPID_PRIVATE_KEY="..."）。');
    process.exit(1);
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const subsPath = arg('subs');
  const prefFilter = arg('prefecture');
  const audienceFilter = arg('audience');
  const send = flag('send') && !flag('dry-run');

  // --scenario=recalc-reminder | parent-window-eve … push-scenarios.ts の単一ソースから文面を自動決定。
  // parent-window-eve は「今日が窓前日でなければ」シナリオ自体が無い＝安全に0件送信で終わる。
  const scenarioArg = arg('scenario');
  let scenario: { title: string; body: string; url: string } | null = null;
  if (scenarioArg === 'parent-window-eve') {
    scenario = activeParentWindowEveScenario();
    if (!scenario) {
      console.log('■ 今日は保護者収穫窓の前日ではありません（parent-window-eve該当なし）。送信対象0件で終了します。');
      return;
    }
  } else if (scenarioArg) {
    const found = PUSH_SCENARIOS[scenarioArg as PushScenarioId];
    if (!found) {
      console.error(`✗ 未知のシナリオ: ${scenarioArg}（有効値: ${Object.keys(PUSH_SCENARIOS).join(', ')}, parent-window-eve）`);
      process.exit(1);
    }
    scenario = found;
  }

  const title = arg('title') ?? scenario?.title ?? 'My Naishin';
  const bodyText = arg('body') ?? scenario?.body ?? '';
  const url = arg('url') ?? scenario?.url ?? '/';
  const recalcDays = Number(arg('recalc-days') ?? '30');
  const recalcTolerance = Number(arg('recalc-tolerance') ?? '1');

  if (!subsPath) {
    console.error('✗ --subs=subs.json を指定してください（D1 の push_subscriptions をエクスポート）。');
    process.exit(1);
  }

  let subs = loadSubs(subsPath);
  if (prefFilter) subs = subs.filter((s) => s.prefecture === prefFilter);
  if (audienceFilter) subs = subs.filter((s) => s.audience === audienceFilter);
  if (scenarioArg === 'recalc-reminder') {
    subs = subs.filter((s) => isAroundDaysAgo(s.created_at, recalcDays, recalcTolerance));
  }

  console.log(
    `■ Web Push 配信  宛先=${subs.length}件${prefFilter ? ` pref=${prefFilter}` : ''}${audienceFilter ? ` audience=${audienceFilter}` : ''}${scenarioArg ? ` scenario=${scenarioArg}` : ''}`
  );
  console.log(`  タイトル: ${title}`);
  console.log(`  本文: ${bodyText}`);
  console.log(`  遷移先: ${url}`);

  if (!send) {
    console.log('  [dry-run] 送信していません。実送信は --send を付けてください。');
    return;
  }

  const payload = JSON.stringify({ title, body: bodyText, url, tag: 'my-naishin', requireInteraction: false });
  let sent = 0;
  let failed = 0;
  const toRevoke: string[] = [];

  for (const s of subs) {
    const subscription = { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } };
    try {
      await webpush.sendNotification(subscription, payload);
      sent++;
    } catch (err: any) {
      failed++;
      const code = err?.statusCode;
      if (code === 404 || code === 410) toRevoke.push(s.endpoint); // 失効した購読
    }
  }

  console.log(`■ 完了：送信 ${sent}件 / 失敗 ${failed}件`);
  if (toRevoke.length) {
    const outFile = 'push-revoke-endpoints.json';
    writeFileSync(outFile, JSON.stringify(toRevoke, null, 2), 'utf8');
    console.log(`  失効した購読 ${toRevoke.length}件 → ${outFile}（D1で revoked=1 に更新を推奨）`);
  }
}

main().catch((err) => {
  console.error('push-send error:', err);
  process.exit(1);
});
