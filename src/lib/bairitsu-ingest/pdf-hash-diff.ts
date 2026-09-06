/**
 * T-Y11E E-3: 変化検知の2段目（pdfHashによる本文レベルの差分確認）。
 *
 * T-Y11 A-2（`competition-rate-watch.ts`）はHTTPヘッダの`fingerprint`だけを見て「サーバ側の
 * 応答が変わったらしい」と判定する一次シグナルに過ぎず、実際にPDFの中身（バイト列）が変わった
 * かまでは確認しない（ヘッダだけがサーバ再配置等で変わり中身は同一、というケースを誤検知しうる）。
 *
 * このモジュールは、実際にダウンロードしたPDFのSHA-256（`bairitsu-pdf-archive.ts`の
 * `ArchiveEntry.sha256`）を、T-N1-1が凍結した基準スナップショット（`src/data/snapshots/
 * <year>/exam-system.json`のpdfHash）と突き合わせ、「本当に中身が変わったか」を確定させる。
 *
 * ⚠️前提: 入学者選抜実施要項PDFと倍率（競争率）PDFが同一文書である県ではこの比較がそのまま
 * 使える。別文書の県ではこの比較自体が意味を持たない（呼び出し側が対象県を絞ってから使うこと）。
 * 基準ハッシュが未収集（`null`）または該当県のレコードが無い場合は、変化あり/なしのどちらにも
 * 丸めず`unknown`を返す（T-Y11Eの「数を合わせるために例外を積まない」方針と同じくfail-closed）。
 */

export type PdfHashComparisonResult =
  | { status: 'changed'; baselineHash: string; freshHash: string }
  | { status: 'unchanged'; baselineHash: string; freshHash: string }
  | { status: 'unknown'; reason: string };

export interface SnapshotPdfHashLookup {
  /** 県コードに対応する基準pdfHashを返す。レコード自体が無ければ`undefined`、
   *  レコードはあるがハッシュ未収集なら`null`を返すこと（2値化しない）。 */
  findPdfHash(prefectureCode: string): string | null | undefined;
}

/** スナップショットJSON（`ExamSystemSnapshot`と同形）から`SnapshotPdfHashLookup`を組み立てる。 */
export function buildSnapshotPdfHashLookup(snapshot: {
  entries: Array<{ code: string; pdfHash?: string | null }>;
}): SnapshotPdfHashLookup {
  const map = new Map<string, string | null>();
  for (const entry of snapshot.entries) {
    map.set(entry.code, entry.pdfHash ?? null);
  }
  return {
    findPdfHash: (code: string) => (map.has(code) ? (map.get(code) ?? null) : undefined),
  };
}

/**
 * 新規に取得したPDFのSHA-256を基準スナップショットのpdfHashと比較する。
 * @param prefectureCode 都道府県コード（例: 'tokyo'）
 * @param freshSha256 今回ダウンロードしたPDFのSHA-256（16進数・小文字）
 * @param baseline 比較対象の基準（`buildSnapshotPdfHashLookup()`で組み立てる）
 */
export function comparePdfHashToBaseline(
  prefectureCode: string,
  freshSha256: string,
  baseline: SnapshotPdfHashLookup
): PdfHashComparisonResult {
  const baselineHash = baseline.findPdfHash(prefectureCode);

  if (baselineHash === undefined) {
    return { status: 'unknown', reason: `${prefectureCode}の基準スナップショットにレコードが無い` };
  }
  if (baselineHash === null) {
    return { status: 'unknown', reason: `${prefectureCode}の基準pdfHashが未収集(null)` };
  }
  if (!freshSha256) {
    return { status: 'unknown', reason: '新規取得側のSHA-256が空文字列' };
  }

  return baselineHash === freshSha256
    ? { status: 'unchanged', baselineHash, freshHash: freshSha256 }
    : { status: 'changed', baselineHash, freshHash: freshSha256 };
}
