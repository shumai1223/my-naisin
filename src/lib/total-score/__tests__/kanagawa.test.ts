import { computeKanagawaSValue, kanagawaRankLabel, KANAGAWA_RATIO_OPTIONS, KANAGAWA_S_VALUE_MAX } from '@/lib/total-score/kanagawa';

describe('computeKanagawaSValue（神奈川S1/S2値）', () => {
  it('満点入力（内申135/学力500・4:6標準）はS1=1000', () => {
    const result = computeKanagawaSValue({ naishinRaw: 135, gakuryokuRaw: 500, ratioIndex: 0 });
    expect(result.naishinConverted).toBe(400); // 135/135*100*4
    expect(result.gakuryokuConverted).toBe(600); // 500/500*100*6
    expect(result.s1).toBe(1000);
    expect(result.max).toBe(KANAGAWA_S_VALUE_MAX);
    expect(result.ratio).toBe(KANAGAWA_RATIO_OPTIONS[0]);
  });

  it('特色検査未入力ならS2はS1と同値', () => {
    const result = computeKanagawaSValue({ naishinRaw: 100, gakuryokuRaw: 400 });
    expect(result.s2).toBe(result.s1);
  });

  it('特色検査入力ありならS2=S1+特色検査×5', () => {
    const result = computeKanagawaSValue({ naishinRaw: 100, gakuryokuRaw: 400, tokushokuRaw: 70 });
    expect(result.s2).toBe(result.s1 + 350);
  });

  it('ratioIndex未指定は既定0（4:6標準）を使う', () => {
    const withIndex = computeKanagawaSValue({ naishinRaw: 100, gakuryokuRaw: 300, ratioIndex: 0 });
    const withoutIndex = computeKanagawaSValue({ naishinRaw: 100, gakuryokuRaw: 300 });
    expect(withoutIndex.s1).toBe(withIndex.s1);
  });

  it('比率オプション7:3（内申最重視）でも合計計算が成立する', () => {
    const idx = KANAGAWA_RATIO_OPTIONS.findIndex((o) => o.label.includes('7:3'));
    const result = computeKanagawaSValue({ naishinRaw: 135, gakuryokuRaw: 500, ratioIndex: idx });
    expect(result.s1).toBe(1000);
  });

  it('満点を大幅に超える入力は満点にクランプされ、S1が異常値にならない', () => {
    const result = computeKanagawaSValue({ naishinRaw: 1e30, gakuryokuRaw: 1e30, tokushokuRaw: 1e30 });
    expect(result.s1).toBe(1000);
    expect(result.s2).toBe(1500); // 1000 + 100(クランプ後の特色検査)×5
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeKanagawaSValue({ naishinRaw: -100, gakuryokuRaw: -500 });
    expect(result.s1).toBe(0);
  });
});

describe('kanagawaRankLabel（学校別ボーダー断定なしの帯ラベル）', () => {
  it('900以上は最難関校レベル', () => {
    expect(kanagawaRankLabel(900)).toContain('最難関校レベル');
  });

  it('0は基礎を固める段階', () => {
    expect(kanagawaRankLabel(0)).toBe('基礎を固める段階');
  });
});
