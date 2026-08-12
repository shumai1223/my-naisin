/**
 * 匿名統計の「いつ送るか」を決めるスケジューラ（DW-2・2026-08-12）。
 *
 * ## なぜ必要になったか（実測）
 * `StatsOptIn` は `value` を依存配列に持つ `useEffect` から送信していたため、
 * **点数を入力していく途中の値が1つ残らず送信されていた。**
 * 2026-08-12 の実測: 1人の1セッションが **28秒で52行**（45種類・21.3〜77）を投稿。
 * signature による重複防止は「同じ値の再送」しか止めず、値が変わるたびに素通りする。
 *
 * これを放置すると、全国分布は「最終結果の分布」ではなく
 * **「入力途中の状態の分布」** になり、しかも長く操作した人ほど重みが増す。
 * DW-1（ボット混入）とは原因が違うだけで、壊れ方は同じ（平均が意味を失う）。
 *
 * ## 契約
 * 1. **1セッション・1メトリック（+県）につき1件だけ**送る。
 * 2. 送るのは**入力が落ち着いた最終値**。`idleMs` 変化が無ければ確定とみなす。
 * 3. ページ離脱時（`flush()`）にも、まだ送っていなければ最新値で送る。
 *    離脱の方が先に来ることが多いので、こちらが実質の主経路。
 *
 * 依存を持たない純粋なモジュールにしてあるのは、偽タイマーで契約を固定するため
 * （`src/lib/__tests__/stats-submit-scheduler.test.ts`）。
 */
import type { StatsSubmissionInput } from '@/lib/stats-aggregation';

/** 入力が止まってから確定とみなすまでの時間。 */
export const DEFAULT_IDLE_MS = 6000;

export interface StatsSubmitScheduler {
  /** 最新の計算結果を渡す。実際に送るかどうかはスケジューラが決める。 */
  update(input: StatsSubmissionInput): void;
  /** 離脱時など、いま確定させたいときに呼ぶ。未送信なら最新値で送る。 */
  flush(): void;
  /** タイマーを破棄する（アンマウント時）。 */
  dispose(): void;
  /** テスト用: このセッションで既に送信したか。 */
  hasSubmitted(): boolean;
}

export interface StatsSubmitSchedulerOptions {
  submit: (input: StatsSubmissionInput) => void;
  idleMs?: number;
  /** 1セッション1件の判定に使う保存領域。既定は sessionStorage。 */
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
}

function sessionKey(input: StatsSubmissionInput): string {
  return `naishin.stats-submitted:${input.metric}:${input.prefectureCode ?? ''}`;
}

/** 既定の保存領域を安全に取り出す（SSR・プライベートモードでも壊さない）。 */
function defaultStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null; // ストレージが無効でも送信自体は行う（後述のメモリ側フラグで1回に保つ）
  }
}

export function createStatsSubmitScheduler(options: StatsSubmitSchedulerOptions): StatsSubmitScheduler {
  const { submit } = options;
  const idleMs = options.idleMs ?? DEFAULT_IDLE_MS;
  const storage = options.storage === undefined ? defaultStorage() : options.storage;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let latest: StatsSubmissionInput | null = null;
  let submitted = false; // ストレージが使えない環境でも1セッション1件を保つ

  function alreadySubmitted(input: StatsSubmissionInput): boolean {
    if (submitted) return true;
    try {
      return storage?.getItem(sessionKey(input)) === '1';
    } catch {
      return false;
    }
  }

  function markSubmitted(input: StatsSubmissionInput): void {
    submitted = true;
    try {
      storage?.setItem(sessionKey(input), '1');
    } catch {
      /* ストレージが使えなくてもメモリ側のフラグで足りる */
    }
  }

  function clear(): void {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function send(): void {
    clear();
    if (!latest || alreadySubmitted(latest)) return;
    const input = latest;
    markSubmitted(input);
    submit(input);
  }

  return {
    update(input) {
      if (alreadySubmitted(input)) return; // このセッションでは送信済み。以後の変更は無視する
      latest = input;
      clear();
      timer = setTimeout(send, idleMs);
    },
    flush() {
      send();
    },
    dispose() {
      clear();
    },
    hasSubmitted() {
      return submitted;
    },
  };
}
