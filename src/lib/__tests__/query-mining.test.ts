import { findUncoveredOpportunityQueries, isTopicCovered, formatMiningCandidatesMarkdown, GscQueryRow } from '@/lib/query-mining';

function row(query: string, impressions: number, position: number, clicks = 0): GscQueryRow {
  return { keys: [query], clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

describe('isTopicCovered', () => {
  it('detects existing topic keywords', () => {
    expect(isTopicCovered('偏差値 計算 中学生')).toBe(true);
    expect(isTopicCovered('内申点 上げ方')).toBe(true);
  });

  it('detects prefecture names', () => {
    expect(isTopicCovered('東京都 内申点')).toBe(true);
    expect(isTopicCovered('兵庫 総合得点')).toBe(true);
  });

  it('returns false for genuinely uncovered topics', () => {
    expect(isTopicCovered('高校 制服 かわいい')).toBe(false);
  });
});

describe('findUncoveredOpportunityQueries', () => {
  it('filters out low-impression queries', () => {
    const rows = [row('謎のクエリ 対策', 10, 9)];
    expect(findUncoveredOpportunityQueries(rows)).toHaveLength(0);
  });

  it('filters out queries at/above position threshold (closer to page 1)', () => {
    const rows = [row('謎のクエリ 対策', 100, 8)];
    expect(findUncoveredOpportunityQueries(rows)).toHaveLength(0);
  });

  it('filters out queries already covered by existing page topics', () => {
    const rows = [row('偏差値 計算 やり方', 200, 9)];
    expect(findUncoveredOpportunityQueries(rows)).toHaveLength(0);
  });

  it('includes genuinely uncovered high-opportunity queries', () => {
    const rows = [row('謎のクエリ 対策', 200, 9)];
    const result = findUncoveredOpportunityQueries(rows);
    expect(result).toHaveLength(1);
    expect(result[0].query).toBe('謎のクエリ 対策');
  });

  it('sorts by impressions descending and respects limit', () => {
    const rows = [row('候補A', 60, 9), row('候補B', 300, 12), row('候補C', 120, 10)];
    const result = findUncoveredOpportunityQueries(rows, { limit: 2 });
    expect(result.map((c) => c.query)).toEqual(['候補B', '候補C']);
  });

  it('respects custom thresholds', () => {
    const rows = [row('候補D', 40, 9)];
    expect(findUncoveredOpportunityQueries(rows, { minImpressions: 30 })).toHaveLength(1);
  });
});

describe('formatMiningCandidatesMarkdown', () => {
  it('renders empty state', () => {
    expect(formatMiningCandidatesMarkdown([])).toContain('該当なし');
  });

  it('renders a table row per candidate', () => {
    const md = formatMiningCandidatesMarkdown([
      { query: '候補A', impressions: 100, clicks: 1, ctr: 0.01, position: 9.2 },
    ]);
    expect(md).toContain('候補A');
    expect(md).toContain('9.2');
  });
});
