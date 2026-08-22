// Y-8(学力検査平均点等・教委が学校別に公表している数値の拡張)の不変条件テスト。
// prefecture-tuition-subsidy.test.ts/interim-rate-bulletin-registry.test.tsと同型の設計思想:
// 未確認は無理に埋めない・'found'エントリはsource必須・全46都道府県(栃木除く)が調査済み。

import { SCHOOL_AVERAGE_SCORE_REGISTRY, SchoolAverageScoreEntry } from '../school-average-score-registry';

const ALL_PREFECTURES = [
  'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
  'ibaraki', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa', 'niigata',
  'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka',
  'aichi', 'mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
  'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi', 'tokushima',
  'kagawa', 'ehime', 'kochi', 'fukuoka', 'saga', 'nagasaki', 'kumamoto',
  'oita', 'miyazaki', 'kagoshima', 'okinawa',
];

describe('SCHOOL_AVERAGE_SCORE_REGISTRY（Y-8・全46都道府県[栃木除く]スクリーニング完走）', () => {
  it('全46都道府県(栃木除く)すべてが登録されている', () => {
    const codes = SCHOOL_AVERAGE_SCORE_REGISTRY.map((e) => e.prefectureCode).sort();
    expect(codes).toEqual([...ALL_PREFECTURES].sort());
    expect(codes.length).toBe(46);
  });

  it('prefectureCodeに重複が無い', () => {
    const codes = SCHOOL_AVERAGE_SCORE_REGISTRY.map((e) => e.prefectureCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('tochigiは対象外(Y-6/Y-11と同じスコープ除外)', () => {
    expect(SCHOOL_AVERAGE_SCORE_REGISTRY.some((e) => e.prefectureCode === 'tochigi')).toBe(false);
  });

  it("status='found'のエントリは存在しない（2026-08-23調査時点の正直な結論=0件）", () => {
    const found = SCHOOL_AVERAGE_SCORE_REGISTRY.filter((e) => e.status === 'found');
    expect(found).toHaveLength(0);
  });

  it("status='found'の場合は必ずsource/granularity/confidenceを持つ（将来foundが追加された場合の回帰防止）", () => {
    for (const e of SCHOOL_AVERAGE_SCORE_REGISTRY) {
      if (e.status === 'found') {
        expect(e.source).toBeDefined();
        expect(e.source!.url.startsWith('https://')).toBe(true);
        expect(e.granularity).toBeDefined();
        expect(e.confidence).toBeDefined();
      }
    }
  });

  it("status='not-found'が45県、'not-investigated'が北海道1県のみ", () => {
    const notFound = SCHOOL_AVERAGE_SCORE_REGISTRY.filter((e) => e.status === 'not-found');
    const notInvestigated = SCHOOL_AVERAGE_SCORE_REGISTRY.filter((e) => e.status === 'not-investigated');
    expect(notFound).toHaveLength(45);
    expect(notInvestigated).toHaveLength(1);
    expect(notInvestigated[0].prefectureCode).toBe('hokkaido');
  });

  it('全件がnoteとinvestigatedAtを持つ(未確認でも所見を残す)', () => {
    for (const e of SCHOOL_AVERAGE_SCORE_REGISTRY) {
      expect(e.note.length).toBeGreaterThan(10);
      expect(e.investigatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('kanagawa/chibaはPDF本文を実際に確認した旨がnoteに記録されている(捏造ゼロの裏取り証跡)', () => {
    const kanagawa = SCHOOL_AVERAGE_SCORE_REGISTRY.find((e) => e.prefectureCode === 'kanagawa') as SchoolAverageScoreEntry;
    const chiba = SCHOOL_AVERAGE_SCORE_REGISTRY.find((e) => e.prefectureCode === 'chiba') as SchoolAverageScoreEntry;
    expect(kanagawa.note).toMatch(/pdftoppm|画像化/);
    expect(chiba.note).toMatch(/目次/);
  });
});
