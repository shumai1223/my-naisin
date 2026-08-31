/**
 * T-Y11 A-2: 倍率公表資料の更新検知（純関数群）。
 *
 * `scripts/check-competition-rate-updates.mjs`（実際のHTTP fetchを行う側）と
 * `docs/daily-brief.md`（結果を表示する側）の両方から呼ばれるロジックをここに集約する。
 * ネットワークI/Oを一切含まない（jestで直接検証できるようにするため）。
 *
 * 設計方針:
 * - **本文はダウンロードしない。** ETag/Last-Modified/Content-Lengthの組み合わせ
 *   （`buildFingerprint`）だけで変化を検知する。数十MBのPDFを毎回GETすると
 *   相手サーバへの負荷が過大（A-2の「相手サーバに負荷をかけない」制約）。
 * - **1県1日1回まで。** `shouldFetch`が前回チェックから24時間未満ならfalseを返す。
 * - **robots.txtで拒否されている県は取得不可のまま台帳に残す。** 推測でスキップしない。
 */

export type WatchStatus = 'ok' | 'changed' | 'unreachable' | 'robots-blocked' | 'never-checked';

export interface WatchEntry {
  prefecture: string;
  url: string;
  /** 直近にチェックした日時（ISO 8601）。一度もチェックしていなければnull。 */
  lastCheckedAt: string | null;
  lastStatus: WatchStatus;
  /** ETag/Last-Modified/Content-Lengthを結合した軽量フィンガープリント。本文ハッシュではない。 */
  fingerprint: string | null;
  /** 直近でfingerprintの変化を検知した日時。変化が一度も無ければnull。 */
  changedAt: string | null;
  note: string | null;
}

export interface WatchState {
  entries: Record<string, WatchEntry>;
}

export function emptyWatchState(): WatchState {
  return { entries: {} };
}

/** 前回チェックから`minIntervalHours`時間未満なら再チェックしない（相手サーバへの配慮）。 */
export function shouldFetch(entry: WatchEntry | undefined, now: Date, minIntervalHours = 24): boolean {
  if (!entry || !entry.lastCheckedAt) return true;
  const last = new Date(entry.lastCheckedAt).getTime();
  if (Number.isNaN(last)) return true;
  return now.getTime() - last >= minIntervalHours * 60 * 60 * 1000;
}

export interface RawHeaders {
  etag?: string | null;
  lastModified?: string | null;
  contentLength?: string | null;
}

/** レスポンスヘッダから軽量フィンガープリントを作る。全て欠落していれば空文字（＝判定不能）。 */
export function buildFingerprint(headers: RawHeaders): string {
  return [headers.etag ?? '', headers.lastModified ?? '', headers.contentLength ?? ''].join('|');
}

export interface FetchOutcome {
  /** 到達できた場合のフィンガープリント。到達不能ならnull。robots拒否ならundefined。 */
  fingerprint: string | null | undefined;
  note?: string;
}

/**
 * 前回の状態と今回の結果から新しい`WatchEntry`を組み立てる。
 * fingerprintが空文字（ヘッダが1つも取れなかった）の場合は判定不能として`ok`に倒す
 * （変化なしと誤検知するより「分からない」の方が安全・fable5-loop-protocolの
 * 「分からないを異常に丸めない」と同じ思想）。
 */
export function evaluateFetch(prefecture: string, url: string, prev: WatchEntry | undefined, outcome: FetchOutcome, nowIso: string): WatchEntry {
  if (outcome.fingerprint === undefined) {
    return {
      prefecture,
      url,
      lastCheckedAt: nowIso,
      lastStatus: 'robots-blocked',
      fingerprint: prev?.fingerprint ?? null,
      changedAt: prev?.changedAt ?? null,
      note: outcome.note ?? 'robots.txtで拒否されたため取得を見送った',
    };
  }
  if (outcome.fingerprint === null) {
    return {
      prefecture,
      url,
      lastCheckedAt: nowIso,
      lastStatus: 'unreachable',
      fingerprint: prev?.fingerprint ?? null,
      changedAt: prev?.changedAt ?? null,
      note: outcome.note ?? '到達不能（DNS解決不可・タイムアウト等）',
    };
  }
  if (outcome.fingerprint === '') {
    return {
      prefecture,
      url,
      lastCheckedAt: nowIso,
      lastStatus: 'ok',
      fingerprint: prev?.fingerprint ?? null,
      changedAt: prev?.changedAt ?? null,
      note: 'ETag/Last-Modified/Content-Lengthのいずれも取得できず判定不能（変化なしとして扱う）',
    };
  }
  const isFirstObservation = !prev || prev.fingerprint === null;
  const changed = !isFirstObservation && prev!.fingerprint !== outcome.fingerprint;
  return {
    prefecture,
    url,
    lastCheckedAt: nowIso,
    lastStatus: changed ? 'changed' : 'ok',
    fingerprint: outcome.fingerprint,
    changedAt: changed ? nowIso : prev?.changedAt ?? null,
    note: changed ? '前回チェック時からヘッダのフィンガープリントが変化した（内容更新の可能性）' : null,
  };
}

export interface WatchSummary {
  total: number;
  changed: string[];
  unreachable: string[];
  robotsBlocked: string[];
  neverChecked: string[];
  okCount: number;
}

export function summarizeWatchState(state: WatchState): WatchSummary {
  const entries = Object.values(state.entries);
  const changed = entries.filter((e) => e.lastStatus === 'changed').map((e) => e.prefecture);
  const unreachable = entries.filter((e) => e.lastStatus === 'unreachable').map((e) => e.prefecture);
  const robotsBlocked = entries.filter((e) => e.lastStatus === 'robots-blocked').map((e) => e.prefecture);
  const neverChecked = entries.filter((e) => e.lastStatus === 'never-checked').map((e) => e.prefecture);
  return {
    total: entries.length,
    changed,
    unreachable,
    robotsBlocked,
    neverChecked,
    okCount: entries.filter((e) => e.lastStatus === 'ok').length,
  };
}

const SECTION_START = '<!-- Y11_COMPETITION_WATCH_START -->';
const SECTION_END = '<!-- Y11_COMPETITION_WATCH_END -->';

/** `WatchState`から日次ブリーフィング用のMarkdownセクションを組み立てる（純関数）。 */
export function buildWatchSection(state: WatchState, dateLabel: string): string {
  const summary = summarizeWatchState(state);
  const lines = [
    `## 📡 倍率公表資料の更新監視（自動・${dateLabel}時点・T-Y11 A-2）`,
    '',
    `監視対象: **${summary.total}県**（一次ソースURLが判明している県のみ。ヘッダのETag/Last-Modified/` +
      'Content-Lengthのみを見て本文はダウンロードしない）',
    '',
  ];
  if (summary.changed.length > 0) {
    lines.push(`### ⚠️ 更新を検知した県（${summary.changed.length}件）`, '');
    lines.push(...summary.changed.map((p) => `- ${p}: 一次ソースの資料が更新された可能性`));
    lines.push('');
  } else {
    lines.push('### 更新検知', '', '- 更新なし', '');
  }
  if (summary.unreachable.length > 0) {
    lines.push(`### 到達不能（${summary.unreachable.length}県）`, '', ...summary.unreachable.map((p) => `- ${p}`), '');
  }
  if (summary.robotsBlocked.length > 0) {
    lines.push(`### robots.txtで拒否（${summary.robotsBlocked.length}県・手動確認へ回す）`, '', ...summary.robotsBlocked.map((p) => `- ${p}`), '');
  }
  if (summary.neverChecked.length > 0) {
    lines.push(`### 未チェック（${summary.neverChecked.length}県）`, '', ...summary.neverChecked.map((p) => `- ${p}`), '');
  }
  return lines.join('\n');
}

/** docs/daily-brief.mdへ冪等に挿入・更新する（Λ-1の`injectHealthSection`と同型）。 */
export function injectWatchSection(fileContent: string, sectionBody: string): string {
  const wrapped = `${SECTION_START}\n${sectionBody}\n${SECTION_END}`;
  if (fileContent.includes(SECTION_START) && fileContent.includes(SECTION_END)) {
    const startIdx = fileContent.indexOf(SECTION_START);
    const endIdx = fileContent.indexOf(SECTION_END) + SECTION_END.length;
    return fileContent.slice(0, startIdx) + wrapped + fileContent.slice(endIdx);
  }
  const lines = fileContent.split('\n');
  const titleIdx = lines.findIndex((l) => l.startsWith('# '));
  if (titleIdx === -1) return `${wrapped}\n\n${fileContent}`;
  lines.splice(titleIdx + 1, 0, '', wrapped);
  return lines.join('\n');
}
