/**
 * 逆算ツール用の比率プリセットデータ(RATIO_PRESETS)の不変条件テスト。
 * 純粋な静的データファイルのため計算ロジックは無いが、各プリセットの
 * naishin(内申点)/gakuryoku(学力検査)/tokushoku(特色検査)の配分比率は
 * 「合計10」という暗黙の前提で書かれている(3:7, 4:6等)。この前提が
 * 手書きデータのタイポで崩れても検知する不変条件が無かったため追加する。
 */
import { RATIO_PRESETS, type RatioPreset } from '../presets';

describe('RATIO_PRESETS 不変条件', () => {
  const allPresets: Array<{ prefecture: string; preset: RatioPreset }> = Object.entries(RATIO_PRESETS).flatMap(
    ([prefecture, presets]) => presets.map((preset) => ({ prefecture, preset }))
  );

  it('少なくとも1都道府県以上のデータを持つ', () => {
    expect(Object.keys(RATIO_PRESETS).length).toBeGreaterThan(0);
  });

  it.each(allPresets.map(({ prefecture, preset }) => [`${prefecture}: ${preset.name}`, prefecture, preset] as const))(
    '%s の比率(naishin+gakuryoku[+tokushoku])は合計10になる',
    (_label, _prefecture, preset) => {
      const { naishin, gakuryoku, tokushoku } = preset.ratio;
      const total = naishin + gakuryoku + (tokushoku ?? 0);
      expect(total).toBe(10);
    }
  );

  it.each(allPresets.map(({ prefecture, preset }) => [`${prefecture}: ${preset.name}`, preset] as const))(
    '%s の比率成分は全て非負の数値', (_label, preset) => {
      expect(preset.ratio.naishin).toBeGreaterThanOrEqual(0);
      expect(preset.ratio.gakuryoku).toBeGreaterThanOrEqual(0);
      if (preset.ratio.tokushoku !== undefined) {
        expect(preset.ratio.tokushoku).toBeGreaterThanOrEqual(0);
      }
    }
  );

  it.each(allPresets.map(({ prefecture, preset }) => [`${prefecture}: ${preset.name}`, preset] as const))(
    '%s は name/description/note が全て空文字でない', (_label, preset) => {
      expect(preset.name.trim().length).toBeGreaterThan(0);
      expect(preset.description.trim().length).toBeGreaterThan(0);
      expect(preset.note.trim().length).toBeGreaterThan(0);
    }
  );

  it('都道府県ごとにプリセット名の重複が無い(同名2件を上書きミスで見落とさない)', () => {
    for (const [prefecture, presets] of Object.entries(RATIO_PRESETS)) {
      const names = presets.map((p) => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
      void prefecture;
    }
  });
});
