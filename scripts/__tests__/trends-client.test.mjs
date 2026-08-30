/**
 * Google Trends クライアント（scripts/lib/trends-client.mjs）の純関数テスト。
 *
 * jest ではなく node:test で書く理由: 本体は ESM(.mjs) で、jest は ts-jest の CommonJS 変換のため
 * .mjs を直接 import できない。jest の testMatch（**\/__tests__\/**\/*.[jt]s?(x)）は .mjs を拾わない
 * ので、この2系統は互いに干渉しない。実行は `npm run test:trends`。
 *
 * ここで守りたいのは「Trends 側の仕様が変わっても、こちらの整形・検証ロジックが黙って壊れない」こと。
 * ネットワークを叩くテストは入れない（Googleのレート制限に依存するテストは不安定になるため）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  backoffMs,
  cacheKey,
  normalizeKeywords,
  normalizeTimeframe,
  parseTrendsJson,
  shapeRanked,
  shapeTimeline,
  stripXssiPrefix,
  summarizeSeasonality,
} from '../lib/trends-client.mjs';

test('stripXssiPrefix: Trends の XSSI プレフィクスを落として JSON 本体を返す', () => {
  assert.equal(stripXssiPrefix(")]}'\n{\"a\":1}"), '{"a":1}');
  assert.equal(stripXssiPrefix(')]}\',\n[1,2]'), '[1,2]');
  assert.deepEqual(parseTrendsJson(")]}'\n{\"a\":1}"), { a: 1 });
});

test('stripXssiPrefix: JSONでない応答（HTMLエラーページ等）は握りつぶさず投げる', () => {
  assert.throws(() => stripXssiPrefix('Our systems have detected unusual traffic'), /JSONが見つかりません/);
  assert.throws(() => stripXssiPrefix(null), /文字列ではありません/);
});

test('normalizeTimeframe: プリセットと明示日付レンジのみ通す', () => {
  assert.equal(normalizeTimeframe(undefined), 'today 12-m');
  assert.equal(normalizeTimeframe('today 5-y'), 'today 5-y');
  assert.equal(normalizeTimeframe('2025-01-01 2025-12-31'), '2025-01-01 2025-12-31');
  // 打ち間違いを黙って「空の結果」にしないための番人
  assert.throws(() => normalizeTimeframe('today 12m'), /timeframe が不正/);
  assert.throws(() => normalizeTimeframe('2025/01/01 2025/12/31'), /timeframe が不正/);
});

test('normalizeKeywords: 空白除去・空要素落とし・上限5件', () => {
  assert.deepEqual(normalizeKeywords(' 内申点 '), ['内申点']);
  assert.deepEqual(normalizeKeywords(['内申点', '', '  ', '偏差値']), ['内申点', '偏差値']);
  assert.throws(() => normalizeKeywords([]), /keywords が空/);
  assert.throws(() => normalizeKeywords(['a', 'b', 'c', 'd', 'e', 'f']), /最大5件/);
});

test('backoffMs: 指数で伸び、上限で頭打ちになり、ジッタは±25%に収まる', () => {
  assert.equal(backoffMs(0, 1000, 30_000, () => 0.5), 1000);
  assert.equal(backoffMs(3, 1000, 30_000, () => 0.5), 8000);
  assert.equal(backoffMs(20, 1000, 30_000, () => 0.5), 30_000); // capで頭打ち
  assert.equal(backoffMs(0, 1000, 30_000, () => 0), 750); // 下振れ -25%
  assert.equal(backoffMs(0, 1000, 30_000, () => 1), 1250); // 上振れ +25%
});

test('cacheKey: 同じ入力は同じキー・違う入力は違うキー', () => {
  const a = cacheKey('iot', { keywords: ['内申点'], geo: 'JP' });
  const b = cacheKey('iot', { keywords: ['内申点'], geo: 'JP' });
  const c = cacheKey('iot', { keywords: ['内申点'], geo: 'JP-13' });
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^iot-[0-9a-f]{16}$/);
});

test('shapeTimeline: multiline応答を日付×キーワードの表に潰し、暫定週に印を付ける', () => {
  const payload = {
    default: {
      timelineData: [
        { time: '1755993600', formattedTime: '2025年8月24日～30日', value: [36, 90] },
        { time: '1788048000', formattedTime: '2026年8月30日～9月5日', value: [33, 88], isPartial: true },
      ],
    },
  };
  const rows = shapeTimeline(payload, ['内申点', '偏差値']);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].date, '2025-08-24');
  assert.deepEqual(rows[0].values, { 内申点: 36, 偏差値: 90 });
  assert.equal(rows[0].isPartial, undefined);
  // 集計途中の週は平均を歪めるので印を付けて呼び出し側が除外できるようにする
  assert.equal(rows[1].isPartial, true);
});

test('shapeTimeline: 空応答でも落ちずに空配列を返す', () => {
  assert.deepEqual(shapeTimeline({}, ['x']), []);
  assert.deepEqual(shapeTimeline({ default: { timelineData: [] } }, ['x']), []);
});

test('summarizeSeasonality: 月別平均・ピーク月・季節係数を出し、暫定週は集計から外す', () => {
  const rows = [
    { date: '2025-02-02', values: { k: 100 } },
    { date: '2025-02-09', values: { k: 80 } },
    { date: '2025-07-06', values: { k: 20 } },
    { date: '2025-07-13', values: { k: 20 } },
    // 暫定週は無視されるべき（これが混ざると8月がピークになってしまう）
    { date: '2026-08-30', values: { k: 999 }, isPartial: true },
  ];
  const s = summarizeSeasonality(rows, 'k');
  assert.equal(s.peakMonth, 2);
  assert.equal(s.troughMonth, 7);
  assert.equal(s.monthly[1].avg, 90); // 2月 = (100+80)/2
  assert.equal(s.monthly[6].avg, 20); // 7月
  assert.equal(s.monthly[7].avg, null); // 8月はデータ無し扱い
  assert.equal(s.seasonalRatio, 4.5); // 90 / 20
});

test('shapeRanked(query): rankedList[0]=top / [1]=rising に割り付け、Breakout表記を保つ', () => {
  const payload = {
    default: {
      rankedList: [
        { rankedKeyword: [{ query: '内申 点', value: 100, formattedValue: '100' }] },
        { rankedKeyword: [{ query: '内申 点 計算', value: 0, formattedValue: 'Breakout' }] },
      ],
    },
  };
  const r = shapeRanked(payload, 'query');
  assert.deepEqual(r.top, [{ query: '内申 点', value: 100, formattedValue: '100' }]);
  // 急上昇は数値化できない "Breakout"（+5000%超）が入る。丸めずそのまま出す。
  assert.equal(r.rising[0].formattedValue, 'Breakout');
});

test('shapeRanked(topic): topic配下のtitle/type/midを取り出す', () => {
  const payload = {
    default: {
      rankedList: [
        { rankedKeyword: [{ topic: { title: '高校受験', type: 'トピック', mid: '/g/12372k4j' }, value: 100, formattedValue: '100' }] },
      ],
    },
  };
  const r = shapeRanked(payload, 'topic');
  assert.equal(r.top[0].topic, '高校受験');
  assert.equal(r.top[0].mid, '/g/12372k4j');
  assert.deepEqual(r.rising, []);
});

test('shapeRanked: rankedListが空（現在のRELATED_TOPICSの実挙動）でも落ちない', () => {
  assert.deepEqual(shapeRanked({ default: { rankedList: [] } }, 'topic'), { top: [], rising: [] });
  assert.deepEqual(shapeRanked({}, 'query'), { top: [], rising: [] });
});

test('summarizeSeasonality: データ皆無でも null を返して落ちない', () => {
  const s = summarizeSeasonality([], 'k');
  assert.equal(s.peakMonth, null);
  assert.equal(s.seasonalRatio, null);
  assert.equal(s.monthly.length, 12);
});
