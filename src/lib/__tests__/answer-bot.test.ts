/**
 * 内申点クイックアンサー（answer-bot）の契約テスト。
 * 検証済みデータからのみ回答する＝捏造ゼロを、県判定・意図判定・一般FAQの各経路で固定する。
 */

import { answerQuery, detectPrefectureCode } from '../answer-bot';

describe('detectPrefectureCode', () => {
  test('県名（接尾辞あり/なし）と英語コードで判定', () => {
    expect(detectPrefectureCode('兵庫県の内申点')).toBe('hyogo');
    expect(detectPrefectureCode('兵庫の満点は？')).toBe('hyogo');
    expect(detectPrefectureCode('tokyo naishin')).toBe('tokyo');
  });

  test('「東京都」は東京、「京都」は京都に正しく解決（部分一致の誤爆回避）', () => {
    expect(detectPrefectureCode('東京都の換算内申')).toBe('tokyo');
    expect(detectPrefectureCode('京都の内申点の計算方法')).toBe('kyoto');
  });

  test('県が無ければ null', () => {
    expect(detectPrefectureCode('評定平均とは')).toBeNull();
    expect(detectPrefectureCode('内申点とは何ですか')).toBeNull();
  });
});

describe('answerQuery（県の検証済みデータ）', () => {
  test('満点を聞かれたら正しい満点を返す（兵庫=250）', () => {
    const a = answerQuery('兵庫の内申点は何点満点？');
    expect(a?.kind).toBe('prefecture');
    expect(a?.title).toBe('兵庫県');
    expect(a?.answer).toContain('250');
    expect(a?.links[0].href).toBe('/hyogo/naishin');
  });

  test('オールNはデータセットの確定値を返す（東京オール5=65）', () => {
    const a = answerQuery('東京でオール5だと内申いくつ？');
    expect(a?.answer).toContain('65');
    // 補足にオール3/4/5が並ぶ
    expect((a?.details ?? []).some((d) => d.startsWith('オール5'))).toBe(true);
  });

  test('対象学年を聞かれたら対象学年を返す', () => {
    const a = answerQuery('神奈川の内申は何年生が対象？');
    expect(a?.kind).toBe('prefecture');
    expect(a?.title).toBe('神奈川県');
    // 神奈川は中2・中3
    expect(a?.answer).toMatch(/中2|中3/);
  });

  test('県のみ（意図なし）は概要を返す', () => {
    const a = answerQuery('大阪府');
    expect(a?.kind).toBe('prefecture');
    expect(a?.title).toBe('大阪府');
    expect(a?.links.length).toBeGreaterThan(0);
  });
});

describe('answerQuery（一般FAQ）', () => {
  test.each([
    ['評定平均とは', '評定平均とは', '/hyotei-heikin'],
    ['偏差値ってなに', '偏差値とは', '/hensachi'],
    ['換算内申について教えて', '換算内申とは', '/tokyo/naishin'],
    ['内申点とは何ですか', '内申点とは', '/'],
  ])('「%s」→ %s', (q, title, href) => {
    const a = answerQuery(q);
    expect(a?.kind).toBe('general');
    expect(a?.title).toBe(title);
    expect(a?.links.some((l) => l.href === href)).toBe(true);
  });

  test('短すぎる/無関係なクエリは null', () => {
    expect(answerQuery('あ')).toBeNull();
    expect(answerQuery('')).toBeNull();
    expect(answerQuery('天気')).toBeNull();
  });
});

describe('answerQuery（偏差値の数式・決定論回答）', () => {
  test('「偏差値60は上位何%？」→ 上位約15.9%を含む', () => {
    const a = answerQuery('偏差値60は上位何%？');
    expect(a?.kind).toBe('general');
    expect(a?.answer).toContain('15.9');
    expect(a?.links.some((l) => l.href === '/hensachi')).toBe(true);
  });

  test('全角数字「偏差値６５ 順位」も拾う', () => {
    const a = answerQuery('偏差値６５の順位は？');
    expect(a?.answer).toContain('6.7');
  });

  test('「東京 偏差値65」は県判定より偏差値回答を優先', () => {
    const a = answerQuery('東京 偏差値65 上位');
    expect(a?.kind).toBe('general');
    expect(a?.title).toContain('偏差値65');
  });

  test('「偏差値の出し方」は計算式を返す', () => {
    const a = answerQuery('偏差値の出し方を教えて');
    expect(a?.title).toContain('出し方');
    expect(a?.answer).toContain('50');
  });

  test('数値も計算意図もない「偏差値ってなに」は一般FAQ（偏差値とは）に委譲', () => {
    const a = answerQuery('偏差値ってなに');
    expect(a?.title).toBe('偏差値とは');
  });
});
