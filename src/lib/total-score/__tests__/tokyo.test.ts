import { computeTokyoTotalScore, tokyoRankLabel, TOKYO_ESAT_GRADES, TOKYO_TOTAL_SCORE_MAX } from '@/lib/total-score/tokyo';

describe('computeTokyoTotalScore（東京都：学力700+調査書300+ESAT-J20=1020点満点）', () => {
  it('満点入力（学力500/調査書65/ESAT-J A）は1020点', () => {
    const result = computeTokyoTotalScore({ academicRaw: 500, naishinRaw: 65, esatGrade: 'A' });
    expect(result.academicConverted).toBe(700);
    expect(result.naishinConverted).toBe(300);
    expect(result.esatScore).toBe(20);
    expect(result.total).toBe(1020);
    expect(result.max).toBe(TOKYO_TOTAL_SCORE_MAX);
    expect(result.percent).toBe(100);
  });

  it('0点入力は0点', () => {
    const result = computeTokyoTotalScore({ academicRaw: 0, naishinRaw: 0, esatGrade: 'F' });
    expect(result.total).toBe(0);
  });

  it('未知のesatGradeは加点0扱い', () => {
    const result = computeTokyoTotalScore({ academicRaw: 500, naishinRaw: 65, esatGrade: '不明' });
    expect(result.esatScore).toBe(0);
  });

  it('TOKYO_ESAT_GRADES全段階のスコアが仕様通り', () => {
    const byGrade = Object.fromEntries(TOKYO_ESAT_GRADES.map((g) => [g.grade, g.score]));
    expect(byGrade.A).toBe(20);
    expect(byGrade.B).toBe(16);
    expect(byGrade.C).toBe(12);
    expect(byGrade.D).toBe(8);
    expect(byGrade.E).toBe(4);
    expect(byGrade.F).toBe(0);
  });
});

describe('tokyoRankLabel（学校別ボーダー断定なしの帯ラベル）', () => {
  it('880点以上は最難関校レベル', () => {
    expect(tokyoRankLabel(880)).toContain('最難関校レベル');
  });

  it('0点は基礎を固める段階', () => {
    expect(tokyoRankLabel(0)).toBe('基礎を固める段階');
  });
});
