import { computeOsakaTotalScore, osakaRankLabel, OSAKA_TYPE_OPTIONS, OSAKA_TOTAL_SCORE_MAX } from '@/lib/total-score/osaka';

describe('computeOsakaTotalScore（大阪府：学力450+内申450をタイプ別倍率で加重合算・900点満点）', () => {
  it('満点入力（学力450/内申450・タイプⅢ 5:5標準）は900点', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 450, gakuryokuRaw: 450, typeIndex: 2 });
    expect(result.gakuryokuScore).toBe(450);
    expect(result.naishinScore).toBe(450);
    expect(result.total).toBe(900);
    expect(result.max).toBe(OSAKA_TOTAL_SCORE_MAX);
    expect(result.percent).toBe(100);
  });

  it('typeIndex未指定は既定2（タイプⅢ 5:5）を使う', () => {
    const withIndex = computeOsakaTotalScore({ naishinRaw: 300, gakuryokuRaw: 300, typeIndex: 2 });
    const withoutIndex = computeOsakaTotalScore({ naishinRaw: 300, gakuryokuRaw: 300 });
    expect(withoutIndex.total).toBe(withIndex.total);
  });

  it('タイプⅠ（学力1.4倍/内申0.6倍）は学力の寄与が大きい', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 0, gakuryokuRaw: 450, typeIndex: 0 });
    expect(result.gakuryokuScore).toBe(630); // 450*1.4
    expect(result.total).toBe(630);
  });

  it('学力検査350点・調査書400点・タイプⅠは730点（公表計算例と一致）', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 400, gakuryokuRaw: 350, typeIndex: 0 });
    expect(result.total).toBe(730); // (350*1.4)+(400*0.6)=730
  });

  it('0点入力は0点', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 0, gakuryokuRaw: 0 });
    expect(result.total).toBe(0);
  });

  it('OSAKA_TYPE_OPTIONSは5タイプ・倍率の合計が常に2', () => {
    expect(OSAKA_TYPE_OPTIONS).toHaveLength(5);
    for (const t of OSAKA_TYPE_OPTIONS) {
      expect(t.gakuryoku + t.naishin).toBeCloseTo(2, 5);
    }
  });

  it('満点を大幅に超える入力は満点(900点)にクランプされる', () => {
    const result = computeOsakaTotalScore({ naishinRaw: 1e30, gakuryokuRaw: 1e30, typeIndex: 2 });
    expect(result.total).toBe(900);
    expect(result.percent).toBe(100);
  });

  it('負の入力は0にクランプされる', () => {
    const result = computeOsakaTotalScore({ naishinRaw: -450, gakuryokuRaw: -450 });
    expect(result.total).toBe(0);
  });
});

describe('osakaRankLabel（学校別ボーダー断定なしの帯ラベル・900点満点スケール）', () => {
  it('760点以上は最難関校レベル', () => {
    expect(osakaRankLabel(760)).toContain('最難関校レベル');
  });

  it('0点は基礎を固める段階', () => {
    expect(osakaRankLabel(0)).toBe('基礎を固める段階');
  });
});
