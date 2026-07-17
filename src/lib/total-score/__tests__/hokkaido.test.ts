import { computeHokkaidoRank, HOKKAIDO_RANK_TABLE, HOKKAIDO_TOTAL_SCORE_MAX } from '@/lib/total-score/hokkaido';

describe('computeHokkaidoRank（北海道：内申点からA〜Mランク判定+学力検査点との単純合算615点満点）', () => {
  it('満点入力（内申315/学力300）はAランク・615点', () => {
    const result = computeHokkaidoRank({ naishinRaw: 315, gakuryokuRaw: 300 });
    expect(result.rank.rank).toBe('A');
    expect(result.total).toBe(615);
    expect(result.max).toBe(HOKKAIDO_TOTAL_SCORE_MAX);
    expect(result.percent).toBe(100);
  });

  it('内申0点はMランク（要努力）', () => {
    const result = computeHokkaidoRank({ naishinRaw: 0, gakuryokuRaw: 0 });
    expect(result.rank.rank).toBe('M');
    expect(result.total).toBe(0);
  });

  it('内申276点はBランクの境界を満たす', () => {
    const result = computeHokkaidoRank({ naishinRaw: 276, gakuryokuRaw: 0 });
    expect(result.rank.rank).toBe('B');
  });

  it('内申275点はCランク（Bの境界に届かない）', () => {
    const result = computeHokkaidoRank({ naishinRaw: 275, gakuryokuRaw: 0 });
    expect(result.rank.rank).toBe('C');
  });

  it('HOKKAIDO_RANK_TABLEはA〜Mの13段階', () => {
    expect(HOKKAIDO_RANK_TABLE).toHaveLength(13);
    expect(HOKKAIDO_RANK_TABLE[0].rank).toBe('A');
    expect(HOKKAIDO_RANK_TABLE[HOKKAIDO_RANK_TABLE.length - 1].rank).toBe('M');
  });

  it('満点を大幅に超える入力は満点にクランプされAランクのまま異常値にならない', () => {
    const result = computeHokkaidoRank({ naishinRaw: 1e30, gakuryokuRaw: 1e30 });
    expect(result.rank.rank).toBe('A');
    expect(result.total).toBe(HOKKAIDO_TOTAL_SCORE_MAX);
    expect(result.percent).toBe(100);
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeHokkaidoRank({ naishinRaw: -315, gakuryokuRaw: -300 });
    expect(result.total).toBe(0);
    expect(result.rank.rank).toBe('M');
  });
});
