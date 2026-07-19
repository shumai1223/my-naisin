import { PREFECTURES } from '@/lib/prefectures';
import {
  MAP_TILES,
  MAP_METRICS,
  SEQUENTIAL_SCALE,
  SEQUENTIAL_SCALE_TEXT,
  bucketIndexOf,
  buildMapCells,
} from '@/lib/naishin-map-data';

describe('naishin-map-data（W-14 タイルグリッド地図）', () => {
  test('MAP_TILESは47都道府県すべてを1件ずつ含む', () => {
    expect(MAP_TILES.length).toBe(47);
    const codes = new Set(MAP_TILES.map((t) => t.code));
    expect(codes.size).toBe(47);
    for (const p of PREFECTURES) {
      expect(codes.has(p.code)).toBe(true);
    }
  });

  test('MAP_TILESの(col,row)座標に重複がない（簡略化模式図としてタイルが重ならない）', () => {
    const seen = new Set<string>();
    for (const tile of MAP_TILES) {
      const key = `${tile.col},${tile.row}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  test('色スケールは5段階でテキスト色と同じ長さ', () => {
    expect(SEQUENTIAL_SCALE.length).toBe(5);
    expect(SEQUENTIAL_SCALE_TEXT.length).toBe(5);
  });

  test('bucketIndexOfは常に0〜4の範囲を返す', () => {
    const values = PREFECTURES.map((p) => p.maxScore);
    for (const v of values) {
      const b = bucketIndexOf(v, values);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(4);
    }
  });

  test.each(MAP_METRICS.map((m) => [m.id] as const))(
    'buildMapCells(%s)は47件・全て実データ由来の有限数値を返す（捏造ゼロ）',
    (id) => {
      const cells = buildMapCells(id);
      expect(cells.length).toBe(47);
      for (const cell of cells) {
        expect(Number.isFinite(cell.value)).toBe(true);
        expect(cell.bucket).toBeGreaterThanOrEqual(0);
        expect(cell.bucket).toBeLessThanOrEqual(4);
        expect(cell.formatted.length).toBeGreaterThan(0);
      }
    },
  );

  test('practical-skewの値はprefectures.tsのpracticalMultiplier/coreMultiplierと一致する', () => {
    const cells = buildMapCells('practical-skew');
    for (const p of PREFECTURES) {
      const cell = cells.find((c) => c.code === p.code)!;
      expect(cell.value).toBeCloseTo(p.practicalMultiplier / p.coreMultiplier);
    }
  });

  test('max-scoreの値はprefectures.tsのmaxScoreと完全一致する', () => {
    const cells = buildMapCells('max-score');
    for (const p of PREFECTURES) {
      const cell = cells.find((c) => c.code === p.code)!;
      expect(cell.value).toBe(p.maxScore);
    }
  });

  test('grade3-weightは中3のみ判定の県で100%になる', () => {
    const cells = buildMapCells('grade3-weight');
    const grade3OnlyCodes = PREFECTURES.filter(
      (p) => p.targetGrades.length === 1 && p.targetGrades[0] === 3,
    ).map((p) => p.code);
    expect(grade3OnlyCodes.length).toBeGreaterThan(0);
    for (const code of grade3OnlyCodes) {
      const cell = cells.find((c) => c.code === code)!;
      expect(cell.value).toBe(100);
    }
  });
});
