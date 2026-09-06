/**
 * T-Y11E E-2: 変化検知（T-Y11 A-2・`competition-rate-watch.ts`）で「更新された」と判定された
 * 県だけを対象に、実際のPDF本文を保存するための純関数群。
 *
 * A-2は意図的に本文をダウンロードしない設計（相手サーバへの負荷を避けるため。詳細は
 * `competition-rate-watch.ts`のコメント参照）。しかし教委は旧年度の資料を予告なく削除する
 * ことがあり（18パターン全404の実績あり）、R9公表直後の一時的な取り違え・誤読があった場合に
 * 原本へ立ち返れなくなるリスクがある。このモジュールは「A-2が`changed`と判定した県だけ」
 * ネットワークI/Oを一切含まない純関数群でアーカイブ対象を絞り込み、実際のダウンロード・
 * 保存はI/O側（`scripts/bairitsu-ingest/archive-changed-pdfs.mjs`）に任せる（jestで直接
 * 検証できるようにするための分離。competition-rate-watch.tsと同じ設計方針）。
 *
 * ⚠️「1県1日1回」等の礼儀正しさの制約自体はA-2側（`shouldFetch`・24時間間隔）が既に担っており、
 * このモジュールはA-2の結果（`changed`のみ）に乗る形で追加のポーリングを行わない
 * （既存のポーリングサイクルに相乗りするだけで、相手サーバへの負荷を増やさない）。
 */

import type { WatchEntry, WatchState } from './competition-rate-watch';

export interface ArchiveEntry {
  prefecture: string;
  url: string;
  /** 保存したPDFのSHA-256（16進数）。ファイル名にも使う。 */
  sha256: string;
  /** 保存したファイルサイズ（バイト）。 */
  byteLength: number;
  /** どの`fingerprint`（ヘッダ由来）に対応する保存かを記録し、同じ版を重複保存しない。 */
  fingerprintAtArchive: string;
  archivedAt: string;
}

export interface ArchiveState {
  entries: Record<string, ArchiveEntry>;
}

export function emptyArchiveState(): ArchiveState {
  return { entries: {} };
}

/**
 * A-2の監視状態から、アーカイブすべき県コードの一覧を返す。
 * 条件: `lastStatus === 'changed'`（今回変化を検知した）かつ、
 * まだその`fingerprint`版を保存していない（アーカイブ済みなら再ダウンロードしない）。
 */
export function pickArchiveCandidates(watchState: WatchState, archiveState: ArchiveState): string[] {
  const candidates: string[] = [];
  for (const [prefecture, entry] of Object.entries(watchState.entries)) {
    if (entry.lastStatus !== 'changed') continue;
    if (!entry.fingerprint) continue;
    const archived = archiveState.entries[prefecture];
    if (archived && archived.fingerprintAtArchive === entry.fingerprint) continue;
    candidates.push(prefecture);
  }
  return candidates;
}

export interface ArchiveOutcome {
  sha256: string;
  byteLength: number;
}

/** ダウンロード結果からアーカイブ台帳の1件分を組み立てる。 */
export function buildArchiveEntry(prefecture: string, entry: WatchEntry, outcome: ArchiveOutcome, nowIso: string): ArchiveEntry {
  return {
    prefecture,
    url: entry.url,
    sha256: outcome.sha256,
    byteLength: outcome.byteLength,
    fingerprintAtArchive: entry.fingerprint ?? '',
    archivedAt: nowIso,
  };
}
