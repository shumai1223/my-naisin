/**
 * D1定期バックアップ（名簿・APIキー等）のマニフェスト組み立て（H-4）。
 *
 * 実際のエクスポート（wrangler d1 execute --remote --json）は本人のローカル環境で実行する
 * （wranglerはCLI認証が要るためNode側からは叩かない・scripts/backup-d1.tsのdocstring参照）。
 * ここは「エクスポート済みJSONを読み、件数・サイズを検算してマニフェストにする」純粋ロジックのみ。
 * バックアップ本体（PII含む）は .gitignore の backups/ 配下でリポジトリに一切コミットしない。
 */

/** D1バックアップ対象テーブル（migrations 0001-0006の正準リスト）。 */
export const D1_BACKUP_TABLES = ['leads', 'clicks', 'push_subscriptions', 'api_keys', 'api_usage'] as const;
export type D1BackupTable = (typeof D1_BACKUP_TABLES)[number];

export interface BackupTableResult {
  table: string;
  file: string;
  rowCount: number;
  bytes: number;
}

export interface BackupManifest {
  exportedAt: string;
  tables: BackupTableResult[];
  totalRows: number;
  totalBytes: number;
  /** 0件テーブル・欠落ファイルなど、目視確認を促す注意点。 */
  warnings: string[];
}

/** テーブルごとの結果からマニフェストを組み立てる（D1非依存の純粋関数＝テスト可能）。 */
export function buildBackupManifest(tables: BackupTableResult[], now: Date = new Date()): BackupManifest {
  const warnings: string[] = [];
  const expected = new Set<string>(D1_BACKUP_TABLES);
  const seen = new Set(tables.map((t) => t.table));
  for (const t of tables) {
    if (t.rowCount === 0) warnings.push(`${t.table}: 0件（空テーブル、またはエクスポート失敗の可能性）`);
  }
  for (const name of expected) {
    if (!seen.has(name)) warnings.push(`${name}: ファイルが見つからず未バックアップ`);
  }

  return {
    exportedAt: now.toISOString(),
    tables,
    totalRows: tables.reduce((s, t) => s + t.rowCount, 0),
    totalBytes: tables.reduce((s, t) => s + t.bytes, 0),
    warnings,
  };
}

/**
 * `wrangler d1 execute --json` の出力（[{ results: [...] }]）から行数を取り出す。
 * 形が想定外（空配列・resultsなし）なら0を返す＝呼び出し側でwarningとして拾われる。
 */
export function countRowsFromD1Json(raw: unknown): number {
  if (!Array.isArray(raw) || raw.length === 0) return 0;
  const first = raw[0] as { results?: unknown[] } | undefined;
  return Array.isArray(first?.results) ? first.results.length : 0;
}
