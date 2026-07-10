import { computeOsakaTotalScore, osakaRankLabel, OSAKA_TYPE_OPTIONS, OSAKA_TOTAL_SCORE_MAX } from '@/lib/total-score/osaka';

describe('computeOsakaTotalScore（大阪府：学力450+内申450をタイプ別比率で加重合算・450点満点）', () => {
  it('満点入力（学力450/内申450・タイプⅢ 5:5標準）は450点', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 450, gakuryokuRaw: 450, typeIndex: 2 });
    expect(result.gakuryokuScore).toBe(225);
    expect(result.naishinScore).toBe(225);
    expect(result.total).toBe(450);
    expect(result.max).toBe(OSAKA_TOTAL_SCORE_MAX);
    expect(result.percent).toBe(100);
  });

  it('typeIndex未指定は既定2（タイプⅢ 5:5）を使う', () => {
    const withIndex = computeOsakaTotalScore({ naishinRaw: 300, gakuryokuRaw: 300, typeIndex: 2 });
    const withoutIndex = computeOsakaTotalScore({ naishinRaw: 300, gakuryokuRaw: 300 });
    expect(withoutIndex.total).toBe(withIndex.total);
  });

  it('タイプⅠ（7:3学力最重視）は学力の寄与が大きい', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 0, gakuryokuRaw: 450, typeIndex: 0 });
    expect(result.gakuryokuScore).toBe(315); // 450*0.7
    expect(result.total).toBe(315);
  });

  it('0点入力は0点', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 0, gakuryokuRaw: 0 });
    expect(result.total).toBe(0);
  });

  it('OSAKA_TYPE_OPTIONSは5タイプ・比率の合計が常に1', () => {
    expect(OSAKA_TYPE_OPTIONS).toHaveLength(5);
    for (const t of OSAKA_TYPE_OPTIONS) {
      expect(t.gakuryoku + t.naishin).toBeCloseTo(1, 5);
    }
  });
});

describe('osakaRankLabel（学校別ボーダー断定なしの帯ラベル）', () => {
  it('380点以上は最難関校レベル', () => {
    expect(osakaRankLabel(380)).toContain('最難関校レベル');
  });

  it('0点は基礎を固める段階', () => {
    expect(osakaRankLabel(0)).toBe('基礎を固める段階');
  });
});
