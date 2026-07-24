#!/usr/bin/env node
/**
 * D1バックアップからのリストアSQL生成（ZZ-10d・backup-d1.tsの対）。
 *
 * backups/YYYY-MM-DD/<table>.json（wrangler --json エクスポート済み）を読み、
 * 各テーブルの restore-<table>.sql を同ディレクトリに書き出す。
 * 実際の書き戻し（wrangler d1 execute --remote --file=...）はCLI認証が要るため、
 * 本人のローカル環境で以下のように実行する（backup-d1.tsと同じ運用パターン）：
 *
 *   npx tsx scripts/restore-d1.ts --dir=backups/2026-07-07
 *   # 各テーブルごとに生成された backups/2026-07-07/restore-<table>.sql を確認してから
 *   wr d1 execute my-naishin-leads --remote --file=backups/2026-07-07/restore-leads.sql
 *
 * 安全設計：
 *  - Cloudflare/wranglerを一切呼ばない（envもsecretも不要）。読むのはローカルJSONのみ。
 *  - 生成したSQLはDELETE文をコメントアウト済み＝実行しても既存データは自動で消えない。
 *  - backups/ は .gitignore 済み＝生成したrestore-*.sqlもPIIを含みうるため非コミット。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { D1_BACKUP_TABLES } from '@/lib/d1-backup';
import { extractRowsFromD1Json, buildRestoreSqlFile } from '@/lib/d1-restore';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function main() {
  const dir = arg('dir');
  if (!dir) {
    console.error('✗ --dir=backups/YYYY-MM-DD を指定してください（backup-d1.tsでエクスポート済みのディレクトリ）。');
    process.exit(1);
  }

  let written = 0;
  for (const table of D1_BACKUP_TABLES) {
    const file = join(dir, `${table}.json`);
    if (!existsSync(file)) {
      console.log(`- skip（見つかりません）: ${table}.json`);
      continue;
    }
    let rows: Record<string, unknown>[] = [];
    try {
      rows = extractRowsFromD1Json(JSON.parse(readFileSync(file, 'utf8')));
    } catch (err) {
      console.error(`⚠ ${file} のJSON解析に失敗: ${err instanceof Error ? err.message : err}`);
      continue;
    }
    const sql = buildRestoreSqlFile(table, rows);
    const outPath = join(dir, `restore-${table}.sql`);
    writeFileSync(outPath, sql, 'utf8');
    console.log(`✓ generated: ${outPath}（${rows.length}件）`);
    written++;
  }

  console.log(`\n完了: ${written}件のrestore-*.sqlを生成。`);
  console.log('実際の書き戻しは各ファイルを目視確認のうえ以下で実行してください:');
  console.log('  wr d1 execute my-naishin-leads --remote --file=<生成されたrestore-*.sql>');
}

main();
