import { computeAichiTotalScore, AICHI_METHODS } from '@/lib/total-score/aichi';

describe('computeAichiTotalScore（愛知県：評定得点(評定合計×2)+学力検査点を評価方法別倍率で合算）', () => {
  it('評価方法Ⅰ（等倍標準）で満点入力は満点200点', () => {
    const result = computeAichiTotalScore({ naishinSumRaw: 45, gakuryokuRaw: 110, methodIndex: 0 });
    expect(result.hyoteitokuten).toBe(90);
    expect(result.total).toBe(200);
    expect(result.max).toBe(200);
  });

  it('methodIndex未指定は既定0（評価方法Ⅰ）を使う', () => {
    const withIndex = computeAichiTotalScore({ naishinSumRaw: 30, gakuryokuRaw: 80, methodIndex: 0 });
    const withoutIndex = computeAichiTotalScore({ naishinSumRaw: 30, gakuryokuRaw: 80 });
    expect(withoutIndex.total).toBe(withIndex.total);
  });

  it('評価方法Ⅳ（内申最重視・評定得点×2）で満点入力は満点290点', () => {
    const result = computeAichiTotalScore({ naishinSumRaw: 45, gakuryokuRaw: 110, methodIndex: 3 });
    expect(result.total).toBe(290); // 90*2 + 110*1
    expect(result.max).toBe(290);
  });

  it('0点入力は0点', () => {
    const result = computeAichiTotalScore({ naishinSumRaw: 0, gakuryokuRaw: 0 });
    expect(result.total).toBe(0);
  });

  it('AICHI_METHODSは5方式', () => {
    expect(AICHI_METHODS).toHaveLength(5);
    expect(AICHI_METHODS.map((m) => m.type)).toEqual(['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ']);
  });

  it('満点を大幅に超える入力は満点にクランプされる', () => {
    const result = computeAichiTotalScore({ naishinSumRaw: 1e30, gakuryokuRaw: 1e30, methodIndex: 0 });
    expect(result.total).toBe(200);
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeAichiTotalScore({ naishinSumRaw: -45, gakuryokuRaw: -110 });
    expect(result.total).toBe(0);
  });
});
