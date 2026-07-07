/**
 * 月1ニュースレター 配信スクリプト（堀A＝名簿の収穫・P4-2）。
 *
 *   npx tsx scripts/newsletter.ts --trigger=monthly-checklist --month=2026年7月 --dry-run
 *   npx tsx scripts/newsletter.ts --trigger=season-summer --recipients=recipients.json --send
 *   npx tsx scripts/newsletter.ts --winterCheckpoint=open --variant=B --audience=parent --dry-run
 *     （冬窓11/15-12/25の事前組込A/B・C-1。--winterCheckpoint=open|final --variant=A|B --audience=student|parent）
 *
 * 思想（[[fable5-master-plan-2026-06]]）：配信できない名簿は資産でない。D1 に貯まった購読者へ
 * broadcast-templates.ts の“中身”を Resend で一斉配信し、受験本番までの接点を保つ。
 *
 * 安全：
 *  - 既定は --dry-run（送らない）。実送信は明示の --send が必要。
 *  - 実送信には RESEND_API_KEY が必須（無ければ中止）。配信停止リンクには UNSUB_SECRET 推奨。
 *  - 宛先は D1 から事前にエクスポートした JSON（unsubscribed=0 のみ）を --recipients で渡す。
 *      例) wrangler d1 execute my-naishin-leads --remote --json \
 *            --command "SELECT email, prefecture_code, prefecture_name FROM leads WHERE unsubscribed=0" \
 *          | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>process.stdout.write(JSON.stringify(JSON.parse(s)[0].results)))" > recipients.json
 *  - List-Unsubscribe ヘッダを付け、ワンクリック配信停止に対応（到達性＆法令対応）。
 */

import { writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';

import {
  BROADCAST_TEMPLATES,
  getBroadcastTemplate,
  getMonthlyMessage,
  getWinterMessage,
  type BroadcastTrigger,
  type Audience,
  type WinterCheckpoint,
  type CopyVariant,
} from '@/lib/broadcast-templates';
import {
  renderNewsletterHtml,
  renderNewsletterText,
  renderNewsletterSubject,
  type NewsletterContext,
  type RenderableBroadcast,
} from '@/lib/newsletter';
import { unsubscribeUrl } from '@/lib/unsubscribe';

const RESEND_BATCH_ENDPOINT = 'https://api.resend.com/emails/batch';
const BATCH_SIZE = 100; // Resend batch の上限

interface Recipient {
  email: string;
  prefecture_code?: string;
  prefecture_name?: string;
}

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}
function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function fromAddress(): string {
  return process.env.LEAD_FROM_EMAIL || 'My Naishin <noreply@my-naishin.com>';
}

function loadRecipients(path: string): Recipient[] {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const list: unknown[] = Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : [];
  return list
    .map((r) => r as Recipient)
    .filter((r) => r && typeof r.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email));
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const monthLabel = arg('month');
  const prefectureFilter = arg('prefecture'); // 県コードで絞る（任意）
  const recipientsPath = arg('recipients');
  const send = flag('send') && !flag('dry-run');

  // モード判定：--winterCheckpoint（冬窓A/B・C-1）＞--calMonth（12ヶ月カレンダー・H4）＞--trigger（季節/ステップ）。
  const winterCheckpointArg = arg('winterCheckpoint');
  const calMonthArg = arg('calMonth');
  let template: RenderableBroadcast;
  let jobLabel: string;
  let previewSlug: string;

  if (winterCheckpointArg) {
    const checkpoint = winterCheckpointArg as WinterCheckpoint;
    const variant = (arg('variant') ?? 'A') as CopyVariant;
    const audience = (arg('audience') ?? 'student') as Audience;
    if (
      (checkpoint !== 'open' && checkpoint !== 'final') ||
      (variant !== 'A' && variant !== 'B') ||
      (audience !== 'student' && audience !== 'parent')
    ) {
      console.error('✗ --winterCheckpoint=open|final --variant=A|B --audience=student|parent を指定してください。');
      process.exit(1);
    }
    const message = getWinterMessage(checkpoint, variant, audience);
    if (!message) {
      console.error(`✗ 冬窓配信（${checkpoint}/${variant}）が見つかりません。`);
      process.exit(1);
    }
    template = message;
    jobLabel = `winter=${checkpoint} variant=${variant} audience=${audience}`;
    previewSlug = `winter-${checkpoint}-${variant}-${audience}`;
  } else if (calMonthArg) {
    const month = Number(calMonthArg);
    const audience = (arg('audience') ?? 'student') as Audience;
    if (!Number.isInteger(month) || month < 1 || month > 12 || (audience !== 'student' && audience !== 'parent')) {
      console.error('✗ --calMonth=1..12 と --audience=student|parent を指定してください。');
      process.exit(1);
    }
    const message = getMonthlyMessage(month, audience);
    if (!message) {
      console.error(`✗ ${month}月のカレンダー配信が見つかりません。`);
      process.exit(1);
    }
    template = message;
    jobLabel = `calMonth=${month} audience=${audience}`;
    previewSlug = `cal-${month}-${audience}`;
  } else {
    const trigger = (arg('trigger') ?? 'monthly-checklist') as BroadcastTrigger;
    const seasonTemplate = getBroadcastTemplate(trigger);
    if (!seasonTemplate) {
      console.error(`✗ 不明な trigger: ${trigger}`);
      console.error(`  使用可能: ${BROADCAST_TEMPLATES.map((t) => t.trigger).join(', ')}`);
      process.exit(1);
    }
    template = seasonTemplate;
    jobLabel = `trigger=${trigger}`;
    previewSlug = trigger;
  }

  console.log(`■ ニュースレター配信  ${jobLabel}  ${monthLabel ? `month=${monthLabel}` : ''}`);
  console.log(`  件名: ${renderNewsletterSubject(template, { monthLabel })}`);

  // 宛先の読み込み（無ければ dry-run のサンプルでレンダリング確認のみ）。
  let recipients: Recipient[] = [];
  if (recipientsPath) {
    recipients = loadRecipients(recipientsPath);
    if (prefectureFilter) recipients = recipients.filter((r) => r.prefecture_code === prefectureFilter);
    console.log(`  宛先: ${recipients.length}件${prefectureFilter ? `（県=${prefectureFilter}で絞込）` : ''}`);
  } else {
    console.log('  宛先ファイル未指定 → サンプルでレンダリング確認のみ（送信しません）。');
    recipients = [{ email: 'sample@example.com', prefecture_name: prefectureFilter ? undefined : '東京都' }];
  }

  // dry-run：先頭の宛先でHTMLを書き出して目視確認。
  const sample = recipients[0];
  const sampleCtx: NewsletterContext = {
    monthLabel,
    prefectureName: sample?.prefecture_name,
    email: sample?.email,
  };
  const previewFile = `newsletter-preview-${previewSlug}.html`;
  writeFileSync(previewFile, renderNewsletterHtml(template, sampleCtx), 'utf8');
  console.log(`  プレビュー: ${previewFile} を書き出しました。`);

  if (!send) {
    console.log('  [dry-run] 送信はしていません。実送信は --send を付けてください。');
    return;
  }

  // ── 実送信 ──
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('✗ RESEND_API_KEY が未設定のため送信を中止しました。');
    process.exit(1);
  }
  if (!recipientsPath || recipients.length === 0) {
    console.error('✗ 送信対象がありません（--recipients を指定してください）。');
    process.exit(1);
  }
  if (!process.env.UNSUB_SECRET) {
    console.warn('⚠ UNSUB_SECRET 未設定：配信停止リンクが付きません（法令・到達性の観点で設定を推奨）。');
  }

  const from = fromAddress();
  let sent = 0;
  let failed = 0;

  for (const group of chunk(recipients, BATCH_SIZE)) {
    const emails = group.map((r) => {
      const ctx: NewsletterContext = { monthLabel, prefectureName: r.prefecture_name, email: r.email };
      const unsub = unsubscribeUrl(r.email);
      return {
        from,
        to: [r.email],
        subject: renderNewsletterSubject(template, ctx),
        html: renderNewsletterHtml(template, ctx),
        text: renderNewsletterText(template, ctx),
        ...(unsub
          ? {
              headers: {
                'List-Unsubscribe': `<${unsub}>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              },
            }
          : {}),
      };
    });

    try {
      const res = await fetch(RESEND_BATCH_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(emails),
      });
      if (res.ok) {
        sent += group.length;
        console.log(`  ✓ ${group.length}件 送信`);
      } else {
        failed += group.length;
        console.error(`  ✗ バッチ送信失敗 (${res.status}): ${await res.text()}`);
      }
    } catch (err) {
      failed += group.length;
      console.error('  ✗ バッチ送信例外:', err instanceof Error ? err.message : err);
    }
  }

  console.log(`■ 完了：送信 ${sent}件 / 失敗 ${failed}件`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('newsletter script error:', err);
  process.exit(1);
});
