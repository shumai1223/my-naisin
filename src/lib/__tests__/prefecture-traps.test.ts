import { generateDynamicTraps } from '../prefecture-traps';
import { PREFECTURES } from '../prefectures';

function pref(code: string) {
  const p = PREFECTURES.find((x) => x.code === code);
  if (!p) throw new Error(`prefecture not found: ${code}`);
  return p;
}

describe('generateDynamicTraps', () => {
  // 2026-08-01: 外部の教育系ブロガーからのフィードバックを受けて追加した鹿児島県固有の注意点。
  // 「実技教科×20倍」という配点上の傾斜だけを見て「実技を優先すればよい」と誤読させないための
  // 明示的な注記（実際の選抜運用は学力検査重視との指摘があることを併記する）。
  test('鹿児島県は配点上の実技傾斜と実選抜運用の乖離に関する注意点を含む', () => {
    const traps = generateDynamicTraps(pref('kagoshima'));
    const trap = traps.find((t) => t.title === '配点上の実技傾斜と実際の選抜運用は一致しないとの指摘がある');
    expect(trap).toBeDefined();
    expect(trap?.description).toContain('教育委員会の公式見解ではなく');
  });

  test('鹿児島県固有の注意点は他県には出ない（誤って全県共通化しない）', () => {
    for (const code of ['tokyo', 'kanagawa', 'osaka', 'ehime']) {
      const traps = generateDynamicTraps(pref(code));
      expect(traps.some((t) => t.title === '配点上の実技傾斜と実際の選抜運用は一致しないとの指摘がある')).toBe(false);
    }
  });

  test('実技教科の傾斜配点(practicalMultiplier>coreMultiplier)の県は「実技教科が傾斜配点」トラップを含む', () => {
    const traps = generateDynamicTraps(pref('tokyo'));
    expect(traps.some((t) => t.title === '実技教科が傾斜配点')).toBe(true);
  });

  test('全ての生成トラップはtitle/description/impact/solutionを持つ(空文字なし)', () => {
    for (const p of PREFECTURES) {
      const traps = generateDynamicTraps(p);
      for (const t of traps) {
        expect(t.title.length).toBeGreaterThan(0);
        expect(t.description.length).toBeGreaterThan(0);
        expect(t.solution.length).toBeGreaterThan(0);
        expect(['high', 'medium', 'low']).toContain(t.impact);
      }
    }
  });
});
