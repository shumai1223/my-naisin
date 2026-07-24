/**
 * D1バックアップのリストアSQL生成（ZZ-10d・信頼の要塞）。
 *
 * なぜ：ZZ-1でD1がun-copyableな一次データ（名簿・匿名統計等）の器になった＝
 * 「失ったら二度と戻らない資産」なのに、これまでバックアップ側（backup-d1.ts）しか無く、
 * 実際にリストアする手段が検証されていなかった（単一障害点）。
 *
 * 実際の書き戻し（wrangler d1 execute --remote --file=...）はCLI認証が要るため、
 * backup-d1.tsと同じ設計思想で本人のローカル環境で実行する。ここは「エクスポート済みJSONから
 * INSERT文を組み立てる」純粋ロジックのみ（D1・ネットワーク非依存＝テスト可能）。
 */

/**
 * `wrangler d1 execute --json` の出力（[{ results: [...] }]）から行データ配列を取り出す。
 * countRowsFromD1Json（d1-backup.ts）と同じ形状判定・想定外の形は空配列（呼び出し側で0件警告）。
 */
export function extractRowsFromD1Json(raw: unknown): Record<string, unknown>[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const first = raw[0] as { results?: unknown[] } | undefined;
  if (!Array.isArray(first?.results)) return [];
  return first.results as Record<string, unknown>[];
}

/**
 * JS値（JSON由来）をSQLiteリテラルへ変換する。
 * null/undefined→NULL、真偽値→0/1（SQLite慣習）、数値→そのまま、文字列→シングルクォートを
 * ''でエスケープして囲む。それ以外の型（オブジェクト等）はJSON文字列化してから同様に囲む
 * （想定外データでもクエリ構文を壊さないための保険）。
 */
export function escapeSqlValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  const s = typeof value === 'string' ? value : JSON.stringify(value);
  return `'${s.replace(/'/g, "''")}'`;
}

/**
 * 1テーブル分の行データから、バッチ分割したINSERT文の配列を組み立てる（D1非依存の純粋関数）。
 * 列名は先頭行のキー順で固定する（エクスポートは`SELECT *`のため全行で同一のはず。
 * 行によって欠けている列はNULL補完する＝部分的に壊れたJSONでも構文エラーで全体停止しない）。
 * batchSize行ごとに別のINSERT文へ分割する（1文が肥大化しすぎないように・既定50）。
 */
export function buildInsertStatements(table: string, rows: Record<string, unknown>[], batchSize = 50): string[] {
  if (rows.length === 0) return [];
  const columns = Object.keys(rows[0]);
  const colList = columns.map((c) => `"${c}"`).join(', ');
  const size = Math.max(1, Math.round(batchSize));

  const statements: string[] = [];
  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);
    const valueTuples = batch.map((row) => `(${columns.map((c) => escapeSqlValue(row[c])).join(', ')})`).join(',\n  ');
    statements.push(`INSERT INTO "${table}" (${colList}) VALUES\n  ${valueTuples};`);
  }
  return statements;
}

/**
 * 1テーブル分のリストアSQLファイル本文を組み立てる（ヘッダコメント＋既存データ削除の目安＋INSERT群）。
 * DELETE文はコメントアウトした状態で出す＝「空テーブルへの初回リストア」を既定にし、
 * 「既存データを全消しして丸ごと差し替える」破壊的操作は本人が明示的にコメント解除しないと
 * 走らない設計（誤操作防止・本モジュールが自動でDELETEを実行することは無い）。
 */
export function buildRestoreSqlFile(table: string, rows: Record<string, unknown>[]): string {
  const header =
    `-- D1リストアSQL: ${table}（${rows.length}件・ZZ-10d生成）\n` +
    `-- 適用: wrangler d1 execute my-naishin-leads --remote --file=<このファイル>\n` +
    `-- 既存データを全消しして差し替えたい場合のみ、次の行のコメントを外してから実行すること\n` +
    `-- （既定では追加のみ＝既存行との重複はUNIQUE制約があれば実行時エラーになるので確認しながら進める）。\n` +
    `-- DELETE FROM "${table}";\n\n`;
  if (rows.length === 0) return header + '-- (0件・リストア対象なし)\n';
  return header + buildInsertStatements(table, rows).join('\n\n') + '\n';
}
