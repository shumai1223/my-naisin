/**
 * 名簿velocity＆7/20ゲート（Build 3）の集計純関数テスト。週境界・空DB・ゲート判定を固定する。
 */
import {
  weekStartOf,
  bucketDailyByWeek,
  evaluateJulyGate,
  GATE_DEADLINE,
  GATE_CLICK_MULTIPLE_TARGET,
} from '../velocity';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('weekStartOf（月曜始まりの週開始・UTC）', () => {
  it('日曜は前の月曜に、月曜はその日に、火曜は同週の月曜に丸まる', () => {
    expect(weekStartOf(D('2026-07-05'))).toBe('2026-06-29'); // 日曜 → 前週の月曜
    expect(weekStartOf(D('2026-07-06'))).toBe('2026-07-06'); // 月曜 → その日
    expect(weekStartOf(D('2026-07-07'))).toBe('2026-07-06'); // 火曜 → 同週の月曜
    expect(weekStartOf(D('2026-07-12'))).toBe('2026-07-06'); // 日曜 → 同週の月曜
  });
});

describe('bucketDailyByWeek（日次→週次バケット）', () => {
  it('空配列でも weeks 個のゼロ埋めバケットを古い→新しい順で返す', () => {
    const b = bucketDailyByWeek([], 8, D('2026-07-15'));
    expect(b).toHaveLength(8);
    expect(b.every((x) => x.count === 0)).toBe(true);
    // 昇順（古い→新しい）
    for (let i = 1; i < b.length; i++) {
      expect(b[i].weekStart > b[i - 1].weekStart).toBe(true);
    }
    // 最終バケットは now の週
    expect(b[b.length - 1].weekStart).toBe('2026-07-13');
  });

  it('同じ週の日次カウントは1バケットに合算される（週境界の日曜/月曜で分かれる）', () => {
    const daily = [
      { date: '2026-07-06', count: 2 }, // 月（7/6週）
      { date: '2026-07-12', count: 3 }, // 日（7/6週）
      { date: '2026-07-13', count: 5 }, // 月（7/13週）
    ];
    const b = bucketDailyByWeek(daily, 3, D('2026-07-15'));
    const byStart = Object.fromEntries(b.map((x) => [x.weekStart, x.count]));
    expect(byStart['2026-07-06']).toBe(5); // 2+3
    expect(byStart['2026-07-13']).toBe(5);
  });

  it('対象範囲外・不正日付の行は無視する', () => {
    const daily = [
      { date: '2020-01-01', count: 99 }, // 遠い過去 → 対象外
      { date: 'not-a-date', count: 7 }, // 不正
      { date: '2026-07-13', count: 4 }, // 対象
    ];
    const total = bucketDailyByWeek(daily, 4, D('2026-07-15')).reduce((s, x) => s + x.count, 0);
    expect(total).toBe(4);
  });

  it('label は月/日表記', () => {
    const b = bucketDailyByWeek([], 1, D('2026-07-15'));
    expect(b[0].label).toBe('7/13');
  });
});

describe('evaluateJulyGate（7/20 反証ゲート）', () => {
  it('期限前は pending＝まだ判定しない（残り日数を出す）', () => {
    const g = evaluateJulyGate({ now: D('2026-07-04'), clicks: 200, clicksPrev: 100, leads: 5, conversions: 0 });
    expect(g.verdict).toBe('pending');
    expect(g.decided).toBe(false);
    expect(g.daysLeft).toBe(16);
    expect(g.deadline).toBe(GATE_DEADLINE);
  });

  it('期限後・発生ありは GO（モデル成立）', () => {
    const g = evaluateJulyGate({ now: D('2026-07-21'), clicks: 200, clicksPrev: 100, leads: 8, conversions: 1 });
    expect(g.verdict).toBe('go');
    expect(g.decided).toBe(true);
  });

  it('期限後・発生0だがクリックが前季比 target 倍以上は ITERATE（律速はオファー側）', () => {
    const g = evaluateJulyGate({
      now: D('2026-07-21'),
      clicks: 100 * GATE_CLICK_MULTIPLE_TARGET,
      clicksPrev: 100,
      leads: 3,
      conversions: 0,
    });
    expect(g.verdict).toBe('iterate');
    expect(g.clickMultiple).toBeCloseTo(GATE_CLICK_MULTIPLE_TARGET, 5);
  });

  it('期限後・発生0でクリックも伸びていなければ PIVOT', () => {
    const g = evaluateJulyGate({ now: D('2026-07-21'), clicks: 100, clicksPrev: 100, leads: 0, conversions: 0 });
    expect(g.verdict).toBe('pivot');
  });

  it('前季クリック0は倍率を出さない（null・ラベルは —）', () => {
    const g = evaluateJulyGate({ now: D('2026-07-21'), clicks: 50, clicksPrev: 0, leads: 0, conversions: 0 });
    expect(g.clickMultiple).toBeNull();
    expect(g.clickMultipleLabel).toBe('—');
    expect(g.verdict).toBe('pivot'); // 発生0＆倍率不明 → pivot
  });

  it('期限ちょうど（7/20）は判定確定フェーズに入る', () => {
    const g = evaluateJulyGate({ now: D('2026-07-20'), clicks: 10, clicksPrev: 1, leads: 0, conversions: 0 });
    expect(g.decided).toBe(true);
    expect(g.daysLeft).toBe(0);
  });
});
