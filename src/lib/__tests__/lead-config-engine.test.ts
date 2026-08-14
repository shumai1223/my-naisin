// lead-config-engine.ts: 保護者リード「県×面」出し分けエンジンの汎用部分(buildOfferFragment)。
// lead-config.ts(本番の送客オファー割当)から呼ばれる唯一の関数で、プリセット未登録時に
// 例外を投げず・copyがpresetを正しく上書きするかは収益に直結するため無テストは見過ごせない。

import { buildOfferFragment, OfferPreset } from '../lead-config-engine';

type Id = 'juku-a' | 'juku-b' | 'juku-unregistered';

const PRESETS: Partial<Record<Id, OfferPreset>> = {
  'juku-a': { note: 'PR', ctaText: '無料相談する' },
  'juku-b': { note: '無料', ctaText: '資料請求する' },
};

describe('buildOfferFragment', () => {
  it('affiliateIdを結果に含める', () => {
    const result = buildOfferFragment('juku-a', PRESETS, { heading: '見出し' });
    expect(result.affiliateId).toBe('juku-a');
  });

  it('登録済みプリセットのnote/ctaTextをそのまま反映する', () => {
    const result = buildOfferFragment('juku-a', PRESETS, { heading: '見出し' });
    expect(result.note).toBe('PR');
    expect(result.ctaText).toBe('無料相談する');
  });

  it('プリセットIDが違えばnote/ctaTextも変わる（割当ミスの検知）', () => {
    const a = buildOfferFragment('juku-a', PRESETS, {});
    const b = buildOfferFragment('juku-b', PRESETS, {});
    expect(a.note).not.toBe(b.note);
    expect(a.ctaText).not.toBe(b.ctaText);
  });

  it('プリセット未登録のIDでも例外を投げず、note/ctaTextはundefinedのまま返す', () => {
    const result = buildOfferFragment('juku-unregistered', PRESETS, { heading: '見出し' });
    expect(result.affiliateId).toBe('juku-unregistered');
    expect(result.note).toBeUndefined();
    expect(result.ctaText).toBeUndefined();
    expect(result.heading).toBe('見出し');
  });

  it('copy側に同名キーがあればプリセットを上書きする（呼び出し側のカスタムコピー優先）', () => {
    const result = buildOfferFragment('juku-a', PRESETS, { note: 'カスタム表記' });
    expect(result.note).toBe('カスタム表記');
    expect(result.ctaText).toBe('無料相談する'); // copyに無いフィールドはプリセットのまま
  });

  it('copyの独自フィールドはそのまま保持される', () => {
    const result = buildOfferFragment('juku-a', PRESETS, { heading: '見出し', body: '本文' });
    expect(result.heading).toBe('見出し');
    expect(result.body).toBe('本文');
  });

  it('copyが空オブジェクトでも壊れない', () => {
    const result = buildOfferFragment('juku-a', PRESETS, {});
    expect(result).toEqual({ affiliateId: 'juku-a', note: 'PR', ctaText: '無料相談する' });
  });
});
