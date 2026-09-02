/**
 * 日次モバイル比率シグネチャ（src/lib/click-fraud-signals.ts）の不変条件。
 *
 * 背景（2026-09-02）: bot 451行を削除した際、既存の日次シグネチャ
 * （analyzeClickFraudByDay = 件数 × distinct IP比率0.85以上 × distinct UA 12以下）が
 * 明らかなbot日を取りこぼしていた。IPの散り方に条件を置くと、プロキシの使い方が
 * 変わるだけですり抜けるため。実測で見逃していた日をここに固定する。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  analyzeMobileAnomalyByDay,
  binomialAtMost,
  MOBILE_ANOMALY_THRESHOLDS,
} from '../click-fraud-signals';

type Row = { d: string; user_agent: string };

const MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
const DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36';

/** その日の総件数と、うちモバイル件数を指定して行を作る。 */
function day(date: string, total: number, mobile: number): Row[] {
  return Array.from({ length: total }, (_, i) => ({
    d: date,
    user_agent: i < mobile ? MOBILE : DESKTOP,
  }));
}

const find = (rows: Row[], date: string) => {
  const hit = analyzeMobileAnomalyByDay(rows).find((r) => r.date === date);
  if (!hit) throw new Error(`${date} が集計結果に無い`);
  return hit;
};

describe('binomialAtMost（二項分布の下側累積）', () => {
  it('k >= n なら 1、k < 0 なら 0', () => {
    expect(binomialAtMost(10, 10, 0.75)).toBe(1);
    expect(binomialAtMost(10, 99, 0.75)).toBe(1);
    expect(binomialAtMost(10, -1, 0.75)).toBe(0);
  });

  it('n=1 のとき P(X<=0) = 1-p', () => {
    expect(binomialAtMost(1, 0, 0.75)).toBeCloseTo(0.25, 10);
  });

  it('大きなnでも桁溢れせず正の有限値になる（対数空間で計算しているため）', () => {
    const p = binomialAtMost(40, 0, 0.75);
    expect(Number.isFinite(p)).toBe(true);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1e-20);
  });

  it('k について単調非減少', () => {
    let prev = -1;
    for (let k = 0; k <= 20; k++) {
      const v = binomialAtMost(20, k, 0.75);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('analyzeMobileAnomalyByDay — 2026-08の実測日を固定する', () => {
  // ★既存の日次シグネチャ（IP比率依存）が取りこぼしていた3日。ここを拾えることが本テストの主目的。
  it.each([
    ['2026-08-04', 40, 0],
    ['2026-08-06', 36, 1],
    ['2026-08-25', 30, 1],
  ])('%s（%i件中モバイル%i件）を flagged にする', (date, total, mobile) => {
    const r = find(day(date, total, mobile), date);
    expect(r.flagged).toBe(true);
    // 閾値の主観性を排すため、偶然そうなる確率が極端に小さいことも固定する
    expect(r.chanceProbability).toBeLessThan(1e-10);
  });

  // グレーな日を巻き込まないこと。削除候補の抽出に使われうるため、こちらの方が重要。
  it.each([
    ['2026-08-19', 10, 2],
    ['2026-08-29', 10, 4],
    ['2026-09-01', 23, 5],
  ])('%s（%i件中モバイル%i件）は flagged にしない', (date, total, mobile) => {
    expect(find(day(date, total, mobile), date).flagged).toBe(false);
  });

  it('健全な日（モバイル75%以上）は flagged にしない', () => {
    expect(find(day('2026-07-12', 20, 19), '2026-07-12').flagged).toBe(false);
    expect(find(day('2026-06-27', 26, 26), '2026-06-27').flagged).toBe(false);
  });

  it('件数が10未満の日は、モバイル0件でも判定を見送る（サンプル不足でのオオカミ少年化を防ぐ）', () => {
    const r = find(day('2026-08-05', 8, 0), '2026-08-05');
    expect(r.mobileRatio).toBe(0);
    expect(r.flagged).toBe(false);
  });

  it('日付昇順で返る', () => {
    const rows = [...day('2026-08-25', 30, 1), ...day('2026-08-04', 40, 0), ...day('2026-08-06', 36, 1)];
    expect(analyzeMobileAnomalyByDay(rows).map((r) => r.date)).toEqual([
      '2026-08-04',
      '2026-08-06',
      '2026-08-25',
    ]);
  });

  it('閾値は呼び出し側で上書きできる', () => {
    const rows = day('2026-08-19', 10, 2); // 20% → 既定(15%)では残す
    expect(find(rows, '2026-08-19').flagged).toBe(false);
    expect(analyzeMobileAnomalyByDay(rows, { maxMobileRatio: 0.25 })[0].flagged).toBe(true);
  });
});

describe('運用スクリプト(.mjs)との定数ドリフト防止', () => {
  // scripts/lib/click-fraud-detector.mjs は Node から直接実行される ESM のため、
  // この TS を import できず同じロジックを持っている。**片方だけ変えると検知結果が食い違う**ので、
  // ソーステキストを読んで閾値の一致を機械的に検査する。
  const mjs = readFileSync(join(__dirname, '../../../scripts/lib/click-fraud-detector.mjs'), 'utf8');

  it('.mjs に analyzeMobileAnomalyByDay と binomialAtMost が実装されている', () => {
    expect(mjs).toContain('export function analyzeMobileAnomalyByDay');
    expect(mjs).toContain('export function binomialAtMost');
  });

  it.each([
    ['minDailyClicks', MOBILE_ANOMALY_THRESHOLDS.minDailyClicks],
    ['maxMobileRatio', MOBILE_ANOMALY_THRESHOLDS.maxMobileRatio],
    ['assumedMobileRatio', MOBILE_ANOMALY_THRESHOLDS.assumedMobileRatio],
  ])('%s の既定値 %p が .mjs 側と一致する', (name, value) => {
    // `opts.minDailyClicks ?? 10` のような既定値の記述を探す
    const pattern = new RegExp(`opts\\.${name}\\s*\\?\\?\\s*${String(value).replace('.', '\\.')}`);
    expect(mjs).toMatch(pattern);
  });

  it('モバイルUA判定の正規表現が一致する', () => {
    expect(mjs).toContain('/Mobile|iPhone|Android/i');
    expect(MOBILE_UA_SOURCE).toBe('Mobile|iPhone|Android');
  });
});

// 上のテストで参照する定数（TS側の正規表現ソース）
const MOBILE_UA_SOURCE = /Mobile|iPhone|Android/i.source;
