/**
 * DW-2（2026-08-12）: 匿名統計の送信タイミングの契約テスト。
 *
 * 事故: `value` が変わるたびに送信していたため、1人の1セッションが28秒で52行
 *       （45種類・21.3〜77）を投稿していた。全国分布が「入力途中の状態」の分布になる。
 *
 * ここで固定するのは3点だけ:
 *   1. 入力が続いている間は送らない（最後の値だけ）
 *   2. 1セッション1件（送信後の変更は無視）
 *   3. 離脱時（flush）は待たずに送る
 */
import {
  createStatsSubmitScheduler,
  DEFAULT_IDLE_MS,
} from '../stats-submit-scheduler';
import type { StatsSubmissionInput } from '../stats-aggregation';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

const base = (value: number): StatsSubmissionInput => ({
  metric: 'hensachi',
  value,
  prefectureCode: 'tokyo',
});

describe('createStatsSubmitScheduler', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('入力中は送らず、止まってから最後の値だけを1回送る', () => {
    const submit = jest.fn();
    const s = createStatsSubmitScheduler({ submit, storage: memoryStorage() });

    // 実際の事故と同じ形: 途中経過が次々に流れ込む
    for (const v of [21.3, 40, 55.2, 61.1, 62.4]) {
      s.update(base(v));
      jest.advanceTimersByTime(500); // どれも idle 未満
    }
    expect(submit).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DEFAULT_IDLE_MS);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.mock.calls[0][0].value).toBe(62.4); // 最終値のみ
  });

  it('1セッションにつき1件だけ（送信後の変更は無視する）', () => {
    const submit = jest.fn();
    const s = createStatsSubmitScheduler({ submit, storage: memoryStorage() });

    s.update(base(62.4));
    jest.advanceTimersByTime(DEFAULT_IDLE_MS);
    expect(submit).toHaveBeenCalledTimes(1);

    s.update(base(70));
    jest.advanceTimersByTime(DEFAULT_IDLE_MS * 3);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('離脱時は idle を待たずに最新値で送る', () => {
    const submit = jest.fn();
    const s = createStatsSubmitScheduler({ submit, storage: memoryStorage() });

    s.update(base(58));
    jest.advanceTimersByTime(100);
    s.flush();

    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.mock.calls[0][0].value).toBe(58);
  });

  it('flush を何度呼んでも2件目は送らない', () => {
    const submit = jest.fn();
    const s = createStatsSubmitScheduler({ submit, storage: memoryStorage() });

    s.update(base(58));
    s.flush();
    s.flush();
    s.flush();
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('同じセッションで再マウントされても、保存領域を共有していれば送らない', () => {
    const storage = memoryStorage();
    const submit = jest.fn();

    const first = createStatsSubmitScheduler({ submit, storage });
    first.update(base(62.4));
    first.flush();
    expect(submit).toHaveBeenCalledTimes(1);

    const second = createStatsSubmitScheduler({ submit, storage });
    second.update(base(63));
    second.flush();
    expect(submit).toHaveBeenCalledTimes(1); // 増えない
  });

  it('metric や県が違えば別枠として送れる', () => {
    const storage = memoryStorage();
    const submit = jest.fn();
    const s = createStatsSubmitScheduler({ submit, storage });

    s.update(base(62.4));
    s.flush();
    // 別メトリックは同じセッションでも独立して1件
    const s2 = createStatsSubmitScheduler({ submit, storage });
    s2.update({ metric: 'naishin', value: 40, prefectureCode: 'tokyo' });
    s2.flush();

    expect(submit).toHaveBeenCalledTimes(2);
  });

  it('未送信のまま dispose してもタイマーは残らない', () => {
    const submit = jest.fn();
    const s = createStatsSubmitScheduler({ submit, storage: memoryStorage() });
    s.update(base(50));
    s.dispose();
    jest.advanceTimersByTime(DEFAULT_IDLE_MS * 5);
    expect(submit).not.toHaveBeenCalled();
  });
});
