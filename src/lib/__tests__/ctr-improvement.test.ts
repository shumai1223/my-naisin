import {
  expectedCtrBandForPosition,
  findCtrUnderperformers,
  formatCtrUnderperformersMarkdown,
  type GscPageRow,
} from '@/lib/ctr-improvement';

describe('expectedCtrBandForPosition', () => {
  it('1〜3位は最も高いCTR期待帯を返す', () => {
    expect(expectedCtrBandForPosition(2)?.expectedMinCtr).toBe(0.1);
  });

  it('21位以下は対応帯が無い（対象外）', () => {
    expect(expectedCtrBandForPosition(25)).toBeNull();
  });

  it('帯の境界値（4位・10位・20位）が正しい帯に属する', () => {
    expect(expectedCtrBandForPosition(4)?.expectedMinCtr).toBe(0.04);
    expect(expectedCtrBandForPosition(10)?.expectedMinCtr).toBe(0.02);
    expect(expectedCtrBandForPosition(20)?.expectedMinCtr).toBe(0.008);
  });
});

describe('findCtrUnderperformers', () => {
  const pages: GscPageRow[] = [
    // 流入トップ5（クリック降順）。CTRが低くても対象外になるはず。
    { keys: ['/hensachi'], clicks: 2000, impressions: 40000, ctr: 0.05, position: 3 },
    { keys: ['/home'], clicks: 1500, impressions: 20000, ctr: 0.075, position: 2 },
    { keys: ['/hyotei-heikin'], clicks: 800, impressions: 6000, ctr: 0.133, position: 4 },
    { keys: ['/blog/all-3'], clicks: 400, impressions: 30000, ctr: 0.013, position: 6 },
    { keys: ['/tokyo/total-score'], clicks: 300, impressions: 2000, ctr: 0.15, position: 2 },
    // 流入上位5に入らない面。順位2位なのにCTR2%＝期待下限10%を大きく下回る＝劣後候補。
    { keys: ['/kanagawa/s-value'], clicks: 40, impressions: 2000, ctr: 0.02, position: 2 },
    // 表示回数が少なすぎてノイズ除去対象（minImpressions未満）。
    { keys: ['/low-impression-page'], clicks: 1, impressions: 50, ctr: 0.02, position: 2 },
    // 順位21位（対応帯なし）は対象外。
    { keys: ['/deep-tail-page'], clicks: 2, impressions: 500, ctr: 0.004, position: 25 },
    // 順位相応のCTRを出している面（劣後ではない）。
    { keys: ['/healthy-page'], clicks: 50, impressions: 500, ctr: 0.1, position: 8 },
  ];

  it('流入上位5面は劣後判定から除外される', () => {
    const result = findCtrUnderperformers(pages);
    expect(result.some((r) => r.url === '/blog/all-3')).toBe(false);
  });

  it('順位相応のCTRを大きく下回る面を検出する', () => {
    const result = findCtrUnderperformers(pages);
    expect(result.map((r) => r.url)).toContain('/kanagawa/s-value');
  });

  it('表示回数が少なすぎる面はノイズとして除外する', () => {
    const result = findCtrUnderperformers(pages);
    expect(result.some((r) => r.url === '/low-impression-page')).toBe(false);
  });

  it('対応する期待CTR帯が無い深い順位の面は対象外', () => {
    const result = findCtrUnderperformers(pages);
    expect(result.some((r) => r.url === '/deep-tail-page')).toBe(false);
  });

  it('順位相応のCTRを出している面は検出されない', () => {
    const result = findCtrUnderperformers(pages);
    expect(result.some((r) => r.url === '/healthy-page')).toBe(false);
  });

  it('excludeTopNByClicksを0にすると流入上位面も対象になり得る', () => {
    const result = findCtrUnderperformers(pages, { excludeTopNByClicks: 0, minImpressions: 100 });
    expect(result.some((r) => r.url === '/blog/all-3')).toBe(true);
  });
});

describe('formatCtrUnderperformersMarkdown', () => {
  it('空配列は該当なしメッセージを返す', () => {
    expect(formatCtrUnderperformersMarkdown([])).toContain('該当なし');
  });

  it('該当ありはMarkdownテーブルを返す', () => {
    const md = formatCtrUnderperformersMarkdown([
      { url: '/kanagawa/s-value', impressions: 2000, clicks: 40, ctr: 0.02, position: 2, expectedMinCtr: 0.1 },
    ]);
    expect(md).toContain('/kanagawa/s-value');
    expect(md).toContain('2.0%');
  });
});
