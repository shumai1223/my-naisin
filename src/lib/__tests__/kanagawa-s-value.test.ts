import { calcS1, requiredExamForS1, KANAGAWA_NAISHIN_MAX, KANAGAWA_EXAM_MAX } from '../kanagawa-s-value';

describe('kanagawa-s-value（S1値・出典: 神奈川県教育委員会 入学者選抜情報）', () => {
  test('満点: A=135, B=500, f:g=5:5 → S1=1000', () => {
    expect(calcS1({ naishinTotal: 135, examTotal: 500, naishinRatio: 50 })).toBe(1000);
  });

  test('ゼロ: A=0, B=0, f:g=5:5 → S1=0', () => {
    expect(calcS1({ naishinTotal: 0, examTotal: 0, naishinRatio: 50 })).toBe(0);
  });

  test('逆算・満点: 目標S1=1000, A=135, f:g=5:5 → 必要B=500', () => {
    const result = requiredExamForS1({ targetS1: 1000, naishinTotal: 135, naishinRatio: 50 });
    expect(result.requiredExamScore).toBe(500);
    expect(result.isAchievable).toBe(true);
  });

  test('逆算・実例: 目標S1=700, A=100, f:g=4:6 → 必要B=336', () => {
    // a = 100/135×100 = 74.0740...
    // b = (700 − 74.0740×4) / 6 = 67.2839...
    // B = 67.2839 × 5 = 336.419... → 四捨五入で336
    const result = requiredExamForS1({ targetS1: 700, naishinTotal: 100, naishinRatio: 40 });
    expect(result.requiredExamScore).toBe(336);
    expect(result.isAchievable).toBe(true);
  });

  test('到達不能: 目標S1=1000, A=0, f:g=5:5 → 必要B=1000で500点満点を超え、isAchievableがfalse', () => {
    const result = requiredExamForS1({ targetS1: 1000, naishinTotal: 0, naishinRatio: 50 });
    expect(result.requiredExamScore).toBe(1000);
    expect(result.isAchievable).toBe(false);
  });

  test('順算と逆算が往復で一致する（S1を出す→同じS1を目標に逆算すると元のBが返る）', () => {
    const naishinTotal = 54;
    const examTotal = 250;
    const naishinRatio = 40; // 4:6
    const s1 = calcS1({ naishinTotal, examTotal, naishinRatio });
    const result = requiredExamForS1({ targetS1: s1, naishinTotal, naishinRatio });
    expect(result.requiredExamScore).toBe(examTotal);
  });

  test('満点の定数がサイト公表値と一致する（内申135点・学力検査500点）', () => {
    expect(KANAGAWA_NAISHIN_MAX).toBe(135);
    expect(KANAGAWA_EXAM_MAX).toBe(500);
  });
});
