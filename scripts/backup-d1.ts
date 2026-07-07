#!/usr/bin/env node
/**
 * D1定期エクスポート＝名簿・APIキー等のバックアップ（H-4）。
 *
 * wranglerはCLI認証（本人のCloudflareログイン）が要るため、エクスポート自体は
 * 本人のローカル環境で以下を実行する（会社PCではPowerShell関数 `wr` 経由の想定）：
 *
 *   $day = Get-Date -Format 'yyyy-MM-dd'
 *   New-Item -ItemType Directory -Force "backups/$day" | Out-Null
 *   foreach ($t in @('leads','clicks','push_subscriptions','api_keys','api_usage')) {
 *     wr d1 execute my-naishin-leads --remote --json --command "SELECT * FROM $t" `
 *       | Out-File -Encoding utf8 "backups/$day/$t.json"
 *   }
 *
 * そのあと本スクリプトで件数・サイズを検算しマニフェスト化する（バックアップが実際に
 * 中身入りで書き出されたかを目視でなく機械的に確認する＝空ファイル/失敗の見落とし防止）：
 *
 *   npx tsx scripts/backup-d1.ts --dir=backups/2026-07-07
 *
 * 安全設計：
 *  - このスクリプトはCloudflare/wranglerを一切呼ばない（envもsecretも不要）。読むのはローカルJSONのみ。
 *  - backups/ は .gitignore 済み＝PII（名簿メール等）を誤ってコミットしない。
 *  - マニフェスト（件数・サイズのみ・PIIなし）は同ディレクトリに manifest.json として書き出す。
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { D1_BACKUP_TABLES, buildBackupManifest, countRowsFromD1Json, type BackupTableResult } from '@/lib/d1-backup';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function main() {
  const dir = arg('dir');
  if (!dir) {
    console.error('✗ --dir=backups/YYYY-MM-DD を指定してください（wranglerでのエクスポート先ディレクトリ）。');
    process.exit(1);
  }

  const results: BackupTableResult[] = [];
  for (const table of D1_BACKUP_TABLES) {
    const file = join(dir, `${table}.json`);
    if (!existsSync(file)) continue; // 見つからなければ manifest 側で warning になる
    const bytes = statSync(file).size;
    let rowCount = 0;
    try {
      rowCount = countRowsFromD1Json(JSON.parse(readFileSync(file, 'utf8')));
    } catch (err) {
      console.error(`⚠ ${file} のJSON解析に失敗: ${err instanceof Error ? err.message : err}`);
    }
    results.push({ table, file, rowCount, bytes });
  }

  const manifest = buildBackupManifest(results);
  const manifestPath = join(dir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`■ D1バックアップ検算  ${dir}`);
  for (const t of manifest.tables) {
    console.log(`  ${t.table}: ${t.rowCount.toLocaleString('ja-JP')}件 / ${(t.bytes / 1024).toFixed(1)}KB`);
  }
  console.log(`  合計: ${manifest.totalRows.toLocaleString('ja-JP')}件 / ${(manifest.totalBytes / 1024).toFixed(1)}KB`);
  if (manifest.warnings.length > 0) {
    console.log('⚠ 警告:');
    for (const w of manifest.warnings) console.log(`  - ${w}`);
  }
  console.log(`[saved] ${manifestPath}`);
}

main();
