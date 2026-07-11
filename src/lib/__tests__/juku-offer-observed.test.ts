/**
 * 塾診断オファーマッチングの実測ランク計算（Q-5）。k-匿名性しきい値・観測ランク・乖離検出の契約テスト。
 */
import {
  computeObservedOfferRank,
  findRankDivergence,
  JUKU_OFFER_MIN_SAMPLE,
  type ObservedOfferClicks,
} from '../juku-offer-observed';
import type { AffiliateId } from '../affiliates';

const clicks = (id: string, n: number): ObservedOfferClicks => ({ id: id as AffiliateId, clicks: n });

describe('computeObservedOfferRank', () => {
  it('合計クリックが閾値未満ならnull（サンプル不足で判定保留）', () => {
    const rows = [clicks('sora-juku-text', 10), clicks('atama-text', 5)];
    expect(computeObservedOfferRank(rows)).toBeNull();
  });

  it('合計クリックが閾値以上ならクリック降順でランク付けする', () => {
    const rows = [clicks('sora-juku-text', 10), clicks('atama-text', 25)];
    const result = computeObservedOfferRank(rows);
    expect(result).not.toBeNull();
    expect(result![0]).toMatchObject({ id: 'atama-text', clicks: 25, rank: 1 });
    expect(result![1]).toMatchObject({ id: 'sora-juku-text', clicks: 10, rank: 2 });
  });

  it('シェアは合計に対する割合(0-1)', () => {
    const rows = [clicks('a', 30), clicks('b', 10)];
    const result = computeObservedOfferRank(rows, 30)!;
    expect(result.find((r) => r.id === 'a')?.share).toBeCloseTo(0.75);
    expect(result.find((r) => r.id === 'b')?.share).toBeCloseTo(0.25);
  });

  it('同数はid昇順で安定ソート', () => {
    const rows = [clicks('zeta', 15), clicks('alpha', 15)];
    const result = computeObservedOfferRank(rows, 30)!;
    expect(result[0].id).toBe('alpha');
    expect(result[1].id).toBe('zeta');
  });

  it('閾値はカスタマイズ可能', () => {
    const rows = [clicks('a', 5), clicks('b', 3)]; // 合計8
    expect(computeObservedOfferRank(rows, 10)).toBeNull();
    expect(computeObservedOfferRank(rows, 8)).not.toBeNull();
  });

  it('既定閾値はJUKU_OFFER_MIN_SAMPLE(30)', () => {
    expect(JUKU_OFFER_MIN_SAMPLE).toBe(30);
  });
});

describe('findRankDivergence', () => {
  it('乖離が閾値未満の案件は含めない', () => {
    const observed = computeObservedOfferRank([clicks('a', 20), clicks('b', 15)], 30)!;
    // 仮定順位=観測順位と同じなのでdelta=0
    const div = findRankDivergence(['a' as AffiliateId, 'b' as AffiliateId], observed);
    expect(div).toEqual([]);
  });

  it('乖離が閾値以上の案件を絶対値降順で返す', () => {
    const observed = computeObservedOfferRank(
      [clicks('a', 5), clicks('b', 10), clicks('c', 20)],
      30
    )!;
    // observed順: c(1位) > b(2位) > a(3位)
    // assumed順: a(1位) b(2位) c(3位) → a: assumed1-observed3=-2, c: assumed3-observed1=+2（bは0で除外）
    // 同じ|delta|=2のa/cは、observed配列の走査順(c→b→a)を保つ安定ソートでc→aの順になる
    const div = findRankDivergence(['a', 'b', 'c'] as AffiliateId[], observed, 2);
    expect(div.map((d) => d.id)).toEqual(['c', 'a']);
    const a = div.find((d) => d.id === 'a')!;
    expect(a.assumedRank).toBe(1);
    expect(a.observedRank).toBe(3);
    expect(a.delta).toBe(-2);
  });

  it('assumedIdsに無いidは無視する', () => {
    const observed = computeObservedOfferRank([clicks('a', 15), clicks('unknown', 20)], 30)!;
    const div = findRankDivergence(['a'] as AffiliateId[], observed);
    expect(div.every((d) => d.id !== 'unknown')).toBe(true);
  });

  it('thresholdDeltaはカスタマイズ可能', () => {
    const observed = computeObservedOfferRank([clicks('a', 14), clicks('b', 16)], 30)!;
    // assumed=[a,b] observed=[b(1),a(2)] → a: 1-2=-1, b: 2-1=+1
    expect(findRankDivergence(['a', 'b'] as AffiliateId[], observed, 2)).toEqual([]);
    expect(findRankDivergence(['a', 'b'] as AffiliateId[], observed, 1)).toHaveLength(2);
  });
});
