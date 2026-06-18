/**
 * Web Push 配信スクリプト（出願締切・通知表リマインド＝H-NEW）。
 *
 *   # 0) 初回だけ：VAPID鍵を生成して env に設定（NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT）
 *   npx tsx scripts/push-send.ts --gen-keys
 *
 *   # 1) D1 から購読をエクスポート（revoked=0 のみ）
 *   wrangler d1 execute my-naishin-leads --remote --json \
 *     --command "SELECT endpoint, p256dh, auth, prefecture, audience FROM push_subscriptions WHERE revoked=0" \
 *     > subs.json
 *
 *   # 2) ドライラン（送らない）→ 本送信（--send）
 *   npx tsx scripts/push-send.ts --subs=subs.json --title="出願はお済みですか？" --body="出願締切が近づいています" --url="/juken-schedule"
 *   npx tsx scripts/push-send.ts --subs=subs.json --title="..." --body="..." --url="/total-score" --send
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

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:naishin.dev@gmail.com';
  if (!publicKey || !privateKey) {
    console.error('✗ VAPID鍵が未設定です。--gen-keys で生成し env に設定してください。');
    process.exit(1);
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const subsPath = arg('subs');
  const title = arg('title') ?? 'My Naishin';
  const bodyText = arg('body') ?? '';
  const url = arg('url') ?? '/';
  const prefFilter = arg('prefecture');
  const audienceFilter = arg('audience');
  const send = flag('send') && !flag('dry-run');

  if (!subsPath) {
    console.error('✗ --subs=subs.json を指定してください（D1 の push_subscriptions をエクスポート）。');
    process.exit(1);
  }

  let subs = loadSubs(subsPath);
  if (prefFilter) subs = subs.filter((s) => s.prefecture === prefFilter);
  if (audienceFilter) subs = subs.filter((s) => s.audience === audienceFilter);

  console.log(`■ Web Push 配信  宛先=${subs.length}件${prefFilter ? ` pref=${prefFilter}` : ''}${audienceFilter ? ` audience=${audienceFilter}` : ''}`);
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
