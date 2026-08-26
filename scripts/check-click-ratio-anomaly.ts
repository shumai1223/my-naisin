#!/usr/bin/env -S npx tsx
/**
 * check-click-ratio-anomaly.ts — DW-7 #10（DEADWIRE 2026-08-10監査）
 * clicks（D1）の human/bot 分類結果の中身（モバイル比率）をゲート化する。
 *
 * 異常検知ロジックは src/lib/click-ratio-audit.ts の純粋関数（unit test済み）。
 * ここはデータ取得・出力整形のみを担当する（stats-distribution-audit.tsと同型の設計）。
 *
 * 読み取り専用（scripts/d1q.mjs経由）。異常検知時は exit 1、異常なしは exit 0。
 *
 * 使い方: npx tsx scripts/check-click-ratio-anomaly.ts [--days N]（既定28日）
 */
import { spawnSync } from 'node:child_process';

import { auditClickRatios } from '@/lib/click-ratio-audit';
import { classifyClick } from '@/lib/bot-filter';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const days = Number(arg('days') ?? '28');

const sql = `SELECT user_agent, referer, placement FROM clicks WHERE created_at >= datetime('now','-${days} days')`;

function fetchRows(): Array<{ user_agent: string | null; referer: string | null; placement: string | null }> | null {
  const res = spawnSync(process.execPath, ['scripts/d1q.mjs', sql], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' },
  });
  if (res.status !== 0) return null;
  try {
    const rows = JSON.parse(res.stdout);
    return Array.isArray(rows) ? rows : null;
  } catch {
    return null;
  }
}

function main() {
  const rows = fetchRows();
  if (rows === null) {
    console.log('■ clicks 比率監査（DW-7 #10）');
    console.log('  scripts/d1q.mjs 経由の本番D1読み取りに失敗しました（wrangler認証切れ・ネットワーク等）。');
    process.exit(2);
  }

  const report = auditClickRatios(
    rows.map((r) => ({ userAgent: r.user_agent, referer: r.referer, placement: r.placement })),
    classifyClick
  );

  console.log(`■ clicks 比率監査（DW-7 #10・過去${days}日）`);
  console.log(`  総クリック: ${report.total}`);
  console.log(
    `  human: ${report.human}（${(report.humanRatio * 100).toFixed(1)}%） / bot: ${report.bot} / suspect: ${report.suspect} / unknown: ${report.unknown}`
  );
  if (report.mobileAmongHuman) {
    console.log(
      `  human分類のうちモバイル: ${report.mobileAmongHuman.count}/${report.human}（${(report.mobileAmongHuman.ratio * 100).toFixed(1)}%）`
    );
  } else {
    console.log('  human分類が0件のためモバイル比率は計算対象外');
  }

  if (report.flagged) {
    console.log('\n⚠️ 異常を検知:');
    for (const reason of report.reasons) console.log(`  - ${reason}`);
    console.log('\n詳細はops/DEADWIRE.md DW-3/DW-7を参照。D1書き換えはC7ゲートのためこのスクリプトは検知のみ行う。');
    process.exit(1);
  }

  console.log('\nOK: 異常なし');
  process.exit(0);
}

main();
